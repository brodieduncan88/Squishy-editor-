import { useState } from 'react';
import { IconButton } from '../ui/Button';
import SquishyPreview from '../squishy/SquishyPreview';
import type { EditorState } from '../state/editorState';

/* The big centre preview: soft gradient backdrop, idle float, click-to-squash,
   plus an optional rotate control. */
export default function StagePreview({ state }: { state: EditorState }) {
  const [angle, setAngle] = useState(0);
  return (
    <div className="stage">
      <div className="stage__glow" aria-hidden="true" />
      <div className="stage__twinkles" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <div
        className="stage__squishy"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <SquishyPreview state={state} size="min(64vw, 400px)" float interactive />
      </div>

      {state.name && <div className="stage__nameplate">{state.name}</div>}

      <div className="stage__tools">
        <IconButton
          name="rotate"
          label="Rotate squishy"
          soft
          round
          onClick={() => setAngle((a) => a - 15)}
        />
      </div>
      <p className="stage__hint" aria-hidden="true">Tap the squishy to squish it!</p>
    </div>
  );
}
