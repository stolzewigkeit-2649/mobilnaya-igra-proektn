import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { ACHIEVEMENTS } from '@/data/game';

const AwardsPanel = () => {
  const done = ACHIEVEMENTS.filter((a) => a.progress >= a.total).length;
  const percent = Math.round((done / ACHIEVEMENTS.length) * 100);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Открыто наград
          </span>
          <span className="font-display text-lg font-extrabold text-ink">
            {done} / {ACHIEVEMENTS.length}
          </span>
        </div>
        <Progress value={percent} className="mt-3 h-2 bg-secondary" />
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {ACHIEVEMENTS.map((a) => {
          const complete = a.progress >= a.total;
          return (
            <div
              key={a.id}
              className={`rounded-xl border p-4 transition-colors ${
                complete
                  ? 'border-ink/40 bg-accent/60'
                  : 'border-border bg-card/60 hover:border-ink/25'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    complete ? 'bg-primary text-primary-foreground' : 'bg-secondary text-ink'
                  }`}
                >
                  <Icon name={a.icon} size={17} strokeWidth={1.6} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center gap-1.5 font-display text-sm font-bold">
                    {a.name}
                    {complete && <Icon name="Check" size={13} className="text-ink" />}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.desc}</p>
                </div>
              </div>

              {a.total > 1 && (
                <div className="mt-3 flex items-center gap-2.5">
                  <Progress
                    value={(a.progress / a.total) * 100}
                    className="h-1.5 flex-1 bg-secondary"
                  />
                  <span className="text-[0.7rem] tabular-nums text-muted-foreground">
                    {a.progress}/{a.total}
                  </span>
                </div>
              )}

              <p className="mt-3 flex items-center gap-2 text-[0.7rem] text-muted-foreground">
                <Icon name="Gift" size={12} className="text-ink" />
                {a.reward}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AwardsPanel;
