import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { HALL, PUDDLE } from '@/components/game/crypt3d/layout';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';

const DROPS = 3;

const Water = ({ reflect }: { reflect: boolean }) => {
  const drops = useRef<(THREE.Mesh | null)[]>([]);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const st = useMemo(
    () =>
      Array.from({ length: DROPS }, (_, i) => ({
        x: PUDDLE.x + (i - 1) * 0.45,
        z: PUDDLE.z + ((i * 7) % 3) * 0.25 - 0.25,
        y: HALL.wallH + 1.2,
        v: 0,
        wait: 0.8 + i * 1.7,
        ring: 1,
      })),
    [],
  );

  useFrame((_, dt) => {
    st.forEach((d, i) => {
      const m = drops.current[i];
      const r = rings.current[i];
      if (d.wait > 0) {
        d.wait -= dt;
        if (m) m.visible = false;
      } else {
        d.v += 9.8 * dt;
        d.y -= d.v * dt;
        if (m) {
          m.visible = true;
          m.position.set(d.x, d.y, d.z);
          m.scale.set(1, 1 + d.v * 0.25, 1);
        }
        if (d.y <= 0.01) {
          d.y = HALL.wallH + 1.2;
          d.v = 0;
          d.wait = 2 + Math.random() * 4;
          d.ring = 0;
          cryptAudio.drip();
        }
      }
      if (r) {
        d.ring = Math.min(1, d.ring + dt * 0.9);
        r.position.set(d.x, 0.012, d.z);
        r.scale.setScalar(0.05 + d.ring * 0.7);
        (r.material as THREE.MeshBasicMaterial).opacity = (1 - d.ring) * 0.55;
      }
    });
  });

  return (
    <group>
      <mesh position={[PUDDLE.x, 0.006, PUDDLE.z]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.25, 0.8, 1]}>
        <circleGeometry args={[PUDDLE.r, 48]} />
        {reflect ? (
          <MeshReflectorMaterial
            resolution={512}
            mirror={0.85}
            blur={[200, 80]}
            mixBlur={0.6}
            mixStrength={4}
            depthScale={0}
            color="#0b0f14"
            metalness={0.4}
            roughness={0.15}
          />
        ) : (
          <meshStandardMaterial color="#05080c" roughness={0.04} metalness={0.6} />
        )}
      </mesh>
      {st.map((_, i) => (
        <group key={i}>
          <mesh ref={(m) => { drops.current[i] = m; }}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#9fc4ff" emissive="#2b4f86" roughness={0} metalness={0.2} />
          </mesh>
          <mesh ref={(m) => { rings.current[i] = m; }} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.92, 1, 48]} />
            <meshBasicMaterial color="#a8c8ff" transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default Water;