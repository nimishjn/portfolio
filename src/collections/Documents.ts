import type { CollectionConfig } from 'payload'

import { revalidateHooks } from '../hooks/revalidate'
import { publicRead } from '../lib/access'

/** PDF files: the CV and resume that /cv.pdf and /resume.pdf serve (chosen under Site → CV and Site → Resume). */
export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    group: 'Admin',
    useAsTitle: 'filename',
    description: 'PDF files. The ones chosen under Site → CV and Site → Resume are served at /cv.pdf and /resume.pdf.',
  },
  ...publicRead,
  // The site shows its Download CV buttons only while the CV has a PDF, so removing one revalidates.
  hooks: revalidateHooks,
  upload: {
    mimeTypes: ['application/pdf'],
  },
  fields: [],
}
