import { readFile } from 'node:fs/promises'
import path from 'node:path'

// next/og needs TTF/OTF/WOFF data; the geist package ships TTFs alongside the WOFF2s.
const fontDir = path.join(process.cwd(), 'node_modules/geist/dist/fonts')

const files = {
  sans400: 'geist-sans/Geist-Regular.ttf',
  sans500: 'geist-sans/Geist-Medium.ttf',
  sans600: 'geist-sans/Geist-SemiBold.ttf',
  mono400: 'geist-mono/GeistMono-Regular.ttf',
  mono500: 'geist-mono/GeistMono-Medium.ttf',
} as const

type FontKey = keyof typeof files

/** Loads the requested Geist cuts in the shape ImageResponse expects. */
export async function loadGeist(keys: FontKey[]) {
  return Promise.all(
    keys.map(async (key) => ({
      name: key.startsWith('mono') ? 'Geist Mono' : 'Geist',
      data: await readFile(path.join(fontDir, files[key])),
      weight: Number(key.slice(-3)) as 400 | 500 | 600,
      style: 'normal' as const,
    })),
  )
}
