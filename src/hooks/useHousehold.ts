/**
 * Household + time-constraint hooks.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getHousehold,
  getTimeConstraints,
  setHousehold,
  setTimeConstraints,
} from '@/lib/household';
import type { HouseholdSizeBucket, TimeConstraints } from '@/types/domain';

export const HOUSEHOLD_QUERY_KEY = 'household' as const;
export const TIME_CONSTRAINTS_QUERY_KEY = 'time-constraints' as const;

export function useHousehold() {
  return useQuery({ queryKey: [HOUSEHOLD_QUERY_KEY], queryFn: getHousehold });
}

export function useSetHousehold() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sizeBucket: HouseholdSizeBucket) => setHousehold(sizeBucket),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: [HOUSEHOLD_QUERY_KEY] }),
  });
}

export function useTimeConstraints() {
  return useQuery({ queryKey: [TIME_CONSTRAINTS_QUERY_KEY], queryFn: getTimeConstraints });
}

export function useSetTimeConstraints() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (constraints: TimeConstraints) => setTimeConstraints(constraints),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: [TIME_CONSTRAINTS_QUERY_KEY] }),
  });
}
