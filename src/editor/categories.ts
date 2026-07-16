import type { IconName } from '../ui/Icon';

export type CategoryId =
  | 'squishy'
  | 'colour'
  | 'skin'
  | 'face'
  | 'extras'
  | 'name'
  | 'gift';

export interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: IconName;
  emoji: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'squishy', label: 'Squishy', icon: 'shapes', emoji: '🧸' },
  { id: 'colour', label: 'Colour', icon: 'palette', emoji: '🎨' },
  { id: 'skin', label: 'Skin', icon: 'pattern', emoji: '🐯' },
  { id: 'face', label: 'Face', icon: 'face', emoji: '😊' },
  { id: 'extras', label: 'Extras', icon: 'sticker', emoji: '🎀' },
  { id: 'name', label: 'Name', icon: 'tag', emoji: '✏️' },
  { id: 'gift', label: 'Gift Box', icon: 'gift', emoji: '🎁' },
];

export const CATEGORY_ORDER = CATEGORIES.map((c) => c.id);
