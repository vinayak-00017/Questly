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
} from "lucide-react";
import { Button } from "./ui/button";

export default function AppTopbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
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
    characterClass: "Adventurer",
  };

  const handleSignUp = () => {
    router.push("/register");
  };

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

              {/* Streak Counter - Improved UI */}
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-zinc-900/80 to-zinc-800/60 px-3 py-2 rounded-lg border border-blue-600/20 shadow-inner shadow-blue-500/5 hover:scale-105 transition-all duration-300">
                <div className="h-6 w-6 flex items-center justify-center bg-blue-500/20 rounded-full">
                  <Shield className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-xs leading-tight">
                    Streak
                  </span>
                  <span className="text-blue-300 text-sm font-medium">
                    {userStats.streak} {userStats.streak === 1 ? "day" : "days"}
                  </span>
                </div>
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
          {/* User Profile Button and Hover Card */}
          {session ? (
            <></>
          ) : (
            // <HoverCard>
            //   <HoverCardTrigger asChild>
            //     <button className="flex items-center gap-2 bg-zinc-900/60 hover:bg-black/70 transition-colors px-2 py-1.5 rounded-full border border-zinc-800/50">
            //       <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 ring-1 ring-amber-500/50 shadow-lg flex items-center justify-center overflow-hidden">
            //         {session.user?.image ? (
            //           <Image
            //             src={session.user.image}
            //             width={32}
            //             height={32}
            //             alt="Profile"
            //             className="h-full w-full object-cover"
            //           />
            //         ) : (
            //           <User className="h-4 w-4 text-amber-400" />
            //         )}
            //       </div>
            //       <span className="text-white text-sm font-medium mr-1 hidden sm:inline-block">
            //         {session.user?.name?.split(" ")[0] || "Adventurer"}
            //       </span>
            //       <ChevronDown className="h-4 w-4 text-zinc-400" />
            //     </button>
            //   </HoverCardTrigger>

            //   <HoverCardContent className="w-72 bg-black/90 border border-zinc-800 text-white shadow-xl p-0 overflow-hidden">
            //     {/* User Header */}
            //     <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 p-4">
            //       <div className="flex items-start gap-3">
            //         <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 ring-2 ring-amber-500/50 shadow-lg flex items-center justify-center overflow-hidden">
            //           {session.user?.image ? (
            //             <Image
            //               src={session.user.image}
            //               width={48}
            //               height={48}
            //               alt="Profile"
            //               className="h-full w-full object-cover"
            //             />
            //           ) : (
            //             <User className="h-6 w-6 text-amber-400" />
            //           )}
            //         </div>
            //         <div className="flex-1">
            //           <h3 className="text-lg font-bold text-white font-medieval tracking-wide">
            //             {session.user?.name || "Adventurer"}
            //           </h3>
            //           <div className="flex items-center gap-2 text-sm">
            //             <span className="text-amber-500/90">
            //               Level {userStats.levelStats.level}{" "}
            //               {userStats.characterClass}
            //             </span>
            //           </div>
            //         </div>
            //       </div>
            //     </div>

            //     <div className="p-4">
            //       {/* XP Progress - Mobile visible */}
            //       <div className="md:hidden flex flex-col gap-1 bg-zinc-900/50 p-2 rounded-md mb-3">
            //         <div className="flex justify-between text-xs">
            //           <span className="text-zinc-400">Experience</span>
            //           <span className="text-amber-500/90">
            //             {userStats.levelStats.currentLevelXp}/
            //             {userStats.levelStats.xpForThisLevel}
            //           </span>
            //         </div>
            //         <div className="w-full bg-zinc-800/70 h-2 rounded-full overflow-hidden">
            //           <div
            //             className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
            //             style={{
            //               width: `${userStats.levelStats.progressPercent}%`,
            //             }}
            //           ></div>
            //         </div>
            //       </div>

            //       {/* Stats */}
            //       <div className="grid grid-cols-2 gap-2 text-sm"></div>

            //       {/* Actions */}
            //       <div className="flex flex-col gap-1 pt-3 mt-3 border-t border-zinc-800/70">
            //         <Button
            //           variant="ghost"
            //           className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/70"
            //         >
            //           <User className="h-4 w-4 mr-2" /> Profile
            //         </Button>
            //         <Button
            //           variant="ghost"
            //           className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/70"
            //         >
            //           <LogOut className="h-4 w-4 mr-2" /> Sign Out
            //         </Button>
            //       </div>
            //     </div>
            //   </HoverCardContent>
            // </HoverCard>
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
