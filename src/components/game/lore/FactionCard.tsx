import Icon from '@/components/ui/icon';
import type { LoreFaction } from '@/data/lore-factions';

type Block = { icon: string; label: string; text: string };

const FactionCard = ({ f, delay }: { f: LoreFaction; delay: number }) => {
  const blocks: Block[] = [
    { icon: 'Sparkles', label: 'Во что верят', text: f.belief },
    { icon: 'Hammer', label: 'Чем занимаются', text: f.doing },
    { icon: 'UserRoundSearch', label: 'Отношение к тебе', text: f.toHero },
  ];

  return (
    <article
      className="animate-fade overflow-hidden rounded-xl border border-border bg-card/60"
      style={{ animationDelay: `${delay}s`, borderLeft: `2px solid ${f.color}` }}
    >
      <header
        className="flex items-start gap-3 p-3.5 sm:p-4"
        style={{ background: `linear-gradient(90deg, ${f.color}22 0%, transparent 78%)` }}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `radial-gradient(circle, ${f.color}40 0%, transparent 74%)`,
            boxShadow: `inset 0 0 0 1px ${f.color}66, 0 0 18px -6px ${f.color}`,
            color: f.color,
          }}
        >
          <Icon name={f.icon} size={19} strokeWidth={1.6} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-bold leading-tight">{f.label}</h3>
          <p className="mt-1 text-[0.7rem] italic leading-snug" style={{ color: f.color }}>
            «{f.motto}»
          </p>
        </div>
      </header>

      <div className="space-y-3 px-3.5 pb-4 sm:px-4">
        <p className="text-xs leading-relaxed text-foreground/90">{f.who}</p>

        {blocks.map((b) => (
          <div key={b.label} className="rounded-lg tile-surface px-3 py-2.5">
            <p className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              <Icon name={b.icon} size={11} style={{ color: f.color }} />
              {b.label}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-foreground/85">{b.text}</p>
          </div>
        ))}

        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Как выглядят
          </p>
          <ul className="mt-2 space-y-1.5">
            {f.looks.map((l) => (
              <li key={l} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                <Icon name="Shirt" size={11} className="mt-1 shrink-0" style={{ color: f.color }} />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-lg bg-primary/10 px-3 py-2.5 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)]">
            <p className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ink">
              <Icon name="TrendingUp" size={11} />
              Сильные стороны
            </p>
            <ul className="mt-1.5 space-y-1">
              {f.strong.map((s) => (
                <li key={s} className="text-[0.72rem] leading-relaxed text-foreground/85">
                  · {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-destructive/10 px-3 py-2.5 shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.3)]">
            <p className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-destructive-foreground/80">
              <Icon name="TrendingDown" size={11} />
              Слабые стороны
            </p>
            <ul className="mt-1.5 space-y-1">
              {f.weak.map((w) => (
                <li key={w} className="text-[0.72rem] leading-relaxed text-foreground/85">
                  · {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FactionCard;
