ALTER TABLE "quest_instance" ALTER COLUMN "template_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_instance" ALTER COLUMN "xp_reward" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_template" ALTER COLUMN "xp_reward" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "quest_instance" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "quest_instance" ADD COLUMN "description" text;