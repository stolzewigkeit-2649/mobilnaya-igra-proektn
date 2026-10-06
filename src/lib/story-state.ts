import { SCENE_MAP, START_SCENE, FACTION_IDS, type EvidenceId, type FactionId, type GodId } from '@/data/story';

export type StoryState = {
  sceneId: string;
  evidence: EvidenceId[];
  gifts: GodId[];
  rep: Record<FactionId, number>;
  health: number;
  sanity: number;
  flags: string[];
  visited: string[];
};

export const emptyRep = (): Record<FactionId, number> =>
  FACTION_IDS.reduce(
    (acc, f) => {
      acc[f] = 0;
      return acc;
    },
    {} as Record<FactionId, number>,
  );

export const initialStoryState = (startRep?: FactionId): StoryState => {
  const rep = emptyRep();
  if (startRep) rep[startRep] = 1;
  return {
    sceneId: START_SCENE,
    evidence: [],
    gifts: [],
    rep,
    health: 100,
    sanity: 100,
    flags: [],
    visited: [START_SCENE],
  };
};

export const normalizeStory = (raw: unknown): StoryState | null => {
  if (!raw || typeof raw !== 'object') return null;
  const parsed = raw as Partial<StoryState>;
  if (!parsed.sceneId || !SCENE_MAP[parsed.sceneId]) return null;
  const base = initialStoryState();
  return {
    ...base,
    ...parsed,
    sceneId: parsed.sceneId,
    rep: { ...emptyRep(), ...(parsed.rep ?? {}) },
    visited: Array.isArray(parsed.visited) ? parsed.visited : base.visited,
  };
};
