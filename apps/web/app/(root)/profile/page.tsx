"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import {
  User,
  Trophy,
  Flame,
  Calendar,
  Settings,
  MapPin,
  Star,
  Crown,
  Shield,
  Sword,
  Zap,
  Target,
  Clock,
  Award,
  Scroll,
  Eye,
  Edit3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ProfilePage = () => {
  const { data: session, isPending } = useSession();

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

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-sm">
            Loading your adventurer profile...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
        <Card className="w-full max-w-md bg-black/50 border-zinc-800/50">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <h2 className="text-xl font-medieval text-white mb-2">
              Access Denied
            </h2>
            <p className="text-zinc-400 text-sm">
              Please sign in to view your adventurer profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const levelStats = userStats?.levelStats || {};
  const level = levelStats.level || 1;
  const currentLevelXp = levelStats.currentLevelXp || 0;
  const xpForThisLevel = levelStats.xpForThisLevel || 100;
  const progressPercent = levelStats.progressPercent || 0;
  const todaysXp = userStats?.todaysXp || 0;

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

  const stats = [
    { icon: Trophy, label: "Level", value: level, color: "text-amber-400" },
    {
      icon: Zap,
      label: "Total XP",
      value: (levelStats.totalXpForCurrentLevel || 0) + currentLevelXp,
      color: "text-blue-400",
    },
    {
      icon: Flame,
      label: "Today's XP",
      value: todaysXp,
      color: "text-orange-400",
    },
    {
      icon: Target,
      label: "XP to Next Level",
      value: levelStats.xpToNextLevel || 0,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4 md:p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/5 animate-pulse"
            style={{
              width: `${Math.random() * 10 + 3}px`,
              height: `${Math.random() * 10 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
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
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg border-2 border-amber-500/50">
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
                      className="bg-purple-900/30 border-purple-700/50 text-purple-300 hover:bg-purple-800/50"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-amber-900/30 border-amber-700/50 text-amber-300 hover:bg-amber-800/50"
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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-black/50 border border-zinc-800/50 hover:border-purple-500/30 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-purple-500/30 group-hover:border-purple-500/60 transition-colors"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-purple-500/30 group-hover:border-purple-500/60 transition-colors"></div>

                  <div
                    className={cn(
                      "w-12 h-12 rounded-full bg-black/40 ring-1 ring-white/10 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform",
                      stat.color
                    )}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-zinc-400 text-sm font-medium mb-1">
                    {stat.label}
                  </h3>
                  <p
                    className={cn(
                      "text-2xl font-bold font-medieval",
                      stat.color
                    )}
                  >
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-black/50 border border-zinc-800/50 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-medieval text-white">
                    Recent Achievements
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "First Quest Complete",
                      desc: "Completed your very first quest",
                      icon: Target,
                      color: "text-green-400",
                    },
                    {
                      title: "Level Up!",
                      desc: `Reached level ${level}`,
                      icon: Star,
                      color: "text-amber-400",
                    },
                    {
                      title: "Daily Streak",
                      desc: "Completed quests for 3 days in a row",
                      icon: Flame,
                      color: "text-orange-400",
                    },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/30 hover:border-purple-500/30 transition-colors"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full bg-black/50 flex items-center justify-center",
                          achievement.color
                        )}
                      >
                        <achievement.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm">
                          {achievement.title}
                        </h4>
                        <p className="text-zinc-400 text-xs">
                          {achievement.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Adventure Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-black/50 border border-zinc-800/50 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-medieval text-white">
                    Adventure Timeline
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      event: "Embarked on your quest journey",
                      time: "Today",
                      icon: Scroll,
                    },
                    {
                      event: "Configured timezone settings",
                      time: "Today",
                      icon: MapPin,
                    },
                    {
                      event: "Created account",
                      time: new Date(
                        session.user?.createdAt || Date.now()
                      ).toLocaleDateString(),
                      icon: User,
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600/50 to-blue-600/50 flex items-center justify-center border border-purple-500/30">
                        <item.icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{item.event}</p>
                        <p className="text-zinc-500 text-xs">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-black/50 border border-zinc-800/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-medieval text-white">
                  Adventurer Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Email
                  </label>
                  <p className="text-white bg-zinc-900/50 px-3 py-2 rounded-md border border-zinc-800/50">
                    {session.user?.email || "Not provided"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Timezone
                  </label>
                  <p className="text-white bg-zinc-900/50 px-3 py-2 rounded-md border border-zinc-800/50 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                    {userStats?.timezone || "UTC"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Account Status
                  </label>
                  <p className="text-green-400 bg-zinc-900/50 px-3 py-2 rounded-md border border-zinc-800/50 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Active Adventurer
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Custom CSS for glowing effects */}
      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
          }
        }

        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
