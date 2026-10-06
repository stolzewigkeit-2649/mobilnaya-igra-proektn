import Icon from '@/components/ui/icon';
import { useProfile, type SyncStatus } from '@/contexts/ProfileContext';

const META: Record<SyncStatus, { icon: string; label: string; short: string; tone: string }> = {
  synced: { icon: 'Cloud', label: 'Сохранено в аккаунте', short: 'В облаке', tone: 'text-ink' },
  syncing: { icon: 'Loader2', label: 'Синхронизация…', short: 'Синхр…', tone: 'text-muted-foreground' },
  loading: { icon: 'Loader2', label: 'Синхронизация…', short: 'Синхр…', tone: 'text-muted-foreground' },
  local: { icon: 'HardDrive', label: 'Только на этом устройстве', short: 'Локально', tone: 'text-muted-foreground' },
  error: { icon: 'CloudOff', label: 'Нет связи', short: 'Нет связи', tone: 'text-destructive' },
};

export const syncLabel = (status: SyncStatus) => META[status].label;

type SyncBadgeProps = { compact?: boolean; className?: string };

const SyncBadge = ({ compact = false, className = '' }: SyncBadgeProps) => {
  const { status } = useProfile();
  const m = META[status];
  const spin = status === 'syncing' || status === 'loading';

  return (
    <span
      title={m.label}
      aria-live="polite"
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-semibold tile-surface ${m.tone} ${className}`}
    >
      <Icon name={m.icon} size={12} className={`shrink-0 ${spin ? 'animate-spin' : ''}`} />
      <span className="truncate">{compact ? m.short : m.label}</span>
      {status === 'synced' && <Icon name="Check" size={11} className="-ml-1 shrink-0" />}
    </span>
  );
};

export default SyncBadge;