-- ============================================================
-- Pravah — pantry intelligence seed (GENERATED FILE)
-- Source of truth: src/lib/seed/ — regenerate with pnpm seed:generate
-- ============================================================

-- ---------- ingredients ----------
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000001', 'atta', array['wheat flour', 'whole wheat flour']::text[], 'grain', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000002', 'rice', array['chawal', 'basmati']::text[], 'grain', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000003', 'dal', array['toor dal', 'arhar dal', 'lentils']::text[], 'staple', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000004', 'onions', array['pyaaz', 'onion']::text[], 'vegetable', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000005', 'ghee', array['clarified butter']::text[], 'staple', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000006', 'oil', array['cooking oil', 'mustard oil', 'sunflower oil']::text[], 'staple', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000007', 'salt', array['namak']::text[], 'staple', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000008', 'sugar', array['cheeni']::text[], 'staple', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000009', 'tea', array['chai patti', 'tea leaves']::text[], 'staple', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000010', 'milk', array['doodh', 'toned milk']::text[], 'dairy', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000011', 'curd', array['dahi', 'yogurt']::text[], 'dairy', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000012', 'eggs', array['anda', 'egg']::text[], 'protein', null, true)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000013', 'tomatoes', array['tamatar', 'tomato']::text[], 'vegetable', 5, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000014', 'potatoes', array['aloo', 'potato']::text[], 'vegetable', 21, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000015', 'palak', array['spinach']::text[], 'vegetable', 3, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000016', 'methi', array['fenugreek leaves']::text[], 'vegetable', 3, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000017', 'coriander', array['dhania', 'cilantro']::text[], 'vegetable', 4, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000018', 'green chillies', array['hari mirch', 'chilli']::text[], 'vegetable', 7, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000019', 'ginger', array['adrak']::text[], 'vegetable', 14, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000020', 'garlic', array['lehsun']::text[], 'vegetable', 21, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000021', 'capsicum', array['shimla mirch', 'bell pepper']::text[], 'vegetable', 7, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000022', 'cauliflower', array['gobi', 'phool gobi']::text[], 'vegetable', 7, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000023', 'cabbage', array['patta gobi']::text[], 'vegetable', 10, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000024', 'bhindi', array['okra', 'lady finger']::text[], 'vegetable', 4, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000025', 'lauki', array['bottle gourd', 'doodhi', 'ghiya']::text[], 'vegetable', 7, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000026', 'green beans', array['beans', 'french beans']::text[], 'vegetable', 5, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000027', 'carrots', array['gajar', 'carrot']::text[], 'vegetable', 14, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000028', 'peas', array['matar', 'green peas']::text[], 'vegetable', 7, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000029', 'cucumber', array['kheera', 'kakdi']::text[], 'vegetable', 5, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000030', 'beetroot', array['chukandar']::text[], 'vegetable', 14, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000031', 'mushrooms', array['mushroom', 'button mushroom']::text[], 'vegetable', 3, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000032', 'spring onions', array['hara pyaaz', 'scallions']::text[], 'vegetable', 4, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000033', 'curry leaves', array['kadi patta']::text[], 'vegetable', 5, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000034', 'lemon', array['nimbu', 'lime']::text[], 'vegetable', 14, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000035', 'mint', array['pudina']::text[], 'vegetable', 3, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000036', 'baingan', array['brinjal', 'eggplant', 'aubergine']::text[], 'vegetable', 5, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000037', 'pumpkin', array['kaddu', 'sitaphal']::text[], 'vegetable', 10, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000038', 'paneer', array['cottage cheese']::text[], 'dairy', 4, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000039', 'butter', array['makkhan']::text[], 'dairy', 30, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000040', 'cheese', array['processed cheese', 'cheese slice']::text[], 'dairy', 15, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000041', 'cream', array['malai', 'fresh cream']::text[], 'dairy', 5, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000042', 'chicken', array['murgh', 'chicken breast', 'chicken curry cut']::text[], 'protein', 2, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000043', 'fish', array['machli', 'rohu', 'surmai']::text[], 'protein', 1, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000044', 'soya chunks', array['soya', 'nutri nuggets']::text[], 'protein', 180, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000045', 'chana', array['chickpeas', 'chole', 'kabuli chana']::text[], 'protein', 180, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000046', 'rajma', array['kidney beans']::text[], 'protein', 180, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000047', 'moong', array['moong dal', 'green gram']::text[], 'protein', 180, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000048', 'sprouts', array['moong sprouts', 'sprouted moong']::text[], 'protein', 2, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000049', 'tofu', array['soya paneer']::text[], 'protein', 5, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000050', 'peanuts', array['moongphali', 'groundnuts']::text[], 'protein', 90, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000051', 'poha', array['flattened rice', 'chivda']::text[], 'grain', 90, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000052', 'suji', array['rava', 'semolina']::text[], 'grain', 90, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000053', 'besan', array['gram flour', 'chickpea flour']::text[], 'grain', 90, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000054', 'oats', array['rolled oats', 'masala oats']::text[], 'grain', 180, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000055', 'bread', array['brown bread', 'sandwich bread']::text[], 'grain', 4, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000056', 'vermicelli', array['seviyan', 'semiya']::text[], 'grain', 180, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000057', 'bananas', array['kela', 'banana']::text[], 'fruit', 4, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000058', 'apples', array['seb', 'apple']::text[], 'fruit', 14, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000059', 'oranges', array['santra', 'orange']::text[], 'fruit', 10, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000060', 'papaya', array['papita']::text[], 'fruit', 4, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000061', 'pomegranate', array['anaar']::text[], 'fruit', 7, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000062', 'grapes', array['angoor']::text[], 'fruit', 5, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000063', 'mango', array['aam', 'alphonso']::text[], 'fruit', 5, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000064', 'jeera', array['cumin', 'cumin seeds']::text[], 'spice', null, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000065', 'haldi', array['turmeric']::text[], 'spice', null, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000066', 'red chilli powder', array['lal mirch', 'chilli powder']::text[], 'spice', null, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000067', 'garam masala', '{}'::text[], 'spice', null, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000068', 'mustard seeds', array['rai', 'sarson']::text[], 'spice', null, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000069', 'hing', array['asafoetida']::text[], 'spice', null, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000070', 'black pepper', array['kali mirch', 'pepper']::text[], 'spice', null, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000071', 'chaat masala', '{}'::text[], 'spice', null, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000072', 'peanut butter', array['pb']::text[], 'other', 90, false)
on conflict (id) do nothing;
insert into public.ingredients (id, name, name_aliases, category, default_shelf_life_days, is_staple)
values ('00000001-0000-4000-8000-000000000073', 'jaggery', array['gur', 'gud']::text[], 'other', 180, false)
on conflict (id) do nothing;

