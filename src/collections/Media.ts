import type { CollectionConfig } from 'payload'

import { revalidateHooks } from '../hooks/revalidate'
import { publicRead } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Admin',
  },
  ...publicRead,
  hooks: revalidateHooks,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'portrait', width: 480, height: 480, position: 'centre' },
      { name: 'og', width: 240, height: 240, position: 'centre' },
    ],
  },
}
