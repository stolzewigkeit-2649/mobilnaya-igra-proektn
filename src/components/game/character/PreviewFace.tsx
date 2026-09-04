import type { Character } from '@/hooks/use-character';
import type { derive } from '@/components/game/character/preview-style';

type PreviewFaceProps = {
  character: Character;
  derived: ReturnType<typeof derive>;
};

const PreviewFace = ({ character: c, derived: d }: PreviewFaceProps) => {
  const eyeShadow = d.hasGlow ? `0 0 10px ${d.eye}, 0 0 20px ${d.eye}` : 'none';

  return (
    <div className="relative z-10 flex flex-col items-center">
      <div
        className="absolute z-0"
        style={{
          top: -Math.round(d.hairShape.h * 0.34),
          width: d.hairShape.w,
          height: d.hairShape.h,
          borderRadius: d.hairShape.radius,
          background: `linear-gradient(180deg, ${d.hair} 0%, ${d.hair}cc 60%, ${d.hair}55 100%)`,
          boxShadow: `0 0 0 1px ${d.hair}, 0 -6px 26px -8px ${d.hair}`,
          filter: c.hairstyle === 'curly' ? 'blur(1.5px)' : undefined,
        }}
      />

      <div
        className="relative z-10 h-[104px] w-[88px]"
        style={{
          borderRadius: d.faceRadius,
          background: `linear-gradient(170deg, ${d.skin} 0%, ${d.skin}cc 72%, ${d.skin}88 100%)`,
          boxShadow: `inset 0 -10px 22px -10px #000, 0 0 26px -12px ${d.magic}`,
        }}
      >
        {c.anomalies.includes('veins') && (
          <div
            className="absolute inset-0 opacity-40"
            style={{
              borderRadius: d.faceRadius,
              background:
                'repeating-linear-gradient(52deg, transparent 0 7px, rgba(40,70,90,.5) 7px 8px)',
            }}
          />
        )}
        {c.anomalies.includes('goldveins') && (
          <div
            className="absolute inset-0 opacity-50"
            style={{
              borderRadius: d.faceRadius,
              background:
                'repeating-linear-gradient(-40deg, transparent 0 9px, rgba(242,193,78,.55) 9px 10px)',
            }}
          />
        )}

        <div className="absolute left-0 right-0 top-[42%] flex justify-center gap-3.5">
          {[0, 1].map((i) => (
            <span
              key={i}
              className={`relative flex h-[11px] w-[16px] items-center justify-center rounded-full ${
                d.hasGlow ? 'animate-pulse-glow' : ''
              }`}
              style={{
                background: d.noIris ? '#f2f4f2' : `${d.eye}`,
                boxShadow: eyeShadow,
              }}
            >
              {!d.noIris && (
                <span
                  className="absolute rounded-full bg-black/85"
                  style={{
                    width: d.slitPupils ? 3 : 5,
                    height: d.slitPupils ? 9 : 5,
                    left: d.doublePupils ? 3 : undefined,
                  }}
                />
              )}
              {d.doublePupils && !d.noIris && (
                <span
                  className="absolute right-[3px] rounded-full bg-black/85"
                  style={{ width: d.slitPupils ? 3 : 4, height: d.slitPupils ? 9 : 4 }}
                />
              )}
            </span>
          ))}
        </div>

        <div className="absolute left-0 right-0 top-[32%] flex justify-center gap-3.5">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="block w-[17px] rounded-full"
              style={{
                height: c.browDensity === 'thick' ? 4 : c.browDensity === 'sparse' ? 1.5 : 2.5,
                background: c.browColor === 'contrast' ? '#dcd6c8' : d.hair,
                transform:
                  c.browShape === 'arch'
                    ? `rotate(${i ? 8 : -8}deg)`
                    : c.browShape === 'break'
                      ? `skewY(${i ? -12 : 12}deg)`
                      : undefined,
                opacity: 0.9,
              }}
            />
          ))}
        </div>

        <span
          className="absolute left-1/2 top-[52%] -translate-x-1/2 rounded-full"
          style={{
            width: c.nose === 'wide' ? 12 : 5,
            height: c.nose === 'long' ? 20 : 13,
            background: 'rgba(0,0,0,.22)',
            transform: `translateX(-50%) ${c.nose === 'hooked' ? 'skewX(-14deg)' : ''}`,
          }}
        />

        <span
          className="absolute left-1/2 top-[74%] -translate-x-1/2 rounded-full"
          style={{
            width: c.lips === 'full' ? 26 : c.lips === 'thin' ? 16 : 21,
            height: c.lips === 'full' ? 6 : c.lips === 'thin' ? 2 : 4,
            background: 'rgba(0,0,0,.32)',
            transform: `translateX(-50%) ${c.lips === 'asymmetric' ? 'rotate(-7deg)' : ''}`,
            borderTop: c.lips === 'cracked' ? '1px dashed rgba(255,255,255,.35)' : undefined,
          }}
        />

        {c.faceScars.length > 0 && (
          <span
            className="absolute left-[22%] top-[18%] h-[46px] w-[2px] rotate-[18deg] rounded-full"
            style={{
              background: c.glowingScars ? d.magic : 'rgba(0,0,0,.45)',
              boxShadow: c.glowingScars ? `0 0 8px ${d.magic}` : undefined,
            }}
          />
        )}
        {c.faceTattoos.length > 0 && (
          <span
            className="absolute right-[16%] top-[36%] h-[22px] w-[22px] rounded-full opacity-70"
            style={{ border: `1.5px solid ${d.magic}` }}
          />
        )}

        {c.mask && (
          <div
            className="absolute inset-x-0 top-[26%] h-[34px]"
            style={{
              background: `linear-gradient(180deg, ${d.faction.color}f2, ${d.faction.color}cc)`,
              borderRadius: '40% 40% 30% 30% / 50% 50% 40% 40%',
              boxShadow: `0 0 14px -4px ${d.magic}`,
            }}
          />
        )}
        {c.blindfold && (
          <div
            className="absolute top-[38%] h-[13px]"
            style={{
              background: '#1c1f1d',
              left: c.blindfold === 'one-eye' ? '10%' : 0,
              right: c.blindfold === 'one-eye' ? '48%' : 0,
            }}
          />
        )}
        {c.crown && (
          <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-[3px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-3 w-[3px] rounded-t-full"
                style={{ background: c.crown === 'bone' ? '#ded8c6' : d.magic }}
              />
            ))}
          </div>
        )}
      </div>

      {c.hat && (
        <div
          className="absolute -top-8 z-20 h-4 rounded-[50%]"
          style={{ width: c.hat === 'wide' ? 138 : 86, background: d.faction.color }}
        />
      )}
    </div>
  );
};

export default PreviewFace;