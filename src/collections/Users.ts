import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
  },
  auth: {
    // The second-factor cookie copies these settings. Sessions last an hour before the admin
    // has to sign in and enter a code again; the cookies travel only over HTTPS in production
    // (local development is plain http).
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' },
    tokenExpiration: 3600,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
