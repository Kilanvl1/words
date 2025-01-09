ALTER TABLE "word" ADD COLUMN "consecutive_correct" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "word" ADD COLUMN "three_in_a_row" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "word" ADD COLUMN "state_of_word" text DEFAULT 'learning' NOT NULL;