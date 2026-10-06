import { useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  EVIDENCE_META,
  EVIDENCE_TOTAL,
  GIFT_KIND_LABEL,
  GIFT_META,
  type StoryEnding,
} from '@/data/story';
import type { StoryState } from '@/hooks/use-story';

type EndingViewProps = {
  ending: StoryEnding;
  state: StoryState;
  onRestart: () => void;
  onExit: () => void;
};

const EndingView = ({ ending, state, onRestart, onExit }: EndingViewProps) => {
  const [black, setBlack] = useState(!!ending.epigraph);

  if (black && ending.epigraph)
    return (
      <button
        type="button"
        onClick={() => setBlack(false)}
        className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black px-6 text-center"
      >
        <p className="animate-fade font-display text-3xl font-extrabold uppercase tracking-[0.18em] text-foreground [animation-delay:.6s] sm:text-5xl">
          {ending.epigraph.title}
        </p>
        <p className="mt-6 max-w-md animate-fade text-base italic leading-relaxed text-muted-foreground [animation-delay:2s] sm:text-lg">
          {ending.epigraph.line}
        </p>
        <p className="mt-10 animate-fade text-[0.7rem] font-bold uppercase tracking-[0.4em] text-ink [animation-delay:3.4s]">
          Конец демо
        </p>
        <p className="mt-12 animate-fade text-[0.66rem] text-muted-foreground/60 [animation-delay:4.4s]">
          нажми, чтобы продолжить
        </p>
      </button>
    );

  return (
    <div className="space-y-5">
      <div className="animate-rise text-center">
        <span
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-ink"
          style={{ boxShadow: '0 0 44px -8px hsl(var(--btn-hi))' }}
        >
          <Icon name={ending.icon} size={26} strokeWidth={1.5} />
        </span>
        <p className="mt-4 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          Демо пройдено
        </p>
        <h2 className="mt-2 font-display text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          {ending.name}
        </h2>
      </div>

      <p className="animate-fade text-[0.94rem] leading-[1.75] text-foreground/88 [animation-delay:.2s]">
        {ending.summary}
      </p>

      <div className="animate-fade space-y-3 rounded-xl border border-border bg-card/60 p-4 [animation-delay:.35s]">
        <div className="flex flex-wrap gap-1.5 text-[0.7rem] font-bold text-muted-foreground">
          <span className="rounded-full px-2.5 py-1 tile-surface">Здоровье {state.health}</span>
          <span className="rounded-full px-2.5 py-1 tile-surface">Рассудок {state.sanity}</span>
          <span className="rounded-full px-2.5 py-1 tile-surface">Смертей {state.deaths}</span>
        </div>

        <div>
          <p className="text-xs font-bold text-ink">
            Улики ({state.evidence.length}/{EVIDENCE_TOTAL})
          </p>
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
        </div>

        <div>
          <p className="text-xs font-bold text-ink">Дары богов</p>
          <ul className="mt-1.5 space-y-1.5">
            {state.gifts.map((g) => (
              <li key={g} className="flex items-start gap-2 text-xs text-foreground/85">
                <Icon name={GIFT_META[g].icon} size={13} className="mt-0.5 shrink-0 text-ink" />
                <span>
                  <b className="font-semibold">{GIFT_META[g].name}</b>
                  <span className="text-muted-foreground">
                    {' '}
                    · {GIFT_KIND_LABEL[GIFT_META[g].kind]} · {GIFT_META[g].giver}
                  </span>
                </span>
              </li>
            ))}
          </ul>
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
          Пройти заново
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
