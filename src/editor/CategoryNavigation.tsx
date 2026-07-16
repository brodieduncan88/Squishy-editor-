import Icon from '../ui/Icon';
import { CATEGORIES, type CategoryId } from './categories';

interface Props {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
  variant: 'rail' | 'tabs';
}

/* Left rail on desktop; horizontal scrollable tab bar on tablet/mobile. */
export default function CategoryNavigation({ active, onSelect, variant }: Props) {
  return (
    <nav
      className={`cat-nav cat-nav--${variant}`}
      aria-label="Customisation categories"
    >
      {CATEGORIES.map((c) => {
        const selected = c.id === active;
        return (
          <button
            key={c.id}
            className={`cat-item ${selected ? 'is-active' : ''}`}
            aria-current={selected ? 'true' : undefined}
            onClick={() => onSelect(c.id)}
          >
            <span className="cat-item__icon">
              <Icon name={c.icon} size={24} strokeWidth={2.5} />
            </span>
            <span className="cat-item__label">{c.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
