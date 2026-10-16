import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'
import { publicRead } from '../lib/access'
import { validateLinkIcon } from '../lib/link-icons'

export const Profile: GlobalConfig = {
  slug: 'profile',
  admin: {
    group: 'Site',
  },
  ...publicRead,
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Intro',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'jobTitle', type: 'text', required: true, admin: { description: 'Used in structured data.' } },
                { name: 'employer', type: 'text', required: true },
              ],
            },
            {
              name: 'subtitle',
              type: 'text',
              required: true,
              admin: { description: 'Shown under your name, e.g. "Software Development Engineer II · Luganodes · India".' },
            },
            { name: 'bio', type: 'richText', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'showStudyIntent',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { description: 'An optional line under the bio. Off by default.' },
                },
                { name: 'studyIntentText', type: 'text' },
              ],
            },
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Square photo, at least 480 × 480.' },
            },
            {
              name: 'researchInterests',
              type: 'array',
              fields: [{ name: 'label', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'email', type: 'email', required: true },
            {
              name: 'links',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'url', type: 'text', required: true, admin: { width: '45%' } },
                    {
                      // A site glyph (brand logos) or any Lucide icon as `lucide:<name>`; see src/lib/link-icons.ts.
                      name: 'icon',
                      type: 'text',
                      defaultValue: 'link',
                      validate: validateLinkIcon,
                      admin: {
                        width: '25%',
                        components: { Field: '/components/admin/IconPickerField#IconPickerField' },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Site',
          fields: [
            {
              name: 'seoTitle',
              label: 'SEO title',
              type: 'text',
              maxLength: 70,
              admin: {
                description:
                  'Title in search results and link previews, e.g. "Nimish Jain · Software engineer and researcher". Leave empty to use your name.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              required: true,
              maxLength: 200,
              admin: { description: 'Search and link-preview description.' },
            },
            {
              name: 'lastUpdated',
              type: 'date',
              required: true,
              admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } },
            },
          ],
        },
      ],
    },
  ],
}
