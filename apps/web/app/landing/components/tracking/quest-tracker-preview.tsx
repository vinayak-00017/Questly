"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockTrackedQuests = [
  {
    id: "1",
    title: "Morning Workout",
    type: "daily",
    priority: "daily",
    status: [true, true, false, true, true, false, true],
  },
  {
    id: "2",
    title: "Read 30 Minutes",
    type: "daily",
    priority: "side",
    status: [true, true, true, true, false, true, true],
  },
  {
    id: "3",
    title: "Meditation",
    type: "daily",
    priority: "side",
    status: [false, true, true, true, true, true, true],
  },
  {
    id: "4",
    title: "Code Review",
    type: "weekly",
    priority: "daily",
    status: [true, false, false, true, true, false, false],
  },
];

export const QuestTrackerPreview = () => {
  const [selectedDay, setSelectedDay] = useState(3); // Thursday selected
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-4">
      {/* Date Headers */}
      <div className="grid grid-cols-8 gap-2 text-sm">
        <div className="font-medium text-zinc-400">Quest</div>
        {days.map((day, index) => (
          <div
            key={day}
            className={cn(
              "text-center font-medium cursor-pointer transition-colors rounded px-2 py-1",
              selectedDay === index
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-zinc-400 hover:text-amber-300"
            )}
            onClick={() => setSelectedDay(index)}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Quest Rows */}
      {mockTrackedQuests.map((quest, questIndex) => (
        <motion.div
          key={quest.id}
          className="grid grid-cols-8 gap-2 items-center py-2 px-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: questIndex * 0.1 }}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                quest.priority === "daily" ? "bg-red-400" : "bg-blue-400"
              )}
            />
            <span className="text-sm font-medium text-zinc-200 truncate">
              {quest.title}
            </span>
          </div>

          {quest.status.map((completed, dayIndex) => (
            <div
              key={dayIndex}
              className={cn(
                "flex justify-center cursor-pointer transition-all duration-200",
                selectedDay === dayIndex && "scale-110"
              )}
              onClick={() => setSelectedDay(dayIndex)}
            >
              <motion.div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                  completed
                    ? "bg-green-500/20 border-green-400 text-green-400"
                    : "bg-zinc-700/50 border-zinc-600 text-zinc-500 hover:border-zinc-400"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-zinc-500" />
                )}
              </motion.div>
            </div>
          ))}
        </motion.div>
      ))}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Daily quests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Side Quests</span>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Quest
        </Button>
      </div>
    </div>
  );
};
