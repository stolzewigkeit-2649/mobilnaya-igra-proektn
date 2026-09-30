import Icon from '@/components/ui/icon';
import { EVIDENCE_META, FACTION_META, FACTION_IDS, GIFT_META } from '@/data/story';
import type { StoryEnding } from '@/data/story';
import type { StoryState } from '@/hooks/use-story';

const TONE: Record<string, string> = {
  good: '#5ec27e',
  dark: '#d8c89a',
  bad: '#b04a3a',
  neutral: '#c9d2d4',
};

type EndingViewProps = {
  ending: StoryEnding;
  state: StoryState;
  onRestart: () => void;
  onExit: () => void;
};

const EndingView = ({ ending, state, onRestart, onExit }: EndingViewProps) => {
  const color = TONE[ending.tone] ?? '#c9d2d4';

  return (
    <div className="space-y-5">
      <div className="animate-rise text-center">
        <span
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent"
          style={{ color, boxShadow: `0 0 44px -8px ${color}` }}
        >
          <Icon name={ending.icon} size={26} strokeWidth={1.5} />
        </span>
        <p className="mt-4 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          Концовка главы I
        </p>
        <h2
          className="mt-2 font-display text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-4xl"
          style={{ color }}
        >
          {ending.name}
        </h2>
      </div>

      <p className="animate-fade text-[0.94rem] leading-[1.75] text-foreground/88 [animation-delay:.2s]">
        {ending.summary}
      </p>

      <div className="animate-fade space-y-2.5 rounded-xl border border-border bg-card/60 p-4 [animation-delay:.35s]">
        <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Итог прохождения
        </p>

        <div className="flex flex-wrap gap-1.5 text-[0.7rem] font-bold text-muted-foreground">
          <span className="rounded-full px-2.5 py-1 tile-surface">Здоровье {state.health}</span>
          <span className="rounded-full px-2.5 py-1 tile-surface">Рассудок {state.sanity}</span>
          <span className="rounded-full px-2.5 py-1 tile-surface">
            Сцен пройдено {state.visited.length}
          </span>
        </div>

        <div>
          <p className="text-xs font-bold text-ink">Улики ({state.evidence.length}/7)</p>
          {state.evidence.length === 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">Ни одной. Только память.</p>
          ) : (
            <ul className="mt-1.5 space-y-1.5">
              {state.evidence.map((e) => (
                <li key={e} className="flex items-start gap-2 text-xs text-foreground/85">
                  <Icon name={EVIDENCE_META[e].icon} size={13} className="mt-0.5 shrink-0 text-ink" />
                  <span>
                    <b className="font-semibold">{EVIDENCE_META[e].label}</b>
                    <span className="block text-muted-foreground">{EVIDENCE_META[e].short}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-xs font-bold text-ink">Дары и их цена</p>
          {state.gifts.length === 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">Ты не взял ни одного. Ты цел.</p>
          ) : (
            <ul className="mt-1.5 space-y-1.5">
              {state.gifts.map((g) => (
                <li key={g} className="flex items-start gap-2 text-xs text-foreground/85">
                  <Icon name={GIFT_META[g].icon} size={13} className="mt-0.5 shrink-0 text-ink" />
                  <span>
                    <b className="font-semibold">{GIFT_META[g].gift}</b> · {GIFT_META[g].god}
                    <span className="block text-muted-foreground">{GIFT_META[g].price}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-xs font-bold text-ink">Отношения</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {FACTION_IDS.map((f) => (
              <span
                key={f}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold tile-surface"
                style={{ color: state.rep[f] < 0 ? 'hsl(var(--destructive))' : FACTION_META[f].color }}
              >
                <Icon name={FACTION_META[f].icon} size={11} />
                {FACTION_META[f].label}
                <span className="tabular-nums">
                  {state.rep[f] > 0 ? `+${state.rep[f]}` : state.rep[f]}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="animate-fade flex items-start gap-2 rounded-xl bg-accent px-4 py-3 text-xs leading-relaxed text-accent-foreground [animation-delay:.5s]">
        <Icon name="BookOpen" size={14} className="mt-0.5 shrink-0" />
        {ending.teaser}
      </p>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="flex h-12 flex-1 items-center justify-center gap-2.5 rounded-lg font-display text-sm font-extrabold uppercase tracking-[0.16em] text-primary-foreground transition-transform btn-play-surface hover:scale-[1.01]"
        >
          <Icon name="RotateCcw" size={15} />
          Начать заново
        </button>
        <button
          type="button"
          onClick={onExit}
          className="flex h-12 items-center justify-center gap-2.5 rounded-lg px-6 text-sm font-bold text-muted-foreground transition-colors tile-surface hover:text-foreground"
        >
          <Icon name="Home" size={15} />
          В меню
        </button>
      </div>
    </div>
  );
};

export default EndingView;
