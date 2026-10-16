/** Minimal builders for Lexical editor state, enough for paragraphs of text and links. */

type TextNode = ReturnType<typeof text>
type LinkNode = ReturnType<typeof link>

export function text(value: string) {
  return { type: 'text', version: 1, text: value, format: 0, detail: 0, mode: 'normal', style: '' }
}

export function link(url: string, label: string) {
  return {
    type: 'link',
    version: 3,
    fields: { linkType: 'custom', newTab: false, url },
    children: [text(label)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
  }
}

export function paragraph(...children: Array<TextNode | LinkNode | string>) {
  return {
    type: 'paragraph',
    version: 1,
    children: children.map((child) => (typeof child === 'string' ? text(child) : child)),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    textFormat: 0,
    textStyle: '',
  }
}

export function richText(...paragraphs: Array<ReturnType<typeof paragraph>>) {
  return {
    root: {
      type: 'root',
      version: 1,
      children: paragraphs,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
    },
  }
}
