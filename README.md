# nimish-jain.com

Personal academic site for Nimish Jain, built with **Next.js 16**, **Payload CMS 3** (Postgres) and **Tailwind CSS 4**.

This is the source of my own site, public so you can see how it's built. It isn't a template: the name,
domain and design are mine, and nothing here is set up for reuse. The code is MIT-licensed (see
[LICENSE](LICENSE)). The content isn't, so please don't republish the text and drawings in `src/seed` or the
images in `public/`. If you find a security issue, email contact@nimish-jain.com rather than opening an issue.

Design source of truth: the "nimish-jain.com v2" canvas in Claude Design (private link).

## What's here

| Route | What it is |
| --- | --- |
| `/` | Home page: intro, publications, education (with a coursework credit chart), experience and internship timelines, projects, service, writing |
| `/cv` | Tabular, German-style academic CV; prints to A4 with its own print stylesheet |
| `/cv.pdf` | The CV as a PDF, uploaded under Site → CV in the admin; redirects to `/cv` until one is |
| `/cv/print` | The CV rendered fresh from the database, opening the print dialog (for saving the PDF; signed-in admin only; `?full=1` adds the personal details) |
| `/resume.pdf` | A one-page resume, uploaded under Site → Resume; not linked from the site or indexed, and redirects to `/cv` until one is uploaded |
| `/admin` | Payload admin for all content |
| `/banners/*.png` | Link-preview image and social headers (LinkedIn, X, GitHub), made by `pnpm banners` |
| `/cv/opengraph-image-*` | The `/cv` link-preview image, generated from the CMS (`src/lib/og-banner.tsx`) |
| `/favicon.svg`, `/favicon.ico`, `/apple-touch-icon.png`, `/manifest.webmanifest` | Favicon set and web manifest |
| `/sitemap.xml`, `/robots.txt` | Generated |
| `/story` | Permanent redirect to `/` (old site) |

## Local development

Requirements: Node 24, pnpm 11 (pinned in `package.json`), Docker (for Postgres).

```bash
cp .env.example .env   # then set PAYLOAD_SECRET (e.g. `openssl rand -hex 32`)
pnpm install
pnpm db:up             # Postgres 17 on localhost:54329
pnpm seed              # load the content from src/seed/data.ts
pnpm dev               # http://localhost:3000, admin at /admin
```

On the first visit to `/admin`, Payload asks you to create the first user.

In development the schema of the local Docker database is pushed automatically. Any other database (Neon)
changes only through migrations, so after changing a collection or global, create one for production:

```bash
pnpm payload migrate:create <name>
```

## Content

Everything on the site comes from the CMS. Collections live in `src/collections`, globals in `src/globals`.

