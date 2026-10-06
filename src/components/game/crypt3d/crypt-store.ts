import { useSyncExternalStore } from 'react';

export type Stage = 'intro' | 'shard' | 'rise' | 'explore' | 'hecate' | 'gift' | 'leaving';

export type Line = { who: 'hecate' | 'hero' | 'note'; text: string };

export type CryptState = {
  stage: Stage;
  lines: Line[];
  lineIndex: number;
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
  focus: null,
  inspected: [],
  looking: false,
  candlesLit: 0,
  paused: false,
  objective: '',
};

let state: CryptState = { ...initial };
const subs = new Set<() => void>();

export const crypt = {
  get: () => state,
  set(patch: Partial<CryptState>) {
    state = { ...state, ...patch };
    subs.forEach((f) => f());
  },
  reset(stage: Stage = 'intro') {
    state = { ...initial, stage, candlesLit: stage === 'intro' ? 0 : 99 };
    subs.forEach((f) => f());
  },
  say(lines: Line[]) {
    crypt.set({ lines, lineIndex: 0 });
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
