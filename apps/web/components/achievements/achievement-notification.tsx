"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Sparkles, Star, Crown, Medal, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { Achievement } from "@questly/utils";

interface AchievementNotificationProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const importanceColors = {
  common: {
    bg: "from-slate-600 via-slate-700 to-slate-800",
    border: "border-slate-400/60",
    glow: "shadow-slate-400/40",
    sparkle: "text-slate-300",
    accent: "text-slate-300",
    ring: "ring-slate-400/30",
  },
  rare: {
    bg: "from-blue-500 via-blue-600 to-blue-700",
    border: "border-blue-400/60",
    glow: "shadow-blue-400/50",
    sparkle: "text-blue-200",
    accent: "text-blue-200",
    ring: "ring-blue-400/40",
  },
  epic: {
    bg: "from-purple-500 via-purple-600 to-purple-700",
    border: "border-purple-400/60",
    glow: "shadow-purple-400/50",
    sparkle: "text-purple-200",
    accent: "text-purple-200",
    ring: "ring-purple-400/40",
  },
  legendary: {
    bg: "from-amber-500 via-orange-500 to-red-500",
    border: "border-amber-400/60",
    glow: "shadow-amber-400/60",
    sparkle: "text-amber-200",
    accent: "text-amber-200",
    ring: "ring-amber-400/50",
  },
};

const importanceIcons = {
  common: Medal,
  rare: Star,
  epic: Sparkles,
  legendary: Crown,
};

export const AchievementNotification: React.FC<
  AchievementNotificationProps
> = ({
  achievement,
  isVisible,
  onClose,
  autoClose = true,
  autoCloseDelay = 8000, // Increased from 5000 to 8000ms
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      delay: number;
      duration: number;
      size: number;
    }>
  >([]);

  const router = useRouter();
  const colors = importanceColors[achievement.importance];
  const IconComponent = importanceIcons[achievement.importance];

  // Generate particles for animation
  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        size: 2 + Math.random() * 4,
      }));
      setParticles(newParticles);
    }
  }, [isVisible]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, autoCloseDelay, handleClose]);

  const handleClick = () => {
    router.push("/achievements");
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[120] pointer-events-auto"
            onClick={handleClose}
          />

          {/* Notification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{
              opacity: isClosing ? 0 : 1,
              scale: isClosing ? 0.5 : 1,
              y: isClosing ? 50 : 0,
            }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              duration: 0.4,
            }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[130] w-full max-w-md mx-4 pointer-events-auto"
          >
            <Card
              className={cn(
                "relative overflow-hidden border-2 cursor-pointer",
                colors.border,
                colors.glow,
                "shadow-2xl bg-gradient-to-br from-zinc-900/95 via-zinc-950/95 to-black/95 backdrop-blur-md",
                "ring-4",
                colors.ring,
                "hover:scale-105 transition-transform duration-200"
              )}
              onClick={handleClick}
            >
              <CardContent className="p-6 relative">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="absolute top-3 right-3 h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Main Content */}
                <div className="text-center space-y-4">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="flex justify-center"
                  >
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center",
                        "bg-gradient-to-br",
                        colors.bg,
                        "ring-4 ring-white/20 shadow-xl"
                      )}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-1"
                  >
                    <h2 className="text-2xl font-bold text-white font-medieval">
                      Achievement Unlocked!
                    </h2>
                    <p
                      className={cn(
                        "text-sm font-medium capitalize",
                        colors.accent
                      )}
                    >
                      {achievement.importance} Achievement
                    </p>
                  </motion.div>

                  {/* Achievement Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <h3 className="text-xl font-semibold text-white">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-center gap-4 pt-2">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm text-zinc-400">
                          {achievement.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className={cn("w-4 h-4", colors.sparkle)} />
                        <span
                          className={cn("text-sm font-medium", colors.accent)}
                        >
                          +{achievement.criteria.value} points
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Click hint */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-zinc-500 pt-2"
                  >
                    Click to view all achievements
                  </motion.p>
                </div>

                {/* Animated Background Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {particles.map((particle) => (
                    <motion.div
                      key={particle.id}
                      className={cn(
                        "absolute rounded-full opacity-60",
                        colors.sparkle.replace("text-", "bg-")
                      )}
                      style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0],
                        y: [-20, -60],
                      }}
                      transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  ))}
                </div>

                {/* Special effects for higher rarities */}
                {achievement.importance === "legendary" && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-r opacity-20",
                        colors.bg
                      )}
                    />
                  </motion.div>
                )}

                {(achievement.importance === "epic" ||
                  achievement.importance === "legendary") && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      boxShadow: [
                        `0 0 20px ${colors.glow.includes("amber") ? "#f59e0b" : colors.glow.includes("purple") ? "#a855f7" : "#3b82f6"}40`,
                        `0 0 40px ${colors.glow.includes("amber") ? "#f59e0b" : colors.glow.includes("purple") ? "#a855f7" : "#3b82f6"}60`,
                        `0 0 20px ${colors.glow.includes("amber") ? "#f59e0b" : colors.glow.includes("purple") ? "#a855f7" : "#3b82f6"}40`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
