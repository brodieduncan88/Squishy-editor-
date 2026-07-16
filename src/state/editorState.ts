/* The single editor state object + helpers for defaults and randomisation. */

export interface EditorState {
  squishyType: string;
  primaryColour: string;
  secondaryColour: string;
  gradient: string | null; // gradient id overrides solid colour when set
  skin: string;
  face: string;
  eyes: string;
  mouth: string;
  cheeks: boolean;
  accessories: string[];
  name: string;
  personality: string;
  // gift
  box: string;
  wrapping: string;
  ribbon: string;
  recipient: string;
  giftMessage: string;
}

export const DEFAULT_STATE: EditorState = {
  squishyType: 'bear',
  primaryColour: 'pastel-pink',
  secondaryColour: 'pastel-lav',
  gradient: null,
  skin: 'solid',
  face: 'happy',
  eyes: 'round',
  mouth: 'smile',
  cheeks: true,
  accessories: [],
  name: '',
  personality: 'Kind',
  box: 'box-classic',
  wrapping: 'wrap-dots',
  ribbon: 'ribbon-gold',
  recipient: '',
  giftMessage: '',
};

export type EditorPatch = Partial<EditorState>;
