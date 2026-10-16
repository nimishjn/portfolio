import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_context" AS ENUM('personal', 'organisation');
  ALTER TABLE "projects" ADD COLUMN "context" "enum_projects_context" DEFAULT 'personal' NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "org" varchar;
  ALTER TABLE "projects" ADD COLUMN "preview_svg" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "context";
  ALTER TABLE "projects" DROP COLUMN "org";
  ALTER TABLE "projects" DROP COLUMN "preview_svg";
  DROP TYPE "public"."enum_projects_context";`)
}
