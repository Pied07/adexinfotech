import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

/** Add the hidden auto-slug controls without rebuilding or dropping existing content tables. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "generate_slug" boolean DEFAULT true;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "generate_slug" boolean DEFAULT true;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_generate_slug" boolean DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" DROP COLUMN IF EXISTS "generate_slug";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "generate_slug";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_generate_slug";
  `)
}

