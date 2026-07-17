import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Logo } from '../home/Header';
import { SkyDecor } from '../home/Decor';
import Atmosphere from '../components/Atmosphere';
import Button from '../ui/Button';
import SquishyPreview from '../squishy/SquishyPreview';
import WrappedGift from '../gift/WrappedGift';
import { decodeState } from '../lib/share';
import { downloadCard } from '../lib/exportImage';
import { sound } from '../audio/sound';
import './pages.css';

export default function SharedPage() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [opened, setOpened] = useState(false);

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

  const from = state.sender?.trim();

  return (
    <div className="shared">
      <Atmosphere />
      <SkyDecor />
      <div className="shared__topbar">
        <Logo />
      </div>

      {!opened ? (
        /* ---------- Closed gift ---------- */
        <div className="shared__card">
          <span className="pill">🎁 A surprise for you</span>
          <h1 className="shared__to">
            {state.recipient ? `Hi ${state.recipient}!` : 'You’ve got a gift!'}
          </h1>
          <p className="shared__from">
            {from ? <>{from} sent you a squishy</> : 'Someone sent you a squishy'}
          </p>
          <div className="shared__box">
            <WrappedGift state={state} />
          </div>
          <Button
            variant="primary"
            size="lg"
            icon="gift"
            onClick={() => {
              setOpened(true);
              sound.play('success');
            }}
          >
            Open your gift
          </Button>
        </div>
      ) : (
        /* ---------- Opened: the squishy ---------- */
        <div className="shared__card">
          <div className="gift-open">
            <div className="gift-open__card">
              <div className="shared__squishy">
                <SquishyPreview state={state} size={230} float interactive />
              </div>
              <div className="gift-open__name">{state.name || 'A Squishy'}</div>
              {state.giftMessage && <p className="gift-open__msg">“{state.giftMessage}”</p>}
              {from && <p className="gift-open__to">From {from} 💛</p>}
            </div>
            <div className="gift-open__actions">
              <Button
                variant="sky"
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
              <Button variant="primary" icon="wand" onClick={() => nav('/editor', { state: { seed: state } })}>
                Make My Own
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
