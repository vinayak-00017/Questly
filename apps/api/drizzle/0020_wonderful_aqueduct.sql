CREATE TABLE "user_achievement" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"achievement_id" text NOT NULL,
	"unlocked_at" timestamp,
	"progress" integer,
	"importance" text,
	"last_progress_update" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_achievement" ADD CONSTRAINT "user_achievement_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_achievement_user_idx" ON "user_achievement" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_achievement_achievement_idx" ON "user_achievement" USING btree ("achievement_id");