import OptionGroup from '@/components/game/character/OptionGroup';
import ColorGroup from '@/components/game/character/ColorGroup';
import type { SectionProps } from '@/components/game/character/section-props';
import { HAIRSTYLES, HAIR_COLORS } from '@/data/character-options';
import { HOODS, HATS, CROWNS, MASKS, BLINDFOLDS } from '@/data/character-gear';

const SectionHead = ({ character: c, set }: SectionProps) => (
  <div className="space-y-5">
    <OptionGroup
      title="Причёска"
      options={HAIRSTYLES}
      value={c.hairstyle}
      onSelect={(v) => set('hairstyle', v)}
    />
    <ColorGroup
      title="Цвет волос"
      options={HAIR_COLORS}
      value={c.hairColor}
      onSelect={(v) => set('hairColor', v)}
    />
    <OptionGroup
      title="Капюшон"
      hint="повторное нажатие снимает"
      options={HOODS}
      value={c.hood}
      onSelect={(v) => set('hood', v)}
      clearable
    />
    <OptionGroup
      title="Шляпа"
      options={HATS}
      value={c.hat}
      onSelect={(v) => set('hat', v)}
      clearable
    />
    <OptionGroup
      title="Короны и диадемы"
      options={CROWNS}
      value={c.crown}
      onSelect={(v) => set('crown', v)}
      clearable
    />
    <OptionGroup
      title="Маски"
      options={MASKS}
      value={c.mask}
      onSelect={(v) => set('mask', v)}
      clearable
    />
    <OptionGroup
      title="Повязки на глаза"
      options={BLINDFOLDS}
      value={c.blindfold}
      onSelect={(v) => set('blindfold', v)}
      clearable
    />
  </div>
);

export default SectionHead;
