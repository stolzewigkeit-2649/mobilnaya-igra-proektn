import { useMemo } from 'react';
import * as THREE from 'three';
import { usePbr } from '@/components/game/crypt3d/materials';
import {
  HALL,
  HALF_W,
  HALF_D,
  COLUMN_Z,
  COLUMN_X,
  DOOR,
} from '@/components/game/crypt3d/layout';

const Column = ({ x, z, marble }: { x: number; z: number; marble: THREE.Material }) => (
  <group position={[x, 0, z]}>
    <mesh material={marble} position={[0, 0.12, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.78, 0.24, 0.78]} />
    </mesh>
    <mesh material={marble} position={[0, 0.3, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.36, 0.42, 0.14, 24]} />
    </mesh>
    <mesh material={marble} position={[0, HALL.wallH / 2 + 0.1, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.27, 0.31, HALL.wallH - 0.5, 24, 1]} />
    </mesh>
    <mesh material={marble} position={[0, HALL.wallH - 0.1, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.42, 0.29, 0.22, 24]} />
    </mesh>
    <mesh material={marble} position={[0, HALL.wallH + 0.06, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.86, 0.14, 0.86]} />
    </mesh>
  </group>
);

const Rib = ({ z, rock }: { z: number; rock: THREE.Material }) => (
  <mesh material={rock} position={[0, HALL.wallH, z]} scale={[1, HALL.vaultH / HALF_W, 1]} castShadow>
    <torusGeometry args={[HALF_W - 0.02, 0.17, 10, 40, Math.PI]} />
  </mesh>
);

const Architecture = () => {
  const floor = usePbr('cobblestone_floor_08', [5, 8], { tint: '#9aa3a6', normal: 1.4 });
  const wall = usePbr('castle_brick_07', [6.4, 1.28], { tint: '#a7aeb0', normal: 1.5 });
  const wallEnd = usePbr('castle_brick_07', [0.4, 0.4], { tint: '#a7aeb0', normal: 1.5 });
  const vault = usePbr('rock_wall_08', [6, 3], { tint: '#7e8588', normal: 1.6 });
  const vaultInner = useMemo(() => {
    const m = vault.clone();
    m.side = THREE.BackSide;
    return m;
  }, [vault]);
  const rock = usePbr('rock_wall_08', [1, 3], { tint: '#8f9799' });
  const marble = usePbr('marble_01', [1, 2], { tint: '#b9b6ae', roughness: 0.9, normal: 0.8 });

  const vaultGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(HALF_W, HALF_W, HALL.d, 48, 1, true, -Math.PI / 2, Math.PI);
    g.rotateX(-Math.PI / 2);
    g.scale(1, HALL.vaultH / HALF_W, 1);
    return g;
  }, []);

  const endWallGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-HALF_W, 0);
    s.lineTo(HALF_W, 0);
    s.lineTo(HALF_W, HALL.wallH);
    s.absellipse(0, HALL.wallH, HALF_W, HALL.vaultH, 0, Math.PI, false, 0);
    s.lineTo(-HALF_W, 0);
    return s;
  }, []);

  const frontGeo = useMemo(() => {
    const s = new THREE.Shape();
    const hw = DOOR.w / 2;
    s.moveTo(-HALF_W, 0);
    s.lineTo(-hw, 0);
    s.lineTo(-hw, DOOR.h - hw);
    s.absarc(0, DOOR.h - hw, hw, Math.PI, 0, true);
    s.lineTo(hw, 0);
    s.lineTo(HALF_W, 0);
    s.lineTo(HALF_W, HALL.wallH);
    s.absellipse(0, HALL.wallH, HALF_W, HALL.vaultH, 0, Math.PI, false, 0);
    s.lineTo(-HALF_W, 0);
    return new THREE.ShapeGeometry(s, 24);
  }, []);

  const backGeo = useMemo(() => {
    return new THREE.ShapeGeometry(endWallGeo, 24);
  }, [endWallGeo]);

  return (
    <group>
      <mesh material={floor} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[HALL.w, HALL.d]} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh
          key={side}
          material={wall}
          position={[side * HALF_W, HALL.wallH / 2, 0]}
          rotation={[0, -side * (Math.PI / 2), 0]}
          receiveShadow
        >
          <planeGeometry args={[HALL.d, HALL.wallH]} />
        </mesh>
      ))}

      <mesh geometry={vaultGeo} material={vaultInner} position={[0, HALL.wallH, 0]} receiveShadow />

      <mesh geometry={frontGeo} material={wallEnd} position={[0, 0, -HALF_D]} receiveShadow />
      <mesh geometry={backGeo} material={wallEnd} position={[0, 0, HALF_D]} rotation={[0, Math.PI, 0]} receiveShadow />

      {COLUMN_Z.map((z) => (
        <group key={z}>
          <Column x={-COLUMN_X} z={z} marble={marble} />
          <Column x={COLUMN_X} z={z} marble={marble} />
          <Rib z={z} rock={rock} />
        </group>
      ))}

      {[-1, 1].map((side) =>
        COLUMN_Z.map((z) => (
          <mesh key={`${side}${z}`} material={rock} position={[side * (HALF_W - 0.12), HALL.wallH / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[0.26, HALL.wallH, 0.5]} />
          </mesh>
        )),
      )}

      <group position={[0, 0, -HALF_D]}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} material={rock} position={[0, 0.09 + i * 0.18, -0.3 - i * 0.28]} castShadow receiveShadow>
            <boxGeometry args={[DOOR.w, 0.18, 0.3]} />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={s} material={wallEnd} position={[s * (DOOR.w / 2 + 0.05), 2, -1.4]} rotation={[0, -s * (Math.PI / 2), 0]}>
            <planeGeometry args={[2.8, 4]} />
          </mesh>
        ))}
        <mesh material={rock} position={[0, 3.6, -1.4]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[DOOR.w + 0.2, 2.8]} />
        </mesh>
      </group>
    </group>
  );
};

export default Architecture;
