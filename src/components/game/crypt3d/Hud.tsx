import { useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { crypt, useCrypt, type Line } from '@/components/game/crypt3d/crypt-store';
import { Joystick } from '@/components/game/crypt3d/Joystick';

const WHO: Record<Line['who'], { name: string; color: string }> = {
  hecate: { name: 'Геката', color: '#d4b06a' },
  hero: { name: 'Ты', color: '#9fe0b4' },
  soul: { name: 'Душа', color: '#a8c8ff' },
  sariel: { name: 'Сариэл', color: '#d6deff' },
  note: { name: '', color: '' },
};

export type HudSpot = { id: string; label: string };

type Props = {
  touch: boolean;
  free: boolean;
  spots: HudSpot[];
  onInteract: (id: string | null) => void;
  onAdvance: () => void;
  onHands?: () => void;
};

const Subtitles = ({ onAdvance }: { onAdvance: () => void }) => {
  const line = useCrypt((s) => s.lines[s.lineIndex]);
  const last = useCrypt((s) => s.lineIndex >= s.lines.length - 1);
  if (!line) return null;
  const w = WHO[line.who];
  return (
    <button
      type="button"
      onClick={onAdvance}
      className="pointer-events-auto absolute inset-x-0 bottom-[20%] mx-auto w-[min(92%,720px)] animate-fade-in rounded-xl px-4 py-3 text-center"
    >
      {w.name && (
        <p className="flex items-center justify-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.3em]" style={{ color: w.color }}>
          {line.who === 'hecate' && (
            <img src="/gods/hekate-face.webp" alt="" className="h-8 w-8 rounded-full object-cover" style={{ boxShadow: `0 0 0 1.5px ${w.color}, 0 0 14px -2px ${w.color}` }} />
          )}
          {w.name}
        </p>
      )}
      <p
        className={`mt-1 text-base leading-relaxed sm:text-xl ${line.who === 'note' ? 'italic text-white/80' : 'font-display text-white'}`}
        style={{ textShadow: '0 2px 12px #000, 0 0 2px #000' }}
      >
        {line.who === 'note' ? line.text : `— ${line.text}`}
      </p>
      <p className="mt-2 text-[0.62rem] uppercase tracking-[0.25em] text-white/45">
        {last ? 'клик / Enter — закрыть' : 'клик / Enter — дальше'}
      </p>
    </button>
  );
};

const Choices = () => {
  const choices = useCrypt((s) => s.choices);
  const hasLine = useCrypt((s) => s.lines.length > 0);
  useEffect(() => {
    if (choices.length) document.exitPointerLock?.();
  }, [choices]);
  if (!choices.length || hasLine) return null;
  return (
    <div
      className="pointer-events-auto absolute inset-x-0 bottom-[12%] mx-auto flex w-[min(92%,520px)] animate-fade-in flex-col gap-2"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {choices.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => crypt.choose(c.id)}
          className="group rounded-lg border border-white/15 bg-black/65 px-4 py-3 text-left backdrop-blur-md transition-colors hover:border-[#9fe0b4]/70 hover:bg-black/80"
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold text-white">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/10 text-[0.65rem] text-white/70">{i + 1}</span>
            {c.label}
          </span>
          {c.hint && <span className="mt-1 block pl-[30px] text-xs text-white/55">{c.hint}</span>}
        </button>
      ))}
    </div>
  );
};

const CardView = () => {
  const card = useCrypt((s) => s.card);
  useEffect(() => {
    if (!card) return;
    const t = window.setTimeout(() => crypt.set({ card: null }), 6000);
    return () => window.clearTimeout(t);
  }, [card]);
  if (!card) return null;
  return (
    <div
      className="absolute inset-x-0 top-[14%] mx-auto w-[min(90%,420px)] animate-rise rounded-xl border bg-black/70 p-4 text-center backdrop-blur-md"
      style={{ borderColor: `${card.color}80`, boxShadow: `0 0 60px -10px ${card.color}` }}
    >
      <Icon name={card.icon} size={26} className="mx-auto" style={{ color: card.color }} />
      <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/55">{card.kicker}</p>
      <p className="font-display text-xl font-extrabold" style={{ color: card.color }}>
        {card.title}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-white/75">{card.text}</p>
    </div>
  );
};

const Hud = ({ touch, free, spots, onInteract, onAdvance, onHands }: Props) => {
  const focus = useCrypt((s) => s.focus);
  const objective = useCrypt((s) => s.objective);
  const looking = useCrypt((s) => s.looking);
  const busy = useCrypt((s) => s.lines.length > 0 || s.choices.length > 0);
  const spot = spots.find((s) => s.id === focus);
  const walk = free && !busy;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none">
      {walk && touch && (
        <div className="pointer-events-auto">
          <Joystick />
        </div>
      )}

      {walk && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span
            className={`block rounded-full border transition-all duration-200 ${
              spot ? 'h-5 w-5 border-white/80 bg-white/10' : 'h-1.5 w-1.5 border-white/60 bg-white/70'
            }`}
          />
          {spot && (
            <p className="absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
              {touch ? spot.label : `E — ${spot.label.toLowerCase()}`}
            </p>
          )}
        </div>
      )}

      {objective && (
        <div className="absolute left-4 top-4 max-w-[70%] animate-fade-in rounded-lg bg-black/45 px-3 py-2 backdrop-blur-sm">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#9fe0b4]">Цель</p>
          <p className="mt-0.5 text-xs text-white/90 sm:text-sm">{objective}</p>
        </div>
      )}

      <CardView />

      {touch && onHands && !walk && !busy && (
        <button
          type="button"
          onClick={onHands}
          className="pointer-events-auto absolute bottom-7 right-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur"
        >
          <Icon name="Hand" size={20} className="text-white" />
        </button>
      )}

      {touch && walk && (
        <div className="pointer-events-auto absolute bottom-7 right-5 flex flex-col items-end gap-3">
          {onHands && (
            <button
              type="button"
              onClick={onHands}
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/25 backdrop-blur ${looking ? 'bg-white/30' : 'bg-white/10'}`}
            >
              <Icon name="Hand" size={20} className="text-white" />
            </button>
          )}
          <button
            type="button"
            disabled={!spot}
            onClick={() => onInteract(focus)}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur transition-opacity disabled:opacity-30"
          >
            <Icon name="Eye" size={24} className="text-white" />
          </button>
        </div>
      )}

      <Subtitles onAdvance={onAdvance} />
      <Choices />
    </div>
  );
};

export default Hud;
