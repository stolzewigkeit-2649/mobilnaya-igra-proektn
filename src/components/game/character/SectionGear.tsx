import OptionGroup from '@/components/game/character/OptionGroup';
import type { SectionProps } from '@/components/game/character/section-props';
import { NECKWEAR, RINGS, EARRINGS, BELTS, BRACERS, BAGS } from '@/data/character-gear';

const SectionGear = ({ character: c, toggle }: SectionProps) => (
  <div className="space-y-5">
    <OptionGroup
      title="Шейные"
      options={NECKWEAR}
      value={c.neckwear}
      onSelect={(v) => toggle('neckwear', v)}
    />
    <OptionGroup title="Перстни" options={RINGS} value={c.rings} onSelect={(v) => toggle('rings', v)} />
    <OptionGroup
      title="Серьги"
      options={EARRINGS}
      value={c.earrings}
      onSelect={(v) => toggle('earrings', v)}
    />
    <OptionGroup title="Пояса" options={BELTS} value={c.belts} onSelect={(v) => toggle('belts', v)} />
    <OptionGroup
      title="Наручи и браслеты"
      options={BRACERS}
      value={c.bracers}
      onSelect={(v) => toggle('bracers', v)}
    />
    <OptionGroup title="Сумки" options={BAGS} value={c.bags} onSelect={(v) => toggle('bags', v)} />
  </div>
);

export default SectionGear;
