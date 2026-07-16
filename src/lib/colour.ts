/* Small hex colour helpers used to build sheens, shadows and highlights. */

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('');
}

/** amount -1..1 (negative darkens, positive lightens toward white/black). */
export function shade(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  if (amount >= 0) {
    return rgbToHex(
      r + (255 - r) * amount,
      g + (255 - g) * amount,
      b + (255 - b) * amount,
    );
  }
  const a = 1 + amount;
  return rgbToHex(r * a, g * a, b * a);
}

/** Pick readable ink (navy vs white) for a background colour. */
export function readableInk(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? '#1F2850' : '#FFFDF8';
}
