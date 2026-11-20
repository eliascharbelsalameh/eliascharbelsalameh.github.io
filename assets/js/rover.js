/* =============================================================================
   The hero's rover: a small robot that lives behind the hero and drives to
   wherever the visitor points (or taps, on touch screens).

   - It navigates like a real mobile robot, in two layers. A global planner
     (A* on an occupancy grid, shortened to the corners that matter) finds a
     way round the obstacles: the dashed line. A sampling model-predictive
     controller tracks it: every frame it tries a fan of (speed, turn rate)
     commands its motors can reach, predicts each over a short horizon,
     drops those that would hit something, and drives the one that best
     follows a reference moving along the plan (full speed, slower into
     corners, braking onto the goal). The fan is drawn faintly, the chosen
     prediction as dots. A docking controller takes the last few px, and if
     it makes no progress it backs off and replans once before giving up.
   - It maps the room as it goes (lidar SLAM, simplified): a ring of rays is
     cast from it, and every hit becomes a point of the map, which builds up
     into the outlines of the obstacles hidden in the hero. The player card is
     one of them: the rover drives around it and the lidar traces its edges.
   - Nothing moves on its own for long (WCAG 2.2.2): on page load it drives
     once across the hero (about 3 seconds) and parks; after that it only
     moves when the visitor points somewhere, and stops when it gets there
     (or gives up after a few seconds without progress). The loop stops too.
   - Reduced motion: no driving; a still frame of a map already scanned.
   - Off screen, in a background tab or printing: nothing runs or shows.

   It is decoration (the canvas is aria-hidden) and reads nothing from data.js.
   index.html holds the <canvas id="hero-fx">; styles.css "Hero rover".
   ============================================================================= */
