import db from "../src/db";
import { questInstance, user } from "../src/db/schema";
import { and, eq } from "drizzle-orm";
import { getUserTimezone } from "../src/utils/dates";
import { toLocalDbDate, getLocalDateMidnight } from "@questly/utils";

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
    const userTimezone = await getUserTimezone(userId);
    const today = getLocalDateMidnight(new Date(), userTimezone);

    const userCreated = await this.getUserCreationDate(userId);
    const userCreatedMidnight = getLocalDateMidnight(userCreated, userTimezone);

    const periodDays = {
      weekly: 7,
      monthly: 30,
      quarterly: 90,
      yearly: 365,
      overall:
        Math.floor(
          (today.getTime() - userCreatedMidnight.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1,
    };

    const daysBack = periodDays[period];
    const startDate =
      period === "overall"
        ? new Date(userCreatedMidnight)
        : new Date(
            Math.max(
              userCreatedMidnight.getTime(),
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
  private formatDateLabel(
    date: Date,
    period: PeriodType,
    userTimezone?: string
  ): string {
    const formatters = {
      weekly: { weekday: "short" } as const,
      monthly: { month: "short", day: "numeric" } as const,
      quarterly: { month: "short", day: "numeric" } as const,
      yearly: { month: "short", day: "numeric" } as const,
      overall: { month: "short", day: "numeric", year: "2-digit" } as const,
    } as const;

    // Ensure labels are formatted in the user's timezone to prevent day shifting in UTC environments
    return date.toLocaleDateString("en-US", {
      ...(formatters[period] as Intl.DateTimeFormatOptions),
      timeZone: userTimezone,
    });
  }

  /**
   * Format local date string (YYYY-MM-DD) in user's timezone
   */
  private formatLocalDateString(date: Date, userTimezone: string): string {
    return toLocalDbDate(date, userTimezone);
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
    const userTimezone = await getUserTimezone(userId);
    const dates = await this.generateDateRange(userId, period);

    const performanceData = await Promise.all(
      dates.map(async (date) => {
        const dateStr = this.formatLocalDateString(date, userTimezone);
        const quests = await this.fetchQuestData(userId, dateStr);
        const label = this.formatDateLabel(date, period, userTimezone);
        return this.calculateDayMetrics(quests, label, dateStr);
      })
    );

    return performanceData;
  }

  /**
   * Format week range label
   */
  private formatWeekLabel(
    startDate: Date,
    endDate: Date,
    userTimezone?: string
  ): string {
    const start = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: userTimezone,
    });

    const sameMonth =
      new Date(
        startDate.toLocaleString("en-US", { timeZone: userTimezone })
      ).getMonth() ===
      new Date(
        endDate.toLocaleString("en-US", { timeZone: userTimezone })
      ).getMonth();

    if (sameMonth) {
      const endDay = endDate.toLocaleDateString("en-US", {
        day: "numeric",
        timeZone: userTimezone,
      });
      return `${start}-${endDay}`;
    } else {
      const end = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: userTimezone,
      });
      return `${start} - ${end}`;
    }
  }

  /**
   * Format month label
   */
  private formatMonthLabel(date: Date, userTimezone?: string): string {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
      timeZone: userTimezone,
    });
  }

  /**
   * Group dates by week (Sunday to Saturday) in the user's timezone
   */
  private groupByWeek(dates: Date[], userTimezone: string): Date[][] {
    const weeks: Map<string, Date[]> = new Map();

    dates.forEach((date) => {
      const local = new Date(
        date.toLocaleString("en-US", { timeZone: userTimezone })
      );
      // Compute Sunday start in user's local time
      const weekStartLocal = new Date(local);
      weekStartLocal.setHours(0, 0, 0, 0);
      weekStartLocal.setDate(
        weekStartLocal.getDate() - weekStartLocal.getDay()
      );
      // Key by local Sunday (YYYY-MM-DD in user's TZ)
      const weekKey = toLocalDbDate(
        getLocalDateMidnight(weekStartLocal, userTimezone),
        userTimezone
      );

      if (!weeks.has(weekKey)) weeks.set(weekKey, []);
      weeks.get(weekKey)!.push(date);
    });

    return Array.from(weeks.values()).map((week) =>
      week.sort((a, b) => a.getTime() - b.getTime())
    );
  }

  /**
   * Group dates by month in the user's timezone
   */
  private groupByMonth(dates: Date[], userTimezone: string): Date[][] {
    const months: Map<string, Date[]> = new Map();

    dates.forEach((date) => {
      const local = new Date(
        date.toLocaleString("en-US", { timeZone: userTimezone })
      );
      const key = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}`;
      if (!months.has(key)) months.set(key, []);
      months.get(key)!.push(date);
    });

    return Array.from(months.values()).map((month) =>
      month.sort((a, b) => a.getTime() - b.getTime())
    );
  }

  /**
   * Aggregate daily data into batches (weekly or monthly)
   */
  private async aggregateDailyData(
    userId: string,
    dateGroups: Date[][],
    labelFormatter: (startDate: Date, endDate: Date) => string
  ): Promise<PerformanceData[]> {
    const userTimezone = await getUserTimezone(userId);
    const aggregatedData: PerformanceData[] = [];

    for (const group of dateGroups) {
      if (group.length === 0) continue;

      // Get daily metrics for all dates in this group
      const dailyMetrics = await Promise.all(
        group.map(async (date) => {
          const dateStr = this.formatLocalDateString(date, userTimezone);
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
        date: this.formatLocalDateString(startDate, userTimezone),
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
    const userTimezone = await getUserTimezone(userId);
    const dates = await this.generateDateRange(userId, period);
    const weekGroups = this.groupByWeek(dates, userTimezone);

    return this.aggregateDailyData(userId, weekGroups, (start, end) =>
      this.formatWeekLabel(start, end, userTimezone)
    );
  }

  /**
   * Get monthly batched performance (for yearly view)
   */
  private async getMonthlyBatchedPerformance(
    userId: string,
    period: PeriodType
  ): Promise<PerformanceData[]> {
    const userTimezone = await getUserTimezone(userId);
    const dates = await this.generateDateRange(userId, period);
    const monthGroups = this.groupByMonth(dates, userTimezone);

    return this.aggregateDailyData(userId, monthGroups, (start) =>
      this.formatMonthLabel(start, userTimezone)
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

  /**
   * New table performance endpoint with specific data ranges
   */
  async getTablePerformance(
    userId: string,
    period: "daily" | "weekly" | "monthly" | "yearly"
  ): Promise<PerformanceResponse> {
    const userTimezone = await getUserTimezone(userId);
    const userCreationDate = await this.getUserCreationDate(userId);
    let performanceData: PerformanceData[] = [];

    switch (period) {
      case "daily":
        // Get last 12 days of daily data
        performanceData = await this.getLastNDays(
          userId,
          userTimezone,
          12,
          userCreationDate
        );
        break;
      case "weekly":
        // Get last 12 weeks of weekly aggregated data
        performanceData = await this.getLastNWeeks(
          userId,
          userTimezone,
          12,
          userCreationDate
        );
        break;
      case "monthly":
        // Get last 12 months of monthly aggregated data
        performanceData = await this.getLastNMonths(
          userId,
          userTimezone,
          12,
          userCreationDate
        );
        break;
      case "yearly":
        // Get last 12 years of yearly aggregated data
        performanceData = await this.getLastNYears(
          userId,
          userTimezone,
          12,
          userCreationDate
        );
        break;
    }

    const summary = this.calculateSummary(performanceData);
    const periodName = period.charAt(0).toUpperCase() + period.slice(1);

    return {
      message: `${periodName} table performance retrieved successfully`,
      period,
      performanceData,
      summary,
    };
  }

  /**
   * Get last N days of data
   */
  private async getLastNDays(
    userId: string,
    userTimezone: string,
    n: number,
    userCreationDate: Date
  ): Promise<PerformanceData[]> {
    const performanceData: PerformanceData[] = [];
    const currentDate = getLocalDateMidnight(new Date(), userTimezone);

    for (let i = 0; i < n; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);

      // Skip dates before user creation
      if (date < userCreationDate) {
        continue;
      }

      const dateString = toLocalDbDate(date);

      const quests = await this.fetchQuestData(userId, dateString);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      performanceData.push(
        this.calculateDayMetrics(quests, dayName, dateString)
      );
    }

    return performanceData;
  }

  /**
   * Get last N weeks of aggregated data
   */
  private async getLastNWeeks(
    userId: string,
    userTimezone: string,
    n: number,
    userCreationDate: Date
  ): Promise<PerformanceData[]> {
    const performanceData: PerformanceData[] = [];
    const currentDate = getLocalDateMidnight(new Date(), userTimezone);

    for (let i = 0; i < n; i++) {
      const weekStartDate = new Date(currentDate);
      weekStartDate.setDate(
        weekStartDate.getDate() - i * 7 - weekStartDate.getDay()
      );

      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      // Skip weeks that start before user creation
      if (weekEndDate < userCreationDate) {
        continue;
      }

      // Get all days in this week
      const weekData: PerformanceData[] = [];
      for (let day = 0; day < 7; day++) {
        const dayDate = new Date(weekStartDate);
        dayDate.setDate(dayDate.getDate() + day);
        const dateString = toLocalDbDate(dayDate);

        const quests = await this.fetchQuestData(userId, dateString);
        const dayName = dayDate.toLocaleDateString("en-US", {
          weekday: "short",
        });

        weekData.push(this.calculateDayMetrics(quests, dayName, dateString));
      }

      // Aggregate week data
      const totalQuests = weekData.reduce(
        (sum, day) => sum + day.questsCount,
        0
      );
      const totalCompletedQuests = weekData.reduce(
        (sum, day) => sum + day.completedQuestsCount,
        0
      );
      const totalPoints = weekData.reduce(
        (sum, day) => sum + day.totalPossiblePoints,
        0
      );
      const totalCompletedPoints = weekData.reduce(
        (sum, day) => sum + day.completedPoints,
        0
      );

      const percentage =
        totalPoints > 0
          ? Math.round((totalCompletedPoints / totalPoints) * 100)
          : 0;

      performanceData.push({
        day: `Week ${i + 1}`,
        date: toLocalDbDate(weekStartDate),
        percentage,
        completedPoints: totalCompletedPoints,
        totalPossiblePoints: totalPoints,
        questsCount: totalQuests,
        completedQuestsCount: totalCompletedQuests,
      });
    }

    return performanceData;
  }

  /**
   * Get last N months of aggregated data
   */
  private async getLastNMonths(
    userId: string,
    userTimezone: string,
    n: number,
    userCreationDate: Date
  ): Promise<PerformanceData[]> {
    const performanceData: PerformanceData[] = [];
    const currentDate = getLocalDateMidnight(new Date(), userTimezone);

    for (let i = 0; i < n; i++) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(monthDate.getMonth() - i);
      monthDate.setDate(1); // Start of month

      const monthEndDate = new Date(monthDate);
      monthEndDate.setMonth(monthEndDate.getMonth() + 1);
      monthEndDate.setDate(0); // Last day of month

      // Skip months that end before user creation
      if (monthEndDate < userCreationDate) {
        continue;
      }

      // Get all days in this month
      const monthData: PerformanceData[] = [];
      const daysInMonth = monthEndDate.getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(monthDate);
        dayDate.setDate(day);
        const dateString = toLocalDbDate(dayDate);

        const quests = await this.fetchQuestData(userId, dateString);
        const dayName = dayDate.toLocaleDateString("en-US", {
          weekday: "short",
        });

        monthData.push(this.calculateDayMetrics(quests, dayName, dateString));
      }

      // Aggregate month data
      const totalQuests = monthData.reduce(
        (sum, day) => sum + day.questsCount,
        0
      );
      const totalCompletedQuests = monthData.reduce(
        (sum, day) => sum + day.completedQuestsCount,
        0
      );
      const totalPoints = monthData.reduce(
        (sum, day) => sum + day.totalPossiblePoints,
        0
      );
      const totalCompletedPoints = monthData.reduce(
        (sum, day) => sum + day.completedPoints,
        0
      );

      const percentage =
        totalPoints > 0
          ? Math.round((totalCompletedPoints / totalPoints) * 100)
          : 0;

      performanceData.push({
        day: monthDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        date: toLocalDbDate(monthDate),
        percentage,
        completedPoints: totalCompletedPoints,
        totalPossiblePoints: totalPoints,
        questsCount: totalQuests,
        completedQuestsCount: totalCompletedQuests,
      });
    }

    return performanceData;
  }

  /**
   * Get last N years of aggregated data
   */
  private async getLastNYears(
    userId: string,
    userTimezone: string,
    n: number,
    userCreationDate: Date
  ): Promise<PerformanceData[]> {
    const performanceData: PerformanceData[] = [];
    const currentDate = getLocalDateMidnight(new Date(), userTimezone);

    for (let i = 0; i < n; i++) {
      const yearDate = new Date(currentDate);
      yearDate.setFullYear(yearDate.getFullYear() - i);
      yearDate.setMonth(0, 1); // January 1st

      const yearEndDate = new Date(yearDate);
      yearEndDate.setFullYear(yearEndDate.getFullYear() + 1);
      yearEndDate.setDate(0); // Last day of year

      // Skip years that end before user creation
      if (yearEndDate < userCreationDate) {
        continue;
      }

      // Get all months in this year
      const yearData: PerformanceData[] = [];

      for (let month = 0; month < 12; month++) {
        const monthDate = new Date(yearDate);
        monthDate.setMonth(month, 1);

        const monthEndDate = new Date(monthDate);
        monthEndDate.setMonth(monthEndDate.getMonth() + 1);
        monthEndDate.setDate(0);

        // Get all days in this month
        const daysInMonth = monthEndDate.getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const dayDate = new Date(monthDate);
          dayDate.setDate(day);
          const dateString = toLocalDbDate(dayDate);

          const quests = await this.fetchQuestData(userId, dateString);
          const dayName = dayDate.toLocaleDateString("en-US", {
            weekday: "short",
          });

          yearData.push(this.calculateDayMetrics(quests, dayName, dateString));
        }
      }

      // Aggregate year data
      const totalQuests = yearData.reduce(
        (sum, day) => sum + day.questsCount,
        0
      );
      const totalCompletedQuests = yearData.reduce(
        (sum, day) => sum + day.completedQuestsCount,
        0
      );
      const totalPoints = yearData.reduce(
        (sum, day) => sum + day.totalPossiblePoints,
        0
      );
      const totalCompletedPoints = yearData.reduce(
        (sum, day) => sum + day.completedPoints,
        0
      );

      const percentage =
        totalPoints > 0
          ? Math.round((totalCompletedPoints / totalPoints) * 100)
          : 0;

      performanceData.push({
        day: yearDate.getFullYear().toString(),
        date: toLocalDbDate(yearDate),
        percentage,
        completedPoints: totalCompletedPoints,
        totalPossiblePoints: totalPoints,
        questsCount: totalQuests,
        completedQuestsCount: totalCompletedQuests,
      });
    }

    return performanceData;
  }
}

export const performanceService = new PerformanceService();
