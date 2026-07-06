export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      meal_preferences: {
        Row: {
          user_id: string;
          diet_type: Database['public']['Enums']['diet_type'];
          goal: Database['public']['Enums']['fitness_goal'];
          meal_count: number;
          prep_time_max_min: number;
          budget_weekly_inr: number | null;
          cooking_mode: Database['public']['Enums']['cooking_mode'] | null;
          cuisines: string[];
          allergies: string[];
          avoid: string[];
          health_conditions: string[];
          time_constraints: Json | null;
          diet_tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          diet_type: Database['public']['Enums']['diet_type'];
          goal: Database['public']['Enums']['fitness_goal'];
          meal_count: number;
          prep_time_max_min: number;
          budget_weekly_inr?: number | null;
          cooking_mode?: Database['public']['Enums']['cooking_mode'] | null;
          cuisines?: string[];
          allergies?: string[];
          avoid?: string[];
          health_conditions?: string[];
          time_constraints?: Json | null;
          diet_tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          diet_type?: Database['public']['Enums']['diet_type'];
          goal?: Database['public']['Enums']['fitness_goal'];
          meal_count?: number;
          prep_time_max_min?: number;
          budget_weekly_inr?: number | null;
          cooking_mode?: Database['public']['Enums']['cooking_mode'] | null;
          cuisines?: string[];
          allergies?: string[];
          avoid?: string[];
          health_conditions?: string[];
          time_constraints?: Json | null;
          diet_tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'meal_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      meals: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          meal_slot: Database['public']['Enums']['meal_slot'];
          diet_type: Database['public']['Enums']['diet_type'];
          cuisine: string | null;
          image_url: string | null;
          prep_time_min: number;
          calories_kcal: number;
          protein_g: string;
          carbs_g: string;
          fat_g: string;
          tags: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          meal_slot: Database['public']['Enums']['meal_slot'];
          diet_type: Database['public']['Enums']['diet_type'];
          cuisine?: string | null;
          image_url?: string | null;
          prep_time_min: number;
          calories_kcal: number;
          protein_g: string;
          carbs_g: string;
          fat_g: string;
          tags?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          meal_slot?: Database['public']['Enums']['meal_slot'];
          diet_type?: Database['public']['Enums']['diet_type'];
          cuisine?: string | null;
          image_url?: string | null;
          prep_time_min?: number;
          calories_kcal?: number;
          protein_g?: string;
          carbs_g?: string;
          fat_g?: string;
          tags?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_id: string;
          sort_order: number;
          name: string;
          muscle: string;
          sets: number;
          reps: string;
          target_weight: string;
          previous_weight: string;
          rest_after_set_sec: number;
          rest_after_exercise_sec: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workout_id: string;
          sort_order: number;
          name: string;
          muscle: string;
          sets: number;
          reps: string;
          target_weight: string;
          previous_weight: string;
          rest_after_set_sec?: number;
          rest_after_exercise_sec?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workout_id?: string;
          sort_order?: number;
          name?: string;
          muscle?: string;
          sets?: number;
          reps?: string;
          target_weight?: string;
          previous_weight?: string;
          rest_after_set_sec?: number;
          rest_after_exercise_sec?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workout_exercises_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'workouts';
            referencedColumns: ['id'];
          },
        ];
      };
      workouts: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          duration_min: number;
          focus_area: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          duration_min: number;
          focus_area: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          duration_min?: number;
          focus_area?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_meal_plans: {
        Row: {
          id: string;
          user_id: string;
          meal_id: string;
          plan_date: string;
          meal_slot: Database['public']['Enums']['meal_slot'];
          servings: string;
          is_logged: boolean;
          logged_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_id: string;
          plan_date: string;
          meal_slot: Database['public']['Enums']['meal_slot'];
          servings?: string;
          is_logged?: boolean;
          logged_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_id?: string;
          plan_date?: string;
          meal_slot?: Database['public']['Enums']['meal_slot'];
          servings?: string;
          is_logged?: boolean;
          logged_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_meal_plans_meal_id_fkey';
            columns: ['meal_id'];
            isOneToOne: false;
            referencedRelation: 'meals';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_meal_plans_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_workout_plans: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          plan_date: string;
          status: Database['public']['Enums']['workout_status'];
          duration_sec: number | null;
          completed_sets: number | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_id: string;
          plan_date: string;
          status?: Database['public']['Enums']['workout_status'];
          duration_sec?: number | null;
          completed_sets?: number | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_id?: string;
          plan_date?: string;
          status?: Database['public']['Enums']['workout_status'];
          duration_sec?: number | null;
          completed_sets?: number | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_workout_plans_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_workout_plans_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'workouts';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          age: number | null;
          sex: string | null;
          height_cm: string | null;
          weight_kg: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          age?: number | null;
          sex?: string | null;
          height_cm?: string | null;
          weight_kg?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          age?: number | null;
          sex?: string | null;
          height_cm?: string | null;
          weight_kg?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ingredients: {
        Row: {
          id: string;
          name: string;
          name_aliases: string[];
          category: string;
          default_shelf_life_days: number | null;
          is_staple: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_aliases?: string[];
          category: string;
          default_shelf_life_days?: number | null;
          is_staple?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_aliases?: string[];
          category?: string;
          default_shelf_life_days?: number | null;
          is_staple?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      dishes: {
        Row: {
          id: string;
          name: string;
          slot_tags: string[];
          prep_minutes: number;
          effort_score: number;
          protein_g: number;
          calories: number;
          ingredients: Json;
          method_steps: Json;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slot_tags?: string[];
          prep_minutes: number;
          effort_score: number;
          protein_g: number;
          calories: number;
          ingredients?: Json;
          method_steps?: Json;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slot_tags?: string[];
          prep_minutes?: number;
          effort_score?: number;
          protein_g?: number;
          calories?: number;
          ingredients?: Json;
          method_steps?: Json;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leftover_transformations: {
        Row: {
          id: string;
          base_category: string;
          dish_id: string;
          extra_staples: string[];
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          base_category: string;
          dish_id: string;
          extra_staples?: string[];
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          base_category?: string;
          dish_id?: string;
          extra_staples?: string[];
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'leftover_transformations_dish_id_fkey';
            columns: ['dish_id'];
            isOneToOne: false;
            referencedRelation: 'dishes';
            referencedColumns: ['id'];
          },
        ];
      };
      pantry_items: {
        Row: {
          id: string;
          user_id: string;
          ingredient_id: string;
          source: string;
          purchased_at: string;
          predicted_empty_at: string | null;
          confidence: number;
          last_confirmed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ingredient_id: string;
          source: string;
          purchased_at?: string;
          predicted_empty_at?: string | null;
          confidence?: number;
          last_confirmed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ingredient_id?: string;
          source?: string;
          purchased_at?: string;
          predicted_empty_at?: string | null;
          confidence?: number;
          last_confirmed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pantry_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pantry_items_ingredient_id_fkey';
            columns: ['ingredient_id'];
            isOneToOne: false;
            referencedRelation: 'ingredients';
            referencedColumns: ['id'];
          },
        ];
      };
      household: {
        Row: {
          user_id: string;
          size_bucket: string;
          cooking_context: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          size_bucket: string;
          cooking_context?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          size_bucket?: string;
          cooking_context?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'household_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      leftover_events: {
        Row: {
          id: string;
          user_id: string;
          base_category: string;
          dish_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          base_category: string;
          dish_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          base_category?: string;
          dish_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'leftover_events_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'leftover_events_dish_id_fkey';
            columns: ['dish_id'];
            isOneToOne: false;
            referencedRelation: 'dishes';
            referencedColumns: ['id'];
          },
        ];
      };
      daily_plans: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          slots: Json;
          workout: Json | null;
          condition_flags: string[];
          generated_at: string;
          plan_version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          slots: Json;
          workout?: Json | null;
          condition_flags?: string[];
          generated_at?: string;
          plan_version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          slots?: Json;
          workout?: Json | null;
          condition_flags?: string[];
          generated_at?: string;
          plan_version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'daily_plans_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      meal_logs: {
        Row: {
          id: string;
          user_id: string;
          plan_date: string;
          slot: string;
          status: string;
          swap_category: string | null;
          custom_text: string | null;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_date: string;
          slot: string;
          status: string;
          swap_category?: string | null;
          custom_text?: string | null;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_date?: string;
          slot?: string;
          status?: string;
          swap_category?: string | null;
          custom_text?: string | null;
          logged_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'meal_logs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      cooking_mode: 'i_cook' | 'someone_cooks_for_me' | 'mix';
      diet_type: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian';
      fitness_goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
      meal_slot: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      workout_status: 'pending' | 'completed' | 'skipped';
    };
    CompositeTypes: Record<string, never>;
  };
}
