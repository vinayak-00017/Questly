"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Flame,
  Star,
  Trophy,
  Clock,
  MapPin,
  User,
  Crown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock topbar data similar to app-topbar.tsx
const mockUserStats = {
  currentXp: 2847,
  nextLevelXp: 3000,
  todaysXp: 125,
  streak: 7,
  level: 12,
  timezone: "PST",
  username: "QuestMaster",
  avatar: null,
};

const mockRankData = {
  name: "Adventurer",
  icon: "⚔️",
  color: "#3b82f6",
  auraIntensity: 0.8,
};

// Topbar-style components based on app-topbar.tsx
const UserAvatarDemo = () => {
  return (
    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg border-2 border-amber-300/30">
          <User className="w-5 h-5" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {mockUserStats.level}
        </div>
      </div>
      <div className="hidden md:block">
        <div className="text-sm font-medium text-white">{mockUserStats.username}</div>
        <div className="text-xs text-zinc-400">Level {mockUserStats.level}</div>
      </div>
    </div>
  );
};

const XpProgressDemo = () => {
  const [animatedXp, setAnimatedXp] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedXp(mockUserStats.currentXp);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const xpProgress = (animatedXp / mockUserStats.nextLevelXp) * 100;

  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>XP</span>
        <span>{animatedXp.toLocaleString()} / {mockUserStats.nextLevelXp.toLocaleString()}</span>
      </div>
      <div className="w-full bg-zinc-700 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${xpProgress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const TodaysXpCounterDemo = () => {
  const [animatedTodaysXp, setAnimatedTodaysXp] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedTodaysXp(mockUserStats.todaysXp);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-green-500/20 px-3 py-2 rounded-lg border border-green-500/30">
      <Zap className="w-4 h-4 text-green-400" />
      <div className="flex flex-col">
        <span className="text-green-300 font-medium text-sm">+{animatedTodaysXp}</span>
        <span className="text-green-400/70 text-xs">Today</span>
      </div>
    </div>
  );
};

const StreakCounterDemo = () => {
  return (
    <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-2 rounded-lg border border-orange-500/30">
      <Flame className="w-4 h-4 text-orange-400" />
      <div className="flex flex-col">
        <span className="text-orange-300 font-medium text-sm">{mockUserStats.streak}</span>
        <span className="text-orange-400/70 text-xs">Streak</span>
      </div>
    </div>
  );
};

const RankDisplayDemo = () => {
  return (
    <div 
      className="relative flex items-center gap-2 bg-blue-500/20 px-3 py-2 rounded-lg border border-blue-500/30 cursor-pointer hover:bg-blue-500/30 transition-colors"
      style={{
        boxShadow: `0 0 ${mockRankData.auraIntensity * 20}px ${mockRankData.color}40`,
      }}
    >
      <motion.div
        className="text-lg"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {mockRankData.icon}
      </motion.div>
      <div className="flex flex-col">
        <span className="text-blue-300 font-medium text-sm">{mockRankData.name}</span>
        <span className="text-blue-400/70 text-xs">Rank</span>
      </div>
    </div>
  );
};

const TimezoneIndicatorDemo = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-zinc-400 text-sm">
      <MapPin className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-zinc-300">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="text-xs">{mockUserStats.timezone}</span>
      </div>
    </div>
  );
};

// Main Topbar-style Stats Preview
export const TopbarStatsPreview = () => {
  return (
    <div className="space-y-6">
      {/* Topbar Layout */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo and User Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                Q
              </div>
              <span className="text-white font-semibold hidden md:block">Questly</span>
            </div>
            
            <UserAvatarDemo />
            
            {/* XP Progress - Only visible on medium screens and up */}
            <div className="hidden md:flex items-center gap-4">
              <XpProgressDemo />
              <TodaysXpCounterDemo />
              <StreakCounterDemo />
              <RankDisplayDemo />
            </div>
          </div>

          {/* Right Section: Timezone */}
          <div className="flex items-center gap-4">
            <TimezoneIndicatorDemo />
          </div>
        </div>
      </div>

      {/* Individual Component Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-zinc-300">Weekly Goal</span>
          </div>
          <div className="text-2xl font-bold text-amber-300">85%</div>
          <div className="text-xs text-zinc-400">Target: 80%</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-zinc-300">Best Streak</span>
          </div>
          <div className="text-2xl font-bold text-blue-300">21</div>
          <div className="text-xs text-zinc-400">Days in a row</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-zinc-300">Avg Session</span>
          </div>
          <div className="text-2xl font-bold text-green-300">2.5h</div>
          <div className="text-xs text-zinc-400">Per day</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-zinc-300">Total XP</span>
          </div>
          <div className="text-2xl font-bold text-purple-300">15.2k</div>
          <div className="text-xs text-zinc-400">All time</div>
        </div>
      </div>
    </div>
  );
};