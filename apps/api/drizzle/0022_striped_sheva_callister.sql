ALTER TABLE "user" ADD COLUMN "has_completed_onboarding" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboarding_step" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "has_created_first_quest" boolean DEFAULT false NOT NULL;