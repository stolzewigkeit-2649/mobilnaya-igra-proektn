import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import SceneView from '@/components/game/story/SceneView';
import ChoiceList from '@/components/game/story/ChoiceList';
import StatusBar from '@/components/game/story/StatusBar';
import EndingView from '@/components/game/story/EndingView';
import { CHAPTER_TITLE } from '@/data/story';
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
              <SceneView scene={story.scene} gender={character.gender} />
              <div className="mt-6">
                <ChoiceList
                  items={story.choices}
                  delay={0.15 + story.scene.text.length * 0.22}
                  onPick={story.choose}
                />
              </div>
            </>
          )}

          <p className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.66rem] text-muted-foreground">
            <span>{CHAPTER_TITLE}</span>
            <span className="h-px w-5 hairline" />
            <span>сцена {story.sceneNumber}</span>
            <span className="h-px w-5 hairline" />
            <span>{DIFFICULTY_INFO[difficulty].name}</span>
            <span className="h-px w-5 hairline" />
            <span>прогресс сохраняется сам</span>
          </p>
        </div>
      </div>

      {confirm && (
        <div className="absolute inset-0 z-20 flex animate-fade-in items-center justify-center bg-background/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-scale-in rounded-lg p-5 panel-surface">
            <h3 className="font-display text-lg font-extrabold">Выйти из главы?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Прогресс сохранён: вернёшься на эту же сцену. Пепел подождёт.
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