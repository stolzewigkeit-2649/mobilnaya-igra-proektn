import * as THREE from 'three';

export const HALL = { w: 10, d: 16, wallH: 3.2, vaultH: 2.0 };
export const HALF_W = HALL.w / 2;
export const HALF_D = HALL.d / 2;
export const EYE = 1.65;

export const COLUMN_Z = [-5.4, -2.7, 0, 2.7, 5.4];
export const COLUMN_X = 3.3;

export const ALTAR = { w: 1.2, d: 2.4, top: 1.02 };

export const SARCOPHAGI: { x: number; z: number; rot: number; name: string }[] = [
  { x: -4.3, z: -4.05, rot: 0, name: 'Ирмина, вдова звонаря' },
  { x: 4.3, z: -4.05, rot: 0, name: 'Безымянный брат' },
  { x: -4.3, z: 4.05, rot: 0, name: 'Тавр Олейник' },
  { x: 4.3, z: 4.05, rot: 0, name: 'Дети Севастиана' },
];

export const PUDDLE = { x: 1.7, z: 3.1, r: 1.25 };

export const DOOR = { w: 1.7, h: 2.5, z: -HALF_D };

export const HECATE_POS = new THREE.Vector3(0, 0, -5.9);

export const START_LYING = { pos: new THREE.Vector3(0, ALTAR.top + 0.22, 0.55), yaw: 0, pitch: 1.32 };
export const START_STAND = { pos: new THREE.Vector3(0.0, EYE, -1.95), yaw: 0, pitch: -0.08 };

export const ALTAR_CANDLES: [number, number, number][] = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  const r = 1.95 + (i % 2) * 0.25;
  return [Math.cos(a) * r * 0.85, 0, Math.sin(a) * r * 1.15];
});

export const EXTRA_CANDLES: [number, number, number][] = [
  ...SARCOPHAGI.flatMap(({ x, z }) => [
    [x + (x > 0 ? -0.15 : 0.15), 0.9, z - 0.75] as [number, number, number],
    [x + (x > 0 ? -0.2 : 0.2), 0.9, z + 0.8] as [number, number, number],
  ]),
  [-0.7, 0, -7.4],
  [0.7, 0, -7.4],
  [-4.4, 0, 0.6],
  [4.4, 0, -0.5],
  [-4.3, 0, 7.2],
  [4.2, 0, 7.3],
];

type Box = { minX: number; maxX: number; minZ: number; maxZ: number };
type Circle = { x: number; z: number; r: number };

const PAD = 0.28;

export const BOXES: Box[] = [
  { minX: -ALTAR.w / 2 - 0.35, maxX: ALTAR.w / 2 + 0.35, minZ: -ALTAR.d / 2 - 0.35, maxZ: ALTAR.d / 2 + 0.35 },
  ...SARCOPHAGI.map(({ x, z }) => ({ minX: x - 0.55, maxX: x + 0.55, minZ: z - 1.15, maxZ: z + 1.15 })),
];

export const CIRCLES: Circle[] = COLUMN_Z.flatMap((z) => [
  { x: -COLUMN_X, z, r: 0.42 },
  { x: COLUMN_X, z, r: 0.42 },
]);

export function resolveCollision(p: THREE.Vector3, doorOpen: boolean) {
  const inDoor = doorOpen && Math.abs(p.x) < DOOR.w / 2 - PAD;
  p.x = THREE.MathUtils.clamp(p.x, -HALF_W + 0.35 + PAD, HALF_W - 0.35 - PAD);
  p.z = THREE.MathUtils.clamp(p.z, inDoor ? -HALF_D - 2.6 : -HALF_D + 0.3 + PAD, HALF_D - 0.3 - PAD);

  for (const b of BOXES) {
    const minX = b.minX - PAD, maxX = b.maxX + PAD, minZ = b.minZ - PAD, maxZ = b.maxZ + PAD;
    if (p.x > minX && p.x < maxX && p.z > minZ && p.z < maxZ) {
      const dx1 = p.x - minX, dx2 = maxX - p.x, dz1 = p.z - minZ, dz2 = maxZ - p.z;
      const m = Math.min(dx1, dx2, dz1, dz2);
      if (m === dx1) p.x = minX;
      else if (m === dx2) p.x = maxX;
      else if (m === dz1) p.z = minZ;
      else p.z = maxZ;
    }
  }
  for (const c of CIRCLES) {
    const dx = p.x - c.x, dz = p.z - c.z;
    const d = Math.hypot(dx, dz);
    const min = c.r + PAD;
    if (d < min && d > 0.0001) {
      p.x = c.x + (dx / d) * min;
      p.z = c.z + (dz / d) * min;
    }
  }
}
