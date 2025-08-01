// Optimized React Query configuration for better performance

export const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection time
  refetchOnWindowFocus: false, // Reduce unnecessary refetches
  refetchOnMount: false, // Only refetch if data is stale
  retry: 2, // Reduce retry attempts
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

export const longCacheOptions = {
  ...defaultQueryOptions,
  staleTime: 15 * 60 * 1000, // 15 minutes for less frequently changing data
  gcTime: 30 * 60 * 1000, // 30 minutes
};

export const shortCacheOptions = {
  ...defaultQueryOptions,
  staleTime: 1 * 60 * 1000, // 1 minute for frequently changing data
  gcTime: 5 * 60 * 1000, // 5 minutes
};

// Specific configurations for different data types
export const queryConfigs = {
  userStats: defaultQueryOptions,
  performance: longCacheOptions,
  todaysQuests: shortCacheOptions,
  questTemplates: longCacheOptions,
  achievements: longCacheOptions,
  mainQuests: defaultQueryOptions,
};