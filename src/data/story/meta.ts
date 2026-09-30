import { LORE_GODS } from '@/data/lore-gods';
import { LORE_FACTIONS } from '@/data/lore-factions';
import type { EvidenceId, FactionId, GodId } from '@/data/story/types';

export const EVIDENCE_META: Record<EvidenceId, { label: string; short: string; icon: string }> = {
  ledger: {
    label: 'Гроссбух пожертвований',
    short: 'Бухгалтерия чудес: кто и сколько платил за плач статуй.',
    icon: 'BookMarked',
  },
  seal: {
    label: 'Печать дознавателя',
    short: 'Свинцовый оттиск, которым подписывают приговоры о мерзости.',
    icon: 'Stamp',
  },
  canon: {
    label: 'Первая редакция канона',
    short: 'Текст, где чудес ещё нет — а бог уже есть.',
    icon: 'ScrollText',
  },
  ascended: {
    label: 'Списки «вознесённых»',
    short: 'Имена должников и сирот, которых больше никто не видел.',
    icon: 'ListOrdered',
  },
  statue: {
    label: 'Механика плачущей статуи',
    short: 'Мехи, трубка и склянка с красильной кровью.',
    icon: 'Cog',
  },
  testimony: {
    label: 'Показания трупа из Топи',
    short: 'Последний час плакальщицы, записанный слово в слово.',
    icon: 'Waves',
  },
  voice: {
    label: 'Имя того, кто говорит за Единого',
    short: 'Одно слово, после которого Шпилю нечего отвечать.',
    icon: 'Mic',
  },
};

export const GIFT_META: Record<GodId, { god: string; gift: string; icon: string; price: string }> =
  LORE_GODS.reduce(
    (acc, g) => {
      acc[g.id as GodId] = { god: g.name, gift: g.giftName, icon: g.icon, price: g.price };
      return acc;
    },
    {} as Record<GodId, { god: string; gift: string; icon: string; price: string }>,
  );

export const FACTION_META: Record<FactionId, { label: string; icon: string; color: string }> =
  LORE_FACTIONS.reduce(
    (acc, f) => {
      acc[f.id as FactionId] = { label: f.label, icon: f.icon, color: f.color };
      return acc;
    },
    {} as Record<FactionId, { label: string; icon: string; color: string }>,
  );

export const FACTION_IDS: FactionId[] = ['bones', 'silence', 'traders', 'exiles'];
