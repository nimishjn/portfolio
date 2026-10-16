/**
 * Checks an SVG meant for a publication figure or a project preview before it goes into the CMS:
 * it has to survive the site's sanitiser unchanged, use the expected viewBox, and colour itself only
 * with the theme classes in globals.css (so it follows light and dark mode).
 *
 *   node .claude/skills/svg-figures/scripts/check-svg.ts drawing.svg --type publication
 *   node .claude/skills/svg-figures/scripts/check-svg.ts drawing.svg --type project
 *
 * Run it from the repo root; give the draft's absolute path when it lives outside the repo. Prints
 * errors (exit code 1) and warnings, and writes the sanitised markup on one line, ready to paste into
 * the CMS, next to the input as <name>.clean.svg.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { sanitizeSvg } from '../../../../src/lib/svg.ts'

type Kind = 'publication' | 'project'

const VIEWBOX: Record<Kind, string> = { publication: '0 0 112 84', project: '0 0 360 200' }
const ROOT = fileURLToPath(new URL('../../../../', import.meta.url))

const args = process.argv.slice(2)
// The file is the argument that is neither a flag nor a flag's value, so the order doesn't matter.
const file = args.find((arg, i) => !arg.startsWith('--') && !args[i - 1]?.startsWith('--'))
const kind = args[args.indexOf('--type') + 1] as Kind
if (!file || !(kind in VIEWBOX)) {
  console.error('Usage: node .claude/skills/svg-figures/scripts/check-svg.ts <file.svg> --type publication|project')
  process.exit(2)
}

const raw = readFileSync(file, 'utf8').trim()
const errors: string[] = []
const warnings: string[] = []

// Theme classes, read from the stylesheet so this stays in step with it. `.fig .x` classes work in
// both kinds of drawing; `.pv .x` only in project previews (their wrapper carries both classes).
const css = readFileSync(`${ROOT}src/app/(frontend)/globals.css`, 'utf8')
const rules = new Map<string, string>()
for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  for (const [, scope, name] of selectors.matchAll(/\.(fig|pv) \.([a-z][\w-]*)/g)) {
    if (scope === 'pv' && kind === 'publication') continue
    rules.set(name, (rules.get(name) ?? '') + body)
  }
}
const known = new Set([...rules.keys(), 'draw'])
// Property → value for each class, e.g. acc → { stroke-width: '1.8', fill: 'none', … }.
const declarations = (name: string) =>
  Object.fromEntries(
    [...(rules.get(name) ?? '').matchAll(/([a-z-]+)\s*:\s*([^;]+)/g)].map(([, prop, value]) => [prop, value.trim()]),
  )
const setsFill = (classes: string[]) => classes.some((name) => 'fill' in declarations(name))
// Presentation attributes lose to class rules, so an attribute only works where no class sets it.
const PRESENTATION = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'font-size', 'font-weight', 'text-anchor']

// Whether a shape encloses area, i.e. whether an unset fill would show as a black blob. A path or
// polyline that is a single straight segment (an axis, a tick) has none.
const numbers = (s: string) => s.match(/-?(\d*\.\d+|\d+)(e-?\d+)?/gi)?.length ?? 0
function enclosesArea(tag: string, attr: (name: string) => string | undefined) {
  if (tag === 'polyline') return numbers(attr('points') ?? '') > 4
  if (tag !== 'path') return tag !== 'text'
  return (attr('d') ?? '').split(/(?=[Mm])/).some((sub) => {
    const commands = sub.slice(1).match(/[a-zA-Z]/g) ?? []
    return commands.length > 1 || commands.some((c) => /[CcSsQqTtAaZz]/.test(c)) || numbers(sub) > 4
  })
}

const clean = sanitizeSvg(raw)
if (!clean) {
  errors.push('The sanitiser rejects it: paste exactly one <svg> element, and give it a viewBox.')
} else {
  // Compare what survived, element by element and attribute by attribute.
  const inventory = (markup: string) => {
    const items: string[] = []
    for (const [, tag, attrs] of markup.matchAll(/<([a-zA-Z][\w:-]*)([^>]*?)\/?>/g)) {
      items.push(`<${tag}>`)
      for (const [, attr] of attrs.matchAll(/([\w:-]+)\s*=/g)) items.push(`<${tag} ${attr}>`)
    }
    return items
  }
  const kept = inventory(clean)
  const removed = inventory(raw).filter((item) => {
    const i = kept.indexOf(item)
    if (i === -1) return true
    kept.splice(i, 1)
    return false
  })
  if (removed.length) {
    errors.push(`The sanitiser strips: ${[...new Set(removed)].join(', ')}. Use only the allowed elements and attributes.`)
  }

  const viewBox = clean.match(/^<svg[^>]*\sviewBox="([^"]+)"/)?.[1]
  if (viewBox?.trim().replace(/\s+/g, ' ') !== VIEWBOX[kind]) {
    errors.push(`viewBox is "${viewBox}"; a ${kind} drawing uses viewBox="${VIEWBOX[kind]}".`)
  }

  // Walk the elements with a stack, so a fill set on a <g> counts for its children.
  const open: boolean[] = []
  const unknownCount = new Map<string, number>()
  for (const [, closing, tag, attrs] of clean.matchAll(/<(\/?)([a-zA-Z]+)([^>]*)>/g)) {
    if (closing) {
      open.pop()
      continue
    }
    const attr = (name: string) => attrs.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]
    const classes = (attr('class') ?? '').split(/\s+/).filter(Boolean)
    const inheritsFill = open.some(Boolean)
    open.push(Boolean(attr('fill')) || setsFill(classes))
    if (tag === 'svg') continue
    const unknown = classes.filter((name) => !known.has(name))
    for (const name of unknown) unknownCount.set(name, (unknownCount.get(name) ?? 0) + 1)
    for (const paint of ['fill', 'stroke', 'stop-color']) {
      const value = attr(paint)
      if (value && !/^(none|transparent|currentColor)$/i.test(value)) {
        warnings.push(`<${tag}> sets ${paint}="${value}", which won't change with dark mode. Use a theme class.`)
      }
    }
    const fillable = ['path', 'polyline', 'polygon', 'rect', 'circle', 'ellipse', 'text'].includes(tag)
    if (fillable && !unknown.length && !attr('fill') && !setsFill(classes) && !inheritsFill && enclosesArea(tag, attr)) {
      warnings.push(
        `<${tag}${classes.length ? ` class="${classes.join(' ')}"` : ''}> gets the default black fill. ` +
          'Give it a class that sets fill, or add fill="none" if it is only a line.',
      )
    }
    for (const prop of PRESENTATION) {
      const value = attr(prop)
      const owner = value === undefined ? undefined : classes.find((name) => prop in declarations(name))
      if (owner && declarations(owner)[prop] !== value) {
        warnings.push(`<${tag}> ${prop}="${value}" has no effect: class "${owner}" sets ${prop}, and class rules win.`)
      }
    }
    if (classes.includes('draw')) {
      if (!['path', 'line', 'polyline', 'polygon', 'circle'].includes(tag)) {
        warnings.push(`<${tag}> has class "draw", but only path, line, polyline, polygon and circle can redraw.`)
      } else if (attr('pathLength') !== '100') {
        warnings.push(`<${tag} class="draw"> needs pathLength="100" to redraw cleanly on hover.`)
      }
      if (attr('stroke-dasharray') || classes.some((name) => 'stroke-dasharray' in declarations(name))) {
        warnings.push(`<${tag}> is dashed and has class "draw"; the redraw replaces the dashes until it ends. Animate a solid line.`)
      }
    }
    if (attr('id')) {
      warnings.push(`<${tag}> has id="${attr('id')}". Several drawings share one page, so prefix ids to keep them unique.`)
    }
  }

  if (unknownCount.size) {
    const list = [...unknownCount].map(([name, n]) => (n > 1 ? `${name} ×${n}` : name)).join(', ')
    const projectOnly = kind === 'publication' && [...unknownCount.keys()].some((n) => css.includes(`.pv .${n}`))
    errors.push(
      `Unknown classes, which would render unstyled: ${list}.` +
        (projectOnly ? ' Some are project-preview classes, which publication figures cannot use.' : ''),
    )
  }

  if (clean.length > 6000) warnings.push(`${clean.length} characters; most drawings here are under 2,500. Simplify if you can.`)

  // One line: the line breaks between elements would otherwise be stored too. Spaces inside text stay.
  const oneLine = clean.replace(/>\s*\n\s*</g, '><')
  const out = file.replace(/\.svg$/i, '') + '.clean.svg'
  writeFileSync(out, oneLine + '\n')
  console.log(`Sanitised, one-line markup to paste into the CMS (${oneLine.length} characters): ${out}`)
}

for (const message of errors) console.log(`ERROR    ${message}`)
for (const message of [...new Set(warnings)]) console.log(`warning  ${message}`)
console.log(errors.length ? `\n${errors.length} error(s).` : `\nOK for a ${kind} drawing${warnings.length ? ', with warnings' : ''}.`)
process.exit(errors.length ? 1 : 0)
