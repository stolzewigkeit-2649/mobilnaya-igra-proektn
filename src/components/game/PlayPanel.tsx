import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { NECRO_KINDS, REGIONS, DEITIES } from '@/data/game';
import { DIFFICULTY_INFO, type Difficulty } from '@/hooks/use-game-settings';
import { toast } from '@/hooks/use-toast';

type PlayPanelProps = {
  difficulty: Difficulty;
  onOpenSettings: () => void;
};

const PlayPanel = ({ difficulty, onOpenSettings }: PlayPanelProps) => {
  const [kindId, setKindId] = useState(NECRO_KINDS[0].id);
  const kind = NECRO_KINDS.find((k) => k.id === kindId)!;
  const diff = DIFFICULTY_INFO[difficulty];

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

      {/* Вид некроманта */}
      <TabsContent value="kind" className="mt-5 space-y-4">
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <Icon name={diff.icon} size={14} />
            Сложность: {diff.name} · очки {diff.multiplier}
          </button>
          <button
            type="button"
            onClick={() =>
              toast({
                title: `${kind.name} выходит из скита`,
                description: `Глава I. Пепел храма · сложность «${diff.name}». Сохранение создано.`,
              })
            }
            className="flex h-11 items-center justify-center gap-2.5 rounded-lg px-6 font-display text-sm font-extrabold uppercase tracking-[0.18em] text-primary-foreground transition-transform btn-play-surface hover:scale-[1.02]"
          >
            <Icon name="Play" size={15} className="fill-current" />
            Начать
          </button>
        </div>
      </TabsContent>

      {/* Открытый мир */}
      <TabsContent value="world" className="mt-5 space-y-2.5">
        {REGIONS.map((r) => (
          <div
            key={r.id}
            className={`rounded-xl border border-border p-4 transition-colors ${
              r.status === 'locked' ? 'opacity-60' : 'hover:border-ink/40'
            } bg-card/60`}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-ink">
                <Icon name={r.status === 'locked' ? 'Lock' : r.icon} size={17} strokeWidth={1.6} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h3 className="font-display text-base font-bold">{r.name}</h3>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    {r.chapter}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={r.progress} className="h-1.5 flex-1 bg-secondary" />
                  <span className="text-[0.7rem] text-ink">{r.progress}%</span>
                </div>
                <p className="mt-2 text-[0.7rem] text-muted-foreground">{r.clue}</p>
              </div>
            </div>
          </div>
        ))}
      </TabsContent>

      {/* Боги */}
      <TabsContent value="gods" className="mt-5 space-y-2.5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Боги не любят друг друга, но все ненавидят лжебога аврамистов. Чем выше благосклонность,
          тем щедрее дар и откровение.
        </p>
        {DEITIES.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card/60 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-ink">
                <Icon name={d.icon} size={17} strokeWidth={1.6} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-bold">{d.name}</h3>
                <p className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {d.domain}
                </p>
              </div>
              <span className="text-sm font-bold text-ink">{d.favor}</span>
            </div>
            <Progress value={d.favor} className="mt-3 h-1.5 bg-secondary" />
            <p className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Gift" size={13} className="text-ink" />
              {d.gift}
            </p>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default PlayPanel;
