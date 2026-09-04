import type { Option } from '@/data/character-options';

export type Faction = {
  id: string;
  label: string;
  color: string;
  icon: string;
  items: Option[];
};

export const FACTIONS: Faction[] = [
  {
    id: 'bones',
    label: 'Коалиция Костей',
    color: '#3d4a44',
    icon: 'Bone',
    items: [
      { id: 'bones-robe', label: 'Робы из чёрного бархата с костяными нашивками' },
      { id: 'bones-cloak', label: 'Плащи с капюшонами из грубой шерсти' },
      { id: 'bones-armor', label: 'Кожаные доспехи с позвонками' },
      { id: 'bones-metal', label: 'Металл в виде черепов' },
      { id: 'bones-helm', label: 'Шлемы-личины' },
      { id: 'bones-boots', label: 'Сапоги на толстой подошве' },
    ],
  },
  {
    id: 'silence',
    label: 'Орден Тишины',
    color: '#c9d2d4',
    icon: 'Bell',
    items: [
      { id: 'silence-cloth', label: 'Белые/серые/серебряные ткани', desc: 'лён, шёлк' },
      { id: 'silence-shroud', label: 'Длинные саваны с капюшонами' },
      { id: 'silence-bells', label: 'Нагрудные колокола' },
      { id: 'silence-chains', label: 'Пояса-вериги' },
      { id: 'silence-gloves', label: 'Мягкие кожаные перчатки' },
      { id: 'silence-shoes', label: 'Сандалии/сапоги без каблука' },
    ],
  },
  {
    id: 'traders',
    label: 'Совет Торговцев',
    color: '#a97a2e',
    icon: 'Coins',
    items: [
      { id: 'traders-cloth', label: 'Пёстрые ткани', desc: 'бархат, парча' },
      { id: 'traders-furs', label: 'Экзотические меха' },
      { id: 'traders-hat', label: 'Широкополые шляпы' },
      { id: 'traders-feathers', label: 'Перья' },
      { id: 'traders-masks', label: 'Маски' },
      { id: 'traders-rings', label: 'Перстни и броши' },
      { id: 'traders-cloak', label: 'Плащи с шёлковой подкладкой' },
      { id: 'traders-boots', label: 'Высокие сапоги с отворотами' },
    ],
  },
  {
    id: 'exiles',
    label: 'Изгнанные (Шёпот)',
    color: '#5a4436',
    icon: 'Skull',
    items: [
      { id: 'exiles-rags', label: 'Лохмотья' },
      { id: 'exiles-cloak', label: 'Порванные плащи с капюшонами' },
      { id: 'exiles-armor', label: 'Потёртые кожаные доспехи' },
      { id: 'exiles-pants', label: 'Рваные штаны' },
      { id: 'exiles-wraps', label: 'Обмотки' },
      { id: 'exiles-patches', label: 'Заплатки с демоническими символами' },
      { id: 'exiles-chains', label: 'Цепи' },
      { id: 'exiles-spikes', label: 'Шипы' },
    ],
  },
];

export const COMMON_WEAR: Option[] = [
  { id: 'cloak-short', label: 'Плащ короткий' },
  { id: 'cloak-long', label: 'Плащ длинный' },
  { id: 'cloak-hood', label: 'Плащ с капюшоном' },
  { id: 'cape', label: 'Накидка' },
  { id: 'pauldrons', label: 'Наплечники' },
  { id: 'belt-charms', label: 'Пояс с подвесками' },
  { id: 'chainmail', label: 'Кольчуга' },
  { id: 'brigandine', label: 'Бригантина' },
  { id: 'gauntlets', label: 'Латные рукавицы' },
];

export const HOODS: Option[] = [
  { id: 'plain', label: 'Простой' },
  { id: 'fur', label: 'С меховой опушкой' },
  { id: 'embroidered', label: 'С вышивкой' },
  { id: 'bone', label: 'С костяным каркасом' },
];

export const HATS: Option[] = [
  { id: 'wide', label: 'Широкополая' },
  { id: 'top', label: 'Цилиндр', desc: 'готический' },
  { id: 'tricorn', label: 'Треуголка' },
  { id: 'felt', label: 'Мягкая фетровая' },
];

export const CROWNS: Option[] = [
  { id: 'bone', label: 'Из костей' },
  { id: 'shards', label: 'Из металла с осколками' },
  { id: 'thorns', label: 'Терновый венец' },
  { id: 'runes', label: 'Обруч с рунами' },
];

export const MASKS: Option[] = [
  { id: 'half', label: 'Полумаска', desc: 'только глаза' },
  { id: 'skull', label: 'Полностью закрывающая: скелет' },
  { id: 'beast', label: 'Полностью закрывающая: зверь' },
  { id: 'demon', label: 'Полностью закрывающая: демон' },
  { id: 'venetian', label: 'Венецианская' },
  { id: 'ritual', label: 'Ритуальная', desc: 'с вырезами для губ' },
];

