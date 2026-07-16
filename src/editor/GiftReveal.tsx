import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import SquishyPreview from '../squishy/SquishyPreview';
import type { EditorState } from '../state/editorState';
import { WRAPPING_MAP, RIBBON_MAP, GIFT_BOX_MAP } from '../data';
import { downloadCard } from '../lib/exportImage';
import { sound } from '../audio/sound';

const wrapBg = (state: EditorState): string => {
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
};

interface Props {
  open: boolean;
  state: EditorState;
  onClose: () => void;
  onSendLink: () => void;
}

export default function GiftReveal({ open, state, onClose, onSendLink }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [saving, setSaving] = useState(false);
  const ribbon = RIBBON_MAP[state.ribbon]?.colour ?? '#FFE667';

  useEffect(() => {
    if (open) setRevealed(false);
  }, [open]);

  const save = async () => {
    setSaving(true);
    try {
      await downloadCard(state);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={revealed ? 'Ta-da! 🎉' : 'A gift is ready!'}>
      {!revealed ? (
        <div className="gift-reveal">
          {state.recipient && (
            <div className="gift-reveal__tag">
              To: <strong>{state.recipient}</strong>
            </div>
          )}
          <div className="wrapped-box" style={{ '--ribbon': ribbon } as React.CSSProperties}>
            <div className="wrapped-box__lid" style={{ background: wrapBg(state) }} />
            <div className="wrapped-box__body" style={{ background: wrapBg(state) }} />
            <div className="wrapped-box__ribbon-v" />
            <div className="wrapped-box__ribbon-h" />
            <div className="wrapped-box__bow" aria-hidden="true">🎀</div>
          </div>
          <Button
            variant="primary"
            size="lg"
            icon="gift"
            onClick={() => {
              setRevealed(true);
              sound.play('success');
            }}
          >
            Open the Gift
          </Button>
        </div>
      ) : (
        <div className="gift-open">
          <div className="gift-open__card">
            <div className="gift-open__squishy">
              <SquishyPreview state={state} size={220} float />
            </div>
            <div className="gift-open__name">{state.name || 'My Squishy'}</div>
            {state.giftMessage && (
              <p className="gift-open__msg">“{state.giftMessage}”</p>
            )}
            {state.recipient && (
              <p className="gift-open__to">For {state.recipient} 💛</p>
            )}
          </div>
          <div className="gift-open__actions">
            <Button variant="sky" icon="download" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save Image'}
            </Button>
            <Button variant="mint" icon="share" onClick={onSendLink}>
              Send Private Link
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
