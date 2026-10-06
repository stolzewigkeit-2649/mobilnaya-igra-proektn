import type { ReactNode } from 'react';
import Icon from '@/components/ui/icon';
import type { Archetype, ArchetypeChoice } from '@/data/archetypes';
import { ACTIVE_SKILLS } from '@/data/archetypes';
import { MAGIC_COLORS } from '@/data/character-gear';

export const Block = ({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) => (
  <section>
    <div className="mb-2 flex items-baseline justify-between gap-2">
      <h4 className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">{title}</h4>
      {hint && <span className="text-[0.66rem] text-ink">{hint}</span>}
    </div>
    {children}
  </section>
);

type PickerProps = { a: Archetype; c: ArchetypeChoice; patch: (p: Partial<ArchetypeChoice>) => void };

const ring = (on: boolean, color: string) =>
  on ? { boxShadow: `inset 0 0 0 2px ${color}, 0 0 16px -4px ${color}` } : undefined;

export const LookPicker = ({ a, c, patch }: PickerProps) => (
  <div className="grid grid-cols-2 gap-2">
    {a.looks.map((l) => (
      <button
        key={l.id}
        type="button"
        onClick={() => patch({ lookId: l.id })}
        className="flex items-center gap-2 rounded-lg p-1.5 text-left tile-surface"
        style={ring(l.id === c.lookId, a.accent)}
      >
        <img src={l.face} alt="" className="h-11 w-11 shrink-0 rounded-md object-cover" />
        <span className="min-w-0 text-xs font-semibold leading-tight">{l.label}</span>
      </button>
    ))}
  </div>
);

export const VariantPicker = ({ a, c, patch, face }: PickerProps & { face: string }) => (
  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
    {a.variants.map((v) => (
      <button
        key={v.id}
        type="button"
        onClick={() => patch({ variantId: v.id })}
        className="flex min-w-0 flex-col items-center gap-1 rounded-lg p-1.5 tile-surface"
        style={ring(v.id === c.variantId, v.tint)}
      >
        <img src={face} alt="" className="aspect-square w-full rounded-md object-cover" style={{ filter: v.filter }} />
        <span className="w-full text-center text-[0.62rem] font-semibold leading-tight text-foreground/85">
          {v.label}
        </span>
      </button>
    ))}
  </div>
);

export const MagicPicker = ({ c, patch }: Omit<PickerProps, 'a'>) => (
  <div className="flex flex-wrap gap-2">
    {MAGIC_COLORS.map((m) => (
      <button
        key={m.id}
        type="button"
        onClick={() => patch({ magicColor: m.id })}
        className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-xs font-semibold tile-surface"
        style={ring(m.id === c.magicColor, m.color ?? '#fff')}
      >
        <span className="h-5 w-5 rounded-full" style={{ background: m.color, boxShadow: `0 0 10px ${m.color}` }} />
        {m.label}
      </button>
    ))}
  </div>
);

export const SkillPicker = ({ a, c, patch }: PickerProps) => {
  const toggle = (id: string) => {
    if (c.skills.includes(id)) patch({ skills: c.skills.filter((s) => s !== id) });
    else if (c.skills.length < ACTIVE_SKILLS) patch({ skills: [...c.skills, id] });
  };
  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {a.skills.map((s) => {
        const on = c.skills.includes(s.id);
        const blocked = !on && c.skills.length >= ACTIVE_SKILLS;
        return (
          <li key={s.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={on}
              disabled={blocked}
              onClick={() => toggle(s.id)}
              className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left tile-surface transition-opacity ${blocked ? 'opacity-45' : ''}`}
              style={ring(on, a.accent)}
            >
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border"
                style={{ borderColor: on ? a.accent : 'hsl(var(--border))', background: on ? a.accent : 'transparent' }}
              >
                {on && <Icon name="Check" size={11} className="text-background" />}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <Icon name={s.icon} size={12} style={{ color: a.accent }} />
                  {s.name}
                </span>
                <span className="block text-[0.66rem] leading-snug text-muted-foreground">{s.desc}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export const RelicPicker = ({ a, c, patch }: PickerProps) => (
  <div className="flex flex-wrap gap-1.5">
    {a.accessories.map((r) => (
      <button
        key={r}
        type="button"
        onClick={() => patch({ relic: r })}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold tile-surface ${r === c.relic ? 'text-foreground' : 'text-muted-foreground'}`}
        style={ring(r === c.relic, a.accent)}
      >
        {r}
      </button>
    ))}
  </div>
);
