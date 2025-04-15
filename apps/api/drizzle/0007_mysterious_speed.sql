ALTER TABLE "quest" DROP CONSTRAINT "quest_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "quest" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quest" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "quest" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "quest" ALTER COLUMN "xp_reward" SET DEFAULT 50;--> statement-breakpoint
ALTER TABLE "quest" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "quest" ADD COLUMN "parent_quest_id" text;--> statement-breakpoint
ALTER TABLE "quest" ADD COLUMN "recurrence_rule" text;--> statement-breakpoint
ALTER TABLE "recurring_task" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "quest" DROP COLUMN "is_main_quest";--> statement-breakpoint
ALTER TABLE "recurring_task" DROP COLUMN "xp_reward";