import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Figure from '@/components/game/crypt3d/grave/Figure';
import { BODY, SARIEL_SPOT, GATE } from '@/components/game/crypt3d/grave/grave-layout';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { usePbr } from '@/components/game/crypt3d/materials';

const skinMat = (c: string) =>
  new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.6, sheen: 0.5, sheenColor: new THREE.Color('#ffd9d0') });

const Body = () => {
  const m = useMemo(
    () => ({
      skin: skinMat('#b9aea6'),
      cloth: new THREE.MeshStandardMaterial({ color: '#8e8676', roughness: 1 }),
      pants: new THREE.MeshStandardMaterial({ color: '#2f2b26', roughness: 1 }),
      hair: new THREE.MeshStandardMaterial({ color: '#3a2a1e', roughness: 0.9 }),
    }),
    [],
  );
  const cloth = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (cloth.current) cloth.current.visible = crypt.get().inspected.includes('cloth-seen') && !crypt.get().inspected.includes('cloth');
  });
  return (
    <group position={[BODY.x, 0.11, BODY.z]} rotation={[0, 0.4, 0]}>
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.85]}>
        <Figure {...m} armL={[0.1, 0, 0.9]} armR={[-0.2, 0, -1.3]} legL={[0, 0, 0.08]} legR={[0, 0, -0.14]} head={[0.2, 0, 0.35]} />
      </group>
      <mesh position={[0, 0.005, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.006, 6, 24]} />
        <meshStandardMaterial color="#4a2b20" roughness={1} />
      </mesh>
      <mesh ref={cloth} position={[0.62, 0.02, -0.05]} rotation={[-Math.PI / 2, 0, 0.6]} visible={false}>
        <planeGeometry args={[0.16, 0.1]} />
        <meshStandardMaterial color="#efe8d6" emissive="#d8c89a" emissiveIntensity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Soul = () => {
  const root = useRef<THREE.Group>(null);
  const k = useRef(0);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#a8c8ff',
        emissive: '#5a86d8',
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0,
        roughness: 0.2,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const glow = useMemo(() => glowTexture('rgba(160,200,255,1)'), []);
  const halo = useRef<THREE.Sprite>(null);

  useFrame(({ clock }, dt) => {
    const s = crypt.get();
    k.current = THREE.MathUtils.damp(k.current, s.stage === 'soul' ? 1 : 0, s.stage === 'soul' ? 1.2 : 0.6, dt);
    const fade = s.lineIndex >= 3 && s.stage === 'soul' ? 0.6 : 1;
    mat.opacity = k.current * 0.55 * fade + Math.sin(clock.elapsedTime * 7) * 0.03 * k.current;
    if (root.current) {
      root.current.visible = k.current > 0.01;
      root.current.position.y = -0.4 + k.current * 0.4 + Math.sin(clock.elapsedTime * 1.4) * 0.05;
    }
    if (halo.current) halo.current.scale.setScalar(2.6 * k.current);
  });

  return (
    <group ref={root} position={[BODY.x - 0.7, 0, BODY.z - 0.5]} rotation={[0, 0.9, 0]} visible={false}>
      <Figure skin={mat} cloth={mat} pants={mat} hair={mat} armL={[-0.4, 0, 0.3]} armR={[-2.3, 0, -0.4]} head={[0.25, 0.2, 0]} />
      <sprite ref={halo} position={[0, 1.2, 0]}>
        <spriteMaterial map={glow} color="#8ab4ff" transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.6} />
      </sprite>
      <pointLight position={[0, 1.3, 0.3]} color="#8ab4ff" intensity={2.5} distance={5} decay={2} />
      <Sparkles count={30} scale={[0.8, 1.8, 0.8]} position={[0, 1, 0]} size={2} speed={0.5} color="#bcd4ff" />
    </group>
  );
};

const Sariel = () => {
  const root = useRef<THREE.Group>(null);
  const bell = useRef<THREE.Mesh>(null);
  const k = useRef(0);
  const coat = usePbr('bark_brown_02', [1, 1], { tint: '#1c1f2a', normal: 0.3, roughness: 1 });
  const m = useMemo(
    () => ({
      skin: skinMat('#e3dcd8'),
      cloth: coat,
      pants: new THREE.MeshStandardMaterial({ color: '#111318', roughness: 0.9 }),
      hair: new THREE.MeshPhysicalMaterial({ color: '#d8dde6', roughness: 0.35, sheen: 1, sheenColor: new THREE.Color('#ffffff') }),
    }),
    [coat],
  );
  const glow = useMemo(() => glowTexture('rgba(220,230,255,1)'), []);

  useFrame(({ clock, camera }, dt) => {
    const s = crypt.get();
    const want = ['sariel', 'talk', 'follow', 'leaving'].includes(s.stage) ? 1 : 0;
    k.current = THREE.MathUtils.damp(k.current, want, 1.4, dt);
    if (!root.current) return;
    root.current.visible = k.current > 0.01;
    const p = root.current.position;
    let face = Math.atan2(camera.position.x - p.x, camera.position.z - p.z);
    let walking = false;
    if (s.stage === 'follow' || s.stage === 'leaving') {
      const tx = p.z > -6 ? 0 : GATE.x + 0.6;
      const tz = p.z > -6 ? -6 : GATE.z + 1.4;
      const dx = tx - p.x;
      const dz = tz - p.z;
      const d = Math.hypot(dx, dz);
      const lead = Math.hypot(camera.position.x - p.x, camera.position.z - p.z);
      if (d > 0.15 && lead < 6) {
        const step = Math.min(d, dt * 1.5);
        p.x += (dx / d) * step;
        p.z += (dz / d) * step;
        face = Math.atan2(dx, dz);
        walking = true;
      }
    }
    p.y = (1 - k.current) * -0.3 + (walking ? Math.abs(Math.sin(clock.elapsedTime * 6)) * 0.03 : 0);
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, face, walking ? 5 : 2, dt);
    if (bell.current) bell.current.rotation.z = Math.sin(clock.elapsedTime * 2.2) * 0.15;
  });

  return (
    <group ref={root} position={[SARIEL_SPOT.x, 0, SARIEL_SPOT.z]} visible={false}>
      <group scale={1.06}>
        <Figure {...m} coat hairLong armL={[0.15, 0, 0.18]} armR={[0.1, 0, -0.2]} head={[0.05, 0, 0]}>
          <mesh ref={bell} position={[0.22, 0.98, 0.12]}>
            <cylinderGeometry args={[0.025, 0.06, 0.09, 16, 1, true]} />
            <meshStandardMaterial color="#e8eeff" emissive="#b9c8ff" emissiveIntensity={1.4} metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[-0.24, 0.95, 0.1]} rotation={[0, 0, 0.4]}>
            <torusGeometry args={[0.1, 0.008, 6, 20, Math.PI * 1.2]} />
            <meshStandardMaterial color="#9aa3b5" metalness={1} roughness={0.25} />
          </mesh>
        </Figure>
      </group>
      <sprite position={[0.24, 1.03, 0.14]} scale={[0.35, 0.35, 1]}>
        <spriteMaterial map={glow} color="#cfd8ff" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <pointLight position={[0.3, 1.2, 0.4]} color="#c9d4ff" intensity={1.2} distance={3} decay={2} />
    </group>
  );
};

const Characters = () => (
  <>
    <Body />
    <Soul />
    <Sariel />
  </>
);

export default Characters;
