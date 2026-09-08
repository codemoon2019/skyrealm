import { useEffect, useState } from 'react';
import { BRAND } from '../brand.ts';
import { BrandMark } from '../components/BrandMark.tsx';

interface Props {
  onPlay: () => void;
}

const LINKS = [
  { href: '#guardians', label: 'GUARDIANS' },
  { href: '#rewards', label: 'TREASURES' },
  { href: '#world', label: 'WORLD' },
  { href: '#how-to-play', label: 'HOW TO PLAY' },
] as const;

export function LandingNav({ onPlay }: Props) {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`lp-nav${compact ? ' is-compact' : ''}`}>
      <div className="lp-nav-inner">
        <a className="lp-nav-brand" href="#top">
          <BrandMark size={compact ? 32 : 40} />
          <span>{BRAND.name}</span>
        </a>
        <nav className="lp-nav-links" aria-label="Landing">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <button type="button" className="lp-btn lp-btn-gold lp-nav-play" onClick={onPlay}>
          PLAY NOW
        </button>
        <button
          type="button"
          className="lp-nav-burger"
          aria-expanded={open}
          aria-controls="lp-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'CLOSE' : 'MENU'}
        </button>
        {open && (
          <div id="lp-drawer" className="lp-drawer">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <button
              type="button"
              className="lp-btn lp-btn-gold lp-nav-play"
              onClick={() => {
                setOpen(false);
                onPlay();
              }}
            >
              PLAY NOW
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
