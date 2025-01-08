CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"age" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "word" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	"translation" text NOT NULL
);
