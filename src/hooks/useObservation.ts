/**
 * Observation hook — the morning ritual's one always-true line.
 */
import { useQuery } from '@tanstack/react-query';
import { listRecentLeftoverEvents } from '@/lib/leftoverEvents';
import { listLogs } from '@/lib/mealLogs';
import { chooseObservation } from '@/lib/observations';
import { formatDateKey } from '@/lib/planner';
import { listRecentPlans } from '@/lib/plans';

function lastDays(count: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    return formatDateKey(d);
  });
}

export function useObservation() {
  const todayKey = formatDateKey(new Date());
  return useQuery({
    queryKey: ['observation', todayKey],
    queryFn: async () => {
      const dates = lastDays(15);
      const [plans, logs, leftoverEvents] = await Promise.all([
        listRecentPlans(todayKey, 7),
        listLogs(dates),
        listRecentLeftoverEvents(30),
      ]);
      return chooseObservation({ todayKey, plans, logs, leftoverEvents });
    },
    staleTime: 60 * 60 * 1000,
  });
}
