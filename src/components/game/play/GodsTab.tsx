import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { DEITIES } from '@/data/game';

const GodsTab = () => (
  <div className="space-y-2.5">
    <p className="text-xs leading-relaxed text-muted-foreground">
      Боги не любят друг друга, но все ненавидят лжебога аврамистов. Чем выше благосклонность,
      тем щедрее дар и откровение.
    </p>
    {DEITIES.map((d) => (
      <div key={d.id} className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-ink">
            <Icon name={d.icon} size={17} strokeWidth={1.6} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-bold">{d.name}</h3>
            <p className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
              {d.domain}
            </p>
          </div>
          <span className="text-sm font-bold text-ink">{d.favor}</span>
        </div>
        <Progress value={d.favor} className="mt-3 h-1.5 bg-secondary" />
        <p className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Gift" size={13} className="text-ink" />
          {d.gift}
        </p>
      </div>
    ))}
  </div>
);

export default GodsTab;
