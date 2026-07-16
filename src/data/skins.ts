import type { Skin } from './types';

/* 14 skins. Solid + patterns are rendered via SVG <pattern> defs that are
   clipped to the body silhouette. Texture skins layer a themed overlay. */
export const SKINS: Skin[] = [
  { id: 'solid', name: 'Solid', kind: 'solid', emoji: '⬤' },
  { id: 'tiger', name: 'Tiger', kind: 'pattern', emoji: '🐯' },
  { id: 'leopard', name: 'Leopard', kind: 'pattern', emoji: '🐆' },
  { id: 'cow', name: 'Cow', kind: 'pattern', emoji: '🐄' },
  { id: 'zebra', name: 'Zebra', kind: 'pattern', emoji: '🦓' },
  { id: 'stars', name: 'Stars', kind: 'pattern', emoji: '⭐' },
  { id: 'hearts', name: 'Hearts', kind: 'pattern', emoji: '💗' },
  { id: 'clouds', name: 'Clouds', kind: 'pattern', emoji: '☁️' },
  { id: 'galaxy', name: 'Galaxy', kind: 'texture', overlay: 'galaxy', emoji: '🌌' },
  { id: 'glitter', name: 'Glitter', kind: 'texture', overlay: 'glitter', emoji: '✨' },
  { id: 'gold', name: 'Gold', kind: 'texture', overlay: 'gold', emoji: '🥇' },
  { id: 'silver', name: 'Silver', kind: 'texture', overlay: 'silver', emoji: '🥈' },
  { id: 'holo', name: 'Holographic', kind: 'texture', overlay: 'holo', emoji: '🪩' },
  { id: 'rainbow', name: 'Rainbow', kind: 'texture', overlay: 'rainbow', emoji: '🌈' },
];

export const SKIN_MAP: Record<string, Skin> = Object.fromEntries(
  SKINS.map((s) => [s.id, s]),
);
