import Icon from '@/components/ui/icon';
import { necro, useNecro, COST } from '@/components/game/crypt3d/necro/necro';
import { input } from '@/components/game/crypt3d/crypt-store';

const Ring = ({ k, color }: { k: number; color: string }) => {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - k)} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
    </svg>
  );
};

const SpellBtn = ({ spell, label, keyName, icon, color, touch }: { spell: 'soul' | 'raise'; label: string; keyName: string; icon: string; color: string; touch: boolean }) => {
  const casting = useNecro((s) => s.casting === spell);
  const charge = useNecro((s) => (s.casting === spell ? s.charge : 0));
  const hold = spell === 'soul' ? 'holdSoul' : 'holdRaise';
  const start = () => {
    input[hold] = true;
    if (spell === 'raise') {
      const r = necro.raisedId();
      if (r && r === necro.get().target) {
        input[hold] = false;
        necro.release(r);
        return;
      }
    }
    necro.start(spell);
  };
  const stop = () => {
    input[hold] = false;
  };
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.stopPropagation();
        if (touch) start();
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      className="relative flex h-16 w-16 select-none items-center justify-center rounded-full bg-black/55 backdrop-blur touch-none"
      style={{ boxShadow: casting ? `0 0 30px -4px ${color}` : undefined }}
      aria-label={label}
    >
      <span className="absolute inset-0">
        <Ring k={charge} color={color} />
      </span>
      <Icon name={icon} size={22} style={{ color }} />
      {!touch && (
        <kbd className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded border border-white/25 bg-black/80 text-[0.6rem] font-bold text-white">
          {keyName}
        </kbd>
      )}
      <span className="absolute -top-2 rounded-full bg-black/70 px-1.5 text-[0.55rem] font-bold text-white/70">−{COST[spell]}</span>
    </button>
  );
};

const NecroHud = ({ touch }: { touch: boolean }) => {
  const target = useNecro((s) => s.corpses.find((c) => c.id === s.target) ?? null);
  const st = useNecro((s) => (s.target ? s.states[s.target] : null));
  const msg = useNecro((s) => s.msg);
  const sanity = useNecro((s) => s.sanity);
  const casting = useNecro((s) => s.casting);

  const hint = !target || !st
    ? null
    : st.raised === 'up'
      ? touch ? 'Отпустить — кнопка подъёма' : 'F — отпустить мертвеца'
      : [st.soul === 'idle' && (touch ? 'Держи — позвать душу' : 'Держи R — позвать душу'), st.raised === 'idle' && !target.bones && (touch ? 'держи — поднять' : 'держи F — поднять тело')].filter(Boolean).join(' · ');

  return (
    <div className="pointer-events-none absolute inset-0 z-[11] select-none">
      {target && (
        <div className="absolute left-1/2 top-[57%] -translate-x-1/2 text-center">
          <p className="font-display text-sm font-bold text-white" style={{ textShadow: '0 1px 8px #000' }}>
            {target.name}
          </p>
          {hint && !casting && <p className="mt-0.5 text-[0.7rem] text-[#9fe0b4]">{hint}</p>}
          {casting && (
            <p className="mt-0.5 animate-pulse text-[0.7rem] font-semibold" style={{ color: casting === 'soul' ? '#9fc4ff' : '#7dffb0' }}>
              {casting === 'soul' ? 'Зовёшь душу…' : 'Тянешь тело из смерти…'}
            </p>
          )}
        </div>
      )}

      {msg && (
        <p className="absolute left-1/2 top-[64%] -translate-x-1/2 animate-fade-in rounded-md bg-black/70 px-3 py-1.5 text-xs text-white/85">{msg}</p>
      )}

      {sanity < 0 && (
        <div className="absolute left-4 top-[88px] flex items-center gap-1.5 rounded-md bg-black/45 px-2 py-1 text-[0.68rem] text-[#c9a6ff] backdrop-blur-sm">
          <Icon name="Brain" size={12} />
          Рассудок {sanity}
        </div>
      )}

      <div className={`pointer-events-auto absolute flex gap-3 ${touch ? 'bottom-44 right-5 flex-col' : 'bottom-5 left-1/2 -translate-x-1/2'}`}>
        <SpellBtn spell="soul" label="Призвать душу" keyName="R" icon="Ghost" color="#9fc4ff" touch={touch} />
        <SpellBtn spell="raise" label="Поднять мертвеца" keyName="F" icon="Skull" color="#7dffb0" touch={touch} />
      </div>
    </div>
  );
};

export default NecroHud;
