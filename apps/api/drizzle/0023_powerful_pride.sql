CREATE TABLE "tracked_quest" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"template_id" text NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"priority" text DEFAULT 'standard',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tracked_quest" ADD CONSTRAINT "tracked_quest_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracked_quest" ADD CONSTRAINT "tracked_quest_template_id_quest_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."quest_template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tracked_quest_user_idx" ON "tracked_quest" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tracked_quest_user_template_unique" ON "tracked_quest" USING btree ("user_id","template_id");