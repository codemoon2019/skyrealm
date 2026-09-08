import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { GameSession } from './services/GameSession.ts';
import { LandingPage } from './site/LandingPage.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';

const GameApp = lazy(() => import('./GameApp.tsx'));

type Shell = 'site' | 'game';

function hashIsPlay(): boolean {
  return window.location.hash.replace(/^#\/?/, '') === 'play';
}

function applyShellClass(shell: Shell): void {
  const site = shell === 'site';
  document.documentElement.classList.toggle('is-site', site);
  document.documentElement.classList.toggle('is-game', !site);
  document.body.classList.toggle('is-site', site);
  document.body.classList.toggle('is-game', !site);
  const meta = document.querySelector('meta[name="viewport"]');
  if (!meta) return;
  meta.setAttribute(
    'content',
    site
      ? 'width=device-width, initial-scale=1.0, viewport-fit=cover'
      : 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
  );
}

export default function App() {
  const sessionRef = useRef<GameSession | null>(null);
  if (sessionRef.current === null) sessionRef.current = new GameSession();
  const session = sessionRef.current;
  const [save, setSave] = useState(() => structuredClone(session.data));
  const [shell, setShell] = useState<Shell>(() => {
    const next = hashIsPlay() ? 'game' : 'site';
    applyShellClass(next);
    return next;
  });

  const enterGame = useCallback(() => {
    if (!hashIsPlay()) window.location.hash = 'play';
    applyShellClass('game');
    setShell('game');
  }, []);

  useEffect(() => {
    applyShellClass(shell);
    const onHash = () => {
      const next: Shell = hashIsPlay() ? 'game' : 'site';
      applyShellClass(next);
      setShell(next);
      if (next === 'site') setSave(structuredClone(session.data));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [shell, session]);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const id = window.setTimeout(() => {
      void import('./GameApp.tsx');
    }, 1800);
    return () => window.clearTimeout(id);
  }, []);

  if (shell === 'site') {
    return (
      <div className="app-shell app-shell-site">
        <LandingPage save={save} onPlay={enterGame} />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="app-shell app-shell-load">
          <LoadingScreen progress={0} />
        </div>
      }
    >
      <GameApp session={session} />
    </Suspense>
  );
}
