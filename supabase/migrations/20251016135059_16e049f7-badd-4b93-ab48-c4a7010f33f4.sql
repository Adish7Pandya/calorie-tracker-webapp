-- Fix the search_path issue in seed_demo_meals function
CREATE OR REPLACE FUNCTION public.seed_demo_meals(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  meal_data record;
  day_offset integer;
  meals_per_day integer;
  meal_date date;
BEGIN
  -- Define sample meals
  FOR day_offset IN 0..6 LOOP
    meal_date := CURRENT_DATE - day_offset;
    meals_per_day := 2 + floor(random() * 2)::integer; -- 2 or 3 meals per day
    
    -- Insert random meals for each day
    FOR i IN 1..meals_per_day LOOP
      -- Randomly select meal type
      CASE floor(random() * 10)::integer
        WHEN 0 THEN
          INSERT INTO public.meals (user_id, food_name, calories, protein, carbs, fat, quantity, meal_date)
          VALUES (user_id_param, 'Oatmeal with banana', 350, 12, 55, 8, 1, meal_date);
        WHEN 1 THEN
          INSERT INTO public.meals (user_id, food_name, calories, protein, carbs, fat, quantity, meal_date)
          VALUES (user_id_param, 'Grilled chicken salad', 420, 35, 25, 18, 1, meal_date);
        WHEN 2 THEN
          INSERT INTO public.meals (user_id, food_name, calories, protein, carbs, fat, quantity, meal_date)
          VALUES (user_id_param, 'Salmon with vegetables', 480, 38, 28, 22, 1, meal_date);
        WHEN 3 THEN
          INSERT INTO public.meals (user_id, food_name, calories, protein, carbs, fat, quantity, meal_date)
          VALUES (user_id_param, 'Greek yogurt with berries', 220, 18, 28, 5, 1, meal_date);
        WHEN 4 THEN
          INSERT INTO public.meals (user_id, food_name, calories, protein, carbs, fat, quantity, meal_date)
          VALUES (user_id_param, 'Turkey sandwich', 380, 28, 42, 12, 1, meal_date);
        WHEN 5 THEN
          INSERT INTO public.meals (user_id, food_name, calories, protein, carbs, fat, quantity, meal_date)
          VALUES (user_id_param, 'Pasta with marinara', 520, 18, 78, 14, 1, meal_date);
        WHEN 6 THEN
          INSERT INTO public.meals (user_id, food_name, calories, protein, carbs, fat, quantity, meal_date)
          VALUES (user_id_param, 'Protein smoothie', 280, 25, 32, 6, 1, meal_date);
        WHEN 7 THEN
          INSERT INTO public.meals (user_id, food_name, calories, protein, carbs, fat, quantity, meal_date)
          VALUES (user_id_param, 'Scrambled eggs toast', 340, 22, 28, 16, 1, meal_date);
        WHEN 8 THEN
          INSERT INTO public.meals (user_id, food_name, calories, protein, carbs, fat, quantity, meal_date)
          VALUES (user_id_param, 'Quinoa bowl', 460, 18, 62, 15, 1, meal_date);
        ELSE
          INSERT INTO public.meals (user_id, food_name, calories, protein, carbs, fat, quantity, meal_date)
          VALUES (user_id_param, 'Tuna salad', 320, 32, 15, 14, 1, meal_date);
      END CASE;
    END LOOP;
  END LOOP;
END;
$$;

-- Also fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  
  -- Seed demo meals for new user
  PERFORM seed_demo_meals(new.id);
  
  RETURN new;
END;
$$;