import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useProfile } from '@/contexts/ProfileContext';
import { ARCHETYPES, defaultChoice, findArchetype } from '@/data/archetypes';
import FullscreenShell from '@/components/game/archetype/FullscreenShell';
import PortraitRail from '@/components/game/archetype/PortraitRail';
import HeroShowcase from '@/components/game/archetype/HeroShowcase';
import ArchetypeInfo, { ArchetypeHeading } from '@/components/game/archetype/ArchetypeInfo';

type ArchetypeSelectProps = { onClose: () => void; onChosen: () => void };

const ArchetypeSelect = ({ onClose, onChosen }: ArchetypeSelectProps) => {
  const { archetype, setArchetype } = useProfile();
  const [id, setId] = useState(archetype?.id ?? ARCHETYPES[0].id);
  const [lookIdx, setLookIdx] = useState(0);
  const a = findArchetype(id) ?? ARCHETYPES[0];
  const look = a.looks[lookIdx] ?? a.looks[0];

  const pick = (next: string) => {
    setId(next);
    setLookIdx(0);
  };

  const choose = () => {
    if (archetype?.id === a.id) setArchetype({ ...archetype, lookId: look.id });
    else setArchetype({ ...defaultChoice(a, archetype), lookId: look.id });
    onChosen();
  };

  return (
    <FullscreenShell
      title="Выбор некроманта"
      kicker="Requiem pro Veritate"
      accent={a.accent}
      onBack={onClose}
      footer={
        <button
          type="button"
          onClick={choose}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg px-4 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-primary-foreground transition-transform btn-play-surface hover:scale-[1.01] lg:ml-auto lg:max-w-[420px]"
        >
          <Icon name="Skull" size={16} />
          <span className="truncate">Выбрать: {a.name}</span>
        </button>
      }
    >
      <PortraitRail items={ARCHETYPES} value={a.id} current={archetype?.id} onSelect={pick} />

      <div className="mx-auto grid w-full max-w-[1100px] gap-4 px-4 pb-8 pt-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:px-6">
        <div className="relative">
          <HeroShowcase
            key={a.id}
            src={look.full}
            alt={a.name}
            glow={a.accent}
            className="h-[46vh] min-h-[300px] lg:h-[64vh] lg:max-h-[620px]"
          />
          {a.looks.length > 1 && (
            <div className="absolute inset-x-0 bottom-1 flex justify-center gap-1.5">
              {a.looks.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLookIdx(i)}
                  className={`rounded-full px-3 py-1 text-[0.66rem] font-bold backdrop-blur transition-colors ${
                    i === lookIdx ? 'bg-foreground/90 text-background' : 'bg-card/70 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div key={a.id} className="min-w-0 animate-fade-in space-y-4 lg:self-center">
          <ArchetypeHeading a={a} />
          <ArchetypeInfo a={a} />
        </div>
      </div>
    </FullscreenShell>
  );
};

export default ArchetypeSelect;
