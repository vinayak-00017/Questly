import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

// Use versioned API endpoint for auth
const getAuthBaseURL = () => {
  if (process.env.NODE_ENV === "production") {
    // Use full URL for production - Better Auth requires absolute URLs
    return process.env.NEXT_PUBLIC_AUTH_URL || "https://questly.me/v1";
  }
  return "http://localhost:5001";  // Direct connection for development
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  plugins: [anonymousClient()],
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession } = authClient;
