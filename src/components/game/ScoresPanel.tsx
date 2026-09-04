import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { SCORES } from '@/data/game';

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'week', label: 'Неделя' },
  { id: 'friends', label: 'Ковен' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

const ScoresPanel = () => {
  const [filter, setFilter] = useState<FilterId>('all');

  const rows = useMemo(() => {
    if (filter === 'week') return SCORES.filter((r) => r.place % 2 === 0 || r.you);
    if (filter === 'friends') return SCORES.filter((r) => r.place <= 4 || r.you);
    return SCORES;
  }, [filter]);

  const medal = (place: number) =>
    place === 1 ? 'Crown' : place === 2 ? 'Award' : place === 3 ? 'Medal' : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[36px_1fr_56px_78px] gap-2 border-b border-border bg-secondary px-3 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:grid-cols-[40px_1fr_110px_60px_90px]">
          <span>#</span>
          <span>Игрок</span>
          <span className="hidden sm:block">Вид</span>
          <span className="text-right">Улик</span>
          <span className="text-right">Очки</span>
        </div>
        {rows.map((r) => {
          const m = medal(r.place);
          return (
            <div
              key={r.place}
              className={`grid animate-fade-in grid-cols-[36px_1fr_56px_78px] items-center gap-2 border-b border-border/60 px-3 py-2.5 text-sm last:border-0 sm:grid-cols-[40px_1fr_110px_60px_90px] ${
                r.you ? 'bg-accent/70' : 'hover:bg-secondary/60'
              }`}
            >
              <span className="flex items-center text-xs font-bold text-muted-foreground">
                {m ? <Icon name={m} size={15} className="text-ink" /> : r.place}
              </span>
              <span className={`truncate ${r.you ? 'font-bold text-ink' : 'text-foreground'}`}>
                {r.player}
              </span>
              <span className="hidden truncate text-xs text-muted-foreground sm:block">
                {r.kind}
              </span>
              <span className="text-right text-xs text-muted-foreground">{r.clues}</span>
              <span className="text-right text-xs font-semibold tabular-nums text-foreground">
                {r.score.toLocaleString('ru-RU')}
              </span>
            </div>
          );
        })}
      </div>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Icon name="Info" size={14} className="mt-0.5 shrink-0 text-ink" />
        Очки начисляются за собранные улики, тихие проникновения и главы, пройденные без потери
        благосклонности. Сложность «Отступник» умножает результат на 1.6.
      </p>
    </div>
  );
};

export default ScoresPanel;
