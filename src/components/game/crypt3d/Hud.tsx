import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { useCrypt } from '@/components/game/crypt3d/crypt-store';
import { SPOTS, advanceLine, interact, lookAtHands } from '@/components/game/crypt3d/interactables';
import { Joystick, LookPad } from '@/components/game/crypt3d/Joystick';

const WHO = {
  hecate: { name: 'Геката', color: '#c9a6ff' },
  hero: { name: 'Ты', color: '#9fe0b4' },
  note: { name: '', color: '' },
};

const Subtitles = () => {
  const line = useCrypt((s) => s.lines[s.lineIndex]);
  const more = useCrypt((s) => s.lines.length);
  if (!line) return null;
  const w = WHO[line.who];
  return (
    <button
      type="button"
      onClick={advanceLine}
      className="pointer-events-auto absolute inset-x-0 bottom-[22%] mx-auto w-[min(92%,720px)] animate-fade-in px-4 py-3 text-center"
    >
      {w.name && (
        <p className="text-[0.66rem] font-bold uppercase tracking-[0.3em]" style={{ color: w.color }}>
          {w.name}
        </p>
      )}
      <p
        className={`mt-1 text-base leading-relaxed text-white sm:text-xl ${line.who === 'note' ? 'italic text-white/80' : 'font-display'}`}
        style={{ textShadow: '0 2px 12px #000, 0 0 2px #000' }}
      >
        {line.who === 'note' ? line.text : `— ${line.text}`}
      </p>
      <p className="mt-2 text-[0.62rem] uppercase tracking-[0.25em] text-white/45">
        {more > 1 ? 'клик / Enter — дальше' : 'клик / Enter — закрыть'}
      </p>
    </button>
  );
};

const GiftCard = () => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setShow(false), 6500);
    return () => window.clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="absolute inset-x-0 top-[16%] mx-auto w-[min(90%,420px)] animate-rise rounded-xl border border-[#9b59d0]/50 bg-black/70 p-4 text-center shadow-[0_0_60px_-10px_#9b59d0] backdrop-blur-md">
      <Icon name="Infinity" size={26} className="mx-auto text-[#c9a6ff]" />
      <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/55">Получено</p>
      <p className="font-display text-xl font-extrabold text-[#c9a6ff]">Бессмертие некроманта</p>
      <p className="mt-1.5 text-xs leading-relaxed text-white/75">
        Смерть будет возвращать тебя обратно. Но каждый раз — забирая часть рассудка.
      </p>
    </div>
  );
};

const Hud = ({ touch }: { touch: boolean }) => {
  const stage = useCrypt((s) => s.stage);
  const focus = useCrypt((s) => s.focus);
  const objective = useCrypt((s) => s.objective);
  const looking = useCrypt((s) => s.looking);
  const hasLine = useCrypt((s) => s.lines.length > 0);
  const free = stage === 'explore' || stage === 'gift';
  const spot = SPOTS.find((s) => s.id === focus);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none">
      {free && touch && (
        <div className="pointer-events-auto">
          <LookPad />
          <Joystick />
        </div>
      )}

      {free && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span
            className={`block rounded-full border transition-all duration-200 ${
              spot ? 'h-5 w-5 border-white/80 bg-white/10' : 'h-1.5 w-1.5 border-white/60 bg-white/70'
            }`}
          />
          {spot && !hasLine && (
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

      {stage === 'gift' && !hasLine && <GiftCard />}

      {touch && free && (
        <div className="pointer-events-auto absolute bottom-7 right-5 flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={lookAtHands}
            className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/25 backdrop-blur ${looking ? 'bg-white/30' : 'bg-white/10'}`}
          >
            <Icon name="Hand" size={20} className="text-white" />
          </button>
          <button
            type="button"
            disabled={!spot}
            onClick={() => interact(focus)}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur transition-opacity disabled:opacity-30"
          >
            <Icon name="Eye" size={24} className="text-white" />
          </button>
        </div>
      )}

      <Subtitles />
    </div>
  );
};

export default Hud;
