import GameDialog from '@/components/game/GameDialog';
import ScoresPanel from '@/components/game/ScoresPanel';
import RulesPanel from '@/components/game/RulesPanel';
import SettingsPanel from '@/components/game/SettingsPanel';
import AwardsPanel from '@/components/game/AwardsPanel';
import LorePanel from '@/components/game/lore/LorePanel';
import type { useGameSettings } from '@/hooks/use-game-settings';

type MenuDialogsProps = {
  screen: string | null;
  onClose: () => void;
  game: ReturnType<typeof useGameSettings>;
};

const MenuDialogs = ({ screen, onClose, game }: MenuDialogsProps) => (
  <>
    <GameDialog
      open={screen === 'scores'}
      onOpenChange={onClose}
      icon="Trophy"
      title="Таблица рекордов"
      description="Кто дальше прошёл по следу заговора аврамистов."
    >
      <ScoresPanel />
    </GameDialog>

    <GameDialog
      open={screen === 'rules'}
      onOpenChange={onClose}
      icon="ScrollText"
      title="Правила и как играть"
      description="Управление, дознание, смерть и путь к Шпилю Лжебога."
    >
      <RulesPanel />
    </GameDialog>

    <GameDialog
      open={screen === 'lore'}
      onOpenChange={onClose}
      icon="BookOpen"
      title="Мир Requiem"
      description="Пантеон, хроника аврамистов и четыре силы, что делят землю за стенами Шпиля."
    >
      <LorePanel />
    </GameDialog>

    <GameDialog
      open={screen === 'settings'}
      onOpenChange={onClose}
      icon="Settings"
      title="Настройки"
      description="Звук, сложность и мелочи. Всё сохраняется на этом устройстве."
    >
      <SettingsPanel settings={game.settings} update={game.update} reset={game.reset} />
    </GameDialog>

    <GameDialog
      open={screen === 'awards'}
      onOpenChange={onClose}
      icon="Star"
      title="Достижения и награды"
      description="Дары, титулы и скины за настойчивость в поиске правды."
    >
      <AwardsPanel />
    </GameDialog>
  </>
);

export default MenuDialogs;
