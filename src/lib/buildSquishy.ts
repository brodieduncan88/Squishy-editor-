import {
  SHAPE_MAP,
  COLOUR_MAP,
  GRADIENT_MAP,
  SKIN_MAP,
  ACCESSORY_MAP,
} from '../data';
import type { EditorState } from '../state/editorState';
import { shade } from './colour';
import { renderFace } from './faceParts';

export interface BuildOpts {
  idPrefix?: string;
  /** Draw the soft ground shadow (off for chips). */
  shadow?: boolean;
}

/* ---------- deterministic randomness for glitter ----------
   Seeded so a given (shape + colour + skin) always renders the same speckle
   field — stable across re-renders, varied across squishies. */
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* A field of suspended glitter flecks + a few 4-point sparkles, clipped to the
   body. Colours are a mix of white, a lightened body tint and iridescent
   accents — the hallmark of glitter-resin toys. */
function glitterField(seed: number, base: string): string {
  const rnd = mulberry32(seed);
  const tint = shade(base, 0.62);
  const accents = ['#ffffff', tint, '#FFE9A8', '#BFD1FF', '#FFC4F0', '#B9F3DE'];
  const flecks: string[] = [];
  const COUNT = 46;
  for (let i = 0; i < COUNT; i++) {
    // sample within the body's rough disc (clip trims the rest)
    const ang = rnd() * Math.PI * 2;
    const rad = Math.sqrt(rnd()) * 96;
    const x = 150 + Math.cos(ang) * rad;
    const y = 158 + Math.sin(ang) * rad * 0.96;
    const r = 0.7 + rnd() * 2.1;
    const c = accents[Math.floor(rnd() * accents.length)];
    const op = (0.35 + rnd() * 0.6).toFixed(2);
    if (rnd() > 0.82) {
      // a bright 4-point sparkle
      const s = r + 2.4;
      flecks.push(
        `<path d="M${x} ${y - s} L${x + s * 0.28} ${y - s * 0.28} L${x + s} ${y} L${x + s * 0.28} ${y + s * 0.28} L${x} ${y + s} L${x - s * 0.28} ${y + s * 0.28} L${x - s} ${y} L${x - s * 0.28} ${y - s * 0.28} Z" fill="#ffffff" opacity="${op}"/>`,
      );
    } else {
      flecks.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${c}" opacity="${op}"/>`);
    }
  }
  return flecks.join('');
}

/* A few translucent air bubbles suspended in the gel. */
function bubbleField(seed: number): string {
  const rnd = mulberry32(seed ^ 0x9e3779b9);
  const out: string[] = [];
  const spots: [number, number, number][] = [
    [118, 120, 13],
    [190, 150, 9],
    [140, 200, 11],
    [205, 205, 7],
  ];
  for (const [x, y, r] of spots) {
    const jitter = (rnd() - 0.5) * 10;
    out.push(
      `<g>` +
        `<circle cx="${x + jitter}" cy="${y}" r="${r}" fill="#ffffff" opacity="0.10"/>` +
        `<circle cx="${x + jitter}" cy="${y}" r="${r}" fill="none" stroke="#ffffff" stroke-width="1.4" opacity="0.5"/>` +
        `<circle cx="${x + jitter - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.28}" fill="#ffffff" opacity="0.85"/>` +
      `</g>`,
    );
  }
  return out.join('');
}

/* ---------- pattern + texture defs ---------- */

