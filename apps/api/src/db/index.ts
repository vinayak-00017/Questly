import dotenv from "dotenv";

// Load environment-specific .env file
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });
// Fallback to .env if environment-specific file doesn't exist
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const db = drizzle({
  client: new pg.Client({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export { db };
export default db;
