/* =============================================================================
   Blog pages (and the 404 page): the light / dark toggle (the portfolio's
   app.js does the same on the home page). The saved theme is applied before
   first paint by the inline script in each page's <head>.
   ============================================================================= */
(function () {
  "use strict";
  var root = document.documentElement;
  var meta = document.getElementById("meta-theme-color");
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    if (meta) meta.setAttribute("content", t === "dark" ? "#0d1220" : "#f5f6f9");
  }
  function reduceMotion() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  /* the new theme spreads from the button in a circle while its icon turns in
     (styles.css "Theme switch"); without view transitions, or under reduced
     motion, it simply switches */
  function switchTheme(next, btn) {
    if (reduceMotion()) { setTheme(next); return; }
    btn.classList.remove("is-turning");
    void btn.offsetWidth;
    btn.classList.add("is-turning");
    clearTimeout(btn.turnTimer);
    btn.turnTimer = setTimeout(function () { btn.classList.remove("is-turning"); }, 700);
    if (!document.startViewTransition) { setTheme(next); return; }
    var b = btn.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
    root.style.setProperty("--vt-x", x.toFixed(0) + "px");
    root.style.setProperty("--vt-y", y.toFixed(0) + "px");
    root.style.setProperty("--vt-r", Math.ceil(Math.sqrt(Math.pow(Math.max(x, innerWidth - x), 2) + Math.pow(Math.max(y, innerHeight - y), 2))) + "px");
    root.classList.add("vt-theme");
    var vt = document.startViewTransition(function () { setTheme(next); });
    function done() { root.classList.remove("vt-theme"); }
    vt.finished.then(done, done);
  }
  var btn = document.getElementById("theme-toggle");
  if (btn) btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    switchTheme(next, btn);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
  // follow the OS only while the visitor hasn't made an explicit choice
  var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  if (mq && mq.addEventListener) mq.addEventListener("change", function (e) {
    var explicit = null;
    try { explicit = localStorage.getItem("theme"); } catch (err) {}
    if (!explicit) setTheme(e.matches ? "dark" : "light");
  });
  // the grid paper's light: the dots around the mouse pointer light up (the
  // same as app.js initGridGlow on the home page; styles.css "Grid paper")
  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var glow = document.createElement("div"), gx = 0, gy = 0, graf = 0, half = 190;
    glow.className = "grid-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    document.addEventListener("pointermove", function (ev) {
      if (ev.pointerType !== "mouse") return;
      gx = ev.clientX; gy = ev.clientY;
      if (!graf) graf = requestAnimationFrame(function () {
        graf = 0;
        glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
        glow.style.backgroundPosition = (half - gx) + "px " + (half - gy) + "px";
        glow.classList.add("is-on");
      });
    }, { passive: true });
    document.addEventListener("mouseout", function (ev) { if (!ev.relatedTarget) glow.classList.remove("is-on"); });
  }
  // the 404 page names the address that wasn't found (as text, never as markup)
  var miss = document.getElementById("nf-path");
  if (miss) miss.textContent = location.pathname;
})();
