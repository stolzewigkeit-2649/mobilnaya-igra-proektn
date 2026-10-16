import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import SceneView from '@/components/game/story/SceneView';
import ChoiceList from '@/components/game/story/ChoiceList';
import StatusBar from '@/components/game/story/StatusBar';
import EndingView from '@/components/game/story/EndingView';
import DeathOverlay from '@/components/game/story/DeathOverlay';
import CryptInvite from '@/components/game/crypt3d/CryptInvite';
import { useGameSettings } from '@/hooks/use-game-settings';

const CryptExperience = lazy(() => import('@/components/game/crypt3d/CryptExperience'));
const GraveExperience = lazy(() => import('@/components/game/crypt3d/grave/GraveExperience'));
const CellarExperience = lazy(() => import('@/components/game/crypt3d/cellar/CellarExperience'));
const VillageExperience = lazy(() => import('@/components/game/crypt3d/village/VillageExperience'));
import { CHAPTER_TITLE, SCENE_TOTAL } from '@/data/story';
import { useStory } from '@/hooks/use-story';
import { useCharacter } from '@/hooks/use-character';
import { useProfile } from '@/contexts/ProfileContext';
import SyncBadge from '@/components/game/SyncBadge';
import { DIFFICULTY_INFO, type Difficulty } from '@/hooks/use-game-settings';

type StoryGameProps = {
  difficulty: Difficulty;
  onExit: () => void;
};

