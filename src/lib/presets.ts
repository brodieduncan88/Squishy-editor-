import { DEFAULT_STATE, type EditorState } from '../state/editorState';
import { FACE_MAP } from '../data';

/** Build a full EditorState from a partial, expanding the face into eyes/mouth/cheeks. */
export function preset(partial: Partial<EditorState>): EditorState {
  const s: EditorState = { ...DEFAULT_STATE, ...partial };
  if (partial.face) {
    const f = FACE_MAP[partial.face];
    if (f) {
      if (partial.eyes === undefined) s.eyes = f.eyes;
      if (partial.mouth === undefined) s.mouth = f.mouth;
      if (partial.cheeks === undefined) s.cheeks = f.cheeks;
    }
  }
  return s;
}

/* A few pre-made squishies used on the homepage. */
export const HERO_SQUISHIES: EditorState[] = [
  preset({ squishyType: 'bear', primaryColour: 'pastel-pink', skin: 'hearts', face: 'happy', accessories: ['bow'], name: 'Rosie' }),
  preset({ squishyType: 'axolotl', primaryColour: 'pastel-lav', skin: 'glitter', face: 'excited', accessories: ['crown'], name: 'Sparkle' }),
  preset({ squishyType: 'cat', primaryColour: 'pastel-lemon', skin: 'tiger', face: 'mischief', accessories: ['glasses'], name: 'Tiger' }),
  preset({ squishyType: 'unicorn', primaryColour: 'pastel-mint', skin: 'rainbow', face: 'silly', accessories: ['flower'], name: 'Dazzle' }),
  preset({ squishyType: 'icecream', primaryColour: 'pastel-sky', skin: 'stars', face: 'happy', accessories: ['stickers'], name: 'Scoop' }),
];

export const GALLERY_SQUISHIES: Record<string, EditorState[]> = {
  Animals: [
    preset({ squishyType: 'bear', primaryColour: 'pastel-peach', skin: 'solid', face: 'happy', accessories: ['bow'] }),
    preset({ squishyType: 'cat', primaryColour: 'pastel-lemon', skin: 'tiger', face: 'mischief' }),
    preset({ squishyType: 'dog', primaryColour: 'pastel-cream', skin: 'cow', face: 'excited', accessories: ['collar'] }),
    preset({ squishyType: 'duck', primaryColour: 'bright-yellow', skin: 'solid', face: 'silly', accessories: ['glasses'] }),
  ],
  Food: [
    preset({ squishyType: 'icecream', primaryColour: 'pastel-pink', skin: 'glitter', face: 'happy', accessories: ['stickers'] }),
    preset({ squishyType: 'donut', primaryColour: 'pastel-lav', skin: 'stars', face: 'excited' }),
    preset({ squishyType: 'icecream', primaryColour: 'pastel-mint', skin: 'hearts', face: 'shy' }),
    preset({ squishyType: 'donut', primaryColour: 'bright-orange', skin: 'solid', face: 'silly' }),
  ],
  Fantasy: [
    preset({ squishyType: 'unicorn', primaryColour: 'pastel-lav', skin: 'holo', face: 'excited', accessories: ['crown'] }),
    preset({ squishyType: 'unicorn', primaryColour: 'pastel-pink', skin: 'rainbow', face: 'happy', accessories: ['flower'] }),
    preset({ squishyType: 'bear', primaryColour: 'bright-purple', skin: 'galaxy', face: 'mischief', accessories: ['horns'] }),
    preset({ squishyType: 'cat', primaryColour: 'pastel-sky', skin: 'glitter', face: 'silly', accessories: ['wings'] }),
  ],
  'Sea Creatures': [
    preset({ squishyType: 'axolotl', primaryColour: 'pastel-pink', skin: 'solid', face: 'happy' }),
    preset({ squishyType: 'frog', primaryColour: 'bright-green', skin: 'solid', face: 'silly' }),
    preset({ squishyType: 'axolotl', primaryColour: 'pastel-lav', skin: 'glitter', face: 'shy', accessories: ['flower'] }),
    preset({ squishyType: 'frog', primaryColour: 'pastel-mint', skin: 'clouds', face: 'excited' }),
  ],
  Mystery: [
    preset({ squishyType: 'blob', primaryColour: 'pastel-lav', skin: 'galaxy', face: 'mischief' }),
    preset({ squishyType: 'blob', primaryColour: 'pastel-mint', skin: 'holo', face: 'surprised' }),
    preset({ squishyType: 'blob', primaryColour: 'bright-pink', skin: 'glitter', face: 'silly', accessories: ['crown'] }),
    preset({ squishyType: 'blob', primaryColour: 'pastel-sky', skin: 'rainbow', face: 'excited' }),
  ],
};
