"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Edit3, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileHeaderProps {
  session: any;
  userStats: any;
  onProfileUpdate?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  session,
  userStats,
  onProfileUpdate,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const levelStats = userStats?.levelStats || {};
  const level = levelStats.level || 1;
  const currentLevelXp = levelStats.currentLevelXp || 0;
  const xpForThisLevel = levelStats.xpForThisLevel || 100;
  const progressPercent = levelStats.progressPercent || 0;

  // Character class based on level
  const getCharacterClass = (level: number) => {
    if (level >= 50) return "Legendary Hero";
    if (level >= 30) return "Master Adventurer";
    if (level >= 20) return "Veteran Explorer";
    if (level >= 10) return "Skilled Wanderer";
    if (level >= 5) return "Brave Novice";
    return "New Adventurer";
  };

  // Level color based on level range
  const getLevelColor = (level: number) => {
    if (level >= 50) return "text-orange-400";
    if (level >= 30) return "text-purple-400";
    if (level >= 20) return "text-blue-400";
    if (level >= 10) return "text-green-400";
    return "text-amber-400";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-black/60 to-black/40 border border-purple-800/30 shadow-2xl overflow-hidden">
          {/* Decorative top border */}
          <div className="h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500"></div>

          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-amber-500/20 rounded-full blur-xl"></div>
                <Avatar className="w-32 h-32 border-4 border-purple-500/50 shadow-2xl relative z-10">
                  <AvatarImage
                    src={session.user?.image || ""}
                    alt={session.user?.name || "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-amber-600 text-white text-4xl font-bold">
                    {session.user?.name?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                {/* Level badge */}
                <div className="z-50 absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg border-2 border-amber-500/50">
                  Lv.{level}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4">
                  <h1 className="text-4xl font-medieval font-bold text-white mb-2 flex items-center justify-center lg:justify-start gap-3">
                    {session.user?.name || "Noble Adventurer"}
                    <Crown className={cn("h-8 w-8", getLevelColor(level))} />
                  </h1>
                  <p
                    className={cn(
                      "text-xl font-semibold",
                      getLevelColor(level)
                    )}
                  >
                    {getCharacterClass(level)}
                  </p>
                  <p className="text-zinc-400 text-sm mt-1">
                    Joined the realm on{" "}
                    {new Date(
                      session.user?.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>

                {/* XP Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Experience Progress</span>
                    <span className="text-amber-500 font-semibold">
                      {currentLevelXp.toLocaleString()} /{" "}
                      {xpForThisLevel.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800/70 h-3 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 transition-all duration-1000 ease-out shadow-glow"
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {Math.round(progressPercent)}% complete to next level
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-900/30 border-purple-700/50 text-purple-300 hover:bg-purple-800/50 transition-all duration-300"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-amber-900/30 border-amber-700/50 text-amber-300 hover:bg-amber-800/50 transition-all duration-300"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        session={session}
        userStats={userStats}
        onProfileUpdate={onProfileUpdate}
      />

      {/* Custom CSS for glowing effects */}
      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
        }
      `}</style>
    </>
  );
};
