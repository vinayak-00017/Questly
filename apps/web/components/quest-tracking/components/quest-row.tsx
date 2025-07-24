import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackedQuest, ViewType, QuestActivityData } from "../types";
import { QuestActivityGrid } from "./quest-activity-grid";
import { QuestStats } from "./quest-stats";

interface QuestRowProps {
  quest: TrackedQuest;
  questIndex: number;
  dateRange: Date[];
  selectedView: ViewType;
  getQuestActivity: (questId: string, date: Date) => QuestActivityData | null;
  onRemoveQuest: (questId: string) => void;
}

export const QuestRow: React.FC<QuestRowProps> = ({
  quest,
  questIndex,
  dateRange,
  selectedView,
  getQuestActivity,
  onRemoveQuest,
}) => {
  return (
    <motion.div
      key={quest.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: questIndex * 0.1 }}
      className="flex items-center"
    >
      {/* Quest Info */}
      <div className="w-48 flex-shrink-0 flex items-center justify-between pr-4">
        <div className="flex items-center gap-2 min-w-0">
          <Badge
            variant="outline"
            className={cn(
              "text-xs flex-shrink-0",
              quest.type === "daily"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-sky-500/20 text-sky-400 border-sky-500/30"
            )}
          >
            {quest.type === "daily" ? (
              <Flame className="h-3 w-3" />
            ) : (
              <Compass className="h-3 w-3" />
            )}
          </Badge>

          <span
            className="text-white text-sm font-medium truncate"
            title={quest.title}
          >
            {quest.title}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveQuest(quest.id)}
          className="text-slate-400 hover:text-red-400 hover:bg-red-900/20 h-6 w-6 p-0 flex-shrink-0"
        >
          ×
        </Button>
      </div>

      {/* Activity Grid */}
      <QuestActivityGrid
        dateRange={dateRange}
        selectedView={selectedView}
        questId={quest.id}
        questType={quest.type}
        getQuestActivity={getQuestActivity}
        questIndex={questIndex}
      />

      {/* Quest Stats */}
      <QuestStats
        selectedView={selectedView}
        dateRange={dateRange}
        questId={quest.id}
        getQuestActivity={getQuestActivity}
      />
    </motion.div>
  );
};