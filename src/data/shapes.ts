import type { SquishyShape } from './types';

/* Geometry helpers — all shapes live on a 0..300 canvas.
   Characters are full-bodied "sitting squishy" silhouettes rather than plain
   heads, so each one has a distinct outline. */
const K = 0.5523; // cubic bezier circle constant

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

const tri = (
  x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
) => `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`;

/** A smooth "gourd" silhouette merging a head circle into a body ellipse,
    with a gentle neck pinch — the classic chibi squishy body. */
function figure(
  hx: number, hy: number, hr: number,
  bx: number, by: number, brx: number, bry: number,
): string {
  return [
    `M ${hx} ${hy - hr}`,
    `C ${hx + hr * 0.75} ${hy - hr} ${hx + hr} ${hy - hr * 0.62} ${hx + hr} ${hy}`,
    `C ${hx + hr} ${hy + hr * 0.6} ${bx + brx} ${by - bry * 0.82} ${bx + brx} ${by}`,
    `C ${bx + brx} ${by + bry * 0.62} ${bx + brx * 0.6} ${by + bry} ${bx} ${by + bry}`,
    `C ${bx - brx * 0.6} ${by + bry} ${bx - brx} ${by + bry * 0.62} ${bx - brx} ${by}`,
    `C ${bx - brx} ${by - bry * 0.82} ${hx - hr} ${hy + hr * 0.6} ${hx - hr} ${hy}`,
    `C ${hx - hr} ${hy - hr * 0.62} ${hx - hr * 0.75} ${hy - hr} ${hx} ${hy - hr}`,
    'Z',
  ].join(' ');
}

const foot = (cx: number, cy: number) =>
  ellipse(cx, cy, 22, 14);

