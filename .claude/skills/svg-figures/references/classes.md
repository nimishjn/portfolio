# Theme classes for figures and previews

All drawing colour comes from these classes, defined in `src/app/(frontend)/globals.css` (sections
"Publication figures" and "Project previews"). Each maps to CSS variables that change between light
and dark mode, which is why a drawing must not hard-code colours. `check-svg.ts` reads the live list
from the stylesheet, so if this file and the CSS ever disagree, the CSS wins.

## Contents

- Colour tokens
- What the drawing sits on
- Publication classes (`.fig`, usable in both kinds of drawing)
- Project classes (`.pv`, project previews only)
- Classes that leave fill unset

## Colour tokens

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--accent` | `#2546c9` | `#9cb1ff` | the one focal element |
| `--accent-weak` | `#ebeffc` | `#1c2243` | accent tint (bands, chips) |
| `--muted` | `#5b5c64` | `#a3a4ac` | secondary lines, points, labels |
| `--fg` | `#141416` | `#ececee` | rare strong ink (`pw`) |
| `--line` | `#e6e6e2` | `#28292d` | hairlines, skeleton bars |
| `--line-strong` | `#d3d3ce` | `#3a3b41` | axes, graph edges, borders |
| `--chip` | `#f1f1ee` | `#1a1b1e` | the tile behind a drawing |
| `--card` | `#ffffff` | `#141519` | panels and paper inside a drawing |
| `--bg` | `#fcfcfb` | `#0f1012` | input fields |
| `--on-accent` | `#ffffff` | `#0f1012` | text on an accent fill |

Note that in dark mode `--card` is darker than `--chip`, so a panel reads as a recessed surface
rather than a raised one. Give panels a border (`panel`, `sheet` already have one).

## What the drawing sits on

- **Publication figure**: a 112 × 84 tile with a `--chip` background, 1px `--line` border and 12px
  corners. The SVG fills 110 × 82 of it. The tile is hidden below 520px screen width.
- **Project preview**: a strip across the top of the card, 200px tall (150px on phones) and as wide
  as the card (roughly 320 to 600px). Its background is `--chip` with a 20px grid of `--grid` lines.
  The 360 × 200 drawing is scaled to fit the height and centred, so on wide cards the grid shows at
  both sides. The whole drawing scales up 3.5% while the card is hovered.

## Publication classes (`.fig`)

| Class | Renders | Typical use |
| --- | --- | --- |
| `acc` | accent stroke 1.8, no fill, round caps and joins | the main line or shape |
| `mut` | muted stroke 1.2 at 55% opacity, no fill | context line, raw or "before" series |
| `ax` | `--line-strong` stroke 1, **fill unset** | axis or baseline (straight lines only) |
| `dot` | muted fill at 60% opacity | data points (r ≈ 1.8) |
| `adot` | accent fill with a 1.5 `--chip` edge | highlighted point. On the bare tile the edge is invisible, so the visible radius is r − 0.75; on a `sheet`, `band` or `panel` it shows as a pale halo (fine as a separator) |
| `ring` | accent stroke 1 at 40% opacity, no fill | halo around a highlighted point |
| `ghost` | `--chip` fill, accent stroke 1.2 | hollow accent point, "where it was" |
| `band` | `--accent-weak` fill | tolerance band, highlighted region |
| `dash` | muted dashed stroke 1 (2 3) at 60%, no fill | limits, guides |
| `adash` | accent dashed stroke 1.2 (2 2.5), no fill | moves, corrections, connections |
| `sheet` | `--card` fill, `--line-strong` stroke 1 | a sheet of paper or a panel |
| `sheet-back` | 60% opacity (combine with `sheet`) | a second sheet behind the first |
| `hex` | 7.5px mono text, muted at 75% | short codes, bytes, tiny labels |
| `draw` | redraws the stroke when the card is hovered | needs `pathLength="100"`; solid lines only, since a dashed line loses its dashes while it redraws |

## Project classes (`.pv`, previews only)

Project previews can also use every class above.

| Class | Renders | Typical use |
| --- | --- | --- |
| `panel` | `--card` fill, `--line` stroke 1 | a window, card or sidebar |
| `field` | `--bg` fill, `--line-strong` stroke 1 | an input box |
| `t` | 9px mono text, muted | labels, file names, line numbers |
| `t-acc` | 9px mono text, accent | an active or highlighted label |
| `t-on` | 10.5px sans text, `--on-accent`, weight 500 | text on an accent button |
| `mid` | centres text (`text-anchor: middle`) | combine with a text class |
| `c-a` … `c-d` | tile fills: accent tint, card, 34% accent, 9% ink | grids, swatches, keyword bars |
| `sk` | `--line` fill | skeleton bar (placeholder text or code) |
| `sk-a`, `hint` | `--accent-weak` fill | accent skeleton bar, hint chip |
| `btn-r` | accent fill | a button |
| `pw` | `--fg` fill | password dots, strong ink |
| `ok` | accent stroke 1.8, no fill, round | tick mark |
| `pattern` | accent stroke 3, no fill, round | bold accent line or symbol |
| `node` | accent fill with a 2.5 `--card` edge | graph node |
| `edge` | `--line-strong` stroke 1.2, **fill unset** | inactive graph edge (`<line>`) |
| `edge-on` | accent stroke 1.6 at 75%, **fill unset** | active graph edge (`<line>`) |
| `n-done` | accent fill, `--card` edge 2 | solved or finished node |
| `n-lock` | `--card` fill, `--line-strong` edge 1.4 | locked or pending node |
| `n-cur` | `--card` fill, accent edge 2 | current node (pair with `n-in` inside) |
| `n-in` | accent fill | inner dot of the current node |
| `n-ring` | accent stroke 1 at 40%; **pulses on hover** | halo around the current node |
| `caret` | accent fill; **blinks on hover** | text cursor (a 2 × 11 rect) |

## Classes that leave fill unset

`ax`, `edge`, `edge-on`, `sheet-back`, `mid` and `draw` don't set a fill. On a `<line>` that is
fine, since lines have no fill. On any shape with area (a path with two or more segments, a
polyline with three or more points, rect, circle, ellipse, polygon, text) the fill falls back to
black and shows as a blob in both themes. Either combine with a class that sets fill or add
`fill="none"`. `check-svg.ts` flags these.
