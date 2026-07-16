import { useId, useMemo, useRef, useState } from 'react';
import { buildSquishy } from '../lib/buildSquishy';
import type { EditorState } from '../state/editorState';
import { sound } from '../audio/sound';
import './squishy.css';

interface Props {
  state: EditorState;
  size?: number | string;
  /** gentle idle floating */
  float?: boolean;
  /** click / tap squashes the squishy */
  interactive?: boolean;
  shadow?: boolean;
  className?: string;
  /** decorative offset so a group of floaters don't move in sync */
  floatDelay?: number;
}

export default function SquishyPreview({
  state,
  size = 260,
  float = false,
  interactive = false,
  shadow = true,
  className = '',
  floatDelay = 0,
}: Props) {
  const rawId = useId().replace(/[:]/g, '');
  const [squashing, setSquashing] = useState(false);
  const timer = useRef<number>();

  const svg = useMemo(
    () => buildSquishy(state, { idPrefix: rawId, shadow }),
    [state, rawId, shadow],
  );

  const squash = () => {
    if (!interactive) return;
    setSquashing(false);
    window.clearTimeout(timer.current);
    sound.play('squish');
    // restart animation on rapid clicks
    requestAnimationFrame(() => setSquashing(true));
    timer.current = window.setTimeout(() => setSquashing(false), 440);
  };

  const dim = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`squishy-holder ${float ? 'is-floating' : ''} ${className}`}
      style={{ width: dim, height: dim, animationDelay: `${floatDelay}ms` }}
    >
      <div
        className={`squishy-body ${squashing ? 'is-squashing' : ''} ${
          interactive ? 'is-interactive' : ''
        }`}
        onPointerDown={squash}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={
          interactive
            ? `${state.name || 'Your squishy'} — tap to squish`
            : undefined
        }
        onKeyDown={(e) => {
          if (interactive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            squash();
          }
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
