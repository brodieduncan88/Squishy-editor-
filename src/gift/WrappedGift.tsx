import type { EditorState } from '../state/editorState';
import { WRAPPING_MAP, RIBBON_MAP, GIFT_BOX_MAP } from '../data';
import './giftbox.css';

/** CSS background for the wrapping pattern in the chosen box colour. */
export function wrapBg(state: EditorState): string {
  const w = WRAPPING_MAP[state.wrapping];
  const box = GIFT_BOX_MAP[state.box]?.colour ?? '#F48BD8';
  const dot = 'rgba(255,255,255,0.55)';
  switch (w?.pattern) {
    case 'dots':
      return `radial-gradient(${dot} 22%, transparent 24%) 0 0/26px 26px, ${box}`;
    case 'stripes':
      return `repeating-linear-gradient(45deg, ${box}, ${box} 14px, rgba(255,255,255,0.35) 14px, rgba(255,255,255,0.35) 28px)`;
    case 'stars':
      return `radial-gradient(${dot} 18%, transparent 20%) 8px 8px/30px 30px, ${box}`;
    case 'hearts':
      return `radial-gradient(${dot} 20%, transparent 22%) 0 0/24px 24px, ${box}`;
    case 'confetti':
      return `radial-gradient(circle at 20% 30%, #FFE667 0 6px, transparent 7px), radial-gradient(circle at 70% 60%, #72E6A6 0 6px, transparent 7px), radial-gradient(circle at 45% 80%, #B69AF8 0 6px, transparent 7px), ${box}`;
    default:
      return box;
  }
}

/** The closed, wrapped gift box with ribbon + bow. Gently wobbles. */
export default function WrappedGift({ state }: { state: EditorState }) {
  const ribbon = RIBBON_MAP[state.ribbon]?.colour ?? '#FFE667';
  const bg = wrapBg(state);
  return (
    <div className="wrapped-box" style={{ '--ribbon': ribbon } as React.CSSProperties}>
      <div className="wrapped-box__lid" style={{ background: bg }} />
      <div className="wrapped-box__body" style={{ background: bg }} />
      <div className="wrapped-box__ribbon-v" />
      <div className="wrapped-box__ribbon-h" />
      <div className="wrapped-box__bow" aria-hidden="true">🎀</div>
    </div>
  );
}