| In the admin | Holds |
| --- | --- |
| Site → Profile | Name, subtitle, bio, links, research interests, study-intent line (off by default), portrait, meta description, "last updated" |
| Site → CV | The PDF at `/cv.pdf`, and CV-only details: phone, date of birth and nationality (full print view only), languages, skills, the place and date at the end, body size |
| Site → Resume | The PDF at `/resume.pdf` (only signed-in users can read this page's data) |
| Content → Publications | Citation data, BibTeX, summary, and which illustration the card shows |
| Content → Experiences | Work experience and internships (`kind`), with site summary, bullets and the CV line |
| Content → Education, Courses | Degrees and schools; coursework grouped by area for the credit chart |
| Content → Projects, Service, Writing | The remaining sections |

- **Projects:** the home page shows the first four, by sort order. The rest sit behind **Show more**.
- **Writing:** the section only appears while there is at least one article.
- **Collapsed content:** everything a visitor has to open is still in the page's HTML for search engines,
  only hidden until opened. That covers summaries, BibTeX, coursework, role details and the projects behind
  Show more. The study-intent line is the exception: while it's off, it isn't rendered at all, and its
  text is never part of the public API (only a signed-in user can read that field).

### Organisation logos and links

- **Logos:** Experiences, Leadership & service, and Education have an optional **Logo** in the sidebar. Upload
  the square symbol rather than the wordmark, as an SVG or a PNG with a transparent background. The site draws
  it as a single-colour silhouette in the small tile, so it follows light and dark mode and turns cobalt on
  hover. Without a logo the tile shows a monogram. A logo on a solid background shows up as a filled square,
  because the silhouette is cut from the image's transparency.
- **Links:** set an experience's **Organisation website** and the organisation name on the timeline becomes a
  link.

### Profile link icons

Each link under Site → Profile → Contact has an **Icon** picker. **Change** opens a searchable drawer with:

- the site's own glyphs: GitHub, LinkedIn, ORCID, Google Scholar, Email and Link. Lucide has no brand logos,
  so these stay hand-drawn (`src/components/icons.tsx`).
- every Lucide icon (from `lucide-static`), searchable by name or by Lucide's tags, so "school" finds
  `graduation-cap`. These are stored as `lucide:<name>`.

The site draws the chosen icon on the server, so Lucide's icon data never reaches visitors' browsers; the admin
loads it on demand. To get newer Lucide icons, bump `lucide-static`.

### Publication figures

Each publication card shows a small figure (112 × 84): your own **Figure (SVG)** if you paste one
(`<svg viewBox="0 0 112 84">…</svg>`), otherwise a placeholder paper with a chart
(`src/components/site/PublicationFigure.tsx`).

To make a figure follow light and dark mode, colour it with these classes rather than fill or stroke colours:

| Class | Draws |
| --- | --- |
| `acc` | accent line (add `draw` and `pathLength="100"` to redraw it on hover) |
| `mut` | muted line |
| `dot`, `adot` | muted point, accent point |
| `band` | accent-tinted area |
| `dash`, `adash` | dashed muted line, dashed accent line |
| `ax` | axis or baseline |
| `ring`, `ghost` | accent ring, hollow accent point |
| `sheet` | sheet of paper: card-coloured with a hairline border |
| `hex` | small mono text |

```svg
<svg viewBox="0 0 112 84">
  <path class="ax" d="M8 70H104" />
  <polyline class="acc draw" pathLength="100" points="10,58 28,40 46,48 64,28 82,36 102,20" />
  <circle class="adot" cx="64" cy="28" r="3.5" />
</svg>
```

The SVG is sanitised when you save it, and again when the page renders. Scripts, event handlers, `style`,
links and anything other than basic drawing elements are removed (`src/lib/svg.ts`).

To draw a new one with Claude Code, just ask for it; the project skill in `.claude/skills/svg-figures` covers
the classes and rules above, checks the SVG with the real sanitiser, and previews it in light and dark mode.

### Project cards

- **Context:** each project is either a **Personal project** or **Built at an organisation**. The second needs
  an organisation name, and the card shows "Built at Electron" (for example) next to the year.
- **Preview:** the top of the card shows your own **Preview (SVG)** if you paste one, otherwise a placeholder
  code editor with the `</>` mark (`src/components/site/ProjectPreview.tsx`). It works like a publication
  figure, drawn in a `viewBox="0 0 360 200"` area, and can use the publication classes above plus these:

| Class | Draws |
| --- | --- |
| `panel` | card surface with a hairline border |
| `field` | input box |
| `t`, `t-acc` | small mono label, in muted or accent colour |
| `node`, `edge`, `edge-on` | graph nodes and connecting lines (`edge-on` is accent) |
| `c-a` … `c-d` | tinted tiles, from accent-tinted to neutral |
| `sk` | placeholder bar |
| `pattern` | thick accent line |
| `caret` | accent text cursor that blinks on hover |

The two original project drawings (`src/seed/figures.ts`) also use `t-on` (label on an accent button), `mid`
(centred label), `btn-r` (accent button), `pw` (password dot), `ok` (accent tick), `n-done`, `n-lock`, `n-cur`,
`n-in`, `n-ring` (graph nodes: solved, locked, current; the ring pulses on hover), and `sk-a`, `hint` (accent-tinted bar).
Keep these classes in `globals.css` while those drawings are in use.

Dates are stored as the first of the month and formatted per surface: `Feb 2026 – now` on the site,
`02/2026 – present` on the CV. On the CV, text in `[square brackets]` is highlighted as a placeholder.

Pages are static. Saving anything in the admin revalidates `/`, `/cv` and the OG image
(`src/hooks/revalidate.ts`).

`pnpm seed` replaces all content with `src/seed/data.ts`. It's for setting up a fresh database. Don't
run it against production after you've started editing there.

## Admin theme

The admin panel is themed with [`payload-theme`](https://github.com/liderbektas/payload-theme), configured in
`src/payload.config.ts` with the site's cobalt accent, Geist, and your name as the logo. Its stylesheet is imported in
`src/app/(payload)/custom.scss`. You get a grouped icon sidebar, a stat-card dashboard, a ⌘K command palette
(it searches documents too), and a split login page. The header has a light/dark toggle and a live
customiser; the customiser's changes are saved in your browser only.

- The logo images (the `nimish jain` wordmark with its accent block, as in the site header) come from
  `/brand/logo-light.png` and `/brand/logo-dark.png`, rendered by `src/app/(frontend)/brand/[asset]/route.tsx`.
- `pnpm-workspace.yaml` pins the theme's copy of `lucide-react` to 1.24.0. Newer `lucide-react` releases
  renamed the icon export that payload-theme 0.9.4 reads, which leaves every admin icon blank. Drop the
  override once payload-theme supports current `lucide-react`.
- To go back to the stock admin, remove the `payloadTheme()` entry and the CSS import, then run
  `pnpm generate:importmap`.

## Two-factor sign-in

After the password, the admin asks for a 6-digit code from an authenticator app. This comes from
[`payload-totp`](https://github.com/GeorgeHulpoi/payload-totp), configured last in the plugin list in
`src/payload.config.ts`.

- **Setting it up:**
  - The first time an account signs in, the admin sends it to a page with a QR code. Scan it with an
    authenticator app (1Password, Google Authenticator, Authy and so on), then enter the code it shows.
  - Every account has to set it up. Until it has, its session can't change anything, in the admin or
    through the API.
  - The local database is separate, so a local account sets up its own entry.
- **Wrong codes:** five wrong codes in a row lock the account for 10 minutes, the same as five wrong
  passwords. These are Payload's defaults (`maxLoginAttempts`, `lockTime`).
- **A new phone:** move the entry with your authenticator app's export or sync. If the old phone is gone,
  clear the secret in Neon's SQL editor, then sign in and set it up again:

  ```sql
  UPDATE users SET totp_secret = NULL WHERE email = '<your admin email>';
  ```

- **Content the site shows:**
  - The plugin guards every collection and global. Content the site shows opts out for reads through
    `publicRead` (`src/lib/access.ts`).
  - Spread `publicRead` into any new collection or global the site displays. Without it, anonymous reads
    through the REST API and media file URLs get a 403.
  - The pages themselves read through the Local API, which the plugin doesn't affect.
- **`src/proxy.ts`:** passes the requested admin path to the plugin, which needs it to redirect to the code
  page without looping. It runs on `/admin` only.

## Security headers

`headers()` in `next.config.ts` sets them all; HSTS comes from Vercel.

- **Every response:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - a `Permissions-Policy` that turns off the camera, microphone, location, payments, USB and Topics
  - `Cross-Origin-Opener-Policy: same-origin`
- **No `X-Powered-By`:** `poweredByHeader: false`. Payload's colour-scheme client hints (`Accept-CH`,
  `Critical-CH`, `Vary`) are limited to `/admin`, the only place that reads them.
- **Content-Security-Policy, production builds only:**
  - **Pages:** everything comes from the site's own origin. Scripts are allowed inline, because the pages are
    prerendered and can't carry a per-request nonce. So the policy doesn't stop injected inline script. It
    does keep out other origins, plugins, framing, `<base>` changes and form posts to other sites.
  - **Admin:** the page policy plus:
    - jsDelivr, for Monaco (the code fields) and its `blob:` workers;
    - Google Fonts, for payload-theme's Geist;
    - Vercel Blob, for stored files and client uploads.
  - **No policy of ours:** `/api`, whose SVG uploads Payload serves with its own `script-src 'none'`;
    `/_next`; and the two PDFs.
- **Testing:** `next dev` runs without the CSP, so test changes with `pnpm build && pnpm start` and watch the
  browser console for "Refused to load…".
- **New third parties:** an analytics script, an embed or a font from another host has to be added to the
  matching policy, or browsers block it. The Vercel toolbar (`vercel.live`) is left out on purpose.

## Favicon, banner and SEO

- **Logo:** the header shows `nimish jain` in Geist Mono, ending in an accent-coloured block caret that
  blinks while the logo is hovered or focused. There is no icon beside it. It's an inline SVG
  (`src/components/site/Wordmark.tsx`) with the letters as outlines taken from the font, so it never waits
  for Geist Mono to load; re-extract them if the name or font changes.
- **Favicon:** "nj" in Geist Mono with the same block caret, white on a cobalt tile. The letters are
  outlines taken from the font, so the icon looks the same where Geist Mono isn't installed. It is defined
  once in `scripts/brand-icons.ts`; `pnpm icons` regenerates `public/favicon.svg`, `favicon.ico` (16/32/48),
  `apple-touch-icon.png` and the manifest icons. The admin panel, the banners and the `/cv` preview image
  use the same icon.
- **Banners:** `pnpm banners` saves four PNGs to `public/banners`:

  | File | Size | Use |
  | --- | --- | --- |
  | `og.png` | 1200 × 630 | Link previews of the site (set in the layout's metadata) |
  | `linkedin.png` | 1584 × 396 | LinkedIn profile background |
  | `x.png` | 1500 × 500 | X header |
  | `github.png` | 1280 × 640 | GitHub social preview or README banner |

  They are screenshots of hidden pages (`/banners/<kind>`, `src/components/banner/Banner.tsx`) drawn with the
  site's CSS: name, subtitle, research interests, and the newest two projects and papers with their drawings.
  The wide ones keep the bottom-left clear for the profile photo. Re-run `pnpm banners` (or
  `pnpm banners https://…` against the live site) and commit after changing any of that content.
  `/cv` keeps its own generated preview with a CV sheet (`src/lib/og-banner.tsx`).
- **SEO:**
  - Per-page title, description and canonical URL, with Open Graph (profile) and Twitter card tags.
  - `robots` and `googlebot` directives that allow large image previews.
  - Sitemap and `robots.txt`.
  - A web manifest.
  - schema.org JSON-LD linking WebSite, ProfilePage and Person (with ORCID, employer and alma maters)
    to every publication as a ScholarlyArticle.
- **Admin settings:**
  - **Site → Profile → SEO title** sets the title shown in search results.
  - **Site → CV → Show the CV in search engines** turns indexing of `/cv` on or off.
  - `/cv.pdf` is always `noindex`, so results point to the page.
- **Search consoles:** set `GOOGLE_SITE_VERIFICATION` and/or `BING_SITE_VERIFICATION` to add their verification
  meta tags, then submit `https://nimish-jain.com/sitemap.xml`.

## CV PDF

`/cv.pdf` serves the PDF chosen under **Site → CV → PDF**, so a new one goes live as soon as it's saved,
with no commit or deploy. To make one after changing the CV:

1. Save your changes.
2. Click **Open print view** in that PDF section. It opens `/cv/print`, which is rendered from the database
   on every request (unlike the cached `/cv`), and opens the print dialog. Only a signed-in admin can open
   it; everyone else gets a 404.
3. Choose **Save as PDF**, turn off **Headers and footers**, and save. Use Chrome: other browsers leave out
   the page footer with your name and the page numbers.
4. Upload the file in the PDF field and save.

**Personal details.** The phone number, date of birth and nationality never appear on `/cv`, in the public
PDF or in the API. **Open full print view** (`/cv/print?full=1`) adds them, for the copy you send with an
application; keep that file off the site.

The files live in **Admin → Documents** (Vercel Blob in production, `/documents` locally), which only a
signed-in user can list; `/cv.pdf` and `/resume.pdf` are the public way to them. Until the CV has a PDF, the
site hides its Download buttons and `/cv.pdf` redirects to `/cv`.

**Resume:** a resume made elsewhere goes under **Site → Resume** and is served at `/resume.pdf`. Nothing on the
site links to it and search engines are asked not to index it, so it's shared by link. Until one is
uploaded, `/resume.pdf` redirects to `/cv`.

## Checks

```bash
pnpm lint
pnpm typecheck
```

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org), for example `feat: …` or
`fix(cv): …`. A Husky `commit-msg` hook runs commitlint (`commitlint.config.mjs`) and rejects anything else;
`pnpm install` sets the hooks up. Types: feat, fix, refactor, perf, docs, style, test, build, ci, chore, revert.
The subject starts in lowercase.

Before each commit, the `pre-commit` hook (`.husky/pre-commit`):

- runs ESLint with `--fix` on the staged files (lint-staged, `.lintstagedrc.json`), restaging what it fixes;
- type-checks the project, skipped when no TypeScript is staged;
- scans the staged changes for secrets with [gitleaks](https://github.com/gitleaks/gitleaks), skipped when
  it isn't installed (`brew install gitleaks`).

The hooks call `pnpm`. Git apps that don't load your shell profile (some GUI clients) can't find it when Node
comes from nvm, and the hook fails with `pnpm: command not found`. Husky reads `~/.config/husky/init.sh`
before every hook, so loading nvm there fixes it for all your repos:

```bash
mkdir -p ~/.config/husky && printf 'export NVM_DIR="$HOME/.nvm"\n. "$NVM_DIR/nvm.sh"\n' > ~/.config/husky/init.sh
```

## Deploying (Vercel + Neon)

- `vercel.json` sets the build command to `pnpm vercel-build` (migrations, then the build). Without it, Vercel's
  Next.js preset runs plain `build` and migrations never run. It also puts the functions in Frankfurt (`fra1`),
  next to the database; change both together if you pick another region.
- `package.json` pins pnpm 11 with `packageManager`. Vercel's built-in pnpm stops at 10, so the project needs
  `ENABLE_EXPERIMENTAL_COREPACK=1` to use the pinned version.

First deploy:

1. Import the GitHub repo as a new Vercel project. Add `PAYLOAD_SECRET` (`openssl rand -hex 32`) and
   `ENABLE_EXPERIMENTAL_COREPACK=1`. This first build fails at `payload migrate` because there is no database yet.
2. Storage → Neon: Frankfurt (`eu-central-1`), connected to Production only, with no prefix (creates `DATABASE_URL`).
3. Storage → Create Storage → Blob: public access, Frankfurt, with Production ticked for the read-write token.
   Payload's Blob adapter needs `BLOB_READ_WRITE_TOKEN`. Connecting an existing store from its Projects tab adds
   only OIDC variables (`BLOB_STORE_ID`, `VERCEL_OIDC_TOKEN`), which the adapter can't use; without the token,
   uploads fall back to local disk, which is read-only on Vercel.
4. Create the tables and load the content from your machine. The pages are prerendered from the database, so
   it needs content before a build can succeed:

   ```bash
   DATABASE_URL='<neon url>' pnpm payload migrate
   DATABASE_URL='<neon url>' pnpm seed
   ```

5. Redeploy, then create your admin user at `/admin` straight away: until one exists, anyone can. The admin
   then asks you to set up two-factor sign-in.
6. Move `nimish-jain.com` and `www.nimish-jain.com` from the old project to this one. DNS already points at Vercel.

After that:

- Content lives in Neon; edit it in the live `/admin`. The local Docker database is only for development.
- Pushing to `main` deploys. Schema changes ship as migrations, which the build applies.
- After CV edits, make a new PDF in the admin (see [CV PDF](#cv-pdf)).
- Preview deployments have no database, so their builds fail. Don't connect Preview to the production database,
  because preview builds run migrations; use Neon's branch-per-preview option if you want previews.
- `vercel env pull` writes `.env.local` unless given a file name. That file overrides `.env`, so local
  development would run against production.
- `NEXT_PUBLIC_SITE_URL` is optional; it defaults to `https://nimish-jain.com`.

## Project layout

```
src/
  app/(frontend)/      site routes: page, cv (with /cv/print and /cv.pdf), OG image, icons, sitemap, styles
  app/(payload)/       Payload admin and API (generated; don't edit)
  collections/, globals/, fields/, hooks/   CMS schema and revalidation
  components/site/     home page sections and small client components
  components/cv/       the CV document
  lib/                 content loading, formatting, JSON-LD, OG fonts, public read access
  migrations/          Postgres migrations
  seed/                initial content
  proxy.ts             gives the admin's two-factor pages the requested path
scripts/               banner and icon generators (pnpm banners, pnpm icons)
```
