# souryavb.github.io

Personal portfolio site. Plain HTML, CSS, and a little JavaScript — no build step, no
dependencies. Open `index.html` in a browser and what you see is what deploys.

## Structure

```
index.html              Home: hero, projects, about, contact
404.html                Shown for unknown URLs
css/style.css           All styling (design tokens at the top)
js/main.js              Footer year + click-to-zoom for gallery images
assets/img/             Images and SVGs
projects/
  sp500-rsi-trader.html A finished project page
  project-two.html      Template — copy this for each new project
```

## Running it locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening the files directly with `file://` also works,
but a local server matches how GitHub Pages will serve them.

## Before this goes public

Search the whole folder for `TODO` and resolve every hit:

```sh
grep -rn "TODO" --include="*.html" .
```

The ones that matter most:

- **`TODO-LINKEDIN`** — appears in every page's nav and footer. Replace with your real
  profile URL, or delete the links.
- **`TODO-FIGURES`** and **`TODO-TRADES`** in `projects/sp500-rsi-trader.html` — these are
  em-dash placeholders, not results. Run the backtest and paste in the real numbers, or
  delete those blocks. Do not ship invented performance figures on a finance portfolio.
- **`TODO-PROJECT-2`** — a real second project, or delete the tile from `index.html` and
  delete `projects/project-two.html`.
- **`TODO-BIO`**, **`TODO-ABOUT`**, **`TODO-SKILLS`** — the placeholder copy is a
  reasonable starting point, but it's my guess at your voice, not your voice.

## Adding a project

1. Copy `projects/project-two.html` to `projects/your-project.html`.
2. Fill in the content.
3. Copy a `<article class="tile">` block in `index.html` and point it at the new page.

## Deploying

GitHub Pages serves the `main` branch of a repo named `souryavb.github.io` at
<https://souryavb.github.io>. Push to `main` and the site updates within a minute or two.

Settings → Pages should read: Source *Deploy from a branch*, Branch `main`, folder `/ (root)`.
