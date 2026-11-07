import type { CollectionConfig } from 'payload'

import { revalidateHooks } from '../hooks/revalidate'
import { keepOverwriteInFolder } from '../hooks/upload-overwrite'

/** PDF files: the CV and resume that /cv.pdf and /resume.pdf serve (chosen under Site → CV and Site → Resume). */
export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    group: 'Admin',
    useAsTitle: 'filename',
    description: 'PDF files. The ones chosen under Site → CV and Site → Resume are served at /cv.pdf and /resume.pdf.',
  },
  // Only a signed-in user can list these. /cv.pdf and /resume.pdf read the file through the
  // Local API, which is the server's own access, so visitors still get the PDFs from there
  // without being able to list every upload and its storage URL.
  access: { read: ({ req }) => Boolean(req.user) },
  // The site shows its Download CV buttons only while the CV has a PDF, so removing one revalidates.
  hooks: { ...revalidateHooks, beforeOperation: [keepOverwriteInFolder] },
  upload: {
    mimeTypes: ['application/pdf'],
  },
  fields: [],
}
