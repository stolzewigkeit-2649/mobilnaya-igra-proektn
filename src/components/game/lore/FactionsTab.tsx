import { useState } from 'react';
import Icon from '@/components/ui/icon';
import FactionCard from '@/components/game/lore/FactionCard';
import { LORE_FACTIONS } from '@/data/lore-factions';

const FactionsTab = () => {
  const [activeId, setActiveId] = useState(LORE_FACTIONS[0].id);
  const active = LORE_FACTIONS.find((f) => f.id === activeId)!;

  return (
    <div className="space-y-3.5">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Четыре силы делят всё, что осталось вне Шпиля. Ни одна не даст тебе помощь бесплатно.
      </p>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {LORE_FACTIONS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveId(f.id)}
            className={`flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center text-[0.68rem] font-semibold leading-tight transition-all tile-surface ${
              f.id === activeId ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            style={
              f.id === activeId ? { boxShadow: `inset 0 0 0 1px ${f.color}, 0 0 20px -8px ${f.color}` } : undefined
            }
          >
            <Icon name={f.icon} size={18} strokeWidth={1.6} style={{ color: f.color }} />
            {f.label}
          </button>
        ))}
      </div>

      <FactionCard key={active.id} f={active} delay={0} />
    </div>
  );
};

export default FactionsTab;
