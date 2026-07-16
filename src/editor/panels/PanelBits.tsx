import type { ReactNode } from 'react';

/** Shared header + grid helpers so every panel looks consistent. */
export function PanelHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="panel-head">
      <h3 className="panel-head__title">{title}</h3>
      {hint && <p className="panel-head__hint">{hint}</p>}
    </div>
  );
}

export function OptionGrid({
  children,
  cols = 3,
}: {
  children: ReactNode;
  cols?: number;
}) {
  return (
    <div className="option-grid" style={{ '--cols': cols } as React.CSSProperties}>
      {children}
    </div>
  );
}

export function GroupLabel({ children }: { children: ReactNode }) {
  return <p className="group-label">{children}</p>;
}
