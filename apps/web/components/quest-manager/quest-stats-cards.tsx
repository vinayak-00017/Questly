import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  TrendingUp,
  Clock,
  Compass,
  Flame,
  Scroll,
} from "lucide-react";
import { QuestTemplateStats } from "@/utils/questTemplateStats";

interface QuestStatsCardsProps {
  stats: QuestTemplateStats;
}

export const QuestStatsCards: React.FC<QuestStatsCardsProps> = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
    >
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Scroll className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Templates</p>
            <p className="text-xl font-bold text-white">
              {stats.totalTemplates}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Active</p>
            <p className="text-xl font-bold text-white">
              {stats.activeTemplates}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Flame className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Daily </p>
            <p className="text-xl font-bold text-white">
              {stats.dailyTemplates}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Clock className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Expired</p>
            <p className="text-xl font-bold text-white">
              {stats.expiredTemplates}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Compass className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Side </p>
            <p className="text-xl font-bold text-white">
              {stats.sideTemplates}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
