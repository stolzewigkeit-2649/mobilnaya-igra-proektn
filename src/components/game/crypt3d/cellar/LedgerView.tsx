import { useEffect, useSyncExternalStore } from 'react';
import Icon from '@/components/ui/icon';
import { LEDGER, ledgerUi, setLedger } from '@/components/game/crypt3d/cellar/cellar-script';

const subscribe = (f: () => void) => {
  ledgerUi.listeners.add(f);
  return () => ledgerUi.listeners.delete(f);
};

const MARK = {
  dead: { icon: 'X', color: '#8a1c12', label: 'мёртв' },
  alive: { icon: 'HeartPulse', color: '#4f7a3a', label: 'жив' },
  gone: { icon: 'ArrowUp', color: '#7a5a1a', label: 'уведён' },
};

const LedgerView = () => {
  const open = useSyncExternalStore(subscribe, () => ledgerUi.open);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (['Escape', 'KeyE', 'Enter', 'Space'].includes(e.code)) {
        e.stopImmediatePropagation();
        setLedger(false);
      }
    };
    window.addEventListener('keydown', close, true);
    return () => window.removeEventListener('keydown', close, true);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-30 flex animate-fade-in items-center justify-center bg-black/70 p-3 backdrop-blur-[2px]"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => setLedger(false)}
    >
      <div
        className="relative max-h-[88vh] w-full max-w-md overflow-y-auto rounded-sm p-6 shadow-[0_30px_80px_-20px_#000] sm:p-8"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, #efe6cd 0%, #ddd0ae 60%, #c7b48a 100%)',
          color: '#2b2018',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={() => setLedger(false)} className="absolute right-3 top-3 text-[#5a4632] hover:text-black" aria-label="Закрыть">
          <Icon name="X" size={18} />
        </button>
        <p className="text-center text-[0.7rem] uppercase tracking-[0.3em] text-[#6b5236]">Овражье · приход св. Авраама</p>
        <h3 className="mt-1 text-center text-xl font-bold italic">Ведомость испытуемых</h3>
        <p className="mt-1 text-center text-xs italic text-[#6b5236]">«Да будет страх их доказательством веры»</p>
        <div className="my-4 h-px bg-[#8a6f4e]/50" />
        <ol className="space-y-3.5">
          {LEDGER.map((e, i) => {
            const m = MARK[e.status];
            return (
              <li key={e.name} className="flex gap-3">
                <span className="w-5 shrink-0 pt-0.5 text-sm text-[#6b5236]">{i + 1}.</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline justify-between gap-2">
                    <span className={`font-bold ${e.status === 'dead' ? 'line-through decoration-[#8a1c12] decoration-2' : ''}`}>{e.name}</span>
                    <span className="shrink-0 text-xs text-[#6b5236]">{e.age}</span>
                  </p>
                  <p className="mt-0.5 text-sm italic leading-snug text-[#3d2e22]">{e.note}</p>
                </div>
                <span className="flex w-12 shrink-0 flex-col items-center pt-0.5 text-[0.6rem] uppercase" style={{ color: m.color }}>
                  <Icon name={m.icon} size={16} />
                  {m.label}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="my-4 h-px bg-[#8a6f4e]/50" />
        <p className="text-right text-xs italic text-[#6b5236]">Подпись неразборчива. Печать — золотой крест.</p>
        <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.2em] text-[#6b5236]/80">клик / E — закрыть</p>
      </div>
    </div>
  );
};

export default LedgerView;
