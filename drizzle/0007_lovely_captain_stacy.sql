CREATE TABLE IF NOT EXISTS "verb_conjugation" (
	"id" serial PRIMARY KEY NOT NULL,
	"eu" text NOT NULL,
	"voce" text NOT NULL,
	"ele" text NOT NULL,
	"nos" text NOT NULL,
	"vos" text NOT NULL,
	"eles" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "word" ADD COLUMN "verb_conjugation_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "word" ADD CONSTRAINT "word_verb_conjugation_id_verb_conjugation_id_fk" FOREIGN KEY ("verb_conjugation_id") REFERENCES "public"."verb_conjugation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
