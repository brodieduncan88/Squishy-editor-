import type { GiftBox, Wrapping, Ribbon, DesignPack, Personality } from './types';

/* 6 gift boxes. */
export const GIFT_BOXES: GiftBox[] = [
  { id: 'box-classic', name: 'Classic', colour: '#F48BD8', emoji: '🎁' },
  { id: 'box-tall', name: 'Tall', colour: '#B69AF8', emoji: '📦' },
  { id: 'box-heart', name: 'Heart', colour: '#FF63C4', emoji: '💝' },
  { id: 'box-round', name: 'Round', colour: '#45AEEF', emoji: '🥡' },
  { id: 'box-mini', name: 'Mini', colour: '#72E6A6', emoji: '🎀' },
  { id: 'box-star', name: 'Star', colour: '#FFE667', emoji: '⭐' },
];
export const GIFT_BOX_MAP: Record<string, GiftBox> = Object.fromEntries(
  GIFT_BOXES.map((b) => [b.id, b]),
);

export const WRAPPINGS: Wrapping[] = [
  { id: 'wrap-plain', name: 'Plain', pattern: 'plain', emoji: '🟪' },
  { id: 'wrap-dots', name: 'Polka Dots', pattern: 'dots', emoji: '🔵' },
  { id: 'wrap-stripes', name: 'Stripes', pattern: 'stripes', emoji: '🟨' },
  { id: 'wrap-stars', name: 'Stars', pattern: 'stars', emoji: '⭐' },
  { id: 'wrap-hearts', name: 'Hearts', pattern: 'hearts', emoji: '💗' },
  { id: 'wrap-confetti', name: 'Confetti', pattern: 'confetti', emoji: '🎊' },
];
export const WRAPPING_MAP: Record<string, Wrapping> = Object.fromEntries(
  WRAPPINGS.map((w) => [w.id, w]),
);

export const RIBBONS: Ribbon[] = [
  { id: 'ribbon-gold', name: 'Gold', colour: '#FFE667', emoji: '🟡' },
  { id: 'ribbon-pink', name: 'Pink', colour: '#F48BD8', emoji: '🩷' },
  { id: 'ribbon-mint', name: 'Mint', colour: '#72E6A6', emoji: '🟢' },
  { id: 'ribbon-sky', name: 'Sky', colour: '#45AEEF', emoji: '🔵' },
  { id: 'ribbon-lav', name: 'Lavender', colour: '#B69AF8', emoji: '🟣' },
];
export const RIBBON_MAP: Record<string, Ribbon> = Object.fromEntries(
  RIBBONS.map((r) => [r.id, r]),
);

export const PERSONALITIES: Personality[] = [
  'Brave',
  'Funny',
  'Kind',
  'Sleepy',
  'Cheeky',
  'Magical',
];

/* Home design packs — quick-start looks that seed the editor. */
export const DESIGN_PACKS: DesignPack[] = [
  { id: 'pastel-dream', name: 'Pastel Dream', blurb: 'Soft pastel tones', colours: ['pastel-lav', 'pastel-pink'], skin: 'clouds' },
  { id: 'wild-animal', name: 'Wild Animal', blurb: 'Bold animal prints', colours: ['pastel-lemon', 'bright-orange'], skin: 'tiger' },
  { id: 'galaxy-glitter', name: 'Galaxy Glitter', blurb: 'Cosmic sparkle', colours: ['bright-purple', 'bright-blue'], skin: 'galaxy' },
  { id: 'golden-glow', name: 'Golden Glow', blurb: 'Metallic shine', colours: ['metal-gold', 'pastel-cream'], skin: 'gold' },
  { id: 'rainbow-pop', name: 'Rainbow Pop', blurb: 'Full spectrum', colours: ['bright-pink', 'bright-yellow'], skin: 'rainbow' },
  { id: 'sweet-treats', name: 'Sweet Treats', blurb: 'Candy colours', colours: ['pastel-pink', 'pastel-lemon'], skin: 'hearts' },
];
