import type { ReactNode } from 'react';
import Icon from '@/components/ui/icon';

type FullscreenShellProps = {
  title: string;
  kicker: string;
  accent: string;
  onBack: () => void;
  backIcon?: string;
  aside?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

const FullscreenShell = ({
  title,
  kicker,
  accent,
  onBack,
  backIcon = 'X',
  aside,
  footer,
  children,
}: FullscreenShellProps) => (
  <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background">
    <div className="pointer-events-none absolute inset-0 scene-glow opacity-60" />
    <div
      className="pointer-events-none absolute inset-0 transition-[background] duration-700"
      style={{ background: `radial-gradient(90% 60% at 50% 0%, ${accent}2e 0%, transparent 70%)` }}
    />
    <div className="pointer-events-none absolute inset-0 scene-grid opacity-20" />

    <header className="relative z-10 flex items-center gap-3 border-b border-border bg-card/70 px-3 py-2.5 backdrop-blur-sm sm:px-5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Назад"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors tile-surface hover:text-foreground"
      >
        <Icon name={backIcon} size={17} />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.62rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {kicker}
        </p>
        <h2 className="truncate font-display text-base font-extrabold leading-tight sm:text-lg">
          {title}
        </h2>
      </div>
      {aside}
    </header>

    <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
      {children}
    </div>

    {footer && (
      <footer className="relative z-10 border-t border-border bg-card/85 px-3 py-3 backdrop-blur sm:px-5">
        <div className="mx-auto w-full max-w-[1100px]">{footer}</div>
      </footer>
    )}
  </div>
);

export default FullscreenShell;
