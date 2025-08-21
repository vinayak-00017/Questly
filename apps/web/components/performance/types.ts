export interface PerformanceData {
  day: string;
  date: string;
  percentage: number;
  completedPoints: number;
  totalPossiblePoints: number;
  questsCount: number;
  completedQuestsCount: number;
}

export interface PerformanceSummary {
  averagePercentage: number;
  bestPeriod: {
    percentage: number;
    period: string;
  };
  totalPoints: number;
  activePeriods: number;
}

export interface PerformanceApiResponse {
  performanceData: PerformanceData[];
  summary: PerformanceSummary;
}

export type PeriodType = "daily" | "weekly" | "monthly" | "yearly";

export interface PeriodOption {
  value: PeriodType;
  label: string;
  description: string;
}
