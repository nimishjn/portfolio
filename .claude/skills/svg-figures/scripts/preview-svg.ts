/**
 * Shows a drawing the way the site will: puts it into the first publication (or project) card of a
 * running copy of the site, using the site's real CSS, and screenshots it in light and dark mode.
 *
 *   node .claude/skills/svg-figures/scripts/preview-svg.ts drawing.svg --type publication --title "Paper title"
 *   node .claude/skills/svg-figures/scripts/preview-svg.ts drawing.svg --type project --url https://nimish-portfolio-2026.vercel.app
 *
 * Needs the site running (`pnpm dev`; default http://localhost:3000) or a deployed URL, and Google
 * Chrome (driven through Playwright; set PLAYWRIGHT_CHANNEL=chromium to use Playwright's own browser).
 * The drawing goes into the first card on the page, so the rest of the card shows that entry's text;
 * --title swaps in the right title. Nothing is saved to the site. Writes next to the input:
 *   <name>.preview.png  the whole card, light | dark
 *   <name>.zoom.png     the drawing alone, enlarged, light | dark
 * and reports which parts animate when the card is hovered.
 */
import { readFileSync } from 'node:fs'

import { chromium, type Page } from '@playwright/test'
import sharp from 'sharp'

import { sanitizeSvg } from '../../../../src/lib/svg.ts'

type Kind = 'publication' | 'project'

const args = process.argv.slice(2)
const option = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)
const file = args.find((arg, i) => !arg.startsWith('--') && !args[i - 1]?.startsWith('--'))
const kind = option('--type') as Kind
const title = option('--title')
const url = (option('--url') ?? 'http://localhost:3000').replace(/\/$/, '') + '/'
if (!file || (kind !== 'publication' && kind !== 'project')) {
  console.error('Usage: node .claude/skills/svg-figures/scripts/preview-svg.ts <file.svg> --type publication|project [--url <site>]')
  process.exit(2)
}

// Render exactly what the CMS would store and the page would show.
const svg = sanitizeSvg(readFileSync(file, 'utf8'))
if (!svg) {
  console.error('The sanitiser rejects this file. Run check-svg.ts first.')
  process.exit(1)
}

try {
  await fetch(url, { signal: AbortSignal.timeout(15_000) })
} catch {
  console.error(`Can't reach ${url}. Start the site with \`pnpm dev\`, or pass --url with a deployed copy.`)
  process.exit(1)
}

// The same wrappers the site renders around a CMS drawing (see PublicationFigure.tsx, ProjectPreview.tsx).
const target =
  kind === 'publication'
    ? {
        card: '#research .card',
        slot: '[class*="w-[112px]"]',
        html: `<span class="fig block h-[82px] w-[110px] [&>svg]:block [&>svg]:size-full" aria-hidden="true">${svg}</span>`,
      }
    : { card: '#projects .card', slot: '.preview', html: `<span class="preview-art pv fig">${svg}</span>` }

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome' })

async function open(theme: 'light' | 'dark', scale: number, reducedMotion: 'reduce' | 'no-preference') {
  const context = await browser.newContext({ viewport: { width: 820, height: 900 }, deviceScaleFactor: scale, reducedMotion })
  await context.addInitScript((t) => localStorage.setItem('theme', t), theme)
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  // Keep the sticky header and Next's dev-tools badge from overlapping the screenshots.
  await page.addStyleTag({ content: '.site-header, nextjs-portal { display: none !important; }' })
  const card = page.locator(target.card).first()
  await card.locator(target.slot).first().evaluate((el, html) => (el.innerHTML = html), target.html)
  if (title) await card.locator('h3').first().evaluate((el, text) => (el.textContent = text), title)
  return { page, card }
}

const shots: Record<'card' | 'zoom', Buffer[]> = { card: [], zoom: [] }
for (const theme of ['light', 'dark'] as const) {
  // Reduced motion keeps entrance animations from being caught halfway.
  const { page, card } = await open(theme, 2, 'reduce')
  shots.card.push(await card.screenshot())
  await page.context().close()

  const zoomed = await open(theme, kind === 'publication' ? 5 : 3, 'reduce')
  shots.zoom.push(await zoomed.card.locator(target.slot).first().screenshot())
  await zoomed.page.context().close()
}

// Hover the card and list what animates.
const { page, card } = await open('light', 1, 'no-preference')
await card.hover()
await page.waitForTimeout(150)
const animated = await animatedParts(page)
await browser.close()

async function animatedParts(p: Page) {
  return p.locator(`${target.card} ${target.slot} svg *`).evaluateAll((elements) => {
    const counts: Record<string, number> = {}
    for (const el of elements) {
      const name = getComputedStyle(el).animationName
      if (name && name !== 'none') counts[name] = (counts[name] ?? 0) + 1
    }
    return counts
  })
}

async function sideBySide(images: Buffer[], gap: number) {
  const metas = await Promise.all(images.map((image) => sharp(image).metadata()))
  const width = metas.reduce((sum, m) => sum + (m.width ?? 0), 0) + gap * (images.length - 1)
  const height = Math.max(...metas.map((m) => m.height ?? 0))
  let left = 0
  const layers = images.map((input, i) => {
    const layer = { input, left, top: 0 }
    left += (metas[i].width ?? 0) + gap
    return layer
  })
  return sharp({ create: { width, height, channels: 4, background: { r: 128, g: 128, b: 128, alpha: 1 } } })
    .composite(layers)
    .png()
    .toBuffer()
}

const base = file.replace(/\.svg$/i, '')
await sharp(await sideBySide(shots.card, 24)).toFile(`${base}.preview.png`)
await sharp(await sideBySide(shots.zoom, 24)).toFile(`${base}.zoom.png`)

const verbs: Record<string, [string, string]> = { draw: ['redraws', 'redraw'], ring: ['pulses', 'pulse'], blink: ['blinks', 'blink'] }
const summary = Object.entries(animated).map(([name, n]) => {
  const [one, many] = verbs[name] ?? [`animates (${name})`, `animate (${name})`]
  return n === 1 ? `1 part ${one}` : `${n} parts ${many}`
})
console.log(`Card, light | dark:    ${base}.preview.png${title ? '' : '  (the card text belongs to an existing entry; pass --title to show yours)'}`)
console.log(`Drawing, light | dark: ${base}.zoom.png`)
console.log(`On hover: ${summary.length ? summary.join(', ') : 'nothing animates (add class "draw" and pathLength="100" to a line)'}.`)
