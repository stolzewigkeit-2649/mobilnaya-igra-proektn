import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ, RULES_BASICS, RULES_STEPS } from '@/data/game';

const RulesPanel = () => (
  <div className="space-y-6">
    <div className="grid gap-2.5 sm:grid-cols-2">
      {RULES_BASICS.map((b) => (
        <div key={b.title} className="rounded-xl border border-border bg-card/60 p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-ink">
            <Icon name={b.icon} size={17} strokeWidth={1.6} />
          </span>
          <h3 className="mt-3 font-display text-base font-bold">{b.title}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{b.text}</p>
        </div>
      ))}
    </div>

    <div>
      <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Путь отступника
      </h3>
      <ol className="mt-3 space-y-2.5">
        {RULES_STEPS.map((s, i) => (
          <li key={s} className="flex gap-3 rounded-xl tile-surface px-3.5 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-foreground/90">{s}</span>
          </li>
        ))}
      </ol>
    </div>

    <div>
      <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Частые вопросы
      </h3>
      <Accordion type="single" collapsible className="mt-1">
        {FAQ.map((f) => (
          <AccordionItem key={f.q} value={f.q} className="border-border">
            <AccordionTrigger className="text-left text-sm font-semibold hover:text-ink">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);

export default RulesPanel;
