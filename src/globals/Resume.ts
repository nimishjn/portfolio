import type { GlobalConfig } from 'payload'

/**
 * A one-page resume, made outside the site and uploaded here. Unlike the CV it is not linked from
 * any page, and only signed-in users can read this global; the file itself is public at /resume.pdf.
 */
export const Resume: GlobalConfig = {
  slug: 'resume',
  label: 'Resume',
  admin: {
    group: 'Site',
    description:
      'A one-page resume, served at /resume.pdf. Nothing on the site links to it, and search engines are asked not to index it. Until one is uploaded, /resume.pdf redirects to /cv.',
  },
  fields: [
    {
      name: 'pdf',
      label: 'PDF',
      type: 'upload',
      relationTo: 'documents',
    },
  ],
}
