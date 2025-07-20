import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

// Use versioned API endpoint for auth
const getAuthBaseURL = () => {
  if (process.env.NODE_ENV === "production") {
    // Better Auth needs the full path including /api/auth for production
    return process.env.NEXT_PUBLIC_AUTH_URL || "https://questly.me/v1/api/auth";
  }
  return "http://localhost:5001"; // Better Auth will add /api/auth automatically
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  plugins: [anonymousClient()],
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession } = authClient;
