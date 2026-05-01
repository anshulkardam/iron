import { createId } from '@paralleldrive/cuid2';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const goalEnum = pgEnum('goal', [
  'lose_weight',
  'build_muscle',
  'maintain',
  'improve_endurance',
  'general_fitness',
]);

export const genderEnum = pgEnum('gender', [
  'male',
  'female',
  'other',
  'prefer_not_to_say',
]);

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),

  // OAuth
  googleId: text('google_id').unique(),
  appleId: text('apple_id').unique(),

  // Profile
  email: text('email').unique(),
  name: text('name'),
  username: text('username').unique(), // @handle on the app
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  gender: genderEnum('gender'),

  // Fitness profile — used by AI coach
  goal: goalEnum('goal'),
  targetWeightKg: integer('target_weight_kg'), // in kg * 100 (avoid floats)
  heightCm: integer('height_cm'),
  dateOfBirth: timestamp('date_of_birth'),
  activityLevel: text('activity_level'), // sedentary | light | moderate | very_active

  // Calorie targets — set by AI coach, can be overridden
  dailyCalorieTarget: integer('daily_calorie_target'),
  dailyProteinTarget: integer('daily_protein_target'), // grams
  dailyCarbTarget: integer('daily_carb_target'),
  dailyFatTarget: integer('daily_fat_target'),

  // Flags
  onboardingComplete: boolean('onboarding_complete').default(false),
  isActive: boolean('is_active').default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
