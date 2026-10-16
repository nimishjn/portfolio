import type { CollectionConfig } from 'payload'

import { logoField, monthField, sortOrderField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { publicRead } from '../lib/access'

export const Service: CollectionConfig = {
  slug: 'service',
  labels: { singular: 'Leadership & service', plural: 'Leadership & service' },
  admin: {
    group: 'Content',
    useAsTitle: 'org',
    defaultColumns: ['org', 'role', 'startDate', 'endDate'],
    description: 'The site uses the sort order below; the CV lists newest start date first.',
  },
  ...publicRead,
  defaultSort: 'sortOrder',
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'org', label: 'Organisation', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'tile', type: 'text', maxLength: 3, admin: { description: 'Monogram, e.g. CSI' } },
      ],
    },
    {
      type: 'row',
      fields: [monthField('startDate', { required: true }), monthField('endDate')],
    },
    { name: 'siteText', type: 'textarea', required: true },
    { name: 'cvText', label: 'CV text', type: 'textarea', admin: { description: 'Defaults to the site text.' } },
    logoField,
    sortOrderField,
  ],
}
