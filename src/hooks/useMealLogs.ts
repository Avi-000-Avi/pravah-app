/**
 * Meal log hooks — three-tap logging and reads for the tally,
 * Sunday review and observations.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { track } from '@/lib/analytics';
import { listLogs, logMeal, type LogMealInput } from '@/lib/mealLogs';

export const MEAL_LOGS_QUERY_KEY = 'meal-logs' as const;

export function useMealLogs(dates: string[]) {
  return useQuery({
    queryKey: [MEAL_LOGS_QUERY_KEY, ...dates],
    queryFn: () => listLogs(dates),
    enabled: dates.length > 0,
  });
}

export function useLogMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LogMealInput) => logMeal(input),
    onSuccess: (_log, input) => {
      void queryClient.invalidateQueries({ queryKey: [MEAL_LOGS_QUERY_KEY] });
      track('meal_logged', { status: input.status, slot: input.slot });
    },
  });
}
