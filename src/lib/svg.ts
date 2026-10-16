import sanitizeHtml from 'sanitize-html'

/**
 * Sanitises SVG pasted into the CMS before it is stored and again before it is rendered
 * inline. Only drawing elements and presentation attributes survive: no scripts, event
 * handlers, `style`, links or external references.
 */
const shared = [
  'class',
  'id',
  'transform',
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-opacity',
  'opacity',
  'clip-path',
  'clip-rule',
  'vector-effect',
]

const options: sanitizeHtml.IOptions = {
  allowedTags: [
    'svg',
    'g',
    'defs',
    'title',
    'desc',
    'path',
    'circle',
    'ellipse',
    'rect',
    'line',
    'polyline',
    'polygon',
    'text',
    'tspan',
    'linearGradient',
    'radialGradient',
    'stop',
    'clipPath',
  ],
  allowedAttributes: {
    svg: [...shared, 'viewBox', 'xmlns', 'width', 'height', 'preserveAspectRatio'],
    g: shared,
    path: [...shared, 'd', 'pathLength'],
    circle: [...shared, 'cx', 'cy', 'r', 'pathLength'],
    ellipse: [...shared, 'cx', 'cy', 'rx', 'ry'],
    rect: [...shared, 'x', 'y', 'width', 'height', 'rx', 'ry'],
    line: [...shared, 'x1', 'y1', 'x2', 'y2', 'pathLength'],
    polyline: [...shared, 'points', 'pathLength'],
    polygon: [...shared, 'points', 'pathLength'],
    text: [...shared, 'x', 'y', 'dx', 'dy', 'font-size', 'font-weight', 'text-anchor', 'dominant-baseline', 'letter-spacing'],
    tspan: [...shared, 'x', 'y', 'dx', 'dy', 'font-size', 'font-weight'],
    linearGradient: ['id', 'x1', 'y1', 'x2', 'y2', 'gradientUnits', 'gradientTransform'],
    radialGradient: ['id', 'cx', 'cy', 'r', 'fx', 'fy', 'gradientUnits', 'gradientTransform'],
    stop: ['offset', 'stop-color', 'stop-opacity'],
    clipPath: ['id', 'clipPathUnits'],
    defs: [],
    title: [],
    desc: [],
  },
  allowedSchemes: [],
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
  // Drop these elements together with their contents.
  nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript', 'foreignObject', 'iframe'],
  // SVG is case-sensitive: keep viewBox, linearGradient, preserveAspectRatio as written.
  parser: { lowerCaseTags: false, lowerCaseAttributeNames: false },
}

/** Returns the cleaned markup, or null when the input isn't a single <svg> element. */
export function sanitizeSvg(markup: string | null | undefined): string | null {
  if (!markup?.trim()) return null
  const clean = sanitizeHtml(markup.trim(), options).trim()
  if (!clean.startsWith('<svg') || !clean.endsWith('</svg>') || clean.indexOf('<svg', 1) !== -1) return null
  // A viewBox lets the drawing scale into the 112 × 84 thumbnail.
  if (!/^<svg[^>]*\sviewBox="[^"]+"/.test(clean)) return null
  return clean
}
