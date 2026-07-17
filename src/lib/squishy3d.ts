/* ============================================================
   Procedural 3D squishy → glTF, for <model-viewer>.

   The kid's 2D design is turned into a real 3D model in the
   browser: the character silhouette is lathed into a body of
   revolution, ears/beaks/horns are added as ellipsoid parts,
   and the colour + pattern + glitter + face are baked into an
   equirectangular texture. Output is a blob URL of a .gltf.
   ============================================================ */

import { COLOUR_MAP, GRADIENT_MAP, SKIN_MAP, SHAPE_MAP } from '../data';
import type { EditorState } from '../state/editorState';
import { shade } from './colour';
import { renderFace } from './faceParts';

/* ---------- mesh containers ---------- */
interface Mesh {
  pos: number[];
  nrm: number[];
  uv: number[];
  idx: number[];
}
const newMesh = (): Mesh => ({ pos: [], nrm: [], uv: [], idx: [] });

function mergeInto(dst: Mesh, src: Mesh) {
  const off = dst.pos.length / 3;
  dst.pos.push(...src.pos);
  dst.nrm.push(...src.nrm);
  dst.uv.push(...src.uv);
  for (const i of src.idx) dst.idx.push(i + off);
}

/* 2D canvas coords (300-space, y down) → world (metres-ish, y up). */
const S = 1 / 100;
const wx = (x2: number) => (x2 - 150) * S;
const wy = (y2: number) => (270 - y2) * S;

/* ---------- gourd body: smooth union of head circle + body ellipse ---------- */
interface Gourd { hy: number; hr: number; by: number; brx: number; bry: number }

const GOURDS: Record<string, Gourd> = {
  bear: { hy: 108, hr: 57, by: 198, brx: 82, bry: 66 },
  cat: { hy: 110, hr: 54, by: 200, brx: 76, bry: 62 },
  dog: { hy: 110, hr: 55, by: 200, brx: 80, bry: 64 },
  duck: { hy: 100, hr: 50, by: 202, brx: 78, bry: 70 },
  axolotl: { hy: 112, hr: 56, by: 200, brx: 80, bry: 62 },
  unicorn: { hy: 112, hr: 54, by: 200, brx: 78, bry: 64 },
  icecream: { hy: 96, hr: 62, by: 198, brx: 66, bry: 64 },
  frog: { hy: 128, hr: 48, by: 198, brx: 94, bry: 58 },
  blob: { hy: 112, hr: 60, by: 196, brx: 86, bry: 60 },
};

function gourdRadius(g: Gourd, y: number): number {
  const h2 = g.hr * g.hr - (y - g.hy) * (y - g.hy);
  const r1 = h2 > 0 ? Math.sqrt(h2) : 0;
  const e = 1 - ((y - g.by) / g.bry) ** 2;
  const r2 = e > 0 ? g.brx * Math.sqrt(e) : 0;
  const p = 6; // smooth union
  return (r1 ** p + r2 ** p) ** (1 / p);
}

