import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAGES, CAGE } from '@/components/game/crypt3d/cellar/cellar-layout';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import { usePbr } from '@/components/game/crypt3d/materials';
import Figure from '@/components/game/crypt3d/grave/Figure';

const BARS = 7;

const Bars = ({ len, iron, axis }: { len: number; iron: THREE.Material; axis: 'x' | 'z' }) => (
  <group>
    {Array.from({ length: BARS }, (_, i) => {
      const t = -len / 2 + (len / (BARS - 1)) * i;
      return (
        <mesh key={i} material={iron} position={axis === 'x' ? [t, CAGE.h / 2, 0] : [0, CAGE.h / 2, t]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, CAGE.h, 6]} />
        </mesh>
      );
    })}
    {[0.08, CAGE.h - 0.05, CAGE.h * 0.55].map((y) => (
      <mesh key={y} material={iron} position={[0, y, 0]} castShadow>
        <boxGeometry args={axis === 'x' ? [len, 0.04, 0.04] : [0.04, 0.04, len]} />
      </mesh>
    ))}
  </group>
);

const Captive = ({ alive, mats }: { alive: boolean; mats: Parameters<typeof Figure>[0] }) => {
  const g = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    if (!g.current) return;
    const free = crypt.get().inspected.includes('freed');
    if (outer.current && alive) outer.current.position.x = THREE.MathUtils.damp(outer.current.position.x, free ? 1.0 : 0, 1.2, dt);
    const t = clock.elapsedTime;
    g.current.position.y = alive ? Math.sin(t * 1.2) * 0.006 : 0;
    g.current.rotation.z = alive && !free ? Math.sin(t * 0.5) * 0.04 : 0;
  });
  return (
    <group ref={outer}>
    <group ref={g} position={[0.05, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
      <group position={[0, -0.58, -0.25]} rotation={[0.25, 0, 0]}>
        <Figure
          {...mats}
          legL={[-1.5, 0, 0.12]}
          legR={[-1.5, 0, -0.12]}
          armL={[-0.6, 0, 0.5]}
          armR={[-0.6, 0, -0.5]}
          head={alive ? [0.35, 0.2, 0.1] : [0.75, 0.3, 0.3]}
        />
      </group>
      <mesh position={[0, 0.88, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.012, 6, 16]} />
        <meshStandardMaterial color="#4d3a2b" roughness={1} />
      </mesh>
    </group>
    </group>
  );
};

const Cage = ({ x, z, captive, iron, straw, mats, open }: {
  x: number;
  z: number;
  captive: 'dead' | 'alive' | 'empty';
  iron: THREE.Material;
  straw: THREE.Material;
  mats: Parameters<typeof Figure>[0];
  open: boolean;
}) => {
  const door = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const want = open && crypt.get().inspected.includes('freed') ? -1.6 : 0;
    if (door.current) door.current.rotation.y = THREE.MathUtils.damp(door.current.rotation.y, want, 2, dt);
  });
  return (
    <group position={[x, 0, z]}>
      <group position={[-CAGE.w / 2, 0, 0]}>
        <Bars len={CAGE.d} iron={iron} axis="z" />
      </group>
      <group position={[0, 0, -CAGE.d / 2]}>
        <Bars len={CAGE.w} iron={iron} axis="x" />
      </group>
      <group position={[0, 0, CAGE.d / 2]}>
        <Bars len={CAGE.w} iron={iron} axis="x" />
      </group>
      <group ref={door} position={[CAGE.w / 2, 0, -CAGE.d / 2]}>
        <group position={[0, 0, CAGE.d / 2]}>
          <Bars len={CAGE.d} iron={iron} axis="z" />
        </group>
        <mesh material={iron} position={[0.03, 1.0, CAGE.d - 0.12]}>
          <boxGeometry args={[0.06, 0.12, 0.08]} />
        </mesh>
      </group>
      <mesh material={iron} position={[0, CAGE.h, 0]}>
        <boxGeometry args={[CAGE.w, 0.04, CAGE.d]} />
      </mesh>
      <mesh material={straw} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0.3]} receiveShadow>
        <circleGeometry args={[0.6, 18]} />
      </mesh>
      {captive !== 'empty' && <Captive alive={captive === 'alive'} mats={mats} />}
      {captive === 'empty' && (
        <mesh position={[0.2, 0.03, 0.3]} rotation={[-Math.PI / 2, 0, 0.8]}>
          <planeGeometry args={[0.25, 0.12]} />
          <meshStandardMaterial color="#c9c2b1" roughness={1} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

const Cages = () => {
  const iron = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2c2724', metalness: 0.75, roughness: 0.62 }), []);
  const straw = usePbr('old_planks_02', [1, 1], { tint: '#8a7348', normal: 0.4 });
  const mats = useMemo(
    () => ({
      skin: new THREE.MeshPhysicalMaterial({ color: '#c4b0a2', roughness: 0.65, sheen: 0.4, sheenColor: new THREE.Color('#ffccbb') }),
      cloth: new THREE.MeshStandardMaterial({ color: '#77705f', roughness: 1 }),
      pants: new THREE.MeshStandardMaterial({ color: '#3a342c', roughness: 1 }),
      hair: new THREE.MeshStandardMaterial({ color: '#2d2219', roughness: 0.9 }),
    }),
    [],
  );
  return (
    <group>
      {CAGES.map((c) => (
        <Cage key={c.id} {...c} iron={iron} straw={straw} mats={mats} open={c.captive !== 'dead'} />
      ))}
    </group>
  );
};

export default Cages;
