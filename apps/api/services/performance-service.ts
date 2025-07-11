import db from "../src/db";
import { questInstance, user } from "../src/db/schema";
import { and, eq } from "drizzle-orm";

interface PerformanceData {
  day: string;
  date: string;
  percentage: number;
  completedPoints: number;
  totalPossiblePoints: number;
  questsCount: number;
  completedQuestsCount: number;
}

interface PerformanceSummary {
  averagePercentage: number;
  bestPeriod: {
    period: string;
    percentage: number;
  };
  totalPoints: number;
  activePeriods: number;
}

export interface PerformanceResponse {
  message: string;
  period?: string;
  performanceData: PerformanceData[];
  summary: PerformanceSummary;
}

type PeriodType = "weekly" | "monthly" | "quarterly" | "yearly" | "overall";

export class PerformanceService {
  /**
   * Get user creation date
   */
  private async getUserCreationDate(userId: string): Promise<Date> {
    const [userData] = await db
      .select({ createdAt: user.createdAt })
      .from(user)
      .where(eq(user.id, userId));

    if (!userData) {
      throw new Error("User not found");
    }

    return new Date(userData.createdAt);
  }

  /**
   * Fetch quest data for a specific date
   */
  private async fetchQuestData(userId: string, date: string) {
    return await db
      .select({
        basePoints: questInstance.basePoints,
        completed: questInstance.completed,
      })
      .from(questInstance)
      .where(
        and(eq(questInstance.userId, userId), eq(questInstance.date, date))
      );
  }

  /**
   * Calculate performance metrics for a single day
   */
  private calculateDayMetrics(
    quests: Array<{ basePoints: number; completed: boolean }>,
    label: string,
    date: string
  ): PerformanceData {
    const totalPossiblePoints = quests.reduce(
      (sum, q) => sum + q.basePoints,
      0
    );
    const completedPoints = quests
      .filter((q) => q.completed)
      .reduce((sum, q) => sum + q.basePoints, 0);

    const percentage =
      totalPossiblePoints > 0
        ? Math.round((completedPoints / totalPossiblePoints) * 100)
        : 0;

    return {
      day: label,
      date,
      percentage,
      completedPoints,
      totalPossiblePoints,
      questsCount: quests.length,
      completedQuestsCount: quests.filter((q) => q.completed).length,
    };
  }

  /**
   * Generate date range based on period and user creation date
   */
  private async generateDateRange(
    userId: string,
    period: PeriodType
  ): Promise<Date[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userCreated = await this.getUserCreationDate(userId);
    userCreated.setHours(0, 0, 0, 0);

    const periodDays = {
      weekly: 7,
      monthly: 30,
      quarterly: 90,
      yearly: 365,
      overall:
        Math.floor(
          (today.getTime() - userCreated.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1,
    };

    const daysBack = periodDays[period];
    const startDate =
      period === "overall"
        ? new Date(userCreated)
        : new Date(
            Math.max(
              userCreated.getTime(),
              today.getTime() - (daysBack - 1) * 24 * 60 * 60 * 1000
            )
          );

    const dates: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= today) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  /**
   * Format date label based on period type
   */
  private formatDateLabel(date: Date, period: PeriodType): string {
    const formatters = {
      weekly: { weekday: "short" },
      monthly: { month: "short", day: "numeric" },
      quarterly: { month: "short", day: "numeric" },
      yearly: { month: "short", day: "numeric" },
      overall: { month: "short", day: "numeric", year: "2-digit" },
    } as const;

    return date.toLocaleDateString("en-US", formatters[period]);
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(
    performanceData: PerformanceData[]
  ): PerformanceSummary {
    if (performanceData.length === 0) {
      return {
        averagePercentage: 0,
        bestPeriod: { period: "N/A", percentage: 0 },
        totalPoints: 0,
        activePeriods: 0,
      };
    }

    // Average all percentages (including 0% for inactive days)
    const averagePercentage = Math.round(
      performanceData.reduce((sum, item) => sum + item.percentage, 0) /
        performanceData.length
    );

    const bestPeriod = performanceData.reduce((best, current) =>
      current.percentage > best.percentage ? current : best
    );

    const totalPoints = performanceData.reduce(
      (sum, item) => sum + item.completedPoints,
      0
    );
    const activePeriods = performanceData.filter(
      (item) => item.totalPossiblePoints > 0
    ).length;

    return {
      averagePercentage,
      bestPeriod: {
        period: bestPeriod.day,
        percentage: bestPeriod.percentage,
      },
      totalPoints,
      activePeriods,
    };
  }

  /**
   * Get daily performance data
   */
  private async getDailyPerformance(
    userId: string,
    period: PeriodType
  ): Promise<PerformanceData[]> {
    const dates = await this.generateDateRange(userId, period);

    const performanceData = await Promise.all(
      dates.map(async (date) => {
        const dateStr = date.toISOString().split("T")[0];
        const quests = await this.fetchQuestData(userId, dateStr);
        const label = this.formatDateLabel(date, period);
        return this.calculateDayMetrics(quests, label, dateStr);
      })
    );

    return performanceData;
  }

  /**
   * Group dates by week (Sunday to Saturday)
   */
  private groupByWeek(dates: Date[]): Date[][] {
    const weeks: Map<string, Date[]> = new Map();

    dates.forEach((date) => {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Go to Sunday
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeks.has(weekKey)) {
        weeks.set(weekKey, []);
      }
      weeks.get(weekKey)!.push(date);
    });

    return Array.from(weeks.values()).map((week) =>
      week.sort((a, b) => a.getTime() - b.getTime())
    );
  }

  /**
   * Group dates by month
   */
  private groupByMonth(dates: Date[]): Date[][] {
    const months: Map<string, Date[]> = new Map();

    dates.forEach((date) => {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!months.has(monthKey)) {
        months.set(monthKey, []);
      }
      months.get(monthKey)!.push(date);
    });

    return Array.from(months.values()).map((month) =>
      month.sort((a, b) => a.getTime() - b.getTime())
    );
  }

  /**
   * Format week range label
   */
  private formatWeekLabel(startDate: Date, endDate: Date): string {
    const start = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${start}-${endDate.getDate()}`;
    } else {
      const end = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${start} - ${end}`;
    }
  }

