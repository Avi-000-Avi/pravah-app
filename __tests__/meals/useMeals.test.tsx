import { renderHook, waitFor } from '@testing-library/react-native';
import { supabase } from '@/lib/supabase';
import { captureError } from '@/lib/monitoring';
import { useMeals } from '@/features/meals/hooks/useMeals';
import { createQueryWrapper } from '../testUtils';

const mockSupabase = supabase as unknown as {
  from: jest.Mock;
};

interface MockQueryChain {
  eq: (column: string, value: unknown) => MockQueryChain;
  order: (column: string) => MockQueryChain;
  then: PromiseLike<unknown>['then'];
}

function createQueryResult(result: unknown) {
  const query: MockQueryChain = {
    eq: jest.fn(() => query),
    order: jest.fn(() => query),
    then: (onfulfilled, onrejected) => Promise.resolve(result).then(onfulfilled, onrejected),
  };

  return { query, select: jest.fn(() => query) };
}

describe('useMeals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('coerces numeric meal fields and applies filters', async () => {
    const response = {
      data: [
        {
          id: 'meal-1',
          slug: 'paneer-bowl',
          name: 'Paneer bowl',
          description: 'Protein-first lunch',
          meal_slot: 'breakfast',
          diet_type: 'vegetarian',
          cuisine: 'Indian',
          image_url: null,
          prep_time_min: 20,
          calories_kcal: 430,
          protein_g: '28',
          carbs_g: '42',
          fat_g: '12',
          tags: [],
          is_active: true,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ],
      error: null,
    };

    const { query, select } = createQueryResult(response);
    mockSupabase.from.mockReturnValue({ select });

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useMeals({ slot: 'breakfast', dietType: 'vegetarian' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenCalledWith('is_active', true);
    expect(query.eq).toHaveBeenCalledWith('meal_slot', 'breakfast');
    expect(query.eq).toHaveBeenCalledWith('diet_type', 'vegetarian');
    expect(result.current.data?.[0]?.protein_g).toBe(28);
    expect(result.current.data?.[0]?.carbs_g).toBe(42);
    expect(result.current.data?.[0]?.fat_g).toBe(12);
  });

  it('captures and surfaces Supabase errors', async () => {
    const supabaseError = new Error('boom');
    const { select } = createQueryResult({ data: null, error: supabaseError });
    mockSupabase.from.mockReturnValue({ select });

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useMeals(), { wrapper });

    await waitFor(() => expect(result.current.error).toBeDefined());

    expect(captureError).toHaveBeenCalledWith(supabaseError, { action: 'read_meals' });
  });
});
