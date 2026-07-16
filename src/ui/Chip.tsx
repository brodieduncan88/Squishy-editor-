interface Props {
  label: string;
  emoji?: string;
  selected?: boolean;
  onSelect: () => void;
}

export default function Chip({ label, emoji, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      className={`chip ${selected ? 'is-selected' : ''}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      {emoji && <span aria-hidden="true">{emoji}</span>}
      {label}
    </button>
  );
}
