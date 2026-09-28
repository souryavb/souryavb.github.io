# souryavb.github.io

Personal portfolio site. Plain HTML, CSS, and a little JavaScript — no build step, no
dependencies. Open `index.html` in a browser and what you see is what deploys.

## Structure

```
index.html                          Intro, work map, experience, about, contact
404.html                            Shown for unknown URLs
design.md                           The design system: read before changing a page
css/tokens.css                      Every colour, font, and spacing value
css/style.css                       All styling, built only from tokens.css
js/main.js                          Work map connectors, footer year, click-to-zoom
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
2. Set `data-lane` on `<body>` to `infra` or `analysis`, and fill in everything marked `TODO`.
3. In `index.html`, copy a `<li>` inside the right lane of the work map and point it at the
   new page. List the tools it used in `data-tools`, and add a `.tool` chip for any tool
   that isn't in the middle column yet. The connectors draw themselves.
4. Fix the Previous / Next links at the bottom of the neighbouring project pages.

## Things worth knowing

- **Images are optional.** Every project uses a hand-written SVG in `assets/img/` rather than
  a photo, so nothing renders as a broken image. Swap in real screenshots when you have them —
  put them in `.gallery` blocks and they become click-to-zoom automatically.
- **The SVGs can't read the CSS tokens**, because they load as `<img>`. Their colours are
  hard-coded hex values that match `css/tokens.css`, so change both if the palette changes.
- **The work map needs no JavaScript to be usable.** Without it, or on screens narrower than
  60em, it's two plain lists with the tools written under each project.
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
