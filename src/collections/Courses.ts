import type { CollectionConfig } from 'payload'

import { sortOrderField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { publicRead } from '../lib/access'

/** The order here is the order areas appear on the site and the CV. */
export const courseAreas = [
  { label: 'Mathematics', value: 'mathematics' },
  { label: 'Theory and algorithms', value: 'theory' },
  { label: 'Systems and networks', value: 'systems' },
  { label: 'Security', value: 'security' },
  { label: 'AI and data', value: 'ai' },
  { label: 'Software engineering', value: 'software' },
] as const

export type CourseArea = (typeof courseAreas)[number]['value']

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'area', 'credits'],
    description: 'Relevant B.Tech coursework. Titles exactly as on the transcript; credits as VIT credits.',
  },
  ...publicRead,
  defaultSort: 'sortOrder',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'credits', type: 'number', required: true, min: 0 },
        { name: 'area', type: 'select', required: true, options: [...courseAreas] },
      ],
    },
    sortOrderField,
  ],
}
