import React from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import { UserStats } from "./types";

interface UserAvatarProps {
  session: any;
  userStats: UserStats;
  onClick: () => void;
}

export function UserAvatar({ session, userStats, onClick }: UserAvatarProps) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={onClick}
    >
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 ring-2 ring-amber-500/50 shadow-lg flex items-center justify-center">
        {session && session.user && session.user?.image ? (
          <Image
            src={session.user.image}
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
  );
}