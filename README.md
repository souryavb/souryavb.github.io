# souryavb.github.io

Personal portfolio site. Plain HTML, CSS, and a little JavaScript — no build step, no
dependencies. Open `index.html` in a browser and what you see is what deploys.

## Structure

```
index.html                          Hero, projects, experience, about, contact
404.html                            Shown for unknown URLs
css/style.css                       All styling (design tokens at the top)
js/main.js                          Footer year + click-to-zoom for gallery images
assets/img/                         SVG graphics, one per project
projects/
  okta-meeting-app.html             Bain Capital, 2026
  flight-delay-prediction.html      Course project, 2025
  helpdesk-triage.html              CT Judicial Branch, 2025
  sp500-rsi-trader.html             Personal project, 2026
  _template.html                    Copy this for a new project (not linked from the site)
```

## Running it locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening files directly with `file://` also works, but a
local server matches how GitHub Pages serves them.

## Adding a project

1. Copy `projects/_template.html` to `projects/your-project.html`.
2. Fill in everything marked `TODO`.
3. Copy an `<article class="tile">` block in `index.html` and point it at the new page.
4. Fix the `.pager` links at the bottom of the neighbouring project pages.

## Things worth knowing

- **Images are optional.** Every project uses a hand-written SVG in `assets/img/` rather than
  a photo, so nothing renders as a broken image. Swap in real screenshots when you have them —
  put them in `.gallery` blocks and they become click-to-zoom automatically.
- **To use a headshot** in the hero, replace the `<div class="render">` block in `index.html`
  with `<img class="hero-photo" src="assets/img/headshot.jpg" alt="Sourya Beesabathuni">`.
- **The RSI backtest numbers are real**, from a run over ^GSPC 2020-01-01 to 2026-09-27. If you
  re-run it the numbers will move, since the end date is "today" by default. Re-run with
  `python rsi_trader.py --start 2020-01-01 --end 2026-09-27` to reproduce exactly what's on the
  page, or update the page and its caption.
- **The Bain Capital and Judicial Branch pages are deliberately general.** No code, keyword
  lists, or internal data — just architecture and reasoning. Keep it that way.
- **Your phone number is not on the site.** It's on your resume; contact here is email and
  LinkedIn. Add it if you want it public.

## Deploying

GitHub Pages serves the `main` branch of a repo named `souryavb.github.io` at
<https://souryavb.github.io>.

```sh
git push -u origin main
```

Settings → Pages should read: Source *Deploy from a branch*, Branch `main`, folder `/ (root)`.
Changes go live a minute or two after a push.
