import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../src/db";
import * as jwt from "jsonwebtoken";

import { anonymous } from "better-auth/plugins";
import { account, session, user, verification } from "../src/db/schema";

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
  trustedOrigins: ["http://localhost:3000"],
  plugins: [anonymous()],
});

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
