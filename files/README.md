# Your Proposal Website 💍

Open `index.html` in any browser to preview the whole journey. To put it online,
upload all 5 files + the `images` folder to any free static host (GitHub Pages,
Netlify, Vercel) and share the link.

## What to personalize before sending it to her

**1. Photos** — every pink "Add Photo" tile is a placeholder. Replace any of them
by swapping the placeholder `<div class="photo-tile">…</div>` block for:
```html
<img src="images/your-photo.jpg" alt="...">
```
Drop your actual photos into the `images/` folder first.

**2. The love letter & timeline** — open `index.html` and edit the text inside
`.t-desc` paragraphs (timeline) and the `LOVE_LETTER` text block near the top
of `script.js`.

**3. The "day we met" countdown** — in `script.js`, edit this line near the top:
```js
const FIRST_MET_DATE = new Date('2021-06-15T00:00:00');
```

**4. Memory cards & quotes** — in `memories.html`, edit the text inside each
`.memory-back` card and each `blockquote` in the quotes section.

**5. Background music (optional)** — add an MP3 to `images/our-song.mp3`
(or update the `<source>` path in `memories.html`). If you skip this, the
music button just shows a gentle reminder instead of breaking anything.

## Notes
- Fully responsive — tested down to mobile widths.
- Respects "reduce motion" accessibility settings.
- No build step or dependencies — plain HTML/CSS/JS, works anywhere.
