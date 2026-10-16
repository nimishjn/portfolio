import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "experiences" ADD COLUMN "logo_id" integer;
  ALTER TABLE "education" ADD COLUMN "logo_id" integer;
  ALTER TABLE "service" ADD COLUMN "logo_id" integer;
  ALTER TABLE "experiences" ADD CONSTRAINT "experiences_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "education" ADD CONSTRAINT "education_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service" ADD CONSTRAINT "service_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "experiences_logo_idx" ON "experiences" USING btree ("logo_id");
  CREATE INDEX "education_logo_idx" ON "education" USING btree ("logo_id");
  CREATE INDEX "service_logo_idx" ON "service" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "experiences" DROP CONSTRAINT "experiences_logo_id_media_id_fk";
  
  ALTER TABLE "education" DROP CONSTRAINT "education_logo_id_media_id_fk";
  
  ALTER TABLE "service" DROP CONSTRAINT "service_logo_id_media_id_fk";
  
  DROP INDEX "experiences_logo_idx";
  DROP INDEX "education_logo_idx";
  DROP INDEX "service_logo_idx";
  ALTER TABLE "experiences" DROP COLUMN "logo_id";
  ALTER TABLE "education" DROP COLUMN "logo_id";
  ALTER TABLE "service" DROP COLUMN "logo_id";`)
}
