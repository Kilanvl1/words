ALTER TABLE "verb_conjugation" RENAME COLUMN "voce" TO "voce_and_ele";--> statement-breakpoint
ALTER TABLE "verb_conjugation" RENAME COLUMN "eles" TO "eles_and_voces";--> statement-breakpoint
ALTER TABLE "verb_conjugation" DROP COLUMN IF EXISTS "ele";--> statement-breakpoint
ALTER TABLE "verb_conjugation" DROP COLUMN IF EXISTS "vos";