ALTER TABLE "recurring_task" ADD COLUMN "base_points" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "base_points" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "recurring_task" DROP COLUMN "calculated_points";--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN "calculated_points";