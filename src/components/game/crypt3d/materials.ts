import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

type Set4 = 'castle_brick_07' | 'cobblestone_floor_08' | 'marble_01' | 'rock_wall_08';

const MAPS: Record<Set4, string[]> = {
  castle_brick_07: ['diff', 'nor_gl', 'rough', 'ao'],
  cobblestone_floor_08: ['diff', 'nor_gl', 'rough', 'ao'],
  marble_01: ['diff', 'nor_gl', 'rough', 'ao'],
  rock_wall_08: ['diff', 'nor_gl', 'rough'],
};

const url = (set: Set4, m: string) => `/crypt/${set}_${m}.webp`;

export const ALL_TEXTURES = (Object.keys(MAPS) as Set4[]).flatMap((s) =>
  MAPS[s].map((m) => url(s, m)),
);

export function usePbr(
  set: Set4,
  repeat: [number, number],
  opts: { tint?: string; roughness?: number; normal?: number; envBoost?: number } = {},
) {
  const maps = MAPS[set];
  const tex = useTexture(maps.map((m) => url(set, m)));
  const aniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  return useMemo(() => {
    const cloned = tex.map((t) => {
      const c = t.clone();
      c.wrapS = c.wrapT = THREE.RepeatWrapping;
      c.repeat.set(repeat[0], repeat[1]);
      c.anisotropy = Math.min(8, aniso);
      c.needsUpdate = true;
      return c;
    });
    const [diff, nor, rough, ao] = cloned;
    diff.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshStandardMaterial({
      map: diff,
      normalMap: nor,
      roughnessMap: rough,
      aoMap: ao ?? null,
      aoMapIntensity: 1,
      roughness: opts.roughness ?? 1,
      metalness: 0,
      color: new THREE.Color(opts.tint ?? '#ffffff'),
      normalScale: new THREE.Vector2(opts.normal ?? 1.2, opts.normal ?? 1.2),
      envMapIntensity: opts.envBoost ?? 0.4,
    });
    return mat;
  }, [tex, repeat[0], repeat[1], aniso, opts.tint, opts.roughness, opts.normal, opts.envBoost]); // eslint-disable-line react-hooks/exhaustive-deps
}
