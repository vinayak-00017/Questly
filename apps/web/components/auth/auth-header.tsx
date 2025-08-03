"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  variant?: "purple" | "amber";
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  icon,
  title,
  subtitle,
  variant = "purple",
}) => {
  const bgFrom =
    variant === "purple" ? "from-[#8c7ae6]/30" : "from-[#f1c40f]/30";
  const bgTo = variant === "purple" ? "to-[#8c7ae6]/30" : "to-[#f39c12]/30";
  const ringColor =
    variant === "purple" ? "ring-[#8c7ae6]/40" : "ring-[#f1c40f]/40";
  const textColor = variant === "purple" ? "text-[#8c7ae6]" : "text-[#f1c40f]";

  return (
    <div className="text-center mb-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex justify-center mb-4"
      >
        <div
          className={`bg-gradient-to-br ${bgFrom} ${bgTo} p-5 rounded-full shadow-lg ring-2 ${ringColor} pulse-glow`}
        >
          {icon}
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold font-medieval tracking-wide text-white"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`mt-2 ${textColor}/90`}
      >
        {subtitle}
      </motion.p>
    </div>
  );
};
