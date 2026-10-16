import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "publications" DROP COLUMN "figure";
  ALTER TABLE "projects" DROP COLUMN "preview";
  DROP TYPE "public"."enum_publications_figure";
  DROP TYPE "public"."enum_projects_preview";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Brings the preset columns back empty; the values were dropped with them.
  await db.execute(sql`
   CREATE TYPE "public"."enum_publications_figure" AS ENUM('encryption', 'outlier-band', 'seasonal', 'regression');
  CREATE TYPE "public"."enum_projects_preview" AS ENUM('pattern-grid', 'riddle-map');
  ALTER TABLE "publications" ADD COLUMN "figure" "enum_publications_figure";
  ALTER TABLE "projects" ADD COLUMN "preview" "enum_projects_preview";`)
}
