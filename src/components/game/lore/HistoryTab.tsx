import Icon from '@/components/ui/icon';
import { LORE_HISTORY } from '@/data/lore-history';

const HistoryTab = () => (
  <div className="space-y-4">
    <p className="text-xs leading-relaxed text-muted-foreground">
      Четыреста лет от похоронной артели до Шпиля без окон. Годы считают от закладки Шпиля — так
      велел канон.
    </p>

    <div className="relative">
      <span className="pointer-events-none absolute left-[11px] top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-ink/60 via-border to-transparent" />

      <ol className="relative space-y-4 pl-8">
        {LORE_HISTORY.map((c, i) => (
          <li
            key={c.id}
            className="relative animate-fade"
            style={{ animationDelay: `${0.06 * i}s` }}
          >
            <span className="absolute -left-8 top-1 flex h-[23px] w-[23px] items-center justify-center rounded-full bg-secondary text-ink shadow-[inset_0_0_0_1px_hsl(var(--border)),0_0_14px_-4px_hsl(var(--btn-hi))]">
              <Icon name={c.icon} size={11} strokeWidth={1.8} />
            </span>

            <div className="rounded-xl border border-border bg-card/60 p-3.5 transition-colors hover:border-ink/30">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink">{c.era}</p>
              <h3 className="mt-1 font-display text-base font-bold leading-tight">{c.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>

    <p className="flex items-start gap-2 rounded-xl bg-accent px-3.5 py-3 text-xs leading-relaxed text-accent-foreground">
      <Icon name="Quote" size={13} className="mt-0.5 shrink-0" />
      «Бога не опровергают проповедью. Бога опровергают описью.»
    </p>
  </div>
);

export default HistoryTab;