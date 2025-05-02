"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-transparent p-4 rounded-lg relative overflow-hidden">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent"></div>

      <div className="bg-black/40 w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-1 ring-purple-500/30 pulse-glow">
        <Icon className="w-5 h-5 text-purple-400" />
      </div>

      <div>
        <h2 className="text-xl font-medieval text-white/90">{title}</h2>
        {subtitle && <p className="text-zinc-400 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
