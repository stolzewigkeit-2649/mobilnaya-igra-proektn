import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import * as THREE from 'three';
import { usePbr } from '@/components/game/crypt3d/materials';
import { GRAVES, TREES, AREA, type Grave } from '@/components/game/crypt3d/grave/grave-layout';

const Marker = ({ g, stone, wood }: { g: Grave; stone: THREE.Material; wood: THREE.Material }) => (
  <group position={[g.x, 0, g.z]} rotation={[g.tilt * 0.4, g.rot, g.tilt]}>
    {g.kind === 'post' && (
      <group>
        <mesh material={wood} position={[0, g.h / 2, 0]} castShadow>
          <boxGeometry args={[0.16, g.h, 0.14]} />
        </mesh>
        <mesh material={wood} position={[0, g.h + 0.06, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.24, 0.24, 0.26]} />
        </mesh>
        <mesh material={wood} position={[0, g.h * 0.62, 0.075]}>
          <torusGeometry args={[0.045, 0.012, 6, 16]} />
        </mesh>
      </group>
    )}
    {g.kind === 'stone' && (
      <group>
        <mesh material={stone} position={[0, g.h * 0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, g.h * 0.76, 0.14]} />
        </mesh>
        <mesh material={stone} position={[0, g.h * 0.76, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.14, 20, 1, false, 0, Math.PI]} />
        </mesh>
      </group>
    )}
    {g.kind === 'menhir' && (
      <group>
        <mesh material={stone} position={[0, g.h * 0.5, 0]} scale={[0.32, g.h * 0.55, 0.22]} rotation={[0, 0.3, 0.06]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
        </mesh>
        <mesh position={[0, g.h * 0.62, 0.2]} rotation={[0, 0, 0.5]}>
          <torusGeometry args={[0.08, 0.012, 6, 20, Math.PI * 1.1]} />
          <meshStandardMaterial color="#9fb2d8" emissive="#5a6e98" emissiveIntensity={0.35} roughness={0.6} />
        </mesh>
      </group>
    )}
    <mesh position={[0, 0.03, 0.75]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[0.7, 1.4]} />
      <meshStandardMaterial color="#1a1a14" roughness={1} transparent opacity={0.55} />
    </mesh>
  </group>
);

const Tree = ({ x, z, s, r, bark }: { x: number; z: number; s: number; r: number; bark: THREE.Material }) => {
  const branches = useMemo(() => {
    const out: { p: [number, number, number]; rot: [number, number, number]; l: number; t: number }[] = [];
    for (let i = 0; i < 9; i++) {
      const a = r + i * 2.4;
      const h = 1.8 + (i % 5) * 0.45;
      const l = 1.1 + ((i * 7) % 4) * 0.35;
      out.push({ p: [Math.cos(a) * 0.1, h, Math.sin(a) * 0.1], rot: [Math.sin(a) * 0.9, a, Math.cos(a) * 0.9], l, t: 0.07 });
    }
    return out;
  }, [r]);
  return (
    <group position={[x, 0, z]} scale={s} rotation={[0, r, 0.05]}>
      <mesh material={bark} position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.34, 3.2, 10]} />
      </mesh>
      <mesh material={bark} position={[0.2, 3.5, 0.1]} rotation={[0, 0, -0.35]} castShadow>
        <cylinderGeometry args={[0.07, 0.15, 1.6, 8]} />
      </mesh>
      {branches.map((b, i) => (
        <group key={i} position={b.p} rotation={b.rot}>
          <mesh material={bark} position={[0, b.l / 2, 0]} castShadow>
            <cylinderGeometry args={[0.02, b.t, b.l, 6]} />
          </mesh>
          <mesh material={bark} position={[0.12, b.l * 0.85, 0]} rotation={[0, 0, -0.7]} castShadow>
            <cylinderGeometry args={[0.01, 0.03, b.l * 0.5, 5]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Fence = ({ iron }: { iron: THREE.Material }) => {
  const posts = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let t = -AREA; t <= AREA; t += 0.35) {
      if (Math.abs(t) > 1.2) out.push([t, 0, -AREA]);
      out.push([-AREA, 0, t], [AREA, 0, t]);
    }
    return out;
  }, []);
  return (
    <group>
      {posts.map((p, i) => (
        <mesh key={i} material={iron} position={[p[0], 0.75, p[2]]}>
          <cylinderGeometry args={[0.015, 0.015, 1.5, 4]} />
        </mesh>
      ))}
      {[0.25, 1.35].map((y) => (
        <group key={y}>
          {[-1, 1].map((sx) => (
            <mesh key={sx} material={iron} position={[sx * (AREA + 1.2) / 2, y, -AREA]}>
              <boxGeometry args={[AREA - 1.2, 0.03, 0.03]} />
            </mesh>
          ))}
          <mesh material={iron} position={[-AREA, y, 0]}>
            <boxGeometry args={[0.03, 0.03, AREA * 2]} />
          </mesh>
          <mesh material={iron} position={[AREA, y, 0]}>
            <boxGeometry args={[0.03, 0.03, AREA * 2]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Gate = ({ iron, stone }: { iron: THREE.Material; stone: THREE.Material }) => {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.PointLight>(null);
  const open = useRef(0);
  const bars = useMemo(() => Array.from({ length: 6 }, (_, i) => 0.08 + i * 0.17), []);
  useFrame(({ clock }, dt) => {
    const s = crypt.get().stage;
    open.current = THREE.MathUtils.damp(open.current, s === 'follow' || s === 'leaving' ? 1 : 0, 1.2, dt);
    if (left.current) left.current.rotation.y = -open.current * 1.6;
    if (right.current) right.current.rotation.y = open.current * 1.6;
    if (lamp.current) lamp.current.intensity = 1.6 + Math.sin(clock.elapsedTime * 9) * 0.25 + Math.random() * 0.15 + (s === 'follow' ? 1.2 : 0);
  });
  const leaf = (sx: number) => (
    <group>
      {bars.map((x) => (
        <mesh key={x} material={iron} position={[sx * x, 0.9, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 1.8, 5]} />
        </mesh>
      ))}
      {[0.3, 1.0, 1.7].map((y) => (
        <mesh key={y} material={iron} position={[sx * 0.52, y, 0]}>
          <boxGeometry args={[1.04, 0.04, 0.04]} />
        </mesh>
      ))}
      {bars.map((x) => (
        <mesh key={'t' + x} material={iron} position={[sx * x, 1.86, 0]}>
          <coneGeometry args={[0.03, 0.1, 4]} />
        </mesh>
      ))}
    </group>
  );
  return (
    <group position={[0, 0, -AREA]}>
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} material={stone} position={[x, 1.1, 0]} castShadow>
          <boxGeometry args={[0.32, 2.2, 0.32]} />
        </mesh>
      ))}
      {[-1.2, 1.2].map((x) => (
        <mesh key={'c' + x} material={stone} position={[x, 2.3, 0]}>
          <sphereGeometry args={[0.17, 12, 10]} />
        </mesh>
      ))}
      <group ref={left} position={[-1.05, 0, 0]}>{leaf(1)}</group>
      <group ref={right} position={[1.05, 0, 0]}>{leaf(-1)}</group>
      <mesh position={[1.2, 1.9, 0.22]}>
        <boxGeometry args={[0.12, 0.18, 0.12]} />
        <meshStandardMaterial color="#ffcf80" emissive="#ff9a3a" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight ref={lamp} position={[1.2, 1.9, 0.6]} color="#ffae5a" distance={7} decay={1.8} />
    </group>
  );
};

const Graves = () => {
  const stone = usePbr('marble_01', [0.6, 1], { tint: '#7b7d7a', roughness: 0.95, normal: 1.2 });
  const wood = usePbr('bark_brown_02', [0.3, 1], { tint: '#6a6158', normal: 1 });
  const bark = usePbr('bark_brown_02', [1, 2], { tint: '#545049', normal: 1.6 });
  const iron = useMemo(() => new THREE.MeshStandardMaterial({ color: '#16181a', metalness: 0.7, roughness: 0.55 }), []);

  return (
    <group>
      {GRAVES.map((g, i) => (
        <Marker key={i} g={g} stone={stone} wood={wood} />
      ))}
      {TREES.map((t, i) => (
        <Tree key={i} {...t} bark={bark} />
      ))}
      <Fence iron={iron} />
      <Gate iron={iron} stone={stone} />
    </group>
  );
};

export default Graves;
