"use client";
import React, { useState, useEffect } from "react";
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
  const [isClient, setIsClient] = useState(false);
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignUp = () => {
    router.push("/register");
  };

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 z-50 backdrop-blur-sm border-b border-[#3d3d5c]/50 bg-white/80 dark:bg-[#2a2a3d]/80",
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section: Logo and User Info */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
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
          {isClient && session && (
            <div className="hidden md:flex items-center gap-6">
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
        <div className="flex items-center gap-4">
          {isClient && session && <TimezoneIndicator userStats={userStats} />}

          {isClient && !session && (
            <Button
              onClick={handleSignUp}
              size="sm"
              className="bg-gradient-to-r from-[#f1c40f] to-[#f39c12] text-white hover:from-[#f39c12] hover:to-[#e67e22] border-none shadow-lg shadow-[#f1c40f]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#f1c40f]/40 px-6 py-3 font-semibold"
            >
              Begin Your Journey
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
