import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL: "http://localhost:5001",
  plugins: [anonymousClient()],
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession } = authClient;
