import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { payloadTheme } from 'payload-theme'
import { payloadTotp } from 'payload-totp'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Courses } from './collections/Courses'
import { Documents } from './collections/Documents'
import { Education } from './collections/Education'
import { Experiences } from './collections/Experiences'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Publications } from './collections/Publications'
import { Service } from './collections/Service'
import { Users } from './collections/Users'
import { Writing } from './collections/Writing'
import { CV } from './globals/CV'
import { Profile } from './globals/Profile'
import { Resume } from './globals/Resume'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL || ''

export default buildConfig({
  admin: {
    user: Users.slug,
    // Payload's own avatar rather than Gravatar's, which would be sent a hash of the admin's email.
    avatar: 'default',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · nimish-jain.com',
      icons: [
        { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
        { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
      ],
    },
  },
  collections: [Publications, Experiences, Education, Courses, Projects, Service, Writing, Media, Documents, Users],
  globals: [Profile, CV, Resume],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
    },
    // Dev-mode schema push is for the local Docker database only. Any other database
    // (Neon) changes through migrations, even when a local script like `pnpm seed`
    // connects to it.
    push: /@(localhost|127\.0\.0\.1)[:/]/.test(databaseUrl),
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    // Admin panel styling, matched to the site: cobalt accent, Geist, the name as wordmark.
    // Its stylesheet is imported in src/app/(payload)/custom.scss.
    payloadTheme({
      accent: '#2546C9',
      font: 'geist',
      radius: 'lg',
      logo: { light: '/brand/logo-light.png', dark: '/brand/logo-dark.png' },
      logoHeight: 30,
      login: {
        heading: 'Welcome back',
        tagline: 'Sign in to edit nimish-jain.com and the CV.',
      },
      nav: {
        // lucide.dev icon names
        icons: {
          publications: 'book-open',
          experiences: 'briefcase',
          education: 'graduation-cap',
          courses: 'library',
          projects: 'folder-git-2',
          service: 'handshake',
          writing: 'pen-line',
          media: 'image',
          documents: 'file',
          users: 'user-cog',
          profile: 'id-card',
          cv: 'file-text',
          resume: 'file-user',
        },
      },
    }),
    // Uploads go to Vercel Blob when a token is present, local disk (/media) otherwise.
    // Client uploads send files from the browser straight to Blob, so they aren't held
    // to the 4.5 MB request limit of Vercel functions (a camera photo is often more).
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      alwaysInsertFields: true,
      clientUploads: true,
      // /cv.pdf and /resume.pdf fetch their files straight from Blob, not through Payload's file route.
      // Documents get their own folder in the store, so a PDF can never share a path with an image
      // and be reached through the public media route. Files uploaded earlier keep their folders.
      collections: { media: true, documents: { disablePayloadAccessControl: true, prefix: 'documents' } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    // Two-factor sign-in: after the password, the admin asks for a code from an authenticator
    // app, and an account without one is sent to set it up first. Until the code is entered,
    // the API refuses that session too.
    // - It wraps the access of every collection and global it can see, so it stays last.
    // - The site's public reads opt out through `publicRead` (src/lib/access.ts).
    // - src/proxy.ts supplies the path its redirects need.
    payloadTotp({
      collection: 'users',
      forceSetup: true,
      forceWhiteBackgroundOnQrCode: true,
      totp: { issuer: 'nimish-jain.com' },
    }),
  ],
})
