import { DEFAULT_STATE, type EditorState } from '../state/editorState';

/* Encode the editor state into a private, unguessable, self-contained link.
   No server needed for the MVP: the creation travels inside the URL. */

function toBase64Url(str: string): string {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64: string): string {
  const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
  const norm = b64.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return decodeURIComponent(escape(atob(norm)));
}

// Short key map keeps the encoded URL compact.
// Append-only — new keys go at the end so existing share links keep decoding.
const KEYS: (keyof EditorState)[] = [
  'squishyType', 'primaryColour', 'secondaryColour', 'gradient', 'skin',
  'face', 'eyes', 'mouth', 'cheeks', 'accessories', 'name', 'personality',
  'box', 'wrapping', 'ribbon', 'recipient', 'giftMessage', 'finish', 'sender',
];

export function encodeState(state: EditorState): string {
  const arr = KEYS.map((k) => state[k]);
  return toBase64Url(JSON.stringify(arr));
}

export function decodeState(token: string): EditorState | null {
  try {
    const arr = JSON.parse(fromBase64Url(token)) as unknown[];
    const out: Record<string, unknown> = { ...DEFAULT_STATE };
    KEYS.forEach((k, i) => {
      if (arr[i] !== undefined) out[k] = arr[i];
    });
    return out as unknown as EditorState;
  } catch {
    return null;
  }
}

export function shareUrl(state: EditorState): string {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://squishy.studio';
  // A random tag makes the link feel private / unguessable in the address bar.
  const tag = Math.floor(Math.random() * 1e6).toString(36);
  return `${origin}/s/${encodeState(state)}~${tag}`;
}

/** Friendly message that travels with the link. */
export function shareText(state: EditorState): string {
  const from = state.sender?.trim();
  const named = state.name ? ` called ${state.name}` : '';
  const who = from ? `${from} made you` : 'You have';
  return `🎁 ${who} a squishy gift${named} on Squishy Studio! Tap to open it:`;
}

export interface ShareChannel {
  id: string;
  label: string;
  /** builds the deep link/href for this channel */
  href: (text: string, url: string) => string;
  external?: boolean;
}

/* Channels that hand off to the device's own apps — no backend needed.
   The user picks the contact and hits send. */
export const SHARE_CHANNELS: ShareChannel[] = [
  {
    id: 'sms',
    label: 'Message',
    href: (t, u) => `sms:?&body=${encodeURIComponent(`${t} ${u}`)}`,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    external: true,
    href: (t, u) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
  },
  {
    id: 'email',
    label: 'Email',
    href: (t, u) =>
      `mailto:?subject=${encodeURIComponent('A squishy gift for you! 🎁')}&body=${encodeURIComponent(`${t}\n\n${u}`)}`,
  },
];

/** Native share sheet (mobile). Returns true if it was shown. */
export async function nativeShare(state: EditorState, url: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) return false;
  try {
    await navigator.share({
      title: 'A squishy gift for you! 🎁',
      text: shareText(state),
      url,
    });
    return true;
  } catch {
    return false; // user cancelled or unsupported
  }
}
