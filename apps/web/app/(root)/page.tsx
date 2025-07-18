"use client";

import TodaysQuestsCard from "@/components/quest-card/todays-quests-card";
import PerformanceChart from "@/components/performance-chart";

import QuestTracker from "@/components/quest-tracking/quest-tracker";

import { userApi } from "@/services/user-api";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";

import { useEffect, useState } from "react";
import { TimezoneSelectDialog } from "@/components/timezone-select-dialog";
import { useAnonymousUser } from "@/components/anonymous-login-provider";
import { AnonymousUserBanner } from "@/components/anonymous-user-banner";

export default function Home() {
  const { isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    select: (data) => {
      return {
        userStats: data.userStats,
      };
    },
  });

  const { isAnonymous } = useAnonymousUser();
  const [showTimezoneDialog, setShowTimezoneDialog] = useState(false);

  useEffect(() => {
    async function checkTimezone() {
      if (isAnonymous) {
        const data = await userApi.getUserStats();
        if (!data.userStats?.timezone || data.userStats?.timezone === "UTC") {
          setShowTimezoneDialog(true);
        }
      }
    }
    checkTimezone();
  }, [isAnonymous]);

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 mb-4 animate-spin"></div>
          <p className="text-lg font-medieval text-amber-500">
            Loading your quest journal...
          </p>
        </div>
      </div>
    );

  return (
    <>
      <TimezoneSelectDialog
        open={showTimezoneDialog}
        onOpenChange={setShowTimezoneDialog}
        onComplete={() => setShowTimezoneDialog(false)}
      />
      <div>
        <div className="relative min-h-screen">
          {/* Fantasy background overlay with subtle texture */}
          <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzg4ODg4ODA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-30 z-0"></div>
          <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-900/70 to-black/90 z-0"></div>

          <div className="relative z-10 flex h-full w-full flex-col px-4 py-6 md:px-8 md:py-8 max-w-6xl mx-auto">
            {/* Top header section with user profile and sign in button */}

            {/* Character stats section - Compact single-line version */}

            {/* Quests section with decorative elements */}
            <div className="relative">
              {/* Decorative corner elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/30 rounded-tl-lg"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/30 rounded-br-lg"></div>
              <AnonymousUserBanner />

              <h2 className="text-xl text-center text-white font-medieval mb-6 tracking-wider flex items-center justify-center">
                <Star className="h-5 w-5 mr-2 text-amber-500" />
                Your Epic Quests
                <Star className="h-5 w-5 ml-2 text-amber-500" />
              </h2>

              <div className="flex flex-col w-full gap-8">
                <QuestTracker />
                <TodaysQuestsCard />
                <PerformanceChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
