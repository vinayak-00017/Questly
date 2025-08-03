"use client";

import { TrendingUp, Crown, Calendar, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import { useState, useMemo, memo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const periodOptions = [
  { value: "weekly", label: "Weekly", description: "Last 7 days" },
  { value: "monthly", label: "Monthly", description: "Last 30 days" },
  { value: "quarterly", label: "Quarterly", description: "Last 90 days" },
  { value: "yearly", label: "Yearly", description: "Last 52 weeks" },
  { value: "overall", label: "All Time", description: "Since you joined" },
];

// Refined bar chart with better visual balance
const RefinedBarChart = memo(
  ({
    data,
    onDataPointClick,
  }: {
    data: any[];
    onDataPointClick: (item: any) => void;
  }) => {
    const [tooltip, setTooltip] = useState<{
      x: number;
      y: number;
      data: any;
      showBelow?: boolean;
      position: "left" | "center" | "right";
    } | null>(null);
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
    const [showLegend, setShowLegend] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const chartWidth = 900;
    const chartHeight = 320; // Reduced from 400 for better proportions
    const padding = 50; // Reduced padding
    const innerWidth = chartWidth - padding * 2;
    const innerHeight = chartHeight - padding * 2;

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-80 text-zinc-400">
          No data available
        </div>
      );
    }

    // Always use 0-100 range for completion percentage to ensure proper scaling
    const maxValue = 100;
    const minValue = 0;
    const range = 100;

    // Calculate bar dimensions
    const barSpacing = innerWidth / data.length;
    const barWidth = Math.max(15, Math.min(60, barSpacing * 0.7));

    // Generate data for bars and line
    const chartData = data.map((item, index) => {
      const centerX = padding + index * barSpacing + barSpacing / 2;
      const lineY =
        padding + ((maxValue - item.percentage) / range) * innerHeight;
      const barHeight = Math.max(3, (item.percentage / range) * innerHeight);
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

    // Generate line path
    const linePathString = chartData.reduce((path, point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${path} ${command} ${point.centerX} ${point.lineY}`;
    }, "");

    const handleMouseEnter = (point: any, event: React.MouseEvent) => {
      if (!containerRef.current) return;

      const tooltipWidth = 220;
      const tooltipHeight = 140;
      const margin = 40;

      let tooltipX = point.centerX;
      let tooltipY = point.lineY - 15;
      let showBelow = false;
      let position: "left" | "center" | "right" = "center";

      const leftEdge = margin + tooltipWidth / 2;
      const rightEdge = chartWidth - margin - tooltipWidth / 2;

      if (point.centerX > rightEdge) {
        position = "right";
        tooltipX = rightEdge;
      } else if (point.centerX < leftEdge) {
        position = "left";
        tooltipX = leftEdge;
      } else {
        position = "center";
        tooltipX = point.centerX;
      }

      if (tooltipY - tooltipHeight < margin) {
        tooltipY = point.lineY + 25;
        showBelow = true;
      }

      setTooltip({
        x: tooltipX,
        y: tooltipY,
        data: point.item,
        showBelow,
        position,
      });
      setHoveredPoint(point.index);
    };

    const handleMouseLeave = () => {
      setTooltip(null);
      setHoveredPoint(null);
    };

    const getTooltipTransform = () => {
      if (!tooltip) return "";

      const baseTransform = tooltip.showBelow
        ? "translate(-50%, 0%)"
        : "translate(-50%, -100%)";

      switch (tooltip.position) {
        case "left":
          return tooltip.showBelow ? "translate(0, 0%)" : "translate(0, -100%)";
        case "right":
          return tooltip.showBelow
            ? "translate(-100%, 0%)"
            : "translate(-100%, -100%)";
        default:
          return baseTransform;
      }
    };

    const getArrowPosition = () => {
      if (!tooltip) return {};

      switch (tooltip.position) {
        case "left":
          return { left: "20px" };
        case "right":
          return { right: "20px" };
        default:
          return { left: "50%", transform: "translateX(-50%)" };
      }
    };

    return (
      <div
        ref={containerRef}
        className="w-full relative"
        style={{ padding: "20px" }}
      >
        <div className="overflow-x-auto">
          <svg
            width={chartWidth}
            height={chartHeight}
            className="w-full h-80" // Reduced height class
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            {/* Definitions for gradients and patterns */}
            <defs>
              {/* Lighter grid pattern */}
              <pattern
                id="grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="#3d3d5c"
                  strokeWidth="0.5"
                  opacity="0.15"
                />
              </pattern>

              {/* Bar gradients */}
              <linearGradient
                id="barGradientGreen"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#2ecc71" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#27ae60" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient
                id="barGradientAmber"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f1c40f" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f39c12" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient
                id="barGradientOrange"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f39c12" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#e67e22" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient
                id="barGradientRed"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#e74c3c" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#c0392b" stopOpacity="0.7" />
              </linearGradient>

              {/* Muted line gradient */}
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00aaff" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#8c7ae6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00aaff" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Bars */}
            {chartData.map((point, index) => {
              const isHovered = hoveredPoint === index;
              const percentage = point.item.percentage;

              let fillColor = "url(#barGradientRed)";
              if (percentage >= 80) fillColor = "url(#barGradientGreen)";
              else if (percentage >= 60) fillColor = "url(#barGradientAmber)";
              else if (percentage >= 40) fillColor = "url(#barGradientOrange)";

              return (
                <rect
                  key={`bar-${index}`}
                  x={point.barX}
                  y={point.barY}
                  width={point.barWidth}
                  height={point.barHeight}
                  fill={isHovered ? "#fbbf24" : fillColor}
                  stroke={isHovered ? "#f59e0b" : "none"}
                  strokeWidth={isHovered ? "2" : "0"}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => onDataPointClick(point.item)}
                  onMouseEnter={(e) => handleMouseEnter(point, e)}
                  onMouseLeave={handleMouseLeave}
                  rx="2"
                  ry="2"
                />
              );
            })}

            {/* Line overlay */}
            <path
              d={linePathString}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2.5" // Slightly thinner
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />

            {/* Line data points */}
            {chartData.map((point, index) => (
              <circle
                key={`point-${index}`}
                cx={point.centerX}
                cy={point.lineY}
                r={hoveredPoint === index ? "5" : "3"} // Slightly smaller
                fill={hoveredPoint === index ? "#fbbf24" : "#ffffff"}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200 drop-shadow-sm"
                onClick={() => onDataPointClick(point.item)}
                onMouseEnter={(e) => handleMouseEnter(point, e)}
                onMouseLeave={handleMouseLeave}
              />
            ))}

            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((value) => {
              const y = padding + ((100 - value) / 100) * innerHeight;
              return (
                <g key={value}>
                  <text
                    x={padding - 15}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-zinc-500 text-xs font-medium" // Lighter color, smaller text
                  >
                    {value}%
                  </text>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#374151"
                    strokeWidth="0.5" // Thinner lines
                    opacity="0.2" // More transparent
                    strokeDasharray="3 3"
                  />
                </g>
              );
            })}

            {/* X-axis labels with click handlers */}
            {chartData.map((point, index) => {
              const shouldShow =
                data.length <= 7 ||
                index % Math.ceil(data.length / 8) === 0 ||
                index === data.length - 1;
              if (shouldShow) {
                return (
                  <g key={`x-label-${index}`}>
                    <rect
                      x={point.centerX - 35}
                      y={chartHeight - padding + 5}
                      width={70}
                      height={25}
                      fill="transparent"
                      className="cursor-pointer"
                      onClick={() => onDataPointClick(point.item)}
                      onMouseEnter={(e) => handleMouseEnter(point, e)}
                      onMouseLeave={handleMouseLeave}
                    />
                    <text
                      x={point.centerX}
                      y={chartHeight - padding + 18}
                      textAnchor="middle"
                      className="fill-zinc-500 text-xs font-medium cursor-pointer hover:fill-amber-400 transition-colors duration-200" // Lighter, smaller
                    >
                      {point.item.day}
                    </text>
                  </g>
                );
              }
              return null;
            })}

            {/* Muted chart title */}
            <text
              x={chartWidth / 2}
              y={25}
              textAnchor="middle"
              className="fill-amber-300 text-base font-medium" // Muted from amber-400 to amber-300, smaller
            >
              Quest Completion Progress
            </text>
          </svg>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 bg-black/95 border border-amber-500/30 rounded-lg p-3 pointer-events-none backdrop-blur-sm shadow-lg" // Reduced border opacity and padding
            style={{
              left: `${(tooltip.x / chartWidth) * 100}%`,
              top: `${(tooltip.y / chartHeight) * 100}%`,
              transform: getTooltipTransform(),
              minWidth: "200px",
              maxWidth: "220px",
            }}
          >
            <div className="text-amber-300 font-semibold text-sm mb-2 border-b border-amber-500/20 pb-1">
              {" "}
              {/* Muted amber */}
              📅 {tooltip.data.day}
            </div>
            <div className="text-white text-sm space-y-2">
              <div className="flex justify-between items-center">
                <span>Completion:</span>
                <span className="text-amber-200 font-medium">
                  {tooltip.data.percentage}%
                </span>{" "}
                {/* Muted */}
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
            <div className="text-xs text-zinc-400 mt-2 pt-2 border-t border-zinc-700 text-center">
              🖱️ Click for detailed view
            </div>

            <div
              className={`absolute w-0 h-0 border-l-4 border-r-4 border-transparent ${
                tooltip.showBelow
                  ? "border-b-4 border-b-amber-500/30 top-0 transform -translate-y-full"
                  : "border-t-4 border-t-amber-500/30 bottom-0 transform translate-y-full"
              }`}
              style={getArrowPosition()}
            ></div>
          </div>
        )}

        {/* Collapsible Legend moved below chart */}
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
            className="text-zinc-400 hover:text-amber-300 text-xs"
          >
            <Info className="h-3 w-3 mr-1" />
            {showLegend ? "Hide" : "Show"} Legend
          </Button>

          {showLegend && (
            <div className="flex items-center gap-4 text-xs text-zinc-400 bg-black/30 rounded-lg px-3 py-2 border border-zinc-700/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-gradient-to-b from-green-500 to-green-600 rounded-sm"></div>
                <span>Bars: Daily completion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full"></div>
                <span>Line: Trend overview</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

const PerformanceChartRefined = memo(function PerformanceChartRefined() {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const router = useRouter();

  const { data: performanceData, isLoading } = useQuery({
    queryKey: ["performance", selectedPeriod],
    queryFn: () => userApi.getPerformance(selectedPeriod),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleChartClick = useCallback(
    (item: any) => {
      const date = item.date;
      const label = item.day;
      router.push(
        `/performance/${date}?period=${selectedPeriod}&label=${encodeURIComponent(label)}`
      );
    },
    [router, selectedPeriod]
  );

  const chartData = useMemo(() => {
    const rawData = performanceData?.performanceData || [];
    return rawData.map((item: any) => ({
      ...item,
      percentage: Math.max(0, Math.min(100, item.percentage || 0)),
    }));
  }, [performanceData?.performanceData]);

  const summary = useMemo(
    () =>
      performanceData?.summary || {
        averagePercentage: 0,
        bestPeriod: { period: "N/A", percentage: 0 },
        totalPoints: 0,
        activePeriods: 0,
      },
    [performanceData?.summary]
  );

  const currentPeriodOption = useMemo(
    () => periodOptions.find((p) => p.value === selectedPeriod),
    [selectedPeriod]
  );

  if (isLoading) {
    return (
      <Card className="bg-card/80 border-border/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-foreground font-bold flex items-center">
            <Crown className="h-5 w-5 mr-2 text-primary" />
            Quest Completion Analytics
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Loading performance data...
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-zinc-400">Loading chart...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[#1F2937]/90 to-[#111827]/90 border border-[#23263a] rounded-2xl shadow-xl shadow-black/30 backdrop-blur-sm transition-all duration-300 px-0 py-0">
      <CardHeader className="pb-2 px-6 pt-6 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-semibold text-[#E5E7EB] flex items-center gap-2">
              <Crown className="h-6 w-6 text-amber-400 drop-shadow-glow" />
              Quest Completion Analytics
            </CardTitle>
            <CardDescription className="text-base text-gray-300">
              Track your quest completion progress over time
            </CardDescription>
            <div className="text-gray-500 text-s ">
              • Bars, line points, and day labels are all clickable • Hover for
              details
            </div>
          </div>
          <div className="items-center justify-center flex flex-col">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-36 bg-[#23263a]/60 border border-[#23263a] text-[#E5E7EB] rounded-lg shadow-inner backdrop-blur-sm hover:bg-opacity-80 focus:ring-2 focus:ring-amber-400/40 transition-all">
                <Calendar className="h-5 w-5 mr-2 text-amber-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1F2937]/95 border border-[#23263a] text-[#E5E7EB] rounded-lg">
                {periodOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[#E5E7EB] focus:bg-amber-400/10 focus:text-amber-400"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-xs mt-1 text-gray-400">
              {currentPeriodOption?.description ||
                "Performance tracking over time"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-2 pb-2">
        <RefinedBarChart data={chartData} onDataPointClick={handleChartClick} />
      </CardContent>
      <CardFooter className="pt-0 px-6 pb-6 w-full">
        <div className="flex w-full justify-between ">
          <div className="flex w-full items-start gap-4 text-base">
            <div className="grid gap-2 w-full">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                <span>Average completion:</span>
                <span className="text-amber-200">
                  {summary.averagePercentage}%
                </span>
                <span className="text-gray-500 text-xs">this period</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>Best period:</span>
                <span className="text-amber-200">
                  {summary.bestPeriod.period}
                </span>
                <span className="text-gray-500">
                  ({summary.bestPeriod.percentage}% completion)
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 w-full text-emerald-400 text-sm">
            <div>
              <span>Total points earned: </span>
              <span className="text-emerald-200 font-semibold">
                {summary.totalPoints}
              </span>
            </div>
            <div>
              <span className="text-gray-500">• Active periods: </span>
              <span className="text-blue-300 font-semibold">
                {summary.activePeriods}
              </span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
});

export default PerformanceChartRefined;
