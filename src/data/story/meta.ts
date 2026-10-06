import { LORE_FACTIONS } from '@/data/lore-factions';
import type { ChapterId, EvidenceId, FactionId, GiftId } from '@/data/story/types';

export const EVIDENCE_META: Record<EvidenceId, { label: string; short: string; icon: string }> = {
  'white-cloth': {
    label: 'Белый фрагмент одежды',
    short: 'Лоскут рясы аврамиста, зажатый в пальцах первого убитого.',
    icon: 'Shirt',
  },
  letter: {
    label: 'Обрывок письма',
    short: '«Если со мной что-нибудь случится, ищите под часовней».',
    icon: 'Mail',
  },
  'chapel-lists': {
    label: 'Списки из-под часовни',
    short: 'Имена похищенных жителей и пометки об опытах над смертью.',
    icon: 'ListOrdered',
  },
  'false-sigils': {
    label: 'Поддельные знаки',
    short: 'Некромантские символы, вырезанные рукой, которая их не знает.',
    icon: 'PenTool',
  },
  'war-plan': {
    label: 'Замысел войны',
    short: 'Доказательство: аврамисты стравливают некромантов и жрецов смерти.',
    icon: 'Swords',
  },
  'duat-dam': {
    label: 'Плотина на Дуат',
    short: 'Русло мёртвых перекрыто нарочно — души пошли на осколки.',
    icon: 'Waves',
  },
  'son-memory': {
    label: 'Память «Сына Бога»',
    short: 'Существо создал Лжебог. Священное тело — паразит.',
    icon: 'Brain',
  },
  'shard-pattern': {
    label: 'Закономерность Сариэла',
    short: 'Каждая жертва — плата за очередной осколок Абсолюта.',
    icon: 'Network',
  },
  'empty-altar': {
    label: 'Пустой алтарь',
    short: 'В главном храме нет бога. Есть портал и голос за ним.',
    icon: 'Church',
  },
};

export const EVIDENCE_TOTAL = Object.keys(EVIDENCE_META).length;

export type GiftKind = 'ability' | 'blessing' | 'weapon' | 'artifact' | 'knowledge';

export const GIFT_KIND_LABEL: Record<GiftKind, string> = {
  ability: 'Способность',
  blessing: 'Благословение',
  weapon: 'Оружие',
  artifact: 'Предмет',
  knowledge: 'Знание',
};

export const GIFT_META: Record<
  GiftId,
  { name: string; giver: string; kind: GiftKind; icon: string; desc: string }
> = {
  'speak-dead': {
    name: 'Речь с мёртвыми',
    giver: 'врождённое',
    kind: 'ability',
    icon: 'Ghost',
    desc: 'Душа умершего встаёт рядом с телом и отвечает. Недолго.',
  },
  immortal: {
    name: 'Бессмертие некроманта',
    giver: 'Геката',
    kind: 'blessing',
    icon: 'Infinity',
    desc: 'Смерть возвращает тебя обратно. Каждый раз забирая часть памяти.',
  },
  shard: {
    name: 'Осколок Истины',
    giver: 'склеп',
    kind: 'artifact',
    icon: 'Gem',
    desc: 'Лежал у тебя на груди. Тёплый, когда рядом ложь.',
  },
  torch: {
    name: 'Факел Правды',
    giver: 'Геката',
    kind: 'artifact',
    icon: 'Flame',
    desc: 'Скрытые следы, магические отпечатки, иллюзии и тайные проходы.',
  },
  'moon-blade': {
    name: 'Лунный Клинок',
    giver: 'Молчащий',
    kind: 'weapon',
    icon: 'Moon',
    desc: 'Ранит духов, рушит ритуальные барьеры, прерывает заклинания аврамистов.',
  },
  'hekate-key': {
    name: 'Ключ Гекаты',
    giver: 'Геката',
    kind: 'artifact',
    icon: 'KeyRound',
    desc: 'Открывает запечатанные проходы, связанные с расследованием.',
  },
  'name-vessel': {
    name: 'Сосуд Имён',
    giver: 'Геката',
    kind: 'artifact',
    icon: 'Amphora',
    desc: 'Хранит имена освобождённых душ. Они помнят, кто их вернул.',
  },
  'truth-voice': {
    name: 'Глас Истины',
    giver: 'Геката',
    kind: 'blessing',
    icon: 'Megaphone',
    desc: 'Доказанная вина становится слабостью врага. Ложь ранит лжеца.',
  },
  'morrana-verdict': {
    name: 'Приговор Морраны',
    giver: 'Моррана',
    kind: 'weapon',
    icon: 'Bone',
    desc: 'Костяное оружие против тех, кто питается ложной божественной силой.',
  },
  'shard-accepted': {
    name: 'Осколок принял тебя',
    giver: 'Абсолют',
    kind: 'blessing',
    icon: 'Sparkles',
    desc: 'Осколок отверг Лжебога и признал того, кто ищет правду.',
  },
};

export const CHAPTERS: Record<ChapterId, { kicker: string; title: string }> = {
  prologue: { kicker: 'Пролог', title: 'Мёртвые помнят' },
  ch1: { kicker: 'Глава I', title: 'Те, кого спасли' },
  ch2: { kicker: 'Глава II', title: 'Город, которого обвинили' },
  ch3: { kicker: 'Глава III', title: 'Русло мёртвых' },
  ch4: { kicker: 'Глава IV', title: 'Сын' },
  ch5: { kicker: 'Глава V', title: 'Луна не лжёт' },
  finale: { kicker: 'Финал демо', title: 'Реквием по истине' },
};

export const FACTION_META: Record<FactionId, { label: string; icon: string; color: string }> =
  LORE_FACTIONS.reduce(
    (acc, f) => {
      acc[f.id as FactionId] = { label: f.label, icon: f.icon, color: f.color };
      return acc;
    },
    {} as Record<FactionId, { label: string; icon: string; color: string }>,
  );

export const FACTION_IDS: FactionId[] = ['bones', 'silence', 'traders', 'exiles'];
