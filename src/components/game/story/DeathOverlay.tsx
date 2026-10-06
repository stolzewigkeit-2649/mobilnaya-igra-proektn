import Icon from '@/components/ui/icon';

type DeathOverlayProps = { deaths: number; sanity: number; onRise: () => void };

const DeathOverlay = ({ deaths, sanity, onRise }: DeathOverlayProps) => (
  <div className="absolute inset-0 z-20 flex animate-fade-in items-center justify-center bg-black/90 p-6 backdrop-blur-sm">
    <div className="w-full max-w-sm text-center">
      <span
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[#b98ae0]"
        style={{ boxShadow: '0 0 0 1px #9b59d066, 0 0 60px -10px #9b59d0' }}
      >
        <Icon name="Infinity" size={28} strokeWidth={1.4} />
      </span>
      <p className="mt-5 text-[0.64rem] font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Смерть №{deaths}
      </p>
      <h3 className="mt-2 font-display text-2xl font-extrabold">Смерть вернула тебя</h3>
      <p className="mt-3 text-sm italic leading-relaxed text-[#b98ae0]">
        — Пока твоя работа не закончена…
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Ты снова в начале главы. Найденное до неё — с тобой. Цена возвращения: рассудок теперь не
        выше {sanity}.
      </p>
      <button
        type="button"
        onClick={onRise}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2.5 rounded-lg font-display text-sm font-extrabold uppercase tracking-[0.16em] text-primary-foreground btn-play-surface"
      >
        <Icon name="Sunrise" size={15} />
        Подняться
      </button>
    </div>
  </div>
);

export default DeathOverlay;
