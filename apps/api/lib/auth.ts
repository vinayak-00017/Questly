import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../src/db";
import jwt from "jsonwebtoken";

import { anonymous } from "better-auth/plugins";
import { account, session, user, verification } from "../src/db/schema";

console.log(`[AUTH CONFIG] Environment: ${process.env.NODE_ENV}`);
console.log(`[AUTH CONFIG] Database URL exists: ${!!process.env.DATABASE_URL}`);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://questly.me"
  ].filter(Boolean),
  plugins: [anonymous()],
});

console.log(`[AUTH CONFIG] Auth initialized with plugins:`, Object.keys(auth.api));

//Generate a scheduler token.

export async function getSchedulerToken() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(
    { type: "scheduler", internal: true },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
}
