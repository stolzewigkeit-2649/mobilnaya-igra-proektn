import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

export type KeyRow = { keys: string[]; label: string };

export const BASE_KEYS: KeyRow[] = [
  { keys: ['W', 'A', 'S', 'D'], label: 'идти' },
  { keys: ['Shift'], label: 'бежать' },
  { keys: ['Мышь'], label: 'крутить головой' },
  { keys: ['←', '→'], label: 'повернуть влево / вправо' },
  { keys: ['↑', '↓'], label: 'смотреть вверх / вниз' },
  { keys: ['E', 'Клик'], label: 'действие / осмотреть' },
  { keys: ['H'], label: 'руки → ладони → убрать' },
  { keys: ['Enter', 'Пробел'], label: 'следующая реплика' },
  { keys: ['1', '2'], label: 'выбрать ответ' },
  { keys: ['Esc'], label: 'пауза / отпустить мышь' },
  { keys: ['F1'], label: 'скрыть / показать подсказки' },
];

const KEY = 'rpv-3d-keys';

const Kbd = ({ children }: { children: string }) => (
  <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-white/25 bg-white/10 px-1.5 font-sans text-[0.62rem] font-bold text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.15)]">
    {children}
  </kbd>
);

const KeysPanel = ({ rows = BASE_KEYS }: { rows?: KeyRow[] }) => {
  const [open, setOpen] = useState(() => localStorage.getItem(KEY) !== '0');

  useEffect(() => {
    localStorage.setItem(KEY, open ? '1' : '0');
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'F1') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 z-20 hidden sm:block" onPointerDown={(e) => e.stopPropagation()}>
      {open ? (
        <div className="w-[248px] animate-fade-in rounded-xl border border-white/10 bg-black/55 p-3 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-white/60">
              <Icon name="Keyboard" size={12} />
              Управление
            </p>
            <button type="button" onClick={() => setOpen(false)} className="text-white/50 hover:text-white" aria-label="Скрыть">
              <Icon name="ChevronDown" size={14} />
            </button>
          </div>
          <ul className="space-y-1.5">
            {rows.map((r) => (
              <li key={r.label} className="flex items-center justify-between gap-2">
                <span className="flex shrink-0 flex-wrap gap-0.5">
                  {r.keys.map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </span>
                <span className="text-right text-[0.68rem] leading-tight text-white/75">{r.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/55 px-2.5 py-1.5 text-[0.68rem] font-semibold text-white/70 backdrop-blur-md hover:text-white"
        >
          <Icon name="Keyboard" size={13} />
          Клавиши
          <Kbd>F1</Kbd>
        </button>
      )}
    </div>
  );
};

export default KeysPanel;
