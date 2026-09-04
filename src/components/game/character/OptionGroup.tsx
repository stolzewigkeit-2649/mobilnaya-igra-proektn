import Icon from '@/components/ui/icon';
import type { Option } from '@/data/character-options';

type OptionGroupProps = {
  title: string;
  hint?: string;
  options: Option[];
  value: string | string[];
  onSelect: (id: string) => void;
  columns?: 2 | 3;
  clearable?: boolean;
};

const OptionGroup = ({
  title,
  hint,
  options,
  value,
  onSelect,
  columns = 2,
  clearable,
}: OptionGroupProps) => {
  const multiple = Array.isArray(value);
  const isActive = (id: string) => (multiple ? value.includes(id) : value === id);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h3>
        {hint && <span className="text-[0.68rem] text-muted-foreground/70">{hint}</span>}
      </div>

      <div className={`grid gap-2 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((o) => {
          const active = isActive(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onSelect(active && clearable && !multiple ? '' : o.id)}
              className={`flex min-w-0 items-start gap-2 rounded-xl px-2.5 py-2.5 text-left transition-all tile-surface ${
                active
                  ? 'text-foreground shadow-[inset_0_0_0_1px_hsl(var(--btn-hi))]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="mt-0.5 shrink-0 text-ink">
                <Icon
                  name={o.locked ? 'Lock' : active ? 'CircleCheck' : 'Circle'}
                  size={13}
                  strokeWidth={1.8}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block break-words text-[0.72rem] font-semibold leading-tight">
                  {o.label}
                </span>
                {o.desc && (
                  <span className="mt-0.5 block break-words text-[0.64rem] leading-tight text-muted-foreground">
                    {o.desc}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OptionGroup;
