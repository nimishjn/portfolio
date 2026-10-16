---
name: svg-figures
description: Draw SVG illustrations for nimish-jain.com, either a publication figure (112×84 tile on a research card) or a project preview (360×200 strip at the top of a project card). The drawings follow the site's light/dark theme classes, survive the CMS sanitiser and animate on hover. Then check them, preview them in both themes, and add them to Payload (seed data, the local database or the production admin). Use this whenever the user wants a new or changed figure, illustration, drawing, artwork, thumbnail, diagram or "SVG" for a publication, paper, project or card on this site, including fixing one that looks broken, even if they never say "figure".
---

# SVG figures for nimish-jain.com

Two kinds of artwork come from the CMS as raw SVG and are inlined into the page:

| | Publication figure | Project preview |
| --- | --- | --- |
| Admin field | Publications → **Figure (SVG)** (`figureSvg`) | Projects → **Preview (SVG)** (`previewSvg`) |
| viewBox | `0 0 112 84` | `0 0 360 200` |
| Script flag | `--type publication` | `--type project` |
| Shown as | a small tile beside the citation | the strip across the top of the card |
| Classes | `.fig` set | `.fig` and `.pv` sets |
| Rendered by | `src/components/site/PublicationFigure.tsx` | `src/components/site/ProjectPreview.tsx` |

Both fields are optional. When one is empty the card shows a built-in placeholder: a paper with a
chart for publications, a code editor with `</>` for projects. Six real drawings live in
`src/seed/figures.ts`. Read a couple before drawing, since they show the house style better than any
description.

## Colour only through classes

The site switches themes by swapping CSS variables, and the sanitiser removes `style` elements and
attributes. So a drawing gets its colours from the theme classes in `globals.css`, never from
`fill="#…"` or `stroke="#…"`: a hard-coded colour is right in one theme and wrong in the other.

The full class list, what each one renders, and the token values in both themes are in
`references/classes.md`. Read it before drawing. The essentials:

- **Publication figures** can only use the `.fig` classes: `acc` (accent line), `mut` (muted line),
  `ax` (axis), `dot` / `adot` (points), `ring`, `ghost`, `band` (accent tint), `dash` / `adash`
  (dashed), `sheet` / `sheet-back` (paper), `hex` (tiny mono text). The `.pv` classes don't apply
  inside a publication tile.
- **Project previews** can use those plus the `.pv` set:
  - surfaces: `panel`, `field`, `c-a` … `c-d` (tinted tiles);
  - labels: `t` / `t-acc` / `t-on`, with `mid` to centre them;
  - skeleton bars: `sk` / `sk-a` / `hint`;
  - graphs: `node` / `edge` / `edge-on` and `n-done` / `n-lock` / `n-cur` / `n-in` / `n-ring`;
  - accents: `btn-r`, `pw`, `ok`, `pattern`, `caret`.
- **Class rules beat attributes.** `stroke-width="3"` on an `acc` line does nothing, because `acc`
  sets the width. An attribute only fills a gap a class leaves, such as `fill="none"` on an `ax`
  shape or `text-anchor="end"` on a label. For a different weight, use another class: `pattern` is
  the bold accent line in previews. If none fits, see "When the vocabulary isn't enough".
- **Some classes set no fill** (`ax`, `edge`, `edge-on`). Use them on lines, or add `fill="none"`;
  otherwise a shape with area renders as a black blob.

## What the sanitiser keeps

`src/lib/svg.ts` cleans the SVG when it's saved and again when the page renders. Anything it drops
just disappears, so draw within its whitelist:

- **The root:** exactly one `<svg>` with a `viewBox`. Nothing may come before or after it.
- **Elements:** `g`, `path`, `circle`, `ellipse`, `rect`, `line`, `polyline`, `polygon`, `text`,
  `tspan`, `defs`, `clipPath`, `linearGradient`, `radialGradient`, `stop`, `title`, `desc`.
- **Not allowed:** `use`, `image`, `pattern`, `mask`, `marker`, `symbol`, `filter`, `foreignObject`,
  links and scripts.
- **Attributes:** the geometry ones, `class`, `transform`, `opacity`, the stroke/fill presentation
  attributes, and `text-anchor` / `dominant-baseline` on text. No `style`, no event handlers.
  `pathLength` works on path, line, polyline, polygon and circle only.
- **Gradients can't follow the theme,** because `stop` takes no class. Prefer `band` or opacity for
  tints.
- **ids:** several drawings share one page, so prefix any id (`fhe-clip`), or avoid ids.

## Motion

- Add `class="… draw"` and `pathLength="100"` to the one **solid** line that tells the story. It
  redraws when the reader hovers the card. Only path, line, polyline, polygon and circle can do
  this. A dashed line (`dash`, `adash`) loses its dashes while it redraws, so don't animate those.
- In project previews, `n-ring` pulses and `caret` blinks on hover.
- Visitors with reduced motion see no animation at all, so the drawing has to read complete at rest.

## House style

- **Illustrate the idea, not the data.** These are small, abstract signs of what the work is
  about (ciphertext and a padlock; points escaping a tolerance band; one shared threshold across
  separate sheets), not plots of results.
- **One accent focal point** (an `acc` line, `adot` or `pattern`), with everything else muted.
  The accent is what the eye should land on.
- **Breathing room.** Keep about 6 units of margin in a figure, and about 20 in a preview, where the
  sides may also show the grid. Balance the empty space above and below. Avoid details below 1
  unit; they vanish at 1× density.
- **Text sparingly:** `hex` in figures; `t` / `t-acc` labels in previews. Keep it to a few
  characters and lowercase. Never let meaning depend on text, because font metrics vary slightly.
  Right-align numbers with `text-anchor="end"`.
