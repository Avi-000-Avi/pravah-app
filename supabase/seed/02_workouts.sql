insert into public.workouts (
  id,
  slug,
  name,
  description,
  duration_min,
  focus_area
) values
  (
    '8c8fa1d1-0fe9-4b46-9cb8-5f13072e0d74',
    'upper-body-strength',
    'Upper Body Strength',
    'Strength-focused push and pull session with steady rest pacing.',
    45,
    'Upper body'
  ),
  (
    'f64bd390-e68e-41c7-8cd7-9ffcce1bbbe7',
    'light-mobility-flow',
    'Light Mobility Flow',
    'Low-friction recovery session for lighter days and low-sleep mornings.',
    20,
    'Mobility'
  )
on conflict (slug) do nothing;

insert into public.workout_exercises (
  workout_id,
  sort_order,
  name,
  muscle,
  sets,
  reps,
  target_weight,
  previous_weight,
  rest_after_set_sec,
  rest_after_exercise_sec
) values
  ('8c8fa1d1-0fe9-4b46-9cb8-5f13072e0d74', 1, 'Bench Press', 'Chest', 3, '8–10', '60kg', '58kg', 60, 90),
  ('8c8fa1d1-0fe9-4b46-9cb8-5f13072e0d74', 2, 'Overhead Press', 'Shoulders', 3, '8–10', '40kg', '38kg', 60, 90),
  ('8c8fa1d1-0fe9-4b46-9cb8-5f13072e0d74', 3, 'Bent Over Row', 'Back', 3, '10–12', '55kg', '55kg', 60, 90),
  ('8c8fa1d1-0fe9-4b46-9cb8-5f13072e0d74', 4, 'Tricep Dips', 'Triceps', 3, '12–15', 'Body', 'Body', 60, 90),
  ('8c8fa1d1-0fe9-4b46-9cb8-5f13072e0d74', 5, 'Bicep Curl', 'Biceps', 3, '12', '15kg', '14kg', 60, 90),
  ('f64bd390-e68e-41c7-8cd7-9ffcce1bbbe7', 1, 'Cat-Cow Flow', 'Spine', 2, '8 breaths', 'Body', 'Body', 30, 45),
  ('f64bd390-e68e-41c7-8cd7-9ffcce1bbbe7', 2, 'World''s Greatest Stretch', 'Hips', 2, '6 / side', 'Body', 'Body', 30, 45),
  ('f64bd390-e68e-41c7-8cd7-9ffcce1bbbe7', 3, 'Band Pull Apart', 'Upper back', 2, '12–15', 'Light band', 'Light band', 30, 45),
  ('f64bd390-e68e-41c7-8cd7-9ffcce1bbbe7', 4, 'Walking Lunges', 'Lower body', 2, '10 / side', 'Body', 'Body', 30, 45)
on conflict (workout_id, sort_order) do nothing;
