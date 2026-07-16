/* Chunky, rounded stroke icons. Single component, name-switched. */
export type IconName =
  | 'sparkles'
  | 'undo'
  | 'redo'
  | 'reset'
  | 'arrow-right'
  | 'arrow-left'
  | 'close'
  | 'share'
  | 'download'
  | 'heart'
  | 'gift'
  | 'palette'
  | 'shapes'
  | 'face'
  | 'sticker'
  | 'tag'
  | 'plus'
  | 'check'
  | 'rotate'
  | 'shield'
  | 'lock'
  | 'star'
  | 'menu'
  | 'pattern'
  | 'wand';

const P: Record<IconName, string> = {
  sparkles:
    'M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3zM19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z',
  undo: 'M9 7L4 12l5 5M4 12h11a5 5 0 0 1 0 10h-1',
  redo: 'M15 7l5 5-5 5M20 12H9a5 5 0 0 0 0 10h1',
  reset: 'M4 4v6h6M20 20v-6h-6M20 10a8 8 0 0 0-14.3-3M4 14a8 8 0 0 0 14.3 3',
  'arrow-right': 'M5 12h14M13 5l7 7-7 7',
  'arrow-left': 'M19 12H5M11 5l-7 7 7 7',
  close: 'M6 6l12 12M18 6L6 18',
  share: 'M12 3v13M12 3L8 7M12 3l4 4M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7',
  download: 'M12 3v12M12 15l-4-4M12 15l4-4M5 20h14',
  heart: 'M12 20S4 14.5 4 9a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5.5-8 11-8 11z',
  gift: 'M4 11h16v9H4zM4 7h16v4H4zM12 7v13M12 7S9 3 6.5 4.5 8 7 12 7zM12 7s3-4 5.5-2.5S16 7 12 7z',
  palette:
    'M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-.5-1.5-.5-2 .5-1 1.5-1H18a3 3 0 0 0 3-3c0-4.4-4-7-9-7zM7.5 12.5h.01M9.5 8.5h.01M14.5 8.5h.01',
  shapes: 'M7 4l4 6H3l4-6zM17 14a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM13 5h7v7h-7z',
  face: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 10h.01M15 10h.01M8.5 14a4 4 0 0 0 7 0',
  sticker: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8l6-6V5a2 2 0 0 0-2-2zM14 21v-4a2 2 0 0 1 2-2h4',
  tag: 'M3 12l9-9 8 8-9 9-8-8zM8.5 8.5h.01',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 13l4 4L19 7',
  rotate: 'M4 9a8 8 0 0 1 14-3l2 2M20 4v4h-4M20 15a8 8 0 0 1-14 3l-2-2M4 20v-4h4',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3M12 15v2',
  star: 'M12 3l2.6 6.1 6.4.5-4.9 4.2 1.5 6.2L12 16.8 6.4 20.2l1.5-6.2L3 9.6l6.4-.5L12 3z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  pattern: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  wand: 'M15 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM4 20l9-9M13 8l3 3',
};

interface Props {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  /** Fill instead of stroke (for solid glyphs like star/heart). */
  filled?: boolean;
}

export default function Icon({
  name,
  size = 24,
  className,
  strokeWidth = 2.4,
  filled = false,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={P[name]} />
    </svg>
  );
}
