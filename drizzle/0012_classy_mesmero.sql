CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verb_conjugation" RENAME COLUMN "voce" TO "voce_and_ele";--> statement-breakpoint
ALTER TABLE "verb_conjugation" RENAME COLUMN "eles" TO "eles_and_voces";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "verb_conjugation" DROP COLUMN IF EXISTS "ele";--> statement-breakpoint
ALTER TABLE "verb_conjugation" DROP COLUMN IF EXISTS "vos";