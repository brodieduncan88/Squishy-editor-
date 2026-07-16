import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';
import './motion.css';

type RevealVariant = 'up' | 'scale' | 'blur' | 'left' | 'right';

interface Props {
  children: ReactNode;
  variant?: RevealVariant;
  /** stagger index → delay */
  delay?: number;
  as?: ElementType;
  className?: string;
  /** re-run when scrolled back into view */
  once?: boolean;
  style?: React.CSSProperties;
}

/* Scroll-reveal wrapper. Adds `.is-in` when the element enters the viewport,
   driving a CSS spring transition. Honours prefers-reduced-motion (the CSS
   collapses the transform/opacity so content is simply visible). */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  as: Tag = 'div',
  className = '',
  once = true,
  style,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already at/above the viewport on mount is shown immediately —
    // avoids a flash of hidden content and covers deep links / restored scroll.
    const r0 = el.getBoundingClientRect();
    if (r0.top < window.innerHeight * 0.92) {
      setInView(true);
      if (once) return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // Reveal when it enters OR when it has already been scrolled past the
          // top (fast-scroll can skip the intersecting frame otherwise).
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            setInView(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold: [0, 0.16], rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal reveal--${variant} ${inView ? 'is-in' : ''} ${className}`}
      style={{ ...style, ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
