# Elias Charbel Salameh · Portfolio

An interactive, filterable **timeline portfolio**. Every role, project, award and
contribution is one entry, shown most important first (or by date), as a grid of
cards or a compact list. Visitors can toggle whole categories on/off (Research,
Technical, Academic, Project Mgmt, Leadership, Volunteering, Community, Awards)
or search the whole thing.

- **No dependencies.** Plain HTML/CSS/JS, so it will keep working untouched for years.
- **Edit one file.** All content lives in [`assets/js/data.js`](assets/js/data.js).
- **One command after editing:** `node tools/build.mjs` (Node 18 or newer, nothing
  to install). It writes the blog pages and refreshes the copy of your content
  that search engines read. The site works without it; it just goes stale for
  crawlers until you run it. See [5. Blog](#5-blog) and [6. Search engines](#6-search-engines-and-link-previews).
- **Light & dark mode**, fully responsive (phone / tablet / desktop), and print-friendly.
- **A blog** of real static pages, written in Markdown.

---

## 1. Edit your content

Open **`assets/js/data.js`** in any text editor. It is heavily commented. You can:

- Change your name, role, summary, contact links, the player card's position line
  and the hero's key figures (top `profile` block).
- Add / edit / remove timeline entries (the `timeline` array).
- Add or rename filter categories (the `categories` array).
- Edit the skills and your player-card ratings (`skills` array).

Then run, from the project folder:

```powershell
node tools/build.mjs
```

It copies the new content into `index.html` (for search engines and visitors
without JavaScript) and updates `sitemap.xml`. Bump `profile.updated` when you
make a real change: it's the footer's "last updated" date and the home page's
`<lastmod>` in the sitemap.

### Add a new timeline entry
Copy any `{ … }` block inside the `timeline` array, paste it, and edit the text.
Only `title`, `start` and `categories` are required. Example:

```js
{
  title: "New Award",
  org: "Some Organisation",
  location: "City, Country",
  start: "2026-09",            // "YYYY-MM", just "2026", or "upcoming"
  end: "present",              // optional: "YYYY-MM" or "present"
  importance: 3,               // 1 to 5, 5 = most important (missing = 3)
  kind: "honor",               // icon + map lane: experience | research | education | project |
                               //   leadership | honor | certification | fitness
  categories: ["award"],       // any ids from the `categories` array
  summary: "One-line summary.",
  highlights: ["Bullet one.", "Bullet two."],   // optional
  tags: ["Keyword", "Tool"],                     // optional
  links: [{ label: "GitHub", url: "https://…" }] // optional
}
```

Entries can belong to several categories: an entry shows whenever **at least one**
of its categories is enabled.

### Order: importance first
The timeline is sorted by each entry's `importance` (1 to 5, 5 = most important;
ties go newest first) and grouped into three tiers: **Key work** (5), **Also
notable** (3 and 4) and **Other activities** (1 and 2). Visitors can switch to
**Date** order, which brings back the year groups. Change an entry's number to move
it; nothing else needs editing. Featured entries should be 5.

In the default view, **Other activities** starts folded behind one "Show the N
other activities" button, so a first read is the key work and what's notable.
Any search, filter or skill, the Date order, or a link to one of those entries
shows them all; printing always prints every entry.

### Views and the three levels of detail
Visitors pick **Grid** (cards, two columns; one on phones) or **List** (one compact
row per entry). Either way each card starts compact: dates, title and organisation.

