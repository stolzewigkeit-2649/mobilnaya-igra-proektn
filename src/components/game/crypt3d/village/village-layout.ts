import * as THREE from 'three';

export const AREA = 18;
export const START = { pos: new THREE.Vector3(0, 1.65, 15.5), yaw: 0 };

export const CHAPEL = { x: 0, z: -9, w: 5, d: 7.5, h: 4.2 };
export const CHAPEL_DOOR = new THREE.Vector3(0, 0, CHAPEL.z + CHAPEL.d / 2);
export const BARN = { x: 9.5, z: 1, w: 5.5, d: 7, h: 3.4 };
export const BARN_DOOR = new THREE.Vector3(BARN.x - BARN.w / 2 - 0.4, 0, BARN.z);
export const WELL = new THREE.Vector3(-1.6, 0, 2.2);

export const PREACHER = new THREE.Vector3(0.8, 0, CHAPEL.z + CHAPEL.d / 2 + 0.9);
export const VILLAGER = new THREE.Vector3(-3.6, 0, 5.2);
export const WIDOWER = new THREE.Vector3(-9.6, 0, -2.4);
export const SARIEL_POST = new THREE.Vector3(BARN.x - BARN.w / 2 - 1.4, 0, BARN.z + 2.6);

export const BODIES: { x: number; z: number; rot: number; marked?: string }[] = [
  { x: BARN.x - 1.6, z: BARN.z - 2.2, rot: 0 },
  { x: BARN.x - 0.4, z: BARN.z - 2.2, rot: 0 },
  { x: BARN.x + 0.8, z: BARN.z - 2.2, rot: 0, marked: 'lime' },
  { x: BARN.x - 1.0, z: BARN.z + 1.6, rot: Math.PI },
  { x: BARN.x + 0.4, z: BARN.z + 1.6, rot: Math.PI, marked: 'girl' },
];

export const CART_TRACK: [number, number][] = [
  [BARN.x - BARN.w / 2 - 0.6, BARN.z - 1.2],
  [6.0, -1.6],
  [5.5, -4.4],
  [3.4, -6.6],
  [CHAPEL.x + CHAPEL.w / 2 + 0.6, CHAPEL.z + 1.2],
];
export const CART = new THREE.Vector3(CHAPEL.x + CHAPEL.w / 2 + 1.2, 0, CHAPEL.z + 0.4);

export type House = { x: number; z: number; w: number; d: number; h: number; rot: number; lit: boolean; seed: number };

export const HOUSES: House[] = [
  { x: -9.5, z: -5.8, w: 4.4, d: 3.8, h: 2.6, rot: 0.15, lit: true, seed: 1 },
  { x: -10.5, z: 3.6, w: 4.2, d: 3.6, h: 2.5, rot: -0.1, lit: false, seed: 2 },
  { x: -8.6, z: 11, w: 4.6, d: 4, h: 2.7, rot: 0.25, lit: true, seed: 3 },
  { x: 9.6, z: 10, w: 4.2, d: 3.6, h: 2.5, rot: -0.3, lit: true, seed: 4 },
  { x: 10.4, z: -8.4, w: 4.0, d: 3.6, h: 2.4, rot: 0.2, lit: false, seed: 5 },
  { x: -4.6, z: -14.2, w: 3.8, d: 3.4, h: 2.4, rot: 0.05, lit: false, seed: 6 },
  { x: 5.4, z: -14.6, w: 4.0, d: 3.4, h: 2.4, rot: -0.12, lit: true, seed: 7 },
];
export const WIDOWER_HOUSE = HOUSES[0];

export const RIBBON_POLES: [number, number][] = [
  [-3.2, -2.6], [3.2, -2.6], [-3.6, 4.2], [3.6, 4.2],
];

const PAD = 0.35;

function boxPush(p: THREE.Vector3, cx: number, cz: number, w: number, d: number, rot: number) {
  const c = Math.cos(-rot);
  const s = Math.sin(-rot);
  const lx = (p.x - cx) * c - (p.z - cz) * s;
  const lz = (p.x - cx) * s + (p.z - cz) * c;
  const hw = w / 2 + PAD;
  const hd = d / 2 + PAD;
  if (Math.abs(lx) >= hw || Math.abs(lz) >= hd) return;
  const ox = hw - Math.abs(lx);
  const oz = hd - Math.abs(lz);
  let nx = lx;
  let nz = lz;
  if (ox < oz) nx = Math.sign(lx || 1) * hw;
  else nz = Math.sign(lz || 1) * hd;
  const ci = Math.cos(rot);
  const si = Math.sin(rot);
  p.x = cx + nx * ci - nz * si;
  p.z = cz + nx * si + nz * ci;
}

function circlePush(p: THREE.Vector3, x: number, z: number, r: number) {
  const dx = p.x - x;
  const dz = p.z - z;
  const d = Math.hypot(dx, dz);
  if (d < r && d > 1e-4) {
    p.x = x + (dx / d) * r;
    p.z = z + (dz / d) * r;
  }
}

export function collide(p: THREE.Vector3) {
  p.x = THREE.MathUtils.clamp(p.x, -AREA + 1, AREA - 1);
  p.z = THREE.MathUtils.clamp(p.z, -AREA + 1, AREA - 1);
  for (const h of HOUSES) boxPush(p, h.x, h.z, h.w, h.d, h.rot);
  boxPush(p, CHAPEL.x, CHAPEL.z, CHAPEL.w, CHAPEL.d, 0);
  boxPush(p, CHAPEL.x, CHAPEL.z - CHAPEL.d / 2 + 1, 2, 2, 0);
  const inBarn = Math.abs(p.x - BARN.x) < BARN.w / 2 - 0.2 && Math.abs(p.z - BARN.z) < BARN.d / 2 - 0.2;
  if (!inBarn) {
    const nearDoor = Math.abs(p.z - BARN.z) < 1.1 && p.x < BARN.x;
    if (!nearDoor) boxPush(p, BARN.x, BARN.z, BARN.w, BARN.d, 0);
  } else {
    const atDoor = Math.abs(p.z - BARN.z) < 0.9;
    p.x = THREE.MathUtils.clamp(p.x, atDoor ? -AREA : BARN.x - BARN.w / 2 + 0.45, BARN.x + BARN.w / 2 - 0.45);
    p.z = THREE.MathUtils.clamp(p.z, BARN.z - BARN.d / 2 + 0.45, BARN.z + BARN.d / 2 - 0.45);
    for (const b of BODIES) boxPush(p, b.x, b.z, 0.5, 1.8, 0);
  }
  circlePush(p, WELL.x, WELL.z, 0.9);
  circlePush(p, -6.2, -10.0, 0.6);
  circlePush(p, CART.x, CART.z, 1.1);
  circlePush(p, PREACHER.x, PREACHER.z, 0.55);
  circlePush(p, VILLAGER.x, VILLAGER.z, 0.5);
  circlePush(p, WIDOWER.x, WIDOWER.z, 0.5);
  for (const [x, z] of RIBBON_POLES) circlePush(p, x, z, 0.3);
}
