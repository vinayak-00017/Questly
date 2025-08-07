"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Award, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const GoalRewardsSection = () => {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.4 }}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-600/50 hover:border-slate-500/70 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-500/20 relative overflow-hidden group backdrop-blur-sm">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-slate-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-start space-x-6">
              <motion.div
                className="flex-shrink-0 p-4 bg-slate-700/40 rounded-2xl border border-slate-600/40 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Target className="w-10 h-10 text-slate-300" />
              </motion.div>
              <div>
                <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-slate-200 transition-colors duration-300">
                  Smart Goal Setting
                </h3>
                <motion.div
                  className="flex items-center gap-3 text-slate-300 font-semibold"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-lg">
                    75% higher completion rate
                  </span>
                  <TrendingUp className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-600/50 hover:border-slate-500/70 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-500/20 relative overflow-hidden group backdrop-blur-sm">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-slate-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-start space-x-6">
              <motion.div
                className="flex-shrink-0 p-4 bg-slate-700/40 rounded-2xl border border-slate-600/40 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.6 }}
              >
                <Award className="w-10 h-10 text-slate-300" />
              </motion.div>
              <div>
                <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-slate-200 transition-colors duration-300">
                  Rewards That Matter
                </h3>
                <motion.div
                  className="flex items-center gap-3 text-slate-300 font-semibold"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-lg">
                    Dopamine-driven motivation
                  </span>
                  <Zap className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};