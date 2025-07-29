import React from "react";
import { OuterAura } from "./rank-aura/outer-aura";
import { SmokeAnimations } from "./rank-aura/smoke-animations";
import { RankIcon } from "./rank-aura/rank-icon";
import { getHexAlpha } from "./utils";

interface RankDisplayProps {
  rank: string;
  rankIcon: string;
  rankColor: string;
  auraIntensity: number;
  animationKey: number;
  onClick: () => void;
}

export function RankDisplay({ 
  rank, 
  rankIcon, 
  rankColor, 
  auraIntensity, 
  animationKey, 
  onClick 
}: RankDisplayProps) {
  return (
    <div 
      className="relative cursor-pointer"
      onClick={onClick}
    >
      <OuterAura 
        rankColor={rankColor} 
        auraIntensity={auraIntensity} 
        animationKey={animationKey} 
      />

      <div
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg border shadow-inner hover:scale-105 transition-all duration-300 relative overflow-hidden"
        style={{
          background: `linear-gradient(90deg, ${rankColor}22 0%, #18181b99 100%)`,
          borderColor: rankColor + getHexAlpha(55 + auraIntensity * 80),
          boxShadow: `0 0 ${3 + auraIntensity * 15}px ${0.5 + auraIntensity * 3}px ${rankColor}${getHexAlpha(10 + auraIntensity * 100)}, 0 2px 8px 0 ${rankColor}22`,
        }}
      >
        <SmokeAnimations 
          rankColor={rankColor} 
          auraIntensity={auraIntensity} 
          animationKey={animationKey} 
        />
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-2.5">
          <RankIcon 
            rankIcon={rankIcon} 
            rankColor={rankColor} 
            auraIntensity={auraIntensity} 
          />
          <div className="flex flex-col">
            <span
              className="text-xs leading-tight"
              style={{ color: rankColor + "cc" }}
            >
              Rank
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: rankColor }}
            >
              {rank}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}