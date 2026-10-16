import { Suspense, lazy, useState } from 'react';
import Icon from '@/components/ui/icon';
import { SCENE_ART } from '@/data/story';
import { useGameSettings } from '@/hooks/use-game-settings';

const CryptExperience = lazy(() => import('@/components/game/crypt3d/CryptExperience'));
const GraveExperience = lazy(() => import('@/components/game/crypt3d/grave/GraveExperience'));
const VillageExperience = lazy(() => import('@/components/game/crypt3d/village/VillageExperience'));
const CellarExperience = lazy(() => import('@/components/game/crypt3d/cellar/CellarExperience'));

type Kind = 'crypt' | 'grave' | 'village' | 'cellar';

const SCENES: { id: Kind; art: string; kicker: string; title: string; text: string; time: string; color: string }[] = [
  { id: 'crypt', art: 'p-awaken', kicker: 'Пролог', title: 'Склеп', text: 'Пробуждение на алтаре и встреча с Гекатой', time: '3–5 мин', color: '#7fb0ff' },
  { id: 'grave', art: 'p-sariel', kicker: 'Пролог', title: 'Кладбище', text: 'Первая душа, белый лоскут и Сариэл Лунный', time: '5–7 мин', color: '#b9c8ff' },
  { id: 'village', art: 'c1-village', kicker: 'Глава 1', title: 'Деревня', text: 'Белые ленты, амбар с телами и проповедник', time: '7–10 мин', color: '#d8c89a' },
  { id: 'cellar', art: 'c1-chapel', kicker: 'Глава 1', title: 'Подвал', text: 'Клетки, ритуальные круги и списки имён', time: '5–8 мин', color: '#d07a5f' },
];

const Scenes3DMenu = () => {
  const [open, setOpen] = useState<Kind | null>(null);
  const { settings } = useGameSettings();
  const volume = (settings.master / 100) * 0.9;
  const close = () => setOpen(null);

  return (
    <section className="space-y-2.5">
      <div className="flex items-center gap-2">
        <Icon name="Box" size={14} className="text-ink" />
        <h3 className="font-display text-xs font-bold uppercase tracking-[0.18em]">3D-сцены</h3>
        <span className="h-px flex-1 hairline" />
        <span className="text-[0.62rem] text-muted-foreground">не влияют на сюжет</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setOpen(s.id)}
            className="group relative overflow-hidden rounded-lg text-left tile-surface transition-transform hover:scale-[1.02]"
            style={{ boxShadow: `inset 0 0 0 1px ${s.color}30` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={SCENE_ART[s.art]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <span
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 opacity-80 backdrop-blur transition-opacity group-hover:opacity-100"
                style={{ color: s.color }}
              >
                <Icon name="Play" size={11} className="fill-current" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-2">
                <p className="truncate text-[0.55rem] font-bold uppercase tracking-[0.12em] text-white/60">{s.kicker}</p>
                <p className="truncate font-display text-[0.8rem] font-extrabold leading-tight text-white">{s.title}</p>
              </div>
            </div>
            <div className="hidden px-2 pb-2 pt-1.5 sm:block">
              <p className="line-clamp-2 text-[0.66rem] leading-snug text-muted-foreground">{s.text}</p>
              <p className="mt-1 flex items-center gap-1 text-[0.6rem] text-muted-foreground/80">
                <Icon name="Clock" size={10} />
                {s.time}
              </p>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black font-display italic text-white/70">
              Загружаю 3D…
            </div>
          }
        >
          {open === 'crypt' && <CryptExperience volume={volume} onComplete={close} onExit={close} />}
          {open === 'grave' && <GraveExperience volume={volume} onComplete={close} onExit={close} />}
          {open === 'village' && <VillageExperience volume={volume} onComplete={close} onExit={close} />}
          {open === 'cellar' && <CellarExperience volume={volume} onComplete={close} onExit={close} />}
        </Suspense>
      )}
    </section>
  );
};

export default Scenes3DMenu;