/** Lathe the gourd profile around the Y axis. */
function latheGourd(g: Gourd, rows = 56, cols = 56): Mesh {
  const m = newMesh();
  const yTop = g.hy - g.hr + 0.5;
  const yBot = g.by + g.bry - 0.5;
  const eps = 0.5;
  for (let i = 0; i <= rows; i++) {
    const t = i / rows;
    const y2 = yTop + (yBot - yTop) * t;
    const r2 = Math.max(gourdRadius(g, y2), 0.001);
    // slope for normals (numeric)
    const rA = gourdRadius(g, y2 - eps);
    const rB = gourdRadius(g, y2 + eps);
    const dr = (rB - rA) / (2 * eps); // d(r)/d(y2, downward)
    for (let j = 0; j <= cols; j++) {
      const u = j / cols;
      const phi = (u - 0.5) * Math.PI * 2;
      const sx = Math.sin(phi);
      const cz = Math.cos(phi);
      m.pos.push(r2 * S * sx, wy(y2), r2 * S * cz);
      // world y is flipped vs y2, so slope flips sign
      const ny = dr;
      const nr = 1;
      const len = Math.hypot(nr, ny) || 1;
      m.nrm.push((nr / len) * sx, ny / len, (nr / len) * cz);
      m.uv.push(u, t);
    }
    if (i > 0) {
      for (let j = 0; j < cols; j++) {
        const a = (i - 1) * (cols + 1) + j;
        const b = i * (cols + 1) + j;
        m.idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  return m;
}

/** Ellipsoid part; UVs squashed into a face-free band of the texture. */
function ellipsoid(
  cx2: number, cy2: number, cz2: number,
  rx2: number, ry2: number, rz2: number,
  rows = 14, cols = 18,
): Mesh {
  const m = newMesh();
  for (let i = 0; i <= rows; i++) {
    const v = i / rows;
    const th = v * Math.PI;
    for (let j = 0; j <= cols; j++) {
      const u = j / cols;
      const ph = u * Math.PI * 2;
      const lx = Math.sin(th) * Math.sin(ph);
      const ly = Math.cos(th);
      const lz = Math.sin(th) * Math.cos(ph);
      m.pos.push(wx(cx2) + lx * rx2 * S, wy(cy2) + ly * ry2 * S, cz2 * S + lz * rz2 * S);
      const nx = lx / (rx2 * S), nyy = ly / (ry2 * S), nz = lz / (rz2 * S);
      const l = Math.hypot(nx, nyy, nz) || 1;
      m.nrm.push(nx / l, nyy / l, nz / l);
      m.uv.push(u, 0.56 + v * 0.18);
    }
    if (i > 0) {
      for (let j = 0; j < cols; j++) {
        const a = (i - 1) * (cols + 1) + j;
        const b = i * (cols + 1) + j;
        m.idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  return m;
}

/** Torus for the donut — ring in the XY plane so the hole faces the camera. */
function torus(R2 = 63, r2 = 30, rows = 40, cols = 56): Mesh {
  const m = newMesh();
  const cy = wy(152);
  for (let i = 0; i <= rows; i++) {
    const v = i / rows;
    const ph = v * Math.PI * 2; // around the tube
    for (let j = 0; j <= cols; j++) {
      const u = j / cols;
      const th = u * Math.PI * 2 - Math.PI / 2; // around the ring (u=0.5 → top)
      const ring = (R2 + r2 * Math.cos(ph)) * S;
      m.pos.push(ring * Math.cos(th), cy + ring * Math.sin(th), r2 * S * Math.sin(ph));
      m.nrm.push(Math.cos(ph) * Math.cos(th), Math.cos(ph) * Math.sin(th), Math.sin(ph));
      m.uv.push(u, v);
    }
    if (i > 0) {
      for (let j = 0; j < cols; j++) {
        const a = (i - 1) * (cols + 1) + j;
        const b = i * (cols + 1) + j;
        m.idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  return m;
}

/* ---------- per-shape 3D parts ---------- */
interface Part {
  x: number; y: number; z: number;
  rx: number; ry: number; rz: number;
  colour?: string; // feature colour → separate solid material
}
const PARTS: Record<string, Part[]> = {
  bear: [
    { x: 104, y: 64, z: 0, rx: 26, ry: 26, rz: 20 },
    { x: 196, y: 64, z: 0, rx: 26, ry: 26, rz: 20 },
    { x: 120, y: 250, z: 30, rx: 20, ry: 12, rz: 16 },
    { x: 180, y: 250, z: 30, rx: 20, ry: 12, rz: 16 },
  ],
  cat: [
    { x: 110, y: 62, z: 0, rx: 15, ry: 26, rz: 9 },
    { x: 190, y: 62, z: 0, rx: 15, ry: 26, rz: 9 },
    { x: 122, y: 252, z: 26, rx: 18, ry: 11, rz: 14 },
    { x: 178, y: 252, z: 26, rx: 18, ry: 11, rz: 14 },
  ],
  dog: [
    { x: 96, y: 126, z: 0, rx: 20, ry: 40, rz: 12 },
    { x: 204, y: 126, z: 0, rx: 20, ry: 40, rz: 12 },
    { x: 122, y: 254, z: 28, rx: 19, ry: 11, rz: 15 },
    { x: 178, y: 254, z: 28, rx: 19, ry: 11, rz: 15 },
  ],
  duck: [
    { x: 150, y: 118, z: 46, rx: 26, ry: 12, rz: 16, colour: '#FFAE4D' },
    { x: 128, y: 260, z: 22, rx: 20, ry: 8, rz: 24, colour: '#FFAE4D' },
    { x: 172, y: 260, z: 22, rx: 20, ry: 8, rz: 24, colour: '#FFAE4D' },
  ],
  axolotl: [
    { x: 84, y: 88, z: 0, rx: 14, ry: 14, rz: 9 },
    { x: 70, y: 114, z: 0, rx: 14, ry: 14, rz: 9 },
    { x: 82, y: 142, z: 0, rx: 14, ry: 14, rz: 9 },
    { x: 216, y: 88, z: 0, rx: 14, ry: 14, rz: 9 },
    { x: 230, y: 114, z: 0, rx: 14, ry: 14, rz: 9 },
    { x: 218, y: 142, z: 0, rx: 14, ry: 14, rz: 9 },
    { x: 122, y: 252, z: 26, rx: 18, ry: 11, rz: 14 },
    { x: 178, y: 252, z: 26, rx: 18, ry: 11, rz: 14 },
  ],
  unicorn: [
    { x: 150, y: 52, z: 4, rx: 10, ry: 34, rz: 10, colour: '#FFE08A' },
    { x: 118, y: 76, z: 0, rx: 13, ry: 21, rz: 9 },
    { x: 182, y: 76, z: 0, rx: 13, ry: 21, rz: 9 },
    { x: 122, y: 254, z: 26, rx: 18, ry: 11, rz: 14 },
    { x: 178, y: 254, z: 26, rx: 18, ry: 11, rz: 14 },
  ],
  icecream: [{ x: 150, y: 44, z: 6, rx: 12, ry: 12, rz: 12, colour: '#FF5C6E' }],
  frog: [
    { x: 118, y: 94, z: 8, rx: 22, ry: 22, rz: 18 },
    { x: 182, y: 94, z: 8, rx: 22, ry: 22, rz: 18 },
    { x: 116, y: 250, z: 30, rx: 24, ry: 11, rz: 16 },
    { x: 184, y: 250, z: 30, rx: 24, ry: 11, rz: 16 },
  ],
  blob: [],
  donut: [],
};

/* ---------- texture bake ---------- */
function hexToRgba(hex: string, a = 1): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function bakeTexture(state: EditorState, faceV = 0.3): Promise<HTMLCanvasElement> {
  const W = 1024;
  const H = 512;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  const base = COLOUR_MAP[state.primaryColour]?.hex ?? '#F9B5DE';
  const skin = SKIN_MAP[state.skin];
  const jelly = state.finish === 'jelly';

  // base vertical shading (subtle — real lighting comes from the renderer)
  const g = ctx.createLinearGradient(0, 0, 0, H);
  if (state.gradient && GRADIENT_MAP[state.gradient]) {
    const ug = GRADIENT_MAP[state.gradient];
    g.addColorStop(0, ug.from);
    g.addColorStop(1, ug.to);
  } else if (skin?.overlay === 'rainbow') {
    ['#FF6B8B', '#FFB25C', '#FFE667', '#72E6A6', '#8FB8FF'].forEach((col, i, arr) =>
      g.addColorStop(i / (arr.length - 1), col),
    );
  } else if (skin?.overlay === 'galaxy') {
    g.addColorStop(0, '#5a44b8');
    g.addColorStop(0.6, '#33276e');
    g.addColorStop(1, '#1b1546');
  } else if (skin?.overlay === 'gold') {
    g.addColorStop(0, '#FFF0A0'); g.addColorStop(1, '#C89232');
  } else if (skin?.overlay === 'silver') {
    g.addColorStop(0, '#F2F6FB'); g.addColorStop(1, '#9AA8BC');
  } else if (skin?.overlay === 'holo') {
    ['#FFC4F0', '#B9C7FF', '#A9F4E4', '#FFE9A8'].forEach((col, i, arr) =>
      g.addColorStop(i / (arr.length - 1), col),
    );
  } else {
    g.addColorStop(0, shade(base, jelly ? 0.45 : 0.3));
    g.addColorStop(0.4, base);
    g.addColorStop(1, shade(base, -0.22));
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // patterns
  const dark = hexToRgba(shade(base, -0.4), 0.55);
  const light = hexToRgba(shade(base, 0.72), 0.85);
  ctx.save();
  if (state.skin === 'tiger' || state.skin === 'zebra') {
    ctx.fillStyle = dark;
    const n = state.skin === 'tiger' ? 14 : 16;
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * (W / n) + (i % 2) * 8;
      ctx.beginPath();
      ctx.moveTo(x - 3, 40);
      ctx.quadraticCurveTo(x + 16, H * 0.5, x - 4, H - 60);
      ctx.quadraticCurveTo(x - 14, H * 0.5, x - 3, 40);
      ctx.fill();
    }
  } else if (state.skin === 'leopard' || state.skin === 'cow') {
    ctx.fillStyle = dark;
    const spots = state.skin === 'leopard' ? 60 : 16;
    const rr = state.skin === 'leopard' ? 9 : 34;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < spots; i++) {
      const x = rnd() * W;
      const y = 30 + rnd() * (H - 90);
      ctx.beginPath();
      ctx.ellipse(x, y, rr * (0.7 + rnd() * 0.6), rr * (0.55 + rnd() * 0.5), rnd() * 3, 0, 7);
      ctx.fill();
    }
  } else if (state.skin === 'stars' || state.skin === 'hearts' || state.skin === 'clouds') {
    ctx.fillStyle = light;
    let seed = 12;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 26; i++) {
      const x = rnd() * W;
      const y = 24 + rnd() * (H - 80);
      const s = 10 + rnd() * 12;
      ctx.save();
      ctx.translate(x, y);
      if (state.skin === 'stars') {
        ctx.beginPath();
        for (let k = 0; k < 10; k++) {
          const r = k % 2 === 0 ? s : s * 0.45;
          const a = (Math.PI / 5) * k - Math.PI / 2;
          ctx[k === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
      } else if (state.skin === 'hearts') {
        ctx.beginPath();
        ctx.moveTo(0, s * 0.9);
        ctx.bezierCurveTo(-s * 1.2, 0, -s * 0.9, -s, 0, -s * 0.35);
        ctx.bezierCurveTo(s * 0.9, -s, s * 1.2, 0, 0, s * 0.9);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(-s * 0.7, 0, s * 0.55, 0, 7);
        ctx.arc(0, -s * 0.3, s * 0.72, 0, 7);
        ctx.arc(s * 0.7, 0, s * 0.55, 0, 7);
        ctx.rect(-s * 0.7, 0, s * 1.4, s * 0.5);
        ctx.fill();
      }
      ctx.restore();
    }
  }
  // glitter specks for jelly / glitter / galaxy
  if (jelly || skin?.overlay === 'glitter' || skin?.overlay === 'galaxy') {
    let seed = 99;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 240; i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      const r = 0.6 + rnd() * 1.8;
      ctx.fillStyle = `rgba(255,255,255,${0.25 + rnd() * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 7);
      ctx.fill();
    }
  }
  ctx.restore();

  // face — rasterise the same face renderer used in 2D
  const faceSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -50 120 110" width="330" height="302">` +
    renderFace(state.eyes, state.mouth, state.cheeks, 'm3d') +
    `</svg>`;
  const blob = new Blob([faceSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      // face image is 302px tall with its visual centre ~151px in
      ctx.drawImage(img, W / 2 - 165, Math.max(-40, faceV * H - 151));
      resolve(c);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(c);
    };
    img.src = url;
  });
}

/* ---------- glTF assembly ---------- */
function b64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = '';
  const CH = 8192;
  for (let i = 0; i < bytes.length; i += CH) {
    s += String.fromCharCode(...bytes.subarray(i, i + CH));
  }
  return btoa(s);
}

function packMesh(m: Mesh) {
  const pos = new Float32Array(m.pos);
  const nrm = new Float32Array(m.nrm);
  const uv = new Float32Array(m.uv);
  const idx = new Uint32Array(m.idx);
  return { pos, nrm, uv, idx };
}

export async function buildSquishyModel(state: EditorState): Promise<string> {
  const shapeId = SHAPE_MAP[state.squishyType] ? state.squishyType : 'bear';

  // body
  const bodyMesh =
    shapeId === 'donut' ? torus() : latheGourd(GOURDS[shapeId] ?? GOURDS.bear);

  // parts
  const featureMesh = newMesh();
  const featureColours: string[] = [];
  for (const p of PARTS[shapeId] ?? []) {
    const e = ellipsoid(p.x, p.y, p.z, p.rx, p.ry, p.rz);
    if (p.colour) {
      featureColours.push(p.colour);
      mergeInto(featureMesh, e);
    } else {
      mergeInto(bodyMesh, e);
    }
  }

  // face height on the texture from the shape's 2D face anchor
  let faceV = 0.3;
  if (shapeId === 'donut') {
    faceV = 0.25; // front of the tube, top of the ring
  } else {
    const g = GOURDS[shapeId] ?? GOURDS.bear;
    const yTop = g.hy - g.hr + 0.5;
    const yBot = g.by + g.bry - 0.5;
    faceV = (SHAPE_MAP[shapeId].face.y - yTop) / (yBot - yTop);
  }

  const texture = await bakeTexture(state, faceV);
  const texUri = texture.toDataURL('image/png');

  const metallic =
    !!COLOUR_MAP[state.primaryColour]?.metallic ||
    SKIN_MAP[state.skin]?.overlay === 'gold' ||
    SKIN_MAP[state.skin]?.overlay === 'silver';
  const rough = state.finish === 'jelly' ? 0.12 : 0.32;

  const prims = [packMesh(bodyMesh)];
  if (featureMesh.idx.length) prims.push(packMesh(featureMesh));

  // one big binary buffer
  const chunks: ArrayBuffer[] = [];
  const views: { buffer: number; byteOffset: number; byteLength: number; target: number }[] = [];
  let offset = 0;
  const pushChunk = (arr: Float32Array | Uint32Array, target: number) => {
    const bytes = arr.byteLength;
    chunks.push(arr.buffer as ArrayBuffer);
    views.push({ buffer: 0, byteOffset: offset, byteLength: bytes, target });
    offset += bytes;
    return views.length - 1;
  };

  const accessors: object[] = [];
  const primitives: object[] = [];
  prims.forEach((p, pi) => {
    const posView = pushChunk(p.pos, 34962);
    const nrmView = pushChunk(p.nrm, 34962);
    const uvView = pushChunk(p.uv, 34962);
    const idxView = pushChunk(p.idx, 34963);
    // min/max for positions
    const mn = [Infinity, Infinity, Infinity];
    const mx = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < p.pos.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        mn[k] = Math.min(mn[k], p.pos[i + k]);
        mx[k] = Math.max(mx[k], p.pos[i + k]);
      }
    }
    const a0 = accessors.length;
    accessors.push(
      { bufferView: posView, componentType: 5126, count: p.pos.length / 3, type: 'VEC3', min: mn, max: mx },
      { bufferView: nrmView, componentType: 5126, count: p.nrm.length / 3, type: 'VEC3' },
      { bufferView: uvView, componentType: 5126, count: p.uv.length / 2, type: 'VEC2' },
      { bufferView: idxView, componentType: 5125, count: p.idx.length, type: 'SCALAR' },
    );
    primitives.push({
      attributes: { POSITION: a0, NORMAL: a0 + 1, TEXCOORD_0: a0 + 2 },
      indices: a0 + 3,
      material: pi,
    });
  });

  const bin = new Uint8Array(offset);
  let o = 0;
  for (const ch of chunks) {
    bin.set(new Uint8Array(ch), o);
    o += ch.byteLength;
  }

  const featColour = featureColours[0] ?? '#FFAE4D';
  const fc = COLOUR_MAP[featColour]?.hex ?? featColour;
  const fr = parseInt(fc.slice(1, 3), 16) / 255;
  const fg = parseInt(fc.slice(3, 5), 16) / 255;
  const fb = parseInt(fc.slice(5, 7), 16) / 255;

  const gltf = {
    asset: { version: '2.0', generator: 'squishy-studio' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{ primitives }],
    materials: [
      {
        pbrMetallicRoughness: {
          baseColorTexture: { index: 0 },
          metallicFactor: metallic ? 0.85 : 0,
          roughnessFactor: rough,
        },
      },
      {
        pbrMetallicRoughness: {
          baseColorFactor: [fr, fg, fb, 1],
          metallicFactor: 0,
          roughnessFactor: 0.3,
        },
      },
    ],
    textures: [{ source: 0, sampler: 0 }],
    samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 33071 }],
    images: [{ uri: texUri }],
    buffers: [{ uri: 'data:application/octet-stream;base64,' + b64(bin.buffer), byteLength: offset }],
    bufferViews: views,
    accessors,
  };

  const blob = new Blob([JSON.stringify(gltf)], { type: 'model/gltf+json' });
  return URL.createObjectURL(blob);
}
