ALTER TABLE "quest_instance" ALTER COLUMN "completed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "timezone" text DEFAULT 'UTC' NOT NULL;