(function () {
  "use strict";
  var hero = document.querySelector(".hero"), canvas = document.getElementById("hero-fx");
  if (!hero || !canvas || !canvas.getContext || !window.requestAnimationFrame) return;
  if (/bot|crawl|spider|slurp|preview|lighthouse|pagespeed|headless/i.test(navigator.userAgent || "")) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;
  var root = document.documentElement;
  function reduce() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  var FINE = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);

  /* ------------------------------ world ---------------------------------- */
  var W = 0, H = 0, DPR = 1;
  var R = 9;                       // rover radius, px (for collisions)
  var BERTH = 12;                  // extra room the global planner leaves around obstacles, px
  var shapes = [];                 // hidden obstacles, normalised to the hero box: {t:"r",x,y,w,h} | {t:"c",x,y,r}
  var px = [];                     // the same, in px (rebuilt on resize) + the player card
  var map = { x: [], y: [], t: [], seen: {} };   // lidar points (normalised), when each was found
  var MAXP = 4200, CELL = 3;

  // a fixed seed: the same room on every visit at a given width
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  /* an element's layout box in the hero (offsets, so the card's flip and
     tilt, which are transforms, don't move it) */
  function box(el) {
    if (!el || el.hidden || !el.offsetWidth) return null;
    var x = 0, y = 0, e = el;
    while (e && e !== hero) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return e === hero ? { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight } : null;
  }
  function cardBox() {
    var b = box(document.getElementById("player-card"));
    return b ? { t: "r", x: b.x, y: b.y, w: b.w, h: b.h, card: true } : null;
  }
  /* the places the rover starts and parks (kept clear of obstacles) */
  function anchors() {
    var text = box(hero.querySelector(".hero-text")), card = cardBox();
    var start = { x: R + 10, y: H * 0.56 }, rest;
    if (text && card && card.x > text.x + text.w + 20) {
      // in the gap between the text and the card, level with the card's middle
      rest = { x: (text.x + text.w + card.x) / 2, y: card.y + card.h * 0.52 };
    } else {
      var lb = box(hero.querySelector(".hero-loc")) || box(hero.querySelector(".hero-role"));
      rest = { x: W - 28, y: lb ? lb.y + lb.h / 2 : H * 0.2 };
    }
    var via = { x: W * 0.3, y: H - 26 };   // (only used to scan the still frame under reduced motion)
    return { start: start, via: via, rest: rest };
  }
  function buildWorld() {
    var rand = rng(1907), A = anchors(), card = cardBox(), out = [], tries = 0;
    var n = Math.max(5, Math.min(12, Math.round(W * H / 52000)));
    function clearOf(s, p, m) { return sdf(s, p.x, p.y) > m; }
    while (out.length < n && tries++ < 400) {
      var k = rand(), s;
      if (k < 0.18) {          // a thin wall
        var horiz = rand() < 0.6, len = 110 + rand() * 130;
        s = { t: "r", x: rand() * W, y: rand() * H, w: horiz ? len : 8, h: horiz ? 8 : len * 0.6 };
      } else if (k < 0.62) {   // a box
        s = { t: "r", x: rand() * W, y: rand() * H, w: 34 + rand() * 80, h: 24 + rand() * 54 };
      } else {                 // a pillar
        s = { t: "c", x: rand() * W, y: rand() * H, r: 12 + rand() * 20 };
      }
      if (!inside(s, 34)) continue;
      // room to drive between any two, and around the start, the lap and the parking spot
      var ok = clearOf(s, A.start, 60) && clearOf(s, A.via, 50) && clearOf(s, A.rest, 46);
      for (var i = 0; ok && i < out.length; i++) ok = gap(s, out[i]) > 2 * (R + BERTH) + 8;
      if (ok && card) ok = gap(s, card) > 2 * (R + BERTH) + 12;
      if (ok) out.push(s);
    }
    shapes = out.map(function (s) {
      return s.t === "r" ? { t: "r", x: s.x / W, y: s.y / H, w: s.w / W, h: s.h / H }
                         : { t: "c", x: s.x / W, y: s.y / H, r: s.r / Math.sqrt(W * H) };
    });
    map = { x: [], y: [], t: [], seen: {} };
    toPx();
  }
  function inside(s, m) {
    return s.t === "r" ? s.x > m && s.y > m && s.x + s.w < W - m && s.y + s.h < H - m
                       : s.x - s.r > m && s.y - s.r > m && s.x + s.r < W - m && s.y + s.r < H - m;
  }
  /* rough gap between two shapes (their bounding boxes; enough to keep lanes open) */
  function gap(a, b) {
    function bb(s) { return s.t === "r" ? [s.x, s.y, s.x + s.w, s.y + s.h] : [s.x - s.r, s.y - s.r, s.x + s.r, s.y + s.r]; }
    var p = bb(a), q = bb(b);
    var dx = Math.max(q[0] - p[2], p[0] - q[2], 0), dy = Math.max(q[1] - p[3], p[1] - q[3], 0);
    return Math.max(dx, dy);
  }
  function toPx() {
    px = shapes.map(function (s) {
      return s.t === "r" ? { t: "r", x: s.x * W, y: s.y * H, w: s.w * W, h: s.h * H }
                         : { t: "c", x: s.x * W, y: s.y * H, r: s.r * Math.sqrt(W * H) };
    });
    var card = cardBox();
    if (card) px.push(card);
    buildGrid();
  }
  /* signed distance from a point to one shape (negative inside) */
  function sdf(s, x, y) {
    if (s.t === "c") return Math.sqrt((x - s.x) * (x - s.x) + (y - s.y) * (y - s.y)) - s.r;
    var dx = Math.max(s.x - x, 0, x - s.x - s.w), dy = Math.max(s.y - y, 0, y - s.y - s.h);
    if (dx === 0 && dy === 0) return -Math.min(x - s.x, s.x + s.w - x, y - s.y, s.y + s.h - y);
    return Math.sqrt(dx * dx + dy * dy);
  }
  /* clearance: the distance to the nearest obstacle or edge of the hero */
  function clearance(x, y) {
    var d = Math.min(x, W - x, y, H - y);
    for (var i = 0; i < px.length; i++) { var s = sdf(px[i], x, y); if (s < d) d = s; }
    return d;
  }
  /* one lidar ray: how far it travels before it hits something (or max) */
  function cast(x, y, dx, dy, max) {
    var t = max, i, s, a, b;
    if (dx > 1e-6) t = Math.min(t, (W - x) / dx); else if (dx < -1e-6) t = Math.min(t, -x / dx);
    if (dy > 1e-6) t = Math.min(t, (H - y) / dy); else if (dy < -1e-6) t = Math.min(t, -y / dy);
    for (i = 0; i < px.length; i++) {
      s = px[i];
      if (s.t === "c") {
        var ox = x - s.x, oy = y - s.y, bb = ox * dx + oy * dy, cc = ox * ox + oy * oy - s.r * s.r, disc = bb * bb - cc;
        if (disc >= 0) { a = -bb - Math.sqrt(disc); if (a > 0 && a < t) t = a; }
      } else {
        var t0 = -Infinity, t1 = Infinity;
        if (Math.abs(dx) < 1e-9) { if (x < s.x || x > s.x + s.w) continue; }
        else { a = (s.x - x) / dx; b = (s.x + s.w - x) / dx; t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b)); }
        if (Math.abs(dy) < 1e-9) { if (y < s.y || y > s.y + s.h) continue; }
        else { a = (s.y - y) / dy; b = (s.y + s.h - y) / dy; t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b)); }
        if (t1 >= t0 && t0 > 0 && t0 < t) t = t0;
      }
    }
    return t;
  }
  /* where a goal may sit: inside the hero and outside every obstacle */
  function freeSpot(x, y) {
    x = Math.max(R + 6, Math.min(W - R - 6, x));
    y = Math.max(R + 6, Math.min(H - R - 6, y));
    for (var pass = 0; pass < 3; pass++) {
      for (var i = 0; i < px.length; i++) {
        var s = px[i], d = sdf(s, x, y), need = R + 6;
        if (d >= need) continue;
        if (s.t === "c") {
          var a = Math.atan2(y - s.y, x - s.x);
          x = s.x + Math.cos(a) * (s.r + need); y = s.y + Math.sin(a) * (s.r + need);
        } else {   // out through the nearest side
          var l = x - s.x, r = s.x + s.w - x, t = y - s.y, b = s.y + s.h - y, m = Math.min(l, r, t, b);
          if (m === l) x = s.x - need; else if (m === r) x = s.x + s.w + need;
          else if (m === t) y = s.y - need; else y = s.y + s.h + need;
        }
      }
      x = Math.max(R + 6, Math.min(W - R - 6, x));
      y = Math.max(R + 6, Math.min(H - R - 6, y));
    }
    return { x: x, y: y };
  }

  /* ------------------------------ the rover ------------------------------- */
  var bot = { x: 0, y: 0, th: 0, v: 0, w: 0 };
  var goal = null, route = [];     // the goal, and waypoints still to visit before it
  var parked = true, fade = 0, best = 0, best0 = 0, stuckT = 0;
  var trail = [], rolls = [], hits = [], valid = 0, scanRot = 0;
  var NV = 5, NW = 11, HORIZON = 1.1, STEPS = 11;
  var LAG = 9, MARGIN = 3;         // motor response (1/s); clearance the controller keeps beyond the radius, px
  function limits() {
    var vmax = Math.max(150, Math.min(300, W * 0.24));
    return { vmax: vmax, vrev: -55, wmax: 3.4, acc: vmax * 2.4, wacc: 12 };
  }
  /* The controller, a sampling MPC: the reference is a point moving along the
     planned path at the speed the rover should have there (full speed, then
     braking to stop on the goal); every frame it tries a fan of (speed, turn
     rate) commands within what the motors can reach, predicts each over the
     horizon (with the motors' lag), drops those that would hit something,
     and drives the one that tracks the reference best. */
  function reference(pts) {
    var L = limits(), h = HORIZON / STEPS, dec = L.acc * 0.5, segs = [], cum = [0], total = 0, i;
    for (i = 1; i < pts.length; i++) { var d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); segs.push(d); total += d; cum.push(total); }
    // the speed profile: slower into sharper corners (two wheels can't turn
    // tightly at speed), braking in time for each, and to a stop on the goal
    var caps = [];
    for (i = 1; i < pts.length - 1; i++) {
      var t = Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x) - Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x);
      t = Math.abs(Math.atan2(Math.sin(t), Math.cos(t)));
      caps.push({ s: cum[i], v: Math.max(70, L.vmax * Math.pow(1 - t / Math.PI, 2)) });
    }
    caps.push({ s: total, v: 0 });
    function speed(s) {
      var v = L.vmax;
      for (var c = 0; c < caps.length; c++) if (caps[c].s >= s) v = Math.min(v, Math.sqrt(caps[c].v * caps[c].v + 2 * dec * (caps[c].s - s)));
      return v;
    }
    // a point of the path, with the path's direction there
    function at(s) {
      var j = 0;
      for (; j < segs.length; j++) {
        if (s <= segs[j] && segs[j] > 0) break;
        if (j < segs.length - 1) s -= segs[j];
      }
      j = Math.min(j, segs.length - 1);
      var a = pts[j], b = pts[j + 1], f = segs[j] > 0 ? Math.min(1, s / segs[j]) : 1;
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, a: Math.atan2(b.y - a.y, b.x - a.x) };
    }
    var out = [], s = 0;
    for (var k = 0; k < STEPS; k++) {
      s = Math.min(total, s + speed(s) * h);
      out.push(at(s));
    }
    return out;
  }
  function plan(ref) {
    var L = limits(), P = 0.2, h = HORIZON / STEPS, h2 = h / 2, lag2 = 1 - Math.exp(-LAG * h2);
    // paths keep a small margin; squeezed closer than that (a corner, a
    // resize), any path that doesn't get closer still counts, and it may back
    // out. Otherwise it only drives forward: over a short horizon, reversing
    // would always look better than turning round, and it would never turn
    var c0 = clearance(bot.x, bot.y), floor = Math.min(R + MARGIN, c0);
    var vLo = Math.max(c0 < R + MARGIN + 2 ? L.vrev : 0, bot.v - L.acc * P), vHi = Math.min(L.vmax, bot.v + L.acc * P);
    var wLo = Math.max(-L.wmax, bot.w - L.wacc * P), wHi = Math.min(L.wmax, bot.w + L.wacc * P);
    // the room it likes to keep from walls, less where the goal itself is close to one
    var end = ref[STEPS - 1], room = Math.min(R + 18, clearance(end.x, end.y) - 1);
    var far = Math.hypot(goal.x - bot.x, goal.y - bot.y) > 30;   // (on the goal, which way it faces doesn't matter)
    var bestCost = Infinity, pick = null;
    rolls.length = 0; valid = 0;
    for (var i = 0; i < NV; i++) {
      var vc = vLo + (vHi - vLo) * i / (NV - 1);
      for (var j = 0; j < NW; j++) {
        var wc = wLo + (wHi - wLo) * j / (NW - 1);
        var x = bot.x, y = bot.y, th = bot.th, vv = bot.v, ww = bot.w, pts = [], ok = true, cost = 0;
        for (var k = 0; k < STEPS && ok; k++) {
          // the motors take a moment to reach the command: predicted as they
          // behave, in half steps so a fast path can't clip a corner unseen
          var c = Infinity;
          for (var sub = 0; sub < 2; sub++) {
            vv += (vc - vv) * lag2; ww += (wc - ww) * lag2;
            th += ww * h2; x += vv * Math.cos(th) * h2; y += vv * Math.sin(th) * h2;
            c = Math.min(c, clearance(x, y));
          }
          if (c < floor) { ok = false; break; }
          var ex = x - ref[k].x, ey = y - ref[k].y;
          cost += (ex * ex + ey * ey) * (k === STEPS - 1 ? 3 : 1);
          if (c < room) cost += (room - c) * (room - c) * 8;
          pts.push(x, y);
        }
        var roll = { pts: pts, ok: ok };
        rolls.push(roll);
        if (!ok) continue;
        valid++;
        // tracking error; facing where the reference is headed (or turning on
        // the spot would never look worth it); no needless weaving
        cost = cost / (STEPS + 2) + 10 * wc * wc;
        if (far) cost += 900 * (1 - Math.cos(end.a - th));
        if (cost < bestCost) { bestCost = cost; pick = { v: vc, w: wc, roll: roll }; }
      }
    }
    if (pick) { pick.roll.best = true; return pick; }
    // boxed in: stop and turn on the spot toward the reference
    var turn = Math.atan2(ref[STEPS - 1].y - bot.y, ref[STEPS - 1].x - bot.x) - bot.th;
    return { v: 0, w: Math.sin(turn) >= 0 ? L.wmax * 0.5 : -L.wmax * 0.5, roll: null };
  }
  function scan(now) {
    var n = W < 700 ? 56 : 84, max = Math.max(150, Math.min(240, W * 0.2));
    hits.length = 0;
    scanRot = (scanRot + 0.37) % (Math.PI * 2);
    for (var i = 0; i < n; i++) {
      var a = scanRot + i / n * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a);
      var t = cast(bot.x, bot.y, dx, dy, max);
      var hx = bot.x + dx * t, hy = bot.y + dy * t, hit = t < max - 0.5;
      hits.push(hx, hy, hit ? 1 : 0);
      if (!hit || map.x.length >= MAXP) continue;
      var key = Math.round(hx / CELL) + "," + Math.round(hy / CELL);
      if (map.seen[key]) continue;
      map.seen[key] = 1;
      map.x.push(hx / W); map.y.push(hy / H); map.t.push(now);
    }
  }
  /* The global planner: A* over an occupancy grid of the hero (obstacles
     grown by the rover's radius), shortened to the corners that matter
     (string pulling). The controller above then tracks those waypoints, so
     it never sits facing a box it can't see round: the usual split between a
     global and a local planner on a real robot. */
  var GRID = 12, cols = 0, rows = 0, occ = null;
  function buildGrid() {
    cols = Math.ceil(W / GRID); rows = Math.ceil(H / GRID);
    occ = new Uint8Array(cols * rows);
    for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++)
      occ[j * cols + i] = clearance((i + 0.5) * GRID, (j + 0.5) * GRID) < R + BERTH ? 1 : 0;
  }
  function cellOf(x, y) {
    return Math.max(0, Math.min(rows - 1, Math.floor(y / GRID))) * cols + Math.max(0, Math.min(cols - 1, Math.floor(x / GRID)));
  }
  function nearestFree(c) {   // breadth-first, for a start or goal that sits in a grown obstacle
    if (!occ[c]) return c;
    var seen = new Uint8Array(cols * rows), q = [c], k = 0;
    seen[c] = 1;
    while (k < q.length) {
      var u = q[k++], ux = u % cols, uy = (u - ux) / cols;
      for (var d = 0; d < 4; d++) {
        var vx = ux + (d === 0) - (d === 1), vy = uy + (d === 2) - (d === 3);
        if (vx < 0 || vy < 0 || vx >= cols || vy >= rows) continue;
        var v = vy * cols + vx;
        if (seen[v]) continue;
        if (!occ[v]) return v;
        seen[v] = 1; q.push(v);
      }
    }
    return -1;
  }
  function astar(a, b) {
    var s = nearestFree(cellOf(a.x, a.y)), g = nearestFree(cellOf(b.x, b.y));
    if (s < 0 || g < 0) return null;
    var n = cols * rows, gs = new Float32Array(n), from = new Int32Array(n), shut = new Uint8Array(n);
    gs.fill(Infinity); from.fill(-1);
    var gx = g % cols, gy = (g - gx) / cols, heap = [], hf = [];
    function hcost(c) { var x = Math.abs(c % cols - gx), y = Math.abs((c - c % cols) / cols - gy); return x + y + (Math.SQRT2 - 2) * Math.min(x, y); }
    function push(c, f) {   // a small binary heap on f
      var i = heap.length; heap.push(c); hf.push(f);
      while (i > 0) { var p = (i - 1) >> 1; if (hf[p] <= f) break; heap[i] = heap[p]; hf[i] = hf[p]; i = p; }
      heap[i] = c; hf[i] = f;
    }
    function pop() {
      var top = heap[0], lc = heap.pop(), lf = hf.pop(), i = 0, m = heap.length;
      if (m) {
        while (true) {
          var l = 2 * i + 1, r = l + 1, k = i, kf = lf;
          if (l < m && hf[l] < kf) { k = l; kf = hf[l]; }
          if (r < m && hf[r] < kf) { k = r; kf = hf[r]; }
          if (k === i) break;
          heap[i] = heap[k]; hf[i] = hf[k]; i = k;
        }
        heap[i] = lc; hf[i] = lf;
      }
      return top;
    }
    gs[s] = 0; push(s, hcost(s));
    while (heap.length) {
      var u = pop();
      if (u === g) break;
      if (shut[u]) continue;
      shut[u] = 1;
      var ux = u % cols, uy = (u - ux) / cols;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        var vx = ux + dx, vy = uy + dy;
        if (vx < 0 || vy < 0 || vx >= cols || vy >= rows) continue;
        var v = vy * cols + vx;
        if (occ[v] || shut[v]) continue;
        if (dx && dy && (occ[uy * cols + vx] || occ[vy * cols + ux])) continue;   // no cutting corners
        var ng = gs[u] + (dx && dy ? Math.SQRT2 : 1);
        if (ng < gs[v]) { gs[v] = ng; from[v] = u; push(v, ng + hcost(v)); }
      }
    }
    if (from[g] < 0 && g !== s) return null;
    var path = [];
    for (var c = g; c >= 0; c = from[c]) path.push({ x: (c % cols + 0.5) * GRID, y: (Math.floor(c / cols) + 0.5) * GRID });
    return path.reverse();
  }
  /* a straight run the rover fits along: every grid cell it crosses is free
     (cheap lookups, so the planner can ask often; the first few px are let
     off, since the rover itself may stand close to something) */
  function visible(a, b) {
    var L = Math.hypot(b.x - a.x, b.y - a.y), n = Math.ceil(L / 4);
    for (var i = 1; i <= n; i++) {
      if (L * i / n < 14) continue;
      if (occ[cellOf(a.x + (b.x - a.x) * i / n, a.y + (b.y - a.y) * i / n)]) return false;
    }
    return true;
  }
  /* waypoints from here to the goal (the goal itself not included) */
  function pathTo(g) {
    if (visible(bot, g)) return [];
    var p = astar(bot, g);
    if (!p || p.length < 2) return [];
    var out = [], from = { x: bot.x, y: bot.y }, i = 0;
    while (i < p.length - 1) {
      var j = i + 1;
      while (j + 1 < p.length && visible(from, p[j + 1])) j++;
      if (j >= p.length - 1 && visible(from, g)) break;
      out.push(p[j]); from = p[j]; i = j;
    }
    return out;
  }
  function remaining() {
    var d = 0, a = bot;
    route.concat([goal]).forEach(function (p) { d += Math.hypot(p.x - a.x, p.y - a.y); a = p; });
    return d;
  }
  var replan = false, plannedAt = -1e9, recover = 0, recovered = false;
  function step(dt, now) {
    if (parked) { fade = Math.max(0, fade - dt / 0.6); return; }
    fade = Math.min(1, fade + dt / 0.25);
    // a new goal (at most every 80ms while the pointer moves), and a fresh
    // path twice a second anyway, in case the tracking has drifted
    if ((replan && now - plannedAt > 80) || now - plannedAt > 700) { route = pathTo(goal); replan = false; plannedAt = now; }
    // a waypoint is done when it's reached, or when the next one is already in sight
    while (route.length && (Math.hypot(route[0].x - bot.x, route[0].y - bot.y) < 26 || visible(bot, route[1] || goal))) route.shift();
    var cmd = plan(reference([bot].concat(route, [goal])));
    if (recover > 0) {   // recovery: back off a little, straight, if there's room behind
      recover -= dt;
      var bx = bot.x - Math.cos(bot.th) * 24, by = bot.y - Math.sin(bot.th) * 24;
      cmd = clearance(bx, by) >= R + MARGIN ? { v: -70, w: 0, roll: null } : { v: 0, w: 2, roll: null };
    }
    // the last few px: a docking controller (turn to face the goal, then roll
    // onto it), which a fan of constant commands can't do on two wheels
    var dg = Math.hypot(goal.x - bot.x, goal.y - bot.y);
    if (!route.length && dg < 44) {
      var e = Math.atan2(goal.y - bot.y, goal.x - bot.x) - bot.th;
      e = Math.atan2(Math.sin(e), Math.cos(e));
      var L = limits(), cf = Math.max(0, Math.cos(e));
      cmd = { v: Math.min(170, dg * 4) * cf * cf, w: Math.max(-L.wmax, Math.min(L.wmax, 6 * e)), roll: null };
    }
    var k = 1 - Math.exp(-LAG * dt);
    bot.v += (cmd.v - bot.v) * k;
    bot.w += (cmd.w - bot.w) * k;
    bot.th += bot.w * dt;
    var nx = bot.x + bot.v * Math.cos(bot.th) * dt, ny = bot.y + bot.v * Math.sin(bot.th) * dt;
    var cn = clearance(nx, ny);
    if (cn >= R + MARGIN - 1 || cn >= clearance(bot.x, bot.y)) { bot.x = nx; bot.y = ny; } else { bot.v = 0; }
    trail.push(bot.x, bot.y);
    if (trail.length > 180) trail.splice(0, 2);
    scan(now);
    // there? Or no progress for 2s: give up, so it always settles
    if (!route.length && Math.hypot(goal.x - bot.x, goal.y - bot.y) < 7 && Math.abs(bot.v) < 40) { park(); return; }
    // no progress for a while: back off and plan again (once), then give up,
    // so it always settles
    var left = remaining();
    if (left < best - 8) { best = left; stuckT = 0; recovered = false; }
    else if ((stuckT += dt) > 2.6) park();
    else if (stuckT > 0.8 && !recovered) { recovered = true; recover = 0.45; replan = true; }
  }
  function park() { parked = true; bot.v = 0; bot.w = 0; route.length = 0; recover = 0; }
  function setGoal(x, y) {
    if (!W || reduce()) return;
    var g = freeSpot(x, y);
    if (goal && !parked && Math.hypot(g.x - goal.x, g.y - goal.y) < 2) return;
    goal = g;
    replan = true;
    if (parked) { route = pathTo(g); replan = false; plannedAt = performance.now(); }
    best = remaining(); stuckT = 0; recovered = false;
    parked = false;
    wake();
  }

  /* ------------------------------ drawing --------------------------------- */
  var C = {};
  function colors() {
    var cs = window.getComputedStyle(root);
    function v(n, f) { return (cs.getPropertyValue(n) || "").trim() || f; }
    C = { accent: v("--accent", "#2563eb"), text: v("--text", "#16202e"), muted: v("--text-muted", "#5b6677"),
          surface: v("--surface", "#fff"), dark: root.getAttribute("data-theme") === "dark" };
  }
  var I18N = {
    en: { idle: "MPC rover · point here and it plans its way there", touch: "MPC rover · tap here to send it",
          still: "MPC rover · parked (reduced motion)", paths: "paths", pts: "pts" },
    fr: { idle: "Rover MPC · pointez ici, il planifie sa route", touch: "Rover MPC · touchez ici pour l'envoyer",
          still: "Rover MPC · à l'arrêt (animations réduites)", paths: "trajectoires", pts: "pts" }
  };
  function num(n, fr, dec) {
    var s = n.toFixed(dec || 0);
    if (fr) s = s.replace(".", ",");
    return dec ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, fr ? " " : ",");
  }
  function hud() {
    var fr = root.getAttribute("lang") === "fr", S = I18N[fr ? "fr" : "en"];
    if (reduce()) return S.still + " · lidar " + num(map.x.length, fr) + " " + S.pts;
    if (parked && fade <= 0) return FINE ? S.idle : S.touch;
    return "MPC " + valid + "/" + (NV * NW) + " " + S.paths + " · lidar " + num(map.x.length, fr) + " " + S.pts +
           " · " + num(Math.abs(bot.v) / 100, fr, 2) + " m/s";
  }
  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    var i, n = map.x.length, a = C.dark ? 0.34 : 0.26, f = fade;
    // the map: everything found so far; the newest points still glow
    ctx.globalAlpha = a; ctx.fillStyle = C.text; ctx.beginPath();
    for (i = 0; i < n; i++) if (now - map.t[i] > 900) ctx.rect(map.x[i] * W - 0.8, map.y[i] * H - 0.8, 1.6, 1.6);
    ctx.fill();
    ctx.fillStyle = C.accent;
    for (i = n - 1; i >= 0 && now - map.t[i] <= 900; i--) {
      var age = (now - map.t[i]) / 900;
      ctx.globalAlpha = a + (0.85 - a) * (1 - age);
      ctx.fillRect(map.x[i] * W - 1, map.y[i] * H - 1, 2, 2);
    }
    if (f > 0) {
      // lidar rays (every other one) and this frame's hits
      ctx.globalAlpha = 0.07 * f; ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.beginPath();
      for (i = 0; i < hits.length; i += 6) { ctx.moveTo(bot.x, bot.y); ctx.lineTo(hits[i], hits[i + 1]); }
      ctx.stroke();
      ctx.globalAlpha = 0.9 * f; ctx.fillStyle = C.accent;
      for (i = 0; i < hits.length; i += 3) if (hits[i + 2]) ctx.fillRect(hits[i] - 1.1, hits[i + 1] - 1.1, 2.2, 2.2);
      // the controller's fan of predicted paths; the chosen one as dots
      ctx.globalAlpha = (C.dark ? 0.16 : 0.12) * f; ctx.strokeStyle = C.text; ctx.beginPath();
      var pick = null;
      rolls.forEach(function (r) {
        if (!r.ok || !r.pts.length) return;
        if (r.best) pick = r;
        ctx.moveTo(bot.x, bot.y);
        for (var k = 0; k < r.pts.length; k += 2) ctx.lineTo(r.pts[k], r.pts[k + 1]);
      });
      ctx.stroke();
      if (pick) {
        ctx.fillStyle = C.accent;
        for (var k = 0, m = pick.pts.length / 2; k < m; k++) {
          ctx.globalAlpha = f * (0.95 - 0.6 * k / m);
          ctx.beginPath(); ctx.arc(pick.pts[2 * k], pick.pts[2 * k + 1], 2.4 - 1.3 * k / m, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    // the global plan: dashed, through the waypoints still ahead
    if (goal && f > 0 && route.length) {
      ctx.globalAlpha = (C.dark ? 0.42 : 0.34) * f; ctx.strokeStyle = C.text; ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(bot.x, bot.y);
      route.forEach(function (p) { ctx.lineTo(p.x, p.y); });
      ctx.lineTo(goal.x, goal.y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = C.text;
      route.forEach(function (p) { ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); });
    }
    // the trail it leaves
    if (trail.length > 4) {
      ctx.lineWidth = 1.6; ctx.strokeStyle = C.accent; ctx.lineCap = "round";
      var segs = trail.length / 2 - 1;
      for (var b = 0; b < 6; b++) {
        var s0 = Math.floor(segs * b / 6), s1 = Math.floor(segs * (b + 1) / 6);
        ctx.globalAlpha = (C.dark ? 0.5 : 0.4) * (b + 1) / 6 * (0.35 + 0.65 * Math.max(f, parked ? 0.5 : 1));
        ctx.beginPath(); ctx.moveTo(trail[2 * s0], trail[2 * s0 + 1]);
        for (var q = s0 + 1; q <= s1; q++) ctx.lineTo(trail[2 * q], trail[2 * q + 1]);
        ctx.stroke();
      }
    }
    // the goal
    if (goal && f > 0) {
      ctx.globalAlpha = 0.85 * f; ctx.strokeStyle = C.accent; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(goal.x, goal.y, 6, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(goal.x - 12, goal.y); ctx.lineTo(goal.x - 8, goal.y); ctx.moveTo(goal.x + 8, goal.y); ctx.lineTo(goal.x + 12, goal.y);
      ctx.moveTo(goal.x, goal.y - 12); ctx.lineTo(goal.x, goal.y - 8); ctx.moveTo(goal.x, goal.y + 8); ctx.lineTo(goal.x, goal.y + 12);
      ctx.stroke();
    }
    // the rover: a body with two wheels and the lidar on top, facing its heading
    ctx.save();
    ctx.translate(bot.x, bot.y); ctx.rotate(bot.th);
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.text;
    ctx.fillRect(-7, -9, 9, 3); ctx.fillRect(-7, 6, 9, 3);          // wheels
    ctx.fillStyle = C.accent;
    rounded(-10, -6.5, 20, 13, 3.5); ctx.fill();                       // body
    ctx.fillStyle = C.surface;
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(5.5, -3); ctx.lineTo(5.5, 3); ctx.closePath(); ctx.fill();   // nose
    ctx.beginPath(); ctx.arc(-1.5, 0, 3.2, 0, Math.PI * 2); ctx.fill(); // lidar
    ctx.restore();
    // the readout, in the bottom margin, right-aligned with the page column
    var inner = box(hero.querySelector(".hero-inner")), right = inner ? inner.x + inner.w : W - 20;
    ctx.globalAlpha = 1; ctx.fillStyle = C.muted; ctx.textAlign = "right"; ctx.textBaseline = "alphabetic";
    ctx.font = "600 11px 'Roboto Mono', ui-monospace, monospace";
    ctx.fillText(hud(), right, H - Math.max(9, Math.min(18, H * 0.02)));
  }
  function rounded(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }

  /* ------------------------------ the loop -------------------------------- */
  var running = false, inView = true, last = 0, ready = false;
  function wake() {
    if (running || !inView || !ready || document.hidden) return;
    running = true; last = 0;
    requestAnimationFrame(tick);
  }
  function tick(now) {
    if (!inView || document.hidden || reduce()) { running = false; if (reduce()) still(); return; }
    var dt = last ? Math.min(0.034, (now - last) / 1000) : 1 / 60;
    last = now;
    step(dt, now);
    draw(now);
    // keep going while it drives, while its rays fade out, and while new points still glow
    var glowing = map.t.length && now - map.t[map.t.length - 1] < 900;
    if (!parked || fade > 0 || glowing) requestAnimationFrame(tick);
    else running = false;
  }
  /* reduced motion: a map already scanned from a few places, the rover parked */
  function still() {
    var A = anchors(), t = performance.now() - 5000;
    [A.start, A.via, { x: W * 0.62, y: H - 30 }, A.rest].forEach(function (p) {
      var q = freeSpot(p.x, p.y); bot.x = q.x; bot.y = q.y;
      for (var k = 0; k < 6; k++) scan(t);
    });
    var r = freeSpot(A.rest.x, A.rest.y);
    bot.x = r.x; bot.y = r.y; bot.th = Math.PI; bot.v = 0; bot.w = 0;
    hits.length = 0; rolls.length = 0; trail = []; goal = null; fade = 0; parked = true;
    draw(performance.now());
  }

  /* ------------------------------ set-up ---------------------------------- */
  function size() {
    var b = hero.getBoundingClientRect(), w = Math.round(b.width), h = Math.round(b.height);
    if (!w || !h) return false;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * DPR); canvas.height = Math.round(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (W && H && Math.abs(w / W - h / H) < 0.15) {
      // the same room, rescaled: keep the map and where the rover is
      var sx = w / W, sy = h / H;
      bot.x *= sx; bot.y *= sy;
      if (goal) { goal.x *= sx; goal.y *= sy; }
      for (var i = 0; i < trail.length; i += 2) { trail[i] *= sx; trail[i + 1] *= sy; }
      W = w; H = h; toPx();
      return true;
    }
    W = w; H = h;   // first time, or a very different shape: a new room
    buildWorld();
    var A = anchors(), s = freeSpot(A.start.x, A.start.y);
    bot = { x: s.x, y: s.y, th: -0.2, v: 0, w: 0 };
    trail = []; goal = null; parked = true;
    return true;
  }
  function begin() {
    if (ready || !size()) return;
    ready = true;
    colors();
    if (reduce()) { still(); return; }
    var A = anchors();
    draw(performance.now());
    setGoal(A.rest.x, A.rest.y);   // the opening drive (about 3s), then park
  }
  function start() {
    var cl = root.classList;
    // after the intro (if it plays) and the player card's entrance
    if (cl.contains("splash-on") && !cl.contains("splash-out")) {
      document.addEventListener("ecs:intro-end", function () { setTimeout(begin, 1100); }, { once: true });
    } else {
      setTimeout(begin, 650);
    }
  }

  // steering: the pointer (mouse / pen) anywhere over the hero; a tap on touch screens
  function local(ev) { var b = hero.getBoundingClientRect(); return { x: ev.clientX - b.left, y: ev.clientY - b.top }; }
  hero.addEventListener("pointermove", function (ev) {
    if (!ready || ev.pointerType === "touch") return;
    var p = local(ev); setGoal(p.x, p.y);
  });
  hero.addEventListener("pointerdown", function (ev) {
    if (!ready || ev.pointerType !== "touch" || (ev.target.closest && ev.target.closest("a, button"))) return;
    var p = local(ev); setGoal(p.x, p.y);
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      inView = en[en.length - 1].isIntersecting;
      if (inView && !parked) wake();
    }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden && !parked) wake(); });
  // a new theme or language: new colours / readout, drawn once if it's at rest
  new MutationObserver(function () {
    if (!ready) return;
    colors();
    if (!running) { if (reduce()) still(); else draw(performance.now()); }
  }).observe(root, { attributes: true, attributeFilter: ["data-theme", "lang"] });
  if ("ResizeObserver" in window) {
    var rt = 0;
    new ResizeObserver(function () {
      if (!ready) return;
      clearTimeout(rt);
      rt = setTimeout(function () {
        if (!size()) return;
        if (reduce()) still(); else if (!running) draw(performance.now());
      }, 120);
    }).observe(hero);
  }
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
