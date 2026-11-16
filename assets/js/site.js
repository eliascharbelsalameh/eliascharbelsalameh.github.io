/* =============================================================================
   Blog pages: the light / dark toggle (the portfolio's app.js does the same
   on the home page). The saved theme is applied before first paint by the
   inline script in each page's <head>.
   ============================================================================= */
(function () {
  "use strict";
  var root = document.documentElement;
  var meta = document.getElementById("meta-theme-color");
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    if (meta) meta.setAttribute("content", t === "dark" ? "#0d1220" : "#f5f6f9");
  }
  var btn = document.getElementById("theme-toggle");
  if (btn) btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
  // follow the OS only while the visitor hasn't made an explicit choice
  var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  if (mq && mq.addEventListener) mq.addEventListener("change", function (e) {
    var explicit = null;
    try { explicit = localStorage.getItem("theme"); } catch (err) {}
    if (!explicit) setTheme(e.matches ? "dark" : "light");
  });
})();
