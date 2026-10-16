import type { CollectionConfig } from 'payload'

import { sortOrderField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { publicRead } from '../lib/access'
import { sanitizeSvg } from '../lib/svg'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'sortOrder'],
  },
  ...publicRead,
  defaultSort: 'sortOrder',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'year', type: 'number', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'context',
          type: 'select',
          required: true,
          defaultValue: 'personal',
          options: [
            { label: 'Personal project', value: 'personal' },
            { label: 'Built at an organisation', value: 'organisation' },
          ],
          admin: { description: 'Shown as a label on the card.' },
        },
        {
          name: 'org',
          label: 'Organisation',
          type: 'text',
          admin: {
            condition: (data) => data?.context === 'organisation',
            description: 'Reads as "Built at …", e.g. Electron.',
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData: { context?: string } }) =>
            siblingData?.context !== 'organisation' || Boolean(value?.trim()) || 'Name the organisation.',
        },
      ],
    },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'stack',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'previewSvg',
      label: 'Preview (SVG)',
      type: 'code',
      admin: {
        language: 'xml',
        description:
          'Optional. Paste one <svg viewBox="0 0 360 200">…</svg> for the top of the card; without one, it shows a placeholder code editor. To follow light and dark mode, colour shapes with classes instead of fill/stroke colours: acc, mut, dot, adot, band, dash, adash, ax, ring, ghost (as in publication figures), plus panel (card), field (input), t (mono label), t-acc (accent label), node, edge / edge-on (graph lines), c-a … c-d (tinted tiles), sk (placeholder bar), pattern (thick accent line), caret (blinking cursor). Add class "draw" and pathLength="100" to a line to animate it on hover. Scripts, styles, links and event handlers are removed when you save.',
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
