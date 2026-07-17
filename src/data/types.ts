/* ============================================================
   Squishy Studio — Asset type definitions
   Everything the editor renders is described by this data.
   New squishies / skins / faces / extras = add config, no UI code.
   ============================================================ */

export type Category =
  | 'Animals'
  | 'Food'
  | 'Fantasy'
  | 'Sea Creatures'
  | 'Mystery';

export interface AnchorPoint {
  x: number;
  y: number;
}

/** A squishy body. `body` is an SVG path drawn on a 0..300 canvas. */
export interface SquishyShape {
  id: string;
  name: string;
  category: Category;
  /** Main body silhouette path (viewBox 0 0 300 300). */
  body: string;
  /** Optional extra shapes drawn behind body (ears, fins…) that inherit body colour. */
  behind?: string[];
  /** Optional extra shapes drawn above the pattern but below the face.
      `tone` derives a colour from the body; `fill` sets an explicit colour
      (beaks, horns, cherries) that ignores the body colour. */
  details?: { path: string; tone?: 'light' | 'dark'; fill?: string }[];
  /** Where the face sits and how big. */
  face: { x: number; y: number; scale: number };
  /** Slot anchors for accessories. */
  anchors: Partial<Record<AccessorySlot, AnchorPoint>>;
  /** Emoji fallback for compact chips. */
  emoji: string;
}

export type ColourGroup = 'pastel' | 'bright' | 'metallic';

export interface Colour {
  id: string;
  name: string;
  hex: string;
  group: ColourGroup;
  /** Metallic swatches get an extra sheen when rendered. */
  metallic?: boolean;
}

export interface Gradient {
  id: string;
  name: string;
  from: string;
  to: string;
}

export type SkinKind = 'solid' | 'pattern' | 'texture';

export interface Skin {
  id: string;
  name: string;
  kind: SkinKind;
  /** For 'texture' skins (galaxy/holo/gold…) an override fill can be supplied. */
  overlay?: 'galaxy' | 'glitter' | 'gold' | 'silver' | 'holo' | 'rainbow';
  emoji: string;
}

export interface Face {
  id: string;
  name: string;
  eyes: string;
  mouth: string;
  cheeks: boolean;
  emoji: string;
}

export type AccessorySlot =
  | 'head'
  | 'face'
  | 'neck'
  | 'back'
  | 'sticker'
  /** Rendered behind the body — capes, wings and magic effects. */
  | 'aura';

export interface Accessory {
  id: string;
  name: string;
  slot: AccessorySlot;
  emoji: string;
  /** SVG markup positioned relative to the slot anchor. `uid` namespaces any
      inline gradient ids so multiple squishies can share a page. */
  render: (anchor: AnchorPoint, uid: string) => string;
}

export interface GiftBox {
  id: string;
  name: string;
  /** Base box colour. */
  colour: string;
  emoji: string;
}

export interface Wrapping {
  id: string;
  name: string;
  pattern: 'plain' | 'dots' | 'stripes' | 'stars' | 'hearts' | 'confetti';
  emoji: string;
}

export interface Ribbon {
  id: string;
  name: string;
  colour: string;
  emoji: string;
}

export type Personality =
  | 'Brave'
  | 'Funny'
  | 'Kind'
  | 'Sleepy'
  | 'Cheeky'
  | 'Magical';

export interface DesignPack {
  id: string;
  name: string;
  blurb: string;
  colours: [string, string];
  skin: string;
}
