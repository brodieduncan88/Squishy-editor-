import { useCallback, useReducer } from 'react';
import { DEFAULT_STATE, type EditorPatch, type EditorState } from './editorState';
import { COLOURS, SKINS, FACES, SHAPES, ACCESSORIES, FACE_MAP } from '../data';

interface History {
  past: EditorState[];
  present: EditorState;
  future: EditorState[];
}

type Action =
  | { type: 'set'; patch: EditorPatch }
  | { type: 'replace'; state: EditorState } // history-committing full replace
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset' };

const LIMIT = 60;

function apply(state: EditorState, patch: EditorPatch): EditorState {
  const next = { ...state, ...patch };
  // Selecting a face expands into its eyes/mouth/cheeks.
  if (patch.face && patch.face !== state.face) {
    const f = FACE_MAP[patch.face];
    if (f) {
      next.eyes = f.eyes;
      next.mouth = f.mouth;
      next.cheeks = f.cheeks;
    }
  }
  return next;
}

function reducer(h: History, action: Action): History {
  switch (action.type) {
    case 'set': {
      const present = apply(h.present, action.patch);
      const past = [...h.past, h.present].slice(-LIMIT);
      return { past, present, future: [] };
    }
    case 'replace': {
      const past = [...h.past, h.present].slice(-LIMIT);
      return { past, present: action.state, future: [] };
    }
    case 'undo': {
      if (!h.past.length) return h;
      const previous = h.past[h.past.length - 1];
      return {
        past: h.past.slice(0, -1),
        present: previous,
        future: [h.present, ...h.future],
      };
    }
    case 'redo': {
      if (!h.future.length) return h;
      const next = h.future[0];
      return {
        past: [...h.past, h.present],
        present: next,
        future: h.future.slice(1),
      };
    }
    case 'reset':
      return { past: [...h.past, h.present].slice(-LIMIT), present: { ...DEFAULT_STATE }, future: [] };
    default:
      return h;
  }
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Randomise colours, pattern, face and accessories (Surprise Me). */
export function randomise(state: EditorState): EditorState {
  const face = pick(FACES);
  const acc: string[] = [];
  const pool = [...ACCESSORIES];
  const count = Math.floor(Math.random() * 3); // 0–2 accessories
  for (let i = 0; i < count; i++) {
    const a = pick(pool);
    if (!acc.includes(a.id)) acc.push(a.id);
  }
  return {
    ...state,
    primaryColour: pick(COLOURS).id,
    secondaryColour: pick(COLOURS).id,
    gradient: Math.random() > 0.6 ? null : state.gradient, // usually keep solid
    skin: pick(SKINS).id,
    face: face.id,
    eyes: face.eyes,
    mouth: face.mouth,
    cheeks: face.cheeks,
    accessories: acc,
  };
}

export interface EditorApi {
  state: EditorState;
  set: (patch: EditorPatch) => void;
  setState: (state: EditorState) => void;
  toggleAccessory: (id: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  surpriseMe: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useEditorHistory(initial?: Partial<EditorState>): EditorApi {
  const [h, dispatch] = useReducer(reducer, undefined, () => ({
    past: [],
    present: { ...DEFAULT_STATE, ...initial },
    future: [],
  }));

  const set = useCallback((patch: EditorPatch) => dispatch({ type: 'set', patch }), []);
  const setState = useCallback(
    (state: EditorState) => dispatch({ type: 'replace', state }),
    [],
  );
  // Accessory toggling reads current state, so it closes over h.present.
  const toggle = useCallback(
    (id: string) => {
      const has = h.present.accessories.includes(id);
      const accessories = has
        ? h.present.accessories.filter((a) => a !== id)
        : [...h.present.accessories, id];
      dispatch({ type: 'set', patch: { accessories } });
    },
    [h.present.accessories],
  );

  return {
    state: h.present,
    set,
    setState,
    toggleAccessory: toggle,
    undo: () => dispatch({ type: 'undo' }),
    redo: () => dispatch({ type: 'redo' }),
    reset: () => dispatch({ type: 'reset' }),
    surpriseMe: () => dispatch({ type: 'replace', state: randomise(h.present) }),
    canUndo: h.past.length > 0,
    canRedo: h.future.length > 0,
  };
}
