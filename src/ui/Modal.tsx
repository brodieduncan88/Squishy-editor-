import { useEffect, useRef, type ReactNode } from 'react';
import { IconButton } from './Button';
import './overlay.css';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  labelledBy?: string;
}

export default function Modal({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // focus the dialog for screen readers / keyboard
    requestAnimationFrame(() => ref.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div
        className="overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="overlay__head">
          {title && <h2 className="overlay__title">{title}</h2>}
          <IconButton name="close" label="Close" onClick={onClose} round soft />
        </div>
        <div className="overlay__body">{children}</div>
      </div>
    </div>
  );
}
