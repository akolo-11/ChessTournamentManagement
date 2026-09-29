import type { TimeControl } from '../types';

export type TimeControlCategory = 'bullet' | 'blitz' | 'rapid' | 'classical';

export function formatTimeControl(tc: TimeControl): string {
  if (tc.label) return tc.label;
  return `${tc.baseMinutes}+${tc.incrementSeconds}`;
}

export function getTimeControlCategory(tc: TimeControl): TimeControlCategory {
  const totalMinutes = tc.baseMinutes + (tc.incrementSeconds * 40) / 60;
  if (totalMinutes < 3) return 'bullet';
  if (totalMinutes < 10) return 'blitz';
  if (totalMinutes < 60) return 'rapid';
  return 'classical';
}

export const categoryLabels: Record<TimeControlCategory, string> = {
  bullet: 'Пуля',
  blitz: 'Блиц',
  rapid: 'Рапид',
  classical: 'Классика',
};