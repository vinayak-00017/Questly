"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Target,
  Activity,
  TrendingUp,
  Calendar,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BarChart3,
    title: "Interactive Charts",
    description:
      "Beautiful, clickable charts that reveal detailed insights about your performance",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Target,
    title: "Quest Tracking Grid",
    description:
      "Visual grid showing your daily quest completion status across the week",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: Activity,
    title: "Real-time Statistics",
    description:
      "Live XP tracking, streak counters, and rank progression in your topbar",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description:
      "Detailed analytics showing trends, averages, and improvement areas",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: Calendar,
    title: "Flexible Time Periods",
    description:
      "View your progress across daily, weekly, monthly, or custom time ranges",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  {
    icon: Eye,
    title: "Detailed Insights",
    description:
      "Hover tooltips and click interactions reveal comprehensive data points",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
  },
];

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const FeaturesGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mb-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Powerful Tracking Features
        </h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Get detailed insights into your progress with comprehensive analytics and visual tracking tools
        </p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className={cn(
              "p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105",
              feature.bgColor,
              feature.borderColor
            )}
            initial={{ opacity: 0, y: 20 }}
            animate="animate"
            transition={{ delay: 1.0 + index * 0.1 }}
            variants={{
              ...floatingVariants,
              animate: {
                ...floatingVariants.animate,
                opacity: 1,
                y: [0, -8, 0],
              },
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "p-3 rounded-lg",
                  feature.bgColor,
                  feature.borderColor,
                  "border"
                )}
              >
                <feature.icon className={cn("w-6 h-6", feature.color)} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
