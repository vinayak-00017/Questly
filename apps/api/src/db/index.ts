import dotenv from "dotenv";

// Load environment-specific .env file
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });
// Fallback to .env if environment-specific file doesn't exist
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle({ client: pool });

export default db;