- **Preview, "projected":** resting the mouse on a card for a moment, or reaching
  its **Details** button with the keyboard, projects the card out of the timeline.
  It lifts toward the visitor, ringed in its category's colour, a bar of that
  colour sweeps across its top, and its summary, tags and first two bullets unfold
  over the cards below (or above them, when the card sits low on the screen and
  the preview wouldn't fit underneath). The rest of the timeline blurs and fades
  behind it, and the entry's bar on the "At a glance" map lights up while the
  others dim. Because that map is far above the lower cards, a small copy of it
  (the **mirror**) appears right beside the projected card, with that entry lit
  and a faint band across every lane showing what else was going on at the same
  time. In the grid it sits over the neighbouring column, toward the middle of
  the page; in the list views, where there is no column beside the card, it hangs
  off the preview. It is built from the same data as the big map, so it needs no
  editing, and it leaves itself out when the window is too small to read it.
  Moving on to the next card hands the projection over at once, without the page
  flashing back into focus in between (the mirror glides across to the new card).
  Nothing moves under the pointer, and `Esc` dismisses it.
- **Full details:** clicking **Details** (or the card's title area) opens everything:
  all bullets, image, categories and links. The details unfold from the card and
  the cards below slide down; **Close** folds them away.
- **On touch screens** there is no hover, so the first tap opens the preview in
  place, with a **Full details** button inside it.

**Expand all** opens every visible card fully, and printing always prints every
card with its full details, one per row, in the light theme (even if the visitor
is in dark mode).

### Choose your Highlights
`featured: true` does two things: it stars the entry in the timeline, and it puts the
entry in the **Highlights** row of large tiles near the top of the page. Keep it to
**about 6**. The row only works if it's selective, and on phones it becomes a
swipeable strip. Tiles appear newest first.

### The "At a glance" map
Every entry is drawn automatically as a bar (or a dot, for one-off events) on a
shared time axis. You don't edit it directly. Its lane comes from the entry:

| Lane | Entries |
| --- | --- |
| Work & research | `kind: "experience"` or `"research"` |
| Education | `kind: "education"` |
| Projects | `kind: "project"` |
| Leadership | `kind: "leadership"` |
| Awards & certificates | `kind: "honor"` or `"certification"` |
| Personal | anything in the `personal` category (overrides the above) |

The axis covers roughly the last five years. Anything older is cut off at the left
edge rather than squashing everything else. (The small copy of this map that
appears beside a projected card shows an entry that starts before the axis with an
arrow and a note such as "since 2006".)

### Skills that link to your work
A skill in the `skills` array becomes a clickable filter when it appears, as a
whole word, in at least one timeline entry's title, summary, bullets or tags, in
either language. "YOLO" also finds "YOLOv5", and "Transformers / BERT" matches
either name. Clicking it shows just those entries, already opened. Skills that
match nothing stay plain, so a skill you want linked needs to be mentioned
somewhere in the timeline. To stop a whole group from linking, add `link: false`
to it, as the Languages group does.

### Add an image to an entry
1. Drop the file into **`assets/images/`** (e.g. `wro2025.jpg`).
2. Add `image: "assets/images/wro2025.jpg"` to that entry.

If an image path is missing, the card just shows no image; nothing breaks.

### Add your profile photo
Drop a square photo at **`assets/images/profile.jpg`** and it appears on the player
card in the hero. (Only if the file can't load do your initials show instead, in
capitals, from `profile.initials`.) To use a different path, edit `profile.photo`
in `data.js`.

### The player card (your ratings)
Next to your name, the hero shows a "player card" in the spirit of FIFA Ultimate
Team cards, NBA 2K ratings and GTA V stat bars: your photo, name, a short
position line (`profile.position` / `position_fr`), an overall rating (**OVR**),
and one row per skill group with an abbreviation, the group name, a rating out of
99 and a segmented bar. It's built from the `skills` array:

```js
{ group: "Programming", group_fr: "Programmation", abbr: "PRG", rating: 84, items: [ … ] },
{ group: "Control & Systems", group_fr: "Commande & systèmes", abbr: "CTL", abbr_fr: "CMD", rating: 88, items: [ … ] },
```

- `rating` (0 to 99) puts a group on the card. Leave it out to keep a group in the
  Skills section only, as Languages is.
- `abbr` is the 2 or 3 letter FIFA-style code; `abbr_fr` is its French twin when
  the French word differs.
- **OVR** is the rounded average of the ratings and updates by itself.
- The card says the ratings are self-assessed (in both languages). Screen readers
  hear each row as "Programming: 84 out of 99"; the bars are decoration.

> The ratings in `data.js` are the site owner's own self-assessed ratings. Change
> them there and the card and OVR update by themselves.

Each group in the Skills section also shows how many skills it lists; that count
updates by itself when you add or remove skills.

### Key figures
`profile.stats` is the row of figures under the hero (three per row, two on
phones, so six fills it evenly). Each has a `value` and a `label`, plus optional
`value_fr` / `label_fr` (e.g. `value_fr: "5,0/5,0"` for French number formatting).
Labels are in sentence case.

### Fonts
The site uses **Roboto Mono** for headings, numbers, labels and buttons (the
terminal feel) and **Roboto** for running text. Both are self-hosted in
`assets/fonts/` (latin subset, variable weight, SIL Open Font License, see
`assets/fonts/LICENSE.txt`), so the page loads no third-party font service.

### Category colours
Each category's `color` in `data.js` is used for icons, dots and map bars on both
the light and the dark theme, so pick mid-tones that keep 3:1 contrast against
white and against the dark card (`#151c2c`). Avoid the link blue (`#2563eb`), the
"Ongoing" green and the Highlights gold, so a category never looks like a button
or a status.

### Contact buttons
The hero's first button is **Email me** (from `profile.email`), followed by
LinkedIn and GitHub. In the footer, the e-mail address has a **copy** button
beside it (a tick and "Copied" confirm it; screen readers hear it too). The header has a **Contact** button at every width that jumps
to the contact block at the bottom. The header's **Blog** link and the footer's
**Blog · Atom feed** links lead to the blog. The copy of your contact links in
`index.html` (for visitors and crawlers without JavaScript) is written by
`node tools/build.mjs`, so you only ever change them in `data.js`.

### CV download (off by default)
The timeline itself is the showcase, so there is no "Download CV" button unless you ask
for one. To turn it on: drop a PDF anywhere in `assets/`, then set `cv` in the `profile`
block of `data.js`:

```js
cv: "assets/cv-elias-charbel-salameh.pdf",
```

A **Download CV** button then appears in the hero and the footer (translated
automatically). Set it back to `""` to remove them again; no HTML/JS edits either way.

---

## 2. Preview locally

Because the site loads a couple of files, open it through a tiny local server
rather than double-clicking (any of these works):

```powershell
# Python, run from the folder that holds index.html (wherever you cloned it)
python -m http.server 4321
# then open http://localhost:4321
```

> Double-clicking `index.html` also mostly works, but a local server matches how
> it behaves once deployed.

---

## 3. Deploy free on GitHub Pages

This gives you a clean URL like **`https://eliascharbelsalameh.github.io`**,
perfect to put on a CV.

### One-time setup
1. Create a new **public** repo on GitHub named exactly
   **`eliascharbelsalameh.github.io`** (your username + `.github.io`).
2. Upload everything in this folder to the repo. Either drag-and-drop the files
   in the GitHub web UI, or with git:

   ```powershell
   # from the folder that holds index.html
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/eliascharbelsalameh/eliascharbelsalameh.github.io.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a
   branch"**, branch **`main`**, folder **`/ (root)`**, then **Save**.
4. Wait ~1 minute, then visit **https://eliascharbelsalameh.github.io**.

### Updating later
Edit `data.js` (or add a post), run the build, commit/push, and the site updates
automatically in a minute.

```powershell
node tools/build.mjs
git add .
git commit -m "Add new experience"
git push
```

If you edit `data.js` directly on GitHub's website, the site updates too, but the
**"Generated files up to date"** check (`.github/workflows/build-check.yml`) turns
red on that commit as a reminder: pull, run `node tools/build.mjs`, and push. The
check only reports; it never blocks or changes the deployment.

### Optional: a project repo instead
If you'd rather keep it in a repo with another name (e.g. `portfolio`), that's
fine too: Pages will serve it at `https://eliascharbelsalameh.github.io/portfolio/`.
Use the same Settings → Pages steps.

### Optional: custom domain
In **Settings → Pages → Custom domain** you can later point your own domain
(e.g. from Namecheap / your GitHub Student Pack) at the site.

---

## 4. Add it to your CV / cover letter

Link the URL with a short label, e.g.
**Portfolio: eliascharbelsalameh.github.io**. Because the page has Open Graph
tags, sharing the link also shows a clean title + description preview.

### Share a *filtered* view
The filter bar writes itself into the address bar, so whatever you're looking at is
already a shareable link. Handy when you want a recruiter to land on the relevant
subset instead of the whole timeline:

| Link | Shows |
| --- | --- |
| `…github.io/?cat=research` | research entries only |
| `…github.io/?cat=research,technical&featured=1` | starred research + technical work |
| `…github.io/?present=1` | only what's ongoing |
| `…github.io/?q=SLAM` | everything matching "SLAM" |
| `…github.io/?skill=MPC` | the entries where you used MPC |
| `…github.io/?view=list` | the compact list instead of the grid |
| `…github.io/?sort=date` | date order (year groups) instead of importance |
| `…github.io/?lang=fr` | opens in French |

Params combine freely. Opening the plain URL always shows everything, in the
default grid view sorted by importance.

### Link straight to one entry
Every card has its own address, `#entry-…`. Clicking a Highlights tile or a bar on the
map puts it in the address bar, so you can copy it from there. Opening such a link
scrolls to that card and opens it fully, in whichever order and view the visitor
has chosen. The address is made from the English title and start date, so
**editing the words of an entry's title changes its link** (punctuation changes
don't). Add `id: "phd"` to an entry in `data.js` to pin it to `#entry-phd` instead.

### Visitor shortcuts
- **`/`**: jump to the search box; **`Esc`**: close a card preview, or clear the search box.
- **⌘/Ctrl-click a category chip** (inside **Filters**): isolate that one category instead of toggling it.
- Search ignores accents, so `compiegne` finds *Compiègne*.

### The intro animation
The first time someone opens the site in a browser session, an intro plays for
about 2.2 seconds: your initials "ecs" are drawn in outline, fill with colour from
below, extrude into 3D and catch a sweep of light, with your name underneath, then
the mark flies into the header's "ecs" logo while the page appears behind it
(about 2.5 seconds in all). While it plays the page can't be scrolled, clicked
or tabbed into; a click, `Esc`, `Enter` or `Space` ends it early with a short fade.

- **Once per session:** going to a blog post and back, or reloading, doesn't replay
  it. A new tab or a new browser session does.
- **Never shown** to visitors who ask their system for reduced motion, to search
  engines and link-preview bots, to tabs opened in the background, or without
  JavaScript. The page is fully there underneath the whole time.
- **Can't get stuck:** it removes itself after 4 seconds whatever happens, and a
  CSS backstop hides it even if every script fails.
- It lives in `index.html` (the `#splash` block and two small scripts, all
  commented) and the "Intro splash" section of `styles.css`, in the site's own
  colours for each theme. To turn it off, delete the `#splash` block and the two
  scripts marked "Intro splash".

### The rover (the hero's background)
Behind the hero lives a small robot that drives to wherever the visitor points
(or taps, on a phone). It runs a real, if tiny, navigation stack:

- **A\* global planner** on an occupancy grid of the hero, shortened to the
  corners that matter: the dashed line.
- **Sampling MPC** that tracks that plan: every frame it predicts 55 (speed,
  turn rate) commands over a 1.1 s horizon with the motors' lag, drops those
  that would hit something, and drives the one that best follows a reference
  moving along the plan (full speed, slower into corners, braking onto the
  goal). The faint fan is the candidates, the dots the chosen prediction.
- **2D lidar mapping**: rays from the robot hit hidden obstacles, and every hit
  becomes a point of the map, so their outlines appear as it explores. The
  player card is one of the obstacles: the robot drives round it and the lidar
  traces its edges.
- A readout under the hero shows it live (paths kept, map points, speed).

On page load it drives once across the hero (about 3 seconds) and parks; after
that it only moves when the visitor points somewhere, and stops when it gets
there (it backs off and replans once if it's stuck, then gives up), so nothing
keeps moving on its own. Under reduced motion it shows a still, already-scanned
map; crawlers, print and visitors without JavaScript don't get it at all. It is
all in `assets/js/rover.js` (plus the canvas in `index.html` and "Hero rover" in
`styles.css`) and reads nothing from `data.js`. To remove it, delete the
`<canvas id="hero-fx">` and the `rover.js` script tag.

### The terminal (for the curious)
Press `` ` `` anywhere (or **>_ Terminal** in the footer) for a small shell over
the page. Its commands read the same `data.js`: `whoami`, `about`, `ls` / `ls
all` (numbered entries), `open <n>` (jumps to that entry), `grep <word>`,
`skills` (the ratings as bars), `stats`, `contact`, `rover` (explains the robot),
`theme`, `lang`, `blog`, `clear`, `exit`, and a reply to `sudo`. Tab completes,
the arrow keys go through the history. It's a real modal dialog (Esc closes it
and focus goes back), in both languages, and its output is read out by screen
readers. app.js "TERMINAL"; styles.css "Terminal".

### The other animations
- **The name** settles like a split-flap departure board: each letter flips
  through a few glyphs before landing, once per page load and again, quicker,
  when a mouse passes over it. Screen readers hear the plain name.
- **Grid paper:** a faint dot grid lies under every page (the blog too), and with
  a mouse the dots around the pointer light up in the accent colour.
- **Section headings** carry their number (01, 02…) and are typed onto the
  page as they scroll in: a block cursor runs across, revealing them, then goes.
- **Player card:** turns face-up into place on each page load, then the ratings
  count up as their bars fill and a band of light crosses it. With a mouse, it
  tilts toward the pointer.
- **Key figures** count up alongside the ratings (on phones, when you first scroll
  to them). Screen readers hear the real values throughout, and search engines
  never see a half-counted number.
- **Cards** rise into place in 3D as you scroll to them (browsers without
  scroll-driven animations, such as Firefox, simply show them).
- **Filtering, re-sorting and the fold are animated:** the cards that stay glide
  to their new places, new ones are dealt in, and the ones filtered out fade where
  they stood, so you can follow what changed. Typing in the search box updates the
  list at once. Switching between Grid and List deals the visible cards in.
- **Resting on a card projects it** (see "Views and the three levels of detail").
  The mirror fades up beside the card just after it lifts, and the lit bar and the
  band across the lanes draw along the time axis, like the big map's. Moving to
  another card makes the mirror glide across to it rather than blink out and back.
- **The map** draws its bars along the time axis the first time it comes into view.
  With a mouse over it, a **playhead** follows the pointer along the time axis,
  naming the month and how many entries were running then; those light up and
  the rest dim.
- **Skills** pop in one after another as they scroll into view.
- **The footer** ends the page on a step response, the textbook picture of a
  control loop: the curve draws itself as you scroll down to it, overshoots,
  rings and settles on its setpoint ("Steady state reached. Let's talk.").
- **Moving between the home page and the blog** cross-fades instead of
  flashing (browsers with cross-document view transitions).
- **Theme and language:** the new theme spreads from the toggle in a circle as its
  icon turns; switching language cross-fades the page instead of flashing it. Both
  need a browser with view transitions (recent Chrome, Edge, Safari and Firefox);
  elsewhere they simply switch.
- **Header:** the underline under the section links slides to the section you're
  reading, and a hairline under the header fills as you scroll down the page
  (also on the blog, where it shows how far through a post you are).
- **Highlights:** with a mouse, a soft light in the tile's category colour
  follows the pointer, a brighter one runs round the tile's border, and the
  tile tips a few degrees toward the pointer.
- **"Ongoing" badges** send out two pulses from a small live dot, then rest
  (nothing on the page keeps moving for more than 5 seconds).
- **Reduced motion:** visitors who ask their system for less motion get none of
  the movement, only short fades where they show a change. The projection still
  blurs the rest of the timeline, without the lift, and the mirror just fades in.

Every one of them has a reduced-motion path, and the ones tied to scrolling
(card rises, headings, skills, the footer curve) simply show their end state in
browsers without scroll-driven animations.

All of it is plain CSS and JavaScript (styles.css "Card motion", "Player card",
"The projection", "The mirror", "Theme switch", "Grid paper", "Section
headings", "Footer finale" and "Terminal"; app.js `showPeek`, `project`,
`renderMirror`, `mirrorPlace`,
`animateLayout`, `morphLevel`, `dealIn`, `revealCard`, `revealStats`,
`initCardTilt`, `initSpotlight`, `initGridGlow`, `flapName`, `initScrub`,
`initTerm`, `drawMapOnce`, `switchTheme`, `placeInk`; and `assets/js/rover.js`).

---

## 5. Blog

Posts are Markdown files in **`posts/`**. Each one becomes a real page at
`/blog/<name>/`, with its own title, description, link preview and structured
data, readable by search engines and link previews without JavaScript.

### Write a post
1. Create `posts/my-post-name.md` (the file name becomes the address:
   `/blog/my-post-name/`). Start it with this block:

   ```markdown
   ---
   title: "Tuning MPC weights for adaptive cruise control"
   description: "One or two sentences for search results and link previews (50 to 160 characters)."
   date: 2026-12-01
   tags: [Control, MPC]
   ---

   Your text, in Markdown.
   ```

2. Run `node tools/build.mjs`.
3. Open `http://localhost:4321/blog/` (see [2. Preview locally](#2-preview-locally)), then commit and push.

Optional front-matter lines: `updated: 2026-12-15` (after a real revision; shown
on the post and used in the sitemap and feed), `draft: true` (skipped by the
build), `slug: other-address` (a different address than the file name),
`image: assets/images/blog/cover.png` plus `image_alt: "…"` (its own link-preview
image instead of the site's). Lines starting with `#` in the block are notes the
build ignores.

The starter post, `posts/about-me-and-this-blog.md`, was written only from facts
already in `data.js`. Rewrite it in your own words or delete it.

### What Markdown works
`##` and `###` headings (the post title is the page's only `#`), paragraphs,
`**bold**`, `*italic*`, `~~struck~~`, `` `inline code` ``, fenced code blocks
(```` ```python ````), `>` quotes, `-` and `1.` lists (indent to nest),
`[links](https://…)`, `<https://autolinks>`, `---` rules, and images:

```markdown
![What the image shows](assets/images/blog/setup.jpg "Optional caption")
```

Put images in `assets/images/blog/` and write paths from the site root, as in
`data.js`; links to your own pages work the same way (`blog/other-post/`,
`/?skill=MPC`). Images get their width and height filled in (no layout jump) and
load lazily. Raw HTML isn't passed through: it shows as text, so a post can't
break the page. The build warns about missing images, missing alt text and
overly long titles or descriptions.

### What the build writes
| File | What it is |
| --- | --- |
| `blog/<name>/index.html` | one page per post |
| `blog/index.html` | the listing, newest first |
| `blog/feed.xml` | Atom feed (readers find it from every page's `<head>`) |
| `sitemap.xml` | home, blog and every post, each with its `<lastmod>` |
| `404.html` | the "page not found" page GitHub Pages shows for any address that doesn't exist, in the site's own look, with links back (not indexed by search engines) |

Commit these generated files: GitHub Pages serves them as they are. Don't edit
them by hand; the next build overwrites them. (The local preview server shows its
own error page for a missing address; open `http://localhost:4321/404.html` to see
the site's.) Deleting or renaming a post and
rebuilding removes its old page. Posts are in English for now; nothing in the
layout stops a French version later.

---

## 6. Search engines and link previews

- **Your content is in the HTML.** The page is drawn by JavaScript, so
  `node tools/build.mjs` also writes a plain copy of `data.js` into
  `index.html` (between `<!-- build:… -->` markers): name, role, summary, key
  figures, every timeline entry and the skills. Search engines, link previews
  and visitors without JavaScript read that; `app.js` replaces it with the
  interactive page. With JavaScript on, the page body appears only once it's
  drawn, so it never jumps. Don't edit inside the markers.
- **Structured data** (JSON-LD, built from `data.js`): Person, WebSite and
  ProfilePage on the home page; Blog on the listing; BlogPosting and
  BreadcrumbList on each post.
- **One address per page.** The French view (`?lang=fr`, or the FR button) is the
  same page translated in place, so it isn't listed as a separate French page for
  search engines: its French text isn't in the HTML. Giving it its own
  indexable page would mean a static `/fr/` copy (a possible next step).
- **Link-preview image:** `assets/images/og-cover.png` (1200×630) is a screenshot
  of `tools/og-cover.html`. Its text is typed into that file, so if your role
  changes, edit it and re-create the PNG with Edge (PowerShell, from the project
  folder):

  ```powershell
  & "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=3000 --screenshot="$PWD\assets\images\og-cover.png" "$PWD\tools\og-cover.html"
  ```

- `robots.txt` lets everything in except `posts/` and `tools/` (sources, not
  pages) and points at the sitemap.

---

## License

The code (HTML, CSS, JavaScript, build tools) is MIT-licensed. The personal
content is all rights reserved: the portfolio text in `assets/js/data.js`, the
images in `assets/images/`, the blog posts and the "ecs" mark. The fonts keep
their own SIL Open Font License. Details in [`LICENSE`](LICENSE).

---

## File map

```
portfolio/
├── index.html              # page structure (rarely edited; build:… regions are generated)
├── assets/
│   ├── css/
│   │   ├── styles.css      # all styling + light/dark theme + intro animation
│   │   └── blog.css        # blog reading layout
│   ├── js/
│   │   ├── data.js         # ← YOUR CONTENT lives here
│   │   ├── app.js          # renders + filters + the terminal (rarely edited)
│   │   ├── rover.js        # the hero's robot: A* + MPC + lidar mapping (standalone)
│   │   └── site.js         # theme toggle and grid light on the blog and 404 pages
│   ├── fonts/              # Roboto + Roboto Mono (self-hosted) + LICENSE.txt
│   └── images/             # entry images, profile.jpg, og-cover.png
├── posts/                  # ← YOUR BLOG POSTS (Markdown)
├── blog/                   # generated: post pages, listing, feed.xml
├── tools/
│   ├── build.mjs           # node tools/build.mjs: blog + static copy + sitemap
│   └── og-cover.html       # source of the link-preview image
├── .github/workflows/      # the "generated files up to date" check
├── robots.txt              # lets crawlers in, points at the sitemap
├── sitemap.xml             # generated: every page with its last-modified date
├── 404.html                # generated: the "page not found" page
├── .nojekyll               # tells GitHub Pages to serve files as-is
├── LICENSE                 # MIT for the code, all rights reserved for the content
└── README.md               # this file
```

> The site address `https://eliascharbelsalameh.github.io` is written in
> `tools/build.mjs` (`SITE`, used for every generated page, the feed and the
> sitemap), `robots.txt`, `tools/og-cover.html` and the `<link rel="canonical">` /
> `og:` / feed tags in `index.html`. If the site ever moves to a custom domain,
> update it in those places and rebuild.
