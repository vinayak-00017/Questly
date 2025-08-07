"use client";

import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, BookOpen, Coffee } from "lucide-react";
import QuestInstanceItem from "@/components/quest-card/quest-instance-item";
import { QuestInstance } from "@questly/types";

// Mock quest data for demonstration
const mockQuests: QuestInstance[] = [
  {
    id: "1",
    title: "Morning Workout",
    description: "Complete 30 minutes of exercise",
    basePoints: 8, // Important priority
    xpReward: 90,
    type: "daily",
    completed: true,
    questId: "workout-1",
    userId: "demo-user",
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: new Date(),
    tasks: [
      {
        id: "task-1",
        title: "Warm up",
        completed: true,
        questInstanceId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-2",
        title: "Main workout",
        completed: true,
        questInstanceId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "2",
    title: "Read for 20 minutes",
    description: "Expand your knowledge through reading",
    basePoints: 3, // Standard priority
    xpReward: 50,
    type: "daily",
    completed: false,
    questId: "reading-1",
    userId: "demo-user",
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [
      {
        id: "task-3",
        title: "Choose a book",
        completed: true,
        questInstanceId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "task-4",
        title: "Read 20 minutes",
        completed: false,
        questInstanceId: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "3",
    title: "Drink 8 glasses of water",
    type: "side",
    description: "Stay hydrated throughout the day",
    basePoints: 2, // Minor priority
    xpReward: 25,
    completed: false,
    questId: "hydration-1",
    userId: "demo-user",
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
  },
];

const colorStyles = {
  daily: {
    gradient: "from-primary/10 via-transparent to-primary/5",
    particleColor: "bg-primary/20",
    iconBg: "ring-primary/30",
    iconColor: "text-primary",
    hoverBorder: "hover:border-primary/50",
    cardHoverBorder:
      "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10",
    cornerBorder: "border-primary/30",
    typeLabel: "text-muted-foreground hover:text-primary transition-colors",
    xpColor: "text-muted-foreground hover:text-primary transition-colors",
    iconHover: "group-hover:bg-primary/20 group-hover:ring-primary/50",
    iconHoverText: "group-hover:text-primary",
    buttonBorder: "border-primary/30",
    emptyBtnGradient:
      "from-primary/50 to-primary/30 hover:from-primary/60 hover:to-primary/40 border-primary/50",
    expandedBg: "bg-primary/10",
    taskItemBorder: "border-primary/30",
    taskItemBg: "bg-primary/20",
    inputBorder: "border-primary/50 focus:border-primary",
    addButtonBg:
      "bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-primary/25",
    completeButtonBg:
      "bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25",
  },
  side: {
    gradient: "from-cyan-500/10 via-transparent to-cyan-500/5",
    particleColor: "bg-cyan-500/20",
    iconBg: "ring-cyan-500/30",
    iconColor: "text-cyan-500",
    hoverBorder: "hover:border-cyan-500/50",
    cardHoverBorder:
      "hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10",
    cornerBorder: "border-cyan-500/30",
    typeLabel: "text-muted-foreground hover:text-cyan-500 transition-colors",
    xpColor: "text-muted-foreground hover:text-cyan-500 transition-colors",
    iconHover: "group-hover:bg-cyan-500/20 group-hover:ring-cyan-500/50",
    iconHoverText: "group-hover:text-cyan-500",
    buttonBorder: "border-cyan-500/30",
    emptyBtnGradient:
      "from-cyan-500/50 to-cyan-500/30 hover:from-cyan-500/60 hover:to-cyan-500/40 border-cyan-500/50",
    expandedBg: "bg-cyan-500/10",
    taskItemBorder: "border-cyan-500/30",
    taskItemBg: "bg-cyan-500/20",
    inputBorder: "border-cyan-500/50 focus:border-cyan-500",
    addButtonBg:
      "bg-cyan-500 hover:bg-cyan-600 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25",
    completeButtonBg:
      "bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25",
  },
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 1, -1, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const staggeredFloating = {
  animate: {
    y: [0, -15, 0],
    x: [0, 5, -5, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2,
    },
  },
};

export const QuestItemsList = () => {
  return (
    <div className="space-y-6">
      {mockQuests.map((quest, index) => {
        const icons = [Dumbbell, BookOpen, Coffee];
        const Icon = icons[index % icons.length];
        const isDaily = index < 2;

        return (
          <motion.div
            key={quest.id}
            variants={
              index % 2 === 0 ? floatingVariants : staggeredFloating
            }
            animate="animate"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg blur-lg" />
            <div className="relative pointer-events-none">
              <QuestInstanceItem
                quest={quest}
                colorStyles={
                  isDaily ? colorStyles.daily : colorStyles.side
                }
                questTypeLabel="Quest"
                Icon={Icon}
                queryKey={["demo-quests"]}
                globalCollapseState="collapsed"
              />
              {/* Demo overlay to prevent interactions */}
              <div className="absolute inset-0 bg-transparent cursor-default" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};