import type { CollectionConfig } from 'payload'

import { monthField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'
import { publicRead } from '../lib/access'

export const Writing: CollectionConfig = {
  slug: 'writing',
  labels: { singular: 'Article', plural: 'Writing' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'platform', 'date'],
  },
  ...publicRead,
  defaultSort: '-date',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        monthField('date', { required: true }),
        { name: 'platform', type: 'text', required: true, defaultValue: 'Medium' },
      ],
    },
    { name: 'url', type: 'text', required: true },
  ],
}