export const BLINDFOLDS: Option[] = [
  { id: 'cloth', label: 'Тканевая' },
  { id: 'leather', label: 'Кожаная' },
  { id: 'embroidered', label: 'С вышивкой' },
  { id: 'one-eye', label: 'Закрывающая один глаз' },
];

export const NECKWEAR: Option[] = [
  { id: 'amulet-shard', label: 'Амулет: осколок' },
  { id: 'amulet-key', label: 'Амулет: ключ Гекаты' },
  { id: 'amulet-torch', label: 'Амулет: факел' },
  { id: 'amulet-bell', label: 'Амулет: колокол' },
  { id: 'amulet-skull', label: 'Амулет: череп' },
  { id: 'amulet-snake', label: 'Амулет: змея' },
  { id: 'amulet-coin', label: 'Амулет: монета' },
  { id: 'necklace-teeth', label: 'Ожерелье из зубов' },
  { id: 'necklace-bones', label: 'Ожерелье из костей' },
  { id: 'necklace-crystals', label: 'Ожерелье из кристаллов' },
  { id: 'chains', label: 'Цепи с подвесками' },
];

export const RINGS: Option[] = [
  { id: 'stones', label: 'С камнями' },
  { id: 'seals', label: 'С печатями' },
  { id: 'runic', label: 'Рунные' },
  { id: 'massive', label: 'Массивные' },
];

export const EARRINGS: Option[] = [
  { id: 'hoops', label: 'Кольца' },
  { id: 'pendants', label: 'Подвески' },
  { id: 'long-chains', label: 'Длинные цепочки' },
  { id: 'studs', label: 'Гвоздики' },
];

export const BELTS: Option[] = [
  { id: 'leather', label: 'Кожаные' },
  { id: 'buckles', label: 'С пряжками' },
  { id: 'trophies', label: 'С сумками и трофеями', desc: 'черепа, флаконы, книги' },
];

export const BRACERS: Option[] = [
  { id: 'metal', label: 'Металлические' },
  { id: 'bone', label: 'Костяные' },
  { id: 'runes', label: 'С рунами' },
  { id: 'chains', label: 'С цепями' },
];

export const BAGS: Option[] = [
  { id: 'shoulder', label: 'Через плечо' },
  { id: 'waist', label: 'На поясе' },
  { id: 'embroidered', label: 'С вышивкой' },
];

export const AURA_EFFECTS: Option[] = [
  { id: 'eye-glow', label: 'Свечение глаз', desc: 'лёгкий ореол, цвет по выбору' },
  { id: 'shadows', label: 'Тени вокруг тела', desc: 'дымчатый шлейф' },
  { id: 'sparks', label: 'Искры осколков', desc: 'частицы у рук', locked: true },
  { id: 'steam', label: 'Пар/дымка', desc: 'от стоп или всей фигуры' },
  { id: 'skin-runes', label: 'Символы на коже', desc: 'светящиеся руны фракции', locked: true },
  { id: 'bone-spikes', label: 'Костные наросты', desc: 'шипы на плечах, позвоночнике, ключицах', locked: true },
  { id: 'feathers', label: 'Перья/крылья', desc: 'перья в волосах или на одежде', locked: true },
  { id: 'flies', label: 'Личинки/мухи', desc: 'для Живых Реликтов', locked: true },
];

export const VOICES: Option[] = [
  { id: 'low', label: 'Низкий' },
  { id: 'high', label: 'Высокий' },
  { id: 'hoarse', label: 'Хриплый' },
  { id: 'lisping', label: 'Шепелявый' },
];

export const POSTURES: Option[] = [
  { id: 'straight', label: 'Прямая' },
  { id: 'stooped', label: 'Сутулая' },
  { id: 'proud', label: 'Горделивая' },
  { id: 'secretive', label: 'Скрытная' },
];

export const MOVEMENTS: Option[] = [
  { id: 'smooth', label: 'Плавный' },
  { id: 'sharp', label: 'Резкий' },
  { id: 'clumsy', label: 'Неуклюжий' },
  { id: 'gliding', label: 'Скользящий' },
];

export const MAGIC_COLORS: Option[] = [
  { id: 'violet', label: 'Фиолетовый', desc: 'по умолчанию', color: '#9b59d0' },
  { id: 'blue', label: 'Синий', color: '#4a86e8' },
  { id: 'green', label: 'Зелёный', color: '#5ec27e' },
  { id: 'gold', label: 'Золотой', color: '#f2c14e' },
];
