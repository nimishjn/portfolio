/**
 * Generates the favicon set in public/ from one vector source: "nj" in Geist Mono Medium with
 * a block caret, white on a cobalt tile (the header's wordmark ends in the same caret).
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

// The letters are outlines taken from GeistMono-Medium.ttf (fontTools), placed as SVG text would
// set "nj" at x 4.5, baseline 21.5, size 15.5 and letter-spacing -0.5, so the icon looks the same
// wherever the font isn't installed. Re-extract them if the font or that placement changes.
const NJ = 'M5.74 21.5V13.254H7.181L7.213 14.742Q7.538 13.889 8.236 13.479Q8.933 13.068 9.801 13.068Q10.715 13.068 11.328 13.479Q11.94 13.889 12.25 14.595Q12.56 15.3 12.56 16.184V21.5H10.995V16.587Q10.995 14.432 9.351 14.432Q8.499 14.432 7.902 14.99Q7.306 15.548 7.306 16.617V21.5Z M14.943 23.825V22.508H17.454Q18.09 22.508 18.392 22.229Q18.694 21.95 18.694 21.206V14.572H15.067V13.254H20.275V21.299Q20.275 22.523 19.624 23.174Q18.973 23.825 17.625 23.825ZM18.648 12.06V10.433H20.26V12.06Z'

const glyph = [`<path d="${NJ}" fill="#fff"/>`, `<rect x="23" y="9.25" width="3.6" height="14.5" rx="0.6" fill="#fff"/>`].join('')

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
