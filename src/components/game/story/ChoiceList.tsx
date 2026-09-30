import Icon from '@/components/ui/icon';
import type { StoryChoice } from '@/data/story';
import type { LockReason } from '@/hooks/use-story';

type ChoiceListProps = {
  items: { choice: StoryChoice; lock: LockReason }[];
  delay: number;
  onPick: (id: string) => void;
};

const ChoiceList = ({ items, delay, onPick }: ChoiceListProps) => (
  <div className="space-y-2">
    {items.map(({ choice, lock }, i) => (
      <button
        key={choice.id}
        type="button"
        disabled={!!lock}
        onClick={() => onPick(choice.id)}
        style={{ animationDelay: `${delay + i * 0.08}s` }}
        className={`flex w-full animate-fade items-start gap-3 rounded-xl px-4 py-3 text-left transition-all tile-surface ${
          lock
            ? 'cursor-not-allowed opacity-45'
            : 'hover:brightness-[1.35] hover:shadow-[inset_0_0_0_1px_hsl(var(--btn-hi)/0.6)] active:scale-[0.995]'
        }`}
      >
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
            lock ? 'bg-secondary text-muted-foreground' : 'bg-accent text-ink'
          }`}
        >
          <Icon name={lock ? 'Lock' : 'ChevronRight'} size={13} strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-snug text-foreground">
            {choice.label}
          </span>
          {(lock || choice.hint) && (
            <span
              className={`mt-1 block text-xs leading-relaxed ${
                lock ? 'text-destructive/80' : 'text-muted-foreground'
              }`}
            >
              {lock ?? choice.hint}
            </span>
          )}
        </span>
      </button>
    ))}
  </div>
);

export default ChoiceList;
