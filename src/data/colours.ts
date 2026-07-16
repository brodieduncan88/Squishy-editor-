import type { Colour, Gradient } from './types';

/* 20 body colours across three groups. */
export const COLOURS: Colour[] = [
  // Pastel
  { id: 'pastel-pink', name: 'Bubblegum', hex: '#F9B5DE', group: 'pastel' },
  { id: 'pastel-mint', name: 'Fresh Mint', hex: '#9CEFC2', group: 'pastel' },
  { id: 'pastel-lemon', name: 'Lemon Cloud', hex: '#FFEE9C', group: 'pastel' },
  { id: 'pastel-lav', name: 'Soft Lilac', hex: '#CBB6FB', group: 'pastel' },
  { id: 'pastel-sky', name: 'Baby Sky', hex: '#B6E2FA', group: 'pastel' },
  { id: 'pastel-peach', name: 'Peachy', hex: '#FFC4A8', group: 'pastel' },
  { id: 'pastel-cream', name: 'Vanilla', hex: '#FFF0D4', group: 'pastel' },

  // Bright
  { id: 'bright-pink', name: 'Hot Pink', hex: '#FF63C4', group: 'bright' },
  { id: 'bright-red', name: 'Cherry', hex: '#FF5C6E', group: 'bright' },
  { id: 'bright-orange', name: 'Peach Pop', hex: '#FF875C', group: 'bright' },
  { id: 'bright-yellow', name: 'Sunny', hex: '#FFD93B', group: 'bright' },
  { id: 'bright-green', name: 'Lime', hex: '#57DD8E', group: 'bright' },
  { id: 'bright-teal', name: 'Ocean', hex: '#37C7C7', group: 'bright' },
  { id: 'bright-blue', name: 'Blue Raspberry', hex: '#45AEEF', group: 'bright' },
  { id: 'bright-purple', name: 'Grape', hex: '#9A6CF5', group: 'bright' },

  // Metallic
  { id: 'metal-gold', name: 'Gold', hex: '#E8C15A', group: 'metallic', metallic: true },
  { id: 'metal-silver', name: 'Silver', hex: '#C9D2DE', group: 'metallic', metallic: true },
  { id: 'metal-rose', name: 'Rose Gold', hex: '#E7A9A0', group: 'metallic', metallic: true },
  { id: 'metal-bronze', name: 'Bronze', hex: '#CD9061', group: 'metallic', metallic: true },
  { id: 'metal-steel', name: 'Steel Blue', hex: '#8FA9C4', group: 'metallic', metallic: true },
];

export const COLOUR_MAP: Record<string, Colour> = Object.fromEntries(
  COLOURS.map((c) => [c.id, c]),
);

export const GRADIENTS: Gradient[] = [
  { id: 'grad-sunset', name: 'Sunset', from: '#FFD93B', to: '#FF63C4' },
  { id: 'grad-cotton', name: 'Cotton Candy', from: '#F9B5DE', to: '#B6E2FA' },
  { id: 'grad-mermaid', name: 'Mermaid', from: '#9CEFC2', to: '#45AEEF' },
  { id: 'grad-grape', name: 'Grape Soda', from: '#CBB6FB', to: '#9A6CF5' },
  { id: 'grad-peachy', name: 'Peach Fizz', from: '#FFEE9C', to: '#FF875C' },
  { id: 'grad-galaxy', name: 'Galaxy', from: '#9A6CF5', to: '#37C7C7' },
];

export const GRADIENT_MAP: Record<string, Gradient> = Object.fromEntries(
  GRADIENTS.map((g) => [g.id, g]),
);
