import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../src/db";
import jwt from "jsonwebtoken";

import { anonymous } from "better-auth/plugins";
import { account, session, user, verification } from "../src/db/schema";
import { sendPasswordResetEmail } from "./email";

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
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }) => {
      try {
        await sendPasswordResetEmail(user.email, url);
        console.log(`Password reset email sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send password reset email to ${user.email}:`, error);
        // In development, we'll still log the URL for testing
        if (process.env.NODE_ENV === 'development') {
          console.log(`Development reset URL: ${url}`);
        }
        throw error;
      }
    },
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
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
    "https://questly.me",
  ].filter(Boolean),
  plugins: [anonymous()],

  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
    storage: "memory",
    modelName: "rateLimit",
  },
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