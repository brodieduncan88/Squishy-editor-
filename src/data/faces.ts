import type { Face } from './types';

/* 8 faces. eyes + mouth ids are consumed by the face renderer (SquishyFace). */
export const FACES: Face[] = [
  { id: 'happy', name: 'Happy', eyes: 'round', mouth: 'smile', cheeks: true, emoji: '😊' },
  { id: 'sleepy', name: 'Sleepy', eyes: 'closed', mouth: 'small', cheeks: true, emoji: '😴' },
  { id: 'silly', name: 'Silly', eyes: 'wink', mouth: 'tongue', cheeks: true, emoji: '😜' },
  { id: 'excited', name: 'Excited', eyes: 'sparkle', mouth: 'open', cheeks: true, emoji: '🤩' },
  { id: 'grumpy', name: 'Grumpy', eyes: 'angry', mouth: 'frown', cheeks: false, emoji: '😤' },
  { id: 'surprised', name: 'Surprised', eyes: 'wide', mouth: 'o', cheeks: false, emoji: '😮' },
  { id: 'shy', name: 'Shy', eyes: 'shy', mouth: 'small', cheeks: true, emoji: '☺️' },
  { id: 'mischief', name: 'Mischievous', eyes: 'sly', mouth: 'smirk', cheeks: true, emoji: '😏' },
  { id: 'lovestruck', name: 'In Love', eyes: 'heart', mouth: 'open', cheeks: true, emoji: '😍' },
  { id: 'starstruck', name: 'Starstruck', eyes: 'star', mouth: 'open', cheeks: true, emoji: '🤩' },
  { id: 'cool', name: 'Cool', eyes: 'cool', mouth: 'smirk', cheeks: false, emoji: '😎' },
  { id: 'kitty', name: 'Kitty', eyes: 'round', mouth: 'cat', cheeks: true, emoji: '😺' },
  { id: 'dreamy', name: 'Dreamy', eyes: 'uwu', mouth: 'small', cheeks: true, emoji: '😌' },
  { id: 'nervous', name: 'Nervous', eyes: 'wide', mouth: 'wavy', cheeks: true, emoji: '😅' },
];

export const FACE_MAP: Record<string, Face> = Object.fromEntries(
  FACES.map((f) => [f.id, f]),
);
