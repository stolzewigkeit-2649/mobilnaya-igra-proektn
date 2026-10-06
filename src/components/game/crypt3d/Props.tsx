import { useMemo } from 'react';
import * as THREE from 'three';
import { usePbr } from '@/components/game/crypt3d/materials';
import { textTexture } from '@/components/game/crypt3d/glow';
import { ALTAR, SARCOPHAGI } from '@/components/game/crypt3d/layout';

const Sarcophagus = ({
  x,
  z,
  name,
  marble,
  lid,
}: {
  x: number;
  z: number;
  name: string;
  marble: THREE.Material;
  lid: THREE.Material;
}) => {
  const label = useMemo(() => textTexture([name, '· спит до суда ·'], '#b8b1a3'), [name]);
  const face = x > 0 ? -1 : 1;

  return (
    <group position={[x, 0, z]}>
      <mesh material={marble} position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.12, 2.3]} />
      </mesh>
      <mesh material={marble} position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.98, 0.62, 2.06]} />
      </mesh>
      <mesh material={lid} position={[0, 0.79, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.12, 2.2]} />
      </mesh>
      <mesh material={lid} position={[0, 0.88, 0]} rotation={[0, 0, Math.PI / 4]} scale={[1, 1, 1]} castShadow>
        <boxGeometry args={[0.16, 0.16, 1.9]} />
      </mesh>
      <mesh position={[face * 0.495, 0.45, 0]} rotation={[0, (face * Math.PI) / 2, 0]}>
        <planeGeometry args={[1.6, 0.4]} />
        <meshStandardMaterial map={label} transparent roughness={1} color="#8d877b" />
      </mesh>
    </group>
  );
};

const Props = () => {
  const marble = usePbr('marble_01', [1, 2], { tint: '#8f8c86', roughness: 0.95, normal: 0.9 });
  const lid = usePbr('marble_01', [1, 2], { tint: '#a39f97', roughness: 0.85, normal: 0.9 });
  const altarStone = usePbr('marble_01', [1.4, 2], { tint: '#9d9a94', roughness: 0.8, normal: 0.9 });
  const step = usePbr('castle_brick_07', [1.5, 0.4], { tint: '#8c9395' });

  return (
    <group>
      <group>
        <mesh material={step} position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[ALTAR.w + 1.0, 0.16, ALTAR.d + 1.0]} />
        </mesh>
        <mesh material={step} position={[0, 0.24, 0]} castShadow receiveShadow>
          <boxGeometry args={[ALTAR.w + 0.55, 0.16, ALTAR.d + 0.55]} />
        </mesh>
        <mesh material={altarStone} position={[0, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[ALTAR.w - 0.1, 0.56, ALTAR.d - 0.15]} />
        </mesh>
        <mesh material={altarStone} position={[0, ALTAR.top - 0.07, 0]} castShadow receiveShadow>
          <boxGeometry args={[ALTAR.w + 0.12, 0.14, ALTAR.d + 0.1]} />
        </mesh>
        <mesh position={[0, ALTAR.top + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.42, 48]} />
          <meshStandardMaterial color="#1a2a44" emissive="#2d5fae" emissiveIntensity={0.35} roughness={0.6} />
        </mesh>
      </group>

      {SARCOPHAGI.map((s) => (
        <Sarcophagus key={s.name} x={s.x} z={s.z} name={s.name} marble={marble} lid={lid} />
      ))}
    </group>
  );
};

export default Props;
