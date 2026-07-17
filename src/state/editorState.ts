/* The single editor state object + helpers for defaults and randomisation. */

export type Finish = 'jelly' | 'solid';

export interface EditorState {
  squishyType: string;
  primaryColour: string;
  secondaryColour: string;
  gradient: string | null; // gradient id overrides solid colour when set
  finish: Finish; // translucent glitter vs opaque solid
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
  sender: string;
  giftMessage: string;
}

export const DEFAULT_STATE: EditorState = {
  squishyType: 'bear',
  primaryColour: 'pastel-pink',
  secondaryColour: 'pastel-lav',
  gradient: null,
  finish: 'jelly',
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
  sender: '',
  giftMessage: '',
};

export type EditorPatch = Partial<EditorState>;
