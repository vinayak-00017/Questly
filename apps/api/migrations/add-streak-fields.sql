-- Add streak fields to user table
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS "streak" integer DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS "last_active_date" date;