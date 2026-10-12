import { useSyncExternalStore } from 'react';

export type Stage =
  | 'intro'
  | 'shard'
  | 'rise'
  | 'explore'
  | 'hecate'
  | 'gift'
  | 'leaving'
  | 'walk'
  | 'soul'
  | 'sariel'
  | 'talk';

export type Line = { who: 'hecate' | 'hero' | 'note' | 'soul' | 'sariel'; text: string };
export type Choice = { id: string; label: string; hint?: string };
export type Card = { kicker: string; title: string; text: string; icon: string; color: string };

export type CryptState = {
  stage: Stage;
  lines: Line[];
  lineIndex: number;
  choices: Choice[];
  card: Card | null;
  grey: boolean;
  focus: string | null;
  inspected: string[];
  looking: boolean;
  candlesLit: number;
  paused: boolean;
  objective: string;
};

const initial: CryptState = {
  stage: 'intro',
  lines: [],
  lineIndex: 0,
  choices: [],
  card: null,
  grey: false,
  focus: null,
  inspected: [],
  looking: false,
  candlesLit: 0,
  paused: false,
  objective: '',
};

let state: CryptState = { ...initial };
let then: (() => void) | null = null;
let onChoice: ((id: string) => void) | null = null;
const subs = new Set<() => void>();

export const crypt = {
  get: () => state,
  set(patch: Partial<CryptState>) {
    state = { ...state, ...patch };
    subs.forEach((f) => f());
  },
  reset(stage: Stage = 'intro') {
    then = null;
    onChoice = null;
    state = { ...initial, stage, candlesLit: stage === 'intro' ? 0 : 99 };
    subs.forEach((f) => f());
  },
  say(lines: Line[], after?: () => void) {
    then = after ?? null;
    crypt.set({ lines, lineIndex: 0 });
  },
  advance() {
    if (!state.lines.length) return false;
    if (state.lineIndex < state.lines.length - 1) {
      crypt.set({ lineIndex: state.lineIndex + 1 });
      return false;
    }
    const f = then;
    then = null;
    crypt.set({ lines: [], lineIndex: 0 });
    f?.();
    return true;
  },
  ask(choices: Choice[], handler: (id: string) => void) {
    onChoice = handler;
    crypt.set({ choices });
  },
  choose(id: string) {
    const h = onChoice;
    onChoice = null;
    crypt.set({ choices: [] });
    h?.(id);
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => subs.delete(f);
  },
};

export const input = {
  move: { x: 0, y: 0 },
  look: { dx: 0, dy: 0 },
  keys: new Set<string>(),
  interact: 0,
};

export function useCrypt<T>(pick: (s: CryptState) => T): T {
  return useSyncExternalStore(crypt.subscribe, () => pick(crypt.get()));
}
