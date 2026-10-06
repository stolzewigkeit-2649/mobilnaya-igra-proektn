import { useEffect, useState } from 'react';
import { crypt, useCrypt } from '@/components/game/crypt3d/crypt-store';
import { CANDLE_COUNT } from '@/components/game/crypt3d/Candles';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';

const Lids = ({ open }: { open: number }) => (
  <div className="pointer-events-none absolute inset-0 z-[5]">
    <div
      className="absolute inset-x-0 top-0 bg-black transition-[height] duration-[1400ms] ease-in-out"
      style={{ height: `${50 - open * 50}%`, borderRadius: '0 0 50% 50% / 0 0 30% 30%' }}
    />
    <div
      className="absolute inset-x-0 bottom-0 bg-black transition-[height] duration-[1400ms] ease-in-out"
      style={{ height: `${50 - open * 50}%`, borderRadius: '50% 50% 0 0 / 30% 30% 0 0' }}
    />
    <div
      className="absolute inset-0 transition-[backdrop-filter] duration-[2500ms]"
      style={{ backdropFilter: `blur(${(1 - open) * 10}px)` }}
    />
  </div>
);

const Intro = ({ skip, ready }: { skip: boolean; ready: boolean }) => {
  const stage = useCrypt((s) => s.stage);
  const [open, setOpen] = useState(skip ? 1 : 0);
  const [text, setText] = useState(skip ? '' : 'Темнота.');

  useEffect(() => {
    if (skip || !ready) return;
    const timers: number[] = [];
    const at = (ms: number, f: () => void) => timers.push(window.setTimeout(f, ms));
    at(2200, () => setText('Только капли воды.'));
    at(4200, () => setText(''));
    at(4600, () => setOpen(0.35));
    at(5600, () => setOpen(0.05));
    at(6300, () => setOpen(0.6));
    at(7300, () => setOpen(0.25));
    at(8000, () => setOpen(1));
    for (let i = 1; i <= CANDLE_COUNT; i++) at(4300 + i * 160, () => crypt.set({ candlesLit: i }));
    at(4300 + CANDLE_COUNT * 160 + 600, () => {
      crypt.set({ stage: 'shard', objective: 'Коснись осколка на груди' });
    });
    return () => timers.forEach(clearTimeout);
  }, [skip, ready]);

  const touchShard = () => {
    if (crypt.get().stage !== 'shard') return;
    cryptAudio.chime(659);
    crypt.set({ objective: '' });
    crypt.say([{ who: 'hecate', text: 'Наконец.' }]);
    window.setTimeout(() => {
      crypt.set({ stage: 'rise', lines: [] });
      window.setTimeout(() => crypt.say([{ who: 'hero', text: 'Кто ты?' }]), 2300);
    }, 2600);
  };

  return (
    <>
      {open < 1 && <Lids open={open} />}
      {text && (
        <p className="pointer-events-none absolute inset-x-0 top-1/2 z-[6] -translate-y-1/2 animate-fade-in text-center font-display text-lg italic tracking-wide text-white/70">
          {text}
        </p>
      )}
      {stage === 'shard' && (
        <button
          type="button"
          onClick={touchShard}
          className="absolute bottom-[12%] left-1/2 z-20 -translate-x-1/2 animate-fade-in rounded-full border border-[#ffe9b0]/50 bg-black/50 px-5 py-2.5 text-sm font-semibold text-[#fff0c8] shadow-[0_0_30px_-6px_#ffe9b0] backdrop-blur"
        >
          Коснуться осколка
        </button>
      )}
    </>
  );
};

export default Intro;
