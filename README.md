# Collaboration for Good — Website (Initial Draft v1.0)

Static site. No build step, no dependencies, no package manager.
Deploys as-is to GitHub Pages, Netlify, or any static host.

**Brand system:** "The Protagonist" — locked by Tyler Butler, May 21, 2026
**Built by:** Aaron Hurst, UAT Computer Science

---

## File map

```
/
├── index.html            Home
├── about.html            About / Tyler Butler
├── capabilities.html     Collaborate · Create · Report · Lead
├── impact.html           Case studies (NEW — no equivalent on current site)
├── insights.html         Article archive + newsletter
├── contact.html          Contact form
│
├── css/
│   ├── base.css          Design system — tokens, reset, layout, components
│   ├── home.css          Home only
│   ├── about.css         About only
│   ├── capabilities.css  Capabilities only
│   ├── impact.css        Impact only
│   ├── insights.css      Insights only
│   └── contact.css       Contact only
│
├── js/
│   ├── main.js           Shared — nav, sticky header, scroll reveal, year
│   ├── home.js           Counters + video facade
│   ├── about.js          Intentionally near-empty (documented inside)
│   ├── capabilities.js   Scrollspy sub-navigation
│   ├── impact.js         Case study filter
│   ├── insights.js       Article filter + newsletter validation
│   └── contact.js        Form validation
│
└── assets/
    ├── img/              Images — ALL PLACEHOLDERS, see checklist below
    ├── video/            Explainer video assets (Phase 5)
    └── docs/             Lead magnets, PDFs (Phase 8)
```

**Loading order on every page:** `base.css` → `[page].css`, then
`main.js` → `[page].js`. Both scripts use `defer`, which preserves order.

---

## Architecture decisions

| Decision | Reasoning |
|---|---|
| No framework | Six static pages. React would add ~140KB and a build step for zero benefit. Current site is 16,574 KiB; target is under 2,000. |
| Shared `base.css` + per-page CSS | One design system, page-specific overrides isolated. A Contact form change cannot break the Home hero. |
| `data-*` attributes as JS hooks | Behavior decoupled from styling. Renaming a CSS class can never break functionality. |
| ARIA attributes as CSS hooks | `aria-current`, `aria-pressed`, and `aria-invalid` drive both the visual state and the screen-reader state, so the two cannot drift apart. |
| Video facade instead of iframe | A YouTube embed costs ~1MB on load whether or not anyone plays it. Largest single perf win on the Home page. |
| Filter duplicated across two files | No bundler, so a shared module means a third HTTP request. Extract if a build step is ever added. |

---

## PLACEHOLDER CHECKLIST

Search any file for the string `PLACEHOLDER` to find these in context.

### Images — required before launch
- [ ] `assets/img/cfg-heart-mark.png` — logo mark, 28×28 display (supply @2x)
- [ ] `assets/img/favicon.png` — 32×32 favicon (known gap in the logo system)
- [ ] `assets/img/og-image.jpg` — 1200×630 social share card
- [ ] `assets/img/tyler-butler.jpg` — home page portrait, 800×1000
- [ ] `assets/img/tyler-butler-portrait.jpg` — about page portrait, 800×1000
- [ ] `assets/img/video-poster.jpg` — explainer poster frame, 1280×720
- [ ] `assets/img/case-study-1.jpg` / `-2` / `-3` — 800×533 each
- [ ] `assets/img/insight-featured.jpg` — 1200×675

### Content — requires Tyler's input or approval
- [ ] Tyler's biography — review and approve final wording (about.html)
- [ ] Values statements — confirm the four commitments (about.html)
- [ ] B Corp status language + BIA score, once verified (about.html)
- [ ] Client disclosure permission — confirm which names may be published
- [ ] Case study outcomes — all three marked PLACEHOLDER, need real numbers
- [ ] Case study client names — currently anonymized by sector
- [ ] Two client testimonials — LinkedIn recommendations are a good source
- [ ] Six article entries — titles, dates, URLs from Forbes/Fortune/Fast Company
- [ ] Featured article — Tyler's strongest current byline
- [ ] Response time commitment — confirm the two-business-day promise

### Integrations — technical wiring
- [ ] Contact form endpoint (`contact.html`, `action` attribute)
      Recommended: Formspree or Basin — both work on static hosting, free tier sufficient
- [ ] Newsletter endpoint (`insights.html`) — Mailchimp or ConvertKit
- [ ] Calendly booking link (`contact.html`)
- [ ] Explainer video ID (`index.html`, `data-video-src`)
- [ ] Confirm all three social URLs — one of the current site's four icons is broken
- [ ] Verify canonical URLs match the final production domain

---

## Accessibility baseline

Built to WCAG 2.2 AA. Verify before launch:

