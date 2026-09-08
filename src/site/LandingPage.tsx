import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BRAND } from '../brand.ts';
import { GuardianId, WorldId } from '../types/game.ts';
import type { GuardianId as Gid, SaveGame, WorldId as Wid } from '../types/game.ts';
import { GUARDIAN_LIST, GUARDIAN_META } from '../game/content/guardians.ts';
import { QUEST_DEFS } from '../game/content/quests.ts';
import { WORLDS } from '../game/content/worlds.ts';
import { BrandMark } from '../components/BrandMark.tsx';
import { PortraitCanvas } from '../components/PortraitCanvas.tsx';
import { drawGuardianSprite } from '../assets/drawEntity.ts';
import { HeroParty } from './HeroParty.tsx';
import { HeroSky } from './HeroSky.tsx';
import { LandingNav } from './LandingNav.tsx';
import { PromoFrame, SHOW_WORLDS, WorldThumb } from './PromoFrame.tsx';
import { web3UiOn } from '../web3/flags.ts';
import './landing.css';

interface Props {
  save: SaveGame;
  onPlay: () => void;
}

const FEATURES = [
  { title: 'GUARDIANS', body: 'Choose a sky-hero and raise them through fifty levels of flight.' },
  { title: 'AETHERLINGS', body: 'Bond two companions. They hunt beside you and carry the elements.' },
  { title: 'QUESTS', body: 'Timed missions. Come home with coins, crystals, essence, and the chance of an egg.' },
  { title: 'BOSS RAIDS', body: 'Spend one Boss Energy. Ninety seconds. Trophies if you endure.' },
  { title: 'EGGS', body: 'Hatch the sky’s gifts. Duplicates become essence for evolutions.' },
  { title: 'TRAINING', body: 'Practice the skies with no spoils — only skill.' },
  { title: 'ACHIEVEMENTS', body: 'Write a legend. Flags for first flight, raids, and a full field guide.' },
  { title: 'INVENTORY', body: 'Bank coins, crystals, shards, and eggs in your hangar.' },
] as const;

const STEPS = [
  { n: '01', title: 'CHOOSE YOUR GUARDIAN', body: 'Begin with Aurelia of the dawn. Storms, shadows, and twilight wait for those who fly far.' },
  { n: '02', title: 'BOND YOUR AETHERLINGS', body: 'Two companions share your fire. Equip them. They shoot on their own.' },
  { n: '03', title: 'FLY THE AETHER', body: 'Joystick on a phone, or WASD. Auto-fire. E spends special energy. P pauses the wind.' },
  { n: '04', title: 'RETURN WITH SPOILS', body: 'Endless skies drop coins and eggs. Quests pay on time. Raids mint trophies.' },
] as const;

const SPOILS = [
  { title: 'COINS', how: 'Bank them from endless runs and claimed quests.' },
  { title: 'CRYSTALS', how: 'Rarer drops from flights and mission boards.' },
  { title: 'EGGS', how: 'Find them in the sky, then hatch new Aetherlings.' },
  { title: 'ESSENCE', how: 'Duplicates and dissolves feed evolutions.' },
  { title: 'TROPHIES', how: 'Raid a boss for ninety seconds of glory.' },
  { title: 'BOSS ENERGY', how: 'One charge opens a raid gate. Spend it wisely.' },
] as const;

const WORLD_TALES: Record<Wid, string> = {
  [WorldId.MEADOWS]: 'Wildflowers hide spore swarms. Nature is not gentle.',
  [WorldId.CRYSTAL_FOREST]: 'Glass boughs and mage-light. Arcane shots bounce.',
  [WorldId.EMBER_CANYON]: 'Hot wind and bombers. Fire answers fire.',
  [WorldId.FROZEN_SKIES]: 'Ice sheets crack. Water foes slow the unwary.',
  [WorldId.SHADOW_REALM]: 'Night-bats and bone wisps hunt in the dark.',
  [WorldId.STORM_KINGDOM]: 'Thunder roads. Light and steel share the sky.',
  [WorldId.CELESTIAL_RUINS]: 'Old temples. Elites guard the loot crates.',
  [WorldId.VOID_FRONTIER]: 'The edge of the map. Mini-bosses wait in the black.',
};

