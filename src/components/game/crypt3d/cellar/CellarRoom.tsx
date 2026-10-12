import { useMemo } from 'react';
import * as THREE from 'three';
import { usePbr } from '@/components/game/crypt3d/materials';
import { ROOM, HW, HD, STAIRS } from '@/components/game/crypt3d/cellar/cellar-layout';

const Beam = ({ z, wood }: { z: number; wood: THREE.Material }) => (
  <group>
    <mesh material={wood} position={[0, ROOM.h - 0.12, z]} castShadow receiveShadow>
      <boxGeometry args={[ROOM.w, 0.22, 0.24]} />
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} material={wood} position={[s * (HW - 0.12), ROOM.h / 2, z]} castShadow receiveShadow>
        <boxGeometry args={[0.22, ROOM.h, 0.22]} />
      </mesh>
    ))}
  </group>
);

const Gutter = ({ x1, z1, x2, z2, mat }: { x1: number; z1: number; x2: number; z2: number; mat: THREE.Material }) => {
  const len = Math.hypot(x2 - x1, z2 - z1);
  const ang = Math.atan2(x2 - x1, z2 - z1);
  return (
    <mesh material={mat} position={[(x1 + x2) / 2, 0.006, (z1 + z2) / 2]} rotation={[-Math.PI / 2, 0, ang]} receiveShadow>
      <planeGeometry args={[0.09, len]} />
    </mesh>
  );
};

const CellarRoom = () => {
  const floor = usePbr('cobblestone_floor_08', [3.5, 5], { tint: '#8a7f74', normal: 1.5, roughness: 0.95 });
  const wall = usePbr('castle_brick_07', [3.2, 1.2], { tint: '#9a8d80', normal: 1.6 });
  const wallEnd = usePbr('castle_brick_07', [2.2, 1.2], { tint: '#9a8d80', normal: 1.6 });
  const ceil = usePbr('old_planks_02', [2, 4], { tint: '#5a4a3c', normal: 1.2 });
  const wood = usePbr('old_planks_02', [0.4, 2], { tint: '#6b5847', normal: 1.3 });
  const step = usePbr('old_planks_02', [0.8, 0.2], { tint: '#7a6553', normal: 1.2 });

  const blood = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#2a0705',
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
    [],
  );
  const lime = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#cfc9b8', roughness: 1, transparent: true, opacity: 0.35, polygonOffset: true, polygonOffsetFactor: -1 }),
    [],
  );

  return (
    <group>
      <mesh material={floor} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
      </mesh>
      <mesh material={ceil} position={[0, ROOM.h, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} material={wall} position={[s * HW, ROOM.h / 2, 0]} rotation={[0, -s * (Math.PI / 2), 0]} receiveShadow>
          <planeGeometry args={[ROOM.d, ROOM.h]} />
        </mesh>
      ))}
      <mesh material={wallEnd} position={[0, ROOM.h / 2, -HD]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.h]} />
      </mesh>
      <mesh material={wallEnd} position={[0, ROOM.h / 2, HD]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.h]} />
      </mesh>

      {[-3.4, -0.4, 2.6].map((z) => (
        <Beam key={z} z={z} wood={wood} />
      ))}

      <group position={[STAIRS.x, 0, HD]}>
        {Array.from({ length: 11 }, (_, i) => (
          <mesh key={i} material={step} position={[0, 0.12 + i * 0.24, -1.35 + i * 0.12]} castShadow receiveShadow>
            <boxGeometry args={[STAIRS.w, 0.06, 0.3]} />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={s} material={wood} position={[s * (STAIRS.w / 2 + 0.03), 1.3, -0.75]} rotation={[-1.1, 0, 0]} castShadow>
            <boxGeometry args={[0.06, 0.14, 3.0]} />
          </mesh>
        ))}
        <mesh position={[0, ROOM.h + 0.01, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[STAIRS.w, 1.1]} />
          <meshBasicMaterial color="#d8c39a" side={THREE.DoubleSide} transparent opacity={0.08} />
        </mesh>
      </group>

      <Gutter x1={0.6} z1={-1.6} x2={0.6} z2={3.4} mat={blood} />
      <Gutter x1={0.6} z1={-1.6} x2={HW - 0.75} z2={-1.2} mat={blood} />
      <Gutter x1={0.6} z1={-1.6} x2={-HW + 1.5} z2={-0.6} mat={blood} />
      <Gutter x1={-HW + 1.5} z1={-0.6} x2={-HW + 1.5} z2={-2.6} mat={blood} />
      <mesh material={blood} position={[0.6, 0.007, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 24]} />
      </mesh>
      {[
        [-1.2, 2.6, 0.9],
        [2.1, -3.6, 0.7],
        [-2.2, -3.8, 1.1],
      ].map(([x, z, r], i) => (
        <mesh key={i} material={lime} position={[x, 0.004, z]} rotation={[-Math.PI / 2, 0, i]}>
          <circleGeometry args={[r, 20]} />
        </mesh>
      ))}
    </group>
  );
};

export default CellarRoom;
