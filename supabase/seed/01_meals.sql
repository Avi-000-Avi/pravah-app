-- ============================================================
-- Seed: public.meals — 10 sample Indian meals
-- ============================================================
-- Loaded by `pnpm db:reset`. Reset-safe: relies on `gen_random_uuid()`
-- defaults so re-running creates new rows rather than colliding on PK.
-- The unique `slug` column blocks duplicates if seed is re-run without
-- a reset; we ON CONFLICT DO NOTHING to keep that path idempotent.
-- ============================================================

insert into public.meals
  (slug, name, description, meal_slot, diet_type, cuisine, prep_time_min,
   calories_kcal, protein_g, carbs_g, fat_g, tags)
values
  -- Breakfast
  ('masala-oats',
   'Masala oats with vegetables',
   'Savoury oats cooked with onion, tomato, peas and Indian spices.',
   'breakfast', 'vegetarian', 'indian', 12,
   320, 12, 48, 8,
   array['high_fiber', 'quick_prep']),

  ('paneer-bhurji-toast',
   'Paneer bhurji with whole-wheat toast',
   'Scrambled paneer with onion-tomato masala on two slices of atta toast.',
   'breakfast', 'vegetarian', 'indian', 15,
   420, 24, 38, 18,
   array['high_protein']),

  ('egg-bhurji-paratha',
   'Egg bhurji with whole-wheat paratha',
   'Spiced scrambled eggs served with one whole-wheat paratha.',
   'breakfast', 'eggetarian', 'indian', 15,
   480, 22, 42, 22,
   array['high_protein']),

  -- Lunch
  ('dal-khichdi',
   'Moong dal khichdi with curd',
   'One-pot rice and split moong lentils tempered with cumin and ghee, served with curd.',
   'lunch', 'vegetarian', 'indian', 25,
   520, 20, 78, 14,
   array['gut_friendly', 'one_pot']),

  ('rajma-chawal',
   'Rajma chawal',
   'Kidney beans simmered in onion-tomato gravy, served with steamed basmati rice.',
   'lunch', 'vegetarian', 'indian', 30,
   620, 22, 96, 14,
   array['high_protein', 'comfort']),

  ('chicken-curry-rice',
   'Chicken curry with brown rice',
   'Home-style chicken curry with onion-tomato base, served with brown rice.',
   'lunch', 'non_vegetarian', 'indian', 35,
   640, 38, 72, 18,
   array['high_protein']),

  -- Dinner
  ('paneer-tikka-salad',
   'Paneer tikka with green salad',
   'Yoghurt-marinated grilled paneer cubes over a fresh cucumber-onion-tomato salad.',
   'dinner', 'vegetarian', 'indian', 25,
   460, 28, 18, 28,
   array['low_carb', 'high_protein']),

  ('grilled-fish-veg',
   'Grilled fish with sautéed vegetables',
   'Indian-spiced grilled fish fillet with mixed sautéed vegetables.',
   'dinner', 'non_vegetarian', 'indian', 25,
   420, 36, 16, 22,
   array['high_protein', 'low_carb']),

  ('vegan-chana-bowl',
   'Chana masala bowl with quinoa',
   'Spiced chickpeas served over quinoa with a side of fresh coriander chutney.',
   'dinner', 'vegan', 'indian', 25,
   520, 22, 78, 12,
   array['vegan', 'high_protein', 'high_fiber']),

  -- Snack
  ('fruit-chaat',
   'Fruit chaat with chaat masala',
   'Diced seasonal fruit tossed with lemon juice, chaat masala and mint.',
   'snack', 'vegan', 'indian', 8,
   180, 3, 42, 1,
   array['vegan', 'low_fat'])

on conflict (slug) do nothing;
