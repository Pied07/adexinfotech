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
  // Boot-time idempotent migration: ensures the three 404-page columns always
  // exist regardless of NODE_ENV (prodMigrations only fires when NODE_ENV=production).
  onInit: async (payload) => {
    try {
      // Use the raw pool client so we can run multiple statements including DO blocks.
      const pool = (payload.db as unknown as { pool: { connect: () => Promise<{ query: (s: string) => Promise<unknown>; release: () => void }> } }).pool
      const client = await pool.connect()
      try {
        await client.query(`
          ALTER TABLE "site_settings"
            ADD COLUMN IF NOT EXISTS "not_found_bg_id"   integer,
            ADD COLUMN IF NOT EXISTS "not_found_heading" varchar DEFAULT 'Page not found',
            ADD COLUMN IF NOT EXISTS "not_found_subtext" varchar DEFAULT 'You''ve wandered too deep. This path doesn''t exist.'
        `)
        await client.query(`
          CREATE INDEX IF NOT EXISTS "site_settings_not_found_bg_idx"
            ON "site_settings" USING btree ("not_found_bg_id")
        `)
        await client.query(`
          DO $$ BEGIN
            ALTER TABLE "site_settings"
              ADD CONSTRAINT "site_settings_not_found_bg_id_media_id_fk"
              FOREIGN KEY ("not_found_bg_id") REFERENCES "media"("id")
              ON DELETE SET NULL ON UPDATE NO ACTION;
          EXCEPTION WHEN duplicate_object THEN NULL;
          END $$
        `)
        payload.logger.info('✅ site_settings 404 columns ensured')
      } finally {
        client.release()
      }
    } catch (err) {
      // Non-fatal — log and continue; admin still loads even if columns already existed
      payload.logger.warn({ err }, '⚠️  onInit 404-column migration skipped')
    }
  },
})
