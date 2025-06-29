import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../lib/supabaseClient';
import type { 
  VolumeData, 
  TimeFrame, 
  MuscleGroup, 
  VolumeQueryParams
} from '../types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const volumeQueryKeys = {
  all: ['volume'] as const,
  lists: () => [...volumeQueryKeys.all, 'list'] as const,
  list: (filters: Partial<VolumeQueryParams>) => [...volumeQueryKeys.lists(), filters] as const,
  details: () => [...volumeQueryKeys.all, 'detail'] as const,
  detail: (userId: string, timeframe: TimeFrame) => [...volumeQueryKeys.details(), userId, timeframe] as const,
  fatigue: (userId: string) => [...volumeQueryKeys.all, 'fatigue', userId] as const,
  tonnage: (userId: string, timeframe: TimeFrame) => [...volumeQueryKeys.all, 'tonnage', userId, timeframe] as const,
} as const;

// ============================================================================
// TYPES FOR RPC RESPONSES
// ============================================================================

interface VolumeRPCResponse {
  muscle: string;
  sets: number;
  reps: number;
  volume: number;
  tonnage: number;
  volume_load: number;
}

interface FatigueRPCResponse {
  fatigue_score: number;
  volume_ratio: number;
  recent_volume: number;
  baseline_volume: number;
}

interface DashboardMetricsResponse {
  total_sets: number;
  total_tonnage: number;
  total_volume_load: number;
  session_count: number;
  adherence_percentage: number;
  average_rir: number | null;
}

// ============================================================================
// VOLUME DATA HOOKS
// ============================================================================

/**
 * Fetch volume/tonnage data for a specific timeframe
 */
export const useVolumeData = (
  userId: string | undefined,
  timeframe: TimeFrame,
  options?: {
    startDate?: string;
    endDate?: string;
    muscleGroups?: MuscleGroup[];
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: volumeQueryKeys.detail(userId || '', timeframe),
    queryFn: async (): Promise<VolumeData[]> => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase.rpc('get_volume_tonnage', {
        p_user_id: userId,
        p_timeframe: timeframe,
        p_start_date: options?.startDate || null,
        p_end_date: options?.endDate || null,
        p_muscle_groups: options?.muscleGroups || null,
      });

      if (error) {
        console.error('Error fetching volume data:', error);
        throw new Error(`Failed to fetch volume data: ${error.message}`);
      }

      // Transform RPC response to VolumeData interface
      return (data as VolumeRPCResponse[]).map((item): VolumeData => ({
        muscle: item.muscle as MuscleGroup,
        sets: item.sets,
        reps: item.reps,
        volume: item.volume,
        tonnage: item.tonnage,
        volume_load: item.volume_load,
      }));
    },
    enabled: !!userId && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

/**
 * Fetch volume data for multiple timeframes at once
 */
export const useMultiTimeframeVolume = (
  userId: string | undefined,
  timeframes: TimeFrame[],
  enabled: boolean = true
) => {
  const queries = timeframes.map(timeframe => ({
    queryKey: volumeQueryKeys.detail(userId || '', timeframe),
    queryFn: async (): Promise<VolumeData[]> => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase.rpc('get_volume_tonnage', {
        p_user_id: userId,
        p_timeframe: timeframe,
        p_start_date: null,
        p_end_date: null,
        p_muscle_groups: null,
      });

      if (error) throw new Error(`Failed to fetch ${timeframe} data: ${error.message}`);

      return (data as VolumeRPCResponse[]).map((item): VolumeData => ({
        muscle: item.muscle as MuscleGroup,
        sets: item.sets,
        reps: item.reps,
        volume: item.volume,
        tonnage: item.tonnage,
        volume_load: item.volume_load,
      }));
    },
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  }));

  // This would typically use useQueries in TanStack Query v5
  // For now, we'll return a helper that can be used with individual useQuery calls
  return {
    queries,
    timeframes,
  };
};

// ============================================================================
// FATIGUE CALCULATION HOOKS
// ============================================================================

/**
 * Fetch calculated fatigue score for a user
 */
export const useFatigueScore = (
  userId: string | undefined,
  daysBack: number = 7,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: volumeQueryKeys.fatigue(userId || ''),
    queryFn: async (): Promise<number> => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase.rpc('calculate_fatigue_score', {
        p_user_id: userId,
        p_days_back: daysBack,
      });

      if (error) {
        console.error('Error calculating fatigue score:', error);
        throw new Error(`Failed to calculate fatigue: ${error.message}`);
      }

      return data as number;
    },
    enabled: !!userId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes (fatigue changes more frequently)
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true, // Refetch fatigue when user returns to app
    retry: 2,
  });
};

/**
 * Fetch detailed fatigue analysis
 */
