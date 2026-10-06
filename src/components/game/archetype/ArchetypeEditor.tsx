import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import SyncBadge from '@/components/game/SyncBadge';
import { ACTIVE_SKILLS, ARCHETYPES, defaultChoice, resolveChoice, type ArchetypeChoice } from '@/data/archetypes';
import FullscreenShell from '@/components/game/archetype/FullscreenShell';
import HeroShowcase from '@/components/game/archetype/HeroShowcase';
import {
  Block,
  LookPicker,
  MagicPicker,
  RelicPicker,
  SkillPicker,
  VariantPicker,
} from '@/components/game/archetype/EditorPickers';

type ArchetypeEditorProps = {
  onClose: () => void;
  onDone: () => void;
  onFineTune: () => void;
  onChangeArchetype: () => void;
};

const ArchetypeEditor = ({ onClose, onDone, onFineTune, onChangeArchetype }: ArchetypeEditorProps) => {
  const { archetype, setArchetype, signedIn, status, flushNow } = useProfile();
  const c: ArchetypeChoice = archetype ?? defaultChoice(ARCHETYPES[0]);
  const r = resolveChoice(c) ?? resolveChoice(defaultChoice(ARCHETYPES[0]))!;
  const { archetype: a, look, variant, magic } = r;

  const patch = (p: Partial<ArchetypeChoice>) => setArchetype({ ...c, ...p });

  const done = () => {
    if (!archetype) setArchetype(c);
    void flushNow();
    toast({
      title: `${c.name.trim() || a.name} готов`,
      description:
        signedIn && status !== 'error' ? 'Облик сохранён в аккаунте.' : 'Облик сохранён на этом устройстве.',
    });
    onDone();
  };

  return (
    <FullscreenShell
      title={c.name.trim() || 'Редактор героя'}
      kicker={`${a.name} · ${variant.label}`}
      accent={magic}
      onBack={onClose}
      backIcon="ArrowLeft"
      aside={<SyncBadge compact className="hidden shrink-0 min-[380px]:inline-flex" />}
      footer={
        <div className="grid grid-cols-[auto_1fr] gap-2 lg:flex lg:justify-end">
          <button
            type="button"
            onClick={onFineTune}
            className="flex h-12 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold text-foreground tile-surface hover:brightness-125"
          >
            <Icon name="UserRoundCog" size={15} className="text-ink" />
            <span className="hidden min-[400px]:inline">Тонкая настройка облика</span>
            <span className="min-[400px]:hidden">Тонко</span>
          </button>
          <button
            type="button"
            onClick={done}
            className="flex h-12 items-center justify-center gap-2 rounded-lg px-6 font-display text-sm font-extrabold uppercase tracking-[0.16em] text-primary-foreground btn-play-surface lg:min-w-[240px]"
          >
            <Icon name="Check" size={16} />
            Готово
          </button>
        </div>
      }
    >
      <div className="mx-auto grid w-full max-w-[1100px] gap-5 px-4 pb-8 pt-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8 lg:px-6">
        <div className="lg:sticky lg:top-4 lg:self-start">
          <HeroShowcase
            src={look.full}
            alt={a.name}
            glow={magic}
            filter={variant.filter}
            className="h-[42vh] min-h-[280px] lg:h-[68vh] lg:max-h-[640px]"
          />
          <div className="mt-2 flex items-center justify-center gap-2 text-[0.7rem] text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: magic, boxShadow: `0 0 8px ${magic}` }} />
            {a.name} · {c.relic}
            <button
              type="button"
              onClick={onChangeArchetype}
              className="ml-1 text-ink underline-offset-4 hover:underline"
            >
              сменить
            </button>
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <Block title="Имя героя" hint={`${c.name.length}/24`}>
            <input
              value={c.name}
              maxLength={24}
              onChange={(e) => patch({ name: e.target.value.slice(0, 24) })}
              placeholder="Как тебя звали до секты?"
              className="h-11 w-full rounded-lg bg-transparent px-3.5 font-display text-sm font-bold text-foreground outline-none tile-surface placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground focus:shadow-[inset_0_0_0_1px_hsl(var(--btn-hi))]"
            />
          </Block>

          {a.looks.length > 1 && (
            <Block title="Облик">
              <LookPicker a={a} c={c} patch={patch} />
            </Block>
          )}

          <Block title="Цветовой вариант" hint={variant.label}>
            <VariantPicker a={a} c={c} patch={patch} face={look.face} />
          </Block>

          <Block title="Цвет магии и ауры">
            <MagicPicker c={c} patch={patch} />
          </Block>

          <Block title="Активные навыки" hint={`${c.skills.length}/${ACTIVE_SKILLS}`}>
            <SkillPicker a={a} c={c} patch={patch} />
          </Block>

          <Block title="Реликвия">
            <RelicPicker a={a} c={c} patch={patch} />
          </Block>
        </div>
      </div>
    </FullscreenShell>
  );
};

export default ArchetypeEditor;