  /**
   * Format month label
   */
  private formatMonthLabel(date: Date): string {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  }

  /**
   * Aggregate daily data into batches (weekly or monthly)
   */
  private async aggregateDailyData(
    userId: string,
    dateGroups: Date[][],
    labelFormatter: (startDate: Date, endDate: Date) => string
  ): Promise<PerformanceData[]> {
    const aggregatedData: PerformanceData[] = [];

    for (const group of dateGroups) {
      if (group.length === 0) continue;

      // Get daily metrics for all dates in this group
      const dailyMetrics = await Promise.all(
        group.map(async (date) => {
          const dateStr = date.toISOString().split("T")[0];
          const quests = await this.fetchQuestData(userId, dateStr);
          const label = "";
          return this.calculateDayMetrics(quests, label, dateStr);
        })
      );

      // Calculate aggregated metrics
      const startDate = group[0];
      const endDate = group[group.length - 1];
      const label = labelFormatter(startDate, endDate);

      // Sum totals
      const totalCompletedPoints = dailyMetrics.reduce(
        (sum, day) => sum + day.completedPoints,
        0
      );
      const totalPossiblePoints = dailyMetrics.reduce(
        (sum, day) => sum + day.totalPossiblePoints,
        0
      );
      const totalQuests = dailyMetrics.reduce(
        (sum, day) => sum + day.questsCount,
        0
      );
      const totalCompletedQuests = dailyMetrics.reduce(
        (sum, day) => sum + day.completedQuestsCount,
        0
      );

      // Average the daily percentages (including inactive days as 0%)
      const averagePercentage = Math.round(
        dailyMetrics.reduce((sum, day) => sum + day.percentage, 0) /
          dailyMetrics.length
      );

      aggregatedData.push({
        day: label,
        date: startDate.toISOString().split("T")[0],
        percentage: averagePercentage,
        completedPoints: totalCompletedPoints,
        totalPossiblePoints: totalPossiblePoints,
        questsCount: totalQuests,
        completedQuestsCount: totalCompletedQuests,
      });
    }

    return aggregatedData;
  }

  /**
   * Get weekly batched performance (for quarterly view)
   */
  private async getWeeklyBatchedPerformance(
    userId: string,
    period: PeriodType
  ): Promise<PerformanceData[]> {
    const dates = await this.generateDateRange(userId, period);
    const weekGroups = this.groupByWeek(dates);

    return this.aggregateDailyData(userId, weekGroups, (start, end) =>
      this.formatWeekLabel(start, end)
    );
  }

  /**
   * Get monthly batched performance (for yearly view)
   */
  private async getMonthlyBatchedPerformance(
    userId: string,
    period: PeriodType
  ): Promise<PerformanceData[]> {
    const dates = await this.generateDateRange(userId, period);
    const monthGroups = this.groupByMonth(dates);

    return this.aggregateDailyData(userId, monthGroups, (start) =>
      this.formatMonthLabel(start)
    );
  }

  /**
   * Main method to get performance data
   */
  async getPerformance(
    userId: string,
    period: PeriodType
  ): Promise<PerformanceResponse> {
    let performanceData: PerformanceData[];

    // Determine how to batch the data based on period
    switch (period) {
      case "quarterly":
        performanceData = await this.getWeeklyBatchedPerformance(
          userId,
          period
        );
        break;
      case "yearly":
        performanceData = await this.getMonthlyBatchedPerformance(
          userId,
          period
        );
        break;
      default:
        performanceData = await this.getDailyPerformance(userId, period);
        break;
    }

    const summary = this.calculateSummary(performanceData);
    const periodName = period.charAt(0).toUpperCase() + period.slice(1);

    return {
      message: `${periodName} performance retrieved successfully`,
      period,
      performanceData,
      summary,
    };
  }

  /**
   * Legacy weekly performance endpoint
   */
  async getWeeklyPerformance(userId: string): Promise<PerformanceResponse> {
    const result = await this.getPerformance(userId, "weekly");

    // Transform to match legacy format
    return {
      ...result,
      message: "Weekly performance retrieved successfully",
    };
  }
}

export const performanceService = new PerformanceService();
