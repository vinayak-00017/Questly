ALTER TABLE "quest_instance" DROP CONSTRAINT "quest_instance_template_id_quest_template_id_fk";
--> statement-breakpoint
ALTER TABLE "quest_instance" ADD CONSTRAINT "quest_instance_template_id_quest_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."quest_template"("id") ON DELETE no action ON UPDATE no action;