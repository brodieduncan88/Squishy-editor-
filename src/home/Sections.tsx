import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import Icon, { type IconName } from '../ui/Icon';
import SquishyPreview from '../squishy/SquishyPreview';
import { GALLERY_SQUISHIES, preset } from '../lib/presets';
import { DESIGN_PACKS } from '../data';
import type { Category } from '../data';

/* ---------- How It Works ---------- */
const STEPS: { icon: IconName; title: string; body: string; tint: string }[] = [
  { icon: 'shapes', title: 'Pick', body: 'Choose your favourite squishy character to start.', tint: 'var(--sky-soft)' },
  { icon: 'palette', title: 'Customise', body: 'Change colours, add patterns, faces and fun extras.', tint: '#FFD9F0' },
  { icon: 'gift', title: 'Wrap', body: 'Pop it in a gift box with a bow and a message.', tint: '#D9F7E6' },
  { icon: 'share', title: 'Share', body: 'Save a picture or send a private link to someone.', tint: '#FFF0C4' },
];

export function HowItWorks() {
  return (
    <section id="how" className="section">
      <div className="container">
        <SectionHead
          kicker="So easy!"
          title="How It Works"
          sub="Four little steps from idea to gift."
        />
        <div className="how-grid">
          {STEPS.map((s, i) => (
            <div className="how-card" key={s.title} style={{ background: s.tint }}>
              <span className="how-card__num">{i + 1}</span>
              <span className="how-card__icon">
                <Icon name={s.icon} size={34} strokeWidth={2.6} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Gallery ---------- */
const CATEGORIES: Category[] = ['Animals', 'Food', 'Fantasy', 'Sea Creatures', 'Mystery'];

export function Gallery() {
  const [cat, setCat] = useState<Category>('Animals');
  const nav = useNavigate();
  const items = GALLERY_SQUISHIES[cat] ?? [];
  return (
    <section id="gallery" className="section section--tint">
      <div className="container">
        <SectionHead
          kicker="Squishy ideas"
          title="Meet the Squishies"
          sub="Browse by kind, then make one your own."
        />
        <div className="chip-row" role="tablist" aria-label="Squishy categories">
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={c === cat} onSelect={() => setCat(c)} />
          ))}
        </div>
        <div className="gallery-grid">
          {items.map((s, i) => (
            <button
              className="gallery-card"
              key={i}
              onClick={() => nav('/editor', { state: { seed: s } })}
              aria-label={`Customise this ${cat} squishy`}
            >
              <SquishyPreview state={s} size="82%" float floatDelay={i * 250} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Design Packs ---------- */
export function DesignPacksSection() {
  const nav = useNavigate();
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          kicker="Quick looks"
          title="Design Packs"
          sub="Tap a pack to start with a ready-made style."
        />
        <div className="packs-grid">
          {DESIGN_PACKS.map((p) => {
            const seed = preset({
              squishyType: 'bear',
              primaryColour: p.colours[0],
              secondaryColour: p.colours[1],
              skin: p.skin,
              face: 'happy',
            });
            return (
              <button
                key={p.id}
                className="pack-card"
                onClick={() => nav('/editor', { state: { seed } })}
              >
                <div className="pack-card__preview">
                  <SquishyPreview state={seed} size={120} shadow={false} />
                </div>
                <div className="pack-card__meta">
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                </div>
                <span className="pack-card__go">
                  <Icon name="arrow-right" size={20} strokeWidth={2.8} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Virtual Gift ---------- */
export function GiftSection() {
  const nav = useNavigate();
  const squishy = preset({
    squishyType: 'bear',
    primaryColour: 'pastel-pink',
    skin: 'hearts',
    face: 'happy',
    accessories: ['bow'],
    name: 'For You',
  });
  return (
    <section className="section section--gift">
      <div className="container gift-band">
        <div className="gift-band__art" aria-hidden="true">
          <div className="giftbox-open">
            <div className="giftbox-open__squishy">
              <SquishyPreview state={squishy} size={190} float shadow={false} />
            </div>
            <div className="giftbox-open__lid" />
            <div className="giftbox-open__front" />
            <div className="giftbox-open__ribbon" />
          </div>
        </div>
        <div className="gift-band__copy">
          <span className="pill">🎁 Virtual presents</span>
          <h2>Wrap it up as a gift</h2>
          <p>
            Every squishy can become a virtual present. Add a box, a bow and a
            little message, then send it to someone you love.
          </p>
          <Button variant="lemon" size="lg" icon="gift" onClick={() => nav('/editor')}>
            Make a Gift
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Parent Trust ---------- */
const TRUST: { icon: IconName; title: string; body: string }[] = [
  { icon: 'lock', title: 'No public chat', body: 'There is no open chat and no messaging with strangers. Ever.' },
  { icon: 'shield', title: 'Private sharing', body: 'Creations are only seen by people your child sends a private link to.' },
  { icon: 'heart', title: 'Parent-friendly', body: 'No real names on display, no public galleries and no sign-up needed to play.' },
];

export function TrustSection() {
  return (
    <section className="section section--tint">
      <div className="container">
        <SectionHead
          kicker="For grown-ups"
          title="Safe by design"
          sub="Built to be a calm, private, friendly place to play."
        />
        <div className="trust-grid">
          {TRUST.map((t) => (
            <div className="trust-card" key={t.title}>
              <span className="trust-card__icon">
                <Icon name={t.icon} size={30} strokeWidth={2.6} />
              </span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__brand">✦ Squishy Studio</p>
        <p className="site-footer__note">
          A gentle place to create and gift your own squishy toys.
        </p>
      </div>
    </footer>
  );
}

/* ---------- shared heading ---------- */
export function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="section-head">
      <span className="section-head__kicker">{kicker}</span>
      <h2 className="section-head__title">{title}</h2>
      {sub && <p className="section-head__sub">{sub}</p>}
    </div>
  );
}
