"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LucideIcon,
  CalendarDays,
  Link as LinkIcon,
  Target,
  ArrowRight,
  Flame,
  Compass,
  Check,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { CountdownTimer } from "@/components/timer";
import { MainQuest } from "@questly/types";

interface QuestCardProps {
  quest: MainQuest;
  categoryIcon: LucideIcon;
  progress: number;
  questsCount: number;
  category: string;
  importanceStyle: string;
  index: number;
  onClick: (id: string) => void;
  onComplete: (questId: string, completed: boolean) => void;
  isCompleting?: boolean;
  isExpired?: boolean;
}

export function QuestCard({
  quest,
  categoryIcon: CategoryIcon,
  progress,
  questsCount,
  category,
  importanceStyle,
  index,
  onClick,
  onComplete,
  isCompleting = false,
  isExpired = false,
}: QuestCardProps) {
  // Only animate the first 5 items with delays for better performance
  const shouldDelay = index < 5;

  // Expand/collapse state for attached quests
  const [showLinkedQuests, setShowLinkedQuests] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isCompleting ? 1.05 : 1,
      }}
      transition={{
        duration: 0.4,
        delay: shouldDelay ? index * 0.1 : 0,
        ease: "easeOut",
      }}
      whileHover={{
        scale: isCompleting ? 1.05 : 1.02,
        transition: { duration: 0.2 },
      }}
      className="group"
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer border-0 ${
          isCompleting
            ? "bg-gradient-to-br from-emerald-500/30 via-emerald-600/20 to-emerald-900/30 ring-2 ring-emerald-400/70 shadow-2xl shadow-emerald-500/30"
            : isExpired
              ? "bg-gradient-to-br from-red-900/20 via-black/60 to-black/80 ring-1 ring-red-500/30 hover:ring-red-400/50 opacity-75"
              : quest.completed
                ? "bg-gradient-to-br from-emerald-900/20 via-black/60 to-black/80 ring-1 ring-emerald-500/30 hover:ring-emerald-400/50"
                : "bg-gradient-to-br from-purple-900/10 via-black/60 to-black/80 ring-1 ring-zinc-700/50 hover:ring-purple-500/40"
        }`}
      >
        {/* Completion animation overlay */}
        {isCompleting && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-emerald-500/20 animate-pulse z-10 pointer-events-none"
            />
            {/* Celebration particles */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: "50%",
                    y: "50%",
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: `${50 + Math.cos((i * Math.PI) / 4) * 100}%`,
                    y: `${50 + Math.sin((i * Math.PI) / 4) * 100}%`,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-lg"
                />
              ))}
            </div>
          </>
        )}

        {/* Subtle animated background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isCompleting ? "opacity-100" : ""}`}
        />

        {/* Header with status indicator */}
        <div className="relative">
          <div className="p-6 space-y-4">
            {/* Quest Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4 flex-1 min-w-0">
                {/* Category Icon */}
                <div
                  className={`relative ${
                    isExpired
                      ? "bg-red-500/20 ring-2 ring-red-500/30"
                      : quest.completed
                        ? "bg-emerald-500/20 ring-2 ring-emerald-500/30"
                        : "bg-purple-500/20 ring-2 ring-purple-500/30"
                  } w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-all duration-300`}
                >
                  <CategoryIcon
                    className={`h-7 w-7 ${
                      isExpired
                        ? "text-red-400"
                        : quest.completed
                          ? "text-emerald-400"
                          : "text-purple-400"
                    }`}
                  />
                  {quest.completed && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {isExpired && !quest.completed && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Clock className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Quest Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3
                      className={`text-xl font-bold ${
                        isExpired
                          ? "text-red-200"
                          : quest.completed
                            ? "text-emerald-100"
                            : "text-white"
                      } truncate`}
                    >
                      {quest.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${importanceStyle} shadow-sm`}
                    >
                      {quest.importance}
                    </span>
                    {isExpired && !quest.completed && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600/30 text-red-300 border border-red-700/50 shadow-sm animate-pulse">
                        EXPIRED
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-sm mb-4 leading-relaxed ${
                      isExpired
                        ? "text-red-200/60"
                        : quest.completed
                          ? "text-emerald-200/80"
                          : "text-zinc-300"
                    }`}
                  >
                    {quest.description ||
                      "No description provided for this quest."}
                  </p>

                  {/* Quest Meta Information */}
                  <div className="flex flex-wrap gap-6 text-sm">
                    {quest.dueDate && (
                      <div className="flex items-center gap-2">
                        <Clock
                          className={`w-4 h-4 ${
                            isExpired
                              ? "text-red-400"
                              : quest.completed
                                ? "text-emerald-400"
                                : "text-amber-400"
                          }`}
                        />
                        <span className="text-zinc-400">
                          {isExpired ? "Expired:" : "Due:"}
                        </span>
                        <CountdownTimer
                          targetDate={new Date(quest.dueDate)}
                          className={
                            isExpired
                              ? "text-red-300"
                              : quest.completed
                                ? "text-emerald-300"
                                : "text-amber-300"
                          }
                        />
                      </div>
                    )}

                    <div
                      className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors"
                      onClick={() => setShowLinkedQuests((v) => !v)}
                    >
                      <LinkIcon
                        className={`w-4 h-4 ${
                          isExpired
                            ? "text-red-400"
                            : quest.completed
                              ? "text-emerald-400"
                              : "text-purple-400"
                        }`}
                      />
                      <span className="text-zinc-400">
                        {questsCount} linked quests
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          showLinkedQuests ? "rotate-90" : ""
                        } ${
                          isExpired
                            ? "text-red-400"
                            : quest.completed
                              ? "text-emerald-400"
                              : "text-purple-400"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <CategoryIcon
                        className={`w-4 h-4 ${
                          isExpired
                            ? "text-red-400"
                            : quest.completed
                              ? "text-emerald-400"
                              : "text-purple-400"
                        }`}
                      />
                      <span className="text-zinc-400">{category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Completion Button */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete(quest.id, !quest.completed);
                  }}
                  disabled={isCompleting}
                  className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl transform hover:scale-110 active:scale-95 group/btn ${
                    isCompleting
                      ? "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 ring-4 ring-emerald-300/50 animate-pulse cursor-not-allowed"
                      : isExpired && !quest.completed
                        ? "bg-gradient-to-br from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:via-red-700 hover:to-red-800 ring-2 ring-red-600/50 hover:ring-red-500/70"
                        : quest.completed
                          ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-400 hover:via-emerald-500 hover:to-emerald-600 ring-2 ring-emerald-400/50 hover:ring-emerald-300/70"
                          : "bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 ring-2 ring-zinc-600/50 hover:ring-purple-500/70"
                  }`}
                  title={
                    isCompleting
                      ? "Completing quest..."
                      : quest.completed
                        ? "Mark as incomplete"
                        : "Complete quest"
                  }
                >
                  {isCompleting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-8 w-8"
                    >
                      <CheckCircle2 className="h-8 w-8 text-white drop-shadow-lg" />
                    </motion.div>
                  ) : quest.completed ? (
                    <CheckCircle2 className="h-8 w-8 text-white drop-shadow-lg" />
                  ) : (
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full border-2 border-zinc-400 group-hover/btn:border-white transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-zinc-400 group-hover/btn:bg-white transition-colors opacity-0 group-hover/btn:opacity-100" />
                      </div>
                    </div>
                  )}

                  {/* Enhanced pulse effect for completion */}
                  {isCompleting && (
                    <div className="absolute inset-0 rounded-2xl bg-emerald-400/50 animate-ping" />
                  )}

                  {/* Pulse effect for incomplete quests */}
                  {!quest.completed && !isCompleting && (
                    <div className="absolute inset-0 rounded-2xl bg-purple-500/30 opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-ping transition-opacity" />
                  )}
                </Button>

                <span
                  className={`text-xs font-medium transition-colors ${
                    isCompleting
                      ? "text-emerald-200 animate-pulse"
                      : isExpired && !quest.completed
                        ? "text-red-300"
                        : quest.completed
                          ? "text-emerald-300"
                          : "text-zinc-500 group-hover:text-purple-300"
                  }`}
                >
                  {isCompleting
                    ? "Completing..."
                    : isExpired && !quest.completed
                      ? "Expired"
                      : quest.completed
                        ? "Completed"
                        : "Complete"}
                </span>
              </div>
            </div>
            {/* Linked Quests Section */}
            {showLinkedQuests &&
              Array.isArray(quest.attachedQuests) &&
              quest.attachedQuests.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-zinc-700/50 pt-4 mt-4"
                >
                  <div className="space-y-2">
                    <h4
                      className={`text-sm font-semibold ${
                        isExpired
                          ? "text-red-300"
                          : quest.completed
                            ? "text-emerald-300"
                            : "text-purple-300"
                      } mb-3`}
                    >
                      Linked Quests
                    </h4>
                    {quest.attachedQuests.map((q: any) => (
                      <div
                        key={q.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5 cursor-pointer group/quest ${
                          q.active ? "" : "opacity-60"
                        }`}
                      >
                        {/* Status Indicator */}
                        <div className="relative">
                          {q.isActive ? (
                            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg">
                              <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                            </div>
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          )}
                        </div>

                        {/* Quest Type Icon */}
                        <div
                          className={`p-1.5 rounded-lg ${
                            q.type === "daily"
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {q.type === "daily" ? (
                            <Flame className="w-3.5 h-3.5" />
                          ) : (
                            <Compass className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Quest Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-sm font-medium truncate ${
                                q.isActive ? "text-zinc-200" : "text-zinc-500"
                              }`}
                            >
                              {q.title}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                                q.importance === "High"
                                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                  : q.importance === "Medium"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30"
                              }`}
                            >
                              {q.importance}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            {/* Action Footer */}
            <div className="flex justify-end pt-4 border-t border-zinc-700/30">
              <Button
                onClick={() => onClick(quest.id)}
                variant="outline"
                className={`group/action transition-all duration-300 ${
                  isExpired
                    ? "bg-red-900/20 border-red-700/50 hover:bg-red-800/30 hover:border-red-600/60 text-red-300 hover:text-red-200"
                    : quest.completed
                      ? "bg-emerald-900/20 border-emerald-700/50 hover:bg-emerald-800/30 hover:border-emerald-600/60 text-emerald-300 hover:text-emerald-200"
                      : "bg-purple-900/20 border-purple-700/50 hover:bg-purple-800/30 hover:border-purple-600/60 text-purple-300 hover:text-purple-200"
                } shadow-lg hover:shadow-xl`}
              >
                <Target className="w-4 h-4 mr-2" />
                <span className="font-medium">View Details</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover/action:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
