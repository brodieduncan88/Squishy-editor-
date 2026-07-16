/* Face part renderers. Drawn around (0,0); the compositor translates + scales
   the whole face group onto the shape's face anchor. Navy ink throughout. */

const INK = '#1F2850';
const EX = 26; // eye horizontal offset

function eye(cx: number, kind: string): string {
  switch (kind) {
    case 'closed':
      return `<path d="M${cx - 9} 0 q9 9 18 0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    case 'wink':
      return cx < 0
        ? `<circle cx="${cx}" cy="0" r="8.5" fill="${INK}"/><circle cx="${cx + 3}" cy="-3" r="2.6" fill="#fff"/>`
        : `<path d="M${cx - 9} 0 q9 9 18 0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    case 'sparkle':
      return `<circle cx="${cx}" cy="0" r="10" fill="${INK}"/><circle cx="${cx - 3}" cy="-4" r="3.4" fill="#fff"/><circle cx="${cx + 4}" cy="3" r="1.8" fill="#fff"/>`;
    case 'angry':
      return `<path d="M${cx - 10} -9 L${cx + 8} -3" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="3" r="7.5" fill="${INK}"/>`;
    case 'wide':
      return `<circle cx="${cx}" cy="0" r="12" fill="#fff" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="1" r="5.5" fill="${INK}"/>`;
    case 'shy':
      return `<path d="M${cx - 9} 2 q9 -7 18 0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    case 'sly':
      return `<path d="M${cx - 10} -2 q10 -6 20 0 q-4 8 -10 8 q-6 0 -10 -8 Z" fill="${INK}"/><circle cx="${cx + 2}" cy="0" r="3" fill="#fff"/>`;
    case 'round':
    default:
      return `<circle cx="${cx}" cy="0" r="9" fill="${INK}"/><circle cx="${cx - 3}" cy="-3" r="2.8" fill="#fff"/>`;
  }
}

function mouth(kind: string): string {
  const y = 26;
  switch (kind) {
    case 'small':
      return `<path d="M-6 ${y} q6 6 12 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    case 'tongue':
      return `<path d="M-14 ${y} q14 14 28 0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/><path d="M-2 ${y + 6} q6 10 12 0 Z" fill="#FF63C4"/>`;
    case 'open':
      return `<path d="M-13 ${y - 2} q13 22 26 0 q-13 -8 -26 0 Z" fill="${INK}"/><path d="M-7 ${y + 8} q7 8 14 0 Z" fill="#FF63C4"/>`;
    case 'frown':
      return `<path d="M-12 ${y + 8} q12 -14 24 0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    case 'o':
      return `<ellipse cx="0" cy="${y + 2}" rx="8" ry="10" fill="${INK}"/>`;
    case 'smirk':
      return `<path d="M-12 ${y} q10 10 22 2" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
    case 'smile':
    default:
      return `<path d="M-14 ${y} q14 14 28 0" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  }
}

export function renderFace(eyes: string, mth: string, cheeks: boolean): string {
  const cheekMarkup = cheeks
    ? `<ellipse cx="-34" cy="16" rx="10" ry="7" fill="#FF8FCB" opacity="0.55"/>
       <ellipse cx="34" cy="16" rx="10" ry="7" fill="#FF8FCB" opacity="0.55"/>`
    : '';
  return `${cheekMarkup}${eye(-EX, eyes)}${eye(EX, eyes)}${mouth(mth)}`;
}