-- ---------- dishes ----------
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000001', 'kanda poha', array['breakfast']::text[], 15, 2, 8, 320, '[{"ingredient_id":"00000001-0000-4000-8000-000000000051","qty_hint":"1.5 cups"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 medium"},{"ingredient_id":"00000001-0000-4000-8000-000000000050","qty_hint":"a handful"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"},{"ingredient_id":"00000001-0000-4000-8000-000000000034","qty_hint":"half"}]'::jsonb, '["Rinse the poha in a colander and let it sit.","Heat oil, crackle mustard seeds, add peanuts and sliced onion.","Once the onion softens, add turmeric and salt.","Fold in the poha and steam for two minutes, lid on.","Finish with lemon juice."]'::jsonb, array['budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000002', 'vegetable upma', array['breakfast']::text[], 20, 2, 9, 350, '[{"ingredient_id":"00000001-0000-4000-8000-000000000052","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000027","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000026","qty_hint":"a handful"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1.5 tbsp"}]'::jsonb, '["Dry-roast the suji until it smells nutty, then set aside.","Heat oil, crackle mustard seeds, add onion and chopped vegetables.","Pour in two cups of hot water with salt and bring to a boil.","Stream in the suji while stirring, then cook covered for three minutes."]'::jsonb, array['budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000003', 'besan cheela', array['breakfast']::text[], 15, 2, 12, 280, '[{"ingredient_id":"00000001-0000-4000-8000-000000000053","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Whisk besan with water, salt and ajwain into a pourable batter.","Stir in chopped onion, tomato and coriander.","Ladle onto a hot tawa and spread like a dosa.","Drizzle oil around the edges and cook both sides golden."]'::jsonb, array['budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000004', 'masala oats', array['breakfast']::text[], 10, 2, 11, 300, '[{"ingredient_id":"00000001-0000-4000-8000-000000000054","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000028","qty_hint":"a handful"}]'::jsonb, '["Sauté onion, tomato and peas with a pinch of turmeric.","Add oats and two cups of water.","Simmer for four minutes until creamy, season and serve."]'::jsonb, array['budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000005', 'egg bhurji with roti', array['breakfast', 'dinner']::text[], 15, 2, 16, 380, '[{"ingredient_id":"00000001-0000-4000-8000-000000000012","qty_hint":"3"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 medium"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 2 rotis"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Soften onion in oil, then add tomato and a pinch of turmeric.","Crack in the eggs and scramble on medium heat.","Season with salt and garam masala.","Serve hot with fresh rotis."]'::jsonb, '{}'::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000006', 'curd and banana bowl', array['breakfast', 'any']::text[], 3, 1, 9, 250, '[{"ingredient_id":"00000001-0000-4000-8000-000000000011","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000057","qty_hint":"1"}]'::jsonb, '["Whisk the curd until smooth.","Slice in the banana and add a spoon of sugar or jaggery."]'::jsonb, array['no-cook', 'budget', 'vrat-safe']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000007', 'sprouts chaat', array['breakfast', 'any']::text[], 10, 1, 14, 220, '[{"ingredient_id":"00000001-0000-4000-8000-000000000048","qty_hint":"1.5 cups"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000034","qty_hint":"half"}]'::jsonb, '["Toss the sprouts with chopped onion and tomato.","Season with chaat masala, salt and lemon juice.","Top with coriander if you have it."]'::jsonb, array['no-cook', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000008', 'aloo paratha with curd', array['breakfast']::text[], 30, 3, 10, 450, '[{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 2 parathas"},{"ingredient_id":"00000001-0000-4000-8000-000000000014","qty_hint":"2 boiled"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"},{"ingredient_id":"00000001-0000-4000-8000-000000000011","qty_hint":"1 cup"}]'::jsonb, '["Mash boiled potatoes with salt, chilli and coriander.","Knead a soft atta dough and rest it ten minutes.","Stuff, roll, and roast each paratha with ghee until golden.","Serve with a bowl of curd."]'::jsonb, '{}'::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000009', 'bread omelette', array['breakfast']::text[], 10, 2, 14, 350, '[{"ingredient_id":"00000001-0000-4000-8000-000000000012","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000055","qty_hint":"2 slices"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"2 tsp"}]'::jsonb, '["Beat the eggs with chopped onion, chilli and salt.","Pour into a hot oiled pan.","Press the bread slices into the setting egg and flip once."]'::jsonb, array['budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000010', 'dal tadka with rice', array['lunch', 'dinner']::text[], 35, 3, 18, 520, '[{"ingredient_id":"00000001-0000-4000-8000-000000000003","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"}]'::jsonb, '["Pressure-cook the dal with turmeric and salt.","Cook the rice alongside.","Make a tadka of ghee, jeera, onion and tomato.","Pour the tadka over the dal and simmer five minutes."]'::jsonb, array['leftover-friendly', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000011', 'rajma chawal', array['lunch']::text[], 45, 3, 19, 560, '[{"ingredient_id":"00000001-0000-4000-8000-000000000046","qty_hint":"1 cup soaked"},{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"2 tbsp"}]'::jsonb, '["Pressure-cook soaked rajma until soft.","Brown onions in oil, add tomato purée and the masalas.","Add the rajma and simmer for fifteen minutes.","Serve over fresh rice."]'::jsonb, array['leftover-friendly', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000012', 'chana masala with rice', array['lunch']::text[], 45, 3, 17, 540, '[{"ingredient_id":"00000001-0000-4000-8000-000000000045","qty_hint":"1 cup soaked"},{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"2 tbsp"}]'::jsonb, '["Pressure-cook the soaked chana until tender.","Cook down onions, then tomatoes and masalas into a thick base.","Fold in the chana and simmer ten minutes.","Serve with rice and a wedge of lemon."]'::jsonb, array['leftover-friendly', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000013', 'vegetable khichdi', array['lunch', 'dinner']::text[], 30, 2, 14, 450, '[{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"0.5 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000003","qty_hint":"0.5 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000027","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000028","qty_hint":"a handful"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"}]'::jsonb, '["Rinse rice and dal together.","Sauté jeera and vegetables in ghee.","Add rice, dal, turmeric, salt and four cups of water.","Pressure-cook for three whistles and rest."]'::jsonb, array['leftover-friendly', 'budget', 'recovery']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000014', 'paneer bhurji with roti', array['lunch', 'dinner']::text[], 20, 2, 22, 480, '[{"ingredient_id":"00000001-0000-4000-8000-000000000038","qty_hint":"150 g"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 2 rotis"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Soften onion in oil, add tomato and the masalas.","Crumble in the paneer and toss for three minutes.","Finish with coriander and serve with rotis."]'::jsonb, '{}'::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000015', 'curd rice', array['lunch', 'dinner', 'any']::text[], 10, 1, 9, 380, '[{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1.5 cups cooked"},{"ingredient_id":"00000001-0000-4000-8000-000000000011","qty_hint":"1 cup"}]'::jsonb, '["Mash warm rice lightly and mix in the curd with salt.","If you like, temper mustard seeds and curry leaves in a little oil and pour over."]'::jsonb, array['no-cook', 'budget', 'recovery']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000016', 'lemon rice', array['lunch']::text[], 15, 2, 7, 420, '[{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1.5 cups cooked"},{"ingredient_id":"00000001-0000-4000-8000-000000000034","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000050","qty_hint":"a handful"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Temper mustard seeds, peanuts and curry leaves in oil.","Add turmeric, then the rice, and toss gently.","Squeeze in the lemon off the heat and season."]'::jsonb, array['budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000017', 'mixed veg sabzi with roti', array['lunch', 'dinner']::text[], 30, 3, 9, 430, '[{"ingredient_id":"00000001-0000-4000-8000-000000000022","qty_hint":"half a head"},{"ingredient_id":"00000001-0000-4000-8000-000000000014","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000028","qty_hint":"a handful"},{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 3 rotis"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1.5 tbsp"}]'::jsonb, '["Sauté jeera, then the chopped vegetables with turmeric and salt.","Cover and cook on low until tender, stirring twice.","Sprinkle garam masala.","Serve with fresh rotis."]'::jsonb, array['leftover-friendly', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000018', 'palak paneer with roti', array['lunch', 'dinner']::text[], 35, 3, 20, 490, '[{"ingredient_id":"00000001-0000-4000-8000-000000000015","qty_hint":"1 bunch"},{"ingredient_id":"00000001-0000-4000-8000-000000000038","qty_hint":"150 g"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 2 rotis"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"}]'::jsonb, '["Blanch the palak and blend to a purée.","Sauté onion, garlic and the masalas in ghee.","Add the purée, simmer, then slide in paneer cubes.","Serve with rotis."]'::jsonb, array['leftover-friendly']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000019', 'moong dal khichdi', array['dinner']::text[], 25, 2, 13, 420, '[{"ingredient_id":"00000001-0000-4000-8000-000000000047","qty_hint":"0.5 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"0.5 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"}]'::jsonb, '["Rinse moong dal and rice together.","Sauté jeera and hing in ghee, add the grains.","Add water, turmeric and salt; pressure-cook three whistles.","Serve with a spoon of ghee on top."]'::jsonb, array['leftover-friendly', 'budget', 'recovery']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000020', 'chicken curry with rice', array['dinner', 'lunch']::text[], 45, 3, 32, 580, '[{"ingredient_id":"00000001-0000-4000-8000-000000000042","qty_hint":"300 g"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000011","qty_hint":"2 tbsp"},{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"}]'::jsonb, '["Brown sliced onions, then add ginger-garlic and the masalas.","Add tomatoes and cook until the oil separates.","Add chicken and sear, then whisk in curd and a cup of water.","Simmer covered for twenty minutes.","Serve with rice."]'::jsonb, array['leftover-friendly']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000021', 'egg curry with rice', array['dinner']::text[], 30, 3, 18, 510, '[{"ingredient_id":"00000001-0000-4000-8000-000000000012","qty_hint":"3 boiled"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1.5 tbsp"}]'::jsonb, '["Boil the eggs while the rice cooks.","Make an onion-tomato masala base.","Halve the eggs and slip them into the simmering gravy.","Serve over rice."]'::jsonb, array['leftover-friendly', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000022', 'lauki sabzi with roti', array['dinner']::text[], 30, 3, 8, 380, '[{"ingredient_id":"00000001-0000-4000-8000-000000000025","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 3 rotis"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Temper jeera, add diced lauki and tomato.","Season with turmeric and salt, cover and cook until soft.","Mash lightly and finish with coriander.","Serve with rotis."]'::jsonb, array['budget', 'recovery']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000023', 'bhindi sabzi with roti', array['dinner', 'lunch']::text[], 25, 3, 7, 400, '[{"ingredient_id":"00000001-0000-4000-8000-000000000024","qty_hint":"250 g"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 3 rotis"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1.5 tbsp"}]'::jsonb, '["Dry the bhindi well and chop.","Sauté on medium-high without crowding the pan.","Add sliced onion, salt and the masalas; cook until the stickiness goes.","Serve with rotis."]'::jsonb, '{}'::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000024', 'matar paneer with roti', array['dinner', 'lunch']::text[], 35, 3, 19, 500, '[{"ingredient_id":"00000001-0000-4000-8000-000000000038","qty_hint":"150 g"},{"ingredient_id":"00000001-0000-4000-8000-000000000028","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 2 rotis"}]'::jsonb, '["Blend onion and tomato into a smooth masala and cook it down in oil.","Add peas with half a cup of water and simmer.","Slide in the paneer and cook five more minutes.","Serve with rotis."]'::jsonb, array['leftover-friendly']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000025', 'soya chunk curry with rice', array['dinner']::text[], 30, 3, 26, 480, '[{"ingredient_id":"00000001-0000-4000-8000-000000000044","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1.5 tbsp"}]'::jsonb, '["Soak the soya chunks in hot salted water, then squeeze dry.","Cook an onion-tomato masala until glossy.","Add the chunks and a cup of water; simmer ten minutes.","Serve with rice."]'::jsonb, array['leftover-friendly', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000026', 'grilled paneer with sautéed veg', array['dinner']::text[], 20, 2, 24, 420, '[{"ingredient_id":"00000001-0000-4000-8000-000000000038","qty_hint":"200 g"},{"ingredient_id":"00000001-0000-4000-8000-000000000021","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Rub paneer slabs with salt, chilli and turmeric.","Sear on a hot pan until golden on both sides.","Sauté capsicum and onion in the same pan.","Plate together with a squeeze of lemon."]'::jsonb, '{}'::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000027', 'tomato dal with roti', array['dinner', 'lunch']::text[], 30, 3, 15, 440, '[{"ingredient_id":"00000001-0000-4000-8000-000000000003","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 2 rotis"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"}]'::jsonb, '["Pressure-cook dal with tomatoes, turmeric and salt.","Temper jeera, garlic and chilli in ghee; pour it over.","Simmer five minutes.","Serve with rotis."]'::jsonb, array['leftover-friendly', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000028', 'seasonal fruit and curd bowl', array['any', 'breakfast']::text[], 5, 1, 8, 260, '[{"ingredient_id":"00000001-0000-4000-8000-000000000011","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000060","qty_hint":"1 cup chopped"},{"ingredient_id":"00000001-0000-4000-8000-000000000057","qty_hint":"1"}]'::jsonb, '["Chop whatever fruit is in the kitchen.","Fold into whisked curd with a little sugar or jaggery."]'::jsonb, array['no-cook', 'vrat-safe']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000029', 'peanut butter banana sandwich', array['any', 'breakfast']::text[], 5, 1, 11, 340, '[{"ingredient_id":"00000001-0000-4000-8000-000000000055","qty_hint":"2 slices"},{"ingredient_id":"00000001-0000-4000-8000-000000000072","qty_hint":"2 tbsp"},{"ingredient_id":"00000001-0000-4000-8000-000000000057","qty_hint":"1"}]'::jsonb, '["Spread the peanut butter generously.","Layer banana slices, close, and halve."]'::jsonb, array['no-cook']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000030', 'kachumber chaat bowl', array['any']::text[], 8, 1, 4, 150, '[{"ingredient_id":"00000001-0000-4000-8000-000000000029","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000013","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000034","qty_hint":"half"}]'::jsonb, '["Dice cucumber, tomato and onion evenly.","Toss with salt, chaat masala and lemon juice."]'::jsonb, array['no-cook', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000031', 'dahi chiwda', array['any', 'breakfast']::text[], 5, 1, 7, 280, '[{"ingredient_id":"00000001-0000-4000-8000-000000000051","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000011","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000008","qty_hint":"1 tsp"}]'::jsonb, '["Rinse the poha and let it soften for two minutes.","Stir into curd with sugar or jaggery and a pinch of salt."]'::jsonb, array['no-cook', 'budget', 'vrat-safe']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000032', 'dal paratha', array['breakfast', 'lunch']::text[], 15, 2, 11, 380, '[{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Knead the leftover dal straight into atta — no extra water.","Rest the dough five minutes.","Roll out parathas and roast with oil until golden.","Serve with curd or pickle."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000033', 'dal tadka rice bowl', array['lunch', 'dinner']::text[], 12, 2, 16, 460, '[{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"}]'::jsonb, '["Warm the leftover dal with a splash of water.","Make a fresh tadka of ghee, jeera and chilli; pour it over.","Serve on hot rice."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000034', 'dal cheela', array['breakfast']::text[], 15, 2, 13, 320, '[{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"0.5 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Whisk the leftover dal with atta into a pourable batter.","Season with salt, chilli and coriander.","Spread on a hot tawa and cook both sides with a little oil."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000035', 'dal shorba', array['dinner', 'any']::text[], 10, 1, 9, 180, '[{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"2 tsp"}]'::jsonb, '["Thin the leftover dal with hot water to soup consistency.","Temper jeera and garlic in ghee; pour over.","Simmer three minutes and finish with lemon."]'::jsonb, array['leftover-transform', 'recovery', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000036', 'dal khichdi refresh', array['dinner']::text[], 15, 2, 14, 420, '[{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"0.5 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"}]'::jsonb, '["Simmer the leftover dal with rinsed rice and two cups of water.","Season with turmeric and salt.","Cook covered until the rice is soft, then finish with ghee."]'::jsonb, array['leftover-transform', 'recovery', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000037', 'sabzi paratha', array['breakfast', 'lunch']::text[], 15, 2, 9, 390, '[{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Mash the leftover sabzi well.","Knead it into atta — the sabzi replaces the water.","Roll and roast parathas with oil until crisp-edged.","Serve with curd."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000038', 'sabzi frankie roll', array['lunch', 'dinner']::text[], 12, 2, 8, 360, '[{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 2 rotis"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"2 tsp"}]'::jsonb, '["Make two fresh rotis, or warm yesterday’s.","Heat the sabzi until it dries out a little.","Spread on the roti with sliced onion and chaat masala.","Roll tight and pan-press for a minute."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000039', 'sabzi pulao', array['lunch', 'dinner']::text[], 15, 2, 8, 430, '[{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Heat oil, crackle jeera, and add the leftover sabzi.","Fold in cooked rice and toss on high heat.","Adjust salt and finish with coriander."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000040', 'sabzi egg scramble', array['breakfast', 'dinner']::text[], 10, 2, 15, 330, '[{"ingredient_id":"00000001-0000-4000-8000-000000000012","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"2 tsp"}]'::jsonb, '["Heat the leftover sabzi in a little oil, breaking it down.","Crack in the eggs and scramble until just set.","Season and serve with toast or roti."]'::jsonb, array['leftover-transform']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000041', 'crispy sabzi chaat', array['any']::text[], 12, 2, 6, 280, '[{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Pan-crisp the leftover sabzi in oil until the edges brown.","Top with chopped onion, chaat masala and lemon.","Add curd on top if you have it."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000042', 'jeera ghee rice', array['lunch', 'dinner']::text[], 8, 1, 6, 380, '[{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"}]'::jsonb, '["Heat ghee and crackle jeera generously.","Add the leftover rice and toss until glossy and hot.","Season with salt; serve with curd or dal."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000043', 'desi egg fried rice', array['lunch', 'dinner']::text[], 15, 2, 17, 480, '[{"ingredient_id":"00000001-0000-4000-8000-000000000012","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Scramble the eggs in hot oil and set aside.","Sauté onion and any vegetables on high heat.","Add the leftover rice, eggs, salt and pepper; toss hard.","Finish with a dash of lemon."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000044', 'quick rice kheer', array['any']::text[], 15, 2, 8, 320, '[{"ingredient_id":"00000001-0000-4000-8000-000000000010","qty_hint":"2 cups"},{"ingredient_id":"00000001-0000-4000-8000-000000000008","qty_hint":"2 tbsp"}]'::jsonb, '["Simmer the leftover rice in milk, mashing as it thickens.","Sweeten with sugar and a pinch of cardamom.","Serve warm or chilled."]'::jsonb, array['leftover-transform', 'vrat-safe']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000045', 'comfort dal-rice bowl', array['dinner']::text[], 12, 1, 13, 430, '[{"ingredient_id":"00000001-0000-4000-8000-000000000003","qty_hint":"1 cup cooked"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"}]'::jsonb, '["Warm the leftover rice and dal together with a splash of water.","Top with ghee and a pinch of salt.","Eat from the bowl — comfort first."]'::jsonb, array['leftover-transform', 'recovery', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000046', 'ghee-sugar churma roti', array['any']::text[], 8, 1, 5, 340, '[{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"},{"ingredient_id":"00000001-0000-4000-8000-000000000008","qty_hint":"1 tbsp"}]'::jsonb, '["Crisp the leftover rotis on a tawa.","Crush into pieces while warm.","Toss with melted ghee and sugar or jaggery."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000047', 'kothu roti with egg', array['dinner']::text[], 15, 2, 14, 420, '[{"ingredient_id":"00000001-0000-4000-8000-000000000012","qty_hint":"2"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Shred the leftover rotis into ribbons.","Sauté onion, then scramble in the eggs.","Add the roti ribbons and toss on high heat with the masalas."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000048', 'roti upma', array['breakfast']::text[], 12, 2, 7, 330, '[{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Tear the leftover rotis into small pieces.","Temper mustard seeds and onion in oil.","Toss in the roti with turmeric, salt and a splash of water.","Cover for two minutes so it softens."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000049', 'warm milk-roti bowl', array['any']::text[], 5, 1, 9, 310, '[{"ingredient_id":"00000001-0000-4000-8000-000000000010","qty_hint":"1.5 cups"},{"ingredient_id":"00000001-0000-4000-8000-000000000008","qty_hint":"1 tbsp"}]'::jsonb, '["Warm the milk with sugar.","Crumble in the leftover roti and let it soak for two minutes."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000050', 'dal-stuffed roti tacos', array['lunch', 'dinner']::text[], 12, 2, 12, 390, '[{"ingredient_id":"00000001-0000-4000-8000-000000000003","qty_hint":"1 cup cooked"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"}]'::jsonb, '["Thicken the leftover dal in a pan until scoopable.","Warm the rotis and fold like tacos.","Fill with dal, chopped onion and a hit of chaat masala."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000051', 'curry rice bowl', array['lunch', 'dinner']::text[], 10, 1, 14, 450, '[{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"}]'::jsonb, '["Warm the leftover curry — add a splash of water if thick.","Serve generously over hot rice.","Top with raw onion and lemon."]'::jsonb, array['leftover-transform']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000052', 'curry paratha', array['breakfast', 'lunch']::text[], 15, 2, 10, 400, '[{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"1 tbsp"}]'::jsonb, '["Reduce the leftover curry until thick.","Knead it into atta for a spiced dough.","Roll and roast parathas with oil."]'::jsonb, array['leftover-transform', 'budget']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000053', 'curry pulao', array['lunch', 'dinner']::text[], 15, 2, 12, 470, '[{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"2 tsp"}]'::jsonb, '["Heat the leftover curry in a wide pan.","Fold in cooked rice and a splash of water.","Cover and steam for five minutes, then fluff."]'::jsonb, array['leftover-transform']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000054', 'egg-drop curry refresh', array['dinner']::text[], 15, 2, 16, 380, '[{"ingredient_id":"00000001-0000-4000-8000-000000000012","qty_hint":"2"}]'::jsonb, '["Bring the leftover curry to a gentle simmer.","Slip in boiled egg halves — or poach eggs straight in the gravy.","Simmer five minutes and serve with rice or roti."]'::jsonb, array['leftover-transform']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000055', 'curry shorba', array['any', 'dinner']::text[], 10, 1, 8, 220, '[{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"2 tsp"}]'::jsonb, '["Thin the leftover curry with hot water and bring to a simmer.","Temper jeera in ghee and pour over.","Sip warm with black pepper on top."]'::jsonb, array['leftover-transform', 'recovery']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000056', 'paneer bhurji refresh', array['breakfast', 'dinner']::text[], 10, 2, 18, 350, '[{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"2 tsp"}]'::jsonb, '["Crumble the leftover paneer dish into a hot oiled pan.","Add chopped onion and toss until everything dries and browns a little.","Finish with coriander and lemon."]'::jsonb, array['leftover-transform']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000057', 'paneer paratha', array['breakfast', 'lunch']::text[], 15, 2, 16, 430, '[{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"1 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"1 tbsp"}]'::jsonb, '["Mash the leftover paneer dish into a thick filling.","Stuff into atta dough rounds.","Roll gently and roast with ghee until golden."]'::jsonb, array['leftover-transform']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000058', 'paneer rice bowl', array['lunch', 'dinner']::text[], 10, 1, 17, 460, '[{"ingredient_id":"00000001-0000-4000-8000-000000000002","qty_hint":"1 cup"}]'::jsonb, '["Warm the leftover paneer dish with a splash of water.","Spoon over hot rice.","Top with raw onion rings."]'::jsonb, array['leftover-transform']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000059', 'paneer kathi roll', array['lunch', 'dinner']::text[], 15, 2, 19, 440, '[{"ingredient_id":"00000001-0000-4000-8000-000000000001","qty_hint":"for 2 rotis"},{"ingredient_id":"00000001-0000-4000-8000-000000000004","qty_hint":"1 small"},{"ingredient_id":"00000001-0000-4000-8000-000000000006","qty_hint":"2 tsp"}]'::jsonb, '["Dry out the leftover paneer dish in a hot pan.","Make fresh rotis or warm yesterday’s.","Roll the paneer inside with onion and a squeeze of lemon.","Pan-press the roll for a minute."]'::jsonb, array['leftover-transform']::text[])
on conflict (id) do nothing;
insert into public.dishes (id, name, slot_tags, prep_minutes, effort_score, protein_g, calories, ingredients, method_steps, tags)
values ('00000002-0000-4000-8000-000000000060', 'creamy paneer refresh', array['dinner']::text[], 12, 2, 18, 420, '[{"ingredient_id":"00000001-0000-4000-8000-000000000010","qty_hint":"0.5 cup"},{"ingredient_id":"00000001-0000-4000-8000-000000000005","qty_hint":"2 tsp"}]'::jsonb, '["Warm the leftover paneer dish in ghee.","Stir in milk and simmer until the gravy turns silky.","Serve with roti or rice."]'::jsonb, array['leftover-transform']::text[])
on conflict (id) do nothing;

-- ---------- leftover_transformations ----------
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000001', 'dal', '00000002-0000-4000-8000-000000000035', array['00000001-0000-4000-8000-000000000005']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000002', 'dal', '00000002-0000-4000-8000-000000000032', array['00000001-0000-4000-8000-000000000001', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000003', 'dal', '00000002-0000-4000-8000-000000000033', array['00000001-0000-4000-8000-000000000002', '00000001-0000-4000-8000-000000000005']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000004', 'dal', '00000002-0000-4000-8000-000000000034', array['00000001-0000-4000-8000-000000000001', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000005', 'dal', '00000002-0000-4000-8000-000000000036', array['00000001-0000-4000-8000-000000000002', '00000001-0000-4000-8000-000000000005']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000006', 'sabzi', '00000002-0000-4000-8000-000000000041', array['00000001-0000-4000-8000-000000000004']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000007', 'sabzi', '00000002-0000-4000-8000-000000000037', array['00000001-0000-4000-8000-000000000001', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000008', 'sabzi', '00000002-0000-4000-8000-000000000038', array['00000001-0000-4000-8000-000000000001', '00000001-0000-4000-8000-000000000004', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000009', 'sabzi', '00000002-0000-4000-8000-000000000039', array['00000001-0000-4000-8000-000000000002', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000010', 'sabzi', '00000002-0000-4000-8000-000000000040', array['00000001-0000-4000-8000-000000000012', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000011', 'rice', '00000002-0000-4000-8000-000000000042', array['00000001-0000-4000-8000-000000000005']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000012', 'rice', '00000002-0000-4000-8000-000000000015', array['00000001-0000-4000-8000-000000000011']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000013', 'rice', '00000002-0000-4000-8000-000000000043', array['00000001-0000-4000-8000-000000000012', '00000001-0000-4000-8000-000000000004', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000014', 'rice', '00000002-0000-4000-8000-000000000045', array['00000001-0000-4000-8000-000000000003', '00000001-0000-4000-8000-000000000005']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000015', 'rice', '00000002-0000-4000-8000-000000000044', array['00000001-0000-4000-8000-000000000010', '00000001-0000-4000-8000-000000000008']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000016', 'roti', '00000002-0000-4000-8000-000000000049', array['00000001-0000-4000-8000-000000000010']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000017', 'roti', '00000002-0000-4000-8000-000000000046', array['00000001-0000-4000-8000-000000000005', '00000001-0000-4000-8000-000000000008']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000018', 'roti', '00000002-0000-4000-8000-000000000047', array['00000001-0000-4000-8000-000000000012', '00000001-0000-4000-8000-000000000004', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000019', 'roti', '00000002-0000-4000-8000-000000000048', array['00000001-0000-4000-8000-000000000004', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000020', 'roti', '00000002-0000-4000-8000-000000000050', array['00000001-0000-4000-8000-000000000003', '00000001-0000-4000-8000-000000000004']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000021', 'curry', '00000002-0000-4000-8000-000000000051', array['00000001-0000-4000-8000-000000000002']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000022', 'curry', '00000002-0000-4000-8000-000000000052', array['00000001-0000-4000-8000-000000000001', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000023', 'curry', '00000002-0000-4000-8000-000000000053', array['00000001-0000-4000-8000-000000000002', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000024', 'curry', '00000002-0000-4000-8000-000000000054', array['00000001-0000-4000-8000-000000000012']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000025', 'curry', '00000002-0000-4000-8000-000000000055', array['00000001-0000-4000-8000-000000000005']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000026', 'paneer', '00000002-0000-4000-8000-000000000058', array['00000001-0000-4000-8000-000000000002']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000027', 'paneer', '00000002-0000-4000-8000-000000000056', array['00000001-0000-4000-8000-000000000004', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000028', 'paneer', '00000002-0000-4000-8000-000000000057', array['00000001-0000-4000-8000-000000000001', '00000001-0000-4000-8000-000000000005']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000029', 'paneer', '00000002-0000-4000-8000-000000000059', array['00000001-0000-4000-8000-000000000001', '00000001-0000-4000-8000-000000000004', '00000001-0000-4000-8000-000000000006']::text[], true)
on conflict (id) do nothing;
insert into public.leftover_transformations (id, base_category, dish_id, extra_staples, active)
values ('00000003-0000-4000-8000-000000000030', 'paneer', '00000002-0000-4000-8000-000000000060', array['00000001-0000-4000-8000-000000000010', '00000001-0000-4000-8000-000000000005']::text[], true)
on conflict (id) do nothing;
