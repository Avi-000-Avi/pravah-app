/**
 * Pantry hooks — typed TanStack Query access to pantry_items.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { track } from '@/lib/analytics';
import { addPantryItem, listPantryItems, removePantryItem, replaceStaples } from '@/lib/pantry';
import type { PantrySource } from '@/types/domain';

export const PANTRY_QUERY_KEY = 'pantry' as const;
export const PLAN_QUERY_KEY = 'plan' as const;

export function usePantryItems() {
  return useQuery({
    queryKey: [PANTRY_QUERY_KEY],
    queryFn: listPantryItems,
  });
}

function useInvalidatePantry() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: [PANTRY_QUERY_KEY] });
    // Pantry contents shape future plan generation, not today's saved plan.
  };
}

export function useAddPantryItem() {
  const invalidate = useInvalidatePantry();
  return useMutation({
    mutationFn: ({ ingredientId, source }: { ingredientId: string; source: PantrySource }) =>
      addPantryItem(ingredientId, source),
    onSuccess: (_item, variables) => {
      invalidate();
      track('pantry_item_added', { source: variables.source });
    },
  });
}

export function useRemovePantryItem() {
  const invalidate = useInvalidatePantry();
  return useMutation({
    mutationFn: (ingredientId: string) => removePantryItem(ingredientId),
    onSuccess: invalidate,
  });
}

export function useReplaceStaples() {
  const invalidate = useInvalidatePantry();
  return useMutation({
    mutationFn: (ingredientIds: string[]) => replaceStaples(ingredientIds),
    onSuccess: invalidate,
  });
}
