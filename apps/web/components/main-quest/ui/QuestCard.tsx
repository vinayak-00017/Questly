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
}: QuestCardProps) {
  // Only animate the first 5 items with delays for better performance
  const shouldDelay = index < 5;

  // Expand/collapse state for attached quests
  const [showLinkedQuests, setShowLinkedQuests] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: shouldDelay ? index * 0.1 : 0,
      }}
      whileHover={{
        scale: 1.01, // Reduced scale factor for better performance
        transition: { duration: 0.2 },
      }}
    >
      <Card className="bg-black/50 border-zinc-800/50 hover:border-purple-500/30 transition-all cursor-pointer p-0 overflow-hidden group">
        <div className="relative">
          {/* Progress bar at the top */}
          <div className="absolute top-0 left-0 h-1 bg-purple-900/50 w-full">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Corner elements */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-purple-500/30 group-hover:border-purple-500/60 transition-colors"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-purple-500/30 group-hover:border-purple-500/60 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-purple-500/30 group-hover:border-purple-500/60 transition-colors"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-500/30 group-hover:border-purple-500/60 transition-colors"></div>

          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="bg-black/40 w-12 h-12 rounded-full flex items-center justify-center shadow-md ring-1 ring-purple-500/30 flex-shrink-0">
                  <CategoryIcon className="h-6 w-6 text-purple-400" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-medieval text-white">
                      {quest.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${importanceStyle}`}
                    >
                      {quest.importance}
                    </span>
                    {quest.completed && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/30 text-green-300 border border-green-700/50">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm mb-2">
                    {quest.description ||
                      "No description provided for this quest."}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                    {quest.dueDate && (
                      <div className="flex items-center  gap-2">
                        <CalendarDays className="w-4 h-4 text-purple-400" />
                        <span>Due: </span>
                        <div>
                          <CountdownTimer
                            targetDate={new Date(quest.dueDate)}
                            className="text-amber-300"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <div
                        className="flex items-center gap-2 cursor-pointer select-none"
                        onClick={() => setShowLinkedQuests((v) => !v)}
                      >
                        <LinkIcon className="w-4 h-4 text-purple-400" />
                        <span>{questsCount} quests linked</span>
                        <ArrowRight
                          className={`w-4 h-4 ml-1 transition-transform ${showLinkedQuests ? "rotate-90" : ""}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-4 h-4 text-purple-400" />
                      <span>{category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold font-medieval">
                      {0}%
                    </span>
                  </div>
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      className="text-zinc-800"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="35"
                      cx="40"
                      cy="40"
                    />
                    <circle
                      className="text-purple-500"
                      strokeWidth="6"
                      strokeDasharray={35 * 2 * Math.PI}
                      strokeDashoffset={35 * 2 * Math.PI * (1 - 0 / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="35"
                      cx="40"
                      cy="40"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {showLinkedQuests &&
              Array.isArray(quest.attachedQuests) &&
              quest.attachedQuests.length > 0 && (
                <div className="w-full mt-2 pl-6">
                  {quest.attachedQuests.map((q: any) => (
                    <div
                      key={q.id}
                      className={`flex items-center gap-2 py-1 p-2 rounded transition-colors hover:bg-purple-900/40 cursor-pointer ${q.active ? "" : "opacity-60"}`}
                    >
                      {/* Status dot */}
                      <span className="flex items-center justify-center mr-1">
                        {q.isActive ? (
                          <span
                            className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"
                            title="Active"
                          ></span>
                        ) : (
                          <span
                            className="inline-block w-2 h-2 rounded-full bg-red-500"
                            title="Inactive"
                          ></span>
                        )}
                      </span>
                      {/* Importance tag */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium mr-1 ${q.importance === "High" ? "bg-red-600/30 text-red-300 border border-red-700/50" : q.importance === "Medium" ? "bg-yellow-600/30 text-yellow-300 border border-yellow-700/50" : "bg-zinc-700/30 text-zinc-300 border border-zinc-700/50"}`}
                      >
                        {q.importance}
                      </span>
                      {/* Type icon */}
                      {q.type === "daily" ? (
                        <span title="Daily">
                          <Flame className="w-4 h-4 text-orange-500" />
                        </span>
                      ) : q.type === "side" ? (
                        <span title="Side">
                          <Compass className="w-4 h-4 text-blue-500" />
                        </span>
                      ) : null}
                      {/* Quest title */}
                      <span
                        className={`${q.isActive ? "`text-zinc-100 text-sm " : "text-zinc-500"}`}
                      >
                        {q.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                className="text-sm bg-black/30 border-zinc-700/50 hover:bg-black/50 hover:border-purple-500/50 text-zinc-300 group-hover:text-white transition-all"
              >
                <span>View Quest Details</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
