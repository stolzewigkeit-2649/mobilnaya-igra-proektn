import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function mistTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  for (let i = 0; i < 6; i++) {
    const x = 34 + Math.random() * 60;
    const y = 44 + Math.random() * 40;
    const r = 30 + Math.random() * 30;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(255,255,255,0.35)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const GroundMist = ({ count = 34 }: { count?: number }) => {
  const tex = useMemo(mistTexture, []);
  const puffs = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 26,
        z: (Math.random() - 0.5) * 24 - 2,
        y: 0.25 + Math.random() * 0.5,
        s: 3 + Math.random() * 4,
        v: 0.05 + Math.random() * 0.08,
        o: 0.12 + Math.random() * 0.12,
      })),
    [count],
  );
  const refs = useRef<(THREE.Sprite | null)[]>([]);

  useFrame((_, dt) => {
    puffs.forEach((p, i) => {
      p.x += p.v * dt;
      if (p.x > 14) p.x = -14;
      const sp = refs.current[i];
      if (sp) sp.position.set(p.x, p.y, p.z);
    });
  });

  return (
    <group>
      {puffs.map((p, i) => (
        <sprite key={i} ref={(s) => (refs.current[i] = s)} position={[p.x, p.y, p.z]} scale={[p.s, p.s * 0.45, 1]}>
          <spriteMaterial map={tex} color="#8a9ab8" transparent opacity={p.o} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
};

export default GroundMist;
