import { useState } from 'react';
import HeroCard, { type MenuKey } from '@/components/game/HeroCard';
import GameDialog from '@/components/game/GameDialog';
import PlayPanel from '@/components/game/PlayPanel';
import ScoresPanel from '@/components/game/ScoresPanel';
import RulesPanel from '@/components/game/RulesPanel';
import SettingsPanel from '@/components/game/SettingsPanel';
import AwardsPanel from '@/components/game/AwardsPanel';
import LorePanel from '@/components/game/lore/LorePanel';
import AuthPanel from '@/components/game/AuthPanel';
import CharacterCreator from '@/components/game/character/CharacterCreator';
import StoryGame from '@/components/game/story/StoryGame';
import { useGameSettings } from '@/hooks/use-game-settings';
import { useAuth } from '@/hooks/use-auth';
import { clearStorySave, readStorySave } from '@/hooks/use-story';

type ScreenKey = MenuKey | 'play' | 'auth' | 'character' | null;

const Index = () => {
  const [screen, setScreen] = useState<ScreenKey>(null);
  const [story, setStory] = useState(false);
  const [hasSave, setHasSave] = useState(() => readStorySave() !== null);
  const { settings, update, reset } = useGameSettings();
  const auth = useAuth();

  const close = () => setScreen(null);

  const openStory = () => {
    setScreen(null);
    setStory(true);
  };

  const closeStory = () => {
    setStory(false);
    setHasSave(readStorySave() !== null);
  };

  const resetStory = () => {
    clearStorySave();
    setHasSave(false);
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
          difficulty={settings.difficulty}
          hasSave={hasSave}
          onOpenSettings={() => setScreen('settings')}
          onOpenCharacter={() => setScreen('character')}
          onStartStory={openStory}
          onResetStory={resetStory}
        />
      </GameDialog>

      <GameDialog
        open={screen === 'character'}
        onOpenChange={close}
        icon="UserRoundCog"
        title="Конструктор героя"
        description="Собери облик некроманта: плоть, шрамы, облачение фракции и ауру порчи."
      >
        <CharacterCreator />
      </GameDialog>

      <GameDialog
        open={screen === 'scores'}
        onOpenChange={close}
        icon="Trophy"
        title="Таблица рекордов"
        description="Кто дальше прошёл по следу заговора аврамистов."
      >
        <ScoresPanel />
      </GameDialog>

      <GameDialog
        open={screen === 'rules'}
        onOpenChange={close}
        icon="ScrollText"
        title="Правила и как играть"
        description="Управление, дознание, смерть и путь к Шпилю Лжебога."
      >
        <RulesPanel />
      </GameDialog>

      <GameDialog
        open={screen === 'lore'}
        onOpenChange={close}
        icon="BookOpen"
        title="Мир Requiem"
        description="Пантеон, хроника аврамистов и четыре силы, что делят землю за стенами Шпиля."
      >
        <LorePanel />
      </GameDialog>

      <GameDialog
        open={screen === 'settings'}
        onOpenChange={close}
        icon="Settings"
        title="Настройки"
        description="Звук, сложность и мелочи. Всё сохраняется на этом устройстве."
      >
        <SettingsPanel settings={settings} update={update} reset={reset} />
      </GameDialog>

      <GameDialog
        open={screen === 'awards'}
        onOpenChange={close}
        icon="Star"
        title="Достижения и награды"
        description="Дары, титулы и скины за настойчивость в поиске правды."
      >
        <AwardsPanel />
      </GameDialog>

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
          onLogout={auth.logout}
        />
      </GameDialog>

      {story && <StoryGame difficulty={settings.difficulty} onExit={closeStory} />}
    </main>
  );
};

export default Index;