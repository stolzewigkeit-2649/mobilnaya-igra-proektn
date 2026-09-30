import Icon from '@/components/ui/icon';
import { gendered } from '@/data/story/voice';
import type { StoryScene } from '@/data/story';

type SceneViewProps = {
  scene: StoryScene;
  gender: string;
};

const SceneView = ({ scene, gender }: SceneViewProps) => (
  <div key={scene.id} className="space-y-4">
    <header className="animate-fade">
      <p className="flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent"
          style={{ color: scene.glow ?? 'hsl(var(--ink))' }}
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
        style={{
          background: `linear-gradient(90deg, ${scene.glow ?? 'hsl(var(--ink))'}, transparent)`,
        }}
      />
    </header>

    <div className="space-y-3.5">
      {scene.text.map((p, i) => (
        <p
          key={i}
          className="animate-fade text-[0.94rem] leading-[1.75] text-foreground/88"
          style={{ animationDelay: `${0.12 + i * 0.22}s` }}
        >
          {gendered(p, gender)}
        </p>
      ))}
    </div>
  </div>
);

export default SceneView;
