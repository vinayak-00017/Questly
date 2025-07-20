"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { BASE_URL } from "@/config";

function UpgradeCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "account-exists"
  >("loading");
  const [message, setMessage] = useState("");
  const [existingAccountEmail, setExistingAccountEmail] = useState("");

  useEffect(() => {
    const handleUpgradeCallback = async () => {
      try {
        // Get the anonymous user ID we stored before OAuth
        const anonymousUserId = sessionStorage.getItem(
          "anonymousUpgradeUserId"
        );
        const isUpgradeFlow = sessionStorage.getItem("isUpgradeFlow");

        if (!anonymousUserId || !isUpgradeFlow) {
          setStatus("error");
          setMessage("Invalid upgrade flow. Please try again.");
          return;
        }

        // Wait a moment for the session to be updated after OAuth
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!session?.user) {
          setStatus("error");
          setMessage("OAuth authentication failed. Please try again.");
          return;
        }

        // Check if this OAuth account already exists for a non-anonymous user
        const checkResponse = await fetch(
          `${BASE_URL}/api/check-oauth-account-callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              oauthAccountId: session.user.id,
              oauthEmail: session.user.email,
              provider: "google", // You can make this dynamic based on the OAuth provider
              anonymousUserId: anonymousUserId,
            }),
          }
        );

        if (!checkResponse.ok) {
          throw new Error("Failed to verify account status");
        }

        const result = await checkResponse.json();

        if (result.accountExists) {
          // The OAuth account already exists - we need to cancel this login
          setStatus("account-exists");
          setExistingAccountEmail(result.existingEmail || session.user.email);
          setMessage(
            `This Google account is already registered. You'll need to sign in with that account instead.`
          );

          // Log out the current session since we don't want to complete this login
          await authClient.signOut();

          // Clear the upgrade flow flags
          sessionStorage.removeItem("anonymousUpgradeUserId");
          sessionStorage.removeItem("isUpgradeFlow");

          return;
        }

        // Account doesn't exist, proceed with upgrade
        const upgradeResponse = await fetch(
          `${BASE_URL}/api/complete-oauth-upgrade`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              provider: "google",
              anonymousUserId: anonymousUserId,
              oauthAccountId: session.user.id,
              oauthEmail: session.user.email,
            }),
          }
        );

        if (!upgradeResponse.ok) {
          const errorData = await upgradeResponse.json();
          throw new Error(errorData.message || "Failed to upgrade account");
        }

        const upgradeResult = await upgradeResponse.json();

        if (upgradeResult.success) {
          setStatus("success");
          setMessage(
            "Account upgraded successfully! Your guest progress has been saved permanently."
          );

          // Clear the upgrade flow flags
          sessionStorage.removeItem("anonymousUpgradeUserId");
          sessionStorage.removeItem("isUpgradeFlow");

          // Redirect to home after a short delay
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(upgradeResult.message || "Account upgrade failed");
        }
      } catch (error) {
        console.error("Upgrade callback error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    };

    handleUpgradeCallback();
  }, [session, router]);

  const handleTryAgain = () => {
    // Clear the upgrade flow flags
    sessionStorage.removeItem("anonymousUpgradeUserId");
    sessionStorage.removeItem("isUpgradeFlow");
    router.push("/");
  };

  const handleSignInInstead = () => {
    // Clear the upgrade flow flags
    sessionStorage.removeItem("anonymousUpgradeUserId");
    sessionStorage.removeItem("isUpgradeFlow");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-orange-400 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-zinc-100 mb-2">
              Processing Account Upgrade
            </h2>
            <p className="text-zinc-400">
              Verifying your Google account and upgrading your guest progress...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-zinc-100 mb-2">
              Upgrade Successful!
            </h2>
            <p className="text-zinc-400 mb-4">{message}</p>
            <Alert className="bg-green-900/20 border-green-700">
              <AlertDescription className="text-green-300">
                🎉 Your guest progress has been permanently saved to your Google
                account!
              </AlertDescription>
            </Alert>
          </>
        )}

        {status === "account-exists" && (
          <>
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-zinc-100 mb-2">
              Account Already Exists
            </h2>
            <p className="text-zinc-400 mb-4">{message}</p>

            <Alert className="bg-yellow-900/20 border-yellow-700 mb-4">
              <AlertDescription className="text-yellow-300">
                <strong>Account found:</strong> {existingAccountEmail}
                <br />
                To access that account, please sign in normally instead of
                upgrading.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                onClick={handleSignInInstead}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Sign In to Existing Account
              </Button>
              <Button
                onClick={handleTryAgain}
                variant="outline"
                className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
              >
                Back to Guest Mode
              </Button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-zinc-100 mb-2">
              Upgrade Failed
            </h2>
            <p className="text-zinc-400 mb-4">{message}</p>

            <Alert className="bg-red-900/20 border-red-700 mb-4">
              <AlertDescription className="text-red-300">
                Don't worry - your guest progress is still safe. You can try
                upgrading again.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleTryAgain}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function UpgradeCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpgradeCallbackContent />
    </Suspense>
  );
}
