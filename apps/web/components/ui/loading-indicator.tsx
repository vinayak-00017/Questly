"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  color?: "purple" | "amber" | "white";
  className?: string;
}

const LoadingIndicator = ({
  size = "md",
  color = "purple",
  className,
}: LoadingIndicatorProps) => {
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  const colorStyles = {
    purple: "border-purple-500 border-b-purple-200",
    amber: "border-amber-500 border-b-amber-200",
    white: "border-white border-b-white/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      className={cn(
        sizeStyles[size],
        "rounded-full border-2 border-b-transparent",
        colorStyles[color],
        className
      )}
    />
  );
};

export default LoadingIndicator;
