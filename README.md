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
  start: "2026-09",            // "YYYY-MM"  (or just "2026")
  end: "present",              // optional: "YYYY-MM" or "present"
  kind: "honor",               // icon: experience | education | project | leadership | honor | certification
  categories: ["award"],       // any ids from the `categories` array
  summary: "One-line summary.",
  highlights: ["Bullet one.", "Bullet two."],   // optional
  tags: ["Keyword", "Tool"],                     // optional
  links: [{ label: "GitHub", url: "https://…" }] // optional
}
```

Entries can belong to several categories — an entry shows whenever **at least one**
of its categories is enabled. The site sorts everything by date automatically.

### Add an image to an entry
1. Drop the file into **`assets/images/`** (e.g. `wro2025.jpg`).
2. Add `image: "assets/images/wro2025.jpg"` to that entry.

If an image path is missing, the card just shows no image — nothing breaks.

### Add your profile photo
Drop a square photo at **`assets/images/profile.jpg`** — it appears automatically
in the hero. (Until then your initials show.) To use a different path, edit
`profile.photo` in `data.js`.

### CV download (removed)
The "Download CV" buttons were removed — the timeline itself is the showcase. To add a
downloadable CV back later: drop a PDF in `assets/cv/`, add `cv: "assets/cv/yourfile.pdf"`
to the `profile` block in `data.js`, then re-add the small CV `<a>` snippets in
`assets/js/app.js` (hero CTA + footer).

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
├── .nojekyll               # tells GitHub Pages to serve files as-is
└── README.md               # this file
```
