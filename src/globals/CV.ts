import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'
import { publicRead } from '../lib/access'

export const CV: GlobalConfig = {
  slug: 'cv',
  label: 'CV',
  admin: {
    group: 'Site',
    description:
      'Details that appear only on the CV. Everything else comes from the profile and the collections. Text in [brackets] is highlighted as a placeholder.',
  },
  ...publicRead,
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'PDF',
      fields: [
        {
          name: 'pdfSteps',
          type: 'ui',
          admin: { components: { Field: '/components/admin/CvPdfSteps#CvPdfSteps' } },
        },
        {
          name: 'pdf',
          label: 'PDF',
          type: 'upload',
          relationTo: 'documents',
          admin: {
            description: 'Served at /cv.pdf. The Download buttons on the site stay hidden until one is set.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', defaultValue: '[TBD]' },
        { name: 'location', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'dateOfBirth', type: 'text', admin: { description: 'Optional for English-taught programmes.' } },
        { name: 'nationality', type: 'text' },
      ],
    },
    {
      name: 'allowIndexing',
      label: 'Show the CV in search engines',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'When off, /cv asks search engines not to index it. The PDF is never indexed, so results point to the page instead.',
      },
    },
    {
      name: 'bodySize',
      type: 'select',
      defaultValue: '11pt',
      options: ['11pt', '12pt'],
      admin: { description: 'Body text size on the CV. 11pt keeps it to four A4 pages.' },
    },
    {
      name: 'courseworkNote',
      type: 'text',
      defaultValue: 'Credits as listed in the VIT grade history; full transcript of records attached.',
    },
    {
      name: 'languages',
      label: 'Languages and certificates',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'level', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'skills',
      label: 'Technical skills',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'area', type: 'text', required: true },
            { name: 'items', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'place', type: 'text', required: true, admin: { description: 'Shown with the date at the end of the CV.' } },
        {
          name: 'signedOn',
          type: 'date',
          label: 'Date',
          admin: {
            description: 'Leave empty to show a placeholder.',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' },
          },
        },
      ],
    },
  ],
}
