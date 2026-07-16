import { buildSquishy } from './buildSquishy';
import type { EditorState } from '../state/editorState';

/** Rasterise an SVG string into an HTMLImageElement. */
function svgToImage(svg: string, w: number, h: number): Promise<HTMLImageElement> {
  const withSize = svg.replace(
    '<svg ',
    `<svg width="${w}" height="${h}" `,
  );
  const blob = new Blob([withSize], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Compose the full shareable card and return a PNG blob. */
export async function renderCard(state: EditorState): Promise<Blob> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background gradient (sky)
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#8FD3F7');
  g.addColorStop(1, '#45AEEF');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Soft pink cloud blobs
  ctx.fillStyle = 'rgba(249, 181, 222, 0.55)';
  for (const [cx, cy, r] of [
    [180, 300, 150],
    [920, 380, 130],
    [160, 1050, 140],
    [940, 1080, 160],
  ]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Card
  ctx.save();
  ctx.shadowColor = 'rgba(31,40,80,0.22)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 24;
  ctx.fillStyle = '#FFFDF8';
  roundRect(ctx, 90, 150, W - 180, H - 300, 70);
  ctx.fill();
  ctx.restore();

  // Squishy
  const svg = buildSquishy(state, { idPrefix: 'export', shadow: true });
  const img = await svgToImage(svg, 640, 640);
  ctx.drawImage(img, (W - 640) / 2, 250, 640, 640);

  // Wait for web fonts before drawing text.
  try {
    await (document as any).fonts?.ready;
  } catch {
    /* ignore */
  }

  ctx.textAlign = 'center';

  // Name pill
  const name = (state.name || 'My Squishy').slice(0, 22);
  ctx.font = '700 68px Fredoka, Nunito, sans-serif';
  const nameW = ctx.measureText(name).width;
  const pillW = Math.min(nameW + 120, W - 260);
  ctx.fillStyle = '#FFE667';
  roundRect(ctx, (W - pillW) / 2, 920, pillW, 110, 55);
  ctx.fill();
  ctx.fillStyle = '#1F2850';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, W / 2, 978, W - 300);

  // Gift message
  if (state.giftMessage) {
    ctx.font = '600 34px Nunito, sans-serif';
    ctx.fillStyle = '#667097';
    const msg =
      state.giftMessage.length > 70
        ? state.giftMessage.slice(0, 70) + '…'
        : state.giftMessage;
    ctx.fillText(msg, W / 2, 1075, W - 260);
  }

  // Branding
  ctx.font = '700 40px Fredoka, Nunito, sans-serif';
  ctx.fillStyle = '#45AEEF';
  ctx.fillText('✦ Squishy Studio ✦', W / 2, 1180);

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
      'image/png',
    ),
  );
}

export async function downloadCard(state: EditorState) {
  const blob = await renderCard(state);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safe = (state.name || 'squishy').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  a.download = `${safe || 'squishy'}-squishy-studio.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
