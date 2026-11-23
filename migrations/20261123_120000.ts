import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "logo_icon_id" integer;
    CREATE INDEX IF NOT EXISTS "site_settings_logo_icon_idx" ON "site_settings" USING btree ("logo_icon_id");
    DO $$ BEGIN
      ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_icon_id_media_id_fk"
        FOREIGN KEY ("logo_icon_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_logo_icon_id_media_id_fk";
    DROP INDEX IF EXISTS "site_settings_logo_icon_idx";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "logo_icon_id";
  `)
}
