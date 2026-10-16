import type { CollectionConfig } from 'payload'

import { logoField, monthField, sortOrderField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { publicRead } from '../lib/access'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    group: 'Content',
    useAsTitle: 'role',
    defaultColumns: ['role', 'org', 'kind', 'startDate', 'endDate'],
  },
  ...publicRead,
  defaultSort: '-startDate',
  hooks: revalidateHooks,
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'work',
      options: [
        { label: 'Work experience', value: 'work' },
        { label: 'Internship', value: 'internship' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text', required: true },
        { name: 'org', label: 'Organisation', type: 'text', required: true },
        { name: 'tile', type: 'text', maxLength: 3, admin: { description: 'Monogram; defaults to the first letter.' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'orgUrl',
          label: 'Organisation website',
          type: 'text',
          admin: { description: 'Links the organisation name on the site, e.g. https://www.luganodes.com' },
          validate: (value: string | null | undefined) =>
            !value || /^https?:\/\/\S+$/.test(value) || 'Enter a full URL starting with https://',
        },
        { name: 'location', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        monthField('startDate', { required: true }),
        monthField('endDate', { description: 'Leave empty for a current role.' }),
      ],
    },
    { name: 'summary', type: 'text', required: true },
    { name: 'badge', type: 'text', admin: { description: 'Optional, e.g. "Promoted · Oct 2026".' } },
    {
      name: 'bullets',
      type: 'array',
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    { name: 'cvLine', label: 'CV line', type: 'textarea', required: true },
    logoField,
    sortOrderField,
  ],
}
