import { Switch } from '@/components/ui/switch';
import OptionGroup from '@/components/game/character/OptionGroup';
import ColorGroup from '@/components/game/character/ColorGroup';
import type { SectionProps } from '@/components/game/character/section-props';
import {
  FACE_SHAPES,
  EYE_COLORS,
  EYE_EFFECTS,
  BROW_SHAPES,
  BROW_DENSITY,
  BROW_COLORS,
  NOSES,
  LIPS,
  FACE_SCARS,
  SCAR_NATURE,
  FACE_TATTOOS,
} from '@/data/character-options';

const SectionFace = ({ character: c, set, toggle }: SectionProps) => (
  <div className="space-y-5">
    <OptionGroup
      title="Форма лица"
      options={FACE_SHAPES}
      value={c.faceShape}
      onSelect={(v) => set('faceShape', v)}
    />
    <ColorGroup
      title="Цвет глаз"
      options={EYE_COLORS}
      value={c.eyeColor}
      onSelect={(v) => set('eyeColor', v)}
    />
    <OptionGroup
      title="Эффекты глаз"
      options={EYE_EFFECTS}
      value={c.eyeEffects}
      onSelect={(v) => toggle('eyeEffects', v)}
    />
    <OptionGroup
      title="Брови · форма"
      options={BROW_SHAPES}
      value={c.browShape}
      onSelect={(v) => set('browShape', v)}
      columns={3}
    />
    <OptionGroup
      title="Брови · густота"
      options={BROW_DENSITY}
      value={c.browDensity}
      onSelect={(v) => set('browDensity', v)}
      columns={3}
    />
    <OptionGroup
      title="Брови · цвет"
      options={BROW_COLORS}
      value={c.browColor}
      onSelect={(v) => set('browColor', v)}
    />
    <OptionGroup title="Нос" options={NOSES} value={c.nose} onSelect={(v) => set('nose', v)} />
    <OptionGroup title="Губы" options={LIPS} value={c.lips} onSelect={(v) => set('lips', v)} />
    <OptionGroup
      title="Шрамы и отметины"
      options={FACE_SCARS}
      value={c.faceScars}
      onSelect={(v) => toggle('faceScars', v)}
    />
    <OptionGroup
      title="Характер шрамов"
      options={SCAR_NATURE}
      value={c.scarNature}
      onSelect={(v) => set('scarNature', v)}
    />
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3">
      <p className="min-w-0 flex-1 text-sm">Свечение шрамов</p>
      <Switch
        checked={c.glowingScars}
        onCheckedChange={(v) => set('glowingScars', v)}
        aria-label="Свечение шрамов"
      />
    </div>
    <OptionGroup
      title="Татуировки лица"
      options={FACE_TATTOOS}
      value={c.faceTattoos}
      onSelect={(v) => toggle('faceTattoos', v)}
    />
  </div>
);

export default SectionFace;
