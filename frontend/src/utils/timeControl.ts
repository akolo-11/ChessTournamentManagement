import type { time_control } from '../types';

export type time_controlCategory = 'bullet' | 'blitz' | 'rapid' | 'classical';

export function formattime_control(tc: time_control): string {
  if (tc.label) return tc.label;
  return `${tc.baseMinutes}+${tc.incrementSeconds}`;
}

export function gettime_controlCategory(tc: time_control): time_controlCategory {
  const totalMinutes = tc.baseMinutes + (tc.incrementSeconds * 40) / 60;
  if (totalMinutes < 3) return 'bullet';
  if (totalMinutes < 10) return 'blitz';
  if (totalMinutes < 60) return 'rapid';
  return 'classical';
}

export const categoryLabels: Record<time_controlCategory, string> = {
  bullet: 'Пуля',
  blitz: 'Блиц',
  rapid: 'Рапид',
  classical: 'Классика',
};