import { useCallback, useMemo } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import {
  applyEffects,
  coreOf,
  initialStoryState as initialState,
  type StoryState,
} from '@/lib/story-state';
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

const DEATH_SANITY_COST = 10;

export type LockReason = string | null;

const usedKey = (id: string) => `used:${id}`;

export function lockOf(req: StoryRequire | undefined, s: StoryState, hint?: string): LockReason {
  if (!req) return null;
  const fail = (why: string) => hint ?? why;
  if (req.gift && !s.gifts.includes(req.gift)) return fail(`нужно: ${GIFT_META[req.gift].name}`);
  const missingGift = req.gifts?.find((g) => !s.gifts.includes(g));
  if (missingGift) return fail(`нужно: ${GIFT_META[missingGift].name}`);
  if (req.evidence && !s.evidence.includes(req.evidence)) return fail('нужна улика');
  if (req.evidenceCount && s.evidence.length < req.evidenceCount)
    return fail(`нужно улик: ${req.evidenceCount}`);
  if (req.rep && s.rep[req.rep.faction] < req.rep.min)
    return fail(`нужно доверие: ${FACTION_META[req.rep.faction].label}`);
  if (req.flag && !s.flags.includes(req.flag)) return fail('ещё рано');
  if (req.flags && req.flags.some((f) => !s.flags.includes(f))) return fail('ещё рано');
  if (req.noFlag && s.flags.includes(req.noFlag)) return fail('уже поздно');
  if (req.healthMin && s.health < req.healthMin) return fail('тело не выдержит');
  if (req.sanityMin && s.sanity < req.sanityMin) return fail('рассудок не выдержит');
  return null;
}

type Options = { difficulty: Difficulty; faction?: string };

export function useStory({ difficulty, faction }: Options) {
  const heroFaction = FACTION_IDS.includes(faction as FactionId)
    ? (faction as FactionId)
    : undefined;

  const { story: state, setStory: setState } = useProfile();

  const start = useCallback(() => setState(initialState(heroFaction)), [heroFaction, setState]);
  const restart = start;
  const drop = useCallback(() => setState(null), [setState]);

  const scene = state ? SCENE_MAP[state.sceneId] : null;

  const choices = useMemo(() => {
    if (!scene || !state) return [];
    return scene.choices
      .filter((c) => !(c.once && state.flags.includes(usedKey(c.id))))
      .map((c) => ({ choice: c, lock: lockOf(c.require, state, c.lockHint) }));
  }, [scene, state]);

  const dismissEvent = useCallback(
    () => setState((prev) => (prev ? { ...prev, event: null } : prev)),
    [setState],
  );

  const choose = useCallback(
    (choiceId: string) => {
      setState((prev) => {
        if (!prev) return prev;
        const cur = SCENE_MAP[prev.sceneId];
        const choice: StoryChoice | undefined = cur?.choices.find((c) => c.id === choiceId);
        if (!choice || lockOf(choice.require, prev)) return prev;

        const k = PENALTY[difficulty];
        let next = applyEffects({ ...prev, event: null }, choice.effects, k);
        if (choice.once) next = applyEffects(next, { flags: [usedKey(choice.id)] });

        if (next.health <= 0 || next.sanity <= 0) {
          const cp = prev.checkpoint ?? coreOf(initialState(heroFaction));
          return {
            ...cp,
            health: 100,
            sanity: Math.max(30, cp.sanity - DEATH_SANITY_COST * (prev.deaths + 1)),
            deaths: prev.deaths + 1,
            visited: prev.visited,
            note: null,
            event: 'death',
            checkpoint: cp,
          };
        }

        const target = SCENE_MAP[choice.next];
        const moved = choice.next !== prev.sceneId;
        next.sceneId = choice.next;
        next.note = choice.note ?? null;
        if (moved) next = applyEffects(next, target.onEnter, k);
        if (!next.visited.includes(next.sceneId)) next.visited = [...next.visited, next.sceneId];
        if (moved && target.chapterStart) next.checkpoint = coreOf({ ...next, note: null });
        return next;
      });
    },
    [difficulty, heroFaction, setState],
  );

  const jumpTo = useCallback(
    (sceneId: string, extra: { flags?: string[]; skipped?: string[]; sanity?: number; health?: number; evidence?: string[]; rep?: Record<string, number> } = {}) => {
      setState((prev) => {
        if (!prev || !SCENE_MAP[sceneId]) return prev;
        const k = PENALTY[difficulty];
        let next = applyEffects(
          { ...prev, event: null, note: null },
          { flags: extra.flags, sanity: extra.sanity, health: extra.health, evidence: extra.evidence as never, rep: extra.rep as never },
          k,
        );
        (extra.skipped ?? []).forEach((id) => {
          next = applyEffects(next, SCENE_MAP[id]?.onEnter, k);
        });
        next = applyEffects(next, SCENE_MAP[sceneId].onEnter, k);
        next.sceneId = sceneId;
        const seen = [...(extra.skipped ?? []), sceneId].filter((id) => !next.visited.includes(id));
        next.visited = [...next.visited, ...seen];
        if (SCENE_MAP[sceneId].chapterStart) next.checkpoint = coreOf(next);
        return next;
      });
    },
    [difficulty, setState],
  );

  const addFlag = useCallback(
    (flag: string) => setState((prev) => (prev ? applyEffects(prev, { flags: [flag] }) : prev)),
    [setState],
  );

  return {
    state,
    jumpTo,
    addFlag,
    scene,
    choices,
    hasSave: state !== null,
    sceneNumber: scene ? SCENE_ORDER[scene.id] : 0,
    ending: scene?.ending ?? null,
    start,
    restart,
    drop,
    choose,
    dismissEvent,
  };
}