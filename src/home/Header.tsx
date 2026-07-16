import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button, { IconButton } from '../ui/Button';
import SoundToggle from '../audio/SoundToggle';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Squishy Studio home">
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 44 44" width="40" height="40">
          <rect width="44" height="44" rx="14" fill="#45AEEF" />
          <ellipse cx="22" cy="23" rx="13" ry="12" fill="#FFE667" />
          <circle cx="17" cy="22" r="2.6" fill="#1F2850" />
          <circle cx="27" cy="22" r="2.6" fill="#1F2850" />
          <path
            d="M18 27c2 2.4 6 2.4 8 0"
            stroke="#1F2850"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="13.5" cy="26" r="2.4" fill="#F48BD8" />
          <circle cx="30.5" cy="26" r="2.4" fill="#F48BD8" />
        </svg>
      </span>
      <span className="logo__text">Squishy Studio</span>
    </Link>
  );
}

const LINKS = [
  { to: '/editor', label: 'Create a Squishy' },
  { to: '/creations', label: 'My Creations' },
  { to: '/#how', label: 'How It Works' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Logo />
        <nav className="site-nav" aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.label} href={l.to} className="site-nav__link">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="site-header__cta">
          <SoundToggle tone="dark" />
          <Button variant="primary" onClick={() => nav('/editor')}>
            Start Creating
          </Button>
        </div>
        <div className="site-header__menu">
          <IconButton
            name={open ? 'close' : 'menu'}
            label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            round
          />
        </div>
      </div>
      {open && (
        <div className="mobile-nav">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="mobile-nav__link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Button variant="primary" block onClick={() => nav('/editor')}>
            Start Creating
          </Button>
        </div>
      )}
    </header>
  );
}