- **Keep it small:** most drawings here are 500 to 2,500 characters.
  - Round coordinates to one decimal.
  - Merge many identical shapes that share a class into one compound path, with relative moves.
    For example, a row of bars is `<path class="c-d" d="M70 79h5v12h-5zm7.5 0h5v12h-5z…"/>`,
    not dozens of `<rect>`s.

## Workflow

Run the scripts from the repo root. They need Node 24, which runs `.ts` files directly, and
Google Chrome for the previewer (or `PLAYWRIGHT_CHANNEL=chromium` after
`pnpm exec playwright install chromium`). When the draft lives outside the repo, pass its
absolute path.

1. **Understand the subject.**
   - For an existing entry, read its title and summary or description from `src/seed/data.ts`,
     the local admin, or the user.
   - For a new paper or project, a title and a sentence about it are enough to draw from. Ask if
     you don't have them. The entry itself still has to be created before delivery (see below).
   - Pick one idea to show.
2. **Draft** the SVG in a scratch file outside the repo, for example in your scratchpad directory.
3. **Check it** (fast, offline):
   ```bash
   node .claude/skills/svg-figures/scripts/check-svg.ts /abs/path/draft.svg --type publication   # or --type project
   ```
   - It runs the real sanitiser, enforces the viewBox, and rejects unknown classes.
   - It warns about hard-coded colours, black-fill blobs, attributes a class overrides, `draw`
     problems, and ids.
   - It writes the exact one-line markup to paste into the CMS as `draft.clean.svg`.
   - Fix every error; take warnings seriously.
4. **Preview it** in the real page, light and dark:
   ```bash
   node .claude/skills/svg-figures/scripts/preview-svg.ts /abs/path/draft.svg --type publication --title "The entry's title"
   ```
   - It needs the site running: `pnpm dev`, or pass `--url` with a deployed copy.
   - It writes `draft.preview.png` (the card) and `draft.zoom.png` (the drawing, enlarged), each
     light | dark, and reports what animates on hover.
   - The drawing goes into the first card on the page, so pass `--title` to show the right title.
     The rest of the card's text still belongs to that other entry; say so when you show it.
   - Look at both images yourself, fix what looks off, and repeat.
   - Then show the user the preview before putting the drawing anywhere.
5. **Deliver** to wherever the user wants it (next section).

## Getting a drawing into the site

Content lives in the database, not in code: local development uses Docker Postgres (`.env`), and
production uses Neon behind the live admin. Pick the places the user asked for.

- **Seed data**, so fresh databases get it: add the `.clean.svg` markup to `src/seed/figures.ts`
  (a template literal in `figures` or `previews`) and reference it from the entry in
  `src/seed/data.ts` (`figureSvg: figures.<name>` / `previewSvg: previews['<name>']`). Don't run
  `pnpm seed` on a database with real edits, because it replaces all content.
- **The local database:**
  ```bash
  pnpm payload run .claude/skills/svg-figures/scripts/set-svg.ts publications "<part of the title>" /abs/path/draft.clean.svg
  ```
  Use `projects` for a preview. It matches the title, saves through Payload so validation and
  sanitising run, and refuses any non-local `DATABASE_URL`.
- **Production:** the user pastes the `.clean.svg` markup into the field in the live admin (Figure
  (SVG) / Preview (SVG)) and saves. Saving refreshes the published page.
  - If the user asks you to apply it, and they're signed in to the live admin in the built-in
    browser, you can do it from that admin page with `fetch`. Find the id with
    `GET /api/publications?where[title][like]=<words>&depth=0`, confirm the title is the one you
    mean, then `PATCH /api/publications/<id>` (or `/api/projects/<id>`) with
    `{"figureSvg": "<svg…>"}` / `{"previewSvg": …}`.
  - Check the response is 200 and that the stored value equals what you sent.
  - Never type the user's password or authenticator code. If the admin isn't signed in, or is waiting
    on its code page, ask them to finish signing in. Until the code is entered, the API refuses writes
    with a 403.

**New entries.** Every route above updates an entry that already exists. For a new paper or project,
the entry has to be created first, and the drawing can go in at the same time.
- **In production,** the user creates it in the live admin and pastes the SVG into its field while
  they're there.
- **For the seed or the local database,** the entry needs its other required fields. Ask the user
  for them rather than inventing any. Publications need authors, type, year, venue, publisher, DOI
  and summary. Projects need year, context (personal or an organisation), description, stack and
  links.

## When the vocabulary isn't enough

If a drawing genuinely needs a new class, add it to `globals.css` in the right section (`.fig .name`
or `.pv .name`, colours from tokens only, so both themes work). Document it:
- in `references/classes.md`,
- in the README tables (Publication figures, Project cards),
- in the field description in `src/collections/Publications.ts` or `Projects.ts`.

`check-svg.ts` picks it up automatically.

**Ship the CSS before the content.** If the drawing reaches production before the deploy that adds
its class, it renders unstyled there, with black fills and missing strokes. So tell the user to
deploy the change first, then save the drawing.

## Other SVGs on the site (not this workflow)

- **Banners** (link preview, LinkedIn, X, GitHub): `src/components/banner/Banner.tsx` reuses the newest
  publication and project drawings as they are, so there's nothing extra to draw. Re-run `pnpm banners`
  after adding a drawing that should appear there. The `/cv` preview (`src/lib/og-banner.tsx`) is drawn with
  explicit colours and no text, because that renderer has no stylesheet or embedded fonts.
- **Favicon and app icons:** `scripts/brand-icons.ts`, regenerated with `pnpm icons`.
- **Profile link icons:** chosen in the admin's icon picker (Lucide). The brand logos are
  hand-drawn in `src/components/icons.tsx`.
