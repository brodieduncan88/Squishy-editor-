import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import SquishyPreview from '../squishy/SquishyPreview';
import { HERO_SQUISHIES } from '../lib/presets';

export default function Hero() {
  const nav = useNavigate();
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="pill hero__badge">✨ New · Make it squishy</span>
          <h1 className="hero__title">
            Create a squishy that is <span className="hl">completely yours</span>
          </h1>
          <p className="hero__sub">
            Choose your squishy, change its colours, add patterns and faces, then
            wrap it as a virtual present for someone special.
          </p>
          <div className="hero__buttons">
            <Button variant="primary" size="lg" icon="wand" onClick={() => nav('/editor')}>
              Create My Squishy
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon="star"
              onClick={() =>
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              See Squishy Ideas
            </Button>
          </div>
        </div>

        <div className="hero__stage" aria-hidden="true">
          <div className="hero__float hero__float--1">
            <SquishyPreview state={HERO_SQUISHIES[0]} size={210} float floatDelay={0} shadow={false} />
          </div>
          <div className="hero__float hero__float--2">
            <SquishyPreview state={HERO_SQUISHIES[1]} size={150} float floatDelay={600} shadow={false} />
          </div>
          <div className="hero__float hero__float--3">
            <SquishyPreview state={HERO_SQUISHIES[3]} size={130} float floatDelay={1100} shadow={false} />
          </div>
          <div className="hero__float hero__float--4">
            <SquishyPreview state={HERO_SQUISHIES[4]} size={120} float floatDelay={300} shadow={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