export const SHAPES: SquishyShape[] = [
  /* ---------- Bear: round ears, chunky sitting body, paws ---------- */
  {
    id: 'bear',
    name: 'Bear',
    category: 'Animals',
    emoji: '🐻',
    behind: [
      circle(104, 62, 26), circle(196, 62, 26), // ears
      ellipse(70, 198, 17, 27), ellipse(230, 198, 17, 27), // arms
    ],
    body: figure(150, 108, 57, 150, 198, 82, 66),
    details: [
      { path: circle(104, 64, 13), tone: 'light' },
      { path: circle(196, 64, 13), tone: 'light' },
      { path: ellipse(150, 138, 30, 22), tone: 'light' }, // muzzle
      { path: foot(120, 252), tone: 'light' },
      { path: foot(180, 252), tone: 'light' },
    ],
    face: { x: 150, y: 110, scale: 0.82 },
    anchors: {
      head: { x: 150, y: 52 }, face: { x: 150, y: 110 },
      neck: { x: 150, y: 150 }, back: { x: 232, y: 196 }, sticker: { x: 150, y: 206 },
    },
  },

  /* ---------- Cat: pointy ears, curled tail, slim body ---------- */
  {
    id: 'cat',
    name: 'Cat',
    category: 'Animals',
    emoji: '🐱',
    behind: [
      tri(102, 98, 92, 48, 134, 84),
      tri(198, 98, 208, 48, 166, 84),
      // curled tail
      'M 226 224 C 268 214 268 168 244 160 C 262 172 252 196 226 200 Z',
    ],
    body: figure(150, 110, 54, 150, 200, 76, 62),
    details: [
      { path: tri(108, 92, 100, 62, 124, 84), tone: 'light' },
      { path: tri(192, 92, 200, 62, 176, 84), tone: 'light' },
      { path: foot(122, 254), tone: 'light' },
      { path: foot(178, 254), tone: 'light' },
    ],
    face: { x: 150, y: 114, scale: 0.8 },
    anchors: {
      head: { x: 150, y: 58 }, face: { x: 150, y: 114 },
      neck: { x: 150, y: 152 }, back: { x: 230, y: 198 }, sticker: { x: 150, y: 208 },
    },
  },

  /* ---------- Dog: floppy ears, snout, paws ---------- */
  {
    id: 'dog',
    name: 'Dog',
    category: 'Animals',
    emoji: '🐶',
    behind: [
      ellipse(96, 128, 22, 42), ellipse(204, 128, 22, 42), // floppy ears
    ],
    body: figure(150, 110, 55, 150, 200, 80, 64),
    details: [
      { path: ellipse(150, 138, 32, 24), tone: 'light' }, // snout
      { path: foot(120, 256), tone: 'light' },
      { path: foot(180, 256), tone: 'light' },
      { path: ellipse(190, 176, 20, 16), tone: 'dark' }, // patch
    ],
    face: { x: 150, y: 108, scale: 0.8 },
    anchors: {
      head: { x: 150, y: 56 }, face: { x: 150, y: 108 },
      neck: { x: 150, y: 152 }, back: { x: 232, y: 200 }, sticker: { x: 150, y: 208 },
    },
  },

  /* ---------- Duck: rounded body, orange beak & feet, little wing ---------- */
  {
    id: 'duck',
    name: 'Duck',
    category: 'Animals',
    emoji: '🦆',
    body: figure(150, 100, 50, 150, 202, 78, 70),
    details: [
      { path: ellipse(198, 210, 24, 32), tone: 'light' }, // wing
      { path: 'M 120 112 q30 -13 60 0 q -9 24 -30 24 q -21 0 -30 -24 Z', fill: '#FFAE4D' }, // beak
      { path: 'M 116 264 q16 13 34 6 q -8 -20 -34 -6 Z', fill: '#FFAE4D' },
      { path: 'M 184 264 q-16 13 -34 6 q 8 -20 34 -6 Z', fill: '#FFAE4D' },
    ],
    face: { x: 150, y: 88, scale: 0.7 },
    anchors: {
      head: { x: 150, y: 48 }, face: { x: 150, y: 96 },
      neck: { x: 150, y: 148 }, back: { x: 232, y: 200 }, sticker: { x: 150, y: 210 },
    },
  },

  /* ---------- Axolotl: feathery gills, wide smile, little legs ---------- */
  {
    id: 'axolotl',
    name: 'Axolotl',
    category: 'Sea Creatures',
    emoji: '🌸',
    behind: [
      circle(80, 86, 15), circle(64, 112, 15), circle(78, 140, 15),
      circle(220, 86, 15), circle(236, 112, 15), circle(222, 140, 15),
    ],
    body: figure(150, 112, 56, 150, 200, 80, 62),
    details: [
      { path: foot(118, 254), tone: 'light' },
      { path: foot(182, 254), tone: 'light' },
    ],
    face: { x: 150, y: 116, scale: 0.9 },
    anchors: {
      head: { x: 150, y: 58 }, face: { x: 150, y: 116 },
      neck: { x: 150, y: 154 }, back: { x: 234, y: 200 }, sticker: { x: 150, y: 210 },
    },
  },

  /* ---------- Unicorn: horn, mane, ears ---------- */
  {
    id: 'unicorn',
    name: 'Unicorn',
    category: 'Fantasy',
    emoji: '🦄',
    behind: [
      tri(118, 92, 108, 52, 140, 84),
      tri(182, 92, 192, 52, 160, 84),
      // mane bumps down the back
      circle(206, 96, 16), circle(214, 128, 15), circle(210, 160, 14),
    ],
    body: figure(150, 112, 54, 150, 200, 78, 64),
    details: [
      { path: 'M 150 28 L 141 82 L 159 82 Z', fill: '#FFE08A' }, // horn
      { path: 'M 146 44 l 10 4 M 144 58 l 12 4 M 143 72 l 14 4', fill: '#E7B84B' },
      { path: foot(120, 256), tone: 'light' },
      { path: foot(180, 256), tone: 'light' },
    ],
    face: { x: 150, y: 116, scale: 0.84 },
    anchors: {
      head: { x: 128, y: 60 }, face: { x: 150, y: 116 },
      neck: { x: 150, y: 154 }, back: { x: 232, y: 200 }, sticker: { x: 150, y: 210 },
    },
  },

  /* ---------- Ice Cream: soft-serve swirl on a cone, cherry ---------- */
  {
    id: 'icecream',
    name: 'Ice Cream',
    category: 'Food',
    emoji: '🍦',
    body:
      'M 150 52 ' +
      'C 178 52 190 74 180 90 ' +
      'C 206 90 214 116 196 128 ' +
      'C 222 132 222 160 198 168 ' +
      'C 210 172 214 184 206 192 ' +
      'L 172 250 C 168 260 160 264 150 264 ' +
      'C 140 264 132 260 128 250 ' +
      'L 94 192 C 86 184 90 172 102 168 ' +
      'C 78 160 78 132 104 128 ' +
      'C 86 116 94 90 120 90 ' +
      'C 110 74 122 52 150 52 Z',
    details: [
      { path: 'M 116 96 q34 -12 68 0', tone: 'light' },
      { path: 'M 108 128 q42 -12 84 0', tone: 'light' },
      { path: 'M 104 166 q46 -10 92 0', tone: 'light' },
      { path: circle(150, 46, 11), fill: '#FF5C6E' }, // cherry
      { path: 'M 150 36 q10 -12 18 -6', fill: '#5FA85A' }, // stem
    ],
    face: { x: 150, y: 150, scale: 0.78 },
    anchors: {
      head: { x: 150, y: 56 }, face: { x: 150, y: 150 },
      neck: { x: 150, y: 208 }, back: { x: 214, y: 150 }, sticker: { x: 186, y: 176 },
    },
  },

  /* ---------- Donut: torus with sprinkles ---------- */
  {
    id: 'donut',
    name: 'Donut',
    category: 'Food',
    emoji: '🍩',
    body: circle(150, 152, 92) + ' ' + circle(150, 152, 34),
    details: [
      { path: 'M 84 118 q10 -16 24 -6', fill: '#FF63C4' },
      { path: 'M 210 124 q16 -8 22 6', fill: '#FFE667' },
      { path: 'M 222 186 q6 16 -10 20', fill: '#72E6A6' },
      { path: 'M 96 200 q-4 16 -20 12', fill: '#45AEEF' },
      { path: 'M 150 74 q14 4 10 20', fill: '#B69AF8' },
      { path: 'M 128 92 q-2 -16 14 -14', fill: '#FF875C' },
    ],
    face: { x: 150, y: 100, scale: 0.6 },
    anchors: {
      head: { x: 150, y: 60 }, face: { x: 150, y: 100 },
      neck: { x: 150, y: 244 }, back: { x: 238, y: 152 }, sticker: { x: 206, y: 206 },
    },
  },

  /* ---------- Frog: wide body, eye bumps, big smile, front feet ---------- */
  {
    id: 'frog',
    name: 'Frog',
    category: 'Sea Creatures',
    emoji: '🐸',
    behind: [circle(118, 100, 30), circle(182, 100, 30)],
    body: figure(150, 128, 48, 150, 198, 94, 58),
    details: [
      { path: circle(118, 98, 15), tone: 'light' },
      { path: circle(182, 98, 15), tone: 'light' },
      { path: ellipse(116, 252, 26, 13), tone: 'light' },
      { path: ellipse(184, 252, 26, 13), tone: 'light' },
    ],
    face: { x: 150, y: 122, scale: 0.94 },
    anchors: {
      head: { x: 150, y: 72 }, face: { x: 150, y: 122 },
      neck: { x: 150, y: 160 }, back: { x: 244, y: 196 }, sticker: { x: 150, y: 210 },
    },
  },

  /* ---------- Mystery Blob: wobbly amorphous drop ---------- */
  {
    id: 'blob',
    name: 'Mystery Blob',
    category: 'Mystery',
    emoji: '❓',
    body:
      'M 150 60 ' +
      'C 198 56 236 84 240 128 ' +
      'C 243 158 236 176 236 200 ' +
      'C 236 236 200 250 150 250 ' +
      'C 104 250 66 240 62 206 ' +
      'C 58 178 60 160 62 132 ' +
      'C 66 86 104 64 150 60 Z',
    details: [
      { path: ellipse(150, 232, 34, 12), tone: 'light' },
    ],
    face: { x: 150, y: 150, scale: 1 },
    anchors: {
      head: { x: 150, y: 62 }, face: { x: 150, y: 150 },
      neck: { x: 150, y: 244 }, back: { x: 236, y: 150 }, sticker: { x: 200, y: 200 },
    },
  },
];

export const SHAPE_MAP: Record<string, SquishyShape> = Object.fromEntries(
  SHAPES.map((s) => [s.id, s]),
);
