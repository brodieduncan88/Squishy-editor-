import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './prefs';

/* ---------- Magnetic hover (buttons subtly follow the cursor) ---------- */
export function useMagnetic<T extends HTMLElement>(strength = 0.32) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.transform = 'translate(0,0)';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', reset);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}

/* ---------- Pointer-driven parallax for a container's children ----------
   Children opt in with a data-depth attribute (e.g. data-depth="0.4").
   Also reacts gently to scroll. */
export function useParallaxScene<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const layers = Array.from(
      el.querySelectorAll<HTMLElement>('[data-depth]'),
    );
    let raf = 0;
    let mx = 0;
    let my = 0;

    const apply = () => {
      const rectTop = el.getBoundingClientRect().top;
      const scroll = rectTop * -0.06;
      layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth || '0');
        l.style.transform = `translate3d(${mx * d * 26}px, ${
          my * d * 26 + scroll * d
        }px, 0)`;
      });
    };
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx = (e.clientX / w - 0.5) * 2;
      my = (e.clientY / h - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}
