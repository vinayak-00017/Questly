ALTER TABLE "quest_instance" DROP CONSTRAINT "quest_instance_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "quest_instance" ADD CONSTRAINT "quest_instance_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;