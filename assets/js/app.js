/* =============================================================================
   Portfolio renderer + filtering.
   Reads window.PORTFOLIO (assets/js/data.js) and builds the page.
   You normally never need to edit this file: change content in data.js.
   ============================================================================= */
(function () {
  "use strict";
  var DATA = window.PORTFOLIO;
  if (!DATA) { console.error("PORTFOLIO data not found: check assets/js/data.js"); return; }

  /* ------------------------------- i18n ----------------------------------- */
  /* UI strings. Content (timeline / profile / skills) is translated in data.js
     via parallel `*_fr` fields (see tf() below). */
  var I18N = {
    en: {
      nav_about: "About", nav_highlights: "Highlights", nav_timeline: "Timeline", nav_skills: "Skills", nav_blog: "Blog",
      feed: "Atom feed",
      nav_label: "Sections", menu: "Menu", contact_btn: "Contact", skip: "Skip to timeline",
      lang_switch: "FR, switch to French",
      email_me: "Email me", explore: "Explore the timeline", cv: "Download CV", stats_label: "Key figures",
      card_ovr: "OVR",
      card_overall: function (n) { return "Overall rating: " + n + " out of 99"; },
      card_attr: function (name, n) { return name + ": " + n + " out of 99"; },
      card_attrs_label: "Skill ratings",
      card_note: "Self-assessed ratings, out of 99",
      card_photo_alt: function (name) { return "Portrait of " + name; },
      card_flip: "Stats", card_flip_aria: "Stats, turn the card over",
      card_unflip: "Ratings", card_unflip_aria: "Ratings, turn the card back over",
      card_entries: "entries", card_career: "Career",
      card_since: function (d) { return "Since " + d; },
      card_lanes_label: "Entries by kind", card_counted: "Counted from the timeline",
      copy: "Copy the address", copied: "Address copied", copied_tip: "Copied",
      rdv_title: "Rendezvous.",
      rdv_text: "Six robots, each talking only to its two neighbours, agree on where to meet (a consensus protocol",
      rdv_asin: ", as in ", rdv_link: "my rendezvous project",
      rdv_mouse: "Point to lead them, click to scatter them.", rdv_touch: "Tap to scatter them.",
      rdv_still: "One run, solved: each line is a robot's path.",
      rdv_scatter: "Scatter them", rdv_again: "Another run",
      rdv_t: function (s) { return "t = " + s + " s"; },
      rdv_met: function (s) { return "met in " + s + " s"; },
      rdv_follow: "following you",
      hl_h: "Highlights",
      hl_sub: "The work I'd show first. Open one to see it in context in the timeline.",
      hl_open: "View in timeline", hl_star: "In Highlights",
      map_h: "At a glance",
      map_hint: "Each bar is an entry below. Select one to open it.",
      map_today: "Today",
      mirror_since: function (y) { return "since " + y; },
      mirror_before: function (y) { return "before " + y; },
      lanes: { work: "Work & research", education: "Education", projects: "Projects",
               leadership: "Leadership", awards: "Awards & certificates", personal: "Personal" },
      more: "Details", less: "Close", full: "Full details",
      expand_all: "Expand all", collapse_all: "Collapse all",
      fold_show: function (n) { return "Show the " + n + " other activities"; },
      fold_hide: "Hide other activities",
      skill_chip: function (s) { return "Skill: " + s; },
      skill_clear: "clear the filter", skill_clear_title: "Clear the skill filter",
      skill_show: function (n, s) { return n === 1 ? "Show the entry that uses " + s : "Show the " + n + " entries that use " + s; },
      skills_word: "skills",
      timeline_h: "Timeline of efforts",
      timeline_sub: "Every role, project, award and contribution, most important first. Open any card for its details, or filter and sort to focus on what you care about.",
      controls_label: "Filter the timeline",
      search_label: "Search the timeline (roles, tech, organisations)", search_ph: "Search",
      filters: "Filters", filters_active: "active",
      sort_label: "Sort by", sort_importance: "Importance", sort_date: "Date",
      view_label: "View", view_grid: "Grid view", view_list: "List view",
      quick_label: "Quick filters", cats_label: "Categories",
      tiers: { key: "Key work", notable: "Also notable", other: "Other activities" },
      all: "All", none: "None", reset: "Reset",
      featured_only: "Highlights", present_only: "Ongoing",
      filters_hint: "Select a category to show or hide it",
      skills_h: "Skills & toolbox",
      skills_sub: "Technologies and methods used across the work above. Select a highlighted one to see where it was used.",
      contact_h: "Contact",
      empty: "No entries match your filters.", empty_reset: "Reset filters",
      present: "Present", now: "Ongoing",
      upcoming: "Upcoming",
      to_top: "Back to top",
      theme_toggle: "Toggle dark / light",
      footer_built: "Built as a living timeline, last updated on",
      months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      shown: function (a, b) { return a + " of " + b + " shown"; }
    },
    fr: {
      nav_about: "Profil", nav_highlights: "Points forts", nav_timeline: "Parcours", nav_skills: "Compétences", nav_blog: "Blog",
      feed: "Flux Atom",
      nav_label: "Sections", menu: "Menu", contact_btn: "Contact", skip: "Aller au parcours",
      lang_switch: "EN, passer en anglais",
      email_me: "M'écrire", explore: "Explorer le parcours", cv: "Télécharger le CV", stats_label: "Chiffres clés",
      card_ovr: "GÉN",
      card_overall: function (n) { return "Note générale : " + n + " sur 99"; },
      card_attr: function (name, n) { return name + " : " + n + " sur 99"; },
      card_attrs_label: "Notes par compétence",
      card_note: "Notes auto-évaluées, sur 99",
      card_photo_alt: function (name) { return "Portrait " + (/^[aeiouyàâéèêîôh]/i.test(name) ? "d'" : "de ") + name; },
      card_flip: "Stats", card_flip_aria: "Stats, retourner la carte",
      card_unflip: "Notes", card_unflip_aria: "Notes, remettre la carte à l'endroit",
      card_entries: "entrées", card_career: "Parcours",
      card_since: function (d) { return "Depuis " + d; },
      card_lanes_label: "Entrées par type", card_counted: "D'après le parcours",
      copy: "Copier l'adresse", copied: "Adresse copiée", copied_tip: "Copiée",
      rdv_title: "Rendez-vous.",
      rdv_text: "Six robots, chacun ne parlant qu'à ses deux voisins, s'accordent sur un point de rencontre (un protocole de consensus",
      rdv_asin: ", comme dans ", rdv_link: "mon projet de rendez-vous",
      rdv_mouse: "Pointez pour les guider, cliquez pour les disperser.", rdv_touch: "Touchez pour les disperser.",
      rdv_still: "Un essai, résolu : chaque trait est le trajet d'un robot.",
      rdv_scatter: "Les disperser", rdv_again: "Un autre essai",
      rdv_t: function (s) { return "t = " + s + " s"; },
      rdv_met: function (s) { return "réunis en " + s + " s"; },
      rdv_follow: "ils vous suivent",
      hl_h: "Points forts",
      hl_sub: "Les travaux à voir en premier. Ouvrez-en un pour le retrouver dans le parcours.",
      hl_open: "Voir dans le parcours", hl_star: "Dans les points forts",
      map_h: "En un coup d'œil",
      map_hint: "Chaque barre est une entrée ci-dessous. Sélectionnez-en une pour l'ouvrir.",
      map_today: "Aujourd'hui",
      mirror_since: function (y) { return "depuis " + y; },
      mirror_before: function (y) { return "avant " + y; },
      lanes: { work: "Travail & recherche", education: "Formation", projects: "Projets",
               leadership: "Leadership", awards: "Prix & certificats", personal: "Personnel" },
      more: "Détails", less: "Fermer", full: "Tout le détail",
      expand_all: "Tout déplier", collapse_all: "Tout replier",
      fold_show: function (n) { return "Afficher les " + n + " autres activités"; },
      fold_hide: "Masquer les autres activités",
      skill_chip: function (s) { return "Compétence : " + s; },
      skill_clear: "retirer le filtre", skill_clear_title: "Retirer le filtre de compétence",
      skill_show: function (n, s) { return n === 1 ? "Voir l'entrée qui utilise " + s : "Voir les " + n + " entrées qui utilisent " + s; },
      skills_word: "compétences",
      timeline_h: "Parcours et réalisations",
      timeline_sub: "Chaque poste, projet, distinction et contribution, les plus importants d'abord. Ouvrez une carte pour son détail, ou filtrez et triez selon vos intérêts.",
      controls_label: "Filtrer le parcours",
      search_label: "Rechercher dans le parcours (postes, technologies, organisations)", search_ph: "Rechercher",
      filters: "Filtres", filters_active: "actifs",
      sort_label: "Trier par", sort_importance: "Importance", sort_date: "Date",
      view_label: "Affichage", view_grid: "Vue grille", view_list: "Vue liste",
      quick_label: "Filtres rapides", cats_label: "Catégories",
      tiers: { key: "Travaux clés", notable: "Également notables", other: "Autres activités" },
      all: "Tout", none: "Aucun", reset: "Réinitialiser",
      featured_only: "Points forts", present_only: "En cours",
      filters_hint: "Sélectionnez une catégorie pour l'afficher ou la masquer",
      skills_h: "Compétences & outils",
      skills_sub: "Technologies et méthodes utilisées dans les travaux ci-dessus. Sélectionnez une compétence mise en évidence pour voir où elle a servi.",
      contact_h: "Contact",
      empty: "Aucune entrée ne correspond à vos filtres.", empty_reset: "Réinitialiser les filtres",
      present: "Présent", now: "En cours",
      upcoming: "À venir",
      to_top: "Haut de page",
      theme_toggle: "Basculer clair / sombre",
      footer_built: "Conçu comme une frise vivante, dernière mise à jour le",
      months: ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],
      shown: function (a, b) { return a + " sur " + b + " affichées"; }
    }
  };

  /* URL query state: lets a filtered view be bookmarked and shared.
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
  /* read at the moment of each animation, so a change of the setting applies at once */
  function reduceMotion() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  /* crawlers and link previews get the finished page at once (no count-ups),
     as they get no intro (same test as the intro's, in index.html) */
  var BOT = /bot|crawl|spider|slurp|preview|lighthouse|pagespeed|headless/i.test(navigator.userAgent || "");

  /* lowercase + strip accents, so "compiegne" finds "Compiègne" */
  function norm(s) {
    s = String(s == null ? "" : s).toLowerCase();
    return s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s;
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
  /* Group key for the year heading: "upcoming" gets its own group instead of a year. */
  function startYear(it) {
    if (it.start === "upcoming") return "upcoming";
    return parseInt(String(it.start || "0").split("-")[0], 10);
  }
  function dateRange(it) { return it.end ? fmt(it.start) + " – " + fmt(it.end) : fmt(it.start); }
  /* months since year 0; a bare year sits mid-year, as in key() */
  function monthIdx(d) { var p = String(d).split("-"); return (+p[0]) * 12 + (p[1] ? +p[1] - 1 : 5); }
  /* newest first; for the same start, the one that ends later first */
  function byDateIt(a, b) {
    return (key(b.start) - key(a.start)) || (key(b.end || b.start) - key(a.end || a.start));
  }
  /* `importance` 1..5 from data.js (5 = most important); missing or invalid = 3 */
  function imp(it) { var v = +it.importance; return v >= 1 && v <= 5 ? Math.round(v) : 3; }
  function tierOf(it) { var v = imp(it); return v >= 5 ? "key" : v >= 3 ? "notable" : "other"; }

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
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>';

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
      switchTheme(next, t);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });

    // follow the OS only while the visitor hasn't made an explicit choice
    if (mq && mq.addEventListener) mq.addEventListener("change", function (e) {
      var explicit = null;
      try { explicit = localStorage.getItem("theme"); } catch (err) {}
      if (!explicit) setTheme(e.matches ? "dark" : "light");
    });
  }
  /* A click on the toggle: the new theme spreads from the button in a circle
     (a view transition, styles.css "Theme switch") while the button's icon
     turns in. Without view transitions, or under reduced motion, the theme
     simply switches. site.js does the same on the blog pages. */
  function switchTheme(next, btn) {
    var d = document.documentElement;
    if (reduceMotion()) { setTheme(next); return; }
    btn.classList.remove("is-turning");
    void btn.offsetWidth;                          // restart the turn on a quick second click
    btn.classList.add("is-turning");
    clearTimeout(btn.turnTimer);
    btn.turnTimer = setTimeout(function () { btn.classList.remove("is-turning"); }, 700);
    if (!document.startViewTransition) { setTheme(next); return; }
    var b = btn.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
    d.style.setProperty("--vt-x", x.toFixed(0) + "px");
    d.style.setProperty("--vt-y", y.toFixed(0) + "px");
    d.style.setProperty("--vt-r", Math.ceil(Math.sqrt(Math.pow(Math.max(x, innerWidth - x), 2) + Math.pow(Math.max(y, innerHeight - y), 2))) + "px");
    d.classList.add("vt-theme");
    var vt = document.startViewTransition(function () { setTheme(next); });
    function done() { d.classList.remove("vt-theme"); }
    vt.finished.then(done, done);
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
    // the button shows the language you'd switch TO; its name starts with that text
    var label = $("#lang-label"), btn = $("#lang-toggle");
    if (label) label.textContent = LANG === "fr" ? "EN" : "FR";
    if (btn) { btn.setAttribute("aria-label", T.lang_switch); btn.title = T.lang_switch; }
    applyMeta();
  }

  /* Tab title and meta description follow the language. The canonical URL
     does not: the French view is this same page translated in place, so it
     stays the one URL in index.html (search engines get one consistent
     canonical, with or without running this script). */
  var META = (function () {
    var d = $('meta[name="description"]');
    return { title: document.title, desc: d ? d.getAttribute("content") : "" };
  })();
  function applyMeta() {
    var p = DATA.profile || {};
    document.title = tf(p, "pageTitle") || META.title;
    var d = $('meta[name="description"]');
    if (d) d.setAttribute("content", tf(p, "pageDescription") || META.desc);
  }

  /* Swap language in place (no reload), so scroll position, the current
     filter selection, the view, the sort and the opened cards survive. */
  function setLang(next) {
    if (next === LANG) return;
    LANG = next;
    T = I18N[LANG];
    try { localStorage.setItem("lang", LANG); } catch (e) {}

    var saved = readState();
    var levels = {};
    records.forEach(function (r) { if (r.level) levels[r.id] = r.level; });
    hidePeek();
    hideTip();
    closeMenu();
    applyStaticStrings();
    [$("#hero-cta"), $("#hero-stats"), $("#player-card"), $("#footer-links"), $("#filters"), $("#timeline-list"),
     $("#highlights-grid"), $("#map-inner"), $("#skills-grid")].forEach(empty);
    records = [];
    groupEls = [];
    ordered = [];
    recordById = {};
    renderAll();
    writeState(saved);
    Object.keys(levels).forEach(function (id) { setLevel(recordById[id], levels[id]); });
    applyFilters();
    placeInk(true);   // the section links changed width with their labels
  }
  function initLang() {
    applyStaticStrings();
    var btn = $("#lang-toggle");
    // the page cross-fades into the other language (a view transition) rather than flashing
    if (btn) btn.addEventListener("click", function () {
      var next = LANG === "fr" ? "en" : "fr";
      if (document.startViewTransition && !reduceMotion()) document.startViewTransition(function () { setLang(next); });
      else setLang(next);
    });
  }

  /* ------------------------------- HEADER --------------------------------- */
  /* On phones the section links live in a drop-down behind #menu-toggle. */
  function closeMenu() {
    var hd = $(".site-header"), b = $("#menu-toggle");
    if (hd) hd.classList.remove("menu-open");
    if (b) b.setAttribute("aria-expanded", "false");
  }
  function menuOpen() { var hd = $(".site-header"); return !!hd && hd.classList.contains("menu-open"); }
  function initMenu() {
    var b = $("#menu-toggle"), hd = $(".site-header"), nav = $("#site-nav");
    if (!b || !hd || !nav) return;
    b.addEventListener("click", function () {
      var open = !menuOpen();
      hd.classList.toggle("menu-open", open);
      b.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
    });
    nav.addEventListener("click", function (ev) { if (ev.target.closest("a")) closeMenu(); });
    document.addEventListener("click", function (ev) {
      if (menuOpen() && !ev.target.closest("#site-nav") && !ev.target.closest("#menu-toggle")) closeMenu();
    });
  }

  /* ------------------------------- HERO ----------------------------------- */
  /* icon + label link, built as nodes so label text is never parsed as HTML */
  function iconLink(cls, href, ico, label, external) {
    var a = h("a", { class: cls, href: href, html: ico }, h("span", {}, label));
    if (external) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
    return a;
  }

  var firstHero = true;   // the first render, not a language switch
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

    // calls to action: get in touch first, the timeline second
    var cta = $("#hero-cta");
    empty(cta);   // drops the <noscript> fallback
    if (p.email)    cta.appendChild(iconLink("btn btn-primary", "mailto:" + p.email, SOCIAL.mail, T.email_me));
    if (p.linkedin) cta.appendChild(iconLink("btn btn-ghost", p.linkedin, SOCIAL.linkedin, "LinkedIn", true));
    if (p.github)   cta.appendChild(iconLink("btn btn-ghost", p.github, SOCIAL.github, "GitHub", true));
    if (p.cv)       cta.appendChild(iconLink("btn btn-ghost", p.cv, SOCIAL.cv, T.cv, true));
    cta.appendChild(h("a", { class: "hero-explore", href: "#timeline" },
      T.explore, h("span", { class: "hero-explore-ico", html: SOCIAL.arrow })));

    // key figures (on the first render they're set up to count up, see prepStats)
    var box = $("#hero-stats");
    empty(box);   // drops the static copy from index.html
    (p.stats || []).forEach(function (s) {
      box.appendChild(h("li", {}, h("span", { class: "stat-value" }, tf(s, "value")), h("span", { class: "stat-label" }, tf(s, "label"))));
    });
    if (firstHero) { firstHero = false; prepStats(); }

    // footer
    var fl = $("#footer-links");
    empty(fl);
    if (p.email) {
      var mail = iconLink("btn btn-ghost", "mailto:" + p.email, SOCIAL.mail, p.email);
      fl.appendChild(canCopy() ? h("span", { class: "split" }, mail, copyButton(p.email)) : mail);
    }
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

  /* The footer's address gets a copy button beside it (styles.css .split):
     a mailto link needs a mail app the visitor may not have set up. On
     success the icon turns into a tick that draws itself, a small "Copied"
     rises over it, and assistive tech hears "Address copied". Only where the
     clipboard can be written (https or localhost). */
  var COPY_ICONS =
    '<svg class="ico-copy" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg>' +
    '<svg class="ico-check" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function canCopy() { return !!(window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText); }
  function copyButton(text) {
    var b = h("button", { class: "btn btn-ghost copy-btn", type: "button", "aria-label": T.copy, title: T.copy,
                          "data-done": T.copied_tip, html: COPY_ICONS });
    b.addEventListener("click", function () {
      navigator.clipboard.writeText(text).then(function () {
        b.classList.remove("is-copied");
        void b.offsetWidth;                          // a second copy replays the tick
        b.classList.add("is-copied");
        announce(T.copied);
        clearTimeout(b.doneTimer);
        b.doneTimer = setTimeout(function () { b.classList.remove("is-copied"); }, 2000);
      }, function () {});
    });
    return b;
  }
  /* one polite live region for short confirmations */
  var liveBox = null;
  function announce(msg) {
    if (!liveBox) { liveBox = h("span", { class: "sr-only", "aria-live": "polite" }); document.body.appendChild(liveBox); }
    liveBox.textContent = "";
    setTimeout(function () { liveBox.textContent = msg; }, 60);
  }

  /* ----------------------------- PLAYER CARD ------------------------------ */
  /* The hero's "player card", after FIFA Ultimate Team cards, NBA 2K ratings
     and GTA V stat bars: photo, name, position, and one row per `skills` group
     that has a `rating` (0 to 99) in data.js. OVR is the rounded average.
     Assistive tech reads each row as "Programming: 84 out of 99"; the
     abbreviations, numbers and segmented bars are the visual layer. */
  var cardPhoto = null;      // kept across language switches, so it never reloads or flashes
  var cardFilled = false;    // the bars fill once, on first render only
  var CARD_SEGS = 10;        // bar segments; each one is 10 points
  function ratingOf(g) {
    if (!g || g.rating == null || g.rating === "") return null;
    var v = +g.rating;
    return isFinite(v) ? Math.max(0, Math.min(99, Math.round(v))) : null;
  }
  function cardBar(v) {
    var segs = [];
    for (var k = 0; k < CARD_SEGS; k++) {
      var f = Math.max(0, Math.min(1, v / (100 / CARD_SEGS) - k));
      segs.push(h("span", { class: "pa-seg" + (f > 0 ? " is-on" : "") },
        f > 0 ? h("i", { style: "--f:" + f.toFixed(2) + ";--k:" + k }) : null));
    }
    return h("span", { class: "pa-bar", "aria-hidden": "true" }, segs);
  }
  function renderCard() {
    var card = $("#player-card");
    if (!card) return;
    empty(card);
    var p = DATA.profile || {};
    var rated = (DATA.skills || []).filter(function (g) { return ratingOf(g) !== null; });
    card.hidden = !rated.length && !p.photo;
    if (card.hidden) { revealStats(0); return; }

    // photo: a real <img>; the capital initials only appear if it fails to load
    var initials = h("span", { class: "pcard-initials", "aria-hidden": "true" }, String(p.initials || "").toUpperCase());
    var photo = h("div", { class: "pcard-photo" });
    if (p.photo && !cardPhoto) {
      cardPhoto = document.createElement("img");
      cardPhoto.className = "pcard-img";
      cardPhoto.width = 160;
      cardPhoto.height = 160;
      cardPhoto.decoding = "async";
      cardPhoto.addEventListener("error", function () {
        cardPhoto.hidden = true;
        var ini = $("#player-card .pcard-initials");
        if (ini) ini.hidden = false;
      });
      cardPhoto.src = p.photo;
    }
    if (cardPhoto) { cardPhoto.alt = T.card_photo_alt(p.name || ""); photo.appendChild(cardPhoto); }
    initials.hidden = !!(cardPhoto && !cardPhoto.hidden);
    photo.appendChild(initials);

    var top = h("div", { class: "pcard-top" });
    if (rated.length) {
      var ovr = Math.round(rated.reduce(function (a, g) { return a + ratingOf(g); }, 0) / rated.length);
      top.appendChild(h("p", { class: "pcard-ovr" },
        h("span", { class: "pcard-ovr-num", "aria-hidden": "true" }, String(ovr)),
        h("span", { class: "pcard-ovr-lbl", "aria-hidden": "true" }, T.card_ovr),
        h("span", { class: "sr-only" }, T.card_overall(ovr))));
    }
    top.appendChild(h("div", { class: "pcard-id" },
      h("p", { class: "pcard-name" }, p.name || ""),
      tf(p, "position") ? h("p", { class: "pcard-pos" }, tf(p, "position")) : null));
    top.appendChild(photo);
    card.appendChild(top);

    if (rated.length) {
      card.appendChild(h("ul", { class: "pcard-attrs", "aria-label": T.card_attrs_label }, rated.map(function (g, i) {
        var v = ratingOf(g), name = tf(g, "group");
        return h("li", { class: "pcard-attr", style: "--i:" + i },
          h("span", { class: "pa-abbr", "aria-hidden": "true" }, tf(g, "abbr") || ""),
          h("span", { class: "pa-name", "aria-hidden": "true" }, name),
          h("span", { class: "pa-val", "aria-hidden": "true" }, String(v)),
          h("span", { class: "sr-only" }, T.card_attr(name, v)),
          cardBar(v));
      })));
      card.appendChild(h("figcaption", { class: "pcard-note" }, h("span", {}, T.card_note),
        h("button", { class: "pcard-flip", type: "button", html: FLIP_ICON }, h("span", { class: "pcard-flip-lbl" }))));
      card.appendChild(cardBack());
      card.classList.add("can-flip");
      setFace(card, cardFlipped);   // a language switch keeps the face that was up
    }
    // the light on the card (shade and glare for the tilt, the reveal's sweep):
    // decorative layers above the content, in the card's clipped shape
    card.appendChild(h("span", { class: "pcard-shade", "aria-hidden": "true" }));
    card.appendChild(h("span", { class: "pcard-glare", "aria-hidden": "true" }));
    card.appendChild(h("span", { class: "pcard-sweep", "aria-hidden": "true" }));

    // the reveal runs on the first render only (not on a language switch);
    // while the intro covers the page it waits, then lands just after the mark
    if (cardFilled) { card.classList.remove("is-revealing", "is-filling", "is-gleaming"); return; }
    cardFilled = true;
    var cl = document.documentElement.classList;
    if (cl.contains("splash-on") && !cl.contains("splash-out")) {
      document.addEventListener("ecs:intro-end", function (ev) {
        revealCard(card, ev.detail && ev.detail.flying ? 600 : 180);
      }, { once: true });
    } else {
      revealCard(card, 0);
    }
  }

  /* ---- The back of the card (styles.css "The back of the card") ----
     Career numbers, as on the back of a trading card: every entry in the
     timeline, since the first notable one that isn't personal, and how many sit in
     each lane of the "At a glance" map (the same laneOf, so the two always
     agree). Counted from data.js, so they follow it with no editing. */
  var cardFlipped = false;   // the face that's up, kept across language switches
  var FLIP_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 11a8 8 0 0 0-14.6-4.5M4 13a8 8 0 0 0 14.6 4.5" stroke-linecap="round"/><path d="M5 3v3.8h3.8M19 21v-3.8h-3.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function cardBack() {
    var counts = {}, total = 0, first = null;
    (DATA.timeline || []).forEach(function (it) {
      var lane = laneOf(it);
      total++;
      counts[lane] = (counts[lane] || 0) + 1;
      // the career starts with the first entry the timeline ranks above
      // "Other activities" (a school-leaving exam doesn't count)
      if (lane !== "personal" && tierOf(it) !== "other" && it.start !== "upcoming" && (!first || key(it.start) < key(first))) first = it.start;
    });
    // a number that ticks up when the back turns over: the visible digits,
    // and the real value for assistive tech
    function num(cls, n) {
      return h("span", { class: cls }, h("span", { class: "pb-count", "aria-hidden": "true" }, String(n)), h("span", { class: "sr-only" }, String(n)));
    }
    var mark = $(".site-header .brand-mark svg");
    return h("div", { class: "pcard-back", hidden: "" },
      h("div", { class: "pcard-top" },
        h("p", { class: "pcard-ovr" }, num("pcard-ovr-num", total), h("span", { class: "pcard-ovr-lbl" }, T.card_entries)),
        h("div", { class: "pcard-id" },
          h("p", { class: "pcard-name" }, T.card_career),
          first ? h("p", { class: "pcard-pos" }, T.card_since(fmt(first))) : null),
        h("div", { class: "pcard-photo pb-mark", "aria-hidden": "true" }, mark ? mark.cloneNode(true) : null)),
      h("ul", { class: "pb-lanes", "aria-label": T.card_lanes_label }, LANES.filter(function (n) { return counts[n]; }).map(function (n) {
        return h("li", {}, h("span", { class: "pb-ico", html: icon(LANE_ICON[n]) }), num("pb-num", counts[n]), h("span", { class: "pb-lbl" }, T.lanes[n]));
      })),
      h("p", { class: "pb-note" }, T.card_counted));
  }
  /* which face is up, at once: the parts of the other face turn invisible
     (the front keeps the card's size), and the button says what it shows next */
  function setFace(card, back) {
    cardFlipped = back;
    card.classList.toggle("is-back", back);
    var b = card.querySelector(".pcard-back"), btn = card.querySelector(".pcard-flip");
    if (b) b.hidden = !back;
    if (btn) {
      btn.querySelector(".pcard-flip-lbl").textContent = back ? T.card_unflip : T.card_flip;
      btn.setAttribute("aria-label", back ? T.card_unflip_aria : T.card_flip_aria);
    }
  }
  /* The turn: the card swings edge-on (ease-in), the faces swap while it
     can't be seen, and it swings back in from the other side (ease-out),
     ending exactly on the tilt it started from, so the mouse's tilt takes
     over without a jump; the reveal's band of light crosses it as it lands,
     and the back's numbers tick up. About .6s. Clicks during a turn are
     ignored. Reduced motion: a short cross-fade, no turn. */
  function flipCard(card) {
    if (card.flipping) return;
    var back = !card.classList.contains("is-back");
    if (!card.animate) { setFace(card, back); return; }
    card.flipping = true;
    card.classList.add("is-flipping");
    function done() { card.flipping = false; card.classList.remove("is-flipping"); }
    if (reduceMotion()) {
      var out = card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 110, easing: "ease-in", fill: "forwards" });
      out.onfinish = function () {
        setFace(card, back);
        card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: "ease-out" }).onfinish = done;
        out.cancel();
      };
      return;
    }
    var cs = window.getComputedStyle(card);
    var rest = "perspective(900px) rotateX(" + (cs.getPropertyValue("--rx").trim() || "0deg") + ") rotateY(" + (cs.getPropertyValue("--ry").trim() || "0deg") + ")";
    var dir = back ? 1 : -1;
    function edge(s) { return "perspective(900px) rotateX(0deg) rotateY(" + (90 * s * dir) + "deg) scale(.95)"; }
    var away = card.animate([{ transform: rest }, { transform: edge(1) }], { duration: 210, easing: "cubic-bezier(.5, 0, .9, .45)", fill: "forwards" });
    away.onfinish = function () {
      setFace(card, back);
      var land = card.animate([{ transform: edge(-1) }, { transform: rest }], { duration: 420, easing: "cubic-bezier(.16, 1, .3, 1)" });
      away.cancel();
      land.onfinish = land.oncancel = done;
      // the band of light, as it lands
      card.classList.remove("is-gleaming");
      card.style.setProperty("--gleam-delay", "60ms");
      void card.offsetWidth;
      card.classList.add("is-gleaming");
      clearTimeout(card.gleamTimer);
      card.gleamTimer = setTimeout(function () { card.classList.remove("is-gleaming"); }, 1000);
      if (back) tickBack(card);
    };
  }
  /* the back's numbers count up from zero as it lands, one after another */
  function tickBack(card) {
    var els = Array.prototype.slice.call(card.querySelectorAll(".pcard-back .pb-count"));
    if (!els.length || !window.requestAnimationFrame) return;
    var goal = els.map(function (el) { return +el.textContent || 0; }), t0 = 0, D = 520;
    els.forEach(function (el) { el.textContent = "0"; });
    function step(now) {
      if (!t0) t0 = now;
      var more = false;
      els.forEach(function (el, i) {
        var p = Math.max(0, Math.min(1, (now - t0 - i * 55) / D));
        if (p < 1) more = true;
        el.textContent = String(Math.round(goal[i] * (1 - Math.pow(1 - p, 3))));
      });
      if (more && els[0].isConnected) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  /* Set up once (the card element survives re-renders): the button, and a
     click anywhere else on the card (not while selecting its text). */
  function initCardFlip() {
    var card = $("#player-card");
    if (!card) return;
    card.addEventListener("click", function (ev) {
      if (!card.classList.contains("can-flip") || card.classList.contains("is-revealing")) return;
      if (!ev.target.closest(".pcard-flip") && window.getSelection && String(window.getSelection())) return;
      flipCard(card);
    });
  }

  /* The card's entrance (styles.css, "the reveal"): turned face-up into place,
     the ratings fill as their numbers count up, then a band of light runs
     across the finished card. Under reduced motion it is simply there, filled. */
  function revealCard(card, delay) {
    if (reduceMotion() || BOT) return;
    var fill = delay + 640, gleam = fill + 1000;   // the last bar is full about .93s after the fill starts
    card.style.setProperty("--reveal-delay", delay + "ms");
    card.style.setProperty("--fill-delay", fill + "ms");
    card.style.setProperty("--gleam-delay", gleam + "ms");
    card.classList.add("is-revealing", "is-filling", "is-gleaming");
    countUp(card, fill);
    revealStats(fill + 120);   // the key figures tick up with the ratings
    setTimeout(function () { card.classList.remove("is-revealing"); }, delay + 950);   // the turn is over: the tilt may start
    setTimeout(function () { card.classList.remove("is-gleaming"); }, gleam + 1000);
    // then, once, the Stats button's icon turns over: a hint that the card does too
    setTimeout(function () {
      var b = card.querySelector(".pcard-flip");
      if (!b || reduceMotion()) return;
      b.classList.add("is-hinting");
      b.addEventListener("animationend", function () { b.classList.remove("is-hinting"); }, { once: true });
    }, gleam + 700);
  }

  /* The key figures under the hero count up once per page load, alongside the
     card's ratings, or when they first scroll into view (phones). Only the
     first number in each value moves ("0/990" to "990/990", "0 kg" to
     "166 kg"), in the value's own format (5,0 in French). They are set to
     zero on the first render, before the page is painted, so a figure is
     never seen jumping back; assistive tech reads the real value from a
     hidden copy meanwhile, and at the end each figure is plain text again.
     Not under reduced motion, nor for crawlers. A language switch before the
     count simply shows the figures. */
  var stats = null;
  function prepStats() {
    if (stats || reduceMotion() || BOT || !window.requestAnimationFrame) return;
    stats = $$("#hero-stats .stat-value").map(function (el, i) {
      var full = el.textContent, m = full.match(/\d+(?:[.,]\d+)?/);
      if (!m) return null;
      var it = {
        el: el, full: full, vis: h("span", { "aria-hidden": "true" }), lag: i * 70,
        goal: parseFloat(m[0].replace(",", ".")), dec: (m[0].split(/[.,]/)[1] || "").length,
        sep: m[0].indexOf(",") !== -1 ? "," : ".", pre: full.slice(0, m.index), post: full.slice(m.index + m[0].length)
      };
      empty(el);
      el.appendChild(it.vis);
      el.appendChild(h("span", { class: "sr-only" }, full));
      showStat(it, 0);
      return it;
    }).filter(Boolean);
    window.addEventListener("beforeprint", finishStats);
  }
  /* printed before they've counted up (a phone that hasn't scrolled to them
     yet), the figures print their real values, never zeros */
  function finishStats() {
    if (!stats) return;
    stats.started = true;
    stats.forEach(function (it) { if (it.vis.isConnected) it.el.textContent = it.full; });
  }
  function showStat(it, p) {
    it.vis.textContent = it.pre + (it.goal * (1 - Math.pow(1 - p, 3))).toFixed(it.dec).replace(".", it.sep) + it.post;
  }
  function revealStats(delay) {
    var box = $("#hero-stats");
    if (!stats || stats.started || !box) return;
    stats.started = true;
    var b = box.getBoundingClientRect();
    if (b.top < window.innerHeight && b.bottom > 0) { setTimeout(runStats, delay); return; }
    if (!("IntersectionObserver" in window)) { runStats(); return; }
    var io = new IntersectionObserver(function (en) {
      if (!en.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect();
      runStats();
    }, { threshold: 0.5 });
    io.observe(box);
  }
  function runStats() {
    var t0 = 0, D = 900;
    function step(now) {
      if (!t0) t0 = now;
      var more = false;
      stats.forEach(function (it) {
        if (!it.vis.isConnected) return;            // finished, or re-rendered by a language switch
        var p = Math.max(0, Math.min(1, (now - t0 - it.lag) / D));
        if (p < 1) { more = true; showStat(it, p); }
        else it.el.textContent = it.full;
      });
      if (more) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  /* the visible numbers tick up with their bars; assistive tech reads the
     real values from the sr-only text all along */
  function countUp(card, delay) {
    // the front's numbers only: the back counts its own when it turns over
    var els = Array.prototype.slice.call(card.querySelectorAll(":scope > .pcard-top .pcard-ovr-num, .pa-val"));
    if (!els.length || !window.requestAnimationFrame) return;
    var goal = els.map(function (el) { return +el.textContent || 0; });
    var lag = els.map(function (el) {
      var li = el.closest(".pcard-attr");
      return li ? (parseInt(li.style.getPropertyValue("--i"), 10) || 0) * 90 : 0;
    });
    els.forEach(function (el) { el.textContent = "0"; });
    var t0 = 0, D = 720;
    function step(now) {
      if (!t0) t0 = now;
      var more = false;
      els.forEach(function (el, i) {
        var p = Math.max(0, Math.min(1, (now - t0 - lag[i]) / D));
        if (p < 1) more = true;
        el.textContent = String(Math.round(goal[i] * (1 - Math.pow(1 - p, 3))));
      });
      if (more && els[0].isConnected) requestAnimationFrame(step);   // a language switch re-renders: stop
    }
    setTimeout(function () { requestAnimationFrame(step); }, delay);
  }

  /* The card in the hand: with a mouse over it, it tilts toward the pointer and
     the light moves with it. One rAF-throttled update of four CSS variables per
     frame; only the card's transform and its light layers repaint. Not on
     touch screens, not under reduced motion, not during the reveal. Set up
     once: the card element survives re-renders. */
  function initCardTilt() {
    var card = $("#player-card");
    if (!card || !window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var box = null, x = 0.5, y = 0.5, raf = 0;
    function canTilt(ev) {
      return ev.pointerType === "mouse" && !reduceMotion() && !card.classList.contains("is-revealing") && !card.classList.contains("is-flipping");
    }
    function start() { box = card.getBoundingClientRect(); card.classList.add("is-tilting"); }
    function paint() {
      raf = 0;
      if (!box) return;
      card.style.setProperty("--ry", ((x - 0.5) * 16).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - y) * 13).toFixed(2) + "deg");
      card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    }
    card.addEventListener("pointerenter", function (ev) { if (canTilt(ev)) start(); });
    card.addEventListener("pointermove", function (ev) {
      if (card.classList.contains("is-flipping")) return;   // the turn ends on the tilt it started from
      if (!box) { if (!canTilt(ev)) return; start(); }   // e.g. the reveal ended under the pointer
      x = Math.max(0, Math.min(1, (ev.clientX - box.left) / box.width));
      y = Math.max(0, Math.min(1, (ev.clientY - box.top) / box.height));
      if (!raf) raf = requestAnimationFrame(paint);
    });
    card.addEventListener("pointerleave", function () {
      box = null;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      card.classList.remove("is-tilting");   // back to flat on the slow settle in styles.css
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
    window.addEventListener("scroll", function () { if (box) box = card.getBoundingClientRect(); }, { passive: true });
  }

  /* ------------------------------ FILTERS --------------------------------- */
  /* how many timeline entries each category holds, shown on the chip */
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
          var chip = this, isolate = ev.metaKey || ev.ctrlKey;
          animateLayout(function () {
            // plain click toggles; ⌘/Ctrl-click isolates this one category
            if (isolate) {
              $$("#filters .chip").forEach(function (ch) {
                ch.setAttribute("aria-pressed", ch.dataset.cat === chip.dataset.cat ? "true" : "false");
              });
            } else {
              chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") === "true" ? "false" : "true");
            }
            applyFilters();
          });
        }
      },
        h("span", { class: "dot" }),
        h("span", { class: "label" }, tf(c, "label")),
        h("span", { class: "count" }, String(CAT_COUNTS[c.id] || 0))));
    });
  }
  function setPanel(open) {
    var p = $("#filters-panel"), b = $("#filters-toggle");
    if (!p || !b) return;
    p.hidden = !open;
    b.setAttribute("aria-expanded", open ? "true" : "false");
    syncJumpOffset();
  }
  /* the number on the Filters button: categories switched off + quick filters on */
  function updateFilterCount() {
    var b = $("#filters-count");
    if (!b) return;
    var n = $$("#filters .chip").filter(function (c) { return c.getAttribute("aria-pressed") !== "true"; }).length +
            (pressed("#only-featured") ? 1 : 0) + (pressed("#only-present") ? 1 : 0);
    empty(b);
    b.hidden = !n;
    if (n) { append(b, String(n)); b.appendChild(h("span", { class: "sr-only" }, " " + T.filters_active)); }
  }

  /* ------------------------------ TIMELINE -------------------------------- */
  /* records is the hub: one per entry (in date order, newest first), holding
     its card element, its level of detail, its map mark and its search text.
     `ordered` is the same records in the order currently shown. */
  var records = [];
  var groupEls = [];    // { section, items:[el,...], body, pill }
  var ordered = [];
  var recordById = {};  // entry id → record
  var VIEW = "grid";    // "grid" | "list"
  var SORT = "importance";   // "importance" | "date"
  /* The default view keeps the "Other activities" tier folded behind one
     button, so a first read is the key work and what's notable; any filter,
     search, skill or the date order shows everything that matches. */
  var FOLD = true;
  var PREVIEW_BULLETS = 2;   // bullets shown in the preview; the rest only when opened
  var PEEK_DELAY = 320;      // ms of hovering before the preview appears

  function searchText(it) {
    var parts = [tf(it, "title"), tf(it, "org"), tf(it, "location"), tf(it, "summary")]
      .concat(tf(it, "highlights") || []).concat(tf(it, "tags") || [])
      .concat((it.categories || []).map(catLabel));
    return norm(parts.join(" "));
  }

  /* Three levels per card: 0 compact (dates, title, organisation), 1 preview
     (summary, tags, the first bullets), 2 full (everything). The preview also
     shows, laid over the cards below, while a mouse rests on a compact card
     or the keyboard focuses its "More" button (see initPeek). */
  function buildCard(it, rec) {
    var color = catColor((it.categories || [])[0]);
    var ongoing = it.end === "present";

    var loc = tf(it, "location");
    var summary = tf(it, "summary");
    var highlights = tf(it, "highlights") || [];
    var tags = tf(it, "tags") || [];
    var detailsId = rec.id + "-details";

    // the small icon (kind of entry, tinted with its first category's colour)
    // carries the category at a glance on compact cards; the spine's round
    // marker takes over in the date-ordered list
    var head = h("div", { class: "tl-head" },
      h("span", { class: "tl-date" }, h("span", { class: "tl-kind", html: icon(it.kind) }),
        dateRange(it), ongoing ? h("span", { class: "tl-now" }, T.now) : null),
      h("div", { class: "tl-main" },
        h("h4", { class: "tl-title" },
          tf(it, "title"),
          it.featured ? h("span", { class: "tl-star", role: "img", "aria-label": T.hl_star, title: T.hl_star, html: STAR }) : null),
        h("div", { class: "tl-org" },
          tf(it, "org") || "",
          loc ? [h("span", { class: "sep" }, " · "), h("span", { class: "tl-loc" }, loc)] : null)));

    rec.toggle = h("button", { class: "tl-more", type: "button", "aria-expanded": "false", "aria-controls": detailsId },
      h("span", { class: "tl-more-label" }, T.more), h("span", { class: "tl-more-ico", html: CHEVRON }));

    var bullets = highlights.length
      ? h("ul", { class: "tl-highlights" }, highlights.map(function (x, i) {
          return h("li", { class: i >= PREVIEW_BULLETS ? "tl-x" : null }, x);
        }))
      : null;
    var im = null;
    if (it.image) {
      im = h("img", { class: "tl-img tl-x", src: it.image, alt: tf(it, "title") || "", loading: "lazy" });
      im.addEventListener("error", function () { im.remove(); }); // missing image → just hide it
    }
    var cats = (it.categories || []).length
      ? h("div", { class: "tl-cats tl-x" }, it.categories.map(function (cid) {
          return h("span", { class: "tl-cat", style: "--c:" + catColor(cid) }, h("span", { class: "d" }), catLabel(cid));
        }))
      : null;
    var links = (it.links || []).length
      ? h("div", { class: "tl-links tl-x" }, it.links.map(function (l) {
          // "#…" links jump within the page, so they stay in this tab
          return iconLink("tl-link", l.url, linkIcon(l), tf(l, "label") || l.url, String(l.url).charAt(0) !== "#");
        }))
      : null;
    rec.full = h("button", { class: "tl-full", type: "button" }, T.full);
    rec.details = h("div", { class: "tl-details", id: detailsId },
      summary ? h("p", { class: "tl-summary" }, summary) : null,
      bullets,
      tags.length ? h("div", { class: "tl-tags" }, tags.map(function (t) { return h("span", { class: "tl-tag" }, t); })) : null,
      im, cats, links, rec.full);

    rec.compactText = norm([tf(it, "title"), tf(it, "org"), loc].join(" "));
    rec.detailText = norm([summary].concat(highlights, tags, (it.categories || []).map(catLabel),
      (it.links || []).map(function (l) { return tf(l, "label"); })).join(" "));

    var card = h("div", { class: "tl-card" }, head, rec.toggle, rec.details);
    var marker = h("div", { class: "tl-marker", html: icon(it.kind) });
    // tabindex lets a jump from a highlight tile or the map move keyboard focus here
    rec.el = h("li", { class: "tl-item lvl-0", id: rec.id, tabindex: "-1", style: "--cat:" + color }, marker, card);
    return rec.el;
  }

  function setLevel(r, level) {
    if (!r || !r.el) return;
    if (r.anim) { r.anim.cancel(); r.anim = null; r.details.style.overflow = ""; }   // e.g. Expand all during a card's close
    r.closing = false;
    level = Math.max(0, Math.min(2, level | 0));
    r.level = level;
    r.el.classList.remove("lvl-0", "lvl-1", "lvl-2");
    r.el.classList.add("lvl-" + level);
    r.toggle.setAttribute("aria-expanded", level > 0 ? "true" : "false");
    r.toggle.querySelector(".tl-more-label").textContent = level > 0 ? T.less : T.more;
    if (level > 0 && peekRec === r) hidePeek();
  }
  /* "Details" / a click on the card head: mouse and keyboard go straight to full
     details; a touch tap opens the preview first, with "Full details" inside. */
  function toggleCard(r, touch) {
    hidePeek();
    var closing = r.level > 0 && !r.closing;   // a card already folding away counts as closed
    // closed by hand: no preview popping back up under a pointer that hasn't moved off it
    if (closing) peekDismissed = r;
    morphLevel(r, closing ? 0 : (touch ? 1 : 2));
    updateExpandAll();
  }
  /* setLevel, animated, for one card a visitor opens or closes (bulk changes
     such as Expand all stay instant). Opening, the details unfold from the
     card's edge: hinged at the top, tipped back in 3D, while their height
     grows so the cards below slide rather than jump. Closing folds them away,
     faster, and only then drops the level. Preview → full grows smoothly.
     Reduced motion keeps the change as a short fade. */
  function morphLevel(r, level) {
    var el = r.details, cur = null;
    if (r.anim) {   // interrupted mid-way: carry on from where it had got to
      var cs = window.getComputedStyle(el);
      cur = { h: parseFloat(cs.height) || 0, o: parseFloat(cs.opacity), m: cs.marginTop };
      r.anim.cancel();
      r.anim = null;
      el.style.overflow = "";
    }
    r.closing = false;
    if (!el.animate || r.el.hidden) { setLevel(r, level); return; }
    var reduce = reduceMotion();
    var from = cur ? cur.h : (r.level > 0 ? el.offsetHeight : 0);
    /* finish/cancel events arrive asynchronously: an animation only tidies up
       if it is still the card's current one, never after its successor */
    function track(anim, done) {
      r.anim = anim;
      function end(finished) {
        if (r.anim !== anim) return;
        el.style.overflow = ""; r.anim = null; r.closing = false;
        if (finished && done) done();
      }
      anim.onfinish = function () { end(true); };
      anim.oncancel = function () { end(false); };
    }
    if (level === 0) {
      if (!from || !r.level) { setLevel(r, 0); return; }
      var m0 = cur ? cur.m : window.getComputedStyle(el).marginTop, o0 = cur ? cur.o : 1;
      el.style.overflow = "hidden";
      r.closing = true;
      r.toggle.setAttribute("aria-expanded", "false");          // the control answers at once
      r.toggle.querySelector(".tl-more-label").textContent = T.more;
      track(el.animate(reduce
        ? [{ opacity: o0 }, { opacity: 0 }]
        : [{ height: from + "px", marginTop: m0, opacity: o0, transform: "none" },
           { height: "0px", marginTop: "0px", opacity: 0, transform: "perspective(900px) rotateX(-14deg)" }],
        { duration: reduce ? 120 : 240, easing: "cubic-bezier(.4, 0, 1, 1)" }),
        function () { setLevel(r, 0); updateExpandAll(); });
      return;
    }
    setLevel(r, level);
    var to = el.offsetHeight;
    if (to === from && !cur) return;
    var m1 = window.getComputedStyle(el).marginTop;
    el.style.overflow = "hidden";
    var frames = from === 0
      ? (reduce
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ height: "0px", marginTop: "0px", opacity: 0, transform: "perspective(900px) rotateX(-18deg)" },
             { height: to + "px", marginTop: m1, opacity: 1, transform: "none" }])
      : [{ height: from + "px", marginTop: cur ? cur.m : m1, opacity: cur ? cur.o : 1 },
         { height: to + "px", marginTop: m1, opacity: 1 }];
    track(el.animate(frames, { duration: reduce ? 150 : (from === 0 ? 440 : 300), easing: "cubic-bezier(.16, 1, .3, 1)" }));
  }
  /* "Expand all" acts on the cards currently visible, and flips to "Collapse all"
     once they're all fully open. */
  function updateExpandAll() {
    var b = $("#expand-all");
    if (!b) return;
    var vis = records.filter(function (r) { return !r.el.hidden; });
    var allOpen = vis.length > 0 && vis.every(function (r) { return r.level === 2; });
    b.hidden = !vis.length;
    b.dataset.mode = allOpen ? "collapse" : "expand";
    b.textContent = allOpen ? T.collapse_all : T.expand_all;
  }

  function renderTimeline() {
    var list = (DATA.timeline || []).map(function (it, idx) { return { it: it, idx: idx }; });
    list.sort(function (a, b) { return byDateIt(a.it, b.it); });
    list.forEach(function (o) {
      var it = o.it;
      var rec = {
        it: it, id: ENTRY_IDS[o.idx], el: null,
        cats: it.categories || [], featured: !!it.featured, present: it.end === "present",
        text: searchText(it),        // current language: what the search box matches
        textAll: FULLTEXT[o.idx],    // both languages: what skill links match
        details: null, toggle: null, full: null, level: 0,
        compactText: "", detailText: "",
        mark: null                   // its bar on the career map
      };
      buildCard(it, rec);
      records.push(rec);
      recordById[rec.id] = rec;
    });
    arrangeTimeline();
    setView(VIEW);
  }

  /* Order and group the cards for the current SORT: by date in year groups
     (with the spine in list view), or by importance in three tiers. Cards are
     moved, not rebuilt, so their open state and listeners survive. */
  function sortRecords() {
    var list = records.slice();
    list.sort(SORT === "date"
      ? function (a, b) { return byDateIt(a.it, b.it); }
      : function (a, b) { return (imp(b.it) - imp(a.it)) || byDateIt(a.it, b.it); });
    return list;
  }
  function arrangeTimeline() {
    var list = $("#timeline-list");
    if (!list) return;
    hidePeek();
    empty(list);
    groupEls = [];
    ordered = sortRecords();
    var cur = null, g = null;
    ordered.forEach(function (r) {
      var gk = SORT === "date" ? startYear(r.it) : tierOf(r.it);
      if (gk !== cur) {
        cur = gk;
        // each group: an h3 (year or tier, under the section's h2) over a
        // list of cards whose titles are h4s
        var label, pill = null;
        if (SORT === "date") {
          pill = h("span", { class: gk === "upcoming" ? "pill upcoming" : "pill" }, gk === "upcoming" ? T.upcoming : String(gk));
          label = h("h3", { class: "tl-year" }, pill);
        } else {
          label = h("h3", { class: "tl-tier" }, T.tiers[gk]);
        }
        // role="list" because Safari drops list semantics from unstyled lists
        var foldable = SORT !== "date" && gk === "other";
        var body = h("ul", { class: "tl-items", role: "list", id: foldable ? "tl-items-other" : null });
        var fold = foldable ? buildFold(body.id) : null;
        g = { key: String(gk), section: h("div", { class: "tl-group", "data-group": String(gk) }, label, fold, body),
              items: [], body: body, pill: pill, fold: fold };
        groupEls.push(g);
        list.appendChild(g.section);
      }
      g.items.push(r.el);
      g.body.appendChild(r.el);
      // mark the year pill "ongoing" if this group has a present item
      if (g.pill && r.present) g.pill.classList.add("ongoing");
    });
    list.classList.toggle("by-date", SORT === "date");
    list.classList.toggle("by-importance", SORT !== "date");
  }
  /* The fold under the "Other activities" heading: one button, and a hint at
     what's behind it (the tier's most common categories). */
  function buildFold(controlsId) {
    var counts = {};
    records.forEach(function (r) {
      if (tierOf(r.it) !== "other") return;
      (r.it.categories || []).forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
    });
    var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 3).map(catLabel);
    var btn = h("button", { class: "tl-fold-btn", type: "button", "aria-controls": controlsId, "aria-expanded": "false" },
      h("span", { class: "tl-fold-label" }), h("span", { class: "tl-more-ico", html: CHEVRON }));
    btn.addEventListener("click", function () { setFold(!FOLD); });
    return h("div", { class: "tl-fold" }, btn, top.length ? h("p", { class: "tl-fold-hint" }, top.join(" · ")) : null);
  }
  function setFold(fold) {
    animateLayout(function () { FOLD = fold; applyFilters(); });   // unfolding deals the new cards in
    if (!fold) return;
    // folding from further down: bring the tier's heading back into view
    var g = $("#tl-items-other"), sec = g && g.closest(".tl-group");
    if (sec && sec.getBoundingClientRect().top < jumpOffset()) scrollToEl(sec);
  }

  /* A filter, the sort, the fold or clearing the search changes which cards
     show and in what order. animateLayout(change) runs the change and
     animates it, so the eye can follow what happened (FLIP: measure, change,
     measure, animate the difference):
     - cards that stay glide from where they were to where they land, and so
       do the group headings and the fold;
     - cards that appear are dealt in one after another;
     - cards that go fade out where they stood (a short-lived, inert copy,
       since the real card is gone at once).
     Only what's on screen (or about to be) moves, at most FLIP_MAX things;
     everything else just takes its place. Measuring includes any move still
     in flight, so a quick second change carries on from where the first had
     got to. The cards themselves (li) move, never their .tl-card, which the
     scroll-linked rise owns. Reduced motion: nothing moves; appearing cards
     fade in. */
  var flips = [], FLIP_MAX = 40;
  function onScreen(b, vh) { return b.width > 0 && b.bottom > -60 && b.top < vh + 60; }
  function movers() {
    return records.filter(function (r) { return !r.el.hidden; }).map(function (r) { return r.el; })
      .concat($$("#timeline-list .tl-tier, #timeline-list .tl-year, #timeline-list .tl-fold:not([hidden])"));
  }
  /* an instant change (typing, a new view, a jump to an entry) first ends any
     move still in flight, so nothing glides toward a place that's gone */
  function stopFlips() { flips.slice().forEach(function (a) { a.cancel(); }); }
  function track(a, after) {
    flips.push(a);
    a.onfinish = a.oncancel = function () {
      var i = flips.indexOf(a);
      if (i !== -1) flips.splice(i, 1);
      if (after) after();
    };
    return a;
  }
  function animateLayout(change) {
    var list = $("#timeline-list");
    hidePeek();
    if (!list || !list.animate) { change(); return; }
    var reduce = reduceMotion(), vh = window.innerHeight, before = new Map();
    movers().forEach(function (el) { var b = el.getBoundingClientRect(); if (onScreen(b, vh)) before.set(el, b); });
    stopFlips();   // after measuring: moves in flight carry on from where they had got to
    change();
    var n = 0, dealt = 0, lb = list.getBoundingClientRect();
    // where everything is now (a heading whose group was filtered out counts
    // as gone), top to bottom, so arrivals are dealt in reading order
    var now = movers().map(function (el) { return { el: el, b: el.getBoundingClientRect() }; })
      .filter(function (o) { return o.b.width > 0; })
      .sort(function (p, q) { return (p.b.top - q.b.top) || (p.b.left - q.b.left); });
    var stay = new Set(now.map(function (o) { return o.el; }));
    if (!reduce) before.forEach(function (b, el) {
      if (!stay.has(el) && n++ < FLIP_MAX) ghost(el, b, list, lb);   // a card, or a heading the new order replaced
    });
    now.forEach(function (o) {
      var el = o.el, b = o.b, was = before.get(el);
      if (was) {
        var dx = was.left - b.left, dy = was.top - b.top;
        if (reduce || (Math.abs(dx) < 1 && Math.abs(dy) < 1) || n++ >= FLIP_MAX) return;
        // a card landing below the screen would already be faded out by its
        // scroll-linked rise (it reads the new place): keep it there as it goes
        var away = el.classList.contains("tl-item") && b.top >= vh;
        if (away) el.classList.add("is-flying");
        // a card just let go of by the projection is still easing back to
        // size; transitions outrank animations, so end that first
        if (el.getAnimations) el.getAnimations().forEach(function (a) { if (a.transitionProperty === "transform") a.finish(); });
        track(el.animate([{ transform: "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)" }, { transform: "none" }],
          { duration: 460, easing: "cubic-bezier(.2, .8, .2, 1)" }), away ? function () { el.classList.remove("is-flying"); } : null);
      } else if (onScreen(b, vh) && n++ < FLIP_MAX) {
        // the bottom band of the screen belongs to the scroll-linked rise
        var card = el.classList.contains("tl-item") && b.top < vh - 200;
        track(el.animate(reduce || !card
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ opacity: 0, transform: "perspective(1000px) translateY(26px) rotateX(14deg) scale(.97)" }, { opacity: 1, transform: "none" }],
          { duration: reduce ? 180 : card ? 480 : 320, delay: reduce ? 0 : 80 + Math.min(dealt++, 10) * 40,
            easing: "cubic-bezier(.16, 1, .3, 1)", fill: "backwards" }));
      }
    });
  }
  /* a card (or heading) that went, fading where it stood: a copy of it, inert
     and hidden from assistive tech, with no ids, removed once it has faded */
  function ghost(el, b, list, lb) {
    var g = el.cloneNode(true);
    ["id", "hidden", "tabindex"].forEach(function (a) { g.removeAttribute(a); });
    Array.prototype.forEach.call(g.querySelectorAll("[id], [aria-controls]"), function (x) {
      x.removeAttribute("id"); x.removeAttribute("aria-controls");
    });
    g.classList.remove("is-peek", "peek-up", "is-flash", "is-flying");
    g.classList.add("tl-ghost");
    g.setAttribute("aria-hidden", "true");
    g.inert = true;
    var s = g.style;   // keeps the card's --cat
    s.position = "absolute"; s.margin = "0"; s.pointerEvents = "none";
    s.left = (b.left - lb.left).toFixed(1) + "px"; s.top = (b.top - lb.top).toFixed(1) + "px";
    s.width = b.width.toFixed(1) + "px"; s.height = b.height.toFixed(1) + "px";
    list.appendChild(g);
    track(g.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.95)" }],
      { duration: 240, easing: "cubic-bezier(.4, 0, 1, 1)", fill: "forwards" }), function () { g.remove(); });
  }

  /* Cards dealt onto the table one after another, when a list appears as a
     whole in a new layout (switching between the grid and the list view):
     only those on screen, at most ten, 45ms apart. Nothing is hidden
     beforehand. Cards in the band at the bottom of the screen are left to
     the scroll-linked rise (styles.css "Card motion"), which owns them there;
     dealing them too would end on a jump back to that half-risen state. */
  function dealIn(recs) {
    if (reduceMotion() || !document.body.animate) return;
    var vh = window.innerHeight, n = 0;
    recs.forEach(function (r) {
      if (n >= 10 || r.el.hidden) return;
      var card = r.el.querySelector(".tl-card"), b = card.getBoundingClientRect();
      if (b.bottom < 0 || b.top > vh - 240) return;
      card.animate([
        { opacity: 0, transform: "perspective(1000px) translateY(28px) rotateX(16deg) scale(.97)" },
        { opacity: 1, transform: "none" }
      ], { duration: 480, delay: n++ * 45, easing: "cubic-bezier(.16, 1, .3, 1)", fill: "backwards" });
    });
  }
  function setPressedPair(a, b, firstOn) {
    var x = $(a), y = $(b);
    if (x) x.setAttribute("aria-pressed", firstOn ? "true" : "false");
    if (y) y.setAttribute("aria-pressed", firstOn ? "false" : "true");
  }
  function setView(v) {
    stopFlips();
    VIEW = v === "list" ? "list" : "grid";
    var list = $("#timeline-list");
    if (list) {
      list.classList.toggle("view-grid", VIEW === "grid");
      list.classList.toggle("view-list", VIEW === "list");
    }
    setPressedPair("#view-grid", "#view-list", VIEW === "grid");
    hidePeek();
  }
  function setSort(v) {
    v = v === "date" ? "date" : "importance";
    var changed = v !== SORT;
    SORT = v;
    setPressedPair("#sort-importance", "#sort-date", SORT === "importance");
    if (changed || !groupEls.length) arrangeTimeline();
  }

  /* ------------------------ HOVER PREVIEW: PROJECTION ---------------------- */
  /* Resting the mouse on a compact card (PEEK_DELAY), or reaching its Details
     button with the keyboard, projects the card: it lifts out of the timeline
     with its preview unfolded, the rest of the timeline recedes behind a
     blurred veil, and its bar on the map lights up (styles.css "The
     projection"). While one card is projected, or its veil is still fading,
     resting on the next card takes over after only WARM_DELAY, and the veil
     stays up in between, so moving across the timeline never flashes.
     WCAG 1.4.13: the preview stays while the pointer is over the card or the
     preview itself, and Escape dismisses it without moving the pointer or
     focus. It's a visual aid (aria-hidden): the same content is reachable
     through Details, which opens the card in place. A preview the pointer
     opened closes when the pointer leaves; one opened from the keyboard
     closes when focus leaves the card. */
  var peekRec = null, pendingRec = null, peekTimer = 0, peekDismissed = null, lastPointer = "mouse", peekBy = "";
  var focusRec = null, focusTimer = 0;
  var WARM_DELAY = 90;      // ms of resting on the next card while one is projected
  var FOCUS_LINGER = 260;   // ms the veil waits for the next card after the pointer leaves one
  var PEEK_MARGIN = 8;      // px kept clear of the screen's edges and of the sticky bars
  /* the entry an element belongs to: a card's own, or, for the mirror shown
     beside a card, that card's */
  function recOf(el) {
    var item = el && el.closest ? el.closest(".tl-item") : null;
    if (item) return recordById[item.id];
    return mirror && el && el.closest && el.closest(".mirror") ? mirror.lit : null;
  }
  /* where the pointer may rest without ending r's projection: the card, or the
     mirror shown for it */
  function holds(r, node) {
    return !!node && (r.el.contains(node) || (!!mirror && mirror.lit === r && mirror.el.contains(node)));
  }
  function hovered(r) {
    return r.el.matches(":hover") || (!!mirror && mirror.lit === r && mirror.el.matches(":hover"));
  }
  function showPeek(r, by) {
    pendingRec = null;
    clearTimeout(peekTimer);
    if (!r || r.level > 0 || r.el.hidden) return;
    if (peekRec && peekRec !== r) hidePeek();
    peekRec = r;
    peekBy = by || "pointer";
    r.el.classList.add("is-peek");
    r.details.setAttribute("aria-hidden", "true");
    project(r);   // the veil, the map bar and the mirror (placed below, once the preview's size is known)
    placePeek(r);
    // projected while still gliding after a filter or sort change: place
    // again once it has landed, or the mirror would stay where it was mid-flight
    var moving = r.el.getAnimations ? r.el.getAnimations().filter(function (a) { return a.playState === "running"; }) : [];
    if (moving.length && window.Promise) Promise.all(moving.map(function (a) { return a.finished.catch(function () {}); }))
      .then(function () { if (peekRec === r) placePeek(r); });
  }
  function placePeek(r) {
    // the preview opens downward, or upward when it would run off the bottom
    // of the screen and fits whole between the card and the header / filter
    // bar (which counts only where it sticks). If it fits neither way it opens
    // downward: what's cut off is then its last tags, never its summary. A
    // mirror docked to the preview adds its own height to the preview's. (All
    // the measuring comes first, so the page lays out once; then the changes.)
    var card = r.el.querySelector(".tl-card").getBoundingClientRect();
    var hd = $(".site-header"), ctl = $(".controls");
    var stuck = ctl && window.getComputedStyle(ctl).position === "sticky";
    var ceiling = Math.max(hd ? hd.getBoundingClientRect().bottom : 0, stuck ? ctl.getBoundingClientRect().bottom : 0) + PEEK_MARGIN;
    var below = window.innerHeight - card.bottom, above = card.top - ceiling, need = r.details.offsetHeight + 12;
    var shown = !!mirror && mirror.lit === r && !!mirror.el.parentNode, g = null, plan = null, up, over = false;
    if (shown) {
      mirror.h = mirror.el.offsetHeight;
      g = peekGeometry(r, ceiling);
      plan = mirrorPlan(g);
    }
    if (plan && plan.at === "dock") {
      // preview and mirror stack, in this order of preference: both below the
      // card; both above it; the preview below and the mirror above; the
      // preview above and the mirror below. If there's room for only one, the
      // preview keeps its place and the mirror is left out.
      var mh = g.S.dock + mirror.h;
      if (need + mh <= below) { up = false; over = false; }
      else if (need + mh <= above) { up = true; over = true; }
      else if (need <= below && mh <= above) { up = false; over = true; }
      else if (need <= above && mh <= below) { up = true; over = false; }
      else { up = need > below && need <= above; plan = null; }
    } else {
      up = need > below && need <= above;
    }
    r.el.classList.toggle("peek-up", up);
    if (plan) mirrorPlace(plan, up, over, g);
    else if (shown) mirrorHide(true);
  }
  /* linger: the pointer left for another card, maybe; let the veil wait for it */
  function hidePeek(linger) {
    clearTimeout(peekTimer);
    pendingRec = null;
    if (peekRec) {
      peekRec.el.classList.remove("is-peek", "peek-up");
      peekRec.details.removeAttribute("aria-hidden");
      peekRec = null;
      peekBy = "";
    }
    unproject(linger);
  }
  /* the veil over the rest of the timeline, the card's bar on the map, and its
     place in the mirror beside the card (which lingers with the veil) */
  function project(r) {
    clearTimeout(focusTimer);
    if (focusRec && focusRec !== r && focusRec.mark) focusRec.mark.classList.remove("is-focus");
    focusRec = r;
    var list = $("#timeline-list"), map = $("#career-map");
    if (list) list.classList.add("is-focus");
    if (map) map.classList.add("has-focus");
    if (r.mark) r.mark.classList.add("is-focus");
    mirrorShow(r);
  }
  function unproject(linger) {
    clearTimeout(focusTimer);
    if (!focusRec) return;
    if (linger) { focusTimer = setTimeout(function () { unproject(); }, FOCUS_LINGER); return; }
    var list = $("#timeline-list"), map = $("#career-map");
    if (list) list.classList.remove("is-focus");
    if (map) map.classList.remove("has-focus");
    if (focusRec.mark) focusRec.mark.classList.remove("is-focus");
    mirrorHide();
    focusRec = null;
  }
  function initPeek() {
    var list = $("#timeline-list");
    if (!list) return;
    document.addEventListener("pointerdown", function (ev) { lastPointer = ev.pointerType || "mouse"; }, true);
    document.addEventListener("keydown", function () { lastPointer = "keyboard"; }, true);
    list.addEventListener("pointerover", function (ev) {
      if (ev.pointerType !== "mouse" && ev.pointerType !== "pen") return;   // touch: no hover
      var r = recOf(ev.target);
      if (!r || r === peekRec || r === pendingRec || r.level > 0 || r === peekDismissed) return;
      clearTimeout(peekTimer);
      pendingRec = r;
      peekTimer = setTimeout(function () { showPeek(r, "pointer"); }, focusRec ? WARM_DELAY : PEEK_DELAY);
    });
    list.addEventListener("pointerout", function (ev) {
      var r = recOf(ev.target);
      if (!r || holds(r, ev.relatedTarget)) return;   // still on the card, its preview or its mirror
      if (pendingRec === r) { clearTimeout(peekTimer); pendingRec = null; }
      if (peekDismissed === r) peekDismissed = null;
      if (peekRec === r && (peekBy !== "keyboard" || !r.el.contains(document.activeElement))) hidePeek(true);
    });
    list.addEventListener("focusin", function (ev) {
      var r = recOf(ev.target);
      if (peekRec && peekRec !== r) hidePeek();
      if (r && ev.target === r.toggle && lastPointer === "keyboard" && r.level === 0 && peekDismissed !== r) showPeek(r, "keyboard");
    });
    list.addEventListener("focusout", function (ev) {
      var r = recOf(ev.target);
      if (!r || (ev.relatedTarget && r.el.contains(ev.relatedTarget))) return;
      if (peekDismissed === r) peekDismissed = null;
      if (peekRec === r && (peekBy === "keyboard" || !hovered(r))) hidePeek();
    });
    // a window resized under a projection (a rotated tablet, say) lays it out again
    window.addEventListener("resize", function () { if (peekRec) showPeek(peekRec, peekBy); }, { passive: true });
    // the card controls, delegated so a language re-render needs no re-wiring
    list.addEventListener("click", function (ev) {
      var t = ev.target, r = recOf(t);
      if (!r) return;
      var touch = ev.detail !== 0 && lastPointer === "touch";
      if (t.closest(".tl-full")) { hidePeek(); morphLevel(r, 2); updateExpandAll(); return; }
      if (t.closest(".tl-more")) { toggleCard(r, touch); return; }
      if (t.closest(".tl-head") && !t.closest("a, button")) {
        if (window.getSelection && String(window.getSelection())) return;   // selecting text, not toggling
        toggleCard(r, touch);
      }
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
  /* nothing narrows the list: no search, skill or quick filter, every category on */
  function filtersAtDefault() {
    if (($("#search").value || "").trim() || activeSkill || pressed("#only-featured") || pressed("#only-present")) return false;
    return $$("#filters .chip").every(function (c) { return c.getAttribute("aria-pressed") === "true"; });
  }
  function applyFilters() {
    stopFlips();
    var active = activeSet();
    var q = norm(($("#search").value || "").trim());
    var onlyFeatured = pressed("#only-featured");
    var onlyPresent = pressed("#only-present");
    var skill = activeSkill && SKILL_INDEX[activeSkill];
    var foldable = SORT !== "date" && filtersAtDefault();
    var folding = FOLD && foldable;
    var shown = 0, i, r;
    for (i = 0; i < records.length; i++) {
      r = records[i];
      var okCat = r.cats.some(function (c) { return active[c]; });
      var okQ = !q || r.text.indexOf(q) !== -1;
      var okFeatured = !onlyFeatured || r.featured;
      var okPresent = !onlyPresent || r.present;
      var okSkill = !skill || skill.re.test(r.textAll);
      var vis = okCat && okQ && okFeatured && okPresent && okSkill;
      var folded = vis && folding && tierOf(r.it) === "other";
      r.el.hidden = !vis || folded;
      if (r.mark) r.mark.classList.toggle("is-dim", !vis);   // folded isn't filtered out: its bar stays lit
      if (r.mini) r.mini.classList.toggle("is-dim", !vis);   // and so does its mark in the mirror
      if (r.el.hidden && peekRec === r) hidePeek();
      // a search hit in text a compact card doesn't show shouldn't need a click to find
      if (vis && q && r.level < 2 && r.compactText.indexOf(q) === -1 && r.detailText.indexOf(q) !== -1) setLevel(r, 2);
      if (!r.el.hidden) shown++;
    }
    for (i = 0; i < groupEls.length; i++) {
      var g = groupEls[i];
      var any = g.items.some(function (el) { return !el.hidden; });
      g.section.hidden = !any && !(g.fold && folding);
      if (g.fold) {
        g.fold.hidden = !foldable;
        var fb = g.fold.querySelector(".tl-fold-btn");
        fb.setAttribute("aria-expanded", FOLD ? "false" : "true");
        fb.querySelector(".tl-fold-label").textContent = FOLD ? T.fold_show(g.items.length) : T.fold_hide;
      }
    }
    $("#result-count").textContent = T.shown(shown, records.length);
    $("#empty-state").hidden = shown !== 0;
    updateFilterCount();
    updateExpandAll();
    syncUrl();
  }

  /* ------------------------- SHAREABLE URL STATE -------------------------- */
  /* Current selection as a plain object, also used to carry state across a
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
      skill: activeSkill,
      view: VIEW,
      sort: SORT
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
    setView(s.view);
    setSort(s.sort);
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
    if (s.view !== "grid") parts.push("view=" + s.view);
    if (s.sort !== "importance") parts.push("sort=" + s.sort);
    var url = location.pathname + (parts.length ? "?" + parts.join("&") : "") + location.hash;
    try { history.replaceState(null, "", url); } catch (e) {}   // throws on file://
  }
  /* Seed the controls from ?q=…&cat=…&view=…&sort=… on first load. */
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
      skill: URLQ.skill || "",
      view: URLQ.view === "list" ? "list" : "grid",
      sort: URLQ.sort === "date" ? "date" : "importance"
    });
  }
  function setAllChips(on) {
    var chips = $("#filters").querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) chips[i].setAttribute("aria-pressed", on ? "true" : "false");
  }
  function wireToggle(sel) {
    var b = $(sel);
    if (b) b.addEventListener("click", function () {
      animateLayout(function () {
        b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
        applyFilters();
      });
    });
  }
  function clearToggles() {
    var b1 = $("#only-featured"), b2 = $("#only-present");
    if (b1) b1.setAttribute("aria-pressed", "false");
    if (b2) b2.setAttribute("aria-pressed", "false");
  }
  /* resets the filters only: the view and the sort are the visitor's choice */
  function resetAll() { setAllChips(true); clearToggles(); setSkill(""); $("#search").value = ""; applyFilters(); }
  function wireControls() {
    // every deliberate change to what's shown is animated (animateLayout): the
    // cards glide, arrive and leave. Typing isn't: each letter can open or
    // close a dozen cards, and the list simply keeps up with the keyboard.
    $("#search").addEventListener("input", applyFilters);
    $("#select-all").addEventListener("click", function () { animateLayout(function () { setAllChips(true); applyFilters(); }); });
    $("#clear-all").addEventListener("click", function () { animateLayout(function () { setAllChips(false); applyFilters(); }); });
    $("#reset").addEventListener("click", function () { animateLayout(resetAll); });
    $("#empty-reset").addEventListener("click", function () { animateLayout(resetAll); });
    wireToggle("#only-featured");
    wireToggle("#only-present");
    $("#filters-toggle").addEventListener("click", function () { setPanel($("#filters-panel").hidden); });
    // a new view re-deals the cards on screen; a new order slides each card to its new place
    function viewTo(v) { var ch = v !== VIEW; setView(v); syncUrl(); if (ch) dealIn(ordered); }
    function sortTo(v) { if (v === SORT) return; animateLayout(function () { setSort(v); applyFilters(); }); }
    $("#view-grid").addEventListener("click", function () { viewTo("grid"); });
    $("#view-list").addEventListener("click", function () { viewTo("list"); });
    $("#sort-importance").addEventListener("click", function () { sortTo("importance"); });
    $("#sort-date").addEventListener("click", function () { sortTo("date"); });

    var ex = $("#expand-all");
    if (ex) ex.addEventListener("click", function () {
      var open = ex.dataset.mode !== "collapse";
      hidePeek();
      records.forEach(function (r) { if (!r.el.hidden) setLevel(r, open ? 2 : 0); });
      updateExpandAll();
    });
    var sk = $("#skill-active");
    if (sk) sk.addEventListener("click", function () { animateLayout(function () { setSkill(""); applyFilters(); }); });
    var ms = $(".map-scroll");
    if (ms) ms.addEventListener("scroll", function () { hideTip(); updateMapEdges(); }, { passive: true });

    // "/" jumps to the search box; Escape closes the preview, then the menu,
    // then clears the search box
    document.addEventListener("keydown", function (ev) {
      var el = document.activeElement;
      var typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (ev.key === "Escape") {
        if (peekRec) { peekDismissed = peekRec; hidePeek(); return; }
        if (menuOpen()) { closeMenu(); $("#menu-toggle").focus(); return; }
        if (el === $("#search")) {
          if ($("#search").value) animateLayout(function () { $("#search").value = ""; applyFilters(); });
          else el.blur();
        }
      } else if (ev.key === "/" && !typing && !ev.metaKey && !ev.ctrlKey) {
        ev.preventDefault();
        $("#search").focus();
        $("#search").select();
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
    $$('.site-nav a[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          $$('.site-nav a[href^="#"]').forEach(function (x) { x.removeAttribute("aria-current"); });
          a.setAttribute("aria-current", "true");
          placeInk();
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
    window.addEventListener("resize", function () { placeInk(true); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placeInk(true); });
  }
  /* One underline slides to whichever section you're reading, instead of the
     current link's own underline jumping (styles.css .nav-ink). It's added
     here, so the blog pages and visitors without JavaScript keep the plain
     underline. instant: move without sliding (first placement, a resize, the
     labels changing language). */
  var ink = null;
  function placeInk(instant) {
    var nav = $("#site-nav");
    if (!nav) return;
    if (!ink) {
      ink = h("span", { class: "nav-ink", "aria-hidden": "true" });
      nav.appendChild(ink);
      nav.classList.add("has-ink");
    }
    var a = nav.querySelector('a[aria-current="true"]');
    if (!a || !a.offsetWidth) { ink.style.opacity = "0"; return; }
    var still = instant || ink.style.opacity !== "1";
    if (still) ink.style.transition = "none";
    ink.style.transform = "translateX(" + a.offsetLeft + "px) scaleX(" + (a.offsetWidth / 100).toFixed(3) + ")";
    ink.style.opacity = "1";
    if (still) { void ink.offsetWidth; ink.style.transition = ""; }
  }

  /* ------------------------- JUMPING TO AN ENTRY -------------------------- */
  /* Shared by highlight tiles, map bars and #entry-… links: un-filter the card if
     it's hidden, open it fully, scroll it clear of the sticky header and filter
     bar, and pulse it so the eye lands on it. Works in either sort order. */
  function pageTop(el) { var y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }
  function stickyHeights() {
    var hd = $(".site-header"), ctl = $(".controls");
    return {
      header: hd ? hd.offsetHeight : 0,
      controls: ctl && window.getComputedStyle(ctl).position === "sticky" ? ctl.offsetHeight : 0
    };
  }
  /* how far below the viewport top a card must land to clear the sticky header
     and, where it sticks, the filter bar */
  function jumpOffset() { var s = stickyHeights(); return s.header + s.controls + 12; }
  /* mirrored into CSS: --header-h feeds html's scroll-padding-top and the filter
     bar's sticky top, --ctl-h the cards' scroll-margin-top, so the browser's own
     anchor jumps and keyboard-focus scrolling land in the same place */
  function syncJumpOffset() {
    var s = stickyHeights(), st = document.documentElement.style;
    st.setProperty("--header-h", s.header + "px");
    st.setProperty("--ctl-h", s.controls + "px");
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
    if (r.el.hidden) { FOLD = false; resetAll(); }   // filtered out, or in the folded tier
    hidePeek();
    setLevel(r, 2);
    updateExpandAll();
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
    var feat = records.filter(function (r) { return r.featured; });   // records are in date order
    $("#highlights").hidden = !feat.length;
    feat.forEach(function (r) {
      var it = r.it, summary = tf(it, "summary"), org = tf(it, "org");
      grid.appendChild(h("a", {
        class: "hl-tile", href: "#" + r.id, style: "--cat:" + catColor((it.categories || [])[0]),
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

  /* With a mouse, a soft light follows the pointer across a Highlights tile
     (styles.css .hl-tile::before): one listener on the grid, one update of
     two CSS variables per frame. The grid survives re-renders. */
  function initSpotlight() {
    var grid = $("#highlights-grid");
    if (!grid || !window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var raf = 0, tile = null, x = 0, y = 0;
    grid.addEventListener("pointermove", function (ev) {
      var t = ev.target.closest && ev.target.closest(".hl-tile");
      if (!t || ev.pointerType === "touch") return;
      tile = t; x = ev.clientX; y = ev.clientY;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        var b = tile.getBoundingClientRect();
        tile.style.setProperty("--mx", (x - b.left).toFixed(0) + "px");
        tile.style.setProperty("--my", (y - b.top).toFixed(0) + "px");
      });
    });
  }

  /* ------------------------------ CAREER MAP ------------------------------ */
  /* Every entry as a bar (or a dot, for one-off events) on a shared time axis,
     one lane per kind of activity: a compressed view of what ran in parallel.
     Bars that overlap inside a lane are packed onto extra rows. It stays the
     time overview whatever order the cards below are sorted in. */
  var LANES = ["work", "education", "projects", "leadership", "awards", "personal"];
  var MAP_ROW = 16;   // px per packed row
  function laneOf(it) {
    if ((it.categories || []).indexOf("personal") !== -1) return "personal";
    return { experience: "work", research: "work", education: "education", project: "projects",
             leadership: "leadership", honor: "awards", certification: "awards" }[it.kind] || "projects";
  }
  /* The map's arithmetic, worked out once per render and shared by the big map
     and the mirror (see "THE MIRROR"): the time axis (months since year 0),
     each entry's span on it, and the lanes with their packed rows. */
  function mapModel() {
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
    return { NOW: NOW, FROM: FROM, TO: TO, fromY: fromY, pct: pct, lanes: lanes, used: used };
  }
  /* one span's place on the axis, in % of its width (a one-off point has no width) */
  function spanBox(M, sp) {
    var l = M.pct(sp.s);
    return { l: l, w: sp.kind === "point" ? 0 : M.pct(sp.e) - l };
  }
  /* each year on the axis, with the part of it that falls inside the axis (months) */
  function mapYears(M, fn) {
    for (var y = M.fromY; y * 12 < M.TO; y++) fn(y, Math.max(M.FROM, y * 12), Math.min(M.TO, (y + 1) * 12));
  }

  function renderMap() {
    var inner = $("#map-inner");
    if (!inner || !records.length) return;
    var M = mapModel(), pct = M.pct, used = M.used, lanes = M.lanes, FROM = M.FROM;

    // axis: each year's label centred in its span, a line where each new one starts
    var axis = h("div", { class: "map-axis" });
    var lines = h("div", { class: "map-lines", style: "grid-row:2 / span " + used.length });
    mapYears(M, function (y, a, b) {
      if (b - a >= 3) axis.appendChild(h("span", { style: "left:" + pct((a + b) / 2) + "%" }, String(y)));
      if (y > M.fromY) lines.appendChild(h("span", { class: "map-yr", style: "left:" + pct(y * 12) + "%" }));
    });
    lines.appendChild(h("span", { class: "map-now", style: "left:" + pct(M.NOW) + "%" }));
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
        var r = sp.r, it = r.it, box = spanBox(M, sp);
        var style = "--c:" + catColor((it.categories || [])[0]) + ";top:" + (4 + sp.row * MAP_ROW) + "px;left:" + box.l + "%" +
                    ";--d:" + Math.round(box.l * 4 + i * 25) + "ms";   // draw-in delay: earlier starts first
        if (sp.kind !== "point") style += ";width:" + box.w + "%";
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
      h("span", { style: "left:" + pct(M.NOW) + "%" }, T.map_today)));
    // where the map has to scroll (phones), start at the recent end, not in 2021
    inner.parentNode.scrollLeft = inner.parentNode.scrollWidth;
    updateMapEdges();
    drawMapOnce();
    renderMirror(M);
  }
  /* The first time the map comes into view, its bars draw along the time axis
     (styles.css, .map.is-drawing). They wait drawn-in-reverse (.is-pending)
     only while the map is still below the fold; it is decorative, and hidden
     from assistive tech, so nothing is withheld. Once per page load. */
  var mapDrawn = false, mapIO = null;
  function drawMapOnce() {
    var map = $("#career-map");
    if (!map || mapDrawn || mapIO || reduceMotion() || !("IntersectionObserver" in window)) return;
    var b = map.getBoundingClientRect();
    if (b.top < window.innerHeight * 0.8) { mapDrawn = true; return; }   // already in view: no replay of what's seen
    map.classList.add("is-pending");
    mapIO = new IntersectionObserver(function (entries) {
      if (!entries.some(function (e) { return e.isIntersecting; })) return;
      mapIO.disconnect();
      mapDrawn = true;
      map.classList.remove("is-pending");
      map.classList.add("is-drawing");
      setTimeout(function () { map.classList.remove("is-drawing"); }, 1600);
    }, { threshold: 0.3 });
    mapIO.observe(map);
  }
  /* fade the side(s) of the map that have more to scroll to */
  function updateMapEdges() {
    var sc = $(".map-scroll"), l = $("#map-edge-left"), r = $("#map-edge-right");
    if (!sc || !l || !r) return;
    var max = sc.scrollWidth - sc.clientWidth;
    l.hidden = !(max > 2 && sc.scrollLeft > 2);
    r.hidden = !(max > 2 && sc.scrollLeft < max - 2);
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

  /* ------------------------------ THE MIRROR ------------------------------ */
  /* A small copy of the "At a glance" map that appears next to the projected
     card with that entry lit, so a visitor sees where it sits in time even
     when the real map is far above (a lower tier, an older entry in date
     order). It is the same chart in miniature: the same lanes, colours, time
     axis and packing, drawn from the same model (mapModel), with the year
     labels, the Today line and, across all lanes, a band over the entry's
     dates to show what ran in parallel.
     It is built once per render, one mark per entry. There is a single
     element. It lives in #timeline-list, beside the cards and not in one of
     them: a card that has let go of its lift drops under the veil and under
     the next card, and the mirror must stay put and sharp while the
     projection is handed on. project() (via mirrorShow) lights the entry's
     mark and brings the element in; showPeek() places it once the preview's
     size is known (mirrorPlace). What changes per card is only its place, its
     colour (--cat), two CSS variables and which mark is lit, never the chart.
     For the pointer it counts as part of the card it shows (recOf, holds).
     It is decorative and hidden from assistive tech (the card says its
     dates); styles.css "The mirror" draws and animates it. The list is
     emptied by a language switch, so renderMirror drops the old element and
     builds a new one. */
  var MIRROR_W = 300, MIRROR_MIN = 250;   // px: how wide it is drawn, and the least it is drawn at
  var MIRROR_LABEL_MIN = 6;               // months of a year that must be on the axis for it to get a label
  /* one small icon per lane in place of its name (the same icons the cards carry) */
  var LANE_ICON = { work: "experience", education: "education", projects: "project",
                    leadership: "leadership", awards: "honor", personal: "fitness" };
  var mirror = null;   // { el, h (its height), timer, leaving, leftAt, from (where it was, for the glide), lit (the record shown) }

  /* The projection's measurements are defined in styles.css (:root --peek-scale,
     --peek-lap, --mirror-gap, --mirror-dock) so the CSS and the placement code
     below can't drift apart; read once, on first use. */
  var peekSizes = null;
  function cssNumber(name) { return parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue(name)) || 0; }
  function sizes() {
    if (!peekSizes) peekSizes = { scale: cssNumber("--peek-scale") || 1, lap: cssNumber("--peek-lap"),
                                  gap: cssNumber("--mirror-gap"), dock: cssNumber("--mirror-dock") };
    return peekSizes;
  }

  function dropMirror() {
    if (!mirror) return;
    clearTimeout(mirror.timer);
    if (mirror.el.parentNode) mirror.el.parentNode.removeChild(mirror.el);
    mirror = null;
  }
  function renderMirror(M) {
    dropMirror();
    var n = M.used.length, pct = M.pct;
    var axis = h("div", { class: "mirror-axis" });
    var lines = h("div", { class: "mirror-lines", style: "grid-row:2 / span " + n });
    mapYears(M, function (y, a, b) {
      if (b - a >= MIRROR_LABEL_MIN) axis.appendChild(h("span", { style: "left:" + pct((a + b) / 2) + "%" }, String(y)));
      if (y > M.fromY) lines.appendChild(h("span", { class: "mirror-yr", style: "left:" + pct(y * 12) + "%" }));
    });
    lines.appendChild(h("span", { class: "mirror-band" }));   // placed per card by mirrorShow
    lines.appendChild(h("span", { class: "mirror-now", style: "left:" + pct(M.NOW) + "%" }));
    var foot = h("div", { class: "mirror-foot", style: "grid-row:" + (n + 2) });
    var grid = h("div", { class: "mirror-grid" }, axis, lines);

    M.used.forEach(function (name, i) {
      var row = "grid-row:" + (i + 2);
      grid.appendChild(h("span", { class: "mirror-ico", style: row, html: icon(LANE_ICON[name]) }));
      var track = h("div", { class: "mirror-track", style: row + ";--rows:" + M.lanes[name].rows });
      M.lanes[name].forEach(function (sp) {
        var r = sp.r, it = r.it, box = spanBox(M, sp), color = catColor((it.categories || [])[0]);
        var clipped = sp.s < M.FROM;
        var style = "--c:" + color + ";--row:" + sp.row + ";left:" + box.l + "%";
        if (sp.kind !== "point") style += ";width:" + box.w + "%";
        r.mini = h("span", { class: "mirror-mark is-" + sp.kind + (clipped ? " is-clipped" : ""), style: style });
        track.appendChild(r.mini);
        // the band across all lanes: the entry's own dates (a one-off point: its month)
        var half = sp.kind === "point" ? 0.5 : 0, bl = pct(sp.s - half);
        r.band = { l: bl, w: pct(sp.e + half) - bl };
        // an entry that starts before the axis does is cut off at its left edge:
        // a note under the chart says where it really begins
        r.cue = null;
        if (clipped) {
          r.cue = h("span", { class: "mirror-cue", style: "--c:" + color },
            sp.e <= M.FROM ? T.mirror_before(M.fromY) : T.mirror_since(parseInt(it.start, 10)));
          foot.appendChild(r.cue);
        }
      });
      grid.appendChild(track);
    });
    foot.appendChild(h("span", { class: "mirror-today" }, T.map_today));
    grid.appendChild(foot);
    mirror = { el: h("div", { class: "mirror", "aria-hidden": "true" }, grid), h: 0, timer: 0, leaving: false, leftAt: 0, from: null, lit: null };
  }

  /* an entry's mark (and its "since …" note) lit, or not */
  function mirrorLight(r, on) {
    if (r.mini) r.mini.classList.toggle("is-focus", on);
    if (r.cue) r.cue.classList.toggle("is-on", on);
  }
  /* Into the timeline, lit for r. From nothing, it fades up beside the card (the
     CSS animation starts as it enters the page); handed on from another card,
     it stays at full strength and glides across (mirrorPlace), so switching
     between cards never blinks. */
  function mirrorShow(r) {
    var m = mirror, el = m && m.el, list = $("#timeline-list");
    if (!m || !list || !r.band) return;
    clearTimeout(m.timer);
    // (one that only just started to leave, e.g. Tab from one card to the next, counts as still there)
    var warm = !!el.parentNode && (!m.leaving || Date.now() - m.leftAt < 50);
    m.from = warm && m.lit !== r ? el.getBoundingClientRect() : null;
    m.leaving = false;
    el.classList.remove("is-leaving");
    el.classList.toggle("is-in", !warm);
    if (m.lit && m.lit !== r) mirrorLight(m.lit, false);
    mirrorLight(r, true);
    m.lit = r;
    el.style.setProperty("--cat", r.el.style.getPropertyValue("--cat"));
    el.style.setProperty("--bl", r.band.l + "%");
    el.style.setProperty("--bw", r.band.w + "%");
    if (el.parentNode !== list) list.appendChild(el);
  }
  /* fades out, then leaves the page and the entry is unlit (so its mark stays
     lit while the mirror fades); now: at once, no fade */
  function mirrorHide(now) {
    var m = mirror;
    if (!m || !m.el.parentNode) return;
    function gone() {
      if (m.el.parentNode) m.el.parentNode.removeChild(m.el);
      m.el.classList.remove("is-leaving");
      m.leaving = false;
      if (m.lit) mirrorLight(m.lit, false);
      m.lit = null;
    }
    if (now) { clearTimeout(m.timer); gone(); return; }
    if (m.leaving) return;
    m.leaving = true;
    m.leftAt = Date.now();
    m.el.classList.add("is-leaving");
    clearTimeout(m.timer);
    m.timer = setTimeout(gone, 140);
  }
  /* Where r's card stands, measured by showPeek and worked out for the lift: a
     projected card scales about its own centre, so any point (x, y) of it,
     counted from its top-left corner, ends up at liftX(x), liftY(y), in the
     timeline's own coordinates (which the mirror is placed in). It's taken
     from the layout (offsets), not from where the card is drawn, so a card
     still gliding to its place counts where it will be. */
  function offsetIn(el, root) {
    var x = 0, y = 0;
    while (el && el !== root) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return { x: x, y: y };
  }
  function peekGeometry(r, ceiling) {
    var list = $("#timeline-list"), lr = list.getBoundingClientRect(), at = offsetIn(r.el, list), card = r.el.querySelector(".tl-card");
    var S = sizes(), g = { S: S, K: reduceMotion() ? 1 : S.scale,
      lw: r.el.offsetWidth, hc: r.el.offsetHeight, flap: r.details.offsetHeight,   // the entry's box, and its preview's height
      cardL: card.offsetLeft, cardW: card.offsetWidth, listW: list.offsetWidth,
      listLeft: lr.left, listTop: lr.top, ceil: ceiling,                           // the timeline on the screen, and the lowest the mirror may go up to
      vw: document.documentElement.clientWidth, vh: window.innerHeight };
    g.cx = at.x + g.lw / 2;
    g.cy = at.y + g.hc / 2;
    return g;
  }
  function liftX(g, x) { return g.cx + (x - g.lw / 2) * g.K; }
  function liftY(g, y) { return g.cy + (y - g.hc / 2) * g.K; }

  /* Where it goes: beside the card, over the neighbouring column toward the
     middle of the page, when the grid has two columns and the room is there
     (counted as it will be once the card has lifted); otherwise docked to the
     preview (see showPeek and mirrorPlace). null: too narrow a screen to be
     legible. */
  function mirrorPlan(g) {
    var w;
    if (g.cardW < g.listW * 0.7) {   // two columns, not a full-width row
      var leftColumn = g.cx < g.listW / 2;
      w = leftColumn ? g.vw - PEEK_MARGIN - (g.listLeft + liftX(g, g.lw)) - g.S.gap
                     : g.listLeft + liftX(g, 0) - g.S.gap - PEEK_MARGIN;
      w = Math.min(MIRROR_W, w);
      if (w >= MIRROR_MIN) return { at: leftColumn ? "right" : "left", w: w };
    }
    w = Math.min(MIRROR_W, g.cardW);
    return w >= MIRROR_MIN ? { at: "dock", w: w } : null;
  }
  /* Beside: level with the card's top edge. Docked: hung off the preview's far
     edge (the preview overlaps the card a little, --peek-lap) or, where the
     preview and the mirror go on opposite sides of the card, off the card's
     own edge. over: it sits above what it hangs off. Either way kept on
     screen, and below the header and the filter bar, whatever the card's own
     place. Then, if it came from another card, it glides from there
     (transform only). */
  function mirrorPlace(plan, up, over, g) {
    var m = mirror, el = m.el, S = g.S, x, y;
    if (plan.at === "dock") {
      var onPreview = up === over;
      var edge = over ? (onPreview ? S.lap - g.flap : 0)                 // the top of the preview, or of the card
                      : (onPreview ? g.hc - S.lap + g.flap : g.hc);      // the bottom of the preview, or of the card
      y = over ? liftY(g, edge) - S.dock - m.h : liftY(g, edge) + S.dock;
      x = liftX(g, g.cardL);
    } else {
      y = liftY(g, 0);
      x = plan.at === "right" ? liftX(g, g.lw) + S.gap : liftX(g, 0) - S.gap - plan.w;
    }
    y = Math.max(g.ceil - g.listTop, Math.min(y, g.vh - PEEK_MARGIN - m.h - g.listTop));
    el.setAttribute("data-at", plan.at);
    el.setAttribute("data-up", over ? "1" : "0");
    el.style.setProperty("--mw", plan.w + "px");
    el.style.left = x.toFixed(1) + "px";
    el.style.top = y.toFixed(1) + "px";
    if (!m.from) return;
    var to = el.getBoundingClientRect(), dx = m.from.left - to.left, dy = m.from.top - to.top;
    m.from = null;
    if ((Math.abs(dx) > 1 || Math.abs(dy) > 1) && el.animate && !reduceMotion()) {
      el.animate([{ transform: "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)" }, { transform: "none" }],
        { duration: 240, easing: "cubic-bezier(.16, 1, .3, 1)" });
    }
  }

  /* Structured data (schema.org Person, WebSite, ProfilePage) is written into
     index.html by tools/build.mjs from data.js, so crawlers that don't run
     JavaScript get it too. */

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
     allows a version suffix ("YOLO" finds "YOLOv5"). A label written as
     "Name (detail)" matches on "Name" only. Groups marked `link: false` in
     data.js are never linked. Keyed by the English label. */
  var SKILL_INDEX = (function () {
    var idx = {}, B = "[^a-z0-9+#-]";
    function aliases(s) {
      return String(s || "").split("(")[0].split("/")
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
      var text = activeSkill ? T.skill_chip(skillLabel(activeSkill)) : "";
      $("#skill-active-label").textContent = text;
      // the accessible name starts with the visible text
      chip.setAttribute("aria-label", activeSkill ? text + ", " + T.skill_clear : T.skill_clear_title);
      chip.title = T.skill_clear_title;
    }
    $$(".skill-link").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.skill === activeSkill ? "true" : "false");
    });
  }
  /* Clicking a skill shows exactly the entries that use it: other filters are
     cleared, the matches open, and the view moves to the first one shown.
     Clicking the active skill again clears it. */
  function pickSkill(key) {
    if (activeSkill === key) { setSkill(""); applyFilters(); return; }
    setAllChips(true);
    clearToggles();
    $("#search").value = "";
    setSkill(key);
    applyFilters();
    var shown = ordered.filter(function (r) { return !r.el.hidden; });
    shown.forEach(function (r) { setLevel(r, 2); });
    updateExpandAll();
    if (shown.length) scrollToEl(shown[0].el.closest(".tl-group") || shown[0].el);   // its group, so the heading shows
  }

  function renderSkills() {
    var grid = $("#skills-grid");
    empty(grid);   // drops the static copy from index.html
    (DATA.skills || []).forEach(function (g) {
      var n = (g.items || []).length;
      grid.appendChild(h("div", { class: "skill-group" },
        h("h3", {},
          h("span", {}, tf(g, "group")),
          h("span", { class: "skill-count" }, String(n), h("span", { class: "sr-only" }, " " + T.skills_word))),
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

  /* ---------------------------- THE RENDEZVOUS ---------------------------- */
  /* A live figure beside Contact: six robots, each talking only to its two
     neighbours (a ring), agree on where to meet and close up into a hexagon
     there. It is the real thing, in two layers:
     - each robot keeps an estimate of the meeting point and pulls it toward
       its two neighbours' estimates (a consensus protocol); robot 0 alone
       also hears the leader: the mouse, or the figure's centre. So news of a
       new meeting point travels round the ring: robot 0 moves first, its
       neighbours next, the robot opposite it last, and the hexagon stretches
       before it closes up again;
     - each robot drives to its corner of the hexagon around its own estimate
       (a damped tracker with a top speed, plus a light pull toward keeping
       the shape), heading where it goes, its fading track behind it. A
       hollow ring shows where it currently thinks its corner is.
     The gains were tuned offline: a full scatter meets in about 2 to 3 s,
     then the loop stops, so nothing moves on its own for more than 5 s
     (WCAG 2.2.2). The mouse leads them; a click or tap, or the Scatter button,
     scatters them and the stopwatch in the corner times how long they take to
     meet again. It plays the first time it scrolls into view, and pauses off
     screen or in a hidden tab. Colours come from the theme, the robots' from
     the first six categories. Reduced motion (and crawlers) get a still
     figure instead: one run, already solved, each robot's whole path drawn.
     Decorative: the canvas is hidden from assistive tech, the caption says
     what it shows and links to the timeline entry tagged "Consensus". */
  var RDV = {
    n: 6, step: 1 / 120,
    ke: 12, kp: 16,                // estimate: pull toward each neighbour's, and (robot 0) toward the leader
    w: 6, z: 0.85, kf: 1.5,        // tracker: natural frequency, damping, pull toward the shape
    vmax: 3.2, vrun: 7,            // top speed regrouping / scattering, in hexagon radii per second
    scatter: 420,                  // ms the robots spend scattering before they regroup
    trail: 44,                     // frames of track kept behind each robot
    meet: 0.03, rest: 0.002        // "met" (stopwatch), and "at rest" (loop stops), in radii
  };
  var rdv = null;

  function rdvStill() { return reduceMotion() || BOT || !window.requestAnimationFrame; }
  function rdvNum(s) { var t = s.toFixed(1); return LANG === "fr" ? t.replace(".", ",") : t; }
  /* the timeline entry the caption links to: the first one tagged "Consensus" */
  function rdvEntry() {
    var tl = DATA.timeline || [];
    for (var i = 0; i < tl.length; i++) {
      if ((tl[i].tags || []).some(function (t) { return /^consensus$/i.test(String(t).trim()); })) return ENTRY_IDS[i];
    }
    return null;
  }
  /* the caption (re-written on a language switch; the robots carry on) */
  function renderRendezvous() {
    var fig = $("#rendezvous"), cap = fig && fig.querySelector(".rdv-cap");
    if (!cap) return;
    empty(cap);
    var id = rdvEntry(), still = rdvStill();
    var touch = !(window.matchMedia && window.matchMedia("(hover: hover)").matches);
    cap.appendChild(h("p", {}, h("b", {}, T.rdv_title), " ", T.rdv_text,
      id ? [T.rdv_asin, h("a", { href: "#" + id, onclick: jumpHandler(id) }, T.rdv_link)] : null, ")."));
    cap.appendChild(h("p", { class: "rdv-hint" },
      h("span", {}, still ? T.rdv_still : touch ? T.rdv_touch : T.rdv_mouse),
      h("button", { class: "link-btn rdv-btn", type: "button", onclick: function () { rdvScatter(null); } },
        still ? T.rdv_again : T.rdv_scatter)));
    if (rdv) { rdv.fig.classList.toggle("is-still", still); rdv.label = null; rdvRead(performance.now()); }
  }

  /* a small seeded generator, so the still figure is the same run each load */
  function rdvRand(seed) {
    var s = (seed * 9301 + 49297) % 233280 || 1;
    return function () { s = (s * 16807) % 2147483647; return s / 2147483647; };
  }
  function rdvClamp(q) {
    var r = rdv, mx = Math.max(0, r.bx - 1), my = Math.max(0, r.by - 1);
    return [Math.max(-mx, Math.min(mx, q[0])), Math.max(-my, Math.min(my, q[1]))];
  }
  /* a pointer event's place, in hexagon radii from the figure's centre */
  function rdvWorld(ev) {
    var b = rdv.plot.getBoundingClientRect();
    return [(ev.clientX - b.left - b.width / 2) / rdv.R, (ev.clientY - b.top - b.height / 2) / rdv.R];
  }
  /* scattered across the figure, a little apart; each robot's first guess at
     the meeting point is simply where it stands */
  function rdvSpread(rnd) {
    var r = rdv, i, k, q, ok;
    r.p = []; r.v = []; r.x = []; r.head = []; r.tr = [];
    for (i = 0; i < r.n; i++) {
      for (k = 0; k < 30; k++) {
        q = [(rnd() * 2 - 1) * (r.bx - 0.4), (rnd() * 2 - 1) * (r.by - 0.4)];
        ok = r.p.every(function (o) { return Math.hypot(o[0] - q[0], o[1] - q[1]) > 1.1; });
        if (ok) break;
      }
      r.p.push(q);
      r.v.push([0, 0]);
      r.x.push([q[0] - r.d[i][0], q[1] - r.d[i][1]]);
      r.head.push(Math.atan2(-q[1], -q[0]));
      r.tr.push([[q[0], q[1]]]);
    }
  }
  /* one step of the two layers (see above), h seconds */
  function rdvStep(hs) {
    var r = rdv, n = r.n, i, a, j, k;
    var scattering = r.mode === "scatter";
    if (!scattering) {
      var nx = [];
      for (i = 0; i < n; i++) {
        var l = (i + n - 1) % n, rr = (i + 1) % n, o = [r.x[i][0], r.x[i][1]];
        for (a = 0; a < 2; a++) {
          var du = -RDV.ke * ((r.x[i][a] - r.x[l][a]) + (r.x[i][a] - r.x[rr][a]));
          if (i === 0) du -= RDV.kp * (r.x[i][a] - r.L[a]);
          o[a] += du * hs;
        }
        nx.push(o);
      }
      r.x = nx;
    }
    var w2 = RDV.w * RDV.w, c = 2 * RDV.z * RDV.w, vmax = scattering ? RDV.vrun : RDV.vmax;
    for (i = 0; i < n; i++) {
      var p = r.p[i], v = r.v[i], d = r.d[i];
      for (a = 0; a < 2; a++) {
        var target = scattering ? r.wp[i][a] : r.x[i][a] + d[a];
        var u = w2 * (target - p[a]) - c * v[a];
        if (!scattering) for (k = -1; k <= 1; k += 2) {
          j = (i + k + n) % n;
          u += RDV.kf * ((r.p[j][a] - r.d[j][a]) - (p[a] - d[a]));
        }
        v[a] += u * hs;
      }
      var sp = Math.hypot(v[0], v[1]);
      if (sp > vmax) { v[0] *= vmax / sp; v[1] *= vmax / sp; }
    }
    for (i = 0; i < n; i++) { r.p[i][0] += r.v[i][0] * hs; r.p[i][1] += r.v[i][1] * hs; }
  }
  /* how far the formation is from closed up around the leader, in radii */
  function rdvErr() {
    var r = rdv, e = 0;
    for (var i = 0; i < r.n; i++) e = Math.max(e, Math.hypot(r.p[i][0] - r.d[i][0] - r.L[0], r.p[i][1] - r.d[i][1] - r.L[1]));
    return e;
  }
  function rdvOnCorner(i) {
    var r = rdv;
    return Math.hypot(r.p[i][0] - r.L[0] - r.d[i][0], r.p[i][1] - r.L[1] - r.d[i][1]) < 0.15;
  }
  function rdvAtRest() {
    var r = rdv;
    if (r.mode !== "run") return false;
    for (var i = 0; i < r.n; i++) {
      if (Math.hypot(r.v[i][0], r.v[i][1]) > 0.01) return false;
      if (Math.hypot(r.x[i][0] - r.L[0], r.x[i][1] - r.L[1]) > RDV.rest) return false;
    }
    return rdvErr() < RDV.rest * 4;
  }

  /* the figure's size: the canvas at the screen's pixel density, one hexagon
     radius (the unit everything is counted in) a fifth of its height */
  function rdvSize() {
    var r = rdv, W = r.plot.clientWidth, H = r.plot.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!W || !H) return false;
    r.W = W; r.H = H; r.dpr = dpr;
    r.canvas.width = Math.round(W * dpr);
    r.canvas.height = Math.round(H * dpr);
    r.R = Math.max(26, Math.min(54, Math.min(W, H) * 0.2));
    r.bx = (W / 2 - 14) / r.R;
    r.by = (H / 2 - 14) / r.R;
    r.L = rdvClamp(r.L);
    return true;
  }
  function rdvColors() {
    var r = rdv, cs = window.getComputedStyle(r.fig);
    function v(name, fb) { return (cs.getPropertyValue(name) || "").trim() || fb; }
    r.ink = { text: v("--text", "#16202e"), accent: v("--accent", "#2563eb"), bg: v("--bg", "#f5f6f9") };
  }

  /* -- drawing -- */
  function rdvDraw() {
    var r = rdv, g = r.ctx, R = r.R, W = r.W, H = r.H, cx = W / 2, cy = H / 2, i, k, ink = r.ink;
    if (!W) return;
    function X(q) { return cx + q[0] * R; }
    function Y(q) { return cy + q[1] * R; }
    g.setTransform(r.dpr, 0, 0, r.dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    // the floor: a sparse lattice, one dot per radius, centred on home
    g.fillStyle = ink.text;
    g.globalAlpha = 0.13;
    var x0 = cx - Math.floor(cx / R) * R, y0 = cy - Math.floor(cy / R) * R;
    for (var gx = x0; gx < W; gx += R) for (var gy = y0; gy < H; gy += R) g.fillRect(gx - 0.75, gy - 0.75, 1.5, 1.5);
    g.lineCap = "round"; g.lineJoin = "round";
    // tracks: the whole run (still figure), or the last moments (live), fading out
    for (i = 0; i < r.n; i++) {
      var path = r.paths ? r.paths[i] : r.tr[i];
      g.strokeStyle = r.cols[i];
      g.lineWidth = 1.6;
      if (r.paths) {
        g.globalAlpha = 0.42;
        g.beginPath();
        path.forEach(function (q, m) { if (m) g.lineTo(X(q), Y(q)); else g.moveTo(X(q), Y(q)); });
        g.stroke();
        g.globalAlpha = 0.6; g.lineWidth = 1.2;   // where it started: a small hollow dot
        g.beginPath(); g.arc(X(path[0]), Y(path[0]), 2.6, 0, 7); g.stroke();
      } else {
        for (k = 1; k < path.length; k++) {
          g.globalAlpha = 0.5 * k / path.length;
          g.beginPath(); g.moveTo(X(path[k - 1]), Y(path[k - 1])); g.lineTo(X(path[k]), Y(path[k])); g.stroke();
        }
      }
    }
    // the ring: who talks to whom (it closes into the hexagon's outline)
    g.strokeStyle = ink.text; g.lineWidth = 1; g.globalAlpha = 0.24;
    g.beginPath();
    for (i = 0; i <= r.n; i++) { var q = r.p[i % r.n]; if (i) g.lineTo(X(q), Y(q)); else g.moveTo(X(q), Y(q)); }
    g.stroke();
    // each robot's current idea of its corner (only while it's off it)
    g.lineWidth = 1.2;
    for (i = 0; i < r.n; i++) {
      if (r.mode === "scatter") break;
      var t = [r.x[i][0] + r.d[i][0], r.x[i][1] + r.d[i][1]];
      var off = Math.hypot(t[0] - r.p[i][0], t[1] - r.p[i][1]);
      if (off < 0.12) continue;
      g.strokeStyle = r.cols[i]; g.globalAlpha = Math.min(0.55, off);
      g.beginPath(); g.arc(X(t), Y(t), 3.2, 0, 7); g.stroke();
    }
    // the leader, and the one link to it (robot 0's)
    var lx = X(r.L), ly = Y(r.L);
    g.strokeStyle = ink.accent;
    var link = Math.hypot(r.p[0][0] - r.L[0], r.p[0][1] - r.L[1]);
    if (link > 0.15) {
      g.globalAlpha = 0.6; g.setLineDash([3, 4]);
      g.beginPath(); g.moveTo(X(r.p[0]), Y(r.p[0])); g.lineTo(lx, ly); g.stroke();
      g.setLineDash([]);
    }
    g.globalAlpha = r.lead ? 0.95 : 0.5; g.lineWidth = 1.3;
    g.beginPath(); g.arc(lx, ly, 5.5, 0, 7);
    g.moveTo(lx - 10, ly); g.lineTo(lx - 7.5, ly); g.moveTo(lx + 7.5, ly); g.lineTo(lx + 10, ly);
    g.moveTo(lx, ly - 10); g.lineTo(lx, ly - 7.5); g.moveTo(lx, ly + 7.5); g.lineTo(lx, ly + 10);
    g.stroke();
    // the robots: a dart pointing where each one heads, outlined in the floor's colour
    g.globalAlpha = 1;
    for (i = 0; i < r.n; i++) {
      var p = r.p[i], a = r.head[i], s = Math.sin(a), co = Math.cos(a);
      var pts = [[8, 0], [-5.5, -5.5], [-2.6, 0], [-5.5, 5.5]].map(function (o) { return [X(p) + o[0] * co - o[1] * s, Y(p) + o[0] * s + o[1] * co]; });
      g.beginPath();
      pts.forEach(function (o, m) { if (m) g.lineTo(o[0], o[1]); else g.moveTo(o[0], o[1]); });
      g.closePath();
      g.lineWidth = 3; g.strokeStyle = ink.bg; g.stroke();
      g.fillStyle = r.cols[i]; g.fill();
    }
    g.globalAlpha = 1;
  }
  /* the stopwatch in the corner (text only changes when it needs to) */
  function rdvRead(now) {
    var r = rdv, txt = "", met = false;
    if (r.lead) txt = T.rdv_follow;
    else if (r.met != null) { txt = T.rdv_met(rdvNum(r.met)); met = true; }
    else if (r.t0) txt = T.rdv_t(rdvNum(r.mode === "scatter" ? 0 : Math.max(0, (now - r.t0) / 1000)));
    if (txt === r.label) return;
    r.label = txt;
    r.read.textContent = txt;
    r.read.classList.toggle("is-met", met);
  }

  /* -- the loop -- */
  function rdvGo() {
    var r = rdv;
    if (!r || r.raf || !r.seen || !r.onScreen || document.hidden || rdvStill()) return;
    if (r.pausedAt) {   // the stopwatch doesn't count time spent off screen
      var gap = performance.now() - r.pausedAt;
      if (r.t0) r.t0 += gap;
      r.dispUntil += gap;
      r.pausedAt = 0;
    }
    r.last = 0;
    r.quiet = 0;
    r.raf = requestAnimationFrame(rdvFrame);
  }
  function rdvFrame(now) {
    var r = rdv, i;
    r.raf = 0;
    if (!r.onScreen || document.hidden) { r.pausedAt = performance.now(); return; }
    var dt = r.last ? Math.min(0.05, (now - r.last) / 1000) : 1 / 60;
    r.last = now;
    if (r.mode === "scatter" && now >= r.dispUntil) {
      // regroup: every robot starts again from its own guess, and the clock starts
      r.mode = "run";
      for (i = 0; i < r.n; i++) r.x[i] = [r.p[i][0] - r.d[i][0], r.p[i][1] - r.d[i][1]];
      if (!r.lead) r.t0 = now;
    }
    for (var k = Math.max(1, Math.round(dt / RDV.step)); k > 0; k--) rdvStep(RDV.step);
    for (i = 0; i < r.n; i++) {
      // each one turns toward where it's going, quickly but not at once; once
      // it's on its corner, it turns to face the meeting point: they've met
      var v = r.v[i], sp = Math.hypot(v[0], v[1]), want = null;
      if (sp > 0.12) want = Math.atan2(v[1], v[0]);
      else if (r.mode === "run" && rdvOnCorner(i)) want = Math.atan2(r.L[1] - r.p[i][1], r.L[0] - r.p[i][0]);
      if (want != null) {
        var diff = Math.atan2(Math.sin(want - r.head[i]), Math.cos(want - r.head[i]));
        r.head[i] += diff * Math.min(1, dt * (sp > 0.12 ? 14 : 7));
      }
      r.tr[i].push([r.p[i][0], r.p[i][1]]);
      if (r.tr[i].length > RDV.trail) r.tr[i].shift();
    }
    if (r.mode === "run" && r.met == null && r.t0 && !r.lead && rdvErr() < RDV.meet) r.met = (now - r.t0) / 1000;
    // at rest: let the tracks run out behind them, then stop
    if (rdvAtRest()) r.quiet++; else r.quiet = 0;
    var done = r.quiet > RDV.trail;
    if (done) {
      for (i = 0; i < r.n; i++) {
        r.p[i] = [r.L[0] + r.d[i][0], r.L[1] + r.d[i][1]]; r.v[i] = [0, 0]; r.x[i] = [r.L[0], r.L[1]];
        r.tr[i] = [r.p[i].slice()]; r.head[i] = Math.atan2(-r.d[i][1], -r.d[i][0]);
      }
    }
    rdvDraw();
    rdvRead(now);
    if (!done) r.raf = requestAnimationFrame(rdvFrame);
  }

  /* Scatter (a click or tap, at that point; the button, round the centre):
     each robot dashes off outward, then they regroup from scratch and the
     stopwatch times it. Still figure: another run, solved at once. */
  function rdvScatter(at) {
    var r = rdv;
    if (!r) return;
    if (rdvStill()) { r.seed++; rdvSolve(); return; }
    var c = [0, 0], i;
    r.p.forEach(function (q) { c[0] += q[0] / r.n; c[1] += q[1] / r.n; });
    r.wp = r.p.map(function (q) {
      var a = Math.atan2(q[1] - c[1], q[0] - c[0]) + (Math.random() - 0.5) * 1.8, len = 1.6 + Math.random() * 2;
      return [Math.max(-r.bx + 0.3, Math.min(r.bx - 0.3, q[0] + Math.cos(a) * len)),
              Math.max(-r.by + 0.3, Math.min(r.by - 0.3, q[1] + Math.sin(a) * len))];
    });
    for (i = 0; i < r.n; i++) r.tr[i] = [r.p[i].slice()];
    r.L = at ? rdvClamp(at) : [0, 0];
    r.lead = false;                        // timed, until the mouse moves again
    r.mode = "scatter";
    r.dispUntil = performance.now() + RDV.scatter;
    r.paths = null;
    r.met = null;
    r.t0 = performance.now();
    r.seen = true;
    rdvGo();
  }
  /* The still figure: a scatter, solved offline, with every robot's whole
     path (reduced motion, crawlers). Same seed, same figure. */
  function rdvSolve() {
    var r = rdv, i, k;
    if (r.raf) { cancelAnimationFrame(r.raf); r.raf = 0; }
    rdvSpread(rdvRand(r.seed));
    r.L = [0, 0]; r.lead = false; r.mode = "run";
    var paths = r.p.map(function (q) { return [q.slice()]; }), t = 0, met = null;
    for (k = 1; k <= 8 * 120; k++) {
      rdvStep(RDV.step);
      t += RDV.step;
      if (k % 3 === 0) for (i = 0; i < r.n; i++) paths[i].push(r.p[i].slice());
      for (i = 0; i < r.n; i++) if (Math.hypot(r.v[i][0], r.v[i][1]) > 0.12) r.head[i] = Math.atan2(r.v[i][1], r.v[i][0]);
      if (met == null && rdvErr() < RDV.meet) met = t;
      if (met != null && t > met + 0.6) break;
    }
    for (i = 0; i < r.n; i++) {
      r.p[i] = [r.d[i][0], r.d[i][1]]; r.v[i] = [0, 0]; r.x[i] = [0, 0];
      r.head[i] = Math.atan2(-r.d[i][1], -r.d[i][0]);   // met: facing each other
      paths[i].push(r.p[i].slice());
    }
    r.paths = paths;
    r.met = met;
    r.t0 = 1;
    rdvDraw();
    rdvRead(0);
  }

  function initRendezvous() {
    var fig = $("#rendezvous"), plot = fig && fig.querySelector(".rdv-plot");
    if (!plot) return;
    var canvas = h("canvas", { class: "rdv-canvas", "aria-hidden": "true" });
    var ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return;   // no canvas: the figure stays hidden
    var read = h("span", { class: "rdv-read", "aria-hidden": "true" });
    plot.appendChild(canvas);
    plot.appendChild(read);
    fig.hidden = false;
    var inner = fig.closest(".footer-inner");
    if (inner) inner.classList.add("has-rdv");
    var cols = (DATA.categories || []).slice(0, RDV.n).map(function (c) { return c.color; });
    while (cols.length < RDV.n) cols.push("#64748b");
    rdv = { fig: fig, plot: plot, canvas: canvas, ctx: ctx, read: read, cols: cols, n: RDV.n,
            d: [], p: [], v: [], x: [], head: [], tr: [], wp: null, paths: null,
            L: [0, 0], lead: false, mode: "run", t0: 0, met: null, label: null,
            raf: 0, last: 0, quiet: 0, seen: false, onScreen: false, pausedAt: 0, dispUntil: 0, seed: 7,
            W: 0, H: 0, R: 30, bx: 4, by: 3, dpr: 1, ink: null };
    for (var i = 0; i < RDV.n; i++) {   // the hexagon, robot 0 at the top
      var a = -Math.PI / 2 + i * Math.PI / 3;
      rdv.d.push([Math.cos(a), Math.sin(a)]);
    }
    rdvColors();
    rdvSize();
    fig.classList.toggle("is-still", rdvStill());
    // until it's seen, the robots wait where they are, scattered
    if (rdvStill()) rdvSolve(); else { rdvSpread(rdvRand(rdv.seed)); rdvDraw(); }

    // the mouse leads them (touch has no hover: a tap scatters them there)
    plot.addEventListener("pointermove", function (ev) {
      if (ev.pointerType === "touch" || rdvStill()) return;
      var q = rdvClamp(rdvWorld(ev));
      if (rdv.lead && Math.hypot(q[0] - rdv.L[0], q[1] - rdv.L[1]) < 0.02) return;
      rdv.L = q;
      rdv.lead = true;
      rdv.met = null;
      rdv.seen = true;
      rdvGo();
      rdvRead(performance.now());
    });
    plot.addEventListener("pointerleave", function (ev) {
      if (ev.pointerType === "touch" || !rdv.lead) return;
      rdv.lead = false;                    // back home, timed
      rdv.L = [0, 0];
      rdv.met = null;
      rdv.t0 = performance.now();
      rdvGo();
    });
    plot.addEventListener("click", function (ev) { rdvScatter(rdvWorld(ev)); });

    // plays the first time most of it is in view; pauses off screen, resumes on return
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var e = entries[entries.length - 1];
        rdv.onScreen = e.isIntersecting;
        if (!rdv.seen && e.intersectionRatio >= 0.45) { rdv.seen = true; rdv.t0 = performance.now(); }
        if (rdv.onScreen) rdvGo();
      }, { threshold: [0, 0.45] }).observe(plot);
    } else { rdv.onScreen = true; rdv.seen = true; rdv.t0 = performance.now(); rdvGo(); }
    document.addEventListener("visibilitychange", function () { if (!document.hidden) rdvGo(); });
    // a new size or theme redraws it (also mid-transition: the theme's circle
    // reveal captures the redrawn canvas); a change of the motion setting
    // swaps between the live and the still figure
    if ("ResizeObserver" in window) new ResizeObserver(function () { if (rdvSize()) rdvDraw(); }).observe(plot);
    new MutationObserver(function () { rdvColors(); rdvDraw(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq && mq.addEventListener) mq.addEventListener("change", function () {
      renderRendezvous();
      if (rdvStill()) rdvSolve();
      else { rdv.paths = null; rdvSpread(rdvRand(rdv.seed)); rdv.t0 = performance.now(); rdv.met = null; rdvDraw(); rdvGo(); }
    });
  }

  /* A hello for whoever opens the browser's console, with two things to try. */
  function greet() {
    var p = DATA.profile || {}, user = String(p.github || "").replace(/\/+$/, "").split("/").pop();
    if (BOT || !window.console || !console.log) return;
    try {
      console.log("%cecs%c  Hi, and thanks for looking under the hood.\n\n" +
        "This page is plain HTML, CSS and JavaScript, with no framework.\n" +
        "Two things to try: turn the player card over, and lead the robots beside the contact links.\n" +
        (user ? "\nSource: https://github.com/" + user + "/" + user + ".github.io" : ""),
        "font: 700 15px/1.6 'Roboto Mono', monospace; color: #fff; background: #1b2a4a; padding: 2px 9px; border-radius: 6px;",
        "font: 13px/1.6 'Roboto Mono', monospace;");
    } catch (e) {}
  }

  /* -------------------------------- INIT ---------------------------------- */
  /* Motion, in one place: the intro hands over to the header mark (index.html);
     the player card is revealed, its ratings and the key figures count up,
     then it tilts under the mouse (renderCard, revealStats, initCardTilt)
     and turns over to its career numbers (flipCard);
     cards rise in 3D as they scroll in (pure CSS, styles.css "Card motion");
     resting on a card projects it, blurring the rest (showPeek, project); a
     card's details unfold when opened (morphLevel); filtering, searching,
     sorting and the fold glide the cards to their new places (animateLayout);
     a new view deals them in (dealIn); the map draws itself once
     (drawMapOnce); the theme spreads from its button and the language
     cross-fades (switchTheme, initLang); the header's underline follows the
     section you're in (placeInk) and a hairline under it shows how far down
     the page you are (CSS); a light follows the mouse over the Highlights
     (initSpotlight); six robots meet beside Contact ("THE RENDEZVOUS"); the
     footer's copy button ticks (copyButton). Every piece has a reduced-motion
     path. */
  /* Everything that reads content out of data.js, re-run on a language swap.
     Anything rendered into a container here must also be in setLang()'s
     list of containers to empty. */
  function renderAll() {
    renderHero();
    renderCard();
    renderFilters();
    renderTimeline();
    renderHighlights();   // these two read the records renderTimeline builds
    renderMap();
    renderSkills();
    renderRendezvous();
  }

  initTheme();
  initLang();
  initMenu();
  renderAll();
  applyUrlState();
  wireControls();
  initPeek();
  applyFilters();
  if (activeSkill) {      // a shared ?skill= link opens its matches, like a click would
    records.forEach(function (r) { if (!r.el.hidden) setLevel(r, 2); });
    updateExpandAll();
  }
  initCardTilt();
  initCardFlip();
  initSpotlight();
  initChrome();
  initRendezvous();
  greet();
  // the page body was kept unpainted until now (html.app-pending in styles.css):
  // it appears already rendered, with no static-to-interactive swap or layout shift
  document.documentElement.classList.remove("app-pending");

  // #entry-… deep links: the cards don't exist when the browser first looks for
  // the anchor, so jump by hand, and again once web fonts have reflowed the page
  syncJumpOffset();
  window.addEventListener("resize", function () { syncJumpOffset(); updateMapEdges(); }, { passive: true });
  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(syncJumpOffset);
    [$(".site-header"), $(".controls")].forEach(function (el) { if (el) ro.observe(el); });
  }
  openFromHash(true);
  settleOnEntry(location.hash.slice(1));
  window.addEventListener("hashchange", function () { openFromHash(false); });

  /* Web fonts and late layout keep shifting the page for a moment after load,
     so keep a deep-linked card pinned under the filter bar while the page
     settles, until the visitor scrolls, taps or types themselves. */
  function settleOnEntry(id) {
    var r = recordById[id];
    if (!r) return;
    var done = false, tries = 0;
    function stop() { done = true; }
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (t) {
      window.addEventListener(t, stop, { once: true, passive: true });
    });
    function again() { if (!done && tries++ < 12) scrollToEl(r.el, true); }
    if ("ResizeObserver" in window) {
      var ro2 = new ResizeObserver(again);
      ro2.observe(document.body);
      setTimeout(function () { ro2.disconnect(); done = true; }, 2500);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(again);
    window.addEventListener("load", again, { once: true });
  }
})();
