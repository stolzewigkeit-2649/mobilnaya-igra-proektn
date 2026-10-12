import * as THREE from 'three';

export const ROOM = { w: 7, d: 10, h: 2.7 };
export const HW = ROOM.w / 2;
export const HD = ROOM.d / 2;

export const STAIRS = { x: 0, z: HD - 0.9, w: 1.2 };
export const START = { pos: new THREE.Vector3(0, 1.65, HD - 2.3), yaw: 0 };

export const CAGES = [
  { id: 'cage-1', x: -HW + 0.75, z: -2.6, captive: 'dead' as const },
  { id: 'cage-2', x: -HW + 0.75, z: -0.6, captive: 'alive' as const },
  { id: 'cage-3', x: -HW + 0.75, z: 1.4, captive: 'empty' as const },
];
export const CAGE = { w: 1.3, d: 1.5, h: 1.9 };

export const TABLE = { x: HW - 0.75, z: -1.2, w: 0.9, d: 2.0, h: 0.82 };
export const CIRCLE = { x: 0.6, z: -1.6, r: 1.15 };
export const ALTAR = { x: 0, z: -HD + 0.5, w: 1.8, d: 0.6, h: 1.0 };
export const SHELF = { x: HW - 0.25, z: 2.2 };
export const BENCH = { x: HW - 0.55, z: 2.2 };

type Box = { minX: number; maxX: number; minZ: number; maxZ: number };
const PAD = 0.3;

const BOXES: Box[] = [
  ...CAGES.map((c) => ({ minX: c.x - CAGE.w / 2, maxX: c.x + CAGE.w / 2, minZ: c.z - CAGE.d / 2 + 0.1, maxZ: c.z + CAGE.d / 2 - 0.1 })),
  { minX: TABLE.x - TABLE.w / 2, maxX: TABLE.x + TABLE.w / 2, minZ: TABLE.z - TABLE.d / 2, maxZ: TABLE.z + TABLE.d / 2 },
  { minX: ALTAR.x - ALTAR.w / 2, maxX: ALTAR.x + ALTAR.w / 2, minZ: ALTAR.z - ALTAR.d / 2, maxZ: ALTAR.z + ALTAR.d / 2 },
  { minX: SHELF.x - 0.3, maxX: SHELF.x + 0.3, minZ: SHELF.z - 0.9, maxZ: SHELF.z + 0.9 },
  { minX: STAIRS.x - STAIRS.w / 2 - 0.2, maxX: STAIRS.x + STAIRS.w / 2 + 0.2, minZ: HD - 1.4, maxZ: HD },
];

export function collide(p: THREE.Vector3) {
  p.x = THREE.MathUtils.clamp(p.x, -HW + PAD + 0.05, HW - PAD - 0.05);
  p.z = THREE.MathUtils.clamp(p.z, -HD + PAD + 0.05, HD - PAD - 0.05);
  for (const b of BOXES) {
    const minX = b.minX - PAD, maxX = b.maxX + PAD, minZ = b.minZ - PAD, maxZ = b.maxZ + PAD;
    if (p.x > minX && p.x < maxX && p.z > minZ && p.z < maxZ) {
      const d = [p.x - minX, maxX - p.x, p.z - minZ, maxZ - p.z];
      const m = Math.min(...d);
      if (m === d[0]) p.x = minX;
      else if (m === d[1]) p.x = maxX;
      else if (m === d[2]) p.z = minZ;
      else p.z = maxZ;
    }
  }
}
