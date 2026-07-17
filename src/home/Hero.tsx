import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import SquishyPreview from '../squishy/SquishyPreview';
import { HERO_SQUISHIES } from '../lib/presets';
import { useParallaxScene, useMagnetic } from '../lib/motion';

export default function Hero() {
  const nav = useNavigate();
  const scene = useParallaxScene<HTMLDivElement>();
  const magnet = useMagnetic<HTMLDivElement>(0.4);

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__eyebrow">
            <span className="hero__eyebrow-dot" /> Design-your-own collectible squishies
          </span>
          <h1 className="hero__title">
            Create a squishy
            <br />
            that is{' '}
            <span className="hero__accent">
              completely yours
              <svg className="hero__underline" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 16 C 70 4, 150 4, 210 12 S 290 20, 296 10" />
              </svg>
            </span>
          </h1>
          <p className="hero__sub">
            Choose your squishy, change its colours, add patterns and faces, then
            wrap it as a virtual present for someone special.
          </p>
          <div className="hero__buttons">
            <div ref={magnet} className="magnetic">
              <Button variant="primary" size="lg" icon="wand" onClick={() => nav('/editor')}>
                Create My Squishy
              </Button>
            </div>
            <Button
              variant="ghost"
              size="lg"
              icon="star"
              onClick={() =>
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore the collection
            </Button>
          </div>
          <div className="hero__stats">
            <div><strong>10</strong><span>squishies</span></div>
            <div><strong>14</strong><span>patterns</span></div>
            <div><strong>∞</strong><span>combos</span></div>
          </div>
        </div>

        <div className="hero__scene" ref={scene} aria-hidden="true">
          <div className="hero__pedestal" />
          <div className="hero__hero-squishy" data-depth="0.18">
            <SquishyPreview state={HERO_SQUISHIES[0]} size="min(58vw, 360px)" float interactive />
          </div>
          <div className="hero__orbit hero__orbit--1" data-depth="0.9">
            <SquishyPreview state={HERO_SQUISHIES[1]} size={130} float floatDelay={600} shadow={false} interactive />
          </div>
          <div className="hero__orbit hero__orbit--2" data-depth="1.3">
            <SquishyPreview state={HERO_SQUISHIES[2]} size={104} float floatDelay={1100} shadow={false} interactive />
          </div>
          <div className="hero__orbit hero__orbit--3" data-depth="1.1">
            <SquishyPreview state={HERO_SQUISHIES[3]} size={116} float floatDelay={300} shadow={false} interactive />
          </div>
          <div className="hero__orbit hero__orbit--4" data-depth="1.6">
            <SquishyPreview state={HERO_SQUISHIES[4]} size={88} float floatDelay={900} shadow={false} interactive />
          </div>
          <span className="hero__sticker" data-depth="0.6">100%<br/>YOURS</span>
        </div>
      </div>
      <div className="hero__scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
