ALTER TABLE "quest" ALTER COLUMN "xp_reward" SET DEFAULT 100;--> statement-breakpoint
ALTER TABLE "recurring_task" ADD COLUMN "calculated_points" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "calculated_points" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "recurring_task" DROP COLUMN "xp_per_minute";--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN "xp_per_minute";