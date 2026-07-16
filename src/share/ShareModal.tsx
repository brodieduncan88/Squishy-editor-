import { useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import SquishyPreview from '../squishy/SquishyPreview';
import type { EditorState } from '../state/editorState';
import { shareUrl } from '../lib/share';
import { downloadCard } from '../lib/exportImage';
import { saveCreation } from '../lib/storage';

interface Props {
  open: boolean;
  state: EditorState;
  onClose: () => void;
}

export default function ShareModal({ open, state, onClose }: Props) {
  const url = useMemo(() => (open ? shareUrl(state) : ''), [open, state]);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard blocked — the field is selectable as a fallback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const save = async () => {
    setBusy(true);
    try {
      await downloadCard(state);
    } finally {
      setBusy(false);
    }
  };

  const keep = () => {
    saveCreation(state);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Modal open={open} onClose={onClose} title="Share your squishy">
      <div className="share">
        <div className="share__preview">
          <SquishyPreview state={state} size={200} float />
          <div className="share__name">{state.name || 'My Squishy'}</div>
        </div>

        <div className="share__link">
          <Icon name="lock" size={20} />
          <input readOnly value={url} aria-label="Private share link" onFocus={(e) => e.target.select()} />
          <Button variant="sky" size="sm" onClick={copy} icon={copied ? 'check' : 'share'}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="share__note">
          <Icon name="shield" size={16} /> This is a private link. Only people you
          send it to can open it — nothing is posted publicly.
        </p>

        <div className="share__actions">
          <Button variant="mint" icon="download" onClick={save} disabled={busy} block>
            {busy ? 'Saving…' : 'Save Image'}
          </Button>
          <Button variant="secondary" icon={saved ? 'check' : 'heart'} onClick={keep} block>
            {saved ? 'Saved!' : 'Keep in My Creations'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
