import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePbr } from '@/components/game/crypt3d/materials';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import { BARN, CHAPEL, HOUSES, WELL, RIBBON_POLES, type House } from '@/components/game/crypt3d/village/village-layout';

type Mats = { wall: THREE.Material; roof: THREE.Material; beam: THREE.Material; stone: THREE.Material };

const roofGeo = (w: number, d: number, rise: number) => {
  const g = new THREE.BufferGeometry();
  const hw = w / 2 + 0.35;
  const hd = d / 2 + 0.3;
  const v = new Float32Array([
    -hw, 0, -hd, hw, 0, -hd, 0, rise, -hd,
    -hw, 0, hd, 0, rise, hd, hw, 0, hd,
    -hw, 0, -hd, 0, rise, -hd, 0, rise, hd, -hw, 0, -hd, 0, rise, hd, -hw, 0, hd,
    hw, 0, -hd, hw, 0, hd, 0, rise, hd, hw, 0, -hd, 0, rise, hd, 0, rise, -hd,
  ]);
  const uv = new Float32Array([
    0, 0, 1, 0, 0.5, 1, 0, 0, 0.5, 1, 1, 0,
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
  ]);
  g.setAttribute('position', new THREE.BufferAttribute(v, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
};

const Window = ({ x, y, z, ry, lit }: { x: number; y: number; z: number; ry: number; lit: boolean }) => (
  <group position={[x, y, z]} rotation={[0, ry, 0]}>
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[0.55, 0.6]} />
      <meshStandardMaterial color={lit ? '#ffc070' : '#0b0d10'} emissive={lit ? '#ff9a3a' : '#000000'} emissiveIntensity={lit ? 1.6 : 0} toneMapped={!lit} />
    </mesh>
    <mesh position={[0, 0, 0.03]}>
      <boxGeometry args={[0.04, 0.6, 0.03]} />
      <meshStandardMaterial color="#1c140e" />
    </mesh>
    <mesh position={[0, 0, 0.03]}>
      <boxGeometry args={[0.55, 0.04, 0.03]} />
      <meshStandardMaterial color="#1c140e" />
    </mesh>
  </group>
);

const HouseMesh = ({ h, m }: { h: House; m: Mats }) => {
  const roof = useMemo(() => roofGeo(h.w, h.d, 1.4), [h.w, h.d]);
  return (
    <group position={[h.x, 0, h.z]} rotation={[0, h.rot, 0]}>
      <mesh material={m.stone} position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[h.w + 0.1, 0.4, h.d + 0.1]} />
      </mesh>
      <mesh material={m.wall} position={[0, h.h / 2 + 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[h.w, h.h, h.d]} />
      </mesh>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} material={m.beam} position={[(sx * h.w) / 2, h.h / 2 + 0.2, (sz * h.d) / 2]}>
            <boxGeometry args={[0.16, h.h, 0.16]} />
          </mesh>
        )),
      )}
      <mesh geometry={roof} material={m.roof} position={[0, h.h + 0.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow />
      <mesh material={m.stone} position={[h.w / 4, h.h + 1.2, -h.d / 5]} castShadow>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
      </mesh>
      <mesh material={m.beam} position={[0, 0.95, h.d / 2 + 0.02]}>
        <boxGeometry args={[0.85, 1.5, 0.06]} />
      </mesh>
      <Window x={-h.w / 3.2} y={1.5} z={h.d / 2} ry={0} lit={h.lit} />
      <Window x={h.w / 3.2} y={1.5} z={h.d / 2} ry={0} lit={h.lit && h.seed % 2 === 1} />
      <Window x={h.w / 2} y={1.5} z={0} ry={Math.PI / 2} lit={h.lit} />
      {h.lit && <pointLight position={[0, 1.5, h.d / 2 + 0.9]} color="#ff9a4a" intensity={1.4} distance={5} decay={2} />}
      <mesh position={[0, 1.95, h.d / 2 + 0.06]}>
        <planeGeometry args={[0.5, 0.06]} />
        <meshStandardMaterial color="#f2efe6" emissive="#d8d0b8" emissiveIntensity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Chapel = ({ m }: { m: Mats & { white: THREE.Material } }) => {
  const roof = useMemo(() => roofGeo(CHAPEL.w, CHAPEL.d, 2.4), []);
  const towerRoof = useMemo(() => new THREE.ConeGeometry(1.15, 2.6, 4), []);
  const bell = useRef<THREE.Mesh>(null);
  const halo = useMemo(() => glowTexture('rgba(255,220,150,1)'), []);
  useFrame(({ clock }) => {
    if (bell.current) bell.current.rotation.z = Math.sin(clock.elapsedTime * 3) * (crypt.get().stage === 'leaving' ? 0.05 : 0.45);
  });
  const backZ = CHAPEL.z - CHAPEL.d / 2 + 1;
  const front = CHAPEL.z + CHAPEL.d / 2;
  return (
    <group>
      <group position={[CHAPEL.x, 0, CHAPEL.z]}>
        <mesh material={m.stone} position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[CHAPEL.w + 0.3, 0.5, CHAPEL.d + 0.3]} />
        </mesh>
        <mesh material={m.white} position={[0, CHAPEL.h / 2 + 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[CHAPEL.w, CHAPEL.h, CHAPEL.d]} />
        </mesh>
        <mesh geometry={roof} material={m.roof} position={[0, CHAPEL.h + 0.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow />
        {[-1.6, 0, 1.6].map((z) =>
          [-1, 1].map((sx) => (
            <group key={`${z}${sx}`} position={[(sx * CHAPEL.w) / 2 + sx * 0.01, 2.6, z]} rotation={[0, (sx * Math.PI) / 2, 0]}>
              <mesh>
                <planeGeometry args={[0.6, 1.4]} />
                <meshStandardMaterial color="#ffd9a0" emissive="#ffb050" emissiveIntensity={1.3} toneMapped={false} />
              </mesh>
              <mesh position={[0, 0.7, 0]}>
                <circleGeometry args={[0.3, 16, 0, Math.PI]} />
                <meshStandardMaterial color="#ffd9a0" emissive="#ffb050" emissiveIntensity={1.3} toneMapped={false} />
              </mesh>
            </group>
          )),
        )}
      </group>

      <group position={[CHAPEL.x, 0, backZ]}>
        <mesh material={m.white} position={[0, (CHAPEL.h + 3.4) / 2 + 0.5, 0]} castShadow>
          <boxGeometry args={[1.9, CHAPEL.h + 3.4, 1.9]} />
        </mesh>
        <mesh geometry={towerRoof} material={m.roof} position={[0, CHAPEL.h + 3.9 + 1.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow />
        <mesh position={[0, CHAPEL.h + 2.6, 0.96]}>
          <planeGeometry args={[0.9, 1.3]} />
          <meshStandardMaterial color="#120e0a" />
        </mesh>
        <mesh ref={bell} position={[0, CHAPEL.h + 3.0, 0.7]}>
          <cylinderGeometry args={[0.18, 0.34, 0.5, 18, 1, true]} />
          <meshStandardMaterial color="#c8a050" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <group position={[0, CHAPEL.h + 6.9, 0]}>
          <mesh>
            <boxGeometry args={[0.08, 1, 0.08]} />
            <meshStandardMaterial color="#e8d090" metalness={0.9} roughness={0.25} emissive="#a08040" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[0.6, 0.08, 0.08]} />
            <meshStandardMaterial color="#e8d090" metalness={0.9} roughness={0.25} emissive="#a08040" emissiveIntensity={0.4} />
          </mesh>
        </group>
      </group>

      <group position={[CHAPEL.x, 0, front]}>
        <mesh material={m.stone} position={[0, 0.12, 0.5]} receiveShadow>
          <boxGeometry args={[2.4, 0.24, 1]} />
        </mesh>
        <mesh material={m.stone} position={[0, 0.36, 0.25]} receiveShadow>
          <boxGeometry args={[2.2, 0.24, 0.5]} />
        </mesh>
        <mesh material={m.beam} position={[0, 1.6, 0.02]}>
          <boxGeometry args={[1.4, 2.2, 0.08]} />
        </mesh>
        <mesh position={[0, 2.85, 0.04]}>
          <circleGeometry args={[0.7, 20, 0, Math.PI]} />
          <meshStandardMaterial color="#2a1c12" />
        </mesh>
        <sprite position={[0, 1.6, 0.4]} scale={[3, 3, 1]}>
          <spriteMaterial map={halo} color="#ffcf80" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <pointLight position={[0, 2.2, 1.2]} color="#ffc070" intensity={3} distance={8} decay={1.8} />
      </group>
    </group>
  );
};

const Barn = ({ m }: { m: Mats }) => {
  const roof = useMemo(() => roofGeo(BARN.d, BARN.w, 1.8), []);
  const wallT = 0.12;
  const doorW = 2.0;
  const side = (BARN.d - doorW) / 2;
  return (
    <group position={[BARN.x, 0, BARN.z]}>
      <mesh material={m.wall} position={[BARN.w / 2, BARN.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, BARN.h, BARN.d]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} material={m.wall} position={[0, BARN.h / 2, (s * BARN.d) / 2]} castShadow receiveShadow>
          <boxGeometry args={[BARN.w, BARN.h, wallT]} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={'f' + s} material={m.wall} position={[-BARN.w / 2, BARN.h / 2, s * (doorW / 2 + side / 2)]} castShadow receiveShadow>
          <boxGeometry args={[wallT, BARN.h, side]} />
        </mesh>
      ))}
      <mesh material={m.wall} position={[-BARN.w / 2, BARN.h - 0.35, 0]}>
        <boxGeometry args={[wallT, 0.7, doorW]} />
      </mesh>
      <group position={[-BARN.w / 2 - 0.05, 0, -doorW / 2]} rotation={[0, -1.2, 0]}>
        <mesh material={m.beam} position={[0, (BARN.h - 0.7) / 2, doorW / 4]}>
          <boxGeometry args={[0.08, BARN.h - 0.7, doorW / 2]} />
        </mesh>
      </group>
      <mesh geometry={roof} material={m.roof} position={[0, BARN.h, 0]} castShadow />
      <mesh material={m.beam} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[BARN.w - 0.2, BARN.d - 0.2]} />
      </mesh>
      {[-2, 0, 2].map((z) => (
        <mesh key={z} material={m.beam} position={[0, BARN.h - 0.1, z]}>
          <boxGeometry args={[BARN.w, 0.18, 0.18]} />
        </mesh>
      ))}
      <mesh position={[BARN.w / 2 - 0.8, 0.6, BARN.d / 2 - 0.9]} material={m.roof}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
      </mesh>
      <group position={[-0.5, 2.3, 0]}>
        <mesh>
          <boxGeometry args={[0.18, 0.26, 0.18]} />
          <meshStandardMaterial color="#ffcf80" emissive="#ff9a3a" emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
        <pointLight color="#ffae5a" intensity={2.4} distance={6} decay={1.8} castShadow shadow-mapSize={[512, 512]} />
      </group>
    </group>
  );
};

const Well = ({ m }: { m: Mats }) => (
  <group position={[WELL.x, 0, WELL.z]}>
    <mesh material={m.stone} position={[0, 0.45, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.75, 0.8, 0.9, 20, 1, true]} />
    </mesh>
    <mesh position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.7, 20]} />
      <meshStandardMaterial color="#05070a" roughness={0.1} metalness={0.4} />
    </mesh>
    {[-0.65, 0.65].map((x) => (
      <mesh key={x} material={m.beam} position={[x, 1.3, 0]}>
        <boxGeometry args={[0.1, 1.7, 0.1]} />
      </mesh>
    ))}
    <mesh material={m.beam} position={[0, 2.1, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.07, 0.07, 1.4, 8]} />
    </mesh>
    <mesh material={m.roof} position={[0, 2.45, 0]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[1.0, 1.0, 1.6]} />
    </mesh>
  </group>
);

