import Icon from '@/components/ui/icon';
import type { Character } from '@/hooks/use-character';
import { derive, summary } from '@/components/game/character/preview-style';
import PreviewFace from '@/components/game/character/PreviewFace';

type CharacterPreviewProps = {
  character: Character;
};

const CharacterPreview = ({ character: c }: CharacterPreviewProps) => {
  const d = derive(c);
  const wide = c.build === 'massive' ? 150 : c.build === 'athletic' ? 132 : c.build === 'slim' ? 104 : 118;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card/60">
      <div className="pointer-events-none absolute inset-0 scene-grid opacity-40" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(70% 55% at 50% 22%, ${d.magic}26 0%, transparent 70%)` }}
      />

      <div className="relative flex h-[290px] items-end justify-center pb-0">
        {c.aura.includes('shadows') && (
          <div
            className="pointer-events-none absolute bottom-0 h-56 w-56 animate-pulse-glow rounded-full blur-2xl"
            style={{ background: `${d.magic}44` }}
          />
        )}

        <div className="relative flex flex-col items-center">
          {c.aura.includes('sparks') && (
            <>
              <span
                className="absolute bottom-16 left-1 h-1.5 w-1.5 animate-pulse-glow rounded-full"
                style={{ background: d.magic, boxShadow: `0 0 8px ${d.magic}` }}
              />
              <span
                className="absolute bottom-24 right-2 h-1 w-1 animate-pulse-glow rounded-full [animation-delay:.8s]"
                style={{ background: d.magic, boxShadow: `0 0 8px ${d.magic}` }}
              />
            </>
          )}

          <PreviewFace character={c} derived={d} />

          <div
            className="-mt-5 h-[168px] rounded-t-[46%]"
            style={{
              width: wide,
              background: `linear-gradient(180deg, ${d.faction.color} 0%, ${d.faction.color}dd 46%, hsl(var(--background)) 100%)`,
              boxShadow: `inset 0 1px 0 ${d.faction.color}, 0 -8px 34px -10px ${d.magic}77`,
              clipPath:
                c.faction === 'exiles'
                  ? 'polygon(0 0, 100% 0, 100% 88%, 84% 100%, 62% 86%, 40% 100%, 16% 88%, 0 100%)'
                  : undefined,
            }}
          >
            {d.hooded && (
              <div
                className="mx-auto h-14 w-full rounded-t-[46%] opacity-90"
                style={{ background: `linear-gradient(180deg, ${d.faction.color} 0%, transparent 100%)` }}
              />
            )}
            {c.aura.includes('bone-spikes') && (
              <div className="flex justify-between px-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-3 w-1.5 rounded-t-full bg-[#d9d5c8]/80"
                    style={{ transform: `rotate(${i < 2 ? -18 : 18}deg)` }}
                  />
                ))}
              </div>
            )}
            {c.aura.includes('skin-runes') && (
              <div
                className="mx-auto mt-4 h-10 w-10 animate-pulse-glow rounded-full"
                style={{ boxShadow: `0 0 16px ${d.magic}`, border: `1px solid ${d.magic}` }}
              />
            )}
          </div>

          {c.aura.includes('steam') && (
            <div
              className="pointer-events-none absolute bottom-0 h-10 w-40 animate-pulse-glow rounded-full blur-md"
              style={{ background: `${d.magic}33` }}
            />
          )}
          {c.aura.includes('flies') && (
            <span className="absolute bottom-28 right-0 text-ink">
              <Icon name="Bug" size={12} className="animate-pulse-glow" />
            </span>
          )}
          {c.aura.includes('feathers') && (
            <span className="absolute left-0 top-8 text-ink/80">
              <Icon name="Feather" size={16} strokeWidth={1.4} />
            </span>
          )}
        </div>
      </div>

      <div className="relative border-t border-border px-4 py-3">
        <p className="font-display text-sm font-bold leading-tight text-foreground">{summary(c)}</p>
        <p className="mt-1 flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
          <Icon name={d.faction.icon} size={12} className="text-ink" />
          {d.faction.label}
          <span className="h-2 w-2 rounded-full" style={{ background: d.magic }} />
        </p>
      </div>
    </div>
  );
};

export default CharacterPreview;