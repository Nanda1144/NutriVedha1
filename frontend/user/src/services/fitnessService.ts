import apiClient, { isMockEnabled } from './apiClient';
import { Workout, YogaAsana, FitnessProfile, FitnessLog } from '../types';
import { MOCK_WORKOUTS, MOCK_ASANAS } from './mockData';

let fitnessLogs: FitnessLog[] = [
  { id: 'log_01', date: '2026-11-22', workoutTitle: 'Morning Dinacharya Flow', durationMinutes: 25, caloriesBurned: 140, perceivedExertion: 3 },
  { id: 'log_02', date: '2026-11-21', workoutTitle: 'Pitta Cooling Chandra Flow', durationMinutes: 35, caloriesBurned: 190, perceivedExertion: 2 },
  { id: 'log_03', date: '2026-11-20', workoutTitle: 'Tridoshic Surya Namaskar (12 Cycles)', durationMinutes: 20, caloriesBurned: 120, perceivedExertion: 4 },
  { id: 'log_04', date: '2026-11-19', workoutTitle: 'Evening Nadi Shodhana & Restorative Yoga', durationMinutes: 30, caloriesBurned: 110, perceivedExertion: 2 },
];

export const fitnessService = {
  async getWorkouts(): Promise<Workout[]> {
    if (isMockEnabled()) {
      return MOCK_WORKOUTS;
    }
    const res = await apiClient.get<{ data: Workout[] }>('/fitness/workouts');
    return res.data.data;
  },

  async getAsanas(): Promise<YogaAsana[]> {
    if (isMockEnabled()) {
      return MOCK_ASANAS;
    }
    const res = await apiClient.get<{ data: YogaAsana[] }>('/fitness/asanas');
    return res.data.data;
  },

  async getProfile(): Promise<FitnessProfile> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      goal: 'Gentle Circadian Alignment & Agni Kindling',
      preferredActivity: 'Vinyasa Yoga & Breathwork',
      currentStreakDays: 7,
      longestStreakDays: 21,
      totalWorkoutsCompleted: 42,
      weeklyLogs: fitnessLogs,
    };
  },

  async logWorkout(log: Omit<FitnessLog, 'id'>): Promise<FitnessLog> {
    if (isMockEnabled()) {
      await new Promise((r) => setTimeout(r, 400));
      const newLog: FitnessLog = {
        ...log,
        id: 'log_' + Date.now(),
      };
      fitnessLogs.unshift(newLog);
      return newLog;
    }
    const res = await apiClient.post<{ data: FitnessLog }>('/fitness/logs', log);
    return res.data.data;
  },
};
