import Icon from '@/components/ui/icon';
import type { Archetype } from '@/data/archetypes';

type PortraitRailProps = {
  items: Archetype[];
  value: string;
  current?: string | null;
  onSelect: (id: string) => void;
};

const PortraitRail = ({ items, value, current, onSelect }: PortraitRailProps) => (
  <div className="flex justify-center gap-3 px-3 pb-1 pt-4 sm:gap-5">
    {items.map((a) => {
      const active = a.id === value;
      return (
        <button
          key={a.id}
          type="button"
          onClick={() => onSelect(a.id)}
          aria-pressed={active}
          className={`group flex w-[86px] flex-col items-center gap-1.5 transition-all duration-300 sm:w-[104px] ${
            active ? 'scale-105' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <span
            className="relative block aspect-square w-full overflow-hidden rounded-xl border-2 transition-all duration-300"
            style={{
              borderColor: active ? a.accent : 'hsl(var(--border))',
              boxShadow: active ? `0 0 26px -2px ${a.accent}, inset 0 0 18px ${a.accent}55` : 'none',
            }}
          >
            <img
              src={a.looks[0].face}
              alt={a.name}
              className={`h-full w-full object-cover transition-all duration-300 ${
                active ? '' : 'grayscale-[.6] group-hover:grayscale-0'
              }`}
            />
            {current === a.id && (
              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-ink">
                <Icon name="Check" size={12} />
              </span>
            )}
          </span>
          <span
            className={`line-clamp-2 w-full text-center font-display text-[0.7rem] font-bold leading-tight sm:text-xs ${
              active ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {a.name}
          </span>
        </button>
      );
    })}
  </div>
);

export default PortraitRail;
