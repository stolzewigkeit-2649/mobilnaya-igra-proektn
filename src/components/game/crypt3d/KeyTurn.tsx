import { useFrame } from '@react-three/fiber';
import { crypt, input } from '@/components/game/crypt3d/crypt-store';
import { look } from '@/components/game/crypt3d/hands/hand-state';

const SPEED = 900;

const KeyTurn = () => {
  useFrame((_, dt) => {
    const k = input.keys;
    const s = crypt.get();
    if (s.paused || s.choices.length) return;
    const x = (k.has('ArrowRight') ? 1 : 0) - (k.has('ArrowLeft') ? 1 : 0);
    const y = (k.has('ArrowDown') ? 1 : 0) - (k.has('ArrowUp') ? 1 : 0);
    if (!x && !y) return;
    const step = Math.min(dt, 0.05) * SPEED;
    input.look.dx += x * step;
    input.look.dy += y * step * 0.6;
    look.lastInput = performance.now();
  });
  return null;
};

export default KeyTurn;
