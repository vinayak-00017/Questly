CREATE INDEX "main_quest_user_idx" ON "main_quest" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "main_quest_user_completed_idx" ON "main_quest" USING btree ("user_id","completed");--> statement-breakpoint
CREATE INDEX "quest_instance_user_date_idx" ON "quest_instance" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "quest_instance_template_date_idx" ON "quest_instance" USING btree ("template_id","date");--> statement-breakpoint
CREATE INDEX "quest_instance_user_template_idx" ON "quest_instance" USING btree ("user_id","template_id");--> statement-breakpoint
CREATE INDEX "quest_instance_user_date_range_idx" ON "quest_instance" USING btree ("user_id","date","completed");--> statement-breakpoint
CREATE INDEX "quest_template_user_active_idx" ON "quest_template" USING btree ("user_id","is_active");--> statement-breakpoint
CREATE INDEX "quest_template_user_type_idx" ON "quest_template" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "task_instance_quest_instance_idx" ON "task_instance" USING btree ("quest_instance_id");--> statement-breakpoint
CREATE INDEX "xp_transaction_user_date_idx" ON "xp_transaction" USING btree ("user_id","date");