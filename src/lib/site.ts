/** Public origin of the site, without a trailing slash. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://nimish-jain.com').replace(/\/$/, '')
