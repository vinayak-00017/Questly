ALTER TABLE "task_instance" ALTER COLUMN "template_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_instance" ADD COLUMN "time_tracked" integer;--> statement-breakpoint
ALTER TABLE "quest_instance" ADD COLUMN "planned_start_time" text;--> statement-breakpoint
ALTER TABLE "quest_instance" ADD COLUMN "planned_end_time" text;--> statement-breakpoint
ALTER TABLE "quest_template" ADD COLUMN "planned_start_time" text;--> statement-breakpoint
ALTER TABLE "quest_template" ADD COLUMN "planned_end_time" text;--> statement-breakpoint
ALTER TABLE "task_instance" ADD COLUMN "time_tracked" integer;--> statement-breakpoint
ALTER TABLE "task_instance" ADD COLUMN "planned_start_time" text;--> statement-breakpoint
ALTER TABLE "task_instance" ADD COLUMN "planned_end_time" text;--> statement-breakpoint
ALTER TABLE "task_template" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "task_instance" DROP COLUMN "actual_start_time";--> statement-breakpoint
ALTER TABLE "task_instance" DROP COLUMN "actual_end_time";