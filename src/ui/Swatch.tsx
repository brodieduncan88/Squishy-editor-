import Icon from './Icon';
import { readableInk } from '../lib/colour';

interface Props {
  colour: string; // css colour or gradient
  label: string;
  selected?: boolean;
  metallic?: boolean;
  onSelect: () => void;
}

export default function Swatch({
  colour,
  label,
  selected,
  metallic,
  onSelect,
}: Props) {
  const background = metallic
    ? `linear-gradient(145deg, #ffffffcc, ${colour} 55%, rgba(0,0,0,0.25))`
    : colour;
  const ink = colour.startsWith('#') ? readableInk(colour) : '#fff';
  return (
    <button
      type="button"
      className={`swatch ${selected ? 'is-selected' : ''}`}
      style={{ background }}
      aria-pressed={selected}
      aria-label={label}
      title={label}
      onClick={onSelect}
    >
      {selected && (
        <span className="swatch__check" style={{ color: ink }}>
          <Icon name="check" size={22} strokeWidth={3.4} />
        </span>
      )}
    </button>
  );
}
