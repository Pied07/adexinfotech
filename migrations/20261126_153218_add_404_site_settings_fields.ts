import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "not_found_bg_id" integer;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "not_found_heading" varchar DEFAULT 'Page not found';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "not_found_subtext" varchar DEFAULT 'You''ve wandered too deep. This path doesn''t exist.';

    CREATE INDEX IF NOT EXISTS "site_settings_not_found_bg_idx"
      ON "site_settings" USING btree ("not_found_bg_id");

    DO $$ BEGIN
      ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_not_found_bg_id_media_id_fk"
        FOREIGN KEY ("not_found_bg_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_not_found_bg_id_media_id_fk";
    DROP INDEX IF EXISTS "site_settings_not_found_bg_idx";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "not_found_bg_id";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "not_found_heading";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "not_found_subtext";
  `)
}
