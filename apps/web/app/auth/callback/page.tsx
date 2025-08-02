"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userApi } from "@/services/user-api";
import { TimezoneSelectDialog } from "@/components/timezone-select-dialog";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showTimezoneDialog, setShowTimezoneDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);

  // Handle callback on mount
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const shouldShowTimezone = searchParams.get("showTimezone") === "true";

        if (shouldShowTimezone) {
          // Check if user already has timezone set explicitly
          try {
            const userData = await userApi.getUserStats();
            if (
              !userData.userStats?.timezone ||
              !userData.userStats?.timezoneSetExplicitly
            ) {
              setShowTimezoneDialog(true);
              setIsProcessing(false);
              return; // Don't redirect yet
            }
          } catch (err) {
            console.error("Failed to fetch user profile:", err);
          }
        }

        // If we don't need to show timezone dialog, redirect to home
        router.push("/");
      } catch (error) {
        console.error("Authentication callback error:", error);
        router.push("/login?error=callback-failed");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  // Handle timezone selection completion
  const handleTimezoneComplete = () => {
    router.push("/");
  };

  // Show a loading state while processing
  if (isProcessing && !showTimezoneDialog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-zinc-200">
            Opening your adventure log...
          </h2>
          <p className="mt-2 text-zinc-400">
            Just a moment while we prepare your quests.
          </p>
        </div>
      </div>
    );
  }

  // Render just the dialog if needed
  return (
    <TimezoneSelectDialog
      open={showTimezoneDialog}
      onOpenChange={setShowTimezoneDialog}
      onComplete={handleTimezoneComplete}
    />
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
