# Design — souryavb.github.io

The locked design system for this site. Read this before changing or adding a page. Extend
or amend this file when the system needs to grow; don't override it page by page.

## Idea

The work splits along one axis: **infrastructure & security** (Bain ITSM, the Okta app, the
CT Judicial Branch internship, help desk triage) and **analysis** (the flight-delay model,
the RSI backtester). Everything visual follows from that axis. Each lane has one colour, and
that colour appears only where it marks a lane.

## Genre and tone
Editorial. Technical, austere. Hairlines and spacing instead of cards and shadows.

## Page families
- **Home:** Map / Diagram. A two-lane work map with tools in the middle; `js/main.js` draws
  the connectors on screens ≥ 60em. Below it, the page reads like a document: an experience
  ledger, About prose with a skills list, then the footer.
- **Project pages:** Long Document. A single 64ch column: title, lede, a fact table (Where /
  When / Lane / Tools), one figure, optional headline figures, prose, then previous/next links.
  Start from `projects/_template.html`.

## Colour
Tokens live in `css/tokens.css`, with their hex values and contrast ratios against paper.

| Token | Role |
|---|---|
| `--color-paper` / `--color-paper-2` | warm off-white background / bands and wells |
| `--color-ink` / `--color-ink-2` / `--color-muted` | text, from strongest to weakest; muted is the smallest text allowed |
| `--color-rule` / `--color-rule-strong` | hairlines / control borders |
| `--color-infra` / `--color-infra-ink` | safety orange. The plain value is for marks only; `-ink` is text-safe |
| `--color-analysis` / `--color-analysis-ink` | plotter green, same split |
| `--color-focus` | focus ring (= infra-ink) |

Rules: the lane colours cover no more than about 5% of any screen. They never decorate.
Something unrelated to either lane (the Kumon job, say) gets a muted dot.

## Typography
- **Instrument Sans** (variable weight and width). Headings: weight 600, `font-stretch: 82%`.
  Body: weight 400, 100%.
- **Martian Mono** for data: dates, tools, figures, labels, code. Use the `.mono` class.
- Headings are always roman. No italic emphasis inside headings, no uppercase eyebrows or
  section numbers.
- Hero-size type (`--text-display`) appears twice per page at most: the main heading and the
  footer line.

## Spacing, lines, corners
4-point named scale (`--space-3xs` to `--space-3xl`). Hairlines are `--rule-hair`; lane marks
are `--rule-mark`. One radius, `--radius-control` (3px), used only on tool chips and the skip
link.

## Motion
Only the map moves. Its connectors fade in once after layout, and highlights change
opacity over `--dur-short` (150ms) with `--ease-out`. Nothing else animates. Reduced-motion
settings shorten transitions to effectively instant.

## Shared chrome
- **Nav (N9):** wordmark on the left, one or two text links on the right. Below 24em, the
  secondary link (`.top-links__extra`) hides.
- **Footer (Ft5):** "Open to co-op and internship roles." at display size, the address in
  mono, then Email / LinkedIn / GitHub and a colophon line.
- Every page has a skip link, and each page's `<main id="main">` is what it targets.

## Honesty rules
- No invented numbers. Figures come from real runs (see README for how to reproduce the RSI
  figures).
- The Bain Capital and CT Judicial Branch pages stay general: architecture and reasoning,
  with no code, keyword lists or internal data.
- No phone number on the site.

## Exports
`css/tokens.css` is the canonical export. This is a plain-HTML site, so there are no
Tailwind or shadcn mirrors; generate them from `tokens.css` if the site ever moves to a
framework.
