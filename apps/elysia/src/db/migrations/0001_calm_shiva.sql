ALTER TABLE "properties" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "properties_organizationId_idx" ON "properties" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "properties" DROP COLUMN "landlord_id";--> statement-breakpoint
ALTER TABLE "properties" DROP COLUMN "manager_id";