import type { ReactNode } from 'react';
import Icon from './Icon';
import { sound } from '../audio/sound';

interface Props {
  label: string;
  emoji?: string;
  selected?: boolean;
  onSelect: () => void;
  children?: ReactNode;
  /** override style, e.g. background swatch preview */
  style?: React.CSSProperties;
}

/* A large, touch-friendly option. Selection is shown three ways so colour is
   never the only cue: a ring, a lift, and a check badge. */
export default function SelectTile({
  label,
  emoji,
  selected,
  onSelect,
  children,
  style,
}: Props) {
  return (
    <button
      type="button"
      className={`tile ${selected ? 'is-selected' : ''}`}
      aria-pressed={selected}
      onClick={() => {
        sound.play('select');
        onSelect();
      }}
      style={style}
    >
      {selected && (
        <span className="tile__check" aria-hidden="true">
          <Icon name="check" size={16} strokeWidth={3} />
        </span>
      )}
      {children ?? (emoji && <span className="tile__emoji">{emoji}</span>)}
      <span className="tile__label">{label}</span>
    </button>
  );
}
