"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  className?: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  className = "",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="flex-1 bg-black/50 border border-zinc-800/80 hover:border-purple-500/30 p-6 flex flex-col items-center justify-center gap-3 relative overflow-hidden group transition-all duration-300">
        {/* Simplified static corner elements */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-purple-500/30"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-purple-500/30"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-purple-500/30"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-purple-500/30"></div>

        <div
          className={`w-16 h-16 rounded-full bg-black/40 ring-1 ${className} flex items-center justify-center shadow-lg pulse-glow`}
        >
          <Icon className="w-7 h-7" />
        </div>

        <div className="text-center z-10">
          <h3 className="text-purple-300 text-sm font-medium uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-4xl font-medieval font-bold mt-1">{value}</p>
        </div>
      </Card>
    </motion.div>
  );
}
