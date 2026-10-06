import {
  SCENE_MAP,
  START_SCENE,
  FACTION_IDS,
  type EvidenceId,
  type FactionId,
  type GiftId,
  type StoryEffects,
} from '@/data/story';

export type StoryEvent = 'death' | null;

type StoryCore = {
  sceneId: string;
  evidence: EvidenceId[];
  gifts: GiftId[];
  rep: Record<FactionId, number>;
  health: number;
  sanity: number;
  flags: string[];
  visited: string[];
  deaths: number;
  note: string | null;
  event: StoryEvent;
};

export type StoryState = StoryCore & { checkpoint: StoryCore | null };

export const emptyRep = (): Record<FactionId, number> =>
  FACTION_IDS.reduce(
    (acc, f) => {
      acc[f] = 0;
      return acc;
    },
    {} as Record<FactionId, number>,
  );

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const list = <T,>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

export function applyEffects(s: StoryState, e: StoryEffects | undefined, k = 1): StoryState {
  if (!e) return s;
  const next: StoryState = {
    ...s,
    rep: { ...s.rep },
    evidence: [...s.evidence],
    gifts: [...s.gifts],
    flags: [...s.flags],
  };
  list(e.evidence).forEach((x) => !next.evidence.includes(x) && next.evidence.push(x));
  list(e.gift).forEach((x) => !next.gifts.includes(x) && next.gifts.push(x));
  list(e.flags).forEach((x) => !next.flags.includes(x) && next.flags.push(x));
  if (e.rep)
    (Object.keys(e.rep) as FactionId[]).forEach((f) => {
      next.rep[f] = (next.rep[f] ?? 0) + (e.rep![f] ?? 0);
    });
  if (e.health !== undefined) next.health = clamp(next.health + (e.health < 0 ? e.health * k : e.health));
  if (e.sanity !== undefined) next.sanity = clamp(next.sanity + (e.sanity < 0 ? e.sanity * k : e.sanity));
  return next;
}

export const coreOf = (s: StoryState): StoryCore => {
  const { checkpoint: _skip, ...core } = s;
  void _skip;
  return core;
};

export const initialStoryState = (startRep?: FactionId): StoryState => {
  const rep = emptyRep();
  if (startRep) rep[startRep] = 1;
  const base: StoryState = {
    sceneId: START_SCENE,
    evidence: [],
    gifts: ['speak-dead'],
    rep,
    health: 100,
    sanity: 100,
    flags: [],
    visited: [START_SCENE],
    deaths: 0,
    note: null,
    event: null,
    checkpoint: null,
  };
  const entered = applyEffects(base, SCENE_MAP[START_SCENE]?.onEnter);
  return { ...entered, checkpoint: coreOf(entered) };
};

export const normalizeStory = (raw: unknown): StoryState | null => {
  if (!raw || typeof raw !== 'object') return null;
  const parsed = raw as Partial<StoryState>;
  if (!parsed.sceneId || !SCENE_MAP[parsed.sceneId]) return null;
  if (!Array.isArray(parsed.gifts) || !parsed.gifts.includes('speak-dead')) return null;
  const base = initialStoryState();
  return {
    ...base,
    ...parsed,
    sceneId: parsed.sceneId,
    rep: { ...emptyRep(), ...(parsed.rep ?? {}) },
    visited: Array.isArray(parsed.visited) ? parsed.visited : base.visited,
    deaths: typeof parsed.deaths === 'number' ? parsed.deaths : 0,
    note: parsed.note ?? null,
    event: parsed.event ?? null,
    checkpoint: parsed.checkpoint ?? null,
  };
};
