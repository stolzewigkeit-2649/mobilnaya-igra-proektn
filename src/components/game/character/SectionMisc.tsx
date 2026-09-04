import OptionGroup from '@/components/game/character/OptionGroup';
import type { SectionProps } from '@/components/game/character/section-props';
import { VOICES, POSTURES, MOVEMENTS } from '@/data/character-gear';

const SectionMisc = ({ character: c, set }: SectionProps) => (
  <div className="space-y-5">
    <OptionGroup title="Голос" options={VOICES} value={c.voice} onSelect={(v) => set('voice', v)} />
    <OptionGroup
      title="Осанка"
      options={POSTURES}
      value={c.posture}
      onSelect={(v) => set('posture', v)}
    />
    <OptionGroup
      title="Стиль движения"
      options={MOVEMENTS}
      value={c.movement}
      onSelect={(v) => set('movement', v)}
    />
  </div>
);

export default SectionMisc;
