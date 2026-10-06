import Icon from '@/components/ui/icon';
import { useProfile } from '@/contexts/ProfileContext';
import { resolveChoice } from '@/data/archetypes';

type HeroSummaryProps = { onSelect: () => void; onEdit: () => void };

const HeroSummary = ({ onSelect, onEdit }: HeroSummaryProps) => {
  const { archetype } = useProfile();
  const r = archetype ? resolveChoice(archetype) : null;

  if (!archetype || !r) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-4 text-left transition-all tile-surface hover:brightness-125"
        style={{ boxShadow: 'inset 0 0 0 1px #7c3aed88, 0 0 28px -10px #7c3aed' }}
      >
        <span className="flex -space-x-3">
          {['/necro/psy1-face.webp', '/necro/rot-face.webp', '/necro/abyss-face.webp'].map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="h-10 w-10 rounded-full border-2 border-card object-cover"
            />
          ))}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm font-extrabold text-foreground">
            Выбери некроманта
          </span>
          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
            Психопомп, Жрец Порчи или Призыватель Бездны
          </span>
        </span>
        <Icon name="ChevronRight" size={16} className="shrink-0 text-ink" />
      </button>
    );
  }

  const { archetype: a, look, variant, magic } = r;

  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3 tile-surface"
      style={{ boxShadow: `inset 0 0 0 1px ${a.accent}66` }}
    >
      <img
        src={look.face}
        alt={a.name}
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
        style={{ filter: variant.filter, boxShadow: `0 0 18px -4px ${magic}` }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-extrabold text-foreground">
          {archetype.name.trim() || 'Безымянный'}
        </p>
        <p className="truncate text-xs text-ink">{a.name}</p>
        <p className="truncate text-[0.66rem] text-muted-foreground">
          {variant.label} · {look.label}
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-1.5">
        <button
          type="button"
          onClick={onSelect}
          className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[0.7rem] font-semibold text-muted-foreground tile-surface hover:text-foreground"
        >
          <Icon name="Repeat2" size={13} className="text-ink" />
          Сменить
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[0.7rem] font-semibold text-muted-foreground tile-surface hover:text-foreground"
        >
          <Icon name="Pencil" size={13} className="text-ink" />
          Редактор
        </button>
      </div>
    </div>
  );
};

export default HeroSummary;
