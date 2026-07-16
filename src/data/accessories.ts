import type { Accessory, AnchorPoint } from './types';

/* 10 accessories. Each returns SVG markup drawn on the 0..300 canvas,
   positioned relative to the shape's slot anchor. */
const NAVY = '#1F2850';

export const ACCESSORIES: Accessory[] = [
  {
    id: 'bow',
    name: 'Bow',
    slot: 'head',
    emoji: '🎀',
    render: ({ x, y }: AnchorPoint) => `
      <g transform="translate(${x} ${y - 4})">
        <path d="M0 0 C-26 -20 -40 -8 -40 6 C-40 20 -26 24 0 6 Z" fill="#F48BD8"/>
        <path d="M0 0 C26 -20 40 -8 40 6 C40 20 26 24 0 6 Z" fill="#F48BD8"/>
        <path d="M0 0 C-26 -20 -40 -8 -40 6 C-30 6 -14 4 0 4 Z" fill="#E070BE"/>
        <path d="M0 0 C26 -20 40 -8 40 6 C30 6 14 4 0 4 Z" fill="#E070BE"/>
        <circle cx="0" cy="3" r="9" fill="#FFB4E4"/>
      </g>`,
  },
  {
    id: 'crown',
    name: 'Crown',
    slot: 'head',
    emoji: '👑',
    render: ({ x, y }: AnchorPoint) => `
      <g transform="translate(${x} ${y})">
        <path d="M-34 12 L-34 -14 L-17 2 L0 -22 L17 2 L34 -14 L34 12 Z"
          fill="#FFE667" stroke="#E8C15A" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="-34" cy="-14" r="5" fill="#FF63C4"/>
        <circle cx="0" cy="-22" r="5" fill="#45AEEF"/>
        <circle cx="34" cy="-14" r="5" fill="#72E6A6"/>
        <rect x="-34" y="10" width="68" height="7" rx="3" fill="#E8C15A"/>
      </g>`,
  },
  {
    id: 'glasses',
    name: 'Glasses',
    slot: 'face',
    emoji: '👓',
    render: ({ x, y }: AnchorPoint) => `
      <g transform="translate(${x} ${y - 6})" fill="none" stroke="${NAVY}" stroke-width="5">
        <circle cx="-26" cy="0" r="20" fill="rgba(255,255,255,0.35)"/>
        <circle cx="26" cy="0" r="20" fill="rgba(255,255,255,0.35)"/>
        <path d="M-6 0 q6 -8 12 0" stroke-linecap="round"/>
        <path d="M-46 -4 l-14 -6" stroke-linecap="round"/>
        <path d="M46 -4 l14 -6" stroke-linecap="round"/>
      </g>`,
  },
  {
    id: 'hat',
    name: 'Hat',
    slot: 'head',
    emoji: '🎉',
    render: ({ x, y }: AnchorPoint) => `
      <g transform="translate(${x} ${y - 2})">
        <path d="M0 -46 L22 14 L-22 14 Z" fill="#FF875C" stroke="#E56A43" stroke-width="3" stroke-linejoin="round"/>
        <path d="M-16 2 h32 M-19 -12 h26 M-9 -26 h14" stroke="#FFFDF8" stroke-width="4" stroke-linecap="round"/>
        <circle cx="0" cy="-50" r="7" fill="#72E6A6"/>
      </g>`,
  },
  {
    id: 'wings',
    name: 'Wings',
    slot: 'back',
    emoji: '🪽',
    render: (_: AnchorPoint) => `
      <g opacity="0.92">
        <path d="M64 150 C10 108 6 178 40 196 C14 210 40 244 78 214 Z"
          fill="rgba(182,226,250,0.85)" stroke="#8FD3F7" stroke-width="3"/>
        <path d="M236 150 C290 108 294 178 260 196 C286 210 260 244 222 214 Z"
          fill="rgba(182,226,250,0.85)" stroke="#8FD3F7" stroke-width="3"/>
      </g>`,
  },
  {
    id: 'horns',
    name: 'Horns',
    slot: 'head',
    emoji: '😈',
    render: ({ x, y }: AnchorPoint) => `
      <g transform="translate(${x} ${y})" fill="#B69AF8" stroke="#9A6CF5" stroke-width="3" stroke-linejoin="round">
        <path d="M-26 8 C-40 -14 -30 -22 -14 -18 C-18 -6 -18 2 -26 8 Z"/>
        <path d="M26 8 C40 -14 30 -22 14 -18 C18 -6 18 2 26 8 Z"/>
      </g>`,
  },
  {
    id: 'collar',
    name: 'Collar',
    slot: 'neck',
    emoji: '🟢',
    render: ({ x, y }: AnchorPoint) => `
      <g transform="translate(${x} ${y - 8})">
        <path d="M-58 0 q58 34 116 0" fill="none" stroke="#72E6A6" stroke-width="14" stroke-linecap="round"/>
        <circle cx="0" cy="18" r="10" fill="#FFE667" stroke="#E8C15A" stroke-width="3"/>
      </g>`,
  },
  {
    id: 'necklace',
    name: 'Necklace',
    slot: 'neck',
    emoji: '📿',
    render: ({ x, y }: AnchorPoint) => `
      <g transform="translate(${x} ${y - 12})">
        <path d="M-46 0 q46 40 92 0" fill="none" stroke="#E8C15A" stroke-width="4"/>
        <path d="M0 30 l-9 -12 l9 -12 l9 12 Z" fill="#F48BD8" stroke="#E070BE" stroke-width="2"/>
      </g>`,
  },
  {
    id: 'flower',
    name: 'Flower',
    slot: 'head',
    emoji: '🌼',
    render: ({ x, y }: AnchorPoint) => `
      <g transform="translate(${x - 44} ${y + 6})">
        ${[0, 72, 144, 216, 288]
          .map(
            (a) =>
              `<ellipse cx="0" cy="-13" rx="8" ry="13" fill="#FFB4E4" transform="rotate(${a})"/>`,
          )
          .join('')}
        <circle cx="0" cy="0" r="8" fill="#FFE667"/>
      </g>`,
  },
  {
    id: 'stickers',
    name: 'Stickers',
    slot: 'sticker',
    emoji: '🌟',
    render: ({ x, y }: AnchorPoint) => `
      <g>
        <path d="M${x} ${y - 10} l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 Z" fill="#FFE667" stroke="#E8C15A" stroke-width="1.5"/>
        <path d="M${x - 34} ${y + 22} a6 6 0 1 1 0.1 0 Z" fill="#FF63C4"/>
        <path d="M${x + 30} ${y + 16} q6 -8 12 0 q6 8 -6 14 q-12 -6 -6 -14 Z" fill="#72E6A6"/>
      </g>`,
  },
];

export const ACCESSORY_MAP: Record<string, Accessory> = Object.fromEntries(
  ACCESSORIES.map((a) => [a.id, a]),
);
