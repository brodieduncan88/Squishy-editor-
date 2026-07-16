import { useEffect, type ReactNode } from 'react';
import { IconButton } from './Button';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheet({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sheet__grip" />
        <div className="sheet__head">
          <h3 className="sheet__title">{title}</h3>
          <IconButton name="close" label="Close options" onClick={onClose} round soft />
        </div>
        {children}
      </div>
    </>
  );
}
