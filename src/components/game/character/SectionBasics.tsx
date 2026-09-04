import OptionGroup from '@/components/game/character/OptionGroup';
import ColorGroup from '@/components/game/character/ColorGroup';
import { GENDERS, BUILDS, AGES, SKIN_COLORS } from '@/data/character-options';
import type { SectionProps } from '@/components/game/character/section-props';

const SectionBasics = ({ character: c, set }: SectionProps) => (
  <div className="space-y-5">
    <OptionGroup
      title="Пол"
      options={GENDERS}
      value={c.gender}
      onSelect={(v) => set('gender', v)}
      columns={3}
    />
    <OptionGroup
      title="Телосложение"
      options={BUILDS}
      value={c.build}
      onSelect={(v) => set('build', v)}
    />
    <OptionGroup
      title="Возраст"
      hint="влияет на морщины, осанку, голос"
      options={AGES}
      value={c.age}
      onSelect={(v) => set('age', v)}
    />
    <ColorGroup
      title="Цвет кожи"
      options={SKIN_COLORS}
      value={c.skin}
      onSelect={(v) => set('skin', v)}
    />
  </div>
);

export default SectionBasics;