const StoryGame = ({ difficulty, onExit }: StoryGameProps) => {
  const { character } = useCharacter();
  const { archetype } = useProfile();
  const heroName = archetype?.name.trim() || null;
  const story = useStory({ difficulty, faction: character.faction });
  const [confirm, setConfirm] = useState(false);
  const [in3d, setIn3d] = useState<null | 'crypt' | 'grave' | 'cellar' | 'village'>(null);
  const { settings } = useGameSettings();
  const top = useRef<HTMLDivElement>(null);

  const { state, start } = story;

  useEffect(() => {
    if (!state) start();
  }, [state, start]);

  useEffect(() => {
    top.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [story.state?.sceneId]);

  const tryExit = () => {
    if (story.state && story.state.visited.length > 1 && !story.ending) setConfirm(true);
    else onExit();
  };

  if (!story.state || !story.scene) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 scene-glow opacity-70" />
      <div className="pointer-events-none absolute inset-0 scene-grid opacity-25" />

      <header className="relative z-10 flex items-center gap-2 border-b border-border bg-card/70 px-3 py-2.5 backdrop-blur-sm sm:px-5">
        <div className="min-w-0 flex-1">
          {heroName && (
            <p className="mb-1 truncate font-display text-xs font-bold tracking-wide text-ink">
              {heroName}
            </p>
          )}
          <StatusBar state={story.state} />
        </div>
        <SyncBadge compact className="hidden shrink-0 min-[360px]:inline-flex" />
        <button
          type="button"
          onClick={tryExit}
          aria-label="Выйти в меню"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors tile-surface hover:text-foreground"
        >
          <Icon name="X" size={17} />
        </button>
      </header>

      <div ref={top} className="relative z-10 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-[680px] px-4 pb-10 pt-5 sm:px-6 sm:pt-7">
          {story.ending ? (
            <EndingView
              ending={story.ending}
              state={story.state}
              onRestart={story.restart}
              onExit={onExit}
            />
          ) : (
            <>
              <SceneView
                key={`${story.scene.id}-${story.state.note ?? ''}`}
                scene={story.scene}
                gender={character.gender}
                note={story.state.note}
              />
              <div className="mt-6">
                <ChoiceList
                  items={story.choices}
                  delay={0.2 + story.scene.text.length * 0.18 + (story.scene.banner || story.state.note ? 0.3 : 0)}
                  onPick={story.choose}
                />
              </div>
            </>
          )}

          <p className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.66rem] text-muted-foreground">
            <span>{CHAPTER_TITLE}</span>
            <span className="h-px w-5 hairline" />
            <span>
              сцена {story.sceneNumber} из {SCENE_TOTAL}
            </span>
            <span className="h-px w-5 hairline" />
            <span>{DIFFICULTY_INFO[difficulty].name}</span>
            <span className="h-px w-5 hairline" />
            <span>прогресс сохраняется сам</span>
          </p>
        </div>
      </div>

      {story.scene.id === 'p-awaken' && !story.state.flags.includes('crypt3d-done') && !in3d && (
        <CryptInvite kind="crypt" onEnter={() => setIn3d('crypt')} onText={() => story.addFlag('crypt3d-done')} />
      )}

      {story.scene.id === 'p-first-soul' && !story.state.flags.includes('grave3d-done') && !in3d && (
        <CryptInvite kind="grave" onEnter={() => setIn3d('grave')} onText={() => story.addFlag('grave3d-done')} />
      )}

      {['c1-village', 'c1-investigate'].includes(story.scene.id) && !story.state.flags.includes('village3d-done') && !in3d && (
        <CryptInvite kind="village" onEnter={() => setIn3d('village')} onText={() => story.addFlag('village3d-done')} />
      )}

      {story.scene.id === 'c1-chapel' && !story.state.flags.includes('cellar3d-done') && !in3d && (
        <CryptInvite kind="cellar" onEnter={() => setIn3d('cellar')} onText={() => story.addFlag('cellar3d-done')} />
      )}

      {in3d && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black font-display italic text-white/70">
              Загружаю 3D…
            </div>
          }
        >
          {in3d === 'crypt' ? (
            <CryptExperience
              volume={(settings.master / 100) * 0.9}
              onExit={() => setIn3d(null)}
              onComplete={() => {
                setIn3d(null);
                story.jumpTo('p-first-soul', { flags: ['crypt3d-done'], skipped: ['p-hekate'] });
              }}
            />
          ) : in3d === 'village' ? (
            <VillageExperience
              withTimon={story.state.flags.includes('timon-raised')}
              volume={(settings.master / 100) * 0.9}
              onExit={() => setIn3d(null)}
              onComplete={(r) => {
                if (!r || !r.done) {
                  setIn3d(null);
                  story.addFlag('village3d-done');
                  return;
                }
                story.jumpTo('c1-chapel', {
                  flags: ['village3d-done', ...r.flags],
                  sanity: r.sanity,
                  health: r.health,
                  evidence: r.evidence,
                  rep: r.rep,
                  skipped: ['c1-village', 'c1-investigate'],
                });
                setIn3d('cellar');
              }}
            />
          ) : in3d === 'cellar' ? (
            <CellarExperience
              withTimon={story.state.flags.includes('timon-raised')}
              volume={(settings.master / 100) * 0.9}
              onExit={() => setIn3d(null)}
              onComplete={(r) => {
                setIn3d(null);
                if (!r) {
                  story.addFlag('cellar3d-done');
                  return;
                }
                story.jumpTo('c1-crossroads', {
                  flags: ['cellar3d-done', ...r.flags],
                  sanity: r.sanity,
                  rep: r.rep ? { exiles: r.rep, bones: r.rep } : undefined,
                  skipped: ['c1-captive'],
                });
              }}
            />
          ) : (
            <GraveExperience
              volume={(settings.master / 100) * 0.9}
              onExit={() => setIn3d(null)}
              onComplete={(r) => {
                if (!r) {
                  setIn3d(null);
                  story.addFlag('grave3d-done');
                  return;
                }
                story.jumpTo('c1-village', {
                  flags: ['grave3d-done', ...r.flags],
                  sanity: r.sanity,
                  skipped: ['p-soul-speaks', 'p-sariel'],
                });
                setIn3d('village');
              }}
            />
          )}
        </Suspense>
      )}

      {story.state.event === 'death' && (
        <DeathOverlay
          deaths={story.state.deaths}
          sanity={story.state.sanity}
          onRise={story.dismissEvent}
        />
      )}

      {confirm && (
        <div className="absolute inset-0 z-20 flex animate-fade-in items-center justify-center bg-background/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-scale-in rounded-lg p-5 panel-surface">
            <h3 className="font-display text-lg font-extrabold">Выйти из главы?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Прогресс сохранён: вернёшься на эту же сцену. Мёртвые подождут.
            </p>
            <div className="mt-4 flex gap-2.5">
              <button
                type="button"
                onClick={onExit}
                className="h-11 flex-1 rounded-lg font-display text-sm font-extrabold uppercase tracking-[0.14em] text-primary-foreground btn-play-surface"
              >
                Выйти
              </button>
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="h-11 flex-1 rounded-lg text-sm font-bold text-muted-foreground transition-colors tile-surface hover:text-foreground"
              >
                Остаться
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryGame;