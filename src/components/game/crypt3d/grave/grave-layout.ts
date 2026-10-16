import * as THREE from 'three';

export const AREA = 15;

export const CRYPT_DOOR = new THREE.Vector3(0, 0, 9.4);
export const START = { pos: new THREE.Vector3(0, 1.65, 8.2), yaw: 0 };
export const BODY = new THREE.Vector3(0.9, 0, 1.6);
export const SARIEL_SPOT = new THREE.Vector3(-2.6, 0, -2.4);
export const SARIEL_SEAT = new THREE.Vector3(-2.6, 0, -2.4);
export const GATE = new THREE.Vector3(0, 0, -14.6);
export const MOON_DIR = new THREE.Vector3(-0.45, 0.62, -1).normalize();

function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export type Grave = { x: number; z: number; rot: number; tilt: number; kind: 'cross' | 'stone' | 'celtic'; h: number };

export const GRAVES: Grave[] = (() => {
  const out: Grave[] = [];
  let i = 0;
  for (let gx = -11; gx <= 11; gx += 2.3) {
    for (let gz = -11; gz <= 7; gz += 2.6) {
      i++;
      const x = gx + (rand(i) - 0.5) * 0.9;
      const z = gz + (rand(i + 50) - 0.5) * 0.9;
      if (Math.abs(x) < 1.6) continue;
      if (Math.hypot(x - BODY.x, z - BODY.z) < 2.2) continue;
      if (Math.hypot(x - SARIEL_SPOT.x, z - SARIEL_SPOT.z) < 1.6) continue;
      if (rand(i + 9) < 0.18) continue;
      const r = rand(i + 3);
      out.push({
        x,
        z,
        rot: (rand(i + 5) - 0.5) * 0.35,
        tilt: (rand(i + 7) - 0.5) * 0.32,
        kind: r < 0.55 ? 'cross' : r < 0.85 ? 'stone' : 'celtic',
        h: 0.8 + rand(i + 11) * 0.6,
      });
    }
  }
  return out;
})();

export const TREES: { x: number; z: number; s: number; r: number }[] = [
  { x: -6.5, z: 3.5, s: 1.15, r: 0.3 },
  { x: 7.2, z: -1.5, s: 1.3, r: 1.9 },
  { x: -8.5, z: -7.5, s: 1.0, r: 4.1 },
  { x: 4.5, z: -9.5, s: 1.2, r: 2.5 },
  { x: 10.5, z: 6.5, s: 0.95, r: 5.2 },
  { x: -11.5, z: 8.5, s: 1.1, r: 0.9 },
];

const PAD = 0.3;

export function collide(p: THREE.Vector3) {
  p.x = THREE.MathUtils.clamp(p.x, -AREA + 1, AREA - 1);
  p.z = THREE.MathUtils.clamp(p.z, -AREA + 1, 8.6);
  for (const g of GRAVES) {
    const r = g.kind === 'stone' ? 0.42 : 0.3;
    push(p, g.x, g.z, r + PAD);
  }
  for (const t of TREES) push(p, t.x, t.z, 0.4 * t.s + PAD);
  push(p, BODY.x, BODY.z, 0.55);
  push(p, SARIEL_SEAT.x, SARIEL_SEAT.z, 0.75);
  if (Math.abs(p.x) < 1.1) p.z = Math.max(p.z, -AREA + 0.7);
}

function push(p: THREE.Vector3, x: number, z: number, r: number) {
  const dx = p.x - x;
  const dz = p.z - z;
  const d = Math.hypot(dx, dz);
  if (d < r && d > 1e-4) {
    p.x = x + (dx / d) * r;
    p.z = z + (dz / d) * r;
  }
}
