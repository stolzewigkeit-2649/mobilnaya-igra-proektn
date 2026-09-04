import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { useCharacter } from '@/hooks/use-character';
import CharacterPreview from '@/components/game/character/CharacterPreview';
import SectionBasics from '@/components/game/character/SectionBasics';
import SectionFace from '@/components/game/character/SectionFace';
import SectionBody from '@/components/game/character/SectionBody';
import SectionWear from '@/components/game/character/SectionWear';
import SectionHead from '@/components/game/character/SectionHead';
import SectionGear from '@/components/game/character/SectionGear';
import SectionAura from '@/components/game/character/SectionAura';
import SectionMisc from '@/components/game/character/SectionMisc';
import { summary } from '@/components/game/character/preview-style';

const TABS = [
  { value: 'basics', label: 'Основа', Section: SectionBasics },
  { value: 'face', label: 'Лицо', Section: SectionFace },
  { value: 'body', label: 'Тело', Section: SectionBody },
  { value: 'wear', label: 'Одежда', Section: SectionWear },
  { value: 'head', label: 'Голова', Section: SectionHead },
  { value: 'gear', label: 'Аксессуары', Section: SectionGear },
  { value: 'aura', label: 'Аура', Section: SectionAura },
  { value: 'misc', label: 'Прочее', Section: SectionMisc },
];

const CharacterCreator = () => {
  const { character, set, toggle, randomize, reset } = useCharacter();

  return (
    <div className="space-y-4">
      <CharacterPreview character={character} />

      <Tabs defaultValue="basics" className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-max bg-secondary">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="text-xs">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>

        {TABS.map(({ value, Section }) => (
          <TabsContent key={value} value={value} className="mt-5 animate-fade-in">
            <Section character={character} set={set} toggle={toggle} />
          </TabsContent>
        ))}
      </Tabs>

      <div className="sticky bottom-0 -mx-1 space-y-3 border-t border-border bg-card/95 px-1 pb-1 pt-3 backdrop-blur">
        <p className="text-[0.7rem] leading-tight text-muted-foreground">
          <span className="text-ink">{summary(character)}</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={randomize}
            className="flex h-10 items-center justify-center gap-2 rounded-lg text-[0.72rem] font-semibold text-foreground transition-colors tile-surface hover:brightness-125"
          >
            <Icon name="Dices" size={14} className="text-ink" />
            Случайный герой
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex h-10 items-center justify-center gap-2 rounded-lg text-[0.72rem] font-semibold text-muted-foreground transition-colors tile-surface hover:text-foreground"
          >
            <Icon name="RotateCcw" size={14} className="text-ink" />
            Сбросить
          </button>
        </div>
        <button
          type="button"
          onClick={() =>
            toast({
              title: 'Герой сохранён',
              description: `${summary(character)} — облик записан на этом устройстве.`,
            })
          }
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg font-display text-sm font-extrabold uppercase tracking-[0.18em] text-primary-foreground transition-transform btn-play-surface hover:scale-[1.02]"
        >
          <Icon name="Save" size={15} />
          Сохранить героя
        </button>
      </div>
    </div>
  );
};

export default CharacterCreator;