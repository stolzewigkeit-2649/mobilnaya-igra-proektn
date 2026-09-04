import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import type { Player, Provider } from '@/hooks/use-auth';

type AuthPanelProps = {
  player: Player | null;
  providers: Provider[];
  loading: boolean;
  pending: string | null;
  error: string | null;
  onLogin: (id: string) => void;
  onLogout: () => void;
};

const PRIVACY = [
  'Пароль вводится только на сайте самого сервиса — игра его не видит.',
  'Ни почта, ни имя, ни телефон в игру не передаются и нигде не сохраняются.',
  'В базе живёт лишь безликий номер героя и его игровой псевдоним.',
];

const AuthPanel = ({
  player,
  providers,
  loading,
  pending,
  error,
  onLogin,
  onLogout,
}: AuthPanelProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Icon name="Loader" size={16} className="animate-spin" />
        Открываем врата…
      </div>
    );
  }

  if (player) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-secondary/60 p-4">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Ты вошёл как
          </p>
          <p className="mt-1.5 font-display text-xl font-extrabold text-ink">{player.nickname}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Через {player.provider} · прогресс привязан к этому герою
          </p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Псевдоним выдан обителью автоматически: твоё настоящее имя из сервиса игре неизвестно.
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon name="LogOut" size={16} />
          Выйти
        </button>
      </div>
    );
  }

  const ready = providers.filter((p) => p.ready);
  const soon = providers.filter((p) => !p.ready);

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
          {error}
        </p>
      )}

      {ready.length > 0 && (
        <div className="grid gap-2.5">
          {ready.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={pending !== null}
              onClick={() => onLogin(p.id)}
              className="flex h-12 items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 text-sm font-semibold text-foreground transition-colors hover:border-ink/60 disabled:opacity-50"
            >
              <Icon
                name={pending === p.id ? 'Loader' : p.icon}
                size={18}
                className={pending === p.id ? 'animate-spin text-ink' : 'text-ink'}
              />
              Войти через {p.label}
            </button>
          ))}
        </div>
      )}

      {soon.length > 0 && (
        <div>
          <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Скоро откроются
          </p>
          <div className="grid grid-cols-2 gap-2">
            {soon.map((p) => (
              <div
                key={p.id}
                className="flex h-11 items-center gap-2 rounded-xl border border-dashed border-border px-3 text-xs text-muted-foreground"
              >
                <Icon name={p.icon} size={15} />
                <span className="truncate">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ul className="space-y-2 rounded-xl border border-border bg-secondary/40 p-4">
        {PRIVACY.map((line) => (
          <li key={line} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
            <Icon name="ShieldCheck" size={14} className="mt-0.5 shrink-0 text-ink" />
            {line}
          </li>
        ))}
        <li>
          <Link
            to="/privacy"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink underline-offset-4 hover:underline"
          >
            Полная политика конфиденциальности
            <Icon name="ArrowRight" size={13} />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AuthPanel;