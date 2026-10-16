import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "cv" ADD COLUMN "allow_indexing" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "profile" DROP COLUMN "seo_title";
  ALTER TABLE "cv" DROP COLUMN "allow_indexing";`)
}
