import type { Option } from '@/data/character-options';

type ColorGroupProps = {
  title: string;
  options: Option[];
  value: string;
  onSelect: (id: string) => void;
};

const ColorGroup = ({ title, options, value, onSelect }: ColorGroupProps) => {
  const current = options.find((o) => o.id === value);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h3>
        {current && <span className="text-[0.7rem] text-ink">{current.label}</span>}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              title={o.desc ? `${o.label} — ${o.desc}` : o.label}
              aria-label={o.label}
              onClick={() => onSelect(o.id)}
              className={`h-8 w-8 rounded-full transition-transform ${
                active ? 'scale-110 ring-2 ring-offset-2 ring-offset-background' : 'hover:scale-105'
              }`}
              style={{
                background: o.color,
                boxShadow: active
                  ? `0 0 14px ${o.color}, inset 0 0 0 1px hsl(var(--border))`
                  : 'inset 0 0 0 1px hsl(var(--border))',
                ...(active ? { outline: '2px solid hsl(var(--btn-hi))', outlineOffset: '2px' } : {}),
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColorGroup;
