import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { REGIONS } from '@/data/game';

const WorldTab = () => (
  <div className="space-y-2.5">
    {REGIONS.map((r) => (
      <div
        key={r.id}
        className={`rounded-xl border border-border p-4 transition-colors ${
          r.status === 'locked' ? 'opacity-60' : 'hover:border-ink/40'
        } bg-card/60`}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-ink">
            <Icon name={r.status === 'locked' ? 'Lock' : r.icon} size={17} strokeWidth={1.6} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h3 className="font-display text-base font-bold">{r.name}</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {r.chapter}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={r.progress} className="h-1.5 flex-1 bg-secondary" />
              <span className="text-[0.7rem] text-ink">{r.progress}%</span>
            </div>
            <p className="mt-2 text-[0.7rem] text-muted-foreground">{r.clue}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default WorldTab;
