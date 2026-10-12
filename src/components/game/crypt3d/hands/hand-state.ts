import { crypt } from '@/components/game/crypt3d/crypt-store';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';

export type HandView = 'off' | 'back' | 'palm';

export function cycleHands(): HandView {
  const s = crypt.get();
  if (!s.looking) {
    crypt.set({ looking: true, palms: false });
    return 'back';
  }
  if (!s.palms) {
    crypt.set({ palms: true });
    return 'palm';
  }
  crypt.set({ looking: false, palms: false });
  return 'off';
}

export const look = { lastInput: 0 };

export function userLooking() {
  return performance.now() - look.lastInput < 1400;
}

export function touchShard() {
  if (crypt.get().stage !== 'shard') return;
  cryptAudio.chime(659);
  crypt.set({ objective: '' });
  crypt.say([{ who: 'hecate', text: 'Наконец.' }]);
  window.setTimeout(() => {
    crypt.set({ stage: 'rise', lines: [] });
    window.setTimeout(() => crypt.say([{ who: 'hero', text: 'Кто ты?' }]), 2300);
  }, 2600);
}
