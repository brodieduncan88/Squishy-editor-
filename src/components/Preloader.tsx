import { useEffect, useRef, useState } from 'react';
import SquishyPreview from '../squishy/SquishyPreview';
import { preset } from '../lib/presets';
import { prefersReducedMotion } from '../lib/prefs';
import './preloader.css';

const MASCOT = preset({
  squishyType: 'bear',
  primaryColour: 'pastel-pink',
  skin: 'hearts',
  face: 'happy',
  accessories: ['bow'],
});

/* Shown once per session. Counts up, then a curtain reveal.
   Skipped entirely under reduced-motion (renders nothing). */
export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(() => {
    if (prefersReducedMotion()) return true;
    return sessionStorage.getItem('squishy.intro') === 'done';
  });
  const raf = useRef<number>();

  useEffect(() => {
    if (gone) return;
    const start = performance.now();
    const DUR = 1500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DUR);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setPct(Math.round(eased * 100));
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        sessionStorage.setItem('squishy.intro', 'done');
        setTimeout(() => setGone(true), 900);
      }
    };
    raf.current = requestAnimationFrame(tick);
    document.body.style.overflow = 'hidden';
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      document.body.style.overflow = '';
    };
  }, [gone]);

  useEffect(() => {
    if (gone) document.body.style.overflow = '';
  }, [gone]);

  if (gone) return null;

  return (
    <div className={`preloader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="preloader__curtain preloader__curtain--l" />
      <div className="preloader__curtain preloader__curtain--r" />
      <div className="preloader__center">
        <div className="preloader__squishy">
          <SquishyPreview state={MASCOT} size={160} float shadow={false} />
        </div>
        <div className="preloader__word">
          <span>Squishy</span>
          <span>Studio</span>
        </div>
        <div className="preloader__bar">
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="preloader__pct">{pct}%</div>
      </div>
    </div>
  );
}
