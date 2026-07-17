import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import SquishyPreview from '../squishy/SquishyPreview';
import type { EditorState } from '../state/editorState';
import { downloadCard } from '../lib/exportImage';
import { sound } from '../audio/sound';
import WrappedGift from '../gift/WrappedGift';

interface Props {
  open: boolean;
  state: EditorState;
  onClose: () => void;
  onSendLink: () => void;
}

export default function GiftReveal({ open, state, onClose, onSendLink }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [saving, setSaving] = useState(false);

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
          <WrappedGift state={state} />
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