function patternDefs(id: string, state: EditorState): string {
  const base = COLOUR_MAP[state.primaryColour]?.hex ?? '#F9B5DE';
  const dark = shade(base, -0.32);
  const light = shade(base, 0.55);
  const second = COLOUR_MAP[state.secondaryColour]?.hex ?? '#FFFDF8';
  const skin = SKIN_MAP[state.skin];

  const defs: string[] = [];

  // Animal + motif patterns (drawn as an overlay, clipped to the body).
  const patterns: Record<string, string> = {
    tiger: `<pattern id="${id}-p" width="52" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(6)">
        <path d="M14 0 q6 20 -2 40 q-4 12 4 20" stroke="${dark}" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M40 -6 q6 22 -2 44" stroke="${dark}" stroke-width="7" fill="none" stroke-linecap="round"/>
      </pattern>`,
    zebra: `<pattern id="${id}-p" width="46" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)">
        <path d="M10 -4 q-10 30 4 64" stroke="${dark}" stroke-width="10" fill="none"/>
        <path d="M34 -4 q-10 30 4 64" stroke="${dark}" stroke-width="6" fill="none"/>
      </pattern>`,
    leopard: `<pattern id="${id}-p" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M12 12 q10 -6 16 2 q4 10 -6 12 q-14 0 -10 -14 Z" fill="none" stroke="${dark}" stroke-width="5"/>
        <circle cx="18" cy="18" r="3" fill="${dark}"/>
        <path d="M36 34 q8 -4 12 2 q2 8 -6 8 q-10 0 -6 -10 Z" fill="none" stroke="${dark}" stroke-width="4"/>
      </pattern>`,
    cow: `<pattern id="${id}-p" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M12 10 q26 -6 30 14 q4 20 -20 18 q-24 -2 -18 -22 Z" fill="${dark}"/>
        <path d="M54 46 q18 -4 20 12 q0 14 -16 12 q-14 -2 -12 -16 Z" fill="${dark}"/>
      </pattern>`,
    stars: `<pattern id="${id}-p" width="46" height="46" patternUnits="userSpaceOnUse">
        <path d="M23 8 l4 9 l10 1 l-7 7 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -7 l10 -1 Z" fill="${second}"/>
      </pattern>`,
    hearts: `<pattern id="${id}-p" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 30 C6 20 8 8 16 8 q4 0 4 5 q0 -5 4 -5 c8 0 10 12 -4 22 Z" fill="${second}"/>
      </pattern>`,
    clouds: `<pattern id="${id}-p" width="72" height="56" patternUnits="userSpaceOnUse">
        <g fill="${light}">
          <circle cx="20" cy="30" r="10"/><circle cx="32" cy="26" r="13"/><circle cx="44" cy="30" r="10"/>
          <rect x="20" y="30" width="24" height="10" rx="5"/>
        </g>
      </pattern>`,
  };
  if (skin?.kind === 'pattern' && patterns[state.skin]) defs.push(patterns[state.skin]);

  // Texture gradients that replace the body fill.
  defs.push(`<radialGradient id="${id}-gloss" cx="38%" cy="30%" r="72%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="34%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>`);

  // User gradient
  if (state.gradient && GRADIENT_MAP[state.gradient]) {
    const g = GRADIENT_MAP[state.gradient];
    defs.push(`<linearGradient id="${id}-usergrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${g.from}"/><stop offset="100%" stop-color="${g.to}"/>
      </linearGradient>`);
  }

  // Metallic sheen for metallic solid colours
  defs.push(`<linearGradient id="${id}-metal" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${shade(base, 0.5)}"/>
      <stop offset="45%" stop-color="${base}"/>
      <stop offset="100%" stop-color="${shade(base, -0.28)}"/>
    </linearGradient>`);

  // Texture overlays
  defs.push(`<radialGradient id="${id}-galaxy" cx="42%" cy="34%" r="80%">
      <stop offset="0%" stop-color="#6a4fd0"/><stop offset="55%" stop-color="#3b2a86"/><stop offset="100%" stop-color="#191343"/>
    </radialGradient>`);
  defs.push(`<linearGradient id="${id}-gold" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#FFF1B8"/><stop offset="40%" stop-color="#F2CE63"/>
      <stop offset="70%" stop-color="#D9A93B"/><stop offset="100%" stop-color="#B9862A"/>
    </linearGradient>`);
  defs.push(`<linearGradient id="${id}-silver" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="45%" stop-color="#D3DBE6"/>
      <stop offset="100%" stop-color="#98A6BA"/>
    </linearGradient>`);
  defs.push(`<linearGradient id="${id}-holo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFC4F0"/><stop offset="30%" stop-color="#B9C7FF"/>
      <stop offset="60%" stop-color="#A9F4E4"/><stop offset="100%" stop-color="#FFE9A8"/>
    </linearGradient>`);
  defs.push(`<linearGradient id="${id}-rainbow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FF6B8B"/><stop offset="25%" stop-color="#FFB25C"/>
      <stop offset="50%" stop-color="#FFE667"/><stop offset="72%" stop-color="#72E6A6"/>
      <stop offset="100%" stop-color="#8FB8FF"/>
    </linearGradient>`);

  // Translucent gel body shaded as a sphere: bright lit core (upper-left)
  // falling to a much darker, richer edge — this is what reads as 3D volume.
  const gelCore = shade(base, 0.6);
  const gelEdge = shade(base, -0.34);
  defs.push(`<radialGradient id="${id}-jelly" cx="39%" cy="30%" r="82%">
      <stop offset="0%" stop-color="${gelCore}" stop-opacity="0.95"/>
      <stop offset="34%" stop-color="${base}" stop-opacity="0.92"/>
      <stop offset="74%" stop-color="${base}" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="${gelEdge}" stop-opacity="1"/>
    </radialGradient>`);
  // Inner gel glow near the top-left — the deep, lit-from-within highlight.
  defs.push(`<radialGradient id="${id}-core" cx="40%" cy="27%" r="52%">
      <stop offset="0%" stop-color="${shade(base, 0.82)}" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="${base}" stop-opacity="0"/>
    </radialGradient>`);
  // Directional core / form shadow — a crescent on the lower-right where the
  // body turns away from the light. The single strongest cue for roundness.
  defs.push(`<radialGradient id="${id}-cshadow" cx="76%" cy="80%" r="70%">
      <stop offset="0%" stop-color="${shade(base, -0.55)}" stop-opacity="0.5"/>
      <stop offset="42%" stop-color="${shade(base, -0.42)}" stop-opacity="0.28"/>
      <stop offset="72%" stop-color="${shade(base, -0.4)}" stop-opacity="0"/>
    </radialGradient>`);
  // Bounce / reflected light hugging the very bottom edge.
  defs.push(`<radialGradient id="${id}-bounce" cx="50%" cy="94%" r="46%">
      <stop offset="0%" stop-color="${shade(base, 0.5)}" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="${base}" stop-opacity="0"/>
    </radialGradient>`);

  // Ambient occlusion — grounds the base with soft shading toward the bottom.
  defs.push(`<linearGradient id="${id}-ao" x1="0" y1="0" x2="0" y2="1">
      <stop offset="52%" stop-color="#1F2850" stop-opacity="0"/>
      <stop offset="100%" stop-color="#141a38" stop-opacity="0.14"/>
    </linearGradient>`);
  // Rim light — a bright sliver along the very top edge.
  defs.push(`<linearGradient id="${id}-rim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="12%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>`);
  // Soft contact shadow on the ground.
  defs.push(`<radialGradient id="${id}-contact" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1F2850" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#1F2850" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#1F2850" stop-opacity="0"/>
    </radialGradient>`);

  return `<defs>${defs.join('')}</defs>`;
}

