"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { authClient, useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import {
  Shield,
  Zap,
  User,
  LogOut,
  Award,
  ChevronDown,
  Trophy,
  Crown,
  UserCheck,
  Clock,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAnonymousUser } from "./anonymous-login-provider";
import { motion } from "framer-motion";

export default function AppTopbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const { isAnonymous } = useAnonymousUser();
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    select: (data) => ({ userStats: data.userStats }),
    enabled: !!session,
  });

  const userStats = data?.userStats || {
    levelStats: {
      level: 1,
      currentLevelXp: 0,
      xpForThisLevel: 100,
      progressPercent: 0,
    },
    todaysXp: 0,
    streak: 0,
    isActiveToday: false,
    characterClass: "Adventurer",
    timezone: "UTC",
  };

  const handleSignUp = () => {
    router.push("/register");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  // Helper function to format timezone display
  const formatTimezone = (timezone: string) => {
    if (!timezone) return "UTC";

    // Extract city name from timezone (e.g., "America/New_York" -> "New York")
    const parts = timezone.split("/");
    const city = parts[parts.length - 1];
    return city.replace(/_/g, " ");
  };

  // Helper function to get streak display
  const getStreakDisplay = () => {
    if (userStats.streak === 0) {
      return {
        icon: "🌱",
        text: "Start today!",
        color: "text-zinc-500",
        bgColor: "bg-zinc-500/20",
        borderColor: "border-zinc-600/20",
      };
    } else if (userStats.streak >= 30) {
      return {
        icon: "🏆",
        text: `${userStats.streak} days`,
        color: "text-purple-300",
        bgColor: "bg-purple-500/20",
        borderColor: "border-purple-600/20",
      };
    } else if (userStats.streak >= 7) {
      return {
        icon: "🔥",
        text: `${userStats.streak} days`,
        color: "text-orange-300",
        bgColor: "bg-orange-500/20",
        borderColor: "border-orange-600/20",
      };
    } else {
      return {
        icon: "🔥",
        text: `${userStats.streak} ${userStats.streak === 1 ? "day" : "days"}`,
        color: "text-blue-300",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-600/20",
      };
    }
  };

  const streakDisplay = getStreakDisplay();

  return (
    <div
      className={cn(
        "top-0 inset-x-0 z-50 backdrop-blur-sm border-b border-zinc-800/50",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Left Section: Logo and Navigation */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/profile")}
          >
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
                  Level {userStats.levelStats.level} {userStats.characterClass}
                </span>
                <div className="h-3 w-3 rounded-full bg-amber-500/30"></div>
              </div>
            </div>
          </div>
          {/* XP Progress - Only visible on medium screens and up */}
          {session && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex flex-col justify-center w-36">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">XP</span>
                  <span className="text-amber-500/90">
                    {userStats.levelStats.currentLevelXp}/
                    {userStats.levelStats.xpForThisLevel}
                  </span>
                </div>
                <div className="w-full bg-zinc-800/70 h-1.5 rounded-full overflow-hidden shadow-inner shadow-black/40">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 relative progress-bar"
                    style={{
                      width: `${userStats.levelStats.progressPercent}%`,
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 bottom-0 shimmer"></div>
                  </div>
                </div>
              </div>

              {/* Today's XP Counter - Improved UI */}
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 px-3 py-2 rounded-lg border border-yellow-600/20 shadow-inner shadow-yellow-500/5 hover:scale-105 transition-all duration-300">
                <div className="h-6 w-6 flex items-center justify-center bg-yellow-500/20 rounded-full">
                  <Zap className="h-3.5 w-3.5 text-yellow-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-xs leading-tight">
                    Today
                  </span>
                  <span className="text-yellow-200 text-sm font-medium">
                    +{userStats.todaysXp} XP
                  </span>
                </div>
              </div>

              {/* Enhanced Streak Counter */}
              <div
                className={`flex items-center gap-2.5 bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 px-3 py-2 rounded-lg border ${streakDisplay.borderColor} shadow-inner shadow-orange-500/5 hover:scale-105 transition-all duration-300 relative`}
              >
                <div
                  className={`h-6 w-6 flex items-center justify-center ${streakDisplay.bgColor} rounded-full`}
                >
                  <span className="text-xs">{streakDisplay.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-xs leading-tight">
                    {userStats.streak > 0 ? "Streak" : "No Streak"}
                  </span>
                  <span
                    className={`text-sm font-medium ${streakDisplay.color}`}
                  >
                    {streakDisplay.text}
                  </span>
                </div>
                {/* Active today indicator */}
                {userStats.isActiveToday && userStats.streak > 0 && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">✓</span>
                  </div>
                )}
                {/* Milestone indicator for 7+ day streaks */}
                {userStats.streak >= 7 && !userStats.isActiveToday && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">★</span>
                  </div>
                )}
              </div>

              {/* Rank - Improved UI */}
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 px-3 py-2 rounded-lg border border-purple-600/20 shadow-inner shadow-purple-500/5 hover:scale-105 transition-all duration-300">
                <div className="h-6 w-6 flex items-center justify-center bg-purple-500/20 rounded-full">
                  <Trophy className="h-3.5 w-3.5 text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-xs leading-tight">
                    Rank
                  </span>
                  <span className="text-purple-300 text-sm font-medium">
                    Apprentice
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu - Uncomment when ready to use */}
          {/* <Menu setActive={setActive} className="hidden md:flex">
            <MenuItem setActive={setActive} active={active} item="Quests">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/daily-quests">Daily Quests</HoveredLink>
                <HoveredLink href="/main-quests">Main Quests</HoveredLink>
                <HoveredLink href="/achievements">Achievements</HoveredLink>
                <HoveredLink href="/leaderboard">Leaderboard</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Guild">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/teams">Teams</HoveredLink>
                <HoveredLink href="/members">Members</HoveredLink>
                <HoveredLink href="/challenges">Challenges</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Treasury">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/rewards">Rewards</HoveredLink>
                <HoveredLink href="/inventory">Inventory</HoveredLink>
                <HoveredLink href="/shop">Shop</HoveredLink>
              </div>
            </MenuItem>
          </Menu> */}
        </div>

        {/* Right Section: User Info and Profile */}
        <div className="flex items-center gap-3">
          {/* Timezone Indicator */}
          {session && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 px-3 py-2 rounded-lg border border-zinc-600/20 shadow-inner shadow-zinc-500/5 hover:scale-105 transition-all duration-300">
              <div className="h-5 w-5 flex items-center justify-center bg-zinc-500/20 rounded-full">
                <Clock className="h-3 w-3 text-zinc-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-400 text-xs leading-tight">
                  Timezone
                </span>
                <span className="text-zinc-300 text-sm font-medium">
                  {formatTimezone(userStats.timezone)}
                </span>
              </div>
            </div>
          )}

          {/* User Profile Button and Hover Card */}
          {/* {isAnonymous && (
            <div className="flex space-x-2">
              <Button
                onClick={handleSignIn}
                variant="outline"
                size="sm"
                className="border-amber-500/30 text-amber-400"
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Sign In
              </Button>
              <motion.div
                whileHover={{
                  scale: 1.07,
                  boxShadow: "0 4px 24px 0 rgba(168,85,247,0.15)",
                }}
                whileTap={{ scale: 0.96 }}
                style={{ display: "inline-block" }}
              >
                <Button
                  onClick={handleSignUp}
                  size="sm"
                  className="bg-gradient-to-r from-amber-500 to-purple-500 text-black"
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Create Account
                </Button>
              </motion.div>
            </div>
          )} */}
          {session ? (
            <></>
          ) : (
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
