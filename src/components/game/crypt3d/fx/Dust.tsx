import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { glowTexture } from '@/components/game/crypt3d/glow';

type Props = { count?: number; area: [number, number, number]; center?: [number, number, number]; color?: string; size?: number };

const Dust = ({ count = 400, area, center = [0, 0, 0], color = '#d8dcff', size = 0.035 }: Props) => {
  const ref = useRef<THREE.Points>(null);
  const tex = useMemo(() => glowTexture('rgba(255,255,255,1)'), []);
  const { geo, seeds } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    const sd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = center[0] + (Math.random() - 0.5) * area[0];
      p[i * 3 + 1] = center[1] + Math.random() * area[1];
      p[i * 3 + 2] = center[2] + (Math.random() - 0.5) * area[2];
      sd[i] = Math.random() * 100;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return { geo: g, seeds: sd };
  }, [count, area, center]);

  useFrame(({ clock }, dt) => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      let y = pos.getY(i) + dt * (0.015 + (s % 1) * 0.02);
      if (y > center[1] + area[1]) y = center[1];
      pos.setXYZ(i, pos.getX(i) + Math.sin(t * 0.3 + s) * dt * 0.03, y, pos.getZ(i) + Math.cos(t * 0.25 + s) * dt * 0.03);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <pointsMaterial map={tex} color={color} size={size} sizeAttenuation transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  );
};

export default Dust;
