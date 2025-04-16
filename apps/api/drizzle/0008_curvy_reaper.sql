CREATE TABLE "main_quest" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"importance" text NOT NULL,
	"due_date" timestamp,
	"xp_reward" integer,
	"completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quest_instance" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"completed" boolean DEFAULT false,
	"base_points" integer NOT NULL,
	"xp_reward" integer NOT NULL,
	"completed_at" timestamp,
	"streak_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quest_template" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"parent_quest_id" text,
	"recurrence_rule" text,
	"is_active" boolean DEFAULT true,
	"base_points" integer DEFAULT 1 NOT NULL,
	"xp_reward" integer DEFAULT 50,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_instance" (
	"id" text PRIMARY KEY NOT NULL,
	"quest_instance_id" text NOT NULL,
	"template_id" text NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false,
	"base_points" integer NOT NULL,
	"actual_start_time" timestamp,
	"actual_end_time" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_template" (
	"id" text PRIMARY KEY NOT NULL,
	"quest_template_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"base_points" integer DEFAULT 1 NOT NULL,
	"planned_start_time" text,
	"planned_end_time" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "quest" CASCADE;--> statement-breakpoint
DROP TABLE "recurring_task" CASCADE;--> statement-breakpoint
DROP TABLE "task" CASCADE;--> statement-breakpoint
ALTER TABLE "main_quest" ADD CONSTRAINT "main_quest_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_instance" ADD CONSTRAINT "quest_instance_template_id_quest_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."quest_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_instance" ADD CONSTRAINT "quest_instance_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_template" ADD CONSTRAINT "quest_template_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_template" ADD CONSTRAINT "quest_template_parent_quest_id_main_quest_id_fk" FOREIGN KEY ("parent_quest_id") REFERENCES "public"."main_quest"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_instance" ADD CONSTRAINT "task_instance_quest_instance_id_quest_instance_id_fk" FOREIGN KEY ("quest_instance_id") REFERENCES "public"."quest_instance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_instance" ADD CONSTRAINT "task_instance_template_id_task_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."task_template"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_template" ADD CONSTRAINT "task_template_quest_template_id_quest_template_id_fk" FOREIGN KEY ("quest_template_id") REFERENCES "public"."quest_template"("id") ON DELETE cascade ON UPDATE no action;