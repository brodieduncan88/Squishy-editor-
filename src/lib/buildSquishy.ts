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

/* How each pattern blends into the gel + how strong it is. */
const PATTERN_CFG: Record<string, { blend: string; opacity: number }> = {
  tiger: { blend: 'multiply', opacity: 0.55 },
  zebra: { blend: 'multiply', opacity: 0.6 },
  leopard: { blend: 'multiply', opacity: 0.5 },
  cow: { blend: 'multiply', opacity: 0.55 },
  stars: { blend: 'screen', opacity: 0.75 },
  hearts: { blend: 'screen', opacity: 0.7 },
  clouds: { blend: 'screen', opacity: 0.62 },
};

/* ---------- pattern + texture defs ---------- */

function patternDefs(id: string, state: EditorState): string {
  const base = COLOUR_MAP[state.primaryColour]?.hex ?? '#F9B5DE';
  const dark = shade(base, -0.32);
  const light = shade(base, 0.55);
  const second = COLOUR_MAP[state.secondaryColour]?.hex ?? '#FFFDF8';
  const skin = SKIN_MAP[state.skin];

  const defs: string[] = [];

  // Animal + motif patterns. Colours chosen so blend modes make them read as
  // pigment IN the gel: dark markings multiply with the body's shading, light
  // motifs screen over it. Organic, tapered art — not hard tiled lines.
  const animalDark = shade(base, -0.36);
  const motifLight = shade(base, 0.72);
  const cloudLight = shade(base, 0.6);
  const patterns: Record<string, string> = {
    tiger: `<pattern id="${id}-p" width="46" height="72" patternUnits="userSpaceOnUse" patternTransform="rotate(4)">
        <path d="M13 -2 Q23 34 10 74 Q3 36 13 -2 Z" fill="${animalDark}"/>
        <path d="M34 -8 Q42 30 30 66 Q24 30 34 -8 Z" fill="${animalDark}"/>
      </pattern>`,
    zebra: `<pattern id="${id}-p" width="42" height="74" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
        <path d="M12 -4 Q24 36 8 78 Q0 36 12 -4 Z" fill="${animalDark}"/>
        <path d="M32 -4 Q41 36 27 78 Q20 36 32 -4 Z" fill="${animalDark}"/>
      </pattern>`,
    leopard: `<pattern id="${id}-p" width="56" height="56" patternUnits="userSpaceOnUse">
        <g fill="${animalDark}">
          <ellipse cx="17" cy="8" rx="4" ry="3"/><ellipse cx="26" cy="12" rx="4" ry="3"/>
          <ellipse cx="25" cy="23" rx="4" ry="3"/><ellipse cx="13" cy="22" rx="4" ry="3"/><ellipse cx="9" cy="13" rx="4" ry="3"/>
          <ellipse cx="45" cy="35" rx="4" ry="3"/><ellipse cx="52" cy="41" rx="4" ry="3"/>
          <ellipse cx="48" cy="50" rx="4" ry="3"/><ellipse cx="38" cy="46" rx="4" ry="3"/><ellipse cx="37" cy="37" rx="4" ry="3"/>
        </g>
      </pattern>`,
    cow: `<pattern id="${id}-p" width="96" height="96" patternUnits="userSpaceOnUse">
        <path d="M18 14 C46 2 58 24 49 42 C43 62 14 57 10 39 C7 25 8 20 18 14 Z" fill="${animalDark}"/>
        <path d="M62 56 C84 50 86 70 73 80 C59 90 47 78 51 64 C54 56 54 58 62 56 Z" fill="${animalDark}"/>
      </pattern>`,
    stars: `<pattern id="${id}-p" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M25 8 l4 10 l11 1 l-8 7 l3 11 l-10 -6 l-10 6 l3 -11 l-8 -7 l11 -1 Z" fill="${motifLight}"/>
      </pattern>`,
    hearts: `<pattern id="${id}-p" width="44" height="44" patternUnits="userSpaceOnUse">
        <path d="M22 32 C6 21 9 8 17 8 q5 0 5 6 q0 -6 5 -6 c8 0 11 13 -5 24 Z" fill="${motifLight}"/>
      </pattern>`,
    clouds: `<pattern id="${id}-p" width="78" height="60" patternUnits="userSpaceOnUse">
        <g fill="${cloudLight}">
          <circle cx="22" cy="32" r="11"/><circle cx="35" cy="27" r="14"/><circle cx="48" cy="32" r="11"/>
          <rect x="22" y="32" width="26" height="11" rx="5"/>
        </g>
      </pattern>`,
  };
  if (skin?.kind === 'pattern' && patterns[state.skin]) {
    defs.push(patterns[state.skin]);
    // Soft blur + an edge-fade mask so markings wrap the form and don't
    // hard-clip at the outline.
    defs.push(`<filter id="${id}-soft" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="1.15"/></filter>`);
    defs.push(`<radialGradient id="${id}-edgegrad" cx="50%" cy="46%" r="62%"><stop offset="0%" stop-color="#fff"/><stop offset="68%" stop-color="#fff"/><stop offset="100%" stop-color="#767676"/></radialGradient>`);
    defs.push(`<mask id="${id}-edgemask"><rect x="0" y="0" width="300" height="300" fill="url(#${id}-edgegrad)"/></mask>`);
  }

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
  // Opaque solid finish — spherical shading but fully opaque, colour-true, no
  // glitter. Keep the centre close to the real colour so it never washes out.
  defs.push(`<radialGradient id="${id}-solid" cx="39%" cy="31%" r="84%">
      <stop offset="0%" stop-color="${shade(base, 0.3)}"/>
      <stop offset="40%" stop-color="${base}"/>
      <stop offset="100%" stop-color="${shade(base, -0.36)}"/>
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
  // Solid finish is opaque; jelly finish is the translucent gel.
  return state.finish === 'solid' ? `url(#${id}-solid)` : `url(#${id}-jelly)`;
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
  const metallic = isMetallicLook(state);
  const jelly = state.finish === 'jelly' && !metallic; // translucent + glitter
  const shaded = !metallic; // solid and jelly both get 3D form shading
  // Softer translucent edge for gel; crisper edge for solid/metal.
  const stroke = shade(base, jelly ? -0.14 : -0.22);
  const strokeOp = jelly ? 0.5 : metallic ? 1 : 0.7;

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
    const cfg = PATTERN_CFG[state.skin] ?? { blend: 'multiply', opacity: 0.5 };
    overlay =
      `<g clip-path="url(#${clipId})" mask="url(#${id}-edgemask)">` +
      `<g filter="url(#${id}-soft)" opacity="${cfg.opacity}" style="mix-blend-mode:${cfg.blend}">` +
      `<rect x="0" y="0" width="300" height="300" fill="url(#${id}-p)"/>` +
      `</g></g>`;
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

  // The lit-from-within glow is a translucency cue — jelly only, or a solid
  // squishy washes out to pale and looks see-through. Glitter + bubbles too.
  const seed = hashSeed(state.squishyType + state.primaryColour + state.skin);
  const coreGlow = jelly
    ? `<g clip-path="url(#${clipId})"><rect x="0" y="0" width="300" height="300" fill="url(#${id}-core)"/></g>`
    : '';
  const resin = jelly
    ? `<g clip-path="url(#${clipId})">${glitterField(seed, base)}${bubbleField(seed)}</g>`
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
  const formShade = shaded
    ? `<g clip-path="url(#${clipId})">` +
        `<rect x="0" y="0" width="300" height="300" fill="url(#${id}-cshadow)"/>` +
        `<rect x="0" y="0" width="300" height="300" fill="url(#${id}-bounce)"/>` +
      `</g>`
    : '';
  const ao = `<g clip-path="url(#${clipId})"><rect x="0" y="0" width="300" height="300" fill="url(#${id}-ao)"/></g>`;
  const rim = `<g clip-path="url(#${clipId})"><rect x="0" y="0" width="300" height="300" fill="url(#${id}-rim)"/></g>`;
  // The big soft highlight + crescent are wet-resin cues (jelly only); solids
  // get a gentler sheen so the colour stays rich rather than washing out.
  const wet = jelly
    ? `<ellipse cx="112" cy="104" rx="30" ry="40" fill="#ffffff" opacity="0.55" transform="rotate(-24 112 104)"/>` +
      `<path d="M78 128 Q92 82 150 74" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.5"/>`
    : '';
  const gloss =
    `<g clip-path="url(#${clipId})" opacity="${jelly ? 1 : 0.6}">` +
    `<rect x="0" y="0" width="300" height="300" fill="url(#${id}-gloss)"/>` +
    wet +
    // small sharp speculars keep it shiny on both finishes
    `<circle cx="180" cy="120" r="6" fill="#ffffff" opacity="0.7"/>` +
    `<circle cx="120" cy="98" r="10" fill="#ffffff" opacity="0.85"/>` +
    `</g>`;
  // A faint glassy edge that catches the light all the way round (jelly only).
  const glassEdge = jelly
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
    ${coreGlow}
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