- Skip link present on every page
- One `<h1>` per page, no skipped heading levels
- All interactive targets ≥ 44×44px
- Visible focus rings via `:focus-visible`
- Every form input has a real `<label>`
- Errors announced via `role="alert"`; filter results via `aria-live="polite"`
- `prefers-reduced-motion` respected
- Scroll reveals default to VISIBLE — content never depends on JS to appear

**Run before launch:** WAVE, axe DevTools, full keyboard-only pass,
and a screen reader pass (VoiceOver or NVDA).

---

## Local preview

```bash
# Python 3
python3 -m http.server 8000

# or Node
npx serve
```

Open `http://localhost:8000`.

Do not open the files directly with `file://` — the relative asset paths work,
but some browsers restrict behavior on the `file:` protocol and it is not
representative of production.

---

## Deployment

Static. Commit and push; no build step.

**GitHub Pages:** push to the repo, enable Pages on the branch root.
**Netlify:** drag the folder in, or connect the repo. Build command: none.
Publish directory: `/`.

---

## Known gaps in this draft

1. **No 404 page.** Add `404.html` before launch.
2. **No `sitemap.xml` or `robots.txt`.** Required for Search Console
   submission (Phase 7).
3. **No individual article pages.** The Insights archive links out to external
   publications. Native articles on this domain are what compound SEO
   authority — external links build Forbes's authority, not CFG's.
4. **Fonts loaded from Google.** Self-hosting removes a third-party request
   and the associated privacy consideration. Worth doing if the perf target
   proves tight.
5. **Copy is a first draft.** All body text needs Tyler's review. It was
   written to be structurally correct and tonally consistent with the approved
   brand direction, not to be published unedited.

---

# VIDEO IMPLEMENTATION

## Encoding specs — hero loop

Target the ceiling, don't just export from the NLE. Source a 4–6s clip.

```bash
# 1. MP4 / H.264 — universal fallback
ffmpeg -i source.mov -an \
  -vf "scale=1280:720" -r 24 \
  -c:v libx264 -crf 30 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  assets/video/hero-loop.mp4

# 2. WebM / VP9 — served first, ~25-35% smaller on real footage
ffmpeg -i source.mov -an \
  -vf "scale=1280:720" -r 24 \
  -c:v libvpx-vp9 -crf 38 -b:v 0 \
  -deadline good -cpu-used 2 \
  assets/video/hero-loop.webm

# 3. Poster — MUST be frame 1 of the encoded video
ffmpeg -i assets/video/hero-loop.mp4 -vframes 1 \
  -vf "scale=1920:1080" -q:v 5 assets/img/hero-poster.jpg
```

| Setting | Value | Why |
|---|---|---|
| `-an` | strip audio | Guarantees autoplay; saves bytes. A muted track still ships data. |
| `scale=1280:720` | 720p | Upscaled by CSS. Behind a scrim at hero size, nobody can tell. ~7x smaller than 1080p. |
| `-r 24` | 24fps | Cinematic, and 20% fewer frames than 30. |
| `-crf 30` / `38` | quality | Higher = smaller. Tune per clip; check the result. |
| `+faststart` | metadata first | Without it the browser downloads the whole file before the first frame. |

**Budget: hero MP4 under 900 KB, WebM under 700 KB.** My synthetic test clips came in far under that, but gradient footage compresses much better than real drone footage of surf and foliage — expect 400–900 KB for real material. If you exceed the budget, drop the clip length before dropping quality.

## Explainer films (30s)

Same commands, but `-crf 28` and keep 1080p — these are watched deliberately, not glanced at. Budget 3–5 MB each. They cost nothing until clicked.

**Captions are required.** WCAG 1.2.2 Level A. Write the `.vtt` from the approved script — the words already exist.

## Film placement

| Film | Page | Why |
|---|---|---|
| Where Purpose Meets Possibility | Home | Broadest, most brand-level — belongs where the visitor has least context |
| Building Better Business Through Community | About | Values and why the firm exists |
| Connection Is the Catalyst | Capabilities | The Collaborate capability in film form |
| Turning Impact Into Influence | Impact | Lands with the case study evidence behind it |
| Crafting the Stories That Move Communities | Insights | Storytelling page, storytelling film |
| Impact, Designed With Intention | **held back** | Duplicates the Capabilities film's argument |
| Purpose Built. Community Driven. | **held back** | Duplicates the About film's argument |

Two films are deliberately not placed. See notes to Tyler.

## Verified behavior (18/18 automated tests)

- LCP element is the poster `<img>`, not the video — measured at 736ms
- Desktop fetches WebM only; MP4 never requested
- Mobile (<768px): **zero** video bytes
- `prefers-reduced-motion`: **zero** video bytes
- Pause control present and functional (WCAG 2.2.2 Level A)
- Facades fetch nothing until clicked
