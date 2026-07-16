import './marquee.css';

interface Props {
  items: string[];
  reverse?: boolean;
}

/* Seamless kinetic ribbon. Content is duplicated so the loop is continuous. */
export default function Marquee({ items, reverse }: Props) {
  const row = (
    <div className="marquee__row" aria-hidden="true">
      {items.map((it, i) => (
        <span className="marquee__item" key={i}>
          {it}
          <span className="marquee__star">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${reverse ? 'marquee--rev' : ''}`}>
      <div className="marquee__track">
        {row}
        {row}
      </div>
    </div>
  );
}
