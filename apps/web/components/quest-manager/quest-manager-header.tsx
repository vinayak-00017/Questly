import React from "react";
import { motion } from "framer-motion";
import { Settings, Zap } from "lucide-react";

interface QuestManagerHeaderProps {
  title: string;
  subtitle: string;
}

export const QuestManagerHeader: React.FC<QuestManagerHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-amber-500/20 blur-3xl rounded-full" />

        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-orange-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <Settings className="h-6 w-6 text-orange-400/70" />
          </div>
          <p className="text-slate-300 text-lg font-medium">{subtitle}</p>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};
