--> statement-breakpoint
ALTER TABLE "quest_instance" DROP CONSTRAINT "quest_instance_template_id_quest_template_id_fk";
--> statement-breakpoint
ALTER TABLE "quest_instance" DROP CONSTRAINT "quest_instance_user_id_user_id_fk";
--> statement-breakpoint

ALTER TABLE "quest_instance" ADD COLUMN "parent_quest_id" text;--> statement-breakpoint
ALTER TABLE "quest_instance" ADD CONSTRAINT "quest_instance_parent_quest_id_main_quest_id_fk" FOREIGN KEY ("parent_quest_id") REFERENCES "public"."main_quest"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_instance" ADD CONSTRAINT "quest_instance_template_id_quest_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."quest_template"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_instance" ADD CONSTRAINT "quest_instance_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;