import type { Accessory, AnchorPoint } from './types';
import { starPath } from '../lib/faceParts';

/* Accessories drawn on the 0..300 canvas. Every piece is rendered with
   gradients, shading and speculars so it reads as a dimensional object,
   not flat clipart. `uid` namespaces inline gradient ids per squishy.
   `aura` slot items render BEHIND the body (capes, wings, magic effects). */

const grad = (
  id: string,
  from: string,
  to: string,
  vertical = true,
): string =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">` +
  `<stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient>`;

const spec = (cx: number, cy: number, rx: number, ry: number, op = 0.65, rot = -24) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${op}" transform="rotate(${rot} ${cx} ${cy})"/>`;

export const ACCESSORIES: Accessory[] = [
  /* ================= WEARABLES ================= */
  {
    id: 'bow',
    name: 'Bow',
    slot: 'head',
    emoji: '🎀',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y - 4})">
        <defs>${grad(`${uid}-bwg`, '#FFA9E2', '#E863BC')}</defs>
        <path d="M-4 0 C-30 -22 -47 -10 -45 7 C-43 23 -24 25 -2 8 Z" fill="url(#${uid}-bwg)" stroke="#C74BA0" stroke-width="2"/>
        <path d="M4 0 C30 -22 47 -10 45 7 C43 23 24 25 2 8 Z" fill="url(#${uid}-bwg)" stroke="#C74BA0" stroke-width="2"/>
        <path d="M-8 2 C-22 -10 -32 -8 -36 2" stroke="#C74BA0" stroke-width="2.5" fill="none" opacity="0.55" stroke-linecap="round"/>
        <path d="M8 2 C22 -10 32 -8 36 2" stroke="#C74BA0" stroke-width="2.5" fill="none" opacity="0.55" stroke-linecap="round"/>
        <circle cx="0" cy="3" r="10" fill="url(#${uid}-bwg)" stroke="#C74BA0" stroke-width="2"/>
        ${spec(-3, -1, 3.4, 2.2, 0.75)}
        ${spec(-30, -6, 5, 3, 0.5)}
        ${spec(30, -6, 5, 3, 0.5)}
      </g>`,
  },
  {
    id: 'crown',
    name: 'Crown',
    slot: 'head',
    emoji: '👑',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y})">
        <defs>${grad(`${uid}-crg`, '#FFF0A0', '#E0A63C')}</defs>
        <path d="M-34 12 L-34 -14 L-17 2 L0 -22 L17 2 L34 -14 L34 12 Z"
          fill="url(#${uid}-crg)" stroke="#C88A2B" stroke-width="2.5" stroke-linejoin="round"/>
        <rect x="-34" y="10" width="68" height="8" rx="4" fill="#E0A63C" stroke="#C88A2B" stroke-width="1.5"/>
        <circle cx="-34" cy="-14" r="5.5" fill="#FF63C4"/><circle cx="-35.5" cy="-15.5" r="1.8" fill="#fff" opacity="0.9"/>
        <circle cx="0" cy="-22" r="5.5" fill="#45AEEF"/><circle cx="-1.5" cy="-23.5" r="1.8" fill="#fff" opacity="0.9"/>
        <circle cx="34" cy="-14" r="5.5" fill="#72E6A6"/><circle cx="32.5" cy="-15.5" r="1.8" fill="#fff" opacity="0.9"/>
        ${spec(-14, 2, 5, 8, 0.45)}
      </g>`,
  },
  {
    id: 'glasses',
    name: 'Glasses',
    slot: 'face',
    emoji: '👓',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y - 6})">
        <defs>${grad(`${uid}-glg`, 'rgba(255,255,255,0.65)', 'rgba(255,255,255,0.08)')}</defs>
        <circle cx="-27" cy="0" r="20" fill="url(#${uid}-glg)" stroke="#1F2850" stroke-width="5"/>
        <circle cx="27" cy="0" r="20" fill="url(#${uid}-glg)" stroke="#1F2850" stroke-width="5"/>
        <path d="M-7 0 q7 -9 14 0" stroke="#1F2850" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M-47 -4 l-13 -6 M47 -4 l13 -6" stroke="#1F2850" stroke-width="5" stroke-linecap="round"/>
        <path d="M-36 -8 l10 -6 M18 -8 l10 -6" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
      </g>`,
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    slot: 'face',
    emoji: '🕶️',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y - 7})">
        <defs>${grad(`${uid}-sgg`, '#4A55A0', '#20264C')}</defs>
        <path d="M-49 -8 h98 l-3 8 h-8 c0 14 -9 21 -20 21 c-11 0 -18 -8 -18 -18 h-2 c0 10 -7 18 -18 18 c-11 0 -20 -7 -20 -21 h-6 Z"
          fill="url(#${uid}-sgg)" stroke="#141838" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M-40 -2 l14 -4 M8 -2 l14 -4" stroke="#9fb0ff" stroke-width="4" stroke-linecap="round" opacity="0.65"/>
        <path d="M-30 8 l10 8 M18 8 l10 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.35"/>
      </g>`,
  },
  {
    id: 'hat',
    name: 'Party Hat',
    slot: 'head',
    emoji: '🎉',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y - 2})">
        <defs>${grad(`${uid}-phg`, '#FFA06B', '#E8683F')}</defs>
        <path d="M0 -48 L23 14 L-23 14 Z" fill="url(#${uid}-phg)" stroke="#C9532F" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M-17 2 h34 M-13 -12 h26 M-8 -27 h16" stroke="#FFFDF8" stroke-width="4.5" stroke-linecap="round" opacity="0.9"/>
        ${spec(-8, -14, 3, 14, 0.4, -8)}
        <circle cx="0" cy="-52" r="7.5" fill="#72E6A6" stroke="#3FBF63" stroke-width="2"/>
        <circle cx="-2.5" cy="-54.5" r="2.4" fill="#fff" opacity="0.9"/>
      </g>`,
  },
  {
    id: 'beanie',
    name: 'Beanie',
    slot: 'head',
    emoji: '🧢',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y + 2})">
        <defs>${grad(`${uid}-bng`, '#6EC0F5', '#3E8ED6')}</defs>
        <path d="M-42 8 C-42 -30 42 -30 42 8 Z" fill="url(#${uid}-bng)" stroke="#2E6FB0" stroke-width="2.5"/>
        <rect x="-44" y="4" width="88" height="13" rx="6.5" fill="#8FD0F8" stroke="#2E6FB0" stroke-width="2"/>
        <path d="M-32 6 v9 M-16 5 v11 M0 4 v12 M16 5 v11 M32 6 v9" stroke="#5AA6DE" stroke-width="3" stroke-linecap="round"/>
        <circle cx="0" cy="-26" r="8.5" fill="#FFFDF8" stroke="#D9E4F2" stroke-width="2"/>
        <circle cx="-3" cy="-28.5" r="2.6" fill="#fff"/>
        ${spec(-16, -10, 6, 10, 0.4)}
      </g>`,
  },
  {
    id: 'headphones',
    name: 'Headphones',
    slot: 'head',
    emoji: '🎧',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y + 4})">
        <defs>${grad(`${uid}-hpg`, '#4A55A0', '#252B58')}</defs>
        <path d="M-52 26 C-52 -38 52 -38 52 26" fill="none" stroke="#252B58" stroke-width="10" stroke-linecap="round"/>
        <path d="M-48 22 C-48 -32 48 -32 48 22" fill="none" stroke="#5A67B8" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <ellipse cx="-53" cy="34" rx="13" ry="17" fill="url(#${uid}-hpg)" stroke="#141838" stroke-width="2.5"/>
        <ellipse cx="53" cy="34" rx="13" ry="17" fill="url(#${uid}-hpg)" stroke="#141838" stroke-width="2.5"/>
        <ellipse cx="-56" cy="34" rx="5" ry="9" fill="#F48BD8" opacity="0.9"/>
        <ellipse cx="56" cy="34" rx="5" ry="9" fill="#F48BD8" opacity="0.9"/>
        ${spec(-56, 25, 3.4, 5, 0.6)}
        ${spec(50, 25, 3.4, 5, 0.6)}
      </g>`,
  },
  {
    id: 'horns',
    name: 'Horns',
    slot: 'head',
    emoji: '😈',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y})">
        <defs>${grad(`${uid}-hng`, '#CBB6FB', '#8F62E8')}</defs>
        <path d="M-26 8 C-41 -15 -30 -24 -13 -18 C-17 -6 -18 2 -26 8 Z" fill="url(#${uid}-hng)" stroke="#7A4ED0" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M26 8 C41 -15 30 -24 13 -18 C17 -6 18 2 26 8 Z" fill="url(#${uid}-hng)" stroke="#7A4ED0" stroke-width="2.5" stroke-linejoin="round"/>
        ${spec(-26, -10, 2.6, 5, 0.6, -30)}
        ${spec(22, -12, 2.6, 5, 0.6, 30)}
      </g>`,
  },
  {
    id: 'collar',
    name: 'Collar',
    slot: 'neck',
    emoji: '🐕',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y - 8})">
        <defs>${grad(`${uid}-clg`, '#8AEDB8', '#4FCB82')}</defs>
        <path d="M-58 0 q58 32 116 0 l-2 12 q-56 28 -112 0 Z" fill="url(#${uid}-clg)" stroke="#38A968" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="0" cy="24" r="10" fill="#FFE667" stroke="#D9AE3E" stroke-width="2.5"/>
        <circle cx="-3" cy="21" r="2.8" fill="#fff" opacity="0.9"/>
        ${spec(-34, 8, 8, 3, 0.45, -8)}
      </g>`,
  },
  {
    id: 'necklace',
    name: 'Necklace',
    slot: 'neck',
    emoji: '📿',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y - 12})">
        <defs>${grad(`${uid}-nkg`, '#FF9FDF', '#E0489A')}</defs>
        <path d="M-46 0 q46 38 92 0" fill="none" stroke="#E0A63C" stroke-width="4"/>
        <path d="M-46 0 q46 38 92 0" fill="none" stroke="#FFF0A0" stroke-width="1.6" stroke-dasharray="1 6" stroke-linecap="round"/>
        <path d="M0 40 C-11 31 -8 20 0 26 C8 20 11 31 0 40 Z" fill="url(#${uid}-nkg)" stroke="#C23A82" stroke-width="2"/>
        <circle cx="-3" cy="26.5" r="2" fill="#fff" opacity="0.9"/>
      </g>`,
  },
  {
    id: 'scarf',
    name: 'Scarf',
    slot: 'neck',
    emoji: '🧣',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x} ${y - 10})">
        <defs>${grad(`${uid}-scg`, '#FF8A80', '#E04848')}</defs>
        <path d="M-52 -2 q52 26 104 0 l-3 16 q-49 22 -98 0 Z" fill="url(#${uid}-scg)" stroke="#C23636" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M22 12 l6 34 q1 7 9 6 l10 -2 q7 -2 5 -9 l-8 -31" fill="url(#${uid}-scg)" stroke="#C23636" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M30 46 l16 -4 M28 38 l16 -4" stroke="#FFD9D4" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <path d="M-40 4 q40 20 80 0" stroke="#FFD9D4" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
      </g>`,
  },
  {
    id: 'flower',
    name: 'Flower',
    slot: 'head',
    emoji: '🌼',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g transform="translate(${x - 44} ${y + 6})">
        <defs>${grad(`${uid}-flg`, '#FFC9EC', '#F48BD8')}</defs>
        ${[0, 72, 144, 216, 288]
          .map(
            (a) =>
              `<ellipse cx="0" cy="-14" rx="8.5" ry="14" fill="url(#${uid}-flg)" stroke="#D96CBB" stroke-width="1.5" transform="rotate(${a})"/>`,
          )
          .join('')}
        <circle cx="0" cy="0" r="8.5" fill="#FFE667" stroke="#D9AE3E" stroke-width="2"/>
        <circle cx="-2.5" cy="-2.5" r="2.4" fill="#fff" opacity="0.9"/>
      </g>`,
  },
  {
    id: 'stickers',
    name: 'Stickers',
    slot: 'sticker',
    emoji: '⭐',
    render: ({ x, y }: AnchorPoint, uid: string) => `
      <g>
        <path d="${starPath(x, y, 11, 4.6)}" fill="#FFE667" stroke="#D9AE3E" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="${x - 3}" cy="${y - 3}" r="2" fill="#fff" opacity="0.9"/>
        <path d="M${x - 34} ${y + 24} C${x - 43} ${y + 17} ${x - 40} ${y + 8} ${x - 34} ${y + 13} C${x - 28} ${y + 8} ${x - 25} ${y + 17} ${x - 34} ${y + 24} Z" fill="#FF63C4" stroke="#D6459F" stroke-width="1.6"/>
        <circle cx="${x + 32}" cy="${y + 18}" r="7" fill="#72E6A6" stroke="#3FBF63" stroke-width="1.8"/>
        <circle cx="${x + 29.5}" cy="${y + 15.5}" r="2" fill="#fff" opacity="0.9"/>
      </g>`,
  },

  /* ============ BEHIND-THE-BODY (auras & capes) ============ */
  {
    id: 'wings',
    name: 'Wings',
    slot: 'aura',
    emoji: '🪽',
    render: (_: AnchorPoint, uid: string) => `
      <g>
        <defs>${grad(`${uid}-wgg`, '#FFFFFF', '#AEDCF8')}</defs>
        <path d="M70 148 C0 96 -8 186 34 200 C2 220 42 260 84 218 Z"
          fill="url(#${uid}-wgg)" stroke="#8FC6EC" stroke-width="3" stroke-linejoin="round"/>
        <path d="M230 148 C300 96 308 186 266 200 C298 220 258 260 216 218 Z"
          fill="url(#${uid}-wgg)" stroke="#8FC6EC" stroke-width="3" stroke-linejoin="round"/>
        <path d="M56 150 C24 136 20 172 44 182 M244 150 C276 136 280 172 256 182"
          stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>
      </g>`,
  },
  {
    id: 'cape',
    name: 'Hero Cape',
    slot: 'aura',
    emoji: '🦸',
    render: (_: AnchorPoint, uid: string) => `
      <g>
        <defs>${grad(`${uid}-cpg`, '#FF7B6B', '#D63A3A')}</defs>
        <path d="M100 116 C40 158 30 238 58 254 C90 264 210 264 242 254 C270 238 260 158 200 116 C182 132 118 132 100 116 Z"
          fill="url(#${uid}-cpg)" stroke="#B32B2B" stroke-width="3" stroke-linejoin="round"/>
        <path d="M84 170 C70 196 68 228 74 244 M216 170 C230 196 232 228 226 244"
          stroke="#B32B2B" stroke-width="3" fill="none" opacity="0.55" stroke-linecap="round"/>
        <path d="M112 128 C96 148 88 176 86 196" stroke="#FFB0A6" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>
      </g>`,
  },
  {
    id: 'fx-sparkle',
    name: 'Sparkle Aura',
    slot: 'aura',
    emoji: '✨',
    render: (_: AnchorPoint) => `
      <g>
        ${[
          [52, 96, 10, 0.9, '#FFFDF8'], [244, 74, 13, 0.95, '#FFE667'],
          [262, 176, 8, 0.7, '#FFFDF8'], [38, 190, 11, 0.8, '#FFE667'],
          [88, 44, 7, 0.65, '#FFFDF8'], [216, 240, 9, 0.75, '#FFFDF8'],
          [270, 120, 6, 0.55, '#FFE667'], [30, 132, 6, 0.6, '#FFFDF8'],
        ]
          .map(
            ([x, y, r, o, c]) =>
              `<path d="${starPath(Number(x), Number(y), Number(r), Number(r) * 0.36, 4)}" fill="${c}" opacity="${o}"/>`,
          )
          .join('')}
      </g>`,
  },
  {
    id: 'fx-hearts',
    name: 'Floating Hearts',
    slot: 'aura',
    emoji: '💞',
    render: (_: AnchorPoint) => `
      <g>
        ${[
          [50, 110, 1.15, 0.9], [252, 88, 1.5, 0.95], [268, 190, 0.9, 0.7],
          [40, 200, 1.2, 0.8], [96, 52, 0.8, 0.65], [226, 246, 1, 0.75],
        ]
          .map(([x, y, s, o]) => {
            const X = Number(x), Y = Number(y), S = Number(s);
            return `<path d="M${X} ${Y + 9 * S} C${X - 12 * S} ${Y} ${X - 9 * S} ${Y - 11 * S} ${X} ${Y - 4 * S} C${X + 9 * S} ${Y - 11 * S} ${X + 12 * S} ${Y} ${X} ${Y + 9 * S} Z" fill="#FF8FCB" stroke="#E86AAE" stroke-width="1.4" opacity="${o}"/>`;
          })
          .join('')}
      </g>`,
  },
  {
    id: 'fx-stars',
    name: 'Star Orbit',
    slot: 'aura',
    emoji: '🌟',
    render: (_: AnchorPoint) => `
      <g>
        <ellipse cx="150" cy="170" rx="128" ry="46" fill="none" stroke="#FFE667" stroke-width="2.5" stroke-dasharray="2 10" stroke-linecap="round" opacity="0.75"/>
        ${[
          [26, 164, 11], [274, 164, 11], [86, 206, 8], [214, 130, 8], [150, 216, 7],
        ]
          .map(
            ([x, y, r]) =>
              `<path d="${starPath(Number(x), Number(y), Number(r), Number(r) * 0.44)}" fill="#FFC93B" stroke="#E8A426" stroke-width="1.5" stroke-linejoin="round"/>`,
          )
          .join('')}
      </g>`,
  },
  {
    id: 'fx-rainbow',
    name: 'Rainbow Arc',
    slot: 'aura',
    emoji: '🌈',
    render: (_: AnchorPoint) => `
      <g stroke-linecap="round" fill="none" opacity="0.9">
        ${['#FF6B8B', '#FFB25C', '#FFE667', '#72E6A6', '#8FB8FF']
          .map(
            (c, i) =>
              `<path d="M ${150 - (134 - i * 7)} 178 A ${134 - i * 7} ${134 - i * 7} 0 0 1 ${150 + (134 - i * 7)} 178" stroke="${c}" stroke-width="7.5"/>`,
          )
          .join('')}
      </g>`,
  },
];

export const ACCESSORY_MAP: Record<string, Accessory> = Object.fromEntries(
  ACCESSORIES.map((a) => [a.id, a]),
);
