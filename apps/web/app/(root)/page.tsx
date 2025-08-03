"use client";

/*
 * Homepage with priority flow:
 * 1. TIMEZONE DIALOG FIRST (required, cannot be skipped)
 *    - Shows when: no timezone OR UTC with timezoneSetExplicitly=false
 *    - Blocks all other dialogs until completed
 *    - Higher z-index (z-60) for priority
 *
 * 2. ONBOARDING WIZARD SECOND (after timezone completion)
 *    - Only shows after timezone is properly set
 *    - Can be skipped if user chooses
 *
 * This ensures users always set their timezone before any other setup.
 */

import { userApi } from "@/services/user-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";

import { useEffect, useState, lazy, Suspense } from "react";
import { TimezoneSelectDialog } from "@/components/timezone-select-dialog";
import { useAnonymousUser } from "@/components/anonymous-login-provider";
import { AnonymousUserBanner } from "@/components/anonymous-user-banner";
import { useSession } from "@/lib/auth-client";
import { queryConfigs } from "@/lib/query-config";
import { OnboardingWizard } from "@/components/onboarding";

// Lazy load heavy components to reduce initial bundle size
const QuestTracker = lazy(
  () => import("@/components/quest-tracking/quest-tracker")
);
const TodaysQuestsCard = lazy(
  () => import("@/components/quest-card/todays-quests-card")
);
const PerformanceChart = lazy(
  () => import("@/components/performance-chart-refined")
);

// Loading skeleton components
const QuestTrackerSkeleton = () => (
  <div className="bg-card/80 border-border/50 backdrop-blur-sm rounded-2xl border p-8 shadow-lg">
    <div className="animate-pulse">
      <div className="h-7 bg-muted rounded-xl w-1/3 mb-6"></div>
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded-xl w-full"></div>
        <div className="h-4 bg-muted rounded-xl w-3/4"></div>
        <div className="h-4 bg-muted rounded-xl w-1/2"></div>
      </div>
    </div>
  </div>
);

const TodaysQuestsSkeleton = () => (
  <div className="bg-card/80 border-border/50 backdrop-blur-sm rounded-2xl border p-6 shadow-lg">
    <div className="animate-pulse">
      <div className="h-6 bg-muted rounded-xl w-1/4 mb-4"></div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-4 w-4 bg-muted rounded-full"></div>
            <div className="h-4 bg-muted rounded-xl flex-1"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PerformanceChartSkeleton = () => (
  <div className="bg-card/80 border-border/50 backdrop-blur-sm rounded-2xl border p-6 shadow-lg">
    <div className="animate-pulse">
      <div className="h-6 bg-muted rounded-xl w-1/3 mb-4"></div>
      <div className="h-96 bg-muted rounded-2xl"></div>
    </div>
  </div>
);

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    select: (data) => {
      return {
        userStats: data.userStats,
      };
    },
    ...queryConfigs.userStats,
  });

  const { isAnonymous } = useAnonymousUser();
  const [showTimezoneDialog, setShowTimezoneDialog] = useState(false);
  const [timezoneCompleted, setTimezoneCompleted] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  useEffect(() => {
    // Check timezone for all users (both authenticated and anonymous)
    if (data?.userStats) {
      const userTimezone = data.userStats.timezone;
      const timezoneSetExplicitly = data.userStats.timezoneSetExplicitly;

      // Only show dialog if:
      // 1. User has no timezone set (null/undefined), OR
      // 2. User has UTC but has never explicitly set their timezone
      if (!userTimezone || (userTimezone === "UTC" && !timezoneSetExplicitly)) {
        setShowTimezoneDialog(true);
        setTimezoneCompleted(false);
      } else {
        // User has timezone properly set
        setTimezoneCompleted(true);
      }
    }
  }, [data?.userStats]);

  const handleTimezoneComplete = () => {
    setShowTimezoneDialog(false);
    setTimezoneCompleted(true);
    // Refresh user stats to get updated timezone
    queryClient.invalidateQueries({ queryKey: ["userStats"] });
  };

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary mb-6 animate-spin shadow-lg shadow-primary/25"></div>
          <p className="text-lg font-bold text-primary">
            Loading your quest journal...
          </p>
        </div>
      </div>
    );

  return (
    <>
      <TimezoneSelectDialog
        open={showTimezoneDialog}
        onOpenChange={() => {}} // Prevent closing via backdrop or escape
        onComplete={handleTimezoneComplete}
        canClose={false} // Force user to complete timezone setup
      />
      {timezoneCompleted && <OnboardingWizard />}
      <div>
        <div className="relative min-h-screen">
          {/* Deep navy background with subtle texture */}
          <div className="pointer-events-none fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzg4ODg4ODA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20 z-0"></div>
          <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#0F111A]/90 via-[#0F111A]/95 to-[#0F111A] z-0"></div>

          <div className="relative z-10 flex h-full w-full flex-col px-6 py-8 md:px-10 md:py-12 max-w-7xl mx-auto">
            {/* Top header section with user profile and sign in button */}

            {/* Character stats section - Compact single-line version */}

            {/* Quests section with decorative elements */}
            <div className="relative">
              {/* Decorative corner elements with amber accent */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-2xl"></div>
              <AnonymousUserBanner />

              {/* <h2 className="text-xl text-center text-white font-medieval mb-6 tracking-wider flex items-center justify-center">
                <Star className="h-5 w-5 mr-2 text-primary" />
                Your Epic Quests
                <Star className="h-5 w-5 ml-2 text-primary" />
              </h2> */}

              <div className="flex flex-col w-full gap-10">
                <Suspense fallback={<QuestTrackerSkeleton />}>
                  <QuestTracker />
                </Suspense>
                <Suspense fallback={<TodaysQuestsSkeleton />}>
                  <TodaysQuestsCard />
                </Suspense>
                <Suspense fallback={<PerformanceChartSkeleton />}>
                  <PerformanceChart />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
