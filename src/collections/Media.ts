import type { CollectionConfig } from 'payload'

import { revalidateHooks } from '../hooks/revalidate'
import { overwriteHooks } from '../hooks/upload-overwrite'
import { publicRead } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Admin',
  },
  ...publicRead,
  // Anyone can read, but a visitor's file request has to match a row. With a plain `true`,
  // Payload's file route skips that lookup and asks the storage for whatever name was typed,
  // which on the shared Blob store means any file at its root. A query makes the route find
  // the row first (image sizes included) and 404 otherwise.
  access: { read: ({ req }) => (req.user ? true : { filename: { exists: true } }) },
  hooks: { ...revalidateHooks, ...overwriteHooks },
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
