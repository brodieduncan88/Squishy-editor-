import type { SquishyShape } from './types';

/* Geometry helpers — all shapes live on a 0..300 canvas, centred at 150,150.
   Building paths from primitives keeps the silhouettes correct and readable. */
const K = 0.5523; // cubic bezier circle constant

/** A closed circle expressed as an SVG path (so it can be a mask/clip too). */
export function circle(cx: number, cy: number, r: number): string {
  const o = r * K;
  return (
    `M ${cx} ${cy - r} ` +
    `C ${cx + o} ${cy - r} ${cx + r} ${cy - o} ${cx + r} ${cy} ` +
    `C ${cx + r} ${cy + o} ${cx + o} ${cy + r} ${cx} ${cy + r} ` +
    `C ${cx - o} ${cy + r} ${cx - r} ${cy + o} ${cx - r} ${cy} ` +
    `C ${cx - r} ${cy - o} ${cx - o} ${cy - r} ${cx} ${cy - r} Z`
  );
}

/** An ellipse as a path. */
export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  const ox = rx * K;
  const oy = ry * K;
  return (
    `M ${cx} ${cy - ry} ` +
    `C ${cx + ox} ${cy - ry} ${cx + rx} ${cy - oy} ${cx + rx} ${cy} ` +
    `C ${cx + rx} ${cy + oy} ${cx + ox} ${cy + ry} ${cx} ${cy + ry} ` +
    `C ${cx - ox} ${cy + ry} ${cx - rx} ${cy + oy} ${cx - rx} ${cy} ` +
    `C ${cx - rx} ${cy - oy} ${cx - ox} ${cy - ry} ${cx} ${cy - ry} Z`
  );
}

// A softly squished round body used by most characters.
const roundBody = ellipse(150, 155, 92, 86);

