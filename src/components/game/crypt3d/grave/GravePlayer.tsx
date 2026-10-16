import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { crypt, input } from '@/components/game/crypt3d/crypt-store';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';
import { collide, START, BODY, SARIEL_SPOT } from '@/components/game/crypt3d/grave/grave-layout';
import { GSPOTS } from '@/components/game/crypt3d/grave/grave-script';
import { userLooking } from '@/components/game/crypt3d/hands/hand-state';

const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const fwd = new THREE.Vector3();
const right = new THREE.Vector3();
const dir = new THREE.Vector3();
const ray = new THREE.Ray();
const tmp = new THREE.Vector3();

const GravePlayer = () => {
  const camera = useThree((s) => s.camera);
  const pos = useRef(START.pos.clone());
  const yaw = useRef(START.yaw);
  const pitch = useRef(-0.08);
  const bob = useRef(0);
  const stepAcc = useRef(0);
  const crouch = useRef(0);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = crypt.get();
    const busy = s.lines.length > 0 || s.choices.length > 0 || s.paused;
    const free = !busy && ['walk', 'sariel', 'follow'].includes(s.stage);

    if (!s.paused && !s.choices.length) {
      yaw.current -= input.look.dx * 0.0022;
      pitch.current -= input.look.dy * 0.0022;
    }
    input.look.dx = 0;
    input.look.dy = 0;
    pitch.current = THREE.MathUtils.clamp(pitch.current, -1.35, 1.35);

    const target = s.stage === 'soul' ? new THREE.Vector3(BODY.x - 0.7, 1.5, BODY.z - 0.5) : s.stage === 'talk' ? new THREE.Vector3(SARIEL_SPOT.x, 1.7, SARIEL_SPOT.z) : null;
    if (target && !userLooking()) {
      tmp.copy(target).sub(camera.position);
      let d = Math.atan2(-tmp.x, -tmp.z) - yaw.current;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      yaw.current += d * (1 - Math.exp(-dt * 2.5));
      pitch.current = THREE.MathUtils.damp(pitch.current, Math.atan2(tmp.y, Math.hypot(tmp.x, tmp.z)), 2.5, dt);
    }

    let moving = 0;
    if (free) {
      const k = input.keys;
      let mx = input.move.x + (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
      let mz = input.move.y + (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
      const len = Math.hypot(mx, mz);
      if (len > 1) {
        mx /= len;
        mz /= len;
      }
      const speed = k.has('ShiftLeft') || k.has('ShiftRight') ? 3 : 1.7;
      fwd.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
      right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
      pos.current.addScaledVector(fwd, mz * speed * dt).addScaledVector(right, mx * speed * dt);
      collide(pos.current);
      moving = Math.min(1, Math.hypot(mx, mz)) * speed;
    }

    const nearBody = Math.hypot(pos.current.x - BODY.x, pos.current.z - BODY.z) < 1.6 && ['walk', 'soul'].includes(s.stage);
    crouch.current = THREE.MathUtils.damp(crouch.current, nearBody && s.lines.length > 0 ? 1 : 0, 3, dt);

    bob.current += moving * dt * 3.4;
    stepAcc.current += moving * dt;
    if (stepAcc.current > 0.8) {
      stepAcc.current = 0;
      cryptAudio.step();
    }
    const bobY = Math.sin(bob.current * 2) * 0.03 * Math.min(1, moving);
    const bobX = Math.cos(bob.current) * 0.02 * Math.min(1, moving);
    euler.set(pitch.current, yaw.current, bobX * 0.5);
    camera.quaternion.setFromEuler(euler);
    camera.position.set(pos.current.x, 1.65 - crouch.current * 0.75 + bobY, pos.current.z);

    if (free || s.stage === 'walk') {
      camera.getWorldDirection(dir);
      ray.set(camera.position, dir);
      let best: string | null = null;
      let bestD = Infinity;
      for (const sp of GSPOTS) {
        if (!sp.when()) continue;
        const dist = camera.position.distanceTo(sp.at);
        if (dist > 2.6 + sp.radius) continue;
        if (ray.distanceToPoint(sp.at) < sp.radius * 0.8 && dist < bestD) {
          best = sp.id;
          bestD = dist;
        }
      }
      if (best !== s.focus) crypt.set({ focus: best });
    } else if (s.focus) crypt.set({ focus: null });
  });

  return null;
};

export default GravePlayer;
