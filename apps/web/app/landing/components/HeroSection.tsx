import { Button } from "@/components/ui/button";
import {
  Play,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const ProgressRing = () => {
  return (
    <motion.div
      className="relative w-32 h-32"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="rgb(229 231 235)"
          strokeWidth="8"
          fill="none"
          className="opacity-20"
        />
        {/* Progress circle */}
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          stroke="url(#cleanProgressGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 314" }}
          animate={{ strokeDasharray: "235 314" }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
          className="drop-shadow-sm"
        />
        <defs>
          <linearGradient
            id="cleanProgressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="text-2xl font-bold text-slate-700 dark:text-slate-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4, type: "spring" }}
          >
            75%
          </motion.div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Progress
          </div>
        </div>
      </motion.div>
      <motion.div
        className="absolute -top-2 -right-2"
        animate={{
          y: [0, -3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <CheckCircle2 className="w-6 h-6 text-green-500" />
      </motion.div>
    </motion.div>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-black">
      {/* Clean Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle geometric patterns */}
        <div className="absolute inset-0 bg-grid-slate-100/25 dark:bg-grid-slate-700/25 bg-[size:40px_40px]" />

        {/* Floating subtle elements */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-slate-400/20 dark:bg-slate-400/10 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Level up your real life</span>
          </div>

          {/* Clean, welcoming headline */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-slate-800 to-black dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Climb the Ranks
            </span>
            <br />
            <span>of Your Life</span>
          </motion.h1>

          {/* Friendly, approachable subheading */}
          <motion.p
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your daily tasks into a{" "}
            <span className="text-slate-900 dark:text-white font-semibold">
              rewarding journey
            </span>
            . Track progress, build habits, and celebrate wins along the way.
          </motion.p>

          {/* Progress Ring */}
          <motion.div
            className="flex justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <ProgressRing />
          </motion.div>

          {/* Clean, friendly CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button
              size="lg"
              className="bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black font-semibold text-lg px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-slate-300 dark:border-slate-600 hover:border-slate-500 dark:hover:border-slate-400 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-semibold text-lg px-8 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Friendly stats */}
          <motion.div
            className="pt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                ...
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Happy Users
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                98%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Success Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                4.9★
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                User Rating
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <motion.div
        className="absolute top-1/4 left-10 opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <TrendingUp className="w-6 h-6 text-slate-600" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-16 opacity-20"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Target className="w-8 h-8 text-slate-600" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 left-1/4 opacity-20"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-5 h-5 text-slate-600" />
      </motion.div>
    </section>
  );
};
