import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { crypt, input } from '@/components/game/crypt3d/crypt-store';
import { resolveCollision, START_LYING, START_STAND, EYE, HECATE_POS, DOOR } from '@/components/game/crypt3d/layout';
import { easeInOut } from '@/components/game/crypt3d/glow';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';
import { pickFocus } from '@/components/game/crypt3d/interactables';

const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const fwd = new THREE.Vector3();
const right = new THREE.Vector3();
const tmp = new THREE.Vector3();

const Player = ({ onExitReached }: { onExitReached: () => void }) => {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const pos = useRef(START_LYING.pos.clone());
  const yaw = useRef(START_LYING.yaw);
  const pitch = useRef(START_LYING.pitch);
  const rise = useRef(0);
  const bob = useRef(0);
  const stepAcc = useRef(0);
  const hands = useRef(0);
  const exited = useRef(false);

  useEffect(() => {
    if (crypt.get().stage !== 'intro' && crypt.get().stage !== 'shard') {
      pos.current.copy(START_STAND.pos);
      pitch.current = START_STAND.pitch;
      rise.current = 1;
    }
    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;
      input.look.dx += e.movementX;
      input.look.dy += e.movementY;
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, [gl]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = crypt.get();

    if (!['intro', 'shard', 'rise'].includes(s.stage) && rise.current < 1) {
      pos.current.copy(START_STAND.pos);
      pitch.current = START_STAND.pitch;
      rise.current = 1;
    }

    if (s.stage === 'rise' || s.stage === 'intro' || s.stage === 'shard') {
      if (s.stage === 'rise') rise.current = Math.min(1, rise.current + dt / 2.4);
      const k = easeInOut(rise.current);
      pos.current.lerpVectors(START_LYING.pos, START_STAND.pos, k);
      pos.current.y += Math.sin(k * Math.PI) * 0.25;
      pitch.current = THREE.MathUtils.lerp(START_LYING.pitch, START_STAND.pitch, k);
      const roll = Math.sin(k * Math.PI) * 0.12;
      euler.set(pitch.current, yaw.current, roll);
      camera.quaternion.setFromEuler(euler);
      camera.position.copy(pos.current);
      if (s.stage === 'intro' || s.stage === 'shard') {
        const t = performance.now() / 1000;
        camera.rotation.z += Math.sin(t * 0.4) * 0.01;
        camera.position.y += Math.sin(t * 0.9) * 0.008;
      }
      if (rise.current >= 1 && s.stage === 'rise') crypt.set({ stage: 'explore', objective: 'Осмотрись. Нажми H, чтобы посмотреть на руки.' });
      return;
    }

    const free = !s.paused && (s.stage === 'explore' || s.stage === 'gift');

    yaw.current -= input.look.dx * 0.0022;
    pitch.current -= input.look.dy * 0.0022;
    input.look.dx = 0;
    input.look.dy = 0;
    pitch.current = THREE.MathUtils.clamp(pitch.current, -1.35, 1.35);

    if (s.stage === 'hecate') {
      tmp.set(HECATE_POS.x, 1.8, HECATE_POS.z).sub(pos.current);
      const targetYaw = Math.atan2(-tmp.x, -tmp.z);
      const targetPitch = Math.atan2(tmp.y, Math.hypot(tmp.x, tmp.z));
      let d = targetYaw - yaw.current;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      yaw.current += d * (1 - Math.exp(-dt * 2.2));
      pitch.current = THREE.MathUtils.damp(pitch.current, targetPitch, 2.2, dt);
    }

    hands.current = THREE.MathUtils.damp(hands.current, s.looking ? 1 : 0, 4, dt);

    let moving = 0;
    if (free) {
      const k = input.keys;
      let mx = input.move.x + (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
      let mz = input.move.y + (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
      const len = Math.hypot(mx, mz);
      if (len > 1) {
        mx /= len;
        mz /= len;
      }
      const speed = k.has('ShiftLeft') || k.has('ShiftRight') ? 2.6 : 1.6;
      fwd.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
      right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
      pos.current.addScaledVector(fwd, mz * speed * dt).addScaledVector(right, mx * speed * dt);
      resolveCollision(pos.current, s.stage === 'gift');
      moving = Math.min(1, Math.hypot(mx, mz)) * speed;
    }

    bob.current += moving * dt * 3.6;
    stepAcc.current += moving * dt;
    if (stepAcc.current > 0.78) {
      stepAcc.current = 0;
      cryptAudio.step();
    }
    const bobY = Math.sin(bob.current * 2) * 0.028 * Math.min(1, moving);
    const bobX = Math.cos(bob.current) * 0.018 * Math.min(1, moving);

    const handPitch = THREE.MathUtils.lerp(pitch.current, -1.05, hands.current);
    euler.set(handPitch, yaw.current, bobX * 0.6);
    camera.quaternion.setFromEuler(euler);
    camera.position.set(pos.current.x + bobX * Math.cos(yaw.current), EYE + bobY, pos.current.z);

    if (s.stage === 'explore' || s.stage === 'gift') {
      const f = pickFocus(camera, s);
      if (f !== s.focus) crypt.set({ focus: f });
    } else if (s.focus) crypt.set({ focus: null });

    if (s.stage === 'gift' && !exited.current && pos.current.z < DOOR.z - 0.6) {
      exited.current = true;
      onExitReached();
    }
  });

  return null;
};

export default Player;
