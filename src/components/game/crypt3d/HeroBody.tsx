import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import { glowTexture } from '@/components/game/crypt3d/glow';
import FirstPersonHands from '@/components/game/crypt3d/hands/FirstPersonHands';

const HeroBody = () => {
  const camera = useThree((s) => s.camera);
  const rig = useRef<THREE.Group>(null);
  const shard = useRef<THREE.Group>(null);
  const glow = useMemo(() => glowTexture('rgba(255,244,214,1)'), []);
  const shardK = useRef(0);

  useFrame(({ clock }, dt) => {
    const s = crypt.get();
    if (!rig.current) return;
    rig.current.position.copy(camera.position);
    rig.current.quaternion.copy(camera.quaternion);
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
    <>
    <FirstPersonHands />
    <group ref={rig}>
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
    </>
  );
};

export default HeroBody;
