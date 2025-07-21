import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// Load environment-specific .env file
const env = process.env.NODE_ENV || "development";
console.log(`DB: Loading environment: ${env}`);

// Load environment-specific file first
dotenv.config({ path: `.env.${env}` });
// Fallback to .env if environment-specific file doesn't exist
dotenv.config();

console.log(`DB: DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
console.log(`DB: DATABASE_URL preview: ${process.env.DATABASE_URL?.substring(0, 20)}...`);

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle({ client: pool });

export default db;