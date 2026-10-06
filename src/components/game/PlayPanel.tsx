import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { NECRO_KINDS } from '@/data/game';
import { findArchetype } from '@/data/archetypes';
import { useProfile } from '@/contexts/ProfileContext';
import type { Difficulty } from '@/hooks/use-game-settings';
import HeroSummary from '@/components/game/play/HeroSummary';
import StoryControls from '@/components/game/play/StoryControls';
import WorldTab from '@/components/game/play/WorldTab';
import GodsTab from '@/components/game/play/GodsTab';

type PlayPanelProps = {
  difficulty: Difficulty;
  hasSave: boolean;
  onOpenSettings: () => void;
  onOpenCharacter: () => void;
  onOpenSelect: () => void;
  onOpenEditor: () => void;
  onStartStory: () => void;
  onResetStory: () => void;
};

const PlayPanel = ({
  difficulty,
  hasSave,
  onOpenSettings,
  onOpenCharacter,
  onOpenSelect,
  onOpenEditor,
  onStartStory,
  onResetStory,
}: PlayPanelProps) => {
  const { archetype } = useProfile();
  const chosen = findArchetype(archetype?.id);
  const [kindId, setKindId] = useState(chosen?.linkedKind ?? NECRO_KINDS[0].id);
  const kind = NECRO_KINDS.find((k) => k.id === kindId) ?? NECRO_KINDS[0];
  const heroLabel = archetype?.name.trim() || chosen?.name || kind.name;

  return (
    <Tabs defaultValue="kind" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-secondary">
        <TabsTrigger value="kind" className="text-xs sm:text-sm">
          Вид
        </TabsTrigger>
        <TabsTrigger value="world" className="text-xs sm:text-sm">
          Мир
        </TabsTrigger>
        <TabsTrigger value="gods" className="text-xs sm:text-sm">
          Боги
        </TabsTrigger>
      </TabsList>

      <TabsContent value="kind" className="mt-5 space-y-4">
        <HeroSummary onSelect={onOpenSelect} onEdit={onOpenEditor} />

        <button
          type="button"
          onClick={onOpenCharacter}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all tile-surface hover:brightness-125"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon name="UserRoundCog" size={17} strokeWidth={1.6} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-sm font-bold text-foreground">
              Настроить внешность
            </span>
            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
              Конструктор героя: плоть, облачение, аура
            </span>
          </span>
          <Icon name="ChevronRight" size={16} className="shrink-0 text-ink" />
        </button>

        <div>
          <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Школа магии
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {NECRO_KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setKindId(k.id)}
                className={`flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center text-xs font-semibold transition-all tile-surface ${
                  k.id === kindId
                    ? 'text-foreground shadow-[inset_0_0_0_1px_hsl(var(--btn-hi))]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={k.icon} size={20} className="text-ink" strokeWidth={1.6} />
                {k.name}
              </button>
            ))}
          </div>
        </div>

        <div key={kind.id} className="animate-fade-in rounded-xl border border-border bg-card/60 p-4">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {kind.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{kind.desc}</p>
          <div className="mt-4 space-y-2.5">
            {kind.stats.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{s.label}</span>
                  <span className="text-ink">{s.value}</span>
                </div>
                <Progress value={s.value} className="mt-1 h-1.5 bg-secondary" />
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-accent px-3 py-2.5 text-xs leading-relaxed text-accent-foreground">
            <Icon name="Sparkles" size={14} className="mt-0.5 shrink-0" />
            {kind.gift}
          </p>
        </div>

        <StoryControls
          difficulty={difficulty}
          hasSave={hasSave}
          heroLabel={heroLabel}
          onOpenSettings={onOpenSettings}
          onStartStory={onStartStory}
          onResetStory={onResetStory}
        />
      </TabsContent>

      <TabsContent value="world" className="mt-5">
        <WorldTab />
      </TabsContent>

      <TabsContent value="gods" className="mt-5">
        <GodsTab />
      </TabsContent>
    </Tabs>
  );
};

export default PlayPanel;
