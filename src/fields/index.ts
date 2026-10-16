import type { DateField, NumberField, UploadField } from 'payload'

/** Manual ordering within a list; lower numbers come first. */
export const sortOrderField: NumberField = {
  name: 'sortOrder',
  type: 'number',
  defaultValue: 0,
  admin: {
    position: 'sidebar',
    description: 'Lower numbers are listed first.',
  },
}

/**
 * Dates are stored as the first of the month (UTC) and formatted per surface:
 * "Feb 2026 – now" on the site, "02/2026 – present" on the CV.
 */
export function monthField(
  name: string,
  options: { required?: boolean; description?: string } = {},
): DateField {
  return {
    name,
    type: 'date',
    required: options.required,
    admin: {
      date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
      description: options.description,
    },
  }
}

/**
 * Optional organisation logo, shown as a single-colour silhouette inside the small tile
 * (the monogram is used when empty). The silhouette comes from the image's transparency.
 */
export const logoField: UploadField = {
  name: 'logo',
  type: 'upload',
  relationTo: 'media',
  filterOptions: { mimeType: { in: ['image/svg+xml', 'image/png', 'image/webp'] } },
  admin: {
    position: 'sidebar',
    description:
      'Optional. Use the square symbol, not the wordmark, as an SVG or a PNG with a transparent background. It is shown in one colour that follows light and dark mode.',
  },
}
