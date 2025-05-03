"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sword } from "lucide-react";

interface AuthFormCardProps {
  children: ReactNode;
  error?: string;
  variant?: "purple" | "amber";
}

export const AuthFormCard: React.FC<AuthFormCardProps> = ({
  children,
  error,
  variant = "purple",
}) => {
  const borderColor =
    variant === "purple" ? "border-purple-900/30" : "border-amber-900/30";

  const cornerBorderColor =
    variant === "purple" ? "border-purple-500/30" : "border-amber-500/30";

  const gradientFrom =
    variant === "purple" ? "from-purple-500/50" : "from-amber-500/50";
  const gradientVia =
    variant === "purple" ? "via-amber-500/50" : "via-purple-500/50";
  const gradientTo =
    variant === "purple" ? "to-purple-500/50" : "to-amber-500/50";

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={`relative bg-black/40 backdrop-blur-sm py-8 px-10 shadow-xl rounded-xl border ${borderColor} overflow-hidden`}
    >
      {/* Corner decorations */}
      <div
        className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${cornerBorderColor} rounded-tl-lg`}
      ></div>
      <div
        className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${cornerBorderColor} rounded-tr-lg`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${cornerBorderColor} rounded-bl-lg`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${cornerBorderColor} rounded-br-lg`}
      ></div>

      {/* Glowing effect at the top */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} opacity-70`}
      ></div>

      {/* Form Content */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center mb-6">
          <Sword className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {children}
    </motion.div>
  );
};
