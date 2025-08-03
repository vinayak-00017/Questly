import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import { UserStats } from "./types";

interface UserAvatarProps {
  session: any;
  userStats: UserStats;
  onClick: () => void;
}

export function UserAvatar({ session, userStats, onClick }: UserAvatarProps) {
  const [isClient, setIsClient] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const shouldShowImage = isClient && session?.user?.image && !imageError;

  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#f1c40f] to-[#8e44ad] ring-2 ring-[#f1c40f]/50 shadow-lg flex items-center justify-center hover:shadow-xl hover:shadow-[#f1c40f]/25 transition-all duration-300">
        {shouldShowImage ? (
          <Image
            src={session.user.image}
            width={80}
            height={80}
            alt="Profile"
            className="rounded-full h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Crown className="h-6 w-6 text-[#f1c40f]" />
        )}
      </div>
      <div>
        <h1 className="text-lg font-bold text-white font-medieval tracking-wide">
          {isClient && session
            ? session.user?.name || "Adventurer"
            : "Noble Adventurer"}
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#a1a1aa] hover:text-[#f1c40f] transition-colors font-light">
            Level {userStats.levelStats.level} {userStats.characterClass}
          </span>
          <div className="h-3 w-3 rounded-full bg-[#f1c40f]/30"></div>
        </div>
      </div>
    </div>
  );
}
