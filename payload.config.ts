import { postgresAdapter } from '@payloadcms/db-postgres'
import { EXPERIMENTAL_TableFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { cloudinaryStorage } from 'payload-storage-cloudinary'
import { Services } from './payload/collections/Services.ts'
import { Posts } from './payload/collections/Posts.ts'
import { Inquiries } from './payload/collections/Inquiries.ts'
import { Media } from './payload/collections/Media.ts'
import { Users } from './payload/collections/Users.ts'
import { SiteSettings } from './payload/globals/SiteSettings.ts'
import { migrations } from './migrations/index.ts'

export default buildConfig({
  admin: { user: 'users', importMap: { baseDir: process.cwd() } },
  collections: [Users, Services, Posts, Inquiries, Media],
  globals: [SiteSettings],
  plugins: process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
    ? [cloudinaryStorage({
        cloudConfig: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        },
        collections: {
          media: {
            folder: 'adex-infotech',
            transformations: { default: { quality: 'auto', fetch_format: 'auto' }, preserveOriginal: true },
          },
        },
      })]
    : [],
  editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()] }),
  secret: process.env.PAYLOAD_SECRET!,
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    prodMigrations: migrations,
  }),
  typescript: { outputFile: 'payload-types.ts' },
})

