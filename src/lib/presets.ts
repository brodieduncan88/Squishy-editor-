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
  preset({ squishyType: 'bear', primaryColour: 'pastel-pink', skin: 'hearts', face: 'lovestruck', accessories: ['bow', 'fx-sparkle'], name: 'Rosie' }),
  preset({ squishyType: 'axolotl', primaryColour: 'pastel-lav', skin: 'glitter', face: 'starstruck', accessories: ['crown'], name: 'Sparkle' }),
  preset({ squishyType: 'cat', primaryColour: 'bright-orange', skin: 'tiger', face: 'cool', accessories: ['headphones'], name: 'Tygo' }),
  preset({ squishyType: 'unicorn', primaryColour: 'pastel-mint', skin: 'holo', face: 'dreamy', accessories: ['flower'], name: 'Dazzle' }),
  preset({ squishyType: 'blob', primaryColour: 'bright-purple', skin: 'galaxy', face: 'kitty', accessories: ['fx-stars'], name: 'Nova' }),
];

/* Signature look for each character — used in the editor's "Pick your squishy"
   tiles so the roster looks vibrant and distinct instead of ten copies of the
   current design. */
export const SIGNATURE: Record<string, EditorState> = {
  bear: preset({ squishyType: 'bear', primaryColour: 'pastel-pink', skin: 'hearts', face: 'lovestruck', accessories: ['bow'] }),
  cat: preset({ squishyType: 'cat', primaryColour: 'bright-orange', skin: 'tiger', face: 'cool', accessories: ['headphones'] }),
  dog: preset({ squishyType: 'dog', primaryColour: 'pastel-cream', skin: 'cow', face: 'excited', accessories: ['scarf'] }),
  duck: preset({ squishyType: 'duck', primaryColour: 'bright-yellow', finish: 'solid', skin: 'solid', face: 'silly', accessories: ['beanie'] }),
  axolotl: preset({ squishyType: 'axolotl', primaryColour: 'pastel-pink', skin: 'glitter', face: 'dreamy' }),
  unicorn: preset({ squishyType: 'unicorn', primaryColour: 'pastel-lav', skin: 'rainbow', face: 'starstruck', accessories: ['crown'] }),
  icecream: preset({ squishyType: 'icecream', primaryColour: 'pastel-mint', skin: 'glitter', face: 'kitty' }),
  donut: preset({ squishyType: 'donut', primaryColour: 'bright-purple', skin: 'stars', face: 'excited' }),
  frog: preset({ squishyType: 'frog', primaryColour: 'bright-green', finish: 'solid', skin: 'solid', face: 'cool', accessories: ['sunglasses'] }),
  blob: preset({ squishyType: 'blob', primaryColour: 'bright-blue', skin: 'galaxy', face: 'mischief', accessories: ['fx-sparkle'] }),
};

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