export const SHAPES: SquishyShape[] = [
  {
    id: 'bear',
    name: 'Bear',
    category: 'Animals',
    emoji: '🐻',
    behind: [circle(88, 92, 34), circle(212, 92, 34)],
    details: [
      { path: circle(88, 92, 16), tone: 'light' },
      { path: circle(212, 92, 16), tone: 'light' },
      { path: ellipse(150, 178, 30, 24), tone: 'light' },
    ],
    body: roundBody,
    face: { x: 150, y: 150, scale: 1 },
    anchors: {
      head: { x: 150, y: 66 },
      face: { x: 150, y: 150 },
      neck: { x: 150, y: 236 },
      back: { x: 232, y: 150 },
      sticker: { x: 200, y: 200 },
    },
  },
  {
    id: 'cat',
    name: 'Cat',
    category: 'Animals',
    emoji: '🐱',
    behind: [
      'M 78 96 L 96 40 L 132 78 Z',
      'M 222 96 L 204 40 L 168 78 Z',
    ],
    details: [
      { path: 'M 84 92 L 95 62 L 118 82 Z', tone: 'light' },
      { path: 'M 216 92 L 205 62 L 182 82 Z', tone: 'light' },
    ],
    body: roundBody,
    face: { x: 150, y: 152, scale: 1 },
    anchors: {
      head: { x: 150, y: 60 },
      face: { x: 150, y: 152 },
      neck: { x: 150, y: 238 },
      back: { x: 234, y: 150 },
      sticker: { x: 202, y: 202 },
    },
  },
  {
    id: 'dog',
    name: 'Dog',
    category: 'Animals',
    emoji: '🐶',
    behind: [ellipse(74, 120, 26, 44), ellipse(226, 120, 26, 44)],
    details: [{ path: ellipse(150, 182, 28, 22), tone: 'light' }],
    body: roundBody,
    face: { x: 150, y: 150, scale: 1 },
    anchors: {
      head: { x: 150, y: 68 },
      face: { x: 150, y: 150 },
      neck: { x: 150, y: 236 },
      back: { x: 236, y: 150 },
      sticker: { x: 200, y: 204 },
    },
  },
  {
    id: 'duck',
    name: 'Duck',
    category: 'Animals',
    emoji: '🦆',
    body: ellipse(150, 158, 88, 84),
    details: [
      { path: 'M 118 176 q 32 26 64 0 q -6 24 -32 24 q -26 0 -32 -24 Z', tone: 'dark' },
    ],
    face: { x: 150, y: 138, scale: 0.92 },
    anchors: {
      head: { x: 150, y: 74 },
      face: { x: 150, y: 138 },
      neck: { x: 150, y: 238 },
      back: { x: 234, y: 150 },
      sticker: { x: 200, y: 202 },
    },
  },
  {
    id: 'axolotl',
    name: 'Axolotl',
    category: 'Sea Creatures',
    emoji: '🌸',
    behind: [
      circle(66, 108, 15), circle(58, 138, 15), circle(66, 168, 15),
      circle(234, 108, 15), circle(242, 138, 15), circle(234, 168, 15),
    ],
    body: ellipse(150, 158, 86, 84),
    face: { x: 150, y: 150, scale: 1 },
    anchors: {
      head: { x: 150, y: 74 },
      face: { x: 150, y: 150 },
      neck: { x: 150, y: 240 },
      back: { x: 236, y: 150 },
      sticker: { x: 202, y: 202 },
    },
  },
  {
    id: 'unicorn',
    name: 'Unicorn',
    category: 'Fantasy',
    emoji: '🦄',
    behind: [
      'M 118 92 L 100 44 L 138 82 Z',
      'M 182 92 L 200 44 L 162 82 Z',
    ],
    details: [
      { path: 'M 150 26 L 138 84 L 162 84 Z', tone: 'light' },
    ],
    body: roundBody,
    face: { x: 150, y: 156, scale: 0.98 },
    anchors: {
      head: { x: 150, y: 48 },
      face: { x: 150, y: 156 },
      neck: { x: 150, y: 238 },
      back: { x: 236, y: 150 },
      sticker: { x: 202, y: 202 },
    },
  },
  {
    id: 'icecream',
    name: 'Ice Cream',
    category: 'Food',
    emoji: '🍦',
    body:
      'M 150 62 ' +
      'C 196 62 234 96 234 140 ' +
      'C 234 168 214 186 196 196 ' +
      'L 172 250 C 168 260 160 264 150 264 ' +
      'C 140 264 132 260 128 250 ' +
      'L 104 196 C 86 186 66 168 66 140 ' +
      'C 66 96 104 62 150 62 Z',
    details: [{ path: ellipse(150, 120, 60, 34), tone: 'light' }],
    face: { x: 150, y: 150, scale: 0.86 },
    anchors: {
      head: { x: 150, y: 66 },
      face: { x: 150, y: 150 },
      neck: { x: 150, y: 210 },
      back: { x: 226, y: 140 },
      sticker: { x: 190, y: 176 },
    },
  },
  {
    id: 'donut',
    name: 'Donut',
    category: 'Food',
    emoji: '🍩',
    // Outer ring + inner hole (even-odd fill rule handled in renderer via clip).
    body: circle(150, 152, 92) + ' ' + circle(150, 152, 34),
    details: [
      { path: 'M 88 108 q 12 -14 26 -4 q -4 16 -20 14 q -12 -2 -6 -10 Z', tone: 'light' },
      { path: 'M 206 190 q 12 -14 26 -4 q -4 16 -20 14 q -12 -2 -6 -10 Z', tone: 'light' },
    ],
    face: { x: 150, y: 96, scale: 0.62 },
    anchors: {
      head: { x: 150, y: 60 },
      face: { x: 150, y: 96 },
      neck: { x: 150, y: 244 },
      back: { x: 238, y: 152 },
      sticker: { x: 206, y: 206 },
    },
  },
  {
    id: 'frog',
    name: 'Frog',
    category: 'Sea Creatures',
    emoji: '🐸',
    behind: [circle(104, 88, 30), circle(196, 88, 30)],
    details: [
      { path: circle(104, 84, 13), tone: 'light' },
      { path: circle(196, 84, 13), tone: 'light' },
      { path: 'M 104 90 a 4 5 0 1 0 0.1 0 Z', tone: 'dark' },
      { path: 'M 196 90 a 4 5 0 1 0 0.1 0 Z', tone: 'dark' },
    ],
    body: ellipse(150, 162, 92, 78),
    face: { x: 150, y: 168, scale: 0.9 },
    anchors: {
      head: { x: 150, y: 70 },
      face: { x: 150, y: 168 },
      neck: { x: 150, y: 236 },
      back: { x: 236, y: 158 },
      sticker: { x: 202, y: 200 },
    },
  },
  {
    id: 'blob',
    name: 'Mystery Blob',
    category: 'Mystery',
    emoji: '❓',
    body:
      'M 150 66 ' +
      'C 200 60 238 92 238 138 ' +
      'C 238 170 250 188 232 214 ' +
      'C 214 240 178 244 150 244 ' +
      'C 118 244 82 238 64 210 ' +
      'C 48 184 62 168 62 138 ' +
      'C 62 92 100 72 150 66 Z',
    face: { x: 150, y: 156, scale: 1 },
    anchors: {
      head: { x: 150, y: 70 },
      face: { x: 150, y: 156 },
      neck: { x: 150, y: 240 },
      back: { x: 234, y: 150 },
      sticker: { x: 200, y: 200 },
    },
  },
];

export const SHAPE_MAP: Record<string, SquishyShape> = Object.fromEntries(
  SHAPES.map((s) => [s.id, s]),
);
