/* =============================================================================
   Portfolio renderer + filtering.
   Reads window.PORTFOLIO (assets/js/data.js) and builds the page.
   You normally never need to edit this file — change content in data.js.
   ============================================================================= */
(function () {
  "use strict";
  var DATA = window.PORTFOLIO;
  if (!DATA) { console.error("PORTFOLIO data not found — check assets/js/data.js"); return; }

  /* ----------------------------- tiny helpers ----------------------------- */
  function h(tag, attrs) {
    var e = document.createElement(tag), i, k, v;
    attrs = attrs || {};
    for (k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
      v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "dataset") { for (var dk in v) e.dataset[dk] = v[dk]; }
      else if (k.slice(0, 2) === "on" && typeof v === "function") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (i = 2; i < arguments.length; i++) append(e, arguments[i]);
    return e;
  }
  function append(e, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { append(e, k); }); return; }
    e.appendChild(kid.nodeType ? kid : document.createTextNode(kid));
  }
  function $(sel) { return document.querySelector(sel); }

  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function fmt(d) {
    if (!d) return "";
    if (d === "present") return "Present";
    var p = String(d).split("-");
    return p[1] ? MONTHS[+p[1] - 1] + " " + p[0] : p[0];
  }
  function key(d) {
    if (d === "present") return 999999;
    if (!d) return 0;
    var p = String(d).split("-");
    return (+p[0]) * 12 + (p[1] ? +p[1] : 6);
  }
  function startYear(it) { return parseInt(String(it.start || "0").split("-")[0], 10); }
  function dateRange(it) { return it.end ? fmt(it.start) + " – " + fmt(it.end) : fmt(it.start); }

  /* category lookup */
  var CATS = {};
  (DATA.categories || []).forEach(function (c) { CATS[c.id] = c; });
  function catColor(id) { return (CATS[id] && CATS[id].color) || "#64748b"; }
  function catLabel(id) { return (CATS[id] && CATS[id].label) || id; }

  /* kind → inline SVG icon */
  var ICONS = {
    experience: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12.5h18"/>',
    education:  '<path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M7 10.5V15c0 1.2 2.4 2.4 5 2.4s5-1.2 5-2.4v-4.5"/>',
    project:    '<path d="M9 8l-4 4 4 4"/><path d="M15 8l4 4-4 4"/>',
    leadership: '<circle cx="9" cy="8" r="3.1"/><path d="M3.6 19a5.4 5.4 0 0 1 10.8 0"/><path d="M16 6.4a3 3 0 0 1 0 5.5"/><path d="M18.4 19a5 5 0 0 0-3-4.6"/>',
    honor:      '<path d="M7 4h10v3a5 5 0 0 1-10 0V4z"/><path d="M7 5H4v1a3 3 0 0 0 3 3"/><path d="M17 5h3v1a3 3 0 0 1-3 3"/><path d="M12 12v3"/><path d="M9 19h6l-1-3h-4z"/>',
    certification: '<circle cx="12" cy="10" r="5.5"/><path d="M9.7 10l1.7 1.7L15 8.4"/><path d="M8.5 14.5l-1 6 4.5-2 4.5 2-1-6"/>',
    research:   '<path d="M9 3h6"/><path d="M10 3v5.5L5.6 16.5a2 2 0 0 0 1.8 3h9.2a2 2 0 0 0 1.8-3L14 8.5V3"/><path d="M7.6 14.5h8.8"/>'
  };
  function icon(kind) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[kind] || ICONS.project) + "</svg>";
  }
  var SOCIAL = {
    github:   '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.300-4.6-1.1-4.6-5a4 4 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7a4 4 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor"/><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7" stroke="currentColor"/></svg>',
    mail:     '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/></svg>',
    phone:    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V18a2 2 0 0 1-2.2 2A15 15 0 0 1 4 6.2 2 2 0 0 1 5 4z"/></svg>',
    cv:       '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 16h6"/></svg>',
    arrow:    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ------------------------------ THEME ----------------------------------- */
  function initTheme() {
    var saved;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    var theme = saved || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    var t = $("#theme-toggle");
    if (t) t.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ------------------------------- HERO ----------------------------------- */
  function renderHero() {
    var p = DATA.profile || {};
    $("#hero-role").textContent = p.role || "";
    $("#hero-name").textContent = p.name || "";
    $("#hero-tagline").textContent = p.tagline || "";
    $("#hero-summary").textContent = p.summary || "";

    // avatar: initials, swapped for the photo if it loads
    var av = $("#hero-avatar");
    av.textContent = p.initials || "";
    if (p.photo) {
      var img = new Image();
      img.onload = function () { av.style.backgroundImage = "url('" + p.photo + "')"; av.textContent = ""; };
      img.src = p.photo;
    }

    // hero CTA
    var cta = $("#hero-cta");
    cta.appendChild(h("a", { class: "btn btn-primary", href: "#timeline", html: "Explore the timeline " + SOCIAL.arrow }));
    if (p.github) cta.appendChild(h("a", { class: "btn btn-ghost", href: p.github, target: "_blank", rel: "noopener", html: SOCIAL.github + "<span>GitHub</span>" }));

    // stats
    var stats = $("#hero-stats");
    (p.stats || []).forEach(function (s) {
      stats.appendChild(h("li", {}, h("span", { class: "stat-value" }, s.value), h("span", { class: "stat-label" }, s.label)));
    });

    // footer
    var fl = $("#footer-links");
    if (p.email)   fl.appendChild(h("a", { class: "btn btn-ghost", href: "mailto:" + p.email, html: SOCIAL.mail + "<span>" + p.email + "</span>" }));
    if (p.linkedin)fl.appendChild(h("a", { class: "btn btn-ghost", href: p.linkedin, target: "_blank", rel: "noopener", html: SOCIAL.linkedin + "<span>LinkedIn</span>" }));
    if (p.github)  fl.appendChild(h("a", { class: "btn btn-ghost", href: p.github, target: "_blank", rel: "noopener", html: SOCIAL.github + "<span>GitHub</span>" }));
    if (p.phone)   fl.appendChild(h("a", { class: "btn btn-ghost", href: "tel:" + p.phone.replace(/\s+/g, ""), html: SOCIAL.phone + "<span>" + p.phone + "</span>" }));

    var now = new Date();
    $("#footer-copy").textContent = "© " + now.getFullYear() + " " + (p.name || "");
    $("#footer-date").textContent = MONTHS[now.getMonth()] + " " + now.getFullYear();
  }

  /* ------------------------------ FILTERS --------------------------------- */
  function renderFilters() {
    var box = $("#filters");
    (DATA.categories || []).forEach(function (c) {
      box.appendChild(h("button", {
        class: "chip", type: "button", "aria-pressed": "true",
        dataset: { cat: c.id }, style: "--cat:" + c.color,
        onclick: function () {
          this.setAttribute("aria-pressed", this.getAttribute("aria-pressed") === "true" ? "false" : "true");
          applyFilters();
        }
      }, h("span", { class: "dot" }), h("span", { class: "label" }, c.label)));
    });
  }

  /* ------------------------------ TIMELINE -------------------------------- */
  var records = [];   // { el, cats, text, hidden }
  var groupEls = [];  // { section, items:[el,...] }

  function searchText(it) {
    var parts = [it.title, it.org, it.location, it.summary]
      .concat(it.highlights || []).concat(it.tags || [])
      .concat((it.categories || []).map(catLabel));
    return parts.join(" ").toLowerCase();
  }

  function buildCard(it) {
    var color = catColor((it.categories || [])[0]);
    var ongoing = it.end === "present";

    var head = h("div", {},
      h("span", { class: "tl-date" }, dateRange(it), ongoing ? h("span", { class: "tl-now" }, "Now") : null),
      h("h3", { class: "tl-title" },
        it.title,
        it.featured ? h("span", { class: "tl-star", title: "Highlight" }, "★") : null),
      h("div", { class: "tl-org" },
        it.org || "",
        it.location ? [h("span", { class: "sep" }, " · "), h("span", { class: "tl-loc" }, it.location)] : null)
    );

    var card = h("div", { class: "tl-card" }, head);

    if (it.summary) card.appendChild(h("p", { class: "tl-summary" }, it.summary));

    if (it.highlights && it.highlights.length) {
      card.appendChild(h("ul", { class: "tl-highlights" }, it.highlights.map(function (x) { return h("li", {}, x); })));
    }

    if (it.image) {
      var im = h("img", { class: "tl-img", src: it.image, alt: it.title || "", loading: "lazy" });
      im.addEventListener("error", function () { im.remove(); }); // missing image → just hide it
      card.appendChild(im);
    }

    if (it.tags && it.tags.length) {
      card.appendChild(h("div", { class: "tl-tags" }, it.tags.map(function (t) { return h("span", { class: "tl-tag" }, t); })));
    }

    if (it.categories && it.categories.length) {
      card.appendChild(h("div", { class: "tl-cats" }, it.categories.map(function (cid) {
        return h("span", { class: "tl-cat", style: "--c:" + catColor(cid) }, h("span", { class: "d" }), catLabel(cid));
      })));
    }

    if (it.links && it.links.length) {
      card.appendChild(h("div", { class: "tl-links" }, it.links.map(function (l) {
        return h("a", { class: "tl-link", href: l.url, target: "_blank", rel: "noopener", html: SOCIAL.github + "<span>" + l.label + "</span>" });
      })));
    }

    var marker = h("div", { class: "tl-marker", html: icon(it.kind) });
    var row = h("div", { class: "tl-item reveal", style: "--cat:" + color }, marker, card);
    return row;
  }

  function renderTimeline() {
    var list = $("#timeline-list");
    var sorted = (DATA.timeline || []).slice().sort(function (a, b) {
      return (key(b.start) - key(a.start)) || (key(b.end || b.start) - key(a.end || a.start));
    });

    var curYear = null, section = null, itemsWrap = null, groupItems = null;
    sorted.forEach(function (it) {
      var y = startYear(it);
      if (curYear !== y) {
        curYear = y;
        var ongoing = false;
        groupItems = [];
        var pill = h("span", { class: "pill" }, String(y));
        section = h("div", { class: "tl-group" }, h("div", { class: "tl-year" }, pill));
        itemsWrap = section;
        groupEls.push({ section: section, items: groupItems, pill: pill });
        list.appendChild(section);
      }
      var row = buildCard(it);
      itemsWrap.appendChild(row);
      groupItems.push(row);
      records.push({ el: row, cats: it.categories || [], text: searchText(it) });
      // mark the year pill "ongoing" if this group has a present item
      if (it.end === "present") groupEls[groupEls.length - 1].pill.classList.add("ongoing");
    });
  }

  /* --------------------------- FILTER ENGINE ------------------------------ */
  function activeSet() {
    var s = {};
    var chips = $("#filters").querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) {
      if (chips[i].getAttribute("aria-pressed") === "true") s[chips[i].dataset.cat] = true;
    }
    return s;
  }
  function applyFilters() {
    var active = activeSet();
    var q = ($("#search").value || "").trim().toLowerCase();
    var shown = 0, i, r;
    for (i = 0; i < records.length; i++) {
      r = records[i];
      var okCat = r.cats.some(function (c) { return active[c]; });
      var okQ = !q || r.text.indexOf(q) !== -1;
      var vis = okCat && okQ;
      r.el.hidden = !vis;
      if (vis) shown++;
    }
    for (i = 0; i < groupEls.length; i++) {
      var any = groupEls[i].items.some(function (el) { return !el.hidden; });
      groupEls[i].section.hidden = !any;
    }
    $("#result-count").textContent = shown + " of " + records.length + " shown";
    $("#empty-state").hidden = shown !== 0;
  }
  function setAllChips(on) {
    var chips = $("#filters").querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) chips[i].setAttribute("aria-pressed", on ? "true" : "false");
  }
  function wireControls() {
    $("#search").addEventListener("input", applyFilters);
    $("#select-all").addEventListener("click", function () { setAllChips(true); applyFilters(); });
    $("#clear-all").addEventListener("click", function () { setAllChips(false); applyFilters(); });
    $("#reset").addEventListener("click", function () { setAllChips(true); $("#search").value = ""; applyFilters(); });
    $("#empty-reset").addEventListener("click", function () { setAllChips(true); $("#search").value = ""; applyFilters(); });
  }

  /* ------------------------------- SKILLS --------------------------------- */
  function renderSkills() {
    var grid = $("#skills-grid");
    (DATA.skills || []).forEach(function (g) {
      grid.appendChild(h("div", { class: "skill-group reveal" },
        h("h3", {}, g.group),
        h("ul", {}, (g.items || []).map(function (s) { return h("li", {}, s); }))));
    });
  }

  /* ------------------------------- REVEAL --------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* -------------------------------- INIT ---------------------------------- */
  initTheme();
  renderHero();
  renderFilters();
  renderTimeline();
  renderSkills();
  wireControls();
  applyFilters();
  initReveal();
})();
