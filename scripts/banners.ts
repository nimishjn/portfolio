/**
 * Saves the banner pages (/banners/<kind>, see src/components/banner/Banner.tsx) as PNGs in
 * public/banners at their exact sizes:
 *   og.png        1200 × 630   link previews of the site (wired up in the layout's metadata)
 *   linkedin.png  1584 × 396   LinkedIn profile background
 *   x.png         1500 × 500   X header
 *   github.png    1280 × 640   GitHub social preview / README banner
 *
 *   pnpm banners                       # against http://localhost:3000
 *   pnpm banners https://nimish-jain.com
 *
 * Re-run it and commit public/banners after changing the name, subtitle, research interests, or the
 * newest projects and publications. Uses Google Chrome through Playwright (PLAYWRIGHT_CHANNEL=chromium
 * for Playwright's own browser).
 */
import { chromium } from '@playwright/test'
import { mkdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const KINDS = ['og', 'linkedin', 'x', 'github']
const base = (process.argv[2] ?? process.env.BANNER_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const outDir = fileURLToPath(new URL('../public/banners/', import.meta.url))
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome' })
try {
  for (const kind of KINDS) {
    // Reduced motion stops the "live" dot mid-pulse from ending up in the image.
    const page = await browser.newPage({ deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' })
    const response = await page.goto(`${base}/banners/${kind}`, { waitUntil: 'networkidle' })
    if (!response?.ok()) throw new Error(`GET ${base}/banners/${kind} returned ${response?.status()}`)
    await page.evaluate(() => document.fonts.ready)
    // Next's dev-tools badge, when rendering from `pnpm dev`.
    await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' })
    const banner = page.locator('#banner')
    const { width, height } = await banner.evaluate((el) => ({ width: (el as HTMLElement).offsetWidth, height: (el as HTMLElement).offsetHeight }))
    await page.setViewportSize({ width, height })
    const path = `${outDir}${kind}.png`
    await banner.screenshot({ path })
    const { size } = await stat(path)
    console.log(`public/banners/${kind}.png  ${width} × ${height}  ${Math.round(size / 1024)} KB`)
    await page.close()
  }
} finally {
  await browser.close()
}
