/**
 * Generates the favicon set in public/ from one vector source: lowercase "nj" in white
 * monoline strokes on a cobalt tile, with the site's green "live" dot as the j's dot.
 *
 *   pnpm icons
 *
 * Outputs: favicon.svg, favicon.ico (16/32/48), apple-touch-icon.png (180),
 * icon-192.png, icon-512.png and icon-maskable-512.png (for the web manifest).
 */
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const COBALT = '#2546C9'
const GREEN = '#5BD08A'

const glyph = [
  `<g fill="none" stroke="#fff" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">`,
  `<path d="M9.5 19.75V11.25M9.5 14.5a3.75 3.75 0 0 1 7.5 0v5.25"/>`,
  `<path d="M22.5 11.25v10a3.5 3.5 0 0 1-3.5 3.5h-1"/>`,
  `</g>`,
  `<circle cx="22.5" cy="6.75" r="1.85" fill="${GREEN}"/>`,
].join('')

/** The mark on a 32-unit grid. `radius` rounds the tile; `scale` shrinks the glyph. */
function markSvg({ radius = 8, scale = 1 }: { radius?: number; scale?: number } = {}) {
  const content = scale === 1 ? glyph : `<g transform="translate(16 16) scale(${scale}) translate(-16 -16)">${glyph}</g>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="${radius}" fill="${COBALT}"/>${content}</svg>`
}

async function png(svg: string, size: number) {
  return sharp(Buffer.from(svg), { density: (72 * size) / 8 })
    .resize(size, size)
    .png()
    .toBuffer()
}

/** Packs PNG frames into an .ico container (PNG-in-ICO, supported by every current browser). */
function ico(frames: Array<{ size: number; data: Buffer }>) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(frames.length, 4)
  let offset = 6 + 16 * frames.length
  const entries = frames.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...frames.map((frame) => frame.data)])
}

const out = (name: string) => fileURLToPath(new URL(`../public/${name}`, import.meta.url))

const tile = markSvg()
// iOS and Android round or mask icons themselves, so those variants are full-bleed squares;
// the maskable one also keeps the glyph inside the 80% safe zone.
const square = markSvg({ radius: 0 })
const maskable = markSvg({ radius: 0, scale: 0.8 })

await writeFile(out('favicon.svg'), `${tile}\n`)
await writeFile(
  out('favicon.ico'),
  ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tile, size) })))),
)
await writeFile(out('apple-touch-icon.png'), await png(square, 180))
await writeFile(out('icon-192.png'), await png(tile, 192))
await writeFile(out('icon-512.png'), await png(tile, 512))
await writeFile(out('icon-maskable-512.png'), await png(maskable, 512))

console.log('Wrote favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png')
