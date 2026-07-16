import type { EditorState } from '../state/editorState';

const KEY = 'squishy.creations.v1';

export interface Creation {
  id: string;
  state: EditorState;
  createdAt: number;
}

export function loadCreations(): Creation[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Creation[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function save(list: Creation[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 60)));
  } catch {
    /* storage full / unavailable — non-fatal for the toy */
  }
}

/** Deterministic-ish id without needing crypto at build time. */
export function makeId(): string {
  const rnd = Math.floor(Math.random() * 1e9).toString(36);
  return `${Date.now().toString(36)}-${rnd}`;
}

export function saveCreation(state: EditorState): Creation {
  const list = loadCreations();
  const creation: Creation = { id: makeId(), state, createdAt: Date.now() };
  save([creation, ...list]);
  return creation;
}

export function deleteCreation(id: string): Creation[] {
  const list = loadCreations().filter((c) => c.id !== id);
  save(list);
  return list;
}
