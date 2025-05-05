"use client";

import MainQuestCard from "@/components/main-quest/main-quest-card";
import TodaysQuestsCard from "@/components/quest-card/todays-quests-card";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/config";
import { authClient, useSession } from "@/lib/auth-client";
import { userApi } from "@/services/user-api";
import { useQuery } from "@tanstack/react-query";
import { Shield, Swords, Zap, Award, Star, Crown } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { data: session, isPending } = useSession();

  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    select: (data) => {
      return {
        userStats: data.userStats,
      };
    },
  });
  const { userStats } = data || { userStats: { levelStats: {}, todaysXp: 0 } };

  const handleXp = async () => {
    await fetch(`${BASE_URL}/user/calculateDailyXp  `, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  };

  const userStatsDemo = {
    level: 12,
    xp: 3450,
    nextLevelXp: 4000,
    streak: 7,
    achievements: 14,
    characterClass: "Wizard",
  };

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
    <div className="relative min-h-screen">
      {/* Fantasy background overlay with subtle texture */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzg4ODg4ODA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-30 z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-900/70 to-black/90 z-0"></div>

      <div className="relative z-10 flex h-full w-full flex-col px-4 py-6 md:px-8 md:py-8 max-w-6xl mx-auto">
        {/* Top header section with user profile and sign in button */}

        {/* Character stats section - Compact single-line version */}
        <div className="w-full p-4 mb-8 bg-gradient-to-r from-zinc-900/80 via-zinc-900/60 to-zinc-900/80 rounded-xl border border-zinc-800/50 shadow-xl">
          <div className="flex items-center justify-between">
            {/* User profile */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 ring-2 ring-amber-500/50 shadow-lg flex items-center justify-center">
                {session && session.user && session.user?.image ? (
                  <Image
                    src={session.user?.image || ""}
                    width={80}
                    height={80}
                    alt="Profile"
                    className="rounded-full h-full w-full object-cover"
                  />
                ) : (
                  <Crown className="h-6 w-6 text-amber-400" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white font-medieval tracking-wide">
                  {session
                    ? session.user?.name || "Adventurer"
                    : "Noble Adventurer"}
                </h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-amber-500/90">
                    Level {userStats.levelStats.level}{" "}
                    {userStats.characterClass}
                  </span>
                  <div className="h-3 w-3 rounded-full bg-amber-500/30"></div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-400">
                      {userStats.streak} day streak
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* XP progress bar and sign in button */}
            <div className="flex items-center gap-3">
              {/* Today's XP above progress bar */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-200 text-sm font-medium">
                    +{userStats.todaysXp} XP today
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 w-48">
                  <div className="w-full bg-zinc-800/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                      style={{
                        width: `${userStats.levelStats.progressPercent}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs whitespace-nowrap text-amber-500/90">
                    {userStats.levelStats.currentLevelXp}/
                    {userStats.levelStats.xpForThisLevel}
                  </span>
                </div>
              </div>

              {!session && (
                <Button
                  onClick={signIn}
                  size="sm"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 border-none shadow-lg shadow-amber-900/30 transition-all duration-300"
                >
                  Begin Your Journey
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quests section with decorative elements */}
        <div className="relative">
          {/* Decorative corner elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/30 rounded-tl-lg"></div>
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/30 rounded-br-lg"></div>

          <h2 className="text-xl text-center text-white font-medieval mb-6 tracking-wider flex items-center justify-center">
            <Star className="h-5 w-5 mr-2 text-amber-500" />
            Your Epic Quests
            <Star className="h-5 w-5 ml-2 text-amber-500" />
          </h2>

          <div className="flex flex-col w-full gap-8">
            <MainQuestCard />
            <TodaysQuestsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
