import type { DietType, FitnessGoal } from '@/features/preferences';

export const DIET_OPTIONS: { value: DietType; title: string; sub: string }[] = [
  {
    value: 'vegetarian',
    title: 'Vegetarian',
    sub: 'Dal, paneer, curd, tofu, and whole-food staples.',
  },
  {
    value: 'non_vegetarian',
    title: 'Non-vegetarian',
    sub: 'Chicken, eggs, fish, and flexible protein-forward meals.',
  },
  {
    value: 'eggetarian',
    title: 'Eggetarian',
    sub: 'Vegetarian meals with eggs as an easy everyday protein.',
  },
  {
    value: 'vegan',
    title: 'Vegan',
    sub: 'Plant-based meals designed for satiety and consistency.',
  },
];

export const GOAL_OPTIONS: { value: FitnessGoal; title: string; sub: string }[] = [
  {
    value: 'fat_loss',
    title: 'Fat loss',
    sub: 'A sustainable calorie deficit that still protects recovery.',
  },
  {
    value: 'muscle_gain',
    title: 'Muscle gain',
    sub: 'Higher protein, structured meals, and steady training support.',
  },
  {
    value: 'maintenance',
    title: 'Maintenance',
    sub: 'Balanced meals and dependable routines without over-correcting.',
  },
];

export const MEAL_COUNT_OPTIONS = [2, 3, 4, 5, 6] as const;
export const PREP_TIME_OPTIONS = [15, 30, 45, 60] as const;

export const DIET_LABELS: Record<DietType, string> = {
  vegetarian: 'Vegetarian',
  non_vegetarian: 'Non-vegetarian',
  eggetarian: 'Eggetarian',
  vegan: 'Vegan',
};

export const GOAL_LABELS: Record<FitnessGoal, string> = {
  fat_loss: 'Fat loss',
  muscle_gain: 'Muscle gain',
  maintenance: 'Maintenance',
};
