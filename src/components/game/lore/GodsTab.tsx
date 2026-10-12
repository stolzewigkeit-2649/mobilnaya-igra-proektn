import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LORE_GODS } from '@/data/lore-gods';

const GodsTab = () => (
  <div className="space-y-3">
    <p className="text-xs leading-relaxed text-muted-foreground">
      Шесть имён. Пять богов дают дары и берут плату, шестого нет вовсе — но у него самый высокий
      шпиль. Нажми на имя, чтобы прочесть условия сделки.
    </p>

    <Accordion type="single" collapsible className="space-y-2.5">
      {LORE_GODS.map((g, i) => (
        <AccordionItem
          key={g.id}
          value={g.id}
          className="animate-fade overflow-hidden rounded-xl border border-border bg-card/60"
          style={{ animationDelay: `${0.05 * i}s` }}
        >
          <AccordionTrigger className="gap-3 px-3.5 py-3 hover:no-underline sm:px-4">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `radial-gradient(circle, ${g.glow}33 0%, transparent 72%)`,
                boxShadow: `inset 0 0 0 1px ${g.glow}55, 0 0 18px -6px ${g.glow}`,
                color: g.glow,
              }}
            >
              {g.portrait ? (
                <img src={g.portrait} alt={g.name} className="h-full w-full rounded-xl object-cover" />
              ) : (
                <Icon name={g.icon} size={19} strokeWidth={1.6} />
              )}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block font-display text-base font-bold leading-tight">{g.name}</span>
              <span className="mt-0.5 block text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
                {g.title}
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="space-y-3 px-3.5 pb-4 sm:px-4">
            {g.full && (
              <div
                className="relative -mx-3.5 flex justify-center overflow-hidden sm:-mx-4"
                style={{ background: `radial-gradient(ellipse at 50% 35%, ${g.glow}30 0%, transparent 65%)` }}
              >
                <img src={g.full} alt={g.name} loading="lazy" className="h-[340px] w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] sm:h-[420px]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
              </div>
            )}
            <p className="text-xs leading-relaxed text-foreground/90">{g.desc}</p>

            <p className="flex items-start gap-2 text-[0.7rem] leading-relaxed text-muted-foreground">
              <Icon name="Sigma" size={12} className="mt-0.5 shrink-0" style={{ color: g.glow }} />
              {g.symbol}
            </p>

            <div className="grid gap-2.5">
              <div
                className="rounded-lg p-3"
                style={{ background: `${g.glow}14`, boxShadow: `inset 0 0 0 1px ${g.glow}33` }}
              >
                <p className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em]">
                  <Icon name="Gift" size={12} style={{ color: g.glow }} />
                  <span style={{ color: g.glow }}>Дар · {g.giftName}</span>
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">{g.giftEffect}</p>
              </div>

              <div className="rounded-lg bg-destructive/10 p-3 shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.3)]">
                <p className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-destructive-foreground/80">
                  <Icon name="Skull" size={12} />
                  Цена
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">{g.price}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default GodsTab;