export const useFatigueAnalysis = (
  userId: string | undefined,
  muscleGroups: MuscleGroup[],
  timeWindowDays: number = 7,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...volumeQueryKeys.fatigue(userId || ''), 'analysis', muscleGroups, timeWindowDays],
    queryFn: async (): Promise<FatigueRPCResponse> => {
      if (!userId) throw new Error('User ID is required');

      // This would be a more complex RPC function for detailed fatigue analysis
      const { data, error } = await supabase.rpc('get_fatigue_analysis', {
        p_user_id: userId,
        p_muscle_groups: muscleGroups,
        p_time_window_days: timeWindowDays,
      });

      if (error) {
        console.error('Error fetching fatigue analysis:', error);
        throw new Error(`Failed to fetch fatigue analysis: ${error.message}`);
      }

      return data as FatigueRPCResponse;
    },
    enabled: !!userId && enabled && muscleGroups.length > 0,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// ============================================================================
// DASHBOARD METRICS HOOKS
// ============================================================================

/**
 * Fetch comprehensive dashboard metrics
 */
export const useDashboardMetrics = (
  userId: string | undefined,
  timeframe: TimeFrame = 'week',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...volumeQueryKeys.all, 'dashboard', userId, timeframe],
    queryFn: async (): Promise<DashboardMetricsResponse> => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase.rpc('get_dashboard_metrics', {
        p_user_id: userId,
        p_timeframe: timeframe,
      });

      if (error) {
        console.error('Error fetching dashboard metrics:', error);
        throw new Error(`Failed to fetch dashboard metrics: ${error.message}`);
      }

      return data as DashboardMetricsResponse;
    },
    enabled: !!userId && enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

// ============================================================================
// VOLUME LANDMARKS HOOKS
// ============================================================================

/**
 * Fetch user's volume landmarks
 */
export const useVolumeLandmarks = (
  userId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...volumeQueryKeys.all, 'landmarks', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const { data, error } = await supabase
        .from('volume_landmarks')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching volume landmarks:', error);
        throw new Error(`Failed to fetch volume landmarks: ${error.message}`);
      }

      return data;
    },
    enabled: !!userId && enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes (landmarks change infrequently)
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Update volume landmarks
 */
export const useUpdateVolumeLandmarks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (landmarks: {
      userId: string;
      muscleGroup: MuscleGroup;
      mv: number;
      mev: number;
      mav: number;
      mrv: number;
    }) => {
      const { data, error } = await supabase
        .from('volume_landmarks')
        .upsert({
          user_id: landmarks.userId,
          muscle_group: landmarks.muscleGroup,
          mv: landmarks.mv,
          mev: landmarks.mev,
          mav: landmarks.mav,
          mrv: landmarks.mrv,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        throw new Error(`Failed to update volume landmarks: ${error.message}`);
      }

      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate and refetch volume landmarks
      queryClient.invalidateQueries({
        queryKey: [...volumeQueryKeys.all, 'landmarks', variables.userId],
      });
      
      // Also invalidate dashboard metrics as they may depend on landmarks
      queryClient.invalidateQueries({
        queryKey: [...volumeQueryKeys.all, 'dashboard', variables.userId],
      });
    },
    onError: (error) => {
      console.error('Error updating volume landmarks:', error);
    },
  });
};

/**
 * Refresh volume data (useful for manual refresh buttons)
 */
export const useRefreshVolumeData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // This could trigger a recalculation or just invalidate cache
      return Promise.resolve(userId);
    },
    onSuccess: (_userId) => {
      // Invalidate all volume-related queries for this user
      queryClient.invalidateQueries({
        queryKey: volumeQueryKeys.all,
      });
    },
  });
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Check if any volume queries are loading
 */
export const useVolumeLoadingState = (_userId: string | undefined) => {
  const queryClient = useQueryClient();
  
  // This is a simplified version - in practice, you might want to check specific queries
  const queries = queryClient.getQueriesData({
    queryKey: volumeQueryKeys.all,
  });

  const isLoading = queries.some(([queryKey]) => {
    const queryState = queryClient.getQueryState(queryKey);
    return queryState?.status === 'pending';
  });

  return { isLoading };
};

/**
 * Get cached volume data without triggering a fetch
 */
export const useVolumeDataCache = (userId: string, timeframe: TimeFrame) => {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<VolumeData[]>(
    volumeQueryKeys.detail(userId, timeframe)
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  useVolumeData,
  useMultiTimeframeVolume,
  useFatigueScore,
  useFatigueAnalysis,
  useDashboardMetrics,
  useVolumeLandmarks,
  useUpdateVolumeLandmarks,
  useRefreshVolumeData,
  useVolumeLoadingState,
  useVolumeDataCache,
  volumeQueryKeys,
};
