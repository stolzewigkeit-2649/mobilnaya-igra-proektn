import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { EVIDENCE_META, GIFT_META } from '@/data/story';
import type { StoryState } from '@/hooks/use-story';

const Pulse = ({ value, children }: { value: number; children: React.ReactNode }) => {
  const prev = useRef(value);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setHot(true);
      const t = window.setTimeout(() => setHot(false), 900);
      return () => window.clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold tabular-nums transition-all duration-500 tile-surface ${
        hot ? 'text-ink shadow-[0_0_16px_hsl(var(--btn-hi)/0.5)]' : 'text-muted-foreground'
      }`}
    >
      {children}
    </span>
  );
};

const StatusBar = ({ state }: { state: StoryState }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <Pulse value={state.health}>
      <Icon name="HeartPulse" size={12} className="text-ink" />
      {state.health}
    </Pulse>
    <Pulse value={state.sanity}>
      <Icon name="BrainCircuit" size={12} className="text-ink" />
      {state.sanity}
    </Pulse>
    <Pulse value={state.evidence.length}>
      <Icon name="Search" size={12} className="text-ink" />
      {state.evidence.length}/7
    </Pulse>

    {state.gifts.map((g) => (
      <span
        key={g}
        title={`${GIFT_META[g].gift} · ${GIFT_META[g].god}`}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-ink shadow-[inset_0_0_0_1px_hsl(var(--border))]"
      >
        <Icon name={GIFT_META[g].icon} size={12} />
      </span>
    ))}

    {state.evidence.map((e) => (
      <span
        key={e}
        title={EVIDENCE_META[e].label}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-ink/80 shadow-[inset_0_0_0_1px_hsl(var(--border))]"
      >
        <Icon name={EVIDENCE_META[e].icon} size={12} />
      </span>
    ))}
  </div>
);

export default StatusBar;
