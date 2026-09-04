import { Switch } from '@/components/ui/switch';
import OptionGroup from '@/components/game/character/OptionGroup';
import type { SectionProps } from '@/components/game/character/section-props';
import {
  BODY_SCARS,
  BODY_TATTOOS,
  SKIN_ANOMALIES,
  HANDS,
  GAITS,
} from '@/data/character-options';

const SectionBody = ({ character: c, set, toggle }: SectionProps) => (
  <div className="space-y-5">
    <OptionGroup
      title="Шрамы на теле"
      options={BODY_SCARS}
      value={c.bodyScars}
      onSelect={(v) => toggle('bodyScars', v)}
      columns={3}
    />
    <OptionGroup
      title="Татуировки туловища"
      options={BODY_TATTOOS}
      value={c.bodyTattoos}
      onSelect={(v) => toggle('bodyTattoos', v)}
    />
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3">
      <p className="min-w-0 flex-1 text-sm">Светящиеся в темноте</p>
      <Switch
        checked={c.glowingTattoos}
        onCheckedChange={(v) => set('glowingTattoos', v)}
        aria-label="Светящиеся в темноте"
      />
    </div>
    <OptionGroup
      title="Кожные аномалии"
      options={SKIN_ANOMALIES}
      value={c.anomalies}
      onSelect={(v) => toggle('anomalies', v)}
    />
    <OptionGroup title="Руки" options={HANDS} value={c.hands} onSelect={(v) => toggle('hands', v)} />
    <OptionGroup
      title="Ноги / походка"
      options={GAITS}
      value={c.gait}
      onSelect={(v) => set('gait', v)}
    />
  </div>
);

export default SectionBody;
