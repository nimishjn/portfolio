import type { CollectionConfig } from 'payload'

import { sortOrderField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { publicRead } from '../lib/access'
import { sanitizeSvg } from '../lib/svg'

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'type', 'sortOrder'],
  },
  ...publicRead,
  defaultSort: 'sortOrder',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'authors',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { description: 'In publication order. Tick "Me" on your own entry to bold it.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'short', type: 'text', required: true, admin: { description: 'e.g. N. Jain' } },
            { name: 'full', type: 'text', required: true, admin: { description: 'e.g. Nimish Jain' } },
            { name: 'isMe', label: 'Me', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: ['Book chapter', 'Article', 'Conference'],
        },
        { name: 'year', type: 'number', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'venue', type: 'text', required: true, admin: { description: 'Full title (used on the CV).' } },
        { name: 'venueShort', type: 'text', admin: { description: 'Optional shorter label for the site.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'series', type: 'text' },
        { name: 'volumeIssue', type: 'text', admin: { description: 'e.g. 54(16)' } },
        { name: 'pages', type: 'text', admin: { description: 'e.g. 168–174' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'publisher', type: 'text', required: true, admin: { description: 'Label on the site.' } },
        { name: 'publisherFull', type: 'text', admin: { description: 'Optional fuller name for the CV.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'doi', label: 'DOI', type: 'text', required: true, admin: { description: 'Without the https://doi.org/ prefix.' } },
        { name: 'preprintUrl', type: 'text', admin: { description: 'arXiv or other preprint link.' } },
      ],
    },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'bibtex', label: 'BibTeX', type: 'code', admin: { language: 'plaintext' } },
    {
      name: 'figureSvg',
      label: 'Figure (SVG)',
      type: 'code',
      admin: {
        language: 'xml',
        description:
          'Optional. Paste one <svg viewBox="0 0 112 84">…</svg>; without one, the card shows a placeholder paper. To follow light and dark mode, colour shapes with these classes instead of fill/stroke colours: acc (accent line), mut (muted line), dot / adot (muted / accent point), band (accent tint), dash / adash (dashed line), ax (axis), ring, ghost, sheet (paper), hex (small mono text). Add class "draw" and pathLength="100" to a line to animate it on hover. Scripts, styles, links and event handlers are removed when you save.',
      },
      validate: (value: string | null | undefined) =>
        !value?.trim() || sanitizeSvg(value) !== null || 'Paste a single <svg> element that has a viewBox.',
      hooks: {
        beforeChange: [({ value }) => (value?.trim() ? (sanitizeSvg(value) ?? value) : null)],
      },
    },
    sortOrderField,
  ],
}
