import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

// The database stores the id as plain text, so adding a sport is a one-line change here.
export const CATEGORIES: { id: string; label: string; icon: IconName }[] = [
  { id: 'basketball', label: 'Basketball', icon: 'basketball-outline' },
  { id: 'soccer', label: 'Soccer', icon: 'football-outline' },
  { id: 'football', label: 'Football', icon: 'american-football-outline' },
  { id: 'baseball', label: 'Baseball', icon: 'baseball-outline' },
  { id: 'tennis', label: 'Tennis', icon: 'tennisball-outline' },
  { id: 'other', label: 'Other', icon: 'ellipse-outline' },
];

export function categoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export const categoryOptions = CATEGORIES.map((c) => ({ value: c.id, label: c.label }));
