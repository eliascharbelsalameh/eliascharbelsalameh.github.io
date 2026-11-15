# Elias Charbel Salameh — Portfolio

An interactive, filterable **timeline portfolio**. Every role, project, award and
contribution is one entry on a vertical timeline, and visitors can toggle whole
categories on/off (Research, Technical, Academic, Project Mgmt, Leadership,
Volunteering, Community, Awards) or search the whole thing.

- **No build step, no dependencies.** Plain HTML/CSS/JS — it will keep working untouched for years.
- **Edit one file.** All content lives in [`assets/js/data.js`](assets/js/data.js).
- **Light & dark mode**, fully responsive (phone / tablet / desktop), and print-friendly.

---

## 1. Edit your content

Open **`assets/js/data.js`** in any text editor. It is heavily commented. You can:

- Change your name, role, summary, contact links and the hero "stat" cards (top `profile` block).
- Add / edit / remove timeline entries (the `timeline` array).
- Add or rename filter categories (the `categories` array).
- Edit the skills (`skills` array).

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
  kind: "honor",               // icon + map lane: experience | research | education | project |
                               //   leadership | honor | certification | fitness
  categories: ["award"],       // any ids from the `categories` array
  summary: "One-line summary.",
  highlights: ["Bullet one.", "Bullet two."],   // optional
  tags: ["Keyword", "Tool"],                     // optional
  links: [{ label: "GitHub", url: "https://…" }] // optional
}
```

Entries can belong to several categories — an entry shows whenever **at least one**
of its categories is enabled. The site sorts everything by date automatically.

Two or more `highlights` are folded behind a **Show details** button on the card; a
single bullet stays visible. Visitors can open everything at once with **Expand all**,
and printing always prints every card unfolded.

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
edge rather than squashing everything else.

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

If an image path is missing, the card just shows no image — nothing breaks.

### Add your profile photo
Drop a square photo at **`assets/images/profile.jpg`** — it appears automatically
in the hero. (Until then your initials show.) To use a different path, edit
`profile.photo` in `data.js`.

### CV download (off by default)
The timeline itself is the showcase, so there is no "Download CV" button unless you ask
for one. To turn it on: drop a PDF anywhere in `assets/`, then set `cv` in the `profile`
block of `data.js`:

```js
cv: "assets/cv-elias-charbel-salameh.pdf",
```

A **Download CV** button then appears in the hero and the footer (translated
automatically). Set it back to `""` to remove them again — no HTML/JS edits either way.

---

## 2. Preview locally

Because the site loads a couple of files, open it through a tiny local server
rather than double-clicking (any of these works):

```powershell
# Python (already on your machine)
cd C:\Users\elias\Documents\portfolio
python -m http.server 4321
# then open http://localhost:4321
```

> Double-clicking `index.html` also mostly works, but a local server matches how
> it behaves once deployed.

---

## 3. Deploy free on GitHub Pages

This gives you a clean URL like **`https://eliascharbelsalameh.github.io`** —
perfect to put on a CV.

### One-time setup
1. Create a new **public** repo on GitHub named exactly
   **`eliascharbelsalameh.github.io`** (your username + `.github.io`).
2. Upload everything in this folder to the repo. Either drag-and-drop the files
   in the GitHub web UI, or with git:

   ```powershell
   cd C:\Users\elias\Documents\portfolio
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
Edit `data.js` (locally or directly on GitHub), commit/push, and the site updates
automatically in a minute.

```powershell
git add .
git commit -m "Add new experience"
git push
```

### Optional: a project repo instead
If you'd rather keep it in a repo with another name (e.g. `portfolio`), that's
fine too — Pages will serve it at `https://eliascharbelsalameh.github.io/portfolio/`.
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
| `…github.io/?lang=fr` | opens in French |

Params combine freely. Opening the plain URL always shows everything.

### Link straight to one entry
Every card has its own address, `#entry-…`. Clicking a Highlights tile or a bar on the
map puts it in the address bar, so you can copy it from there. Opening such a link
scrolls to that card and opens it. The address is made from the English title and
start date, so **editing an entry's title changes its link**. Add `id: "phd"` to an
entry in `data.js` to pin it to `#entry-phd` instead.

### Visitor shortcuts
- **`/`** — jump to the search box; **`Esc`** — clear it.
- **⌘/Ctrl-click a category chip** — isolate that one category instead of toggling it.
- Search ignores accents, so `compiegne` finds *Compiègne*.

---

## File map

```
portfolio/
├── index.html              # page structure (rarely edited)
├── assets/
│   ├── css/styles.css      # all styling + light/dark theme
│   ├── js/
│   │   ├── data.js         # ← YOUR CONTENT lives here
│   │   └── app.js          # renders + filters (rarely edited)
│   └── images/             # entry images + profile.jpg
├── robots.txt              # lets crawlers in, points at the sitemap
├── sitemap.xml             # one URL + its EN/FR alternates
├── .nojekyll               # tells GitHub Pages to serve files as-is
└── README.md               # this file
```

> `robots.txt`, `sitemap.xml` and the `<link rel="canonical">` / `og:` tags in
> `index.html` hard-code `https://eliascharbelsalameh.github.io/`. If the site ever
> moves to a custom domain, update the URL in those three places.
