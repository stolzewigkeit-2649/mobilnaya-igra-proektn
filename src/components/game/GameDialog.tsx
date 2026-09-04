import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

type GameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: string;
  title: string;
  description: string;
  children: ReactNode;
};

const GameDialog = ({
  open,
  onOpenChange,
  icon,
  title,
  description,
  children,
}: GameDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="panel-surface max-h-[88vh] w-[calc(100vw-24px)] max-w-2xl gap-0 overflow-hidden rounded-lg border-border p-0 text-foreground">
      <div className="pointer-events-none absolute inset-0 scene-grid opacity-30" />
      <DialogHeader className="relative border-b border-border px-5 py-4 sm:px-7">
        <DialogTitle className="flex items-center gap-3 font-display text-xl font-extrabold tracking-tight sm:text-2xl">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-ink">
            <Icon name={icon} size={18} />
          </span>
          {title}
        </DialogTitle>
        <DialogDescription className="pt-1 text-sm text-muted-foreground">
          {description}
        </DialogDescription>
      </DialogHeader>
      <div className="relative max-h-[64vh] overflow-y-auto px-5 py-5 sm:px-7">{children}</div>
    </DialogContent>
  </Dialog>
);

export default GameDialog;
