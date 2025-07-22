// Load environment configuration first
import "../config/env";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

console.log(`DB: DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
console.log(`DB: DATABASE_URL preview: ${process.env.DATABASE_URL?.substring(0, 20)}...`);

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle({ client: pool });

export default db;