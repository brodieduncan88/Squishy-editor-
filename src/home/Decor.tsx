/* Purely decorative sky layer: soft clouds, orbit rings and twinkles.
   aria-hidden — never announced. */
export function SkyDecor() {
  return (
    <div className="sky-decor" aria-hidden="true">
      <span className="orbit orbit--1" />
      <span className="orbit orbit--2" />
      <span className="cloud cloud--a" />
      <span className="cloud cloud--b" />
      <span className="cloud cloud--c" />
      {[
        { t: '12%', l: '8%', d: 0 },
        { t: '22%', l: '86%', d: 1.2 },
        { t: '64%', l: '5%', d: 0.6 },
        { t: '72%', l: '92%', d: 1.8 },
        { t: '40%', l: '48%', d: 2.4 },
      ].map((s, i) => (
        <Twinkle key={i} top={s.t} left={s.l} delay={s.d} />
      ))}
    </div>
  );
}

function Twinkle({ top, left, delay }: { top: string; left: string; delay: number }) {
  return (
    <svg
      className="twinkle"
      style={{ top, left, animationDelay: `${delay}s` }}
      viewBox="0 0 24 24"
      width="30"
      height="30"
    >
      <path
        d="M12 0c1 6 5 10 12 12-7 2-11 6-12 12-1-6-5-10-12-12C7 10 11 6 12 0z"
        fill="#FFFDF8"
      />
    </svg>
  );
}
