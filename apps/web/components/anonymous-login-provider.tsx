"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { WelcomeDialog } from "./welcome-dialog";
import { BASE_URL } from "@/config";

interface AnonymousUserContextType {
  isAnonymous: boolean;
  upgradeAccount: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  upgradeWithOAuth: (
    provider: "google"
  ) => Promise<{ success: boolean; error?: string }>;
  createAnonymousSession: () => Promise<void>;
  hasUserLoggedOut: boolean;
  showWelcomeDialog: boolean;
  setShowWelcomeDialog: (show: boolean) => void;
}

const AnonymousUserContext = createContext<AnonymousUserContextType | null>(
  null
);

interface AnonymousLoginProviderProps {
  children: React.ReactNode;
}

export function AnonymousLoginProvider({
  children,
}: AnonymousLoginProviderProps) {
  const { data: session, isPending } = useSession();
  const hasAttemptedLogin = useRef(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hasUserLoggedOut, setHasUserLoggedOut] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const previousSession = useRef(session);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Skip logout detection on initial load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      previousSession.current = session;
      return;
    }

    // Detect logout: if we had a session before and now we don't
    if (previousSession.current?.user && !session?.user && !isPending) {
      console.log("🚪 User logged out - preventing auto anonymous login");
      setHasUserLoggedOut(true);
      hasAttemptedLogin.current = false;
    }

    // Update previous session reference
    previousSession.current = session;

    if (session?.user) {
      // Check if user is anonymous based on the isAnonymous field
      setIsAnonymous(session.user.isAnonymous === true);
      // Clear logout flag when user logs in
      if (hasUserLoggedOut) {
        setHasUserLoggedOut(false);
      }
    } else {
      setIsAnonymous(false);
    }
  }, [session, isPending, hasUserLoggedOut]);

  useEffect(() => {
    const shouldShowWelcome = () => {
      // Show welcome dialog if:
      // - No user is logged in (not even anonymous)
      // - Not currently loading
      // - User hasn't explicitly logged out
      // - Not on auth pages
      // - Dialog is not already showing
      if (
        session?.user || // Already has a session (including anonymous)
        isPending ||
        hasUserLoggedOut ||
        showWelcomeDialog ||
        typeof window === "undefined"
      ) {
        return false;
      }

      // Don't show on auth pages
      const pathname = window.location.pathname;
      if (
        pathname === "/login" ||
        pathname === "/register" ||
        pathname.startsWith("/auth/")
      ) {
        return false;
      }

      return true;
    };

    if (shouldShowWelcome()) {
      // Add a small delay to ensure all checks are complete
      const timer = setTimeout(() => {
        if (shouldShowWelcome()) {
          console.log("🎭 Showing welcome dialog for new visitor");
          setShowWelcomeDialog(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [session, isPending, hasUserLoggedOut, showWelcomeDialog]);

  const createAnonymousSession = async () => {
    try {
      hasAttemptedLogin.current = true;
      setHasUserLoggedOut(false);
      setShowWelcomeDialog(false);

      console.log("🎭 Creating anonymous user session...");
      const result = await authClient.anonymous();

      if (result.data) {
        console.log("✅ Anonymous user created successfully");
        setIsAnonymous(true);
        showWelcomeNotification();
      } else {
        console.error("❌ Failed to create anonymous user:", result.error);
      }
    } catch (error) {
      console.error("❌ Failed to create anonymous session:", error);
      hasAttemptedLogin.current = false;
    }
  };

  const handleWelcomeSignIn = () => {
    setShowWelcomeDialog(false);
  };

  const upgradeAccount = async (email: string, password: string) => {
    if (!session?.user || !isAnonymous) {
      return { success: false, error: "Not an anonymous user" };
    }

    try {
      // First check if email is already registered
      const checkResponse = await fetch(`${BASE_URL}/api/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if (!checkResponse.ok) {
        throw new Error("Failed to check email availability");
      }

      const { exists } = await checkResponse.json();

      if (exists) {
        return {
          success: false,
          error:
            "An account with this email already exists. Please sign in instead.",
        };
      }

      // Proceed with upgrade
      const upgradeResponse = await fetch(`${BASE_URL}/api/upgrade-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          userId: session.user.id,
        }),
      });

      if (!upgradeResponse.ok) {
        const errorData = await upgradeResponse.json();
        throw new Error(errorData.message || "Failed to upgrade account");
      }

      const result = await upgradeResponse.json();

      if (result.success) {
        setIsAnonymous(false);
        // Refresh session to get updated user data
        window.location.reload();
        return { success: true };
      } else {
        return { success: false, error: result.message || "Upgrade failed" };
      }
    } catch (error) {
      console.error("Account upgrade error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  };

  const upgradeWithOAuth = async (provider: "google") => {
    if (!session?.user || !isAnonymous) {
      return { success: false, error: "Not an anonymous user" };
    }

    try {
      // Store the current anonymous user ID in sessionStorage so we can retrieve it after OAuth
      sessionStorage.setItem("anonymousUpgradeUserId", session.user.id);
      sessionStorage.setItem("isUpgradeFlow", "true");

      // Use environment-based callback URL
      const callbackURL =
        process.env.NODE_ENV === "production"
          ? "/auth/upgrade-callback"
          : "http://localhost:3000/auth/upgrade-callback";

      // Proceed with OAuth - the callback will handle the account existence check
      await authClient.signIn.social({
        provider,
        callbackURL,
      });

      return { success: true };
    } catch (error) {
      console.error("OAuth upgrade error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  };

  const contextValue: AnonymousUserContextType = {
    isAnonymous,
    upgradeAccount,
    upgradeWithOAuth,
    createAnonymousSession,
    hasUserLoggedOut,
    showWelcomeDialog,
    setShowWelcomeDialog,
  };

  return (
    <AnonymousUserContext.Provider value={contextValue}>
      {children}
      <WelcomeDialog
        open={showWelcomeDialog}
        onContinueAsGuest={createAnonymousSession}
        onSignIn={handleWelcomeSignIn}
      />
    </AnonymousUserContext.Provider>
  );
}

function showWelcomeNotification() {
  // Create welcome toast
  const toast = document.createElement("div");
  toast.innerHTML = `
    <div class="fixed top-4 right-4 z-50 bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 backdrop-blur-sm animate-in slide-in-from-right duration-300">
      <p class="text-amber-300 font-medium">🎭 Welcome, Anonymous Adventurer!</p>
      <p class="text-xs text-zinc-400">You can upgrade your account anytime to save progress permanently.</p>
    </div>
  `;

  document.body.appendChild(toast);

  // Remove toast after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.transition = "opacity 0.3s ease-out";
      toast.style.opacity = "0";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }, 5000);
}

export function useAnonymousUser() {
  const context = useContext(AnonymousUserContext);
  if (!context) {
    throw new Error(
      "useAnonymousUser must be used within AnonymousLoginProvider"
    );
  }
  return context;
}
