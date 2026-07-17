/* Face part renderers — kawaii proportions: big glossy eyes with dual
   catchlights, soft gradient blush. Drawn around (0,0); the compositor
   translates + scales the whole face group onto the shape's face anchor. */

const INK = '#1F2850';
const EX = 27; // eye horizontal offset

/** n-point star path (also used for star eyes / sparkle catchlights). */
export function starPath(
  cx: number,
  cy: number,
  R: number,
  r: number,
  points = 5,
): string {
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (Math.PI / points) * i - Math.PI / 2;
    d +=
      (i === 0 ? 'M' : 'L') +
      (cx + Math.cos(a) * rad).toFixed(1) +
      ' ' +
      (cy + Math.sin(a) * rad).toFixed(1) +
      ' ';
  }
  return d + 'Z';
}

/** Standard glossy pupil: big ink circle + two catchlights + glass arc. */
function glossyEye(cx: number, r = 11): string {
  return (
    `<circle cx="${cx}" cy="0" r="${r}" fill="${INK}"/>` +
    `<circle cx="${cx - r * 0.32}" cy="${-r * 0.34}" r="${r * 0.34}" fill="#fff"/>` +
    `<circle cx="${cx + r * 0.36}" cy="${r * 0.3}" r="${r * 0.17}" fill="#fff" opacity="0.9"/>` +
    `<path d="M${cx - r * 0.45} ${r * 0.55} q${r * 0.45} ${r * 0.32} ${r * 0.9} 0" stroke="#fff" stroke-width="1.6" fill="none" opacity="0.35" stroke-linecap="round"/>`
  );
}

function eye(cx: number, kind: string): string {
  switch (kind) {
    case 'closed':
      return `<path d="M${cx - 10} 0 q10 11 20 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    case 'uwu':
      return `<path d="M${cx - 10} 3 q10 -12 20 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    case 'wink':
      return cx < 0
        ? glossyEye(cx)
        : `<path d="M${cx - 10} 0 q10 11 20 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    case 'sparkle':
      return (
        `<circle cx="${cx}" cy="0" r="12" fill="${INK}"/>` +
        `<path d="${starPath(cx - 2, -2, 5.6, 2.2, 4)}" fill="#fff"/>` +
        `<circle cx="${cx + 5}" cy="4" r="2" fill="#fff" opacity="0.9"/>`
      );
    case 'heart':
      return (
        `<path d="M${cx} 8 C ${cx - 14} -2 ${cx - 10} -15 ${cx} -6 C ${cx + 10} -15 ${cx + 14} -2 ${cx} 8 Z" fill="#FF5C8A" stroke="#E8447A" stroke-width="1.5"/>` +
        `<circle cx="${cx - 4}" cy="-6" r="2.4" fill="#fff" opacity="0.9"/>`
      );
    case 'star':
      return (
        `<path d="${starPath(cx, -1, 12, 5.2)}" fill="#FFC93B" stroke="#E8A426" stroke-width="1.5" stroke-linejoin="round"/>` +
        `<circle cx="${cx - 3.5}" cy="-5.5" r="2" fill="#fff" opacity="0.95"/>`
      );
    case 'cool':
      return `<path d="M${cx - 10} 0 h20" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/>`;
    case 'angry':
      return (
        `<path d="M${cx - 11} -11 L${cx + 8} -5" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>` +
        `<circle cx="${cx}" cy="3" r="9" fill="${INK}"/>` +
        `<circle cx="${cx - 3}" cy="0" r="2.8" fill="#fff"/>`
      );
    case 'wide':
      return (
        `<circle cx="${cx}" cy="0" r="12.5" fill="#fff" stroke="${INK}" stroke-width="4"/>` +
        `<circle cx="${cx}" cy="1.5" r="6" fill="${INK}"/>` +
        `<circle cx="${cx - 2}" cy="-1" r="2" fill="#fff"/>`
      );
    case 'shy':
      return `<path d="M${cx - 9} 2 q9 -8 18 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    case 'sly':
      return (
        `<path d="M${cx - 11} -2 q11 -7 22 0 q-4 9 -11 9 q-7 0 -11 -9 Z" fill="${INK}"/>` +
        `<circle cx="${cx + 3}" cy="0" r="3" fill="#fff"/>`
      );
    case 'round':
    default:
      return glossyEye(cx);
  }
}

function mouth(kind: string): string {
  const y = 27;
  switch (kind) {
    case 'small':
      return `<path d="M-7 ${y} q7 7 14 0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    case 'tongue':
      return (
        `<path d="M-15 ${y} q15 15 30 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
        `<path d="M-2 ${y + 6} q7 11 14 0 Z" fill="#FF63C4"/>`
      );
    case 'open':
      return (
        `<path d="M-14 ${y - 2} q14 24 28 0 q-14 -9 -28 0 Z" fill="${INK}"/>` +
        `<path d="M-9 ${y + 6} q9 12 18 0 q-9 -6 -18 0 Z" fill="#FF63C4"/>` +
        `<path d="M-10 ${y} q10 -5 20 0" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.9"/>`
      );
    case 'frown':
      return `<path d="M-13 ${y + 8} q13 -14 26 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    case 'o':
      return (
        `<ellipse cx="0" cy="${y + 2}" rx="8.5" ry="10.5" fill="${INK}"/>` +
        `<ellipse cx="-2.5" cy="${y - 1}" rx="2.4" ry="2.8" fill="#fff" opacity="0.85"/>`
      );
    case 'smirk':
      return `<path d="M-12 ${y} q11 11 24 2" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    case 'cat':
      return `<path d="M-13 ${y} q6.5 9 13 0 q6.5 9 13 0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    case 'wavy':
      return `<path d="M-14 ${y + 1} q4.6 -6 9.3 0 q4.6 6 9.3 0 q4.6 -6 9.4 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    case 'smile':
    default:
      return `<path d="M-15 ${y} q15 15 30 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  }
}

export function renderFace(
  eyes: string,
  mth: string,
  cheeks: boolean,
  uid: string,
): string {
  const cheekMarkup = cheeks
    ? `<radialGradient id="${uid}-bl" cx="50%" cy="50%" r="50%">
         <stop offset="0%" stop-color="#FF7DB8" stop-opacity="0.75"/>
         <stop offset="100%" stop-color="#FF7DB8" stop-opacity="0"/>
       </radialGradient>
       <ellipse cx="-38" cy="15" rx="13.5" ry="9" fill="url(#${uid}-bl)"/>
       <ellipse cx="38" cy="15" rx="13.5" ry="9" fill="url(#${uid}-bl)"/>`
    : '';
  return `${cheekMarkup}<g class="sq-eyes">${eye(-EX, eyes)}${eye(EX, eyes)}</g>${mouth(mth)}`;
}
