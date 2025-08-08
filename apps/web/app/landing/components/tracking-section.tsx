"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Target,
  Activity,
  ArrowRight,
  MousePointer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Import modularized components
import { InteractiveChart } from "./tracking/interactive-chart";
import { QuestTrackerPreview } from "./tracking/quest-tracker-preview";
import { TopbarStatsPreview } from "./tracking/topbar-stats-preview";
import { FeaturesGrid } from "./tracking/features-grid";
import { GoalRewardsSection } from "./tracking/goal-rewards-section";
import { useRouter } from "next/navigation";

const TrackingSection = () => {
  const [activeTab, setActiveTab] = useState<"chart" | "tracker" | "stats">(
    "tracker"
  );
  const router = useRouter();

  return (
    <div
      id="tracking"
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/3 to-blue-500/3 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent mb-8 title-heading"
            style={{
              fontFamily: 'var(--font-eb-garamond), "Times New Roman", serif',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Interactive Performance Tracking
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-zinc-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Monitor your progress with beautiful charts, detailed quest
            tracking, and real-time performance analytics
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-slate-800/50 rounded-2xl p-2 border border-slate-700/50 backdrop-blur-sm">
            {[
              { id: "chart", label: "Performance Chart", icon: BarChart3 },
              { id: "tracker", label: "Quest Tracker", icon: Target },
              { id: "stats", label: "Live Stats", icon: Activity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-slate-700/50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Interactive Demo - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <Card className="w-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                {activeTab === "chart" && (
                  <>
                    <BarChart3 className="w-6 h-6 text-blue-400" /> Performance
                    Analytics
                  </>
                )}
                {activeTab === "tracker" && (
                  <>
                    <Target className="w-6 h-6 text-green-400" /> Quest Tracking
                  </>
                )}
                {activeTab === "stats" && (
                  <>
                    <Activity className="w-6 h-6 text-purple-400" /> Live
                    Statistics
                  </>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <MousePointer className="w-4 h-4" />
                <span>Interactive demo - click and hover to explore</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {activeTab === "chart" && (
                <motion.div
                  key="chart"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <InteractiveChart />
                </motion.div>
              )}

              {activeTab === "tracker" && (
                <motion.div
                  key="tracker"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestTrackerPreview />
                </motion.div>
              )}

              {activeTab === "stats" && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TopbarStatsPreview />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <FeaturesGrid />

        {/* Goal & Rewards Section */}
        <GoalRewardsSection />

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <motion.button
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-blue-900/50 transition-all duration-300 border border-blue-500/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              router.push("/register");
            }}
          >
            <span className="flex items-center gap-3">
              <Activity className="w-6 h-6" />
              Start Tracking Your Progress
              <ArrowRight className="w-6 h-6" />
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/4 left-1/6 text-blue-400/20"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <BarChart3 size={50} />
      </motion.div>

      <motion.div
        className="absolute top-3/4 right-1/6 text-purple-400/20"
        animate={{
          rotate: -360,
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Target size={40} />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/4 text-amber-400/15"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Activity size={35} />
      </motion.div>
    </div>
  );
};

export default TrackingSection;
