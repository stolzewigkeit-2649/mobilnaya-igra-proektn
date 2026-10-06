import { useState } from 'react';
import HeroCard, { type MenuKey } from '@/components/game/HeroCard';
import GameDialog from '@/components/game/GameDialog';
import PlayPanel from '@/components/game/PlayPanel';
import MenuDialogs from '@/components/game/MenuDialogs';
import AuthPanel from '@/components/game/AuthPanel';
import CharacterCreator from '@/components/game/character/CharacterCreator';
import StoryGame from '@/components/game/story/StoryGame';
import ArchetypeSelect from '@/components/game/archetype/ArchetypeSelect';
import ArchetypeEditor from '@/components/game/archetype/ArchetypeEditor';
import { useGameSettings } from '@/hooks/use-game-settings';
import { useAuth } from '@/hooks/use-auth';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { resolveChoice } from '@/data/archetypes';

type ScreenKey = MenuKey | 'play' | 'auth' | 'character' | 'select' | 'editor' | null;

type Auth = ReturnType<typeof useAuth>;

const IndexScreen = ({ auth }: { auth: Auth }) => {
  const [screen, setScreen] = useState<ScreenKey>(null);
  const [back, setBack] = useState<ScreenKey>(null);
  const [story, setStory] = useState(false);
  const game = useGameSettings();
  const profile = useProfile();
  const hasSave = profile.story !== null;
  const hero = profile.archetype ? resolveChoice(profile.archetype) : null;

  const close = () => setScreen(null);

  const go = (next: ScreenKey) => {
    setBack(screen);
    setScreen(next);
  };

  const goBack = (fallback: ScreenKey) => {
    setScreen(back ?? fallback);
    setBack(null);
  };

  const menuScreen = auth.player ? 'play' : null;

  const openStory = () => {
    setScreen(null);
    setStory(true);
  };

  return (
    <main className="relative flex h-full w-full items-center justify-center overflow-hidden bg-background p-3 sm:p-6">
      <div className="pointer-events-none absolute inset-0 scene-glow" />
      <div className="pointer-events-none absolute inset-0 scene-grid" />

      <HeroCard
        onPlay={() => setScreen(auth.player ? 'play' : 'auth')}
        onMenu={(key) => setScreen(key)}
        onAuth={() => setScreen('auth')}
        playerName={auth.player?.nickname ?? null}
        heroFace={
          hero
            ? {
                src: hero.look.face,
                filter: hero.variant.filter,
                glow: hero.magic,
                label: profile.archetype?.name.trim() || hero.archetype.name,
              }
            : null
        }
        onHero={() => go('editor')}
        chapter="Глава I. Пепел храма"
        weight="2.4 ГБ"
      />

      <GameDialog
        open={screen === 'play'}
        onOpenChange={close}
        icon="Play"
        title="Выход из скита"
        description="Выбери вид некроманта, осмотри открытый мир и загляни к богам — дары решают всё."
      >
        <PlayPanel
          difficulty={game.settings.difficulty}
          hasSave={hasSave}
          onOpenSettings={() => setScreen('settings')}
          onOpenCharacter={() => go('character')}
          onOpenSelect={() => go('select')}
          onOpenEditor={() => go('editor')}
          onStartStory={openStory}
          onResetStory={() => profile.setStory(null)}
        />
      </GameDialog>

      <GameDialog
        open={screen === 'character'}
        onOpenChange={() => goBack(null)}
        icon="UserRoundCog"
        title="Конструктор героя"
        description="Собери облик некроманта: плоть, шрамы, облачение фракции и ауру порчи."
      >
        <CharacterCreator />
      </GameDialog>

      <MenuDialogs screen={screen} onClose={close} game={game} />

      <GameDialog
        open={screen === 'auth'}
        onOpenChange={close}
        icon="KeyRound"
        title="Вход в обитель"
        description="Выбери привычный сервис. Пароль вводится только у него — игра личных данных не получает."
      >
        <AuthPanel
          player={auth.player}
          providers={auth.providers}
          loading={auth.loading}
          pending={auth.pending}
          error={auth.error}
          onLogin={auth.login}
          onLogout={async () => {
            await profile.flushNow();
            await auth.logout();
          }}
        />
      </GameDialog>

      {screen === 'select' && (
        <ArchetypeSelect onClose={() => goBack(menuScreen)} onChosen={() => setScreen('editor')} />
      )}

      {screen === 'editor' && (
        <ArchetypeEditor
          onClose={() => goBack(menuScreen)}
          onDone={() => {
            setBack(null);
            setScreen(menuScreen);
          }}
          onFineTune={() => {
            setBack('editor');
            setScreen('character');
          }}
          onChangeArchetype={() => setScreen('select')}
        />
      )}

      {story && <StoryGame difficulty={game.settings.difficulty} onExit={() => setStory(false)} />}
    </main>
  );
};

const Index = () => {
  const auth = useAuth();
  return (
    <ProfileProvider player={auth.player}>
      <IndexScreen auth={auth} />
    </ProfileProvider>
  );
};

export default Index;