"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { UserAvatar } from "./topbar/user-avatar";
import { XpProgress } from "./topbar/xp-progress";
import { TodaysXpCounter } from "./topbar/todays-xp-counter";
import { StreakCounter } from "./topbar/streak-counter";
import { RankDisplay } from "./topbar/rank-display";
import { TimezoneIndicator } from "./topbar/timezone-indicator";
import { useTopbarData } from "./topbar/hooks/use-topbar-data";
import Image from "next/image";

export default function AppTopbar({ className }: { className?: string }) {
  const router = useRouter();
  const {
    session,
    userStats,
    rank,
    rankIcon,
    rankColor,
    auraIntensity,
    streakDisplay,
    animationKey,
  } = useTopbarData();

  const handleSignUp = () => {
    router.push("/register");
  };

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 z-50 backdrop-blur-sm border-b border-zinc-800/50 bg-white/80 dark:bg-neutral-900/80",
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section: Logo and User Info */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center">
            <Image
              className="h-8 w-8"
              width={50}
              height={50}
              src={"/q_tp.png"}
              alt="questly"
            />
          </a>

          <UserAvatar
            session={session}
            userStats={userStats}
            onClick={() => router.push("/profile")}
          />

          {/* XP Progress - Only visible on medium screens and up */}
          {session && (
            <div className="hidden md:flex items-center gap-3">
              <XpProgress userStats={userStats} />
              <TodaysXpCounter userStats={userStats} />
              <StreakCounter
                userStats={userStats}
                streakDisplay={streakDisplay}
              />
              <RankDisplay
                rank={rank}
                rankIcon={rankIcon}
                rankColor={rankColor}
                auraIntensity={auraIntensity}
                animationKey={animationKey}
                onClick={() => router.push("/ranks")}
              />
            </div>
          )}
        </div>

        {/* Right Section: User Info and Profile */}
        <div className="flex items-center gap-3">
          {session && <TimezoneIndicator userStats={userStats} />}

          {!session && (
            <Button
              onClick={handleSignUp}
              size="sm"
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 border-none shadow-lg shadow-amber-900/30 transition-all duration-300"
            >
              Begin Your Journey
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
