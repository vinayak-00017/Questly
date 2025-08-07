"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

// Mock data for the tracking showcase
const mockPerformanceData = [
  { day: "Mon", percentage: 85, completedPoints: 340, totalPossiblePoints: 400, completedQuestsCount: 4, questsCount: 5, date: "2024-01-15" },
  { day: "Tue", percentage: 92, completedPoints: 460, totalPossiblePoints: 500, completedQuestsCount: 5, questsCount: 5, date: "2024-01-16" },
  { day: "Wed", percentage: 78, completedPoints: 390, totalPossiblePoints: 500, completedQuestsCount: 3, questsCount: 4, date: "2024-01-17" },
  { day: "Thu", percentage: 95, completedPoints: 570, totalPossiblePoints: 600, completedQuestsCount: 6, questsCount: 6, date: "2024-01-18" },
  { day: "Fri", percentage: 88, completedPoints: 440, totalPossiblePoints: 500, completedQuestsCount: 4, questsCount: 5, date: "2024-01-19" },
  { day: "Sat", percentage: 72, completedPoints: 360, totalPossiblePoints: 500, completedQuestsCount: 3, questsCount: 5, date: "2024-01-20" },
  { day: "Sun", percentage: 90, completedPoints: 450, totalPossiblePoints: 500, completedQuestsCount: 5, questsCount: 5, date: "2024-01-21" },
];

export const InteractiveChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: any } | null>(null);
  const [clickedPoint, setClickedPoint] = useState<number | null>(null);

  const chartWidth = 700;
  const chartHeight = 300;
  const padding = 60;
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding * 2;

  const maxValue = 100;
  const barSpacing = innerWidth / mockPerformanceData.length;
  const barWidth = Math.max(20, barSpacing * 0.6);

  const chartData = mockPerformanceData.map((item, index) => {
    const centerX = padding + index * barSpacing + barSpacing / 2;
    const lineY = padding + ((maxValue - item.percentage) / maxValue) * innerHeight;
    const barHeight = Math.max(3, (item.percentage / maxValue) * innerHeight);
    const barY = chartHeight - padding - barHeight;

    return {
      centerX,
      lineY,
      item,
      index,
      barX: centerX - barWidth / 2,
      barY,
      barWidth,
      barHeight,
    };
  });

  const linePathString = chartData.reduce((path, point, index) => {
    const command = index === 0 ? "M" : "L";
    return `${path} ${command} ${point.centerX} ${point.lineY}`;
  }, "");

  const handleMouseEnter = (point: any, event: React.MouseEvent) => {
    setHoveredPoint(point.index);
    setTooltip({
      x: point.centerX,
      y: point.lineY - 10,
      data: point.item,
    });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setTooltip(null);
  };

  const handleClick = (point: any) => {
    setClickedPoint(point.index);
    setTimeout(() => setClickedPoint(null), 1000);
  };

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="relative">
          <svg width={chartWidth} height={chartHeight} className="max-w-full">
            <defs>
              <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((value) => {
              const y = padding + ((100 - value) / 100) * innerHeight;
              return (
                <line
                  key={value}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#374151"
                  strokeWidth="0.5"
                  opacity="0.3"
                  strokeDasharray="2 2"
                />
              );
            })}

            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((value) => {
              const y = padding + ((100 - value) / 100) * innerHeight;
              return (
                <text
                  key={value}
                  x={padding - 15}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-zinc-500 text-sm font-medium"
                >
                  {value}%
                </text>
              );
            })}

            {/* Bars */}
            {chartData.map((point, index) => {
              const isHovered = hoveredPoint === index;
              const isClicked = clickedPoint === index;
              
              return (
                <motion.rect
                  key={`bar-${index}`}
                  x={point.barX}
                  y={point.barY}
                  width={point.barWidth}
                  height={point.barHeight}
                  fill={isHovered || isClicked ? "#fbbf24" : "url(#barGradient)"}
                  stroke={isHovered || isClicked ? "#f59e0b" : "none"}
                  strokeWidth={isHovered || isClicked ? "2" : "0"}
                  className="cursor-pointer"
                  onClick={() => handleClick(point)}
                  onMouseEnter={(e) => handleMouseEnter(point, e)}
                  onMouseLeave={handleMouseLeave}
                  rx="3"
                  animate={{
                    scale: isClicked ? 1.1 : 1,
                    y: isClicked ? point.barY - 5 : point.barY,
                  }}
                  transition={{ duration: 0.2 }}
                />
              );
            })}

            {/* Line */}
            <path
              d={linePathString}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Line points */}
            {chartData.map((point, index) => (
              <motion.circle
                key={`point-${index}`}
                cx={point.centerX}
                cy={point.lineY}
                r={hoveredPoint === index || clickedPoint === index ? "6" : "4"}
                fill={hoveredPoint === index || clickedPoint === index ? "#fbbf24" : "#ffffff"}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                className="cursor-pointer"
                onClick={() => handleClick(point)}
                onMouseEnter={(e) => handleMouseEnter(point, e)}
                onMouseLeave={handleMouseLeave}
                animate={{
                  scale: clickedPoint === index ? 1.3 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
            ))}

            {/* X-axis labels */}
            {chartData.map((point, index) => (
              <text
                key={`x-label-${index}`}
                x={point.centerX}
                y={chartHeight - padding + 25}
                textAnchor="middle"
                className="fill-zinc-400 text-sm font-medium cursor-pointer hover:fill-amber-400 transition-colors"
                onClick={() => handleClick(point)}
                onMouseEnter={(e) => handleMouseEnter(point, e)}
                onMouseLeave={handleMouseLeave}
              >
                {point.item.day}
              </text>
            ))}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <motion.div
              className="absolute z-50 bg-black/95 border border-amber-500/30 rounded-lg p-3 pointer-events-none backdrop-blur-sm shadow-lg"
              style={{
                left: `${(tooltip.x / chartWidth) * 100}%`,
                top: `${(tooltip.y / chartHeight) * 100}%`,
                transform: "translate(-50%, -100%)",
                minWidth: "180px",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-amber-300 font-semibold text-sm mb-2">
                📅 {tooltip.data.day}
              </div>
              <div className="text-white text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Completion:</span>
                  <span className="text-amber-200 font-medium">{tooltip.data.percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Points:</span>
                  <span className="text-green-300">{tooltip.data.completedPoints}/{tooltip.data.totalPossiblePoints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quests:</span>
                  <span className="text-blue-300">{tooltip.data.completedQuestsCount}/{tooltip.data.questsCount}</span>
                </div>
              </div>
              <div className="text-xs text-zinc-400 mt-2 pt-2 border-t border-zinc-700 text-center">
                🖱️ Click for details
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Chart Legend */}
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 bg-gradient-to-b from-blue-500 to-blue-600 rounded-sm"></div>
            <span>Daily completion</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gradient-to-r from-amber-500 to-red-500 rounded-full"></div>
            <span>Trend line</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          <TrendingUp className="w-4 h-4" />
          <span>87% avg completion</span>
        </div>
      </div>
    </div>
  );
};