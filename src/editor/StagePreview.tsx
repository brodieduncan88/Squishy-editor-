import { useEffect, useRef, useState } from 'react';
import { IconButton } from '../ui/Button';
import SquishyPreview from '../squishy/SquishyPreview';
import type { EditorState } from '../state/editorState';

/* The big centre preview. 2D by default (idle float, click-to-squash) with a
   3D mode: the design is procedurally converted to a glTF model and shown in
   Google's <model-viewer> with orbit controls + auto-rotate. */
export default function StagePreview({ state }: { state: EditorState }) {
  const [angle, setAngle] = useState(0);
  const [view3d, setView3d] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);
  const urlRef = useRef<string | null>(null);

  const stateKey = JSON.stringify(state);

  useEffect(() => {
    if (!view3d) return;
    let live = true;
    setBuilding(true);
    (async () => {
      try {
        // lazy-load the 3D stack only when first needed
        await import('@google/model-viewer');
        const { buildSquishyModel } = await import('../lib/squishy3d');
        const url = await buildSquishyModel(state);
        if (!live) {
          URL.revokeObjectURL(url);
          return;
        }
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = url;
        setModelUrl(url);
      } catch (e) {
        console.error('3D build failed', e);
        if (live) setView3d(false);
      } finally {
        if (live) setBuilding(false);
      }
    })();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view3d, stateKey]);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  return (
    <div className="stage">
      <div className="stage__glow" aria-hidden="true" />
      <div className="stage__twinkles" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      {view3d && modelUrl ? (
        <model-viewer
          key={modelUrl}
          src={modelUrl}
          alt={`${state.name || 'Your squishy'} in 3D`}
          camera-controls
          auto-rotate
          auto-rotate-delay="800"
          rotation-per-second="24deg"
          shadow-intensity="1.1"
          shadow-softness="0.8"
          exposure="1.1"
          interaction-prompt="none"
          touch-action="pan-y"
          camera-orbit="0deg 84deg 118%"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
        />
      ) : (
        <div className="stage__squishy" style={{ transform: `rotate(${angle}deg)` }}>
          <SquishyPreview state={state} size="min(64vw, 400px)" float interactive />
        </div>
      )}

      {state.name && !view3d && <div className="stage__nameplate">{state.name}</div>}

      <div className="stage__tools">
        <IconButton
          name="cube"
          label={view3d ? 'Back to 2D view' : 'View in 3D'}
          soft
          round
          className={view3d ? 'is-active-tool' : ''}
          onClick={() => setView3d((v) => !v)}
        />
        {!view3d && (
          <IconButton
            name="rotate"
            label="Rotate squishy"
            soft
            round
            onClick={() => setAngle((a) => a - 15)}
          />
        )}
      </div>
      <p className="stage__hint" aria-hidden="true">
        {building
          ? 'Squishifying in 3D…'
          : view3d
            ? 'Drag to spin your squishy!'
            : 'Tap the squishy to squish it!'}
      </p>
    </div>
  );
}
