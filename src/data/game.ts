export type NecroKind = {
  id: string;
  name: string;
  title: string;
  icon: string;
  desc: string;
  stats: { label: string; value: number }[];
  gift: string;
};

export const NECRO_KINDS: NecroKind[] = [
  {
    id: 'ossarius',
    name: 'Оссарий',
    title: 'Костяная плоть',
    icon: 'Bone',
    desc: 'Собирает армию из праха павших послушников секты. Медленно начинает, но к третьей главе ведёт за собой хор костей.',
    stats: [
      { label: 'Сила', value: 78 },
      { label: 'Порча', value: 54 },
      { label: 'Воля', value: 41 },
    ],
    gift: 'Дар Морраны — павший враг встаёт на твою сторону на 30 секунд.',
  },
  {
    id: 'lachrimos',
    name: 'Лакримос',
    title: 'Плакальщик',
    icon: 'Droplet',
    desc: 'Читает память мёртвых и вытаскивает из них показания против аврамистов. Слабый в бою, незаменимый в дознании.',
    stats: [
      { label: 'Сила', value: 34 },
      { label: 'Порча', value: 62 },
      { label: 'Воля', value: 88 },
    ],
    gift: 'Откровение Веспера — видишь последний час жизни любого трупа.',
  },
  {
    id: 'tenebrant',
    name: 'Тенебрант',
    title: 'Тот, кто гасит',
    icon: 'Moon',
    desc: 'Ходит в тени храмов, снимает печати и режет проповедников до того, как те успеют позвать стражу.',
    stats: [
      { label: 'Сила', value: 57 },
      { label: 'Порча', value: 84 },
      { label: 'Воля', value: 49 },
    ],
    gift: 'Милость Ун-Скара — три удара из тени бьют без шума и следа.',
  },
  {
    id: 'kadaver',
    name: 'Кадавер',
    title: 'Носитель гнили',
    icon: 'Skull',
    desc: 'Сам себе чума: раны питают его, а прикосновение растит порчу на камне и людях. Аврамисты зовут его мерзостью.',
    stats: [
      { label: 'Сила', value: 69 },
      { label: 'Порча', value: 91 },
      { label: 'Воля', value: 30 },
    ],
    gift: 'Печать Гниющей Матери — урон по площади и восстановление здоровья.',
  },
];

export type Region = {
  id: string;
  name: string;
  chapter: string;
  icon: string;
  status: 'open' | 'locked';
  desc: string;
  clue: string;
  progress: number;
};

export const REGIONS: Region[] = [
  {
    id: 'ash',
    name: 'Пепел храма',
    chapter: 'Глава I',
    icon: 'Flame',
    status: 'open',
    desc: 'Выжженный скит, из которого ты ушёл. Под алтарём — списки тех, кого записали в «вознесённые».',
    clue: 'Улика: гроссбух пожертвований',
    progress: 62,
  },
  {
    id: 'marsh',
    name: 'Топь Плакальщиц',
    chapter: 'Глава I',
    icon: 'Waves',
    status: 'open',
    desc: 'Болото, куда секта сбрасывала неудобных свидетелей. Мёртвые здесь говорливы.',
    clue: 'Улика: печать дознавателя',
    progress: 28,
  },
  {
    id: 'library',
    name: 'Книгохранилище Ври',
    chapter: 'Глава II',
    icon: 'Library',
    status: 'open',
    desc: 'Библиотека, где переписали священные тексты. Оригиналы жгли, но не все.',
    clue: 'Улика: первая редакция канона',
    progress: 9,
  },
  {
    id: 'spire',
    name: 'Шпиль Лжебога',
    chapter: 'Глава III',
    icon: 'Church',
    status: 'locked',
    desc: 'Сердце культа. Откроется, когда соберёшь семь улик и три дара.',
    clue: 'Требуется 7 улик',
    progress: 0,
  },
];

export type Deity = {
  id: string;
  name: string;
  domain: string;
  icon: string;
  gift: string;
  favor: number;
};

export const DEITIES: Deity[] = [
  {
    id: 'morrana',
    name: 'Моррана',
    domain: 'Тишина и кости',
    icon: 'Bone',
    gift: 'Поднятие павшего',
    favor: 74,
  },
  {
    id: 'vesper',
    name: 'Веспер',
    domain: 'Память и сумерки',
    icon: 'Eye',
    gift: 'Откровение последнего часа',
    favor: 48,
  },
  {
    id: 'unskar',
    name: 'Ун-Скар',
    domain: 'Тень и клинок',
    icon: 'Moon',
    gift: 'Три бесшумных удара',
    favor: 33,
  },
  {
    id: 'mater',
    name: 'Гниющая Мать',
    domain: 'Порча и рост',
    icon: 'Sprout',
    gift: 'Печать распада',
    favor: 12,
  },
];