export function LandingPage({ save, onPlay }: Props) {
  const [spot, setSpot] = useState<Gid>(save.equippedGuardian || GuardianId.AURELIA);
  const [peek, setPeek] = useState<Wid>(WorldId.MEADOWS);
  const hero = GUARDIAN_META[spot];
  const world = WORLDS[peek];
  const hangar =
    save.profile.coins > 0 || save.settings.highScore > 0
      ? `Your hangar already holds ${save.profile.coins.toLocaleString()} coins and a high score of ${save.settings.highScore.toLocaleString()}.`
      : '';

  return (
    <div className="lp" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            name: BRAND.name,
            alternateName: BRAND.subtitle,
            description: BRAND.description,
            genre: ['Action', 'Role-playing', 'Shoot em up'],
            gamePlatform: 'Web Browser',
            applicationCategory: 'Game',
          }),
        }}
      />
      <a className="lp-skip" href="#lp-main">
        Skip to content
      </a>
      <LandingNav onPlay={onPlay} />

      <section className="lp-hero">
        <HeroSky />
        <div className="lp-hero-stage">
          <div className="lp-hero-heading">
            <p className="lp-kicker">{BRAND.subtitle}</p>
            <h1 className="lp-logo-word">{BRAND.name}</h1>
          </div>
          <div className="lp-hero-copy">
            <p className="lp-lead">{web3UiOn() ? BRAND.web3HeroLine : BRAND.heroLine}</p>
            <p className="lp-hero-tale">
              {hero.name}, {hero.title.toLowerCase()}. {hero.blurb}.
            </p>
            <div className="lp-hero-actions">
              <button type="button" className="lp-btn lp-btn-gold lp-btn-xl" onClick={onPlay}>
                PLAY NOW
              </button>
              <a className="lp-btn lp-btn-ghost" href="#world">
                EXPLORE THE AETHER
              </a>
            </div>
            <p className="lp-hero-hint">JOYSTICK / WASD · AUTO-FIRE · E SPECIAL</p>
            <p className="lp-meta">
              <span>HIGH {save.settings.highScore.toLocaleString()}</span>
              <span>
                {hero.name} LV {save.guardians[spot]?.level ?? 1}
              </span>
              <span>WEB GAME</span>
              {web3UiOn() && <span>PLAY · COLLECT · OWN</span>}
            </p>
            {web3UiOn() && <p className="lp-copy">Your wallet lets you own this collectible.</p>}
          </div>
          <HeroParty save={save} guardianId={spot} />
        </div>
      </section>

      <main id="lp-main">
        <Reveal>
          <section className="lp-section lp-intro" id="intro">
            <div className="lp-intro-copy">
              <p className="lp-kicker">THE REALM</p>
              <h2>ONCE ABOVE THE CLOUDS</h2>
              <p className="lp-copy">{BRAND.welcome}</p>
              <ul className="lp-facts">
                <li>Two Aetherling slots fly beside you</li>
                <li>Eight biomes, from meadows to the Void Frontier</li>
                <li>Raids spend Boss Energy in a ninety-second fight</li>
              </ul>
            </div>
            <PromoFrame
              className="lp-intro-art"
              world={peek}
              guardian={spot}
              caption={world.name}
            />
          </section>
        </Reveal>

        <Reveal>
          <section className="lp-section" id="guardians">
            <p className="lp-kicker">HEROES OF THE WIND</p>
            <h2>MEET THE GUARDIANS</h2>
            <p className="lp-copy">Choose a champion. The sky above changes with them.</p>
            <div className="lp-guardian-row">
              {GUARDIAN_LIST.map((id) => {
                const def = GUARDIAN_META[id];
                const own = save.guardians[id];
                return (
                  <button
                    key={id}
                    type="button"
                    className={`lp-gcard${spot === id ? ' is-on' : ''}`}
                    onClick={() => setSpot(id)}
                  >
                    <PortraitCanvas
                      size={120}
                      offsetY={0}
                      draw={(ctx) => drawGuardianSprite(ctx, id, 104, 'portrait')}
                    />
                    <p className="lp-gcard-rare">{def.rarity}</p>
                    <h3>{def.name}</h3>
                    <p className="lp-gcard-title">{def.title}</p>
                    <p className="lp-gcard-lv">LV {own?.level ?? 1}</p>
                    <p className="lp-copy">{def.blurb}</p>
                    <p className="lp-gcard-unlock">{own?.unlocked ? 'READY' : def.unlock}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="lp-section" id="rewards">
            <p className="lp-kicker">SPOILS OF THE SKY</p>
            <h2>TREASURES OF THE AETHER</h2>
            <p className="lp-copy">
              Fly, finish quests, and raid. The sky pays in coins, crystals, eggs, essence, trophies, and Boss Energy — treasure for your hangar.
            </p>
            {hangar && <p className="lp-hangar-hold">{hangar}</p>}
            <div className="lp-spoils">
              {SPOILS.map((item) => (
                <article key={item.title} className="lp-spoil">
                  <h3>{item.title}</h3>
                  <p>{item.how}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="lp-section" id="features">
            <p className="lp-kicker">THE CRAFT</p>
            <h2>YOUR JOURNEY AWAITS</h2>
            <div className="lp-features">
              {FEATURES.map((f) => (
                <article key={f.title} className="lp-fcard">
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
              {web3UiOn() && (
                <article className="lp-fcard">
                  <h3>COLLECTION</h3>
                  <p>Your wallet lets you own this collectible.</p>
                </article>
              )}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="lp-section lp-play" id="gameplay">
            <p className="lp-kicker">IN THE SKY</p>
            <h2>ENTER THE SKYREALM</h2>
            <div className="lp-play-grid">
              <PromoFrame
                className="lp-play-main"
                world={peek}
                guardian={spot}
                size={150}
                caption={world.name}
              />
              <PromoFrame world={WorldId.FROZEN_SKIES} guardian={GuardianId.ELARA} size={110} caption="Frozen Skies" />
              <PromoFrame world={WorldId.SHADOW_REALM} guardian={GuardianId.NYXARA} size={110} caption="Shadow Realm" />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="lp-section lp-split" id="quests">
            <div>
              <p className="lp-kicker">MISSIONS</p>
              <h2>FACE THE UNKNOWN</h2>
              <h3>QUEST BOARD</h3>
              <p className="lp-copy">Timed flights. Claim coins, crystals, essence, and a chance at an egg.</p>
              <ul className="lp-list">
                {QUEST_DEFS.map((q) => (
                  <li key={q.id}>
                    {q.name}
                    <span>
                      {q.minutes} min · {q.coins} coins · {q.crystals} crystals · {q.essence} essence
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>BOSS RAIDS</h3>
              <p className="lp-copy">One Boss Energy. Ninety seconds. Trophies if you last.</p>
              <ul className="lp-list">
                <li>IRON HYDRA<span>Meadows · Nature</span></li>
                <li>EMBER QUEEN<span>Ember Canyon · Fire</span></li>
                <li>FROST TITAN<span>Frozen Skies · Water</span></li>
                <li>AETHER WYRM<span>Void Frontier · Arcane</span></li>
              </ul>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="lp-section" id="world">
            <p className="lp-kicker">EIGHT BIOMES</p>
            <h2>THE AETHER AWAITS</h2>
            <p className="lp-copy lp-copy-wide">{BRAND.lore}</p>
            <p className="lp-world-tale">
              <strong>{world.name}</strong> · {WORLD_TALES[peek]}
            </p>
            <div className="lp-worlds">
              {SHOW_WORLDS.map((id) => (
                <WorldThumb key={id} world={id} selected={peek === id} onSelect={() => setPeek(id)} />
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="lp-section" id="how-to-play">
            <p className="lp-kicker">BEGIN</p>
            <h2>HOW TO PLAY</h2>
            <div className="lp-steps">
              {STEPS.map((s) => (
                <article key={s.n} className="lp-step">
                  <span>{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <section className="lp-finale">
          <HeroSky />
          <p className="lp-kicker">THE GATE OPENS</p>
          <h2>THE WIND KNOWS YOUR NAME</h2>
          <p className="lp-lead">Take flight. Bring back spoils. The Aether is waiting.</p>
          <button type="button" className="lp-btn lp-btn-gold lp-btn-xl" onClick={onPlay}>
            ENTER SKYREALM
          </button>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <BrandMark size={48} />
          <strong>{BRAND.name}</strong>
          <span>{BRAND.subtitle}</span>
        </div>
        <nav aria-label="Footer">
          <button type="button" className="lp-text-link" onClick={onPlay}>
            PLAY
          </button>
          <a href="#guardians">GUARDIANS</a>
          <a href="#rewards">TREASURES</a>
          <a href="#how-to-play">HOW TO PLAY</a>
        </nav>
        <p>© {BRAND.name}</p>
      </footer>
    </div>
  );
}

function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="lp-reveal">
      {children}
    </div>
  );
}
