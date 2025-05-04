"use client";

import MainQuestCard from "@/components/main-quest/main-quest-card";
import TodaysQuestsCard from "@/components/quest-card/todays-quests-card";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/config";
import { authClient, useSession } from "@/lib/auth-client";
import { userApi } from "@/services/user-api";
import { useQuery } from "@tanstack/react-query";
import {
  Shield,
  Swords,
  Zap,
  Award,
  Star,
  Crown,
  ScrollText,
} from "lucide-react";
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

        {/* Character stats section */}
        <div className="w-full p-4 mb-8 bg-gradient-to-r from-zinc-900/80 via-zinc-900/60 to-zinc-900/80 rounded-xl border border-zinc-800/50 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 ring-2 ring-amber-500/50 shadow-lg flex items-center justify-center">
                {session && session.user && session.user?.image ? (
                  <Image
                    src={session.user?.image || ""}
                    width={80}
                    height={80}
                    alt="Profile"
                    className="rounded-full h-full w-full object-cover"
                  />
                ) : (
                  <Crown className="h-6 w-6 md:h-8 md:w-8 text-amber-400" />
                )}
              </div>

              <div className="ml-4">
                <h1 className="text-xl md:text-2xl font-bold text-white font-medieval tracking-wide">
                  {session
                    ? session.user?.name || "Adventurer"
                    : "Noble Adventurer"}
                </h1>
                <p className="text-amber-500/90 text-sm">
                  Level {userStats.levelStats.level} {userStats.characterClass}
                </p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-3 bg-black/30 rounded-lg border border-zinc-800/70">
              <div className="flex">
                <Zap className="h-6 w-6 text-yellow-500 mb-1" />
                <span>+{userStats.todaysXp}</span>
              </div>

              <span className="text-sm text-zinc-400">Experience</span>
              <div className="mt-1 w-full bg-zinc-800/50 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                  style={{
                    width: `${userStats.levelStats.progressPercent}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-amber-500/90 mt-1">
                {userStats.levelStats.currentLevelXp}/
                {userStats.levelStats.xpForThisLevel} XP
              </span>
            </div>

            <div className="flex flex-col items-center p-3 bg-black/30 rounded-lg border border-zinc-800/70">
              <Shield className="h-6 w-6 text-blue-500 mb-1" />
              <span className="text-zinc-400 text-sm">Daily Streak</span>
              <span className="text-blue-400 text-xl font-bold">
                {userStats.streak} days
              </span>
            </div>

            <div className="flex flex-col items-center p-3 bg-black/30 rounded-lg border border-zinc-800/70">
              <Swords className="h-6 w-6 text-purple-500 mb-1" />
              <span className="text-zinc-400 text-sm">Class Ability</span>
              <span className="text-purple-400 text-lg font-bold">
                Time Warp
              </span>
            </div>

            <div className="flex flex-col items-center p-3 bg-black/30 rounded-lg border border-zinc-800/70">
              <Award className="h-6 w-6 text-emerald-500 mb-1" />
              <span className="text-zinc-400 text-sm">Achievements</span>
              <span className="text-emerald-400 text-xl font-bold">
                {userStats.achievements}
              </span>
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
