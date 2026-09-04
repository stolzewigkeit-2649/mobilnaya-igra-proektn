import Icon from '@/components/ui/icon';

const ART_URL =
  'https://cdn.poehali.dev/projects/c4458224-623b-48e2-87b6-15ecc04308fd/files/a670e2cd-9df9-48ae-b41e-77203041c657.jpg';

export type MenuKey = 'scores' | 'rules' | 'settings' | 'awards';

type HeroCardProps = {
  onPlay: () => void;
  onMenu: (key: MenuKey) => void;
  chapter: string;
  weight: string;
};

const MENU: { key: MenuKey; label: string; icon: string }[] = [
  { key: 'scores', label: 'Рекорды', icon: 'Trophy' },
  { key: 'rules', label: 'Правила', icon: 'ScrollText' },
  { key: 'settings', label: 'Настройки', icon: 'Settings' },
  { key: 'awards', label: 'Награды', icon: 'Star' },
];

const HeroCard = ({ onPlay, onMenu, chapter, weight }: HeroCardProps) => {
  return (
    <section
      className="relative z-10 flex h-full max-h-[640px] w-full max-w-[1112px] animate-rise flex-col overflow-hidden rounded-lg panel-surface"
      aria-label="Главный экран Requiem pro Veritate"
    >
      {/* арт */}
      <div
        className="absolute right-0 top-0 h-full w-full bg-card bg-cover md:w-[640px]"
        style={{ backgroundImage: `url(${ART_URL})`, backgroundPosition: '58% 22%' }}
        role="img"
        aria-label="Некромант перед руинами храма лжебога"
      >
        <div className="absolute inset-0 art-scrim" />
      </div>

      {/* контент */}
      <div className="relative grid h-full w-full grid-rows-[auto_1fr_auto] px-6 pb-7 pt-8 sm:px-9 md:w-[610px] md:px-[52px] md:pb-10 md:pt-[46px]">
        {/* logo */}
        <header className="row-start-1 animate-fade [animation-delay:.1s]">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-secondary px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-foreground shadow-[inset_0_0_0_1px_hsl(var(--border))] sm:text-xs">
            <span className="h-[7px] w-[7px] animate-pulse-glow rounded-full bg-ink shadow-[0_0_10px_hsl(var(--btn-hi))]" />
            Открытый мир · 16+
          </span>
          <h1 className="mt-4 font-display text-[2.15rem] font-extrabold leading-[1.06] tracking-[-0.015em] sm:mt-5 sm:text-5xl md:text-[56px]">
            Requiem
            <span className="block italic text-ink">pro Veritate</span>
          </h1>
          <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-muted-foreground sm:text-[0.82rem]">
            Порча · Откровение · Правда
          </p>
          <p className="mt-4 max-w-[400px] text-sm leading-relaxed text-muted-foreground sm:text-base">
            Ты — некромант, ушедший из секты аврамистов. Боги дают дары, ты собираешь{' '}
            <b className="font-bold text-foreground">улики их лжи</b>.
          </p>
        </header>

        {/* play */}
        <div className="row-start-2 self-center py-3 animate-fade [animation-delay:.25s]">
          <button
            type="button"
            onClick={onPlay}
            className="flex h-14 w-full max-w-[430px] items-center justify-center gap-3.5 rounded-lg font-display text-base font-extrabold uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-200 btn-play-surface hover:scale-[1.02] active:scale-[0.99] sm:h-16 sm:text-lg"
          >
            <Icon name="Play" size={18} className="fill-current" />
            Играть
          </button>
          <div className="mt-3.5 flex w-full max-w-[430px] items-center gap-2.5 text-xs text-muted-foreground">
            <span>{chapter}</span>
            <span className="h-px flex-1 hairline" />
            <span>{weight}</span>
          </div>
        </div>

        {/* menu */}
        <nav className="row-start-3 grid w-full max-w-[430px] grid-cols-4 gap-2.5 animate-fade [animation-delay:.4s]">
          {MENU.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onMenu(item.key)}
              className="flex flex-col items-center gap-1.5 rounded-xl px-1.5 pb-2.5 pt-3 text-[0.68rem] font-semibold tracking-[0.04em] text-muted-foreground transition-colors tile-surface hover:text-foreground sm:text-[0.72rem]"
            >
              <Icon name={item.icon} size={19} className="text-ink" strokeWidth={1.6} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default HeroCard;
