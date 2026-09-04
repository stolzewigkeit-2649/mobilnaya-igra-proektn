import Icon from '@/components/ui/icon';
import OptionGroup from '@/components/game/character/OptionGroup';
import ColorGroup from '@/components/game/character/ColorGroup';
import type { SectionProps } from '@/components/game/character/section-props';
import { AURA_EFFECTS, MAGIC_COLORS } from '@/data/character-gear';

const SectionAura = ({ character: c, set, toggle }: SectionProps) => (
  <div className="space-y-5">
    <p className="flex items-start gap-2 rounded-lg bg-accent px-3 py-2.5 text-xs leading-relaxed text-accent-foreground">
      <Icon name="Sparkles" size={14} className="mt-0.5 shrink-0" />
      Продвинутые эффекты — за достижения или благословение богов.
    </p>
    <OptionGroup
      title="Особые эффекты и аура"
      options={AURA_EFFECTS}
      value={c.aura}
      onSelect={(v) => toggle('aura', v)}
    />
    <ColorGroup
      title="Цвет магии"
      options={MAGIC_COLORS}
      value={c.magicColor}
      onSelect={(v) => set('magicColor', v)}
    />
  </div>
);

export default SectionAura;
