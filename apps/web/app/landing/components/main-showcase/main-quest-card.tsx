"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Anchor,
  Sword,
  Sparkles,
  Telescope,
  BookOpen,
  Radio,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/timer";
import { cn } from "@/lib/utils";

// Mock main quest data using MainQuestCard color scheme
const mockMainQuest = {
  id: "1",
  title: "Master the Art of Productivity",
  description: "Transform your daily habits and achieve peak performance",
  importance: "Legendary",
  category: "Creation",
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  progress: 65,
};

// Function to get category-based icon (from MainQuestCard)
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Challenge":
      return Anchor;
    case "Combat":
      return Sword;
    case "Creation":
      return Sparkles;
    case "Exploration":
      return Telescope;
    case "Knowledge":
      return BookOpen;
    case "Social":
      return Radio;
    default:
      return Shield;
  }
};

// Function to get rarity-based styling (from MainQuestCard)
const getRarityStyles = (importance: string) => {
  switch (importance) {
    case "Legendary":
      return {
        cardClass:
          "bg-gradient-to-br from-red-950/40 via-stone-950/35 to-red-950/35 border-red-900/50 ring-2 ring-red-800/25",
        accentClass:
          "bg-gradient-to-b from-red-800/50 to-red-900/60 animate-pulse",
        glowClass: "shadow-lg shadow-red-950/40",
        iconBg:
          "bg-gradient-to-br from-red-900/45 to-stone-950/40 border-red-800/45",
        badgeClass:
          "from-red-900/80 to-stone-900/80 text-red-200/90 border-red-800/50 shadow-red-950/40 animate-pulse",
      };
    case "Heroic":
      return {
        cardClass:
          "bg-gradient-to-br from-purple-950/40 via-slate-950/35 to-purple-950/35 border-purple-900/50 ring-2 ring-purple-800/25",
        accentClass: "bg-gradient-to-b from-purple-800/45 to-purple-900/55",
        glowClass: "shadow-lg shadow-purple-950/40",
        iconBg:
          "bg-gradient-to-br from-purple-900/40 to-slate-950/35 border-purple-800/40",
        badgeClass:
          "from-purple-900/80 to-slate-900/80 text-purple-200/90 border-purple-800/50 shadow-purple-950/40",
      };
    case "Rare":
      return {
        cardClass:
          "bg-gradient-to-br from-blue-950/40 via-slate-950/35 to-blue-950/35 border-blue-900/50 ring-2 ring-blue-800/25",
        accentClass: "bg-gradient-to-b from-blue-800/45 to-blue-900/55",
        glowClass: "shadow-lg shadow-blue-950/40",
        iconBg:
          "bg-gradient-to-br from-blue-900/40 to-slate-950/35 border-blue-800/40",
        badgeClass:
          "from-blue-900/80 to-slate-900/80 text-blue-200/90 border-blue-800/50 shadow-blue-950/40",
      };
    case "Common":
    default:
      return {
        cardClass:
          "bg-gradient-to-br from-slate-950/40 via-slate-900/30 to-zinc-950/40 border-slate-500/60 ring-2 ring-slate-400/30",
        accentClass: "bg-gradient-to-b from-slate-400/80 to-slate-600/80",
        glowClass: "shadow-lg shadow-slate-900/40",
        iconBg:
          "bg-gradient-to-br from-slate-700/50 to-slate-800/40 border-slate-500/50",
        badgeClass:
          "from-slate-600/90 to-slate-700/90 text-slate-50 border-slate-400/60 shadow-slate-900/50",
      };
  }
};

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 0.5, -0.5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const MainQuestCard = () => {
  const rarityStyles = getRarityStyles(mockMainQuest.importance);
  const CategoryIcon = getCategoryIcon(mockMainQuest.category);

  return (
    <motion.div
      className="mb-20 flex items-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="text-center mb-12">
        <h2
          className="text-4xl md:text-5xl font-bold text-amber-300 mb-4"
          style={{
            fontFamily: 'var(--font-eb-garamond), "Times New Roman", serif',
          }}
        >
          Current Main Quest
        </h2>
        <p className="text-zinc-400 text-xl">Your epic storyline adventure</p>
      </div>

      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="max-w-4xl mx-auto"
      >
        <Card
          className={cn(
            "border transition-all duration-300 cursor-pointer group overflow-hidden relative backdrop-blur-sm rounded-2xl",
            rarityStyles.cardClass,
            rarityStyles.glowClass
          )}
        >
          {/* Dynamic side accent line */}
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
              rarityStyles.accentClass
            )}
          />

          <CardContent className="p-8 pl-10 relative">
            <div className="flex items-start gap-6">
              <div
                className={cn(
                  "rounded-2xl flex items-center justify-center border w-16 h-16 shadow-xl flex-shrink-0",
                  rarityStyles.iconBg
                )}
              >
                <CategoryIcon className="text-white h-8 w-8 drop-shadow-lg" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <Badge
                    className={cn(
                      "bg-gradient-to-r border rounded-2xl text-sm px-4 py-2 font-bold uppercase tracking-wider shadow-lg",
                      rarityStyles.badgeClass
                    )}
                  >
                    {mockMainQuest.importance}
                  </Badge>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight uppercase tracking-wide">
                  {mockMainQuest.title}
                </h3>

                <p className="text-zinc-300 text-lg mb-6 leading-relaxed">
                  {mockMainQuest.description}
                </p>

                {/* Timer section */}
                <div className="rounded-2xl border p-4 bg-muted/50 border-border/50 backdrop-blur-sm mb-6">
                  <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    <span>TIME REMAINING</span>
                  </div>
                  <div className="font-bold text-lg leading-tight drop-shadow-sm text-foreground">
                    <CountdownTimer
                      targetDate={mockMainQuest.dueDate}
                      className="text-foreground text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Quest Progress</span>
                    <span>{mockMainQuest.progress}%</span>
                  </div>
                  <Progress
                    value={mockMainQuest.progress}
                    className="h-3 bg-zinc-800"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
