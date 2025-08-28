"use client";

import React, { useState, memo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface PerformanceData {
  day: string;
  date: string;
  percentage: number;
  completedPoints: number;
  totalPossiblePoints: number;
  questsCount: number;
  completedQuestsCount: number;
}

interface PerformanceBarChartProps {
  data: PerformanceData[];
  selectedPeriod: string;
}

export const PerformanceBarChart = memo(
  ({ data, selectedPeriod }: PerformanceBarChartProps) => {
    const router = useRouter();
    const [tooltip, setTooltip] = useState<{
      x: number;
      y: number;
      data: PerformanceData;
      showOnSide?: boolean;
      showOnLeft?: boolean;
    } | null>(null);

    const chartHeight = 160;
    const maxPercentage = Math.max(...data.map((d) => d.percentage), 100);

    const handleMouseEnter = useCallback(
      (event: React.MouseEvent, item: PerformanceData) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const topbarHeight = 80; // Increased to account for actual topbar height + padding
        const tooltipHeight = 180; // More accurate tooltip height
        const margin = 20;
        const screenWidth = window.innerWidth;
        const tooltipWidth = 200;
        
        // Calculate if tooltip would go above topbar
        const wouldCrossTopbar = rect.top - tooltipHeight - margin < topbarHeight;
        
        console.log('Tooltip positioning:', {
          rectTop: rect.top,
          tooltipHeight,
          margin,
          topbarHeight,
          wouldCrossTopbar
        });
        
        let showOnSide = wouldCrossTopbar;
        let showOnLeft = false;
        let xPosition = rect.left + rect.width / 2;
        let yPosition = rect.top;
        
        if (showOnSide) {
          // Check if tooltip would go off screen on the right
          const wouldGoOffScreenRight = rect.right + tooltipWidth + margin > screenWidth;
          showOnLeft = wouldGoOffScreenRight;
          
          if (showOnLeft) {
            xPosition = rect.left - margin; // Position to the left of the bar
          } else {
            xPosition = rect.right + margin; // Position to the right of the bar
          }
          yPosition = rect.top + rect.height / 2; // Center vertically with the bar
        }
        
        setTooltip({
          x: xPosition,
          y: yPosition,
          data: item,
          showOnSide,
          showOnLeft,
        });
      },
      []
    );

    const handleMouseLeave = useCallback(() => {
      setTooltip(null);
    }, []);

    const handleBarClick = useCallback(
      (item: PerformanceData) => {
        // Navigate to detailed day view
        const date = item.date;
        const label = item.day;
        router.push(
          `/performance/${date}?period=${selectedPeriod}&label=${encodeURIComponent(label)}`
        );
      },
      [router, selectedPeriod]
    );

    if (!data.length) return null;

    return (
      <div className="relative">
        <div
          className="flex items-end justify-between gap-1 px-2"
          style={{ height: chartHeight }}
        >
          {data.map((item, index) => {
            const barHeight =
              (item.percentage / maxPercentage) * (chartHeight - 30);
            const barColor =
              item.percentage >= 80
                ? "bg-green-500"
                : item.percentage >= 60
                  ? "bg-yellow-500"
                  : item.percentage >= 40
                    ? "bg-orange-500"
                    : "bg-red-500";

            return (
              <div
                key={`${item.date}-${index}`}
                className="flex flex-col items-center gap-1 flex-1 cursor-pointer"
                onMouseEnter={(e) => handleMouseEnter(e, item)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleBarClick(item)}
              >
                <div
                  className={`w-full transition-all duration-200 hover:opacity-80 hover:scale-105 rounded-t ${barColor}`}
                  style={{ height: Math.max(barHeight, 3) }}
                />
                <div className="text-xs text-zinc-400 truncate w-full text-center">
                  {item.day}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tooltip */}
        {tooltip &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className="fixed bg-black/95 border border-amber-500/30 rounded-lg p-3 pointer-events-none backdrop-blur-sm shadow-lg"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: tooltip.showOnSide 
                  ? tooltip.showOnLeft 
                    ? "translate(-100%, -50%)" // Show to the left, centered vertically
                    : "translate(0, -50%)" // Show to the right, centered vertically
                  : "translate(-50%, calc(-100% - 10px))", // Show above, centered horizontally
                minWidth: "200px",
                maxWidth: "250px",
                zIndex: 99999,
              }}
            >
              <div className="text-amber-300 font-semibold text-sm mb-2 border-b border-amber-500/20 pb-1">
                📅 {tooltip.data.day}
              </div>
              <div className="text-white text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span>Completion:</span>
                  <span className="text-amber-200 font-medium">
                    {tooltip.data.percentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Points:</span>
                  <span>
                    <span className="text-green-300 font-medium">
                      {tooltip.data.completedPoints}
                    </span>
                    <span className="text-zinc-400 mx-1">/</span>
                    <span className="text-zinc-300">
                      {tooltip.data.totalPossiblePoints}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Quests:</span>
                  <span>
                    <span className="text-blue-300 font-medium">
                      {tooltip.data.completedQuestsCount}
                    </span>
                    <span className="text-zinc-400 mx-1">/</span>
                    <span className="text-zinc-300">
                      {tooltip.data.questsCount}
                    </span>
                  </span>
                </div>
              </div>
              <div className="text-xs text-zinc-400 mt-2 pt-2 border-t border-amber-500/20">
                Click to view detailed breakdown
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  }
);

PerformanceBarChart.displayName = "PerformanceBarChart";