const Ribbons = () => {
  const ref = useRef<THREE.Group>(null);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f4f0e4', emissive: '#bfb7a0', emissiveIntensity: 0.25, side: THREE.DoubleSide, roughness: 1 }), []);
  const pole = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3a2a1c', roughness: 1 }), []);
  const lines = useMemo(() => {
    const pairs: [number, number][] = [[0, 1], [2, 3], [0, 2], [1, 3]];
    return pairs.map(([a, b]) => {
      const p0 = new THREE.Vector3(RIBBON_POLES[a][0], 3.2, RIBBON_POLES[a][1]);
      const p1 = new THREE.Vector3(RIBBON_POLES[b][0], 3.2, RIBBON_POLES[b][1]);
      return Array.from({ length: 9 }, (_, i) => {
        const t = (i + 0.5) / 9;
        const p = p0.clone().lerp(p1, t);
        p.y -= Math.sin(t * Math.PI) * 0.6;
        return p;
      });
    });
  }, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      c.rotation.x = Math.sin(clock.elapsedTime * 2.1 + i * 0.7) * 0.35;
    });
  });
  return (
    <group>
      {RIBBON_POLES.map(([x, z]) => (
        <mesh key={`${x}${z}`} material={pole} position={[x, 1.65, z]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 3.3, 8]} />
        </mesh>
      ))}
      <group ref={ref}>
        {lines.flat().map((p, i) => (
          <mesh key={i} material={mat} position={[p.x, p.y - 0.25, p.z]}>
            <planeGeometry args={[0.12, 0.5]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Buildings = () => {
  const wall = usePbr('old_planks_02', [1.5, 1], { tint: '#7a6250', normal: 1.3 });
  const roof = usePbr('old_planks_02', [2, 3], { tint: '#3a2e26', normal: 1.6 });
  const beam = usePbr('bark_brown_02', [0.4, 1.4], { tint: '#3e2f24', normal: 1 });
  const stone = usePbr('rock_wall_08', [1.4, 0.4], { tint: '#7c776e', normal: 1.4 });
  const white = usePbr('castle_brick_07', [2, 1.6], { tint: '#d8d4ca', normal: 0.6 });
  const m = { wall, roof, beam, stone };
  return (
    <group>
      {HOUSES.map((h) => (
        <HouseMesh key={h.seed} h={h} m={m} />
      ))}
      <Chapel m={{ ...m, white }} />
      <Barn m={m} />
      <Well m={m} />
      <Ribbons />
    </group>
  );
};

export default Buildings;