/** Metals read as reflective chrome, not glitter-gel — they skip the jelly look. */
function isMetallicLook(state: EditorState): boolean {
  const skin = SKIN_MAP[state.skin];
  return (
    !!COLOUR_MAP[state.primaryColour]?.metallic ||
    skin?.overlay === 'gold' ||
    skin?.overlay === 'silver'
  );
}

/** Decide the main body fill for the given state. */
function bodyFill(id: string, state: EditorState): string {
  const skin = SKIN_MAP[state.skin];
  if (skin?.overlay && skin.overlay !== 'glitter') return `url(#${id}-${skin.overlay})`;
  if (state.gradient) return `url(#${id}-usergrad)`;
  if (COLOUR_MAP[state.primaryColour]?.metallic) return `url(#${id}-metal)`;
  // Default body is now translucent gel rather than a flat fill.
  return `url(#${id}-jelly)`;
}

/* small deterministic sparkles for glitter/galaxy (no RNG at render time) */
const SPARKLES = [
  [96, 108], [150, 92], [206, 120], [120, 160], [186, 176],
  [150, 150], [110, 200], [196, 206], [150, 210], [86, 150], [214, 158],
];

function sparkleLayer(colour: string, r = 2.6): string {
  return SPARKLES.map(
    ([x, y], i) =>
      `<circle cx="${x}" cy="${y}" r="${r - (i % 3) * 0.6}" fill="${colour}" opacity="${0.5 + (i % 3) * 0.2}"/>`,
  ).join('');
}

/* ---------- main build ---------- */

