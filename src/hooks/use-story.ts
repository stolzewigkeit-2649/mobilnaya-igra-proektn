import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SCENE_MAP,
  SCENE_ORDER,
  START_SCENE,
  FACTION_IDS,
  FACTION_META,
  GIFT_META,
  type EvidenceId,
  type FactionId,
  type GodId,
  type StoryChoice,
  type StoryRequire,
} from '@/data/story';
import type { Difficulty } from '@/hooks/use-game-settings';

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

const KEY = 'rpv-story';

const emptyRep = (): Record<FactionId, number> =>
  FACTION_IDS.reduce(
    (acc, f) => {
      acc[f] = 0;
      return acc;
    },
    {} as Record<FactionId, number>,
  );

const initialState = (startRep?: FactionId): StoryState => {
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

const PENALTY: Record<Difficulty, number> = {
  penitent: 0.7,
  heretic: 1,
  apostate: 1.4,
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export type LockReason = string | null;

export function readStorySave(): StoryState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoryState;
    return parsed?.sceneId && SCENE_MAP[parsed.sceneId] ? parsed : null;
  } catch {
    return null;
  }
}

export function clearStorySave() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* приватный режим */
  }
}

type Options = { difficulty: Difficulty; faction?: string };

export function useStory({ difficulty, faction }: Options) {
  const heroFaction = FACTION_IDS.includes(faction as FactionId)
    ? (faction as FactionId)
    : undefined;

  const [state, setState] = useState<StoryState | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoryState;
      if (!parsed?.sceneId || !SCENE_MAP[parsed.sceneId]) return null;
      return { ...initialState(heroFaction), ...parsed, rep: { ...emptyRep(), ...parsed.rep } };
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (state) window.localStorage.setItem(KEY, JSON.stringify(state));
      else window.localStorage.removeItem(KEY);
    } catch {
      /* приватный режим */
    }
  }, [state]);

  const start = useCallback(() => setState(initialState(heroFaction)), [heroFaction]);

  const restart = useCallback(() => setState(initialState(heroFaction)), [heroFaction]);

  const drop = useCallback(() => setState(null), []);

  const lockOf = useCallback(
    (req: StoryRequire | undefined, s: StoryState): LockReason => {
      if (!req) return null;
      if (req.gift && !s.gifts.includes(req.gift))
        return `нужен дар ${GIFT_META[req.gift].god}`;
      if (req.noGift && s.gifts.includes(req.noGift))
        return `мешает дар ${GIFT_META[req.noGift].god}`;
      if (req.evidence && !s.evidence.includes(req.evidence)) return 'нужна другая улика';
      if (req.evidenceCount && s.evidence.length < req.evidenceCount)
        return `нужно улик: ${req.evidenceCount}`;
      if (req.rep && s.rep[req.rep.faction] < req.rep.min)
        return `нужно доверие: ${FACTION_META[req.rep.faction].label}`;
      if (req.flag && !s.flags.includes(req.flag)) return 'ты этого не делал';
      if (req.noFlag && s.flags.includes(req.noFlag)) return 'уже поздно';
      if (req.healthMin && s.health < req.healthMin) return 'тело не выдержит';
      if (req.healthMax !== undefined && s.health > req.healthMax) return 'ты ещё держишься';
      if (req.sanityMin && s.sanity < req.sanityMin) return 'рассудок не выдержит';
      if (req.sanityMax !== undefined && s.sanity > req.sanityMax) return 'ты ещё в себе';
      return null;
    },
    [],
  );

  const scene = state ? SCENE_MAP[state.sceneId] : null;

  const choices = useMemo(() => {
    if (!scene || !state) return [];
    return scene.choices.map((c) => ({ choice: c, lock: lockOf(c.require, state) }));
  }, [scene, state, lockOf]);

  const choose = useCallback(
    (choiceId: string) => {
      setState((prev) => {
        if (!prev) return prev;
        const cur = SCENE_MAP[prev.sceneId];
        const choice: StoryChoice | undefined = cur?.choices.find((c) => c.id === choiceId);
        if (!choice) return prev;
        if (lockOf(choice.require, prev)) return prev;

        const e = choice.effects ?? {};
        const k = PENALTY[difficulty];
        const next: StoryState = {
          ...prev,
          rep: { ...prev.rep },
          evidence: [...prev.evidence],
          gifts: [...prev.gifts],
          flags: [...prev.flags],
        };

        if (e.evidence && !next.evidence.includes(e.evidence)) next.evidence.push(e.evidence);
        if (e.gift && !next.gifts.includes(e.gift)) next.gifts.push(e.gift);
        if (e.rep)
          (Object.keys(e.rep) as FactionId[]).forEach((f) => {
            next.rep[f] = (next.rep[f] ?? 0) + (e.rep![f] ?? 0);
          });
        if (e.health !== undefined)
          next.health = clamp(next.health + (e.health < 0 ? e.health * k : e.health));
        if (e.sanity !== undefined)
          next.sanity = clamp(next.sanity + (e.sanity < 0 ? e.sanity * k : e.sanity));
        if (e.flags) e.flags.forEach((f) => !next.flags.includes(f) && next.flags.push(f));

        next.health = Math.round(next.health);
        next.sanity = Math.round(next.sanity);

        const dead = next.health <= 0 || next.sanity <= 0;
        next.sceneId = dead && !SCENE_MAP[choice.next].ending ? 'ending-ashes' : choice.next;
        if (!next.visited.includes(next.sceneId)) next.visited = [...next.visited, next.sceneId];
        return next;
      });
    },
    [difficulty, lockOf],
  );

  return {
    state,
    scene,
    choices,
    hasSave: state !== null,
    sceneNumber: scene ? SCENE_ORDER[scene.id] : 0,
    ending: scene?.ending ?? null,
    start,
    restart,
    drop,
    choose,
  };
}