import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GodsTab from '@/components/game/lore/GodsTab';
import HistoryTab from '@/components/game/lore/HistoryTab';
import FactionsTab from '@/components/game/lore/FactionsTab';

const TABS = [
  { value: 'gods', label: 'Пантеон', Tab: GodsTab },
  { value: 'history', label: 'Аврамисты', Tab: HistoryTab },
  { value: 'factions', label: 'Фракции', Tab: FactionsTab },
];

const LorePanel = () => (
  <Tabs defaultValue="gods" className="w-full">
    <TabsList className="grid w-full grid-cols-3 bg-secondary">
      {TABS.map((t) => (
        <TabsTrigger key={t.value} value={t.value} className="text-xs sm:text-sm">
          {t.label}
        </TabsTrigger>
      ))}
    </TabsList>

    {TABS.map(({ value, Tab }) => (
      <TabsContent key={value} value={value} className="mt-5 animate-fade-in">
        <Tab />
      </TabsContent>
    ))}
  </Tabs>
);

export default LorePanel;
