import { useState } from 'react';
import HeroCard, { type MenuKey } from '@/components/game/HeroCard';
import GameDialog from '@/components/game/GameDialog';
import PlayPanel from '@/components/game/PlayPanel';
import ScoresPanel from '@/components/game/ScoresPanel';
import RulesPanel from '@/components/game/RulesPanel';
import SettingsPanel from '@/components/game/SettingsPanel';
import AwardsPanel from '@/components/game/AwardsPanel';
import { useGameSettings } from '@/hooks/use-game-settings';

type ScreenKey = MenuKey | 'play' | null;

const Index = () => {
  const [screen, setScreen] = useState<ScreenKey>(null);
  const { settings, update, reset } = useGameSettings();

  const close = () => setScreen(null);

  return (
    <main className="relative flex h-full w-full items-center justify-center overflow-hidden bg-background p-3 sm:p-6">
      <div className="pointer-events-none absolute inset-0 scene-glow" />
      <div className="pointer-events-none absolute inset-0 scene-grid" />

      <HeroCard
        onPlay={() => setScreen('play')}
        onMenu={(key) => setScreen(key)}
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
          onOpenSettings={() => setScreen('settings')}
        />
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
    </main>
  );
};

export default Index;
