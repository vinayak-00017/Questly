import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

// Use versioned API endpoint for auth
const getAuthBaseURL = () => {
  if (process.env.NODE_ENV === "production") {
    return "/v1/api";  // Express API via nginx proxy
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
