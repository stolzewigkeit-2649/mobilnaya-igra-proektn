import Icon from '@/components/ui/icon';
import SyncBadge from '@/components/game/SyncBadge';
import GoogleButton from '@/components/game/GoogleButton';
import { useProfile } from '@/contexts/ProfileContext';
import { DIFFICULTY_INFO, type Difficulty } from '@/hooks/use-game-settings';

type StoryControlsProps = {
  difficulty: Difficulty;
  hasSave: boolean;
  heroLabel: string;
  onOpenSettings: () => void;
  onStartStory: () => void;
  onResetStory: () => void;
  onGoogle?: () => void;
};

const StoryControls = ({
  difficulty,
  hasSave,
  heroLabel,
  onOpenSettings,
  onStartStory,
  onResetStory,
  onGoogle,
}: StoryControlsProps) => {
  const { signedIn, status } = useProfile();
  const diff = DIFFICULTY_INFO[difficulty];
  const where = !signedIn
    ? 'прогресс сохраняется только на этом устройстве'
    : status === 'error'
      ? 'нет связи с облаком — прогресс пока только на этом устройстве'
      : 'прогресс сохраняется в аккаунте';

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex items-center gap-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <Icon name={diff.icon} size={14} />
        Сложность: {diff.name} · очки {diff.multiplier}
      </button>

      <button
        type="button"
        onClick={onStartStory}
        className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg px-6 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-primary-foreground transition-transform btn-play-surface hover:scale-[1.01]"
      >
        <Icon name={hasSave ? 'Play' : 'Flame'} size={15} className="fill-current" />
        {hasSave ? 'Продолжить демо' : 'Начать демо'}
      </button>

      <div className="flex justify-center">
        <SyncBadge />
      </div>

      {hasSave ? (
        <button
          type="button"
          onClick={onResetStory}
          className="flex w-full items-center justify-center gap-2 text-xs text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
        >
          <Icon name="RotateCcw" size={13} />
          Сбросить прохождение и проснуться в склепе заново
        </button>
      ) : (
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Демо «Доказательство лжи»: {heroLabel} просыпается в склепе, зная о себе три вещи. Пролог и пять глав, {where}.
        </p>
      )}

      {!signedIn && onGoogle && (
        <GoogleButton
          onClick={onGoogle}
          note={hasSave ? 'Твой прогресс перенесётся в аккаунт и будет доступен на любом устройстве' : 'Прогресс будет доступен на любом устройстве'}
        />
      )}
    </div>
  );
};

export default StoryControls;
