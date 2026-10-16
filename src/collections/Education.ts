import type { CollectionConfig } from 'payload'

import { logoField, monthField, sortOrderField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { publicRead } from '../lib/access'

export const Education: CollectionConfig = {
  slug: 'education',
  labels: { singular: 'Education', plural: 'Education' },
  admin: {
    group: 'Content',
    useAsTitle: 'qualification',
    defaultColumns: ['qualification', 'institution', 'startDate', 'endDate'],
  },
  ...publicRead,
  defaultSort: 'sortOrder',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'qualification', type: 'text', required: true },
        { name: 'board', type: 'text', admin: { description: 'e.g. CBSE' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'institution', type: 'text', required: true },
        { name: 'abbreviation', type: 'text', admin: { description: 'e.g. VIT' } },
        { name: 'institutionUrl', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', required: true },
        { name: 'school', type: 'text', admin: { description: 'Faculty or school (CV only).' } },
      ],
    },
    {
      type: 'row',
      fields: [monthField('startDate', { required: true }), monthField('endDate', { required: true })],
    },
    {
      type: 'row',
      fields: [
        { name: 'result', type: 'text', required: true, admin: { description: 'e.g. CGPA 8.64 / 10' } },
        { name: 'credits', type: 'number' },
      ],
    },
    {
      name: 'cvExtra',
      label: 'CV extra line',
      type: 'text',
      admin: { description: 'Shown on the CV only. Text in [brackets] is highlighted as a placeholder.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show as the main card with the coursework chart.' },
    },
    logoField,
    sortOrderField,
  ],
}
