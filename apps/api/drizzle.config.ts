import dotenv from "dotenv";

// Load environment-specific .env file
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });
// Fallback to .env if environment-specific file doesn't exist
dotenv.config();

import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  console.log("Cannot find database url");
}

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/db/schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
