/* =============================================================================
   Portfolio renderer + filtering.
   Reads window.PORTFOLIO (assets/js/data.js) and builds the page.
   You normally never need to edit this file — change content in data.js.
   ============================================================================= */
(function () {
  "use strict";
  var DATA = window.PORTFOLIO;
  if (!DATA) { console.error("PORTFOLIO data not found — check assets/js/data.js"); return; }

  /* ------------------------------- i18n ----------------------------------- */
  /* UI strings. Content (timeline / profile / skills) is translated in data.js
     via parallel `*_fr` fields — see tf() below. */
  var I18N = {
    en: {
      nav_about: "About", nav_highlights: "Highlights", nav_timeline: "Timeline", nav_skills: "Skills", nav_contact: "Contact",
      hl_h: "Highlights",
      hl_sub: "The work I'd show first — open one to see it in context in the timeline.",
      hl_open: "View in timeline", hl_star: "Highlight",
      map_h: "At a glance",
      map_hint: "Each bar is an entry below — click one to open it.",
      map_today: "Today",
      lanes: { work: "Work & research", education: "Education", projects: "Projects",
               leadership: "Leadership", awards: "Awards & certificates", personal: "Personal" },
      details_show: "Show details", details_hide: "Hide details",
      expand_all: "Expand all", collapse_all: "Collapse all",
      skill_chip: function (s) { return "Skill: " + s; },
      skill_clear: "Clear the skill filter",
      skill_show: function (n, s) { return n === 1 ? "Show the entry that uses " + s : "Show the " + n + " entries that use " + s; },
      timeline_h: "Timeline of efforts",
      timeline_sub: "Every role, project, award and contribution — filter the view to whatever you care about.",
      search_ph: "Search roles, tech, organisations…",
      all: "All", none: "None", reset: "Reset",
      featured_only: "Featured", present_only: "Ongoing",
      filters_hint: "Click a category to show or hide it",
      skills_h: "Skills & toolbox",
      skills_sub: "Technologies and methods used across the work above — the highlighted ones show where they were used.",
      contact_h: "Contact",
      explore: "Explore the timeline",
      cv: "Download CV",
      empty: "No entries match your filters.", empty_reset: "Reset filters",
      present: "Present", now: "Now",
      upcoming: "Upcoming",
      to_top: "Back to top",
      theme_toggle: "Toggle dark / light",
      footer_built: "Built as a living timeline — last updated on",
      months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      shown: function (a, b) { return a + " of " + b + " shown"; }
    },
    fr: {
      nav_about: "Profil", nav_highlights: "Points forts", nav_timeline: "Parcours", nav_skills: "Compétences", nav_contact: "Contact",
      hl_h: "Points forts",
      hl_sub: "Les travaux à voir en premier — ouvrez-en un pour le retrouver dans le parcours.",
      hl_open: "Voir dans le parcours", hl_star: "Point fort",
      map_h: "En un coup d'œil",
      map_hint: "Chaque barre est une entrée ci-dessous — cliquez pour l'ouvrir.",
      map_today: "Aujourd'hui",
      lanes: { work: "Travail & recherche", education: "Formation", projects: "Projets",
               leadership: "Leadership", awards: "Prix & certificats", personal: "Personnel" },
      details_show: "Voir le détail", details_hide: "Masquer le détail",
      expand_all: "Tout déplier", collapse_all: "Tout replier",
      skill_chip: function (s) { return "Compétence : " + s; },
      skill_clear: "Retirer le filtre de compétence",
      skill_show: function (n, s) { return n === 1 ? "Voir l'entrée qui utilise " + s : "Voir les " + n + " entrées qui utilisent " + s; },
      timeline_h: "Parcours et réalisations",
      timeline_sub: "Chaque poste, projet, distinction et contribution — filtrez l'affichage selon vos intérêts.",
      search_ph: "Rechercher postes, technologies, organisations…",
      all: "Tout", none: "Aucun", reset: "Réinitialiser",
      featured_only: "En vedette", present_only: "En cours",
      filters_hint: "Cliquez sur une catégorie pour l'afficher ou la masquer",
      skills_h: "Compétences & outils",
      skills_sub: "Technologies et méthodes utilisées dans les travaux ci-dessus — celles mises en évidence renvoient aux entrées où elles ont servi.",
      contact_h: "Contact",
      explore: "Explorer le parcours",
      cv: "Télécharger le CV",
      empty: "Aucune entrée ne correspond à vos filtres.", empty_reset: "Réinitialiser les filtres",
      present: "Présent", now: "En cours",
      upcoming: "À venir",
      to_top: "Haut de page",
      theme_toggle: "Basculer clair / sombre",
      footer_built: "Conçu comme une frise vivante — dernière mise à jour le",
      months: ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],
      shown: function (a, b) { return a + " sur " + b + " affichées"; }
    }
  };

  /* URL query state — lets a filtered view be bookmarked and shared.
     Read once here because `lang` in the URL wins over the saved preference. */
  var URLQ = (function () {
    var out = {}, s = location.search.replace(/^\?/, "");
    if (!s) return out;
    s.split("&").forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf("="), k = i < 0 ? kv : kv.slice(0, i);
      var v = i < 0 ? "" : kv.slice(i + 1);
      try { out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, " ")); } catch (e) {}
    });
    return out;
  })();

  var LANG = (function () {
    if (URLQ.lang === "fr" || URLQ.lang === "en") return URLQ.lang;
    try { return localStorage.getItem("lang") === "fr" ? "fr" : "en"; } catch (e) { return "en"; }
  })();
  var T = I18N[LANG];

  /* Return a content field, preferring its French variant when LANG === "fr". */
  function tf(obj, field) {
    if (!obj) return "";
    if (LANG === "fr" && obj[field + "_fr"] != null) return obj[field + "_fr"];
    return obj[field];
  }

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
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function empty(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

  /* lowercase + strip accents, so "compiegne" finds "Compiègne" */
  function norm(s) {
    s = String(s == null ? "" : s).toLowerCase();
    return s.normalize ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : s;
  }

  function fmt(d) {
    if (!d) return "";
    if (d === "upcoming") return T.upcoming;
    if (d === "present") return T.present;
    var p = String(d).split("-");
    return p[1] ? T.months[+p[1] - 1] + " " + p[0] : p[0];
  }
  function key(d) {
    if (d === "upcoming") return 1000000;   // sorts above "present"
    if (d === "present") return 999999;
    if (!d) return 0;
    var p = String(d).split("-");
    return (+p[0]) * 12 + (p[1] ? +p[1] : 6);
  }
  /* Group key for the year heading — "upcoming" gets its own group instead of a year. */
  function startYear(it) {
    if (it.start === "upcoming") return "upcoming";
    return parseInt(String(it.start || "0").split("-")[0], 10);
  }
  function dateRange(it) { return it.end ? fmt(it.start) + " – " + fmt(it.end) : fmt(it.start); }
  /* months since year 0; a bare year sits mid-year, as in key() */
  function monthIdx(d) { var p = String(d).split("-"); return (+p[0]) * 12 + (p[1] ? +p[1] - 1 : 5); }

  /* Stable id per entry for #entry-… deep links. Derived from the English title
     and start date so it survives a language switch; an entry can pin its own
     with `id:` in data.js. Index-aligned with DATA.timeline. */
  var ENTRY_IDS = (function () {
    var seen = {};
    return (DATA.timeline || []).map(function (it) {
      var slug = it.id || norm(it.title).replace(/[^a-z0-9]+/g, "-").replace(/^-+/, "").slice(0, 32).replace(/-+$/, "") + "-" + it.start;
      var id = "entry-" + slug, n = 2;
      while (seen[id]) id = "entry-" + slug + "-" + n++;
      seen[id] = true;
      return id;
    });
  })();

  /* category lookup */
  var CATS = {};
  (DATA.categories || []).forEach(function (c) { CATS[c.id] = c; });
  function catColor(id) { return (CATS[id] && CATS[id].color) || "#64748b"; }
  function catLabel(id) { return CATS[id] ? tf(CATS[id], "label") : id; }

  /* kind → inline SVG icon */
  var ICONS = {
    experience: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12.5h18"/>',
    education:  '<path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M7 10.5V15c0 1.2 2.4 2.4 5 2.4s5-1.2 5-2.4v-4.5"/>',
    project:    '<path d="M9 8l-4 4 4 4"/><path d="M15 8l4 4-4 4"/>',
    leadership: '<circle cx="9" cy="8" r="3.1"/><path d="M3.6 19a5.4 5.4 0 0 1 10.8 0"/><path d="M16 6.4a3 3 0 0 1 0 5.5"/><path d="M18.4 19a5 5 0 0 0-3-4.6"/>',
    honor:      '<path d="M7 4h10v3a5 5 0 0 1-10 0V4z"/><path d="M7 5H4v1a3 3 0 0 0 3 3"/><path d="M17 5h3v1a3 3 0 0 1-3 3"/><path d="M12 12v3"/><path d="M9 19h6l-1-3h-4z"/>',
    certification: '<circle cx="12" cy="10" r="5.5"/><path d="M9.7 10l1.7 1.7L15 8.4"/><path d="M8.5 14.5l-1 6 4.5-2 4.5 2-1-6"/>',
    research:   '<path d="M9 3h6"/><path d="M10 3v5.5L5.6 16.5a2 2 0 0 0 1.8 3h9.2a2 2 0 0 0 1.8-3L14 8.5V3"/><path d="M7.6 14.5h8.8"/>',
    fitness:    '<path d="M3.5 9v6M6.5 7v10M17.5 7v10M20.5 9v6M6.5 12h11"/>'
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
    arrow:    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    link:     '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.4 1.4"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0L5 13.3a4 4 0 0 0 5.7 5.7l1.4-1.4"/></svg>',
    doc:      '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
    video:    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 9.2l4.5 2.8-4.5 2.8z"/></svg>',
    pin:      '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>'
  };
  /* pick an icon from the destination rather than always showing GitHub's */
  function linkIcon(l) {
    var u = String((l && l.url) || "").toLowerCase();
    if (u.charAt(0) === "#") return SOCIAL.mail;   // in-page jump, e.g. "#contact"
    if (u.indexOf("github.com") !== -1) return SOCIAL.github;
    if (u.indexOf("linkedin.com") !== -1) return SOCIAL.linkedin;
    if (u.indexOf("youtube.com") !== -1 || u.indexOf("youtu.be") !== -1 || u.indexOf("vimeo.com") !== -1) return SOCIAL.video;
    if (u.indexOf("mailto:") === 0) return SOCIAL.mail;
    if (/\.pdf($|[?#])/.test(u) || u.indexOf("doi.org") !== -1 || u.indexOf("arxiv.org") !== -1 ||
        u.indexOf("ieee.org") !== -1 || u.indexOf("researchgate") !== -1) return SOCIAL.doc;
    return SOCIAL.link;
  }
  var CHEVRON = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ------------------------------ THEME ----------------------------------- */
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var m = $("#meta-theme-color");
    if (m) m.setAttribute("content", theme === "dark" ? "#0d1220" : "#f5f6f9");
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(saved || (mq && mq.matches ? "dark" : "light"));

    var t = $("#theme-toggle");
    if (t) t.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });

    // follow the OS only while the visitor hasn't made an explicit choice
    if (mq && mq.addEventListener) mq.addEventListener("change", function (e) {
      var explicit = null;
      try { explicit = localStorage.getItem("theme"); } catch (err) {}
      if (!explicit) setTheme(e.matches ? "dark" : "light");
    });
  }

  /* ------------------------------ LANGUAGE -------------------------------- */
  /* Static UI strings: data-i18n = textContent, -ph = placeholder,
     -aria = aria-label, -title = title. */
  function applyStaticStrings() {
    document.documentElement.setAttribute("lang", LANG);
    var map = { "data-i18n": null, "data-i18n-ph": "placeholder", "data-i18n-aria": "aria-label", "data-i18n-title": "title" };
    Object.keys(map).forEach(function (attr) {
      $$("[" + attr + "]").forEach(function (el) {
        var k = el.getAttribute(attr);
        if (T[k] == null) return;
        if (map[attr]) el.setAttribute(map[attr], T[k]);
        else el.textContent = T[k];
      });
    });
    // the button shows the language you'd switch TO
    var label = $("#lang-label");
    if (label) label.textContent = LANG === "fr" ? "EN" : "FR";
  }

  /* Swap language in place — no reload, so scroll position and the current
     filter selection survive. */
  function setLang(next) {
    if (next === LANG) return;
    LANG = next;
    T = I18N[LANG];
    try { localStorage.setItem("lang", LANG); } catch (e) {}

    var saved = readState();
    var openIds = records.filter(function (r) { return r.open; }).map(function (r) { return r.id; });
    hideTip();
    applyStaticStrings();
    [$("#hero-cta"), $("#hero-stats"), $("#footer-links"), $("#filters"), $("#timeline-list"),
     $("#highlights-grid"), $("#map-inner"), $("#skills-grid")].forEach(empty);
    records = [];
    groupEls = [];
    recordById = {};
    renderAll();
    writeState(saved);
    openIds.forEach(function (id) { setOpen(recordById[id], true); });
    applyFilters();
    revealAll();          // already-visible content shouldn't re-animate
  }
  function initLang() {
    applyStaticStrings();
    var btn = $("#lang-toggle");
    if (btn) btn.addEventListener("click", function () { setLang(LANG === "fr" ? "en" : "fr"); });
  }

  /* ------------------------------- HERO ----------------------------------- */
  /* icon + label link, built as nodes so label text is never parsed as HTML */
  function iconLink(cls, href, ico, label, external) {
    var a = h("a", { class: cls, href: href, html: ico }, h("span", {}, label));
    if (external) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
    return a;
  }

  function renderHero() {
    var p = DATA.profile || {};
    $("#hero-role").textContent = tf(p, "role") || "";
    $("#hero-name").textContent = p.name || "";
    $("#hero-tagline").textContent = tf(p, "tagline") || "";
    $("#hero-summary").textContent = tf(p, "summary") || "";

    // where they're based (skipped entirely when profile.location is empty)
    var locEl = $("#hero-loc"), loc = tf(p, "location");
    empty(locEl);
    locEl.hidden = !loc;
    if (loc) { locEl.innerHTML = SOCIAL.pin; locEl.appendChild(h("span", {}, loc)); }

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
    cta.appendChild(h("a", { class: "btn btn-primary", href: "#timeline", html: T.explore + " " + SOCIAL.arrow }));
    if (p.cv) cta.appendChild(iconLink("btn btn-ghost", p.cv, SOCIAL.cv, T.cv, true));
    if (p.github) cta.appendChild(iconLink("btn btn-ghost", p.github, SOCIAL.github, "GitHub", true));

    // stats
    var stats = $("#hero-stats");
    (p.stats || []).forEach(function (s) {
      stats.appendChild(h("li", {}, h("span", { class: "stat-value" }, s.value), h("span", { class: "stat-label" }, tf(s, "label"))));
    });

    // footer
    var fl = $("#footer-links");
    if (p.email)    fl.appendChild(iconLink("btn btn-ghost", "mailto:" + p.email, SOCIAL.mail, p.email));
    if (p.linkedin) fl.appendChild(iconLink("btn btn-ghost", p.linkedin, SOCIAL.linkedin, "LinkedIn", true));
    if (p.github)   fl.appendChild(iconLink("btn btn-ghost", p.github, SOCIAL.github, "GitHub", true));
    if (p.phone)    fl.appendChild(iconLink("btn btn-ghost", "tel:" + p.phone.replace(/\s+/g, ""), SOCIAL.phone, p.phone));
    if (p.cv)       fl.appendChild(iconLink("btn btn-ghost", p.cv, SOCIAL.cv, T.cv, true));

    var now = new Date();
    function pad2(n) { return (n < 10 ? "0" : "") + n; }
    var updated = p.updated
      ? String(p.updated).replace(/-/g, "/")
      : now.getFullYear() + "/" + pad2(now.getMonth() + 1) + "/" + pad2(now.getDate());
    $("#footer-copy").textContent = "© " + now.getFullYear() + " " + (p.name || "");
    $("#footer-built").textContent = T.footer_built;
    $("#footer-date").textContent = updated;
  }

  /* ------------------------------ FILTERS --------------------------------- */
  /* how many timeline entries each category holds — shown on the chip */
  var CAT_COUNTS = (function () {
    var n = {};
    (DATA.timeline || []).forEach(function (it) {
      (it.categories || []).forEach(function (id) { n[id] = (n[id] || 0) + 1; });
    });
    return n;
  })();

  function renderFilters() {
    var box = $("#filters");
    (DATA.categories || []).forEach(function (c) {
      box.appendChild(h("button", {
        class: "chip", type: "button", "aria-pressed": "true",
        dataset: { cat: c.id }, style: "--cat:" + c.color,
        onclick: function (ev) {
          // plain click toggles; ⌘/Ctrl-click isolates this one category
          if (ev.metaKey || ev.ctrlKey) {
            var only = this.dataset.cat;
            $$("#filters .chip").forEach(function (ch) {
              ch.setAttribute("aria-pressed", ch.dataset.cat === only ? "true" : "false");
            });
          } else {
            this.setAttribute("aria-pressed", this.getAttribute("aria-pressed") === "true" ? "false" : "true");
          }
          applyFilters();
        }
      },
        h("span", { class: "dot" }),
        h("span", { class: "label" }, tf(c, "label")),
        h("span", { class: "count" }, String(CAT_COUNTS[c.id] || 0))));
    });
  }

  /* ------------------------------ TIMELINE -------------------------------- */
  var records = [];     // one per entry, in timeline order — see renderTimeline()
  var groupEls = [];    // { section, items:[el,...] }
  var recordById = {};  // entry id → record

  function searchText(it) {
    var parts = [tf(it, "title"), tf(it, "org"), tf(it, "location"), tf(it, "summary")]
      .concat(tf(it, "highlights") || []).concat(tf(it, "tags") || [])
      .concat((it.categories || []).map(catLabel));
    return norm(parts.join(" "));
  }

  function buildCard(it, rec) {
    var color = catColor((it.categories || [])[0]);
    var ongoing = it.end === "present";

    var loc = tf(it, "location");
    var summary = tf(it, "summary");
    var highlights = tf(it, "highlights") || [];
    var tags = tf(it, "tags");

    var head = h("div", {},
      h("span", { class: "tl-date" }, dateRange(it), ongoing ? h("span", { class: "tl-now" }, T.now) : null),
      h("h3", { class: "tl-title" },
        tf(it, "title"),
        it.featured ? h("span", { class: "tl-star", title: T.hl_star }, "★") : null),
      h("div", { class: "tl-org" },
        tf(it, "org") || "",
        loc ? [h("span", { class: "sep" }, " · "), h("span", { class: "tl-loc" }, loc)] : null)
    );

    var card = h("div", { class: "tl-card" }, head);

    if (summary) card.appendChild(h("p", { class: "tl-summary" }, summary));

    var bullets = highlights.length
      ? h("ul", { class: "tl-highlights" }, highlights.map(function (x) { return h("li", {}, x); }))
      : null;
    var im = null;
    if (it.image) {
      im = h("img", { class: "tl-img", src: it.image, alt: tf(it, "title") || "", loading: "lazy" });
      im.addEventListener("error", function () { im.remove(); }); // missing image → just hide it
    }

    // Bullets and images sit behind a toggle so 40+ cards stay scannable. A lone
    // bullet isn't worth a click, so it stays inline.
    if (highlights.length > 1 || im) {
      var detailsId = rec.id + "-details";
      rec.details = h("div", { class: "tl-details", id: detailsId, hidden: "" }, bullets, im);
      rec.toggle = h("button", {
        class: "tl-more", type: "button", "aria-expanded": "false", "aria-controls": detailsId,
        onclick: function () { setOpen(rec, !rec.open); updateExpandAll(); }
      }, h("span", { class: "tl-more-label" }, T.details_show), h("span", { class: "tl-more-ico", html: CHEVRON }));
      rec.detailText = norm(highlights.join(" "));
      card.appendChild(rec.toggle);
      card.appendChild(rec.details);
    } else if (bullets) {
      card.appendChild(bullets);
    }

    if (tags && tags.length) {
      card.appendChild(h("div", { class: "tl-tags" }, tags.map(function (t) { return h("span", { class: "tl-tag" }, t); })));
    }

    if (it.categories && it.categories.length) {
      card.appendChild(h("div", { class: "tl-cats" }, it.categories.map(function (cid) {
        return h("span", { class: "tl-cat", style: "--c:" + catColor(cid) }, h("span", { class: "d" }), catLabel(cid));
      })));
    }

    if (it.links && it.links.length) {
      card.appendChild(h("div", { class: "tl-links" }, it.links.map(function (l) {
        // "#…" links jump within the page, so they stay in this tab
        return iconLink("tl-link", l.url, linkIcon(l), tf(l, "label") || l.url, String(l.url).charAt(0) !== "#");
      })));
    }

    var marker = h("div", { class: "tl-marker", html: icon(it.kind) });
    // tabindex lets a jump from a highlight tile or the map move keyboard focus here
    rec.el = h("div", { class: "tl-item reveal", id: rec.id, tabindex: "-1", style: "--cat:" + color }, marker, card);
    return rec.el;
  }

  function setOpen(r, open) {
    if (!r || !r.details) return;
    r.open = !!open;
    r.details.hidden = !r.open;
    r.toggle.setAttribute("aria-expanded", r.open ? "true" : "false");
    r.toggle.querySelector(".tl-more-label").textContent = r.open ? T.details_hide : T.details_show;
  }
  /* "Expand all" acts on the cards currently visible, and flips to "Collapse all"
     once they're all open. */
  function updateExpandAll() {
    var b = $("#expand-all");
    if (!b) return;
    var vis = records.filter(function (r) { return r.details && !r.el.hidden; });
    var allOpen = vis.length > 0 && vis.every(function (r) { return r.open; });
    b.hidden = !vis.length;
    b.dataset.mode = allOpen ? "collapse" : "expand";
    b.textContent = allOpen ? T.collapse_all : T.expand_all;
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
        var pill = h("span", { class: y === "upcoming" ? "pill upcoming" : "pill" },
                     y === "upcoming" ? T.upcoming : String(y));
        section = h("div", { class: "tl-group" }, h("div", { class: "tl-year" }, pill));
        itemsWrap = section;
        groupEls.push({ section: section, items: groupItems, pill: pill });
        list.appendChild(section);
      }
      var idx = (DATA.timeline || []).indexOf(it);
      var rec = {
        it: it, id: ENTRY_IDS[idx], el: null,
        cats: it.categories || [], featured: !!it.featured, present: it.end === "present",
        text: searchText(it),        // current language — what the search box matches
        textAll: FULLTEXT[idx],      // both languages — what skill links match
        details: null, toggle: null, detailText: "", open: false,
        mark: null                   // its bar on the career map
      };
      var row = buildCard(it, rec);
      itemsWrap.appendChild(row);
      groupItems.push(row);
      records.push(rec);
      recordById[rec.id] = rec;
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
  function pressed(sel) { var b = $(sel); return b && b.getAttribute("aria-pressed") === "true"; }
  function applyFilters() {
    var active = activeSet();
    var q = norm(($("#search").value || "").trim());
    var onlyFeatured = pressed("#only-featured");
    var onlyPresent = pressed("#only-present");
    var skill = activeSkill && SKILL_INDEX[activeSkill];
    var shown = 0, i, r;
    for (i = 0; i < records.length; i++) {
      r = records[i];
      var okCat = r.cats.some(function (c) { return active[c]; });
      var okQ = !q || r.text.indexOf(q) !== -1;
      var okFeatured = !onlyFeatured || r.featured;
      var okPresent = !onlyPresent || r.present;
      var okSkill = !skill || skill.re.test(r.textAll);
      var vis = okCat && okQ && okFeatured && okPresent && okSkill;
      r.el.hidden = !vis;
      if (r.mark) r.mark.classList.toggle("is-dim", !vis);
      // a search hit inside the collapsed bullets shouldn't need a click to find
      if (vis && q && r.details && !r.open && r.detailText.indexOf(q) !== -1) setOpen(r, true);
      if (vis) shown++;
    }
    for (i = 0; i < groupEls.length; i++) {
      var any = groupEls[i].items.some(function (el) { return !el.hidden; });
      groupEls[i].section.hidden = !any;
    }
    $("#result-count").textContent = T.shown(shown, records.length);
    $("#empty-state").hidden = shown !== 0;
    updateExpandAll();
    syncUrl();
  }

  /* ------------------------- SHAREABLE URL STATE -------------------------- */
  /* Current selection as a plain object — also used to carry state across a
     language switch, which re-renders the chips from scratch. */
  function readState() {
    var on = [];
    $$("#filters .chip").forEach(function (c) {
      if (c.getAttribute("aria-pressed") === "true") on.push(c.dataset.cat);
    });
    return {
      q: ($("#search").value || "").trim(),
      cats: on,
      featured: pressed("#only-featured"),
      present: pressed("#only-present"),
      skill: activeSkill
    };
  }
  function writeState(s) {
    if (!s) return;
    $("#search").value = s.q || "";
    $$("#filters .chip").forEach(function (c) {
      c.setAttribute("aria-pressed", s.cats.indexOf(c.dataset.cat) !== -1 ? "true" : "false");
    });
    var f = $("#only-featured"), p = $("#only-present");
    if (f) f.setAttribute("aria-pressed", s.featured ? "true" : "false");
    if (p) p.setAttribute("aria-pressed", s.present ? "true" : "false");
    setSkill(s.skill && SKILL_INDEX[s.skill] ? s.skill : "");
  }

  function syncUrl() {
    var s = readState();
    var all = (DATA.categories || []).length;
    var parts = [];
    if (LANG !== "en") parts.push("lang=" + LANG);
    if (s.q) parts.push("q=" + encodeURIComponent(s.q));
    // only serialise categories when it isn't the default "everything on"
    if (s.cats.length !== all) parts.push("cat=" + (s.cats.length ? s.cats.join(",") : "none"));
    if (s.featured) parts.push("featured=1");
    if (s.present) parts.push("present=1");
    if (s.skill) parts.push("skill=" + encodeURIComponent(s.skill));
    var url = location.pathname + (parts.length ? "?" + parts.join("&") : "") + location.hash;
    try { history.replaceState(null, "", url); } catch (e) {}   // throws on file://
  }
  /* Seed the controls from ?q=…&cat=… on first load. */
  function applyUrlState() {
    var all = (DATA.categories || []).map(function (c) { return c.id; });
    var cats = all;
    if (URLQ.cat === "none") cats = [];
    else if (URLQ.cat) cats = URLQ.cat.split(",").filter(function (id) { return all.indexOf(id) !== -1; });
    writeState({
      q: URLQ.q || "",
      cats: cats,
      featured: URLQ.featured === "1",
      present: URLQ.present === "1",
      skill: URLQ.skill || ""
    });
  }
  function setAllChips(on) {
    var chips = $("#filters").querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) chips[i].setAttribute("aria-pressed", on ? "true" : "false");
  }
  function wireToggle(sel) {
    var b = $(sel);
    if (b) b.addEventListener("click", function () {
      this.setAttribute("aria-pressed", this.getAttribute("aria-pressed") === "true" ? "false" : "true");
      applyFilters();
    });
  }
  function clearToggles() {
    var b1 = $("#only-featured"), b2 = $("#only-present");
    if (b1) b1.setAttribute("aria-pressed", "false");
    if (b2) b2.setAttribute("aria-pressed", "false");
  }
  function resetAll() { setAllChips(true); clearToggles(); setSkill(""); $("#search").value = ""; applyFilters(); }
  function wireControls() {
    $("#search").addEventListener("input", applyFilters);
    $("#select-all").addEventListener("click", function () { setAllChips(true); applyFilters(); });
    $("#clear-all").addEventListener("click", function () { setAllChips(false); applyFilters(); });
    $("#reset").addEventListener("click", resetAll);
    $("#empty-reset").addEventListener("click", resetAll);
    wireToggle("#only-featured");
    wireToggle("#only-present");

    var ex = $("#expand-all");
    if (ex) ex.addEventListener("click", function () {
      var open = ex.dataset.mode !== "collapse";
      records.forEach(function (r) { if (r.details && !r.el.hidden) setOpen(r, open); });
      updateExpandAll();
    });
    var sk = $("#skill-active");
    if (sk) sk.addEventListener("click", function () { setSkill(""); applyFilters(); });
    var ms = $(".map-scroll");
    if (ms) ms.addEventListener("scroll", hideTip, { passive: true });

    // "/" jumps to the search box, Escape clears it
    document.addEventListener("keydown", function (ev) {
      var el = document.activeElement;
      var typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (ev.key === "/" && !typing && !ev.metaKey && !ev.ctrlKey) {
        ev.preventDefault();
        $("#search").focus();
        $("#search").select();
      } else if (ev.key === "Escape" && el === $("#search")) {
        if ($("#search").value) { $("#search").value = ""; applyFilters(); }
        else el.blur();
      }
    });
  }

  /* ----------------------- BACK TO TOP + ACTIVE NAV ----------------------- */
  function initChrome() {
    var top = $("#to-top");
    if (top) {
      top.addEventListener("click", function () {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      });
      var ticking = false;
      window.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          top.hidden = window.pageYOffset < 600;
          ticking = false;
        });
      }, { passive: true });
    }

    // highlight the nav link for whichever section is crossing mid-viewport
    if (!("IntersectionObserver" in window)) return;
    var links = {};
    $$(".site-nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          $$(".site-nav a").forEach(function (x) { x.removeAttribute("aria-current"); });
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }

  /* ------------------------- JUMPING TO AN ENTRY -------------------------- */
  /* Shared by highlight tiles, map bars and #entry-… links: un-filter the card if
     it's hidden, open it, scroll it clear of the sticky header and filter bar,
     and pulse it so the eye lands on it. */
  function pageTop(el) { var y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }
  /* how far below the viewport top a card must land to clear the sticky header
     and, where it sticks, the filter bar */
  function jumpOffset() {
    var off = 12, hd = $(".site-header"), ctl = $(".controls");
    if (hd) off += hd.offsetHeight;
    if (ctl && window.getComputedStyle(ctl).position === "sticky") off += ctl.offsetHeight;
    return off;
  }
  /* mirrored into CSS as the cards' scroll-margin, so the browser's own jump to
     an #entry-… anchor (on load, or a hand-edited hash) lands in the same place */
  function syncJumpOffset() {
    document.documentElement.style.setProperty("--jump-offset", jumpOffset() + "px");
  }
  function scrollToEl(el, instant) {
    var top = Math.max(0, pageTop(el) - jumpOffset());
    if (instant) {
      // behavior "auto" would defer to the page's CSS smooth scrolling
      var html = document.documentElement, prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, top);
      html.style.scrollBehavior = prev;
    } else {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
    }
  }
  function focusEntry(id, instant) {
    var r = recordById[id];
    if (!r) return;
    if (r.el.hidden) resetAll();
    setOpen(r, true);
    updateExpandAll();
    r.el.classList.add("in");                      // skip the scroll-reveal fade
    try { history.replaceState(null, "", location.pathname + location.search + "#" + id); } catch (e) {}
    scrollToEl(r.el, instant);
    r.el.focus({ preventScroll: true });
    r.el.classList.remove("is-flash");
    void r.el.offsetWidth;                         // restart the pulse if it's already running
    r.el.classList.add("is-flash");
    clearTimeout(r.flashTimer);
    r.flashTimer = setTimeout(function () { r.el.classList.remove("is-flash"); }, 1800);
  }
  /* a plain click jumps in-page; modified clicks keep the browser's own behaviour */
  function jumpHandler(id) {
    return function (ev) {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      ev.preventDefault();
      hideTip();
      focusEntry(id);
    };
  }
  function openFromHash(instant) {
    var id = location.hash.slice(1);
    if (/^entry-/.test(id) && recordById[id]) focusEntry(id, instant);
  }

  /* ----------------------------- HIGHLIGHTS ------------------------------- */
  /* `featured` entries as large tiles above the timeline, newest first. */
  function renderHighlights() {
    var grid = $("#highlights-grid");
    if (!grid) return;
    var feat = records.filter(function (r) { return r.featured; });   // already in timeline order
    $("#highlights").hidden = !feat.length;
    feat.forEach(function (r) {
      var it = r.it, summary = tf(it, "summary"), org = tf(it, "org");
      grid.appendChild(h("a", {
        class: "hl-tile reveal", href: "#" + r.id, style: "--cat:" + catColor((it.categories || [])[0]),
        onclick: jumpHandler(r.id)
      },
        h("div", { class: "hl-top" },
          h("span", { class: "hl-ico", html: icon(it.kind) }),
          h("span", { class: "hl-date" }, dateRange(it)),
          it.end === "present" ? h("span", { class: "tl-now" }, T.now) : null),
        h("h3", { class: "hl-title" }, tf(it, "title")),
        org ? h("p", { class: "hl-org" }, org) : null,
        summary ? h("p", { class: "hl-sum" }, summary) : null,
        h("span", { class: "hl-go" }, T.hl_open, h("span", { class: "hl-go-ico", html: SOCIAL.arrow }))));
    });
  }

  /* ------------------------------ CAREER MAP ------------------------------ */
  /* Every entry as a bar (or a dot, for one-off events) on a shared time axis,
     one lane per kind of activity — a compressed view of what ran in parallel.
     Bars that overlap inside a lane are packed onto extra rows. */
  var LANES = ["work", "education", "projects", "leadership", "awards", "personal"];
  var MAP_ROW = 16;   // px per packed row
  function laneOf(it) {
    if ((it.categories || []).indexOf("personal") !== -1) return "personal";
    return { experience: "work", research: "work", education: "education", project: "projects",
             leadership: "leadership", honor: "awards", certification: "awards" }[it.kind] || "projects";
  }
  function renderMap() {
    var inner = $("#map-inner");
    if (!inner || !records.length) return;
    var now = new Date();
    var NOW = now.getFullYear() * 12 + now.getMonth() + (now.getDate() - 1) / 31;
    var years = records.filter(function (r) { return r.it.start !== "upcoming"; })
                       .map(function (r) { return parseInt(r.it.start, 10); });
    // anything older than ~5 years is clipped at the left edge rather than
    // squashing the recent, busy part of the axis
    var fromY = Math.max(Math.min.apply(null, years), now.getFullYear() - 5);
    var FROM = fromY * 12, TO = Math.floor(NOW) + 7;   // room after today for upcoming entries
    function pct(m) { return (Math.max(FROM, Math.min(TO, m)) - FROM) / (TO - FROM) * 100; }

    var lanes = {};
    records.forEach(function (r) {
      var it = r.it, sp = { r: r, kind: "bar" };
      if (it.start === "upcoming") { sp.s = Math.floor(NOW) + 1; sp.e = TO; sp.kind = "upcoming"; }
      else {
        sp.s = monthIdx(it.start);
        if (it.end === "present") sp.e = NOW;
        else if (it.end) sp.e = monthIdx(it.end) + 1;
        else { sp.kind = "point"; sp.s += 0.5; sp.e = sp.s; }
      }
      var name = laneOf(it);
      (lanes[name] = lanes[name] || []).push(sp);
    });

    var used = LANES.filter(function (n) { return lanes[n]; });
    used.forEach(function (name) {
      var rowEnds = [];
      lanes[name].sort(function (a, b) { return a.s - b.s; }).forEach(function (sp) {
        var a = sp.kind === "point" ? sp.s - 1 : sp.s, b = sp.kind === "point" ? sp.s + 1 : sp.e;
        var row = 0;
        while (row < rowEnds.length && rowEnds[row] + 0.4 > a) row++;
        rowEnds[row] = b;
        sp.row = row;
      });
      lanes[name].rows = rowEnds.length;
    });

    // axis: each year's label centred in its span, a line where each new one starts
    var axis = h("div", { class: "map-axis" });
    var lines = h("div", { class: "map-lines", style: "grid-row:2 / span " + used.length });
    for (var y = fromY; y * 12 < TO; y++) {
      var a = Math.max(FROM, y * 12), b = Math.min(TO, (y + 1) * 12);
      if (b - a >= 3) axis.appendChild(h("span", { style: "left:" + pct((a + b) / 2) + "%" }, String(y)));
      if (y > fromY) lines.appendChild(h("span", { class: "map-yr", style: "left:" + pct(y * 12) + "%" }));
    }
    lines.appendChild(h("span", { class: "map-now", style: "left:" + pct(NOW) + "%" }));
    // blank corners keep the sticky label column opaque above and below the lanes,
    // so year labels don't show through it when the map scrolls sideways
    inner.appendChild(h("div", { class: "map-corner", style: "grid-row:1" }));
    inner.appendChild(h("div", { class: "map-corner", style: "grid-row:" + (used.length + 2) }));
    inner.appendChild(axis);
    inner.appendChild(lines);

    used.forEach(function (name, i) {
      var row = "grid-row:" + (i + 2);
      inner.appendChild(h("div", { class: "map-label", style: row }, T.lanes[name]));
      var track = h("div", { class: "map-track", style: row + ";height:" + (lanes[name].rows * MAP_ROW + 8) + "px" });
      lanes[name].forEach(function (sp) {
        var r = sp.r, it = r.it;
        var style = "--c:" + catColor((it.categories || [])[0]) + ";top:" + (4 + sp.row * MAP_ROW) + "px;left:" + pct(sp.s) + "%";
        if (sp.kind !== "point") style += ";width:" + (pct(sp.e) - pct(sp.s)) + "%";
        var m = h("a", {
          class: "map-mark is-" + sp.kind + (sp.s < FROM ? " is-clipped" : ""),
          href: "#" + r.id, tabindex: "-1", style: style,
          onclick: jumpHandler(r.id),
          onmouseenter: function () { showTip(m, r); },
          onmouseleave: hideTip
        });
        r.mark = m;
        track.appendChild(m);
      });
      inner.appendChild(track);
    });
    inner.appendChild(h("div", { class: "map-foot", style: "grid-row:" + (used.length + 2) },
      h("span", { style: "left:" + pct(NOW) + "%" }, T.map_today)));
    // where the map has to scroll (phones), start at the recent end, not in 2021
    inner.parentNode.scrollLeft = inner.parentNode.scrollWidth;
  }
  function showTip(mark, r) {
    var tip = $("#map-tip"), box = $("#career-map");
    if (!tip || !box) return;
    empty(tip);
    tip.appendChild(h("strong", {}, tf(r.it, "title")));
    tip.appendChild(h("span", {}, [dateRange(r.it), tf(r.it, "org")].filter(Boolean).join(" · ")));
    tip.hidden = false;
    var b = box.getBoundingClientRect(), m = mark.getBoundingClientRect();
    var half = tip.offsetWidth / 2;
    var x = Math.max(half + 4, Math.min(b.width - half - 4, m.left - b.left + m.width / 2));
    tip.style.left = x + "px";
    tip.style.top = (m.top - b.top - tip.offsetHeight - 8) + "px";
  }
  function hideTip() { var t = $("#map-tip"); if (t) t.hidden = true; }

  /* ----------------------- STRUCTURED DATA (SEO) -------------------------- */
  /* A schema.org Person built from data.js, so search engines and the tools
     recruiters use get the profile without re-typing it in the HTML. */
  function renderJsonLd() {
    var p = DATA.profile || {};
    var old = $("#jsonld");
    if (old) old.parentNode.removeChild(old);

    function abs(u) { try { return new URL(u, location.href).href; } catch (e) { return u; } }
    var sameAs = [p.github, p.linkedin].filter(Boolean);
    var knowsAbout = [];
    (DATA.skills || []).forEach(function (g) { knowsAbout = knowsAbout.concat(tf(g, "items") || []); });
    var alumniOf = [];
    (DATA.timeline || []).forEach(function (it) {
      var org = tf(it, "org");
      if (it.kind === "education" && org && alumniOf.indexOf(org) === -1) alumniOf.push(org);
    });

    var person = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: p.name,
      url: abs(location.pathname),
      jobTitle: tf(p, "role"),
      description: tf(p, "summary"),
      image: p.photo ? abs(p.photo) : undefined,
      email: p.email ? "mailto:" + p.email : undefined,
      telephone: p.phone || undefined,
      address: tf(p, "location") ? { "@type": "PostalAddress", addressLocality: tf(p, "location") } : undefined,
      sameAs: sameAs.length ? sameAs : undefined,
      knowsAbout: knowsAbout.length ? knowsAbout : undefined,
      alumniOf: alumniOf.length ? alumniOf.map(function (n) { return { "@type": "EducationalOrganization", name: n }; }) : undefined
    };

    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "jsonld";
    s.textContent = JSON.stringify(person);
    document.head.appendChild(s);
  }

  /* ------------------------------- SKILLS --------------------------------- */
  /* Each entry's text in both languages, so a skill links to the same entries
     whichever language is showing. Index-aligned with DATA.timeline. */
  var FULLTEXT = (DATA.timeline || []).map(function (it) {
    function flat(v) { return Array.isArray(v) ? v.join(" ") : (v || ""); }
    return norm(["title", "org", "summary", "highlights", "tags"].map(function (k) {
      return flat(it[k]) + " " + flat(it[k + "_fr"]);
    }).join(" "));
  });

  /* A skill becomes a filter when it matches at least one entry. Matching is
     whole-word ("RAG" must not hit "average", "Assembly" must not hit
     "assembly-line"), tries every "/"-separated alias in both languages, and
     allows a version suffix ("YOLO" finds "YOLOv5"). Groups marked
     `link: false` in data.js are never linked. Keyed by the English label. */
  var SKILL_INDEX = (function () {
    var idx = {}, B = "[^a-z0-9+#-]";
    function aliases(s) {
      return String(s || "").split(/\s+—\s+|\(/)[0].split("/")
        .map(function (a) { return norm(a.trim()); }).filter(Boolean);
    }
    function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
    (DATA.skills || []).forEach(function (g) {
      if (g.link === false) return;
      (g.items || []).forEach(function (key, i) {
        var al = aliases(key).concat(g.items_fr ? aliases(g.items_fr[i]) : []);
        var re = new RegExp("(^|" + B + ")(?:" + al.map(function (a) {
          return esc(a) + (a.length >= 3 ? "(?:v?\\d[\\d.]*)?" : "");
        }).join("|") + ")(?=" + B + "|$)");
        var count = FULLTEXT.filter(function (t) { return re.test(t); }).length;
        if (count) idx[key] = { re: re, count: count, group: g, i: i };
      });
    });
    return idx;
  })();

  var activeSkill = "";   // English label of the skill filtering the timeline, or ""
  function skillLabel(key) {
    var s = SKILL_INDEX[key];
    return s ? (tf(s.group, "items") || [])[s.i] || key : key;
  }
  function setSkill(key) {
    activeSkill = key || "";
    var chip = $("#skill-active");
    if (chip) {
      chip.hidden = !activeSkill;
      $("#skill-active-label").textContent = activeSkill ? T.skill_chip(skillLabel(activeSkill)) : "";
      chip.setAttribute("aria-label", T.skill_clear + (activeSkill ? " — " + skillLabel(activeSkill) : ""));
      chip.title = T.skill_clear;
    }
    $$(".skill-link").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.skill === activeSkill ? "true" : "false");
    });
  }
  /* Clicking a skill shows exactly the entries that use it: other filters are
     cleared, the matches open, and the view moves to the first one. Clicking
     the active skill again clears it. */
  function pickSkill(key) {
    if (activeSkill === key) { setSkill(""); applyFilters(); return; }
    setAllChips(true);
    clearToggles();
    $("#search").value = "";
    setSkill(key);
    applyFilters();
    var shown = records.filter(function (r) { return !r.el.hidden; });
    shown.forEach(function (r) { setOpen(r, true); });
    updateExpandAll();
    if (shown.length) scrollToEl(shown[0].el.parentNode);   // its year group, so the heading shows
  }

  function renderSkills() {
    var grid = $("#skills-grid");
    (DATA.skills || []).forEach(function (g) {
      grid.appendChild(h("div", { class: "skill-group reveal" },
        h("h3", {}, tf(g, "group")),
        h("ul", {}, (tf(g, "items") || []).map(function (label, i) {
          var key = (g.items || [])[i], s = g.link !== false && SKILL_INDEX[key];
          if (!s) return h("li", {}, label);
          return h("li", { class: "is-link" }, h("button", {
            class: "skill-link", type: "button", dataset: { skill: key },
            "aria-pressed": activeSkill === key ? "true" : "false",
            title: T.skill_show(s.count, label),
            onclick: function () { pickSkill(key); }
          }, label));
        }))));
    });
  }

  /* ------------------------------- REVEAL --------------------------------- */
  function revealAll() { $$(".reveal").forEach(function (e) { e.classList.add("in"); }); }
  function initReveal() {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealAll();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    $$(".reveal").forEach(function (e) { io.observe(e); });
  }

  /* -------------------------------- INIT ---------------------------------- */
  /* Everything that reads content out of data.js — re-run on a language swap. */
  function renderAll() {
    renderHero();
    renderFilters();
    renderTimeline();
    renderHighlights();   // these two read the records renderTimeline builds
    renderMap();
    renderSkills();
    renderJsonLd();
  }

  initTheme();
  initLang();
  renderAll();
  applyUrlState();
  wireControls();
  applyFilters();
  if (activeSkill) {      // a shared ?skill= link opens its matches, like a click would
    records.forEach(function (r) { if (!r.el.hidden) setOpen(r, true); });
    updateExpandAll();
  }
  initReveal();
  initChrome();

  // #entry-… deep links: the cards don't exist when the browser first looks for
  // the anchor, so jump by hand, and again once web fonts have reflowed the page
  syncJumpOffset();
  window.addEventListener("resize", syncJumpOffset, { passive: true });
  openFromHash(true);
  if (/^#entry-/.test(location.hash) && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { var r = recordById[location.hash.slice(1)]; if (r) scrollToEl(r.el, true); });
  }
  window.addEventListener("hashchange", function () { openFromHash(false); });
})();
