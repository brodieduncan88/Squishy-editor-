import { useEffect, useRef } from 'react';
import { useHasFinePointer, useReducedMotion } from '../lib/prefs';
import './cursor.css';

/* A soft jelly cursor with a trailing dot. Grows over interactive elements and
   shrinks on press. Desktop + motion-OK only; otherwise the native cursor
   stays and nothing renders. */
export default function Cursor() {
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine || reduced) return;
    document.body.classList.add('has-custom-cursor');
    const ring = ringRef.current!;
    const dot = dotRef.current!;
    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let dx = rx;
    let dy = ry;
    let raf = 0;

    const loop = () => {
      // ring eases behind the dot for a springy trail
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const move = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      const t = e.target as HTMLElement;
      const interactive = t.closest(
        'button, a, input, textarea, [role="button"], .swatch, .tile, .chip, label',
      );
      ring.classList.toggle('is-hover', !!interactive);
    };
    const down = () => ring.classList.add('is-down');
    const up = () => ring.classList.remove('is-down');
    const leave = () => ring.classList.add('is-hidden');
    const enter = () => ring.classList.remove('is-hidden');

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
