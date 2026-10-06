import Icon from '@/components/ui/icon';
import { gendered } from '@/data/story/voice';
import { CHAPTERS, SCENE_ART, type StoryScene } from '@/data/story';
import SceneText from '@/components/game/story/SceneText';
import SceneBanner from '@/components/game/story/SceneBanner';

type SceneViewProps = {
  scene: StoryScene;
  gender: string;
  note: string | null;
};

const SceneView = ({ scene, gender, note }: SceneViewProps) => {
  const glow = scene.glow ?? 'hsl(var(--ink))';
  const chapter = CHAPTERS[scene.chapter];
  const textDelay = (i: number) => 0.12 + i * 0.18;
  const afterText = textDelay(scene.text.length);
  const art = SCENE_ART[scene.id];

  return (
    <div className="space-y-4">
      {scene.chapterStart && (
        <div className="animate-rise pb-2 pt-1 text-center">
          <p className="text-[0.64rem] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            {chapter.kicker}
          </p>
          <p
            className="mt-1.5 font-display text-xl font-extrabold uppercase tracking-[0.08em] sm:text-2xl"
            style={{ color: glow, textShadow: `0 0 28px ${glow}` }}
          >
            {chapter.title}
          </p>
        </div>
      )}

      {art && (
        <div
          className="relative -mx-1 animate-fade overflow-hidden rounded-xl border border-border"
          style={{ boxShadow: `0 20px 50px -24px ${glow}` }}
        >
          <img
            src={art}
            alt={scene.title}
            className="aspect-[16/9] w-full scale-[1.02] object-cover"
            loading="eager"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
          <div
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{ background: `radial-gradient(circle at 50% 120%, ${glow}55, transparent 60%)` }}
          />
        </div>
      )}

      <header className="animate-fade">
        <p className="flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent"
            style={{ color: glow }}
          >
            <Icon name={scene.icon} size={14} strokeWidth={1.7} />
          </span>
          <span className="min-w-0 break-words">{scene.place}</span>
        </p>
        <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          {gendered(scene.title, gender)}
        </h2>
        <span
          className="mt-3 block h-px w-full"
          style={{ background: `linear-gradient(90deg, ${glow}, transparent)` }}
        />
      </header>

      {scene.objective && (
        <p className="flex animate-fade items-start gap-2 rounded-lg border border-ink/30 bg-accent/60 px-3 py-2 text-xs font-semibold leading-relaxed text-foreground">
          <Icon name="Target" size={14} className="mt-0.5 shrink-0 text-ink" />
          <span>
            <span className="text-muted-foreground">Задание: </span>
            {scene.objective}
          </span>
        </p>
      )}

      <div className="space-y-3.5">
        {scene.text.map((p, i) => (
          <SceneText key={`${scene.id}-${i}`} line={p} gender={gender} delay={textDelay(i)} />
        ))}
      </div>

      {scene.banner && <SceneBanner banner={scene.banner} delay={afterText} />}

      {note && (
        <div
          key={note}
          className="animate-fade rounded-xl border border-border bg-card/70 px-4 py-3"
          style={{ animationDelay: `${afterText}s` }}
        >
          <p className="mb-1 flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink">
            <Icon name="Feather" size={11} />
            Последствие
          </p>
          <SceneText line={note} gender={gender} delay={0} />
        </div>
      )}
    </div>
  );
};

export default SceneView;
