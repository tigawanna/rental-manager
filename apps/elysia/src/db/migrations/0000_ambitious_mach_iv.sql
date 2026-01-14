CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "apikey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"user_id" text NOT NULL,
	"refill_interval" integer,
	"refill_amount" integer,
	"last_refill_at" timestamp,
	"enabled" boolean DEFAULT true,
	"rate_limit_enabled" boolean DEFAULT true,
	"rate_limit_time_window" integer DEFAULT 86400000,
	"rate_limit_max" integer DEFAULT 10,
	"request_count" integer DEFAULT 0,
	"remaining" integer,
	"last_request" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"permissions" text,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"name" varchar(255) NOT NULL,
	"description" text,
	"file_url" text NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_size" integer,
	"category" varchar(50) NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"property_id" uuid,
	"lease_id" uuid
);
--> statement-breakpoint
CREATE TABLE "leases" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"unit_id" uuid NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"monthly_rent" numeric(10, 2) NOT NULL,
	"security_deposit" numeric(10, 2) NOT NULL,
	"payment_due_day" varchar(2) DEFAULT '1' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"terms" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "maintenance_requests" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"property_id" uuid NOT NULL,
	"unit_id" uuid,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"assigned_to_id" varchar(255),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"priority" varchar(20) DEFAULT 'medium' NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"estimated_cost" numeric(10, 2),
	"actual_cost" numeric(10, 2),
	"scheduled_date" date,
	"completed_date" date,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"lease_id" uuid NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"due_date" date NOT NULL,
	"paid_date" date,
	"payment_method" varchar(50),
	"transaction_id" varchar(255),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payment_type" varchar(50) DEFAULT 'rent' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"organization_id" text NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(50) NOT NULL,
	"zip_code" varchar(20) NOT NULL,
	"country" varchar(100) DEFAULT 'USA' NOT NULL,
	"property_type" varchar(50) NOT NULL,
	"total_units" integer DEFAULT 1 NOT NULL,
	"year_built" integer,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"property_id" uuid NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"unit_number" varchar(50) NOT NULL,
	"floor" integer,
	"bedrooms" integer DEFAULT 1 NOT NULL,
	"bathrooms" numeric(3, 1) DEFAULT '1.0' NOT NULL,
	"square_feet" integer,
	"rent_amount" numeric(10, 2) NOT NULL,
	"security_deposit" numeric(10, 2) NOT NULL,
	"description" text,
	"is_available" boolean DEFAULT true NOT NULL,
	"amenities" text
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apikey" ADD CONSTRAINT "apikey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_lease_id_leases_id_fk" FOREIGN KEY ("lease_id") REFERENCES "public"."leases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leases" ADD CONSTRAINT "leases_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_lease_id_leases_id_fk" FOREIGN KEY ("lease_id") REFERENCES "public"."leases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "apikey_key_idx" ON "apikey" USING btree ("key");--> statement-breakpoint
CREATE INDEX "apikey_userId_idx" ON "apikey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invitation_organizationId_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "member_organizationId_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_uidx" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "properties_organizationId_idx" ON "properties" USING btree ("organization_id");