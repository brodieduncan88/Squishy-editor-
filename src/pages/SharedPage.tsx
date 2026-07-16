import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Logo } from '../home/Header';
import { SkyDecor } from '../home/Decor';
import Button from '../ui/Button';
import SquishyPreview from '../squishy/SquishyPreview';
import { decodeState } from '../lib/share';
import { downloadCard } from '../lib/exportImage';
import './pages.css';

export default function SharedPage() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  // The token may carry a "~tag" privacy suffix — strip it before decoding.
  const state = useMemo(() => decodeState(id.split('~')[0]), [id]);

  if (!state) {
    return (
      <div className="shared shared--bad">
        <SkyDecor />
        <div className="shared__card">
          <h1>Hmm, this gift didn’t open 🎁</h1>
          <p>This link looks broken or incomplete.</p>
          <Button variant="primary" size="lg" icon="wand" onClick={() => nav('/editor')}>
            Make your own squishy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="shared">
      <SkyDecor />
      <div className="shared__topbar">
        <Logo />
      </div>
      <div className="shared__card">
        <span className="pill">🎁 A squishy just for you</span>
        {state.recipient && <h1 className="shared__to">Hi {state.recipient}!</h1>}
        <div className="shared__squishy">
          <SquishyPreview state={state} size={240} float />
        </div>
        <div className="shared__name">{state.name || 'A Squishy'}</div>
        {state.giftMessage && <p className="shared__msg">“{state.giftMessage}”</p>}

        <div className="shared__actions">
          <Button
            variant="sky"
            size="lg"
            icon="download"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await downloadCard(state);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'Saving…' : 'Save Image'}
          </Button>
          <Button
            variant="primary"
            size="lg"
            icon="wand"
            onClick={() => nav('/editor', { state: { seed: state } })}
          >
            Make My Own
          </Button>
        </div>
      </div>
    </div>
  );
}
