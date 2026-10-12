import { useSyncExternalStore } from 'react';
import * as THREE from 'three';
import { crypt, type Line } from '@/components/game/crypt3d/crypt-store';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';

export type Spell = 'soul' | 'raise';

export type Corpse = {
  id: string;
  name: string;
  pos: THREE.Vector3;
  rot: number;
  pose: 'lying' | 'sitting' | 'slumped';
  skin: string;
  cloth: string;
  soul: Line[];
  raise: Line[];
  flag?: string;
  bones?: boolean;
  refuse?: boolean;
};

export type CorpseState = { soul: 'idle' | 'up' | 'gone'; raised: 'idle' | 'up' | 'laid' };

type NState = {
  corpses: Corpse[];
  states: Record<string, CorpseState>;
  target: string | null;
  casting: Spell | null;
  charge: number;
  sanity: number;
  souls: number;
  raised: number;
  flags: string[];
  msg: string | null;
};

export const COST: Record<Spell, number> = { soul: 4, raise: 9 };
export const CHARGE_TIME: Record<Spell, number> = { soul: 1.3, raise: 2.2 };
const RANGE = 2.6;

let st: NState = { corpses: [], states: {}, target: null, casting: null, charge: 0, sanity: 0, souls: 0, raised: 0, flags: [], msg: null };
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const set = (p: Partial<NState>) => {
  st = { ...st, ...p };
  emit();
};

export const necro = {
  get: () => st,
  subscribe(f: () => void) {
    subs.add(f);
    return () => subs.delete(f);
  },
  init(corpses: Corpse[]) {
    st = {
      corpses,
      states: Object.fromEntries(corpses.map((c) => [c.id, { soul: 'idle', raised: 'idle' }])),
      target: null,
      casting: null,
      charge: 0,
      sanity: 0,
      souls: 0,
      raised: 0,
      flags: [],
      msg: null,
    };
    emit();
  },
  setTarget(id: string | null) {
    if (id !== st.target) set({ target: id });
  },
  start(spell: Spell) {
    const s = crypt.get();
    if (s.lines.length || s.choices.length || s.paused) return;
    if (!st.target) {
      flash('Нет тела рядом. Подойди и посмотри на мёртвого.');
      return;
    }
    const cs = st.states[st.target];
    if (spell === 'soul' && cs.soul !== 'idle') return flash('Его душа уже ушла. Дважды не зовут.');
    if (spell === 'raise' && cs.raised === 'up') return flash('Он уже стоит. Отпусти его (F ещё раз).');
    if (spell === 'raise' && cs.raised === 'laid') return flash('Тело больше не отзовётся.');
    if (spell === 'raise' && st.corpses.find((c) => c.id === st.target)?.bones) return flash('От него остались одни кости. Нечего поднимать.');
    if (spell === 'raise' && cs.soul === 'up') return;
    set({ casting: spell, charge: 0 });
    cryptAudio.whisper(true);
  },
  cancel() {
    if (!st.casting) return;
    cryptAudio.whisper(false);
    set({ casting: null, charge: 0 });
  },
  tick(dt: number) {
    if (!st.casting) return;
    if (!st.target) return necro.cancel();
    const charge = st.charge + dt / CHARGE_TIME[st.casting];
    if (charge >= 1) return finish(st.casting, st.target);
    st = { ...st, charge };
    emit();
  },
  release(id: string) {
    const cs = st.states[id];
    if (!cs || cs.raised !== 'up') return false;
    st.states[id] = { ...cs, raised: 'laid' };
    set({ states: { ...st.states } });
    cryptAudio.chime(196);
    crypt.say([{ who: 'note', text: 'Ты разжимаешь хватку. Тело оседает обратно — медленно, почти благодарно.' }]);
    return true;
  },
  raisedId() {
    return Object.entries(st.states).find(([, v]) => v.raised === 'up')?.[0] ?? null;
  },
};

let msgTimer = 0;
function flash(msg: string) {
  window.clearTimeout(msgTimer);
  set({ msg });
  msgTimer = window.setTimeout(() => set({ msg: null }), 2600);
}

function finish(spell: Spell, id: string) {
  const c = st.corpses.find((x) => x.id === id)!;
  const prev = st.states[id];
  const flags = c.flag && !st.flags.includes(c.flag) ? [...st.flags, c.flag] : st.flags;
  const sanity = st.sanity - COST[spell];
  cryptAudio.chime(spell === 'soul' ? 698 : 247);

  if (spell === 'soul') {
    st.states[id] = { ...prev, soul: 'up' };
    set({ casting: null, charge: 0, sanity, souls: st.souls + 1, flags, states: { ...st.states } });
    crypt.set({ grey: true });
    crypt.say(c.soul, () => {
      cryptAudio.whisper(false);
      st.states[id] = { ...st.states[id], soul: 'gone' };
      set({ states: { ...st.states } });
      crypt.set({ grey: false });
    });
    return;
  }

  if (c.refuse) {
    st.states[id] = { ...prev, raised: 'laid' };
    set({ casting: null, charge: 0, sanity, flags, states: { ...st.states } });
    cryptAudio.whisper(false);
    crypt.say(c.raise);
    return;
  }

  const other = necro.raisedId();
  if (other) st.states[other] = { ...st.states[other], raised: 'laid' };
  st.states[id] = { ...prev, raised: 'up' };
  set({ casting: null, charge: 0, sanity, raised: st.raised + 1, flags, states: { ...st.states } });
  cryptAudio.whisper(false);
  crypt.say(c.raise);
}

export function useNecro<T>(pick: (s: NState) => T): T {
  return useSyncExternalStore(necro.subscribe, () => pick(necro.get()));
}

export const necroRange = RANGE;
