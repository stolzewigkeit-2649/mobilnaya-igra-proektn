import Icon from '@/components/ui/icon';
import OptionGroup from '@/components/game/character/OptionGroup';
import type { SectionProps } from '@/components/game/character/section-props';
import { FACTIONS, COMMON_WEAR } from '@/data/character-gear';

const SectionWear = ({ character: c, set, toggle }: SectionProps) => {
  const faction = FACTIONS.find((f) => f.id === c.faction) ?? FACTIONS[0];

  return (
    <div className="space-y-5">
      <div className="space-y-2.5">
        <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Основная фракция
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {FACTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => set('faction', f.id)}
              className={`flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-left transition-all tile-surface ${
                f.id === c.faction
                  ? 'text-foreground shadow-[inset_0_0_0_1px_hsl(var(--btn-hi))]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span
                className="h-6 w-6 shrink-0 rounded-lg"
                style={{ background: f.color, boxShadow: 'inset 0 0 0 1px hsl(var(--border))' }}
              />
              <span className="min-w-0 flex-1 break-words text-[0.72rem] font-semibold leading-tight">
                {f.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-3.5">
        <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink">
          <Icon name={faction.icon} size={14} />
          {faction.label}
        </p>
        <div className="mt-3">
          <OptionGroup
            title="Элементы фракции"
            hint="можно миксовать"
            options={faction.items}
            value={c.wear}
            onSelect={(v) => toggle('wear', v)}
          />
        </div>
      </div>

      <OptionGroup
        title="Общие элементы"
        options={COMMON_WEAR}
        value={c.common}
        onSelect={(v) => toggle('common', v)}
      />
    </div>
  );
};

export default SectionWear;
