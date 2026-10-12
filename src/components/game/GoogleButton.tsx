import Icon from '@/components/ui/icon';

type Props = {
  onClick: () => void;
  pending?: boolean;
  note?: string;
  className?: string;
};

const GoogleMark = () => (
  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white font-display text-sm font-black text-[#4285F4]">
    G
  </span>
);

const GoogleButton = ({ onClick, pending, note, className = '' }: Props) => (
  <div className={className}>
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-ink/50 bg-secondary/80 px-4 text-sm font-bold text-foreground shadow-[0_0_24px_-10px_hsl(var(--btn-hi))] transition-all hover:border-ink hover:bg-secondary disabled:opacity-60"
    >
      {pending ? <Icon name="Loader" size={18} className="animate-spin text-ink" /> : <GoogleMark />}
      Войти через Google
    </button>
    {note && (
      <p className="mt-1.5 flex items-start justify-center gap-1.5 text-center text-[0.68rem] leading-relaxed text-muted-foreground">
        <Icon name="CloudUpload" size={12} className="mt-0.5 shrink-0 text-ink" />
        {note}
      </p>
    )}
  </div>
);

export default GoogleButton;
