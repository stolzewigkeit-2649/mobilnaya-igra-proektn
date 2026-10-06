import { useCallback, useMemo } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { initialStoryState as initialState, type StoryState } from '@/lib/story-state';
import {
  SCENE_MAP,
  SCENE_ORDER,
  FACTION_IDS,
  FACTION_META,
  GIFT_META,
  type FactionId,
  type StoryChoice,
  type StoryRequire,
} from '@/data/story';
import type { Difficulty } from '@/hooks/use-game-settings';

export type { StoryState } from '@/lib/story-state';

const PENALTY: Record<Difficulty, number> = {
  penitent: 0.7,
  heretic: 1,
  apostate: 1.4,
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export type LockReason = string | null;

type Options = { difficulty: Difficulty; faction?: string };

export function useStory({ difficulty, faction }: Options) {
  const heroFaction = FACTION_IDS.includes(faction as FactionId)
    ? (faction as FactionId)
    : undefined;

  const { story: state, setStory: setState } = useProfile();

  const start = useCallback(() => setState(initialState(heroFaction)), [heroFaction, setState]);

  const restart = useCallback(
    () => setState(initialState(heroFaction)),
    [heroFaction, setState],
  );

  const drop = useCallback(() => setState(null), [setState]);

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
    [difficulty, lockOf, setState],
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