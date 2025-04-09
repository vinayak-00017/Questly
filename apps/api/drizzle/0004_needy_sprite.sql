CREATE TABLE "recurring_task" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"recurrence_rule" text NOT NULL,
	"is_time_tracked" boolean DEFAULT false NOT NULL,
	"planned_duration" integer,
	"xp_per_minute" integer,
	"xp_reward" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "task" DROP CONSTRAINT "task_quest_id_quest_id_fk";
--> statement-breakpoint
ALTER TABLE "quest" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "completed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "xp_reward" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "recurring_task_id" integer;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "date" date;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "is_time_tracked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "planned_duration" integer;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "actual_duration" integer;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "xp_per_minute" integer;--> statement-breakpoint
ALTER TABLE "recurring_task" ADD CONSTRAINT "recurring_task_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_recurring_task_id_recurring_task_id_fk" FOREIGN KEY ("recurring_task_id") REFERENCES "public"."recurring_task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN "quest_id";--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN "order";