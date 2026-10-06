import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { HECATE_POS } from '@/components/game/crypt3d/layout';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { crypt } from '@/components/game/crypt3d/crypt-store';

const VIOLET = new THREE.Color('#9b59d0');
const TEAL = new THREE.Color('#4fd1c5');

const robeProfile = [
  [0.0, 2.36], [0.12, 2.3], [0.2, 2.12], [0.24, 1.98], [0.36, 1.86], [0.42, 1.6],
  [0.46, 1.2], [0.52, 0.8], [0.62, 0.4], [0.78, 0.05], [0.84, 0],
].map(([r, y]) => new THREE.Vector2(r, y));

const Face = ({ angle, mat }: { angle: number; mat: THREE.Material }) => (
  <group rotation={[0, angle, 0]}>
    <mesh material={mat} position={[0, 0, 0.13]} scale={[0.82, 1.05, 0.5]}>
      <sphereGeometry args={[0.12, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
    </mesh>
    {[-0.04, 0.04].map((x) => (
      <mesh key={x} position={[x, 0.015, 0.205]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#e9fffb" toneMapped={false} />
      </mesh>
    ))}
  </group>
);

const Hecate = () => {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Sprite>(null);
  const light = useRef<THREE.PointLight>(null);
  const show = useRef(0);

  const robeGeo = useMemo(() => new THREE.LatheGeometry(robeProfile, 48), []);
  const glow = useMemo(() => glowTexture('rgba(190,140,255,1)'), []);

  const robe = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#1a0f2a',
        emissive: VIOLET,
        emissiveIntensity: 0.35,
        roughness: 0.6,
        transparent: true,
        opacity: 0,
        sheen: 1,
        sheenColor: TEAL,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );
  const mask = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#e9e3f5',
        emissive: '#b98ae0',
        emissiveIntensity: 0.5,
        roughness: 0.25,
        clearcoat: 1,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  useFrame(({ clock }, dt) => {
    const s = crypt.get();
    const want = s.stage === 'hecate' || s.stage === 'gift' ? 1 : 0;
    show.current = THREE.MathUtils.damp(show.current, want, 0.9, dt);
    const v = show.current;
    const t = clock.elapsedTime;
    if (root.current) {
      root.current.visible = v > 0.01;
      root.current.position.y = 0.05 + Math.sin(t * 0.8) * 0.04;
    }
    robe.opacity = v * 0.92;
    robe.emissiveIntensity = 0.25 + Math.sin(t * 2.1) * 0.08 + (s.stage === 'gift' ? 0.2 : 0);
    mask.opacity = v;
    const smiling = s.lines[s.lineIndex]?.text.startsWith('Геката улыбается');
    mask.emissiveIntensity = 0.45 + (smiling ? 0.9 : 0) + Math.sin(t * 3) * 0.05;
    if (head.current) head.current.rotation.y = t * 0.35;
    if (halo.current) {
      const k = (1.6 + Math.sin(t * 1.7) * 0.12) * v;
      halo.current.scale.set(k * 2.4, k * 3.4, 1);
    }
    if (light.current) light.current.intensity = v * (7 + Math.sin(t * 5) * 1.2);
  });

  return (
    <group ref={root} position={HECATE_POS} visible={false}>
      <mesh geometry={robeGeo} material={robe} />
      <group ref={head} position={[0, 2.06, 0]}>
        <mesh material={robe} scale={[1, 1.15, 1]}>
          <sphereGeometry args={[0.15, 24, 16]} />
        </mesh>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a) => (
          <Face key={a} angle={a} mat={mask} />
        ))}
      </group>
      <mesh position={[0.36, 1.25, 0.25]} rotation={[0.3, 0, 0.5]}>
        <torusGeometry args={[0.06, 0.012, 8, 20]} />
        <meshStandardMaterial color="#c49a52" metalness={0.9} roughness={0.3} emissive="#5a3d14" />
      </mesh>
      <sprite ref={halo} position={[0, 1.4, -0.1]}>
        <spriteMaterial map={glow} color="#9b59d0" transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <pointLight ref={light} position={[0, 1.6, 0.8]} color="#a77bff" distance={9} decay={1.6} intensity={0} />
      <Sparkles count={60} scale={[1.8, 2.8, 1.8]} position={[0, 1.4, 0]} size={2.4} speed={0.35} color="#c9a6ff" opacity={0.8} />
    </group>
  );
};

export default Hecate;
