import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import { glowTexture } from '@/components/game/crypt3d/glow';

const skin = new THREE.MeshPhysicalMaterial({
  color: '#d9cbc2',
  roughness: 0.55,
  sheen: 0.6,
  sheenColor: new THREE.Color('#ffd9d0'),
  clearcoat: 0.1,
});

const Hand = ({ side }: { side: 1 | -1 }) => (
  <group scale={[side, 1, 1]}>
    <mesh material={skin} position={[0, 0, 0]} scale={[1, 0.38, 1.15]}>
      <sphereGeometry args={[0.055, 20, 14]} />
    </mesh>
    {[-0.033, -0.011, 0.011, 0.032].map((x, i) => (
      <mesh
        key={x}
        material={skin}
        position={[x, 0.004, -0.078 - (i === 1 || i === 2 ? 0.008 : 0)]}
        rotation={[-Math.PI / 2 - 0.25, 0, 0]}
      >
        <capsuleGeometry args={[0.0095, 0.05 + (i === 1 || i === 2 ? 0.012 : 0), 4, 10]} />
      </mesh>
    ))}
    <mesh material={skin} position={[0.058, 0, -0.012]} rotation={[-Math.PI / 2, 0, -0.9]}>
      <capsuleGeometry args={[0.011, 0.04, 4, 10]} />
    </mesh>
    <mesh material={skin} position={[0, -0.005, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
      <capsuleGeometry args={[0.032, 0.14, 4, 12]} />
    </mesh>
    <mesh position={[0, -0.006, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.052, 0.14, 16]} />
      <meshStandardMaterial color="#14121a" roughness={0.9} />
    </mesh>
  </group>
);

const HeroBody = () => {
  const camera = useThree((s) => s.camera);
  const rig = useRef<THREE.Group>(null);
  const hands = useRef<THREE.Group>(null);
  const shard = useRef<THREE.Group>(null);
  const glow = useMemo(() => glowTexture('rgba(255,244,214,1)'), []);
  const handsK = useRef(0);
  const shardK = useRef(0);

  useFrame(({ clock }, dt) => {
    const s = crypt.get();
    if (!rig.current) return;
    rig.current.position.copy(camera.position);
    rig.current.quaternion.copy(camera.quaternion);
    handsK.current = THREE.MathUtils.damp(handsK.current, s.looking ? 1 : 0, 5, dt);
    if (hands.current) {
      hands.current.visible = handsK.current > 0.02;
      hands.current.position.set(0, -0.45 + handsK.current * 0.2, -0.42);
      hands.current.rotation.x = -0.35 + Math.sin(clock.elapsedTime * 1.3) * 0.02;
    }
    const showShard = s.stage === 'intro' || s.stage === 'shard';
    shardK.current = THREE.MathUtils.damp(shardK.current, showShard ? 1 : 0, 3, dt);
    if (shard.current) {
      shard.current.visible = shardK.current > 0.02;
      shard.current.position.set(0, -0.32 + (1 - shardK.current) * -0.3, -0.5);
      shard.current.rotation.y = clock.elapsedTime * 0.6;
      const pulse = s.stage === 'shard' ? 1.2 + Math.sin(clock.elapsedTime * 4) * 0.3 : 0.6;
      shard.current.scale.setScalar(pulse * 0.7 + 0.3);
    }
  });

  return (
    <group ref={rig}>
      <group ref={hands}>
        <group position={[-0.11, 0, 0]} rotation={[0, 0.25, 0.15]}>
          <Hand side={-1} />
        </group>
        <group position={[0.11, 0, 0]} rotation={[0, -0.25, -0.15]}>
          <Hand side={1} />
        </group>
      </group>
      <group ref={shard}>
        <mesh rotation={[0.3, 0, 0.4]}>
          <octahedronGeometry args={[0.035, 0]} />
          <meshPhysicalMaterial color="#fff7e3" emissive="#ffe9b0" emissiveIntensity={3} roughness={0.05} transmission={0.4} toneMapped={false} />
        </mesh>
        <sprite scale={[0.22, 0.22, 1]}>
          <spriteMaterial map={glow} color="#fff0c8" transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </sprite>
        <pointLight color="#ffe6b5" intensity={0.6} distance={2.5} decay={2} />
      </group>
    </group>
  );
};

export default HeroBody;
