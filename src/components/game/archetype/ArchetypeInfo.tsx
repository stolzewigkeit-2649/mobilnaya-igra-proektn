import Icon from '@/components/ui/icon';
import { godOf, type Archetype } from '@/data/archetypes';

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div>
    <div className="flex justify-between text-[0.7rem] text-muted-foreground">
      <span>{label}</span>
      <span className="font-bold text-foreground/90">{value}</span>
    </div>
    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full transition-[width] duration-700"
        style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
      />
    </div>
  </div>
);

export const ArchetypeHeading = ({ a }: { a: Archetype }) => (
  <div className="text-center lg:text-left">
    <h3 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">{a.name}</h3>
    <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: a.accent }}>
      {a.subtitle}
    </p>
    <p className="mx-auto mt-2.5 max-w-[520px] text-sm italic leading-relaxed text-foreground/85 lg:mx-0">
      «{a.tagline}»
    </p>
    <div className="mt-3 flex flex-wrap justify-center gap-1.5 lg:justify-start">
      {a.role.map((r) => (
        <span
          key={r}
          className="rounded-full px-2.5 py-1 text-[0.66rem] font-bold text-foreground"
          style={{ background: `${a.accent}33`, boxShadow: `inset 0 0 0 1px ${a.accent}77` }}
        >
          {r}
        </span>
      ))}
      {a.attributes.map((t) => (
        <span key={t} className="rounded-full px-2.5 py-1 text-[0.66rem] font-semibold text-muted-foreground tile-surface">
          {t}
        </span>
      ))}
    </div>
    <p className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.7rem] text-muted-foreground lg:justify-start">
      <span className="flex items-center gap-1">
        <Icon name="Ruler" size={12} className="text-ink" /> {a.height} см
      </span>
      <span className="flex items-center gap-1">
        <Icon name="Hourglass" size={12} className="text-ink" /> {a.age} лет
      </span>
    </p>
  </div>
);

const ArchetypeInfo = ({ a }: { a: Archetype }) => {
  const god = godOf(a);

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">{a.concept}</p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-xl p-3.5 tile-surface">
        {a.stats.map((s) => (
          <StatBar key={s.label} label={s.label} value={s.value} color={a.accent} />
        ))}
      </div>

      <div>
        <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Навыки
        </p>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {a.skills.map((s) => (
            <li key={s.id} className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 tile-surface">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                style={{ background: `${a.accent}2a`, color: a.accent }}
              >
                <Icon name={s.icon} size={14} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-foreground">{s.name}</span>
                <span className="block text-[0.68rem] leading-snug text-muted-foreground">{s.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {a.summons && (
        <div>
          <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Призываемые
          </p>
          <div className="flex flex-wrap gap-1.5">
            {a.summons.map((s) => (
              <span key={s.name} title={s.desc} className="rounded-full px-2.5 py-1 text-[0.66rem] text-foreground/85 tile-surface">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {god && (
        <div className="flex items-start gap-3 rounded-xl p-3.5 tile-surface" style={{ boxShadow: `inset 0 0 0 1px ${god.glow}44` }}>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${god.glow}22`, color: god.glow }}
          >
            <Icon name={god.icon} size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Покровитель</p>
            <p className="font-display text-sm font-bold">
              {god.name} <span className="font-normal text-muted-foreground">· {god.title}</span>
            </p>
            <p className="mt-1 text-[0.68rem] leading-snug text-muted-foreground">{god.giftName}: {god.giftEffect}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchetypeInfo;
