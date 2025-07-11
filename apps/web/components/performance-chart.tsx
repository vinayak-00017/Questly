"use client";

import { TrendingUp, Crown, Calendar } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  ComposedChart,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import { useState, useMemo } from "react";
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  percentage: {
    label: "Points Completion %",
    color: "#f59e0b", // amber-500
  },
  trend: {
    label: "Trend Line",
    color: "#3b82f6", // blue-500
  },
} satisfies ChartConfig;

const periodOptions = [
  { value: "weekly", label: "Weekly", description: "Last 7 days" },
  { value: "monthly", label: "Monthly", description: "Last 30 days" },
  { value: "quarterly", label: "Quarterly", description: "Last 90 days" },
  { value: "yearly", label: "Yearly", description: "Last 52 weeks" },
  { value: "overall", label: "All Time", description: "Since you joined" },
];

export default function PerformanceChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const router = useRouter();

  const { data: performanceData, isLoading } = useQuery({
    queryKey: ["performance", selectedPeriod],
    queryFn: () => userApi.getPerformance(selectedPeriod),
  });

  // Handle click on chart data points
  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedData = data.activePayload[0].payload;
      const date = clickedData.date;
      const label = clickedData.day;

      // Navigate to detailed performance page
      router.push(
        `/performance/${date}?period=${selectedPeriod}&label=${encodeURIComponent(label)}`
      );
    }
  };

  // Calculate trend line using linear regression
  const calculateTrendLine = (data: any[]) => {
    if (data.length < 2) return data;

    const n = data.length;
    const xValues = data.map((_, index) => index);
    const yValues = data.map((item) => item.percentage);

    // Calculate linear regression (y = mx + b)
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
    const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;

    const numerator = xValues.reduce(
      (sum, x, i) => sum + (x - xMean) * (yValues[i] - yMean),
      0
    );
    const denominator = xValues.reduce((sum, x) => sum + (x - xMean) ** 2, 0);

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;

    return data.map((item, index) => ({
      ...item,
      percentage: Math.max(0, Math.min(100, item.percentage)), // Ensure percentage is clamped
      trend: Math.max(0, Math.min(100, slope * index + intercept)), // Clamp between 0-100
    }));
  };

  // Use API data or fallback to loading state
  const rawChartData = performanceData?.performanceData || [];
  const chartData = useMemo(() => {
    if (selectedPeriod === "weekly") {
      // Ensure even weekly data is clamped
      return rawChartData.map((item: any) => ({
        ...item,
        percentage: Math.max(0, Math.min(100, item.percentage || 0)),
      }));
    }
    return calculateTrendLine(rawChartData);
  }, [rawChartData, selectedPeriod]);

  const summary = performanceData?.summary || {
    averagePercentage: 0,
    bestPeriod: { period: "N/A", percentage: 0 },
    totalPoints: 0,
    activePeriods: 0,
  };

  const currentPeriodOption = periodOptions.find(
    (p) => p.value === selectedPeriod
  );
  const showTrendLine = selectedPeriod !== "weekly" && chartData.length > 1;

  // Calculate trend direction for display
  const getTrendInfo = () => {
    if (!showTrendLine || chartData.length < 2) return null;

    const firstTrend = chartData[0]?.trend || 0;
    const lastTrend = chartData[chartData.length - 1]?.trend || 0;
    const trendDiff = lastTrend - firstTrend;

    if (Math.abs(trendDiff) < 2)
      return { direction: "stable", icon: "→", color: "text-zinc-400" };
    if (trendDiff > 0)
      return { direction: "improving", icon: "↗", color: "text-green-400" };
    return { direction: "declining", icon: "↘", color: "text-red-400" };
  };

  const trendInfo = getTrendInfo();

  if (isLoading) {
    return (
      <Card className="bg-black/20 border-amber-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-amber-400 font-medieval flex items-center">
            <Crown className="h-5 w-5 mr-2" />
            Quest Completion Analytics
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Loading performance data...
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-zinc-400">Loading chart...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 border-amber-500/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-amber-400 font-medieval flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Quest Completion Analytics
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Track your quest completion progress over time -{" "}
              {currentPeriodOption?.description ||
                "Performance tracking over time"}
              {showTrendLine && (
                <span className="block text-xs mt-1 text-blue-400">
                  • Blue dashed line shows overall trend
                </span>
              )}
              <span className="block text-xs mt-1 text-amber-400">
                • Click on any data point for detailed view
              </span>
            </CardDescription>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 bg-black/30 border-amber-500/30 text-amber-400">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-amber-500/30">
              {periodOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-zinc-300 focus:bg-amber-500/20 focus:text-amber-400"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: selectedPeriod === "yearly" ? 60 : 5,
            }}
            onClick={handleChartClick}
            style={{ cursor: "pointer" }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#374151"
              strokeDasharray="3 3"
              opacity={0.3}
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              interval={
                selectedPeriod === "yearly"
                  ? "preserveStartEnd"
                  : selectedPeriod === "overall"
                    ? "preserveStartEnd"
                    : "preserveStart"
              }
              angle={selectedPeriod === "yearly" ? -45 : 0}
              textAnchor={selectedPeriod === "yearly" ? "end" : "middle"}
              height={selectedPeriod === "yearly" ? 80 : 30}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              allowDataOverflow={false}
              type="number"
            />
            <ChartTooltip
              cursor={{ fill: "rgba(245, 158, 11, 0.1)" }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(label) => `${label} (click for details)`}
                  formatter={(value, name) => {
                    if (name === "trend") {
                      return [`${Math.round(Number(value))}%`, "Trend"];
                    }
                    return [`${value}%`, name];
                  }}
                />
              }
            />
            <Area
              dataKey="percentage"
              type="monotone"
              fill="var(--color-percentage)"
              fillOpacity={0.4}
              stroke="var(--color-percentage)"
              strokeWidth={2}
              yAxisId="left"
              connectNulls={false}
              isAnimationActive={false}
              baseValue={0}
            />
            {showTrendLine && (
              <Line
                dataKey="trend"
                type="linear"
                stroke="var(--color-trend)"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={false}
                connectNulls={false}
                yAxisId="left"
              />
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none text-amber-400">
              Average completion: {summary.averagePercentage}% this period{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-zinc-400">
              Best period: {summary.bestPeriod.period} (
              {summary.bestPeriod.percentage}% completion)
            </div>
            {trendInfo && (
              <div
                className={`flex items-center gap-2 leading-none ${trendInfo.color}`}
              >
                <span className="text-lg">{trendInfo.icon}</span>
                Trend: {trendInfo.direction}
                {showTrendLine && (
                  <span className="text-xs opacity-70">(blue dashed line)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
