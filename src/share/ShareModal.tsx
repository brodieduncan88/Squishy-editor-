import { useEffect, useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import WrappedGift from '../gift/WrappedGift';
import type { EditorState } from '../state/editorState';
import {
  shareUrl,
  shareText,
  nativeShare,
  SHARE_CHANNELS,
} from '../lib/share';
import { downloadCard } from '../lib/exportImage';
import { saveCreation } from '../lib/storage';
import { sound } from '../audio/sound';
import './share.css';

interface Props {
  open: boolean;
  state: EditorState;
  onClose: () => void;
}

export default function ShareModal({ open, state, onClose }: Props) {
  const url = useMemo(() => (open ? shareUrl(state) : ''), [open, state]);
  const text = useMemo(() => shareText(state), [state]);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [canNative, setCanNative] = useState(false);

  useEffect(() => {
    setCanNative(typeof navigator !== 'undefined' && !!navigator.share);
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard blocked — the field is selectable as a fallback */
    }
    setCopied(true);
    sound.play('select');
    setTimeout(() => setCopied(false), 2000);
  };

  const send = async () => {
    const ok = await nativeShare(state, url);
    if (!ok) copy(); // fall back to copying the link
    else sound.play('success');
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
    sound.play('select');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Modal open={open} onClose={onClose} title="Send your gift 🎁">
      <div className="share">
        <div className="share__preview">
          <WrappedGift state={state} />
          <p className="share__summary">
            {state.recipient ? <>For <strong>{state.recipient}</strong></> : 'Ready to send'}
            {state.sender ? <> · from <strong>{state.sender}</strong></> : null}
          </p>
        </div>

        {canNative && (
          <Button variant="primary" size="lg" icon="share" block onClick={send}>
            Send to someone
          </Button>
        )}

        <p className="share__hint">
          {canNative
            ? 'Choose a contact, message app, email or social — they’ll get a link to open the gift.'
            : 'Send the gift link by message, email or social:'}
        </p>

        <div className="share__channels">
          {SHARE_CHANNELS.map((c) => (
            <a
              key={c.id}
              className="share-channel"
              href={c.href(text, url)}
              target={c.external ? '_blank' : undefined}
              rel={c.external ? 'noopener noreferrer' : undefined}
              onClick={() => sound.play('select')}
            >
              <span className={`share-channel__icon share-channel__icon--${c.id}`}>
                <ChannelGlyph id={c.id} />
              </span>
              <span className="share-channel__label">{c.label}</span>
            </a>
          ))}
        </div>

        <div className="share__link">
          <Icon name="lock" size={20} />
          <input
            readOnly
            value={url}
            aria-label="Private gift link"
            onFocus={(e) => e.target.select()}
          />
          <Button variant="sky" size="sm" onClick={copy} icon={copied ? 'check' : 'share'}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="share__note">
          <Icon name="shield" size={16} /> This is a private link. Only people you
          send it to can open the gift — nothing is posted publicly.
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

/* Simple monochrome glyphs so no external brand assets are needed. */
function ChannelGlyph({ id }: { id: string }) {
  switch (id) {
    case 'sms':
      return <Icon name="share" size={22} />;
    case 'email':
      return <Icon name="tag" size={22} />;
    case 'whatsapp':
      return <span aria-hidden>💬</span>;
    case 'facebook':
      return <span aria-hidden>f</span>;
    case 'x':
      return <span aria-hidden>𝕏</span>;
    default:
      return <Icon name="share" size={22} />;
  }
}