export type ScoreRow = {
  place: number;
  player: string;
  kind: string;
  clues: number;
  score: number;
  you?: boolean;
};

export const SCORES: ScoreRow[] = [
  { place: 1, player: 'Vhorn', kind: 'Тенебрант', clues: 41, score: 128740 },
  { place: 2, player: 'Мёртвая Ольга', kind: 'Лакримос', clues: 39, score: 121305 },
  { place: 3, player: 'grave_ic', kind: 'Кадавер', clues: 36, score: 117980 },
  { place: 4, player: 'Sable', kind: 'Оссарий', clues: 34, score: 104220 },
  { place: 5, player: 'Немой Пастырь', kind: 'Тенебрант', clues: 31, score: 99510 },
  { place: 6, player: 'kostya.exe', kind: 'Кадавер', clues: 29, score: 92180 },
  { place: 7, player: 'Ирма из Топи', kind: 'Лакримос', clues: 27, score: 88040 },
  { place: 12, player: 'Ты', kind: 'Оссарий', clues: 18, score: 54390, you: true },
];

export type Achievement = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  reward: string;
  progress: number;
  total: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-blood',
    name: 'Отступник',
    desc: 'Покинуть скит аврамистов и пережить первую ночь.',
    icon: 'DoorOpen',
    reward: 'Плащ пепла',
    progress: 1,
    total: 1,
  },
  {
    id: 'clues',
    name: 'Дознаватель',
    desc: 'Собрать 20 улик заговора.',
    icon: 'ScrollText',
    reward: '+2 к Воле',
    progress: 18,
    total: 20,
  },
  {
    id: 'gifts',
    name: 'Многобожец',
    desc: 'Принять дары четырёх богов.',
    icon: 'Sparkles',
    reward: 'Алтарь странника',
    progress: 3,
    total: 4,
  },
  {
    id: 'silent',
    name: 'Немая проповедь',
    desc: 'Пройти Книгохранилище, не подняв тревоги.',
    icon: 'EyeOff',
    reward: 'Титул «Тихий»',
    progress: 0,
    total: 1,
  },
  {
    id: 'army',
    name: 'Хор костей',
    desc: 'Держать 12 поднятых одновременно.',
    icon: 'Users',
    reward: 'Скин: костяная корона',
    progress: 7,
    total: 12,
  },
  {
    id: 'truth',
    name: 'Requiem pro Veritate',
    desc: 'Обнародовать правду о лжебоге.',
    icon: 'Crown',
    reward: 'Финальная концовка',
    progress: 0,
    total: 1,
  },
];

export const RULES_BASICS = [
  {
    icon: 'Move',
    title: 'Движение',
    text: 'Левая половина экрана — виртуальный стик. Мир открытый: границ глав нет, но в закрытые области не пустят печати.',
  },
  {
    icon: 'Swords',
    title: 'Бой',
    text: 'Правая — три кнопки: удар, дар бога и порча. Дары перезаряжаются от благосклонности, а не от маны.',
  },
  {
    icon: 'Search',
    title: 'Дознание',
    text: 'Тела и предметы можно «прочесть». Каждая улика — шаг к разоблачению секты и очки в таблицу рекордов.',
  },
  {
    icon: 'HeartPulse',
    title: 'Смерть',
    text: 'Смерть не финал: ты возвращаешься на алтарь, теряя часть благосклонности. На высокой сложности — ещё и улику.',
  },
];

export const RULES_STEPS = [
  'Выбери вид некроманта — он задаёт стиль боя и первый дар.',
  'Выйди из скита и найди первый алтарь: он станет точкой возрождения.',
  'Собирай улики в каждой области — они открывают следующую главу.',
  'Проси дары у богов: чем выше благосклонность, тем сильнее откровение.',
  'Не попадайся дознавателям секты — за тобой охотятся с Главы II.',
  'Собери семь улик и три дара, чтобы войти в Шпиль Лжебога.',
];

export const FAQ = [
  {
    q: 'Нужен ли интернет?',
    a: 'Основная кампания проходится офлайн. Онлайн нужен только для таблицы рекордов и сезонных событий.',
  },
  {
    q: 'Почему 16+?',
    a: 'Мрачная религиозная тематика, сцены насилия и разложения, темы культов и манипуляции.',
  },
  {
    q: 'Можно сменить вид некроманта?',
    a: 'Да, у любого алтаря после Главы I. Благосклонность богов при этом сохраняется, а дары переучиваются.',
  },
  {
    q: 'Что даёт высокая сложность?',
    a: 'Дознаватели видят дальше, смерть отнимает улику, но очки за главу умножаются на 1.6.',
  },
];
