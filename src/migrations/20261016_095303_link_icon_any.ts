import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile_links" ALTER COLUMN "icon" SET DATA TYPE varchar;
  ALTER TABLE "profile_links" ALTER COLUMN "icon" SET DEFAULT 'link';
  DROP TYPE "public"."enum_profile_links_icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Lucide icons have no place in the old list, so those links fall back to the link glyph.
  // The default is dropped while the type changes, since text has no implicit cast to an enum.
  await db.execute(sql`
   UPDATE "profile_links" SET "icon" = 'link' WHERE "icon" NOT IN ('mail', 'scholar', 'orcid', 'github', 'linkedin', 'link');
  CREATE TYPE "public"."enum_profile_links_icon" AS ENUM('mail', 'scholar', 'orcid', 'github', 'linkedin', 'link');
  ALTER TABLE "profile_links" ALTER COLUMN "icon" DROP DEFAULT;
  ALTER TABLE "profile_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_profile_links_icon" USING "icon"::"public"."enum_profile_links_icon";
  ALTER TABLE "profile_links" ALTER COLUMN "icon" SET DEFAULT 'link';`)
}
