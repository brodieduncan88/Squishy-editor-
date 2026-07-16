import { useEffect, useState } from 'react';
import { sound } from './sound';
import './sound.css';

/* Speaker toggle. Icon reflects state; announces via aria-pressed. */
export default function SoundToggle({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [on, setOn] = useState(sound.enabled);
  useEffect(() => sound.subscribe(setOn), []);
  return (
    <button
      className={`sound-toggle sound-toggle--${tone} ${on ? 'is-on' : ''}`}
      aria-pressed={on}
      aria-label={on ? 'Turn sounds off' : 'Turn sounds on'}
      title={on ? 'Sound on' : 'Sound off'}
      onClick={() => sound.toggle()}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9v6h4l5 4V5L8 9H4z" />
        {on ? (
          <>
            <path d="M16 9a3 3 0 0 1 0 6" />
            <path d="M18.5 7a6 6 0 0 1 0 10" />
          </>
        ) : (
          <path d="M22 9l-5 5M17 9l5 5" />
        )}
      </svg>
    </button>
  );
}
