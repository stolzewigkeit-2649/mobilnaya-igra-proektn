import Icon from '@/components/ui/icon';
import type { StoryBanner } from '@/data/story';

const SceneBanner = ({ banner, delay }: { banner: StoryBanner; delay: number }) => {
  const color = banner.color ?? 'hsl(var(--ink))';

  return (
    <div
      className="relative animate-rise overflow-hidden rounded-xl border bg-card/80 p-4"
      style={{
        animationDelay: `${delay}s`,
        borderColor: `${color}66`,
        boxShadow: `0 0 40px -14px ${color}, inset 0 0 30px -18px ${color}`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ background: color }}
      />
      <div className="relative flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/60"
          style={{ color, boxShadow: `0 0 0 1px ${color}55, 0 0 22px -6px ${color}` }}
        >
          <Icon name={banner.icon} size={20} strokeWidth={1.6} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-muted-foreground">
            {banner.kicker}
          </p>
          <p className="mt-0.5 font-display text-lg font-extrabold leading-tight" style={{ color }}>
            {banner.title}
          </p>
          <ul className="mt-2 space-y-1">
            {banner.lines.map((l) => (
              <li key={l} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/85">
                <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full" style={{ background: color }} />
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SceneBanner;
