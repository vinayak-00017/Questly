import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../src/db";

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

// export async function getAdminToken() {
//   const token = jwt.sign({
//     role: "admin", internal: true},
//     process.env.JWT_SECRET!,
//     { expiresIn: "1h" }
//   );
//   return token;
//   }