export function buildSquishy(state: EditorState, opts: BuildOpts = {}): string {
  const id = opts.idPrefix ?? 'sq';
  const shape = SHAPE_MAP[state.squishyType] ?? SHAPE_MAP.bear;
  const base = COLOUR_MAP[state.primaryColour]?.hex ?? '#F9B5DE';
  const skin = SKIN_MAP[state.skin];
  const fill = bodyFill(id, state);
  const glassy = !isMetallicLook(state);
  // Softer, tinted edge for gel; a crisper edge for metals.
  const stroke = shade(base, glassy ? -0.14 : -0.22);
  const strokeOp = glassy ? 0.5 : 1;

  const behind = (shape.behind ?? [])
    .map(
      (d) =>
        `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-opacity="${strokeOp}" stroke-width="3"/>`,
    )
    .join('');

  // Body (evenodd supports the donut hole).
  const body = `<path d="${shape.body}" fill="${fill}" fill-rule="evenodd" stroke="${stroke}" stroke-opacity="${strokeOp}" stroke-width="3.5"/>`;

  // Pattern / texture overlay clipped to the body silhouette.
  let overlay = '';
  const clipId = `${id}-clip`;
  const clip = `<clipPath id="${clipId}"><path d="${shape.body}" clip-rule="evenodd"/>${(shape.behind ?? [])
    .map((d) => `<path d="${d}"/>`)
    .join('')}</clipPath>`;

  if (skin?.kind === 'pattern') {
    overlay = `<g clip-path="url(#${clipId})"><rect x="0" y="0" width="300" height="300" fill="url(#${id}-p)"/></g>`;
  } else if (skin?.overlay === 'glitter') {
    overlay = `<g clip-path="url(#${clipId})">${sparkleLayer('#ffffff', 3)}${sparkleLayer('#FFE667', 2)}</g>`;
  } else if (skin?.overlay === 'galaxy') {
    overlay = `<g clip-path="url(#${clipId})">${sparkleLayer('#ffffff', 2.4)}</g>`;
  }

  // Tone details (muzzles, bellies) blend under the gel; solid coloured
  // features (beaks, horns, cherries) render on top so they stay vivid.
  const toneDetails = (shape.details ?? [])
    .filter((d) => !d.fill)
    .map((d) => {
      const c = d.tone === 'dark' ? shade(base, -0.34) : shade(base, 0.5);
      return `<path d="${d.path}" fill="${c}" opacity="0.9"/>`;
    })
    .join('');
  const featureDetails = (shape.details ?? [])
    .filter((d) => d.fill)
    .map(
      (d) =>
        `<path d="${d.path}" fill="${d.fill}" stroke="${shade(d.fill!, -0.18)}" stroke-width="1.5" stroke-linejoin="round"/>`,
    )
    .join('');

  // Glitter-resin finish: inner gel glow, suspended glitter + air bubbles.
  // Metals stay clean/reflective and skip it.
  const seed = hashSeed(state.squishyType + state.primaryColour + state.skin);
  const resin = glassy
    ? `<g clip-path="url(#${clipId})">` +
        `<rect x="0" y="0" width="300" height="300" fill="url(#${id}-core)"/>` +
        glitterField(seed, base) +
        bubbleField(seed) +
      `</g>`
    : '';

  // Face
  const f = shape.face;
  const faceInner = renderFace(state.eyes, state.mouth, state.cheeks);
  const face = `<g transform="translate(${f.x} ${f.y}) scale(${f.scale})">${faceInner}</g>`;

  // Accessories (wings first so they can sit behind the silhouette edge).
  const accSorted = [...state.accessories].sort((a) =>
    ACCESSORY_MAP[a]?.slot === 'back' ? -1 : 1,
  );
  const accessories = accSorted
    .map((aid) => {
      const a = ACCESSORY_MAP[aid];
      if (!a) return '';
      const anchor = shape.anchors[a.slot] ?? { x: 150, y: 150 };
      return a.render(anchor);
    })
    .join('');

  // Volume shading, all clipped to the silhouette.
  const formShade = glassy
    ? `<g clip-path="url(#${clipId})">` +
        `<rect x="0" y="0" width="300" height="300" fill="url(#${id}-cshadow)"/>` +
        `<rect x="0" y="0" width="300" height="300" fill="url(#${id}-bounce)"/>` +
      `</g>`
    : '';
  const ao = `<g clip-path="url(#${clipId})"><rect x="0" y="0" width="300" height="300" fill="url(#${id}-ao)"/></g>`;
  const rim = `<g clip-path="url(#${clipId})"><rect x="0" y="0" width="300" height="300" fill="url(#${id}-rim)"/></g>`;
  const gloss =
    `<g clip-path="url(#${clipId})">` +
    `<rect x="0" y="0" width="300" height="300" fill="url(#${id}-gloss)"/>` +
    // big soft wet highlight + a crescent reflection
    `<ellipse cx="112" cy="104" rx="30" ry="40" fill="#ffffff" opacity="0.55" transform="rotate(-24 112 104)"/>` +
    `<path d="M78 128 Q92 82 150 74" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.5"/>` +
    // small sharp speculars
    `<circle cx="180" cy="120" r="6" fill="#ffffff" opacity="0.7"/>` +
    `<circle cx="120" cy="98" r="10" fill="#ffffff" opacity="0.85"/>` +
    `</g>`;
  // A faint glassy edge that catches the light all the way round.
  const glassEdge = glassy
    ? `<path d="${shape.body}" fill="none" fill-rule="evenodd" stroke="#ffffff" stroke-width="2" opacity="0.35"/>`
    : '';

  const shadow = opts.shadow
    ? `<ellipse cx="150" cy="268" rx="98" ry="24" fill="url(#${id}-contact)" class="sq-shadow"/>`
    : '';

  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img">
    ${patternDefs(id, state)}
    ${clip}
    ${shadow}
    ${behind}
    ${body}
    ${overlay}
    ${toneDetails}
    ${resin}
    ${formShade}
    ${ao}
    ${rim}
    ${gloss}
    ${glassEdge}
    ${featureDetails}
    ${face}
    ${accessories}
  </svg>`;
}
