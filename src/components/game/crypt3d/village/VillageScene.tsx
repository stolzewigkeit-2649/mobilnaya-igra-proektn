import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { usePbr } from '@/components/game/crypt3d/materials';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import Buildings from '@/components/game/crypt3d/village/Buildings';
import Villagers from '@/components/game/crypt3d/village/Villagers';
import VillagePlayer from '@/components/game/crypt3d/village/VillagePlayer';
import Timon from '@/components/game/crypt3d/companion/Timon';
import FirstPersonHands from '@/components/game/crypt3d/hands/FirstPersonHands';
import { AREA, collide } from '@/components/game/crypt3d/village/village-layout';

const MOON = new THREE.Vector3(0.5, 0.55, -1).normalize();

const Sky = () => {
  const glow = useMemo(() => glowTexture('rgba(255,210,170,1)'), []);
  const p = MOON.clone().multiplyScalar(60);
  return (
    <group>
      <Stars radius={70} depth={10} count={1200} factor={2.5} fade speed={0.2} />
      <mesh position={p}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#ffe6c8" toneMapped={false} fog={false} />
      </mesh>
      <sprite position={p} scale={[22, 22, 1]}>
        <spriteMaterial map={glow} color="#d8a070" transparent depthWrite={false} blending={THREE.AdditiveBlending} fog={false} opacity={0.5} />
      </sprite>
    </group>
  );
};

const Lights = () => {
  const moon = useRef<THREE.DirectionalLight>(null);
  const scene = useThree((s) => s.scene);
  const grey = useRef(0);
  useEffect(() => {
    if (!moon.current) return;
    moon.current.target.position.set(0, 0, 0);
    scene.add(moon.current.target);
  }, [scene]);
  useFrame((_, dt) => {
    grey.current = THREE.MathUtils.damp(grey.current, crypt.get().grey ? 1 : 0, 1.5, dt);
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.set('#151018').lerp(new THREE.Color('#222428'), grey.current);
      scene.fog.density = 0.035 + grey.current * 0.03;
    }
  });
  return (
    <>
      <ambientLight color="#2c2a3a" intensity={0.32} />
      <hemisphereLight color="#4a4a6a" groundColor="#120c08" intensity={0.38} />
      <directionalLight
        ref={moon}
        position={MOON.clone().multiplyScalar(22)}
        color="#c8c4e0"
        intensity={1.25}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0006}
        shadow-normalBias={0.03}
      />
    </>
  );
};

const Ground = () => {
  const dirt = usePbr('forrest_ground_01', [16, 16], { tint: '#8a7c6a', normal: 1.5 });
  const cobble = usePbr('cobblestone_floor_08', [4, 4], { tint: '#7a746c', normal: 1.4 });
  const road = usePbr('cobblestone_floor_08', [1.4, 8], { tint: '#6c665e', normal: 1.3 });
  const fence = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2e2219', roughness: 1 }), []);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(AREA * 3, AREA * 3, 90, 90);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const far = Math.max(0, Math.max(Math.abs(x), Math.abs(y)) - AREA + 1) * 0.25;
      pos.setZ(i, Math.sin(x * 0.5) * Math.cos(y * 0.4) * 0.05 + far * far);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const posts = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let t = -AREA + 1; t <= AREA - 1; t += 1.6) {
      out.push([-AREA + 1, t, 0], [AREA - 1, t, 0], [t, -AREA + 1, 1]);
      if (Math.abs(t) > 2) out.push([t, AREA - 1, 1]);
    }
    return out;
  }, []);
  return (
    <group>
      <mesh geometry={geo} material={dirt} rotation={[-Math.PI / 2, 0, 0]} receiveShadow />
      <mesh material={cobble} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.6]} receiveShadow>
        <circleGeometry args={[6.2, 40]} />
      </mesh>
      <mesh material={road} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 11]} receiveShadow>
        <planeGeometry args={[2.2, 14]} />
      </mesh>
      {posts.map(([x, z, r], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, r ? 0 : Math.PI / 2, 0]}>
          <mesh material={fence} position={[0, 0.5, 0]}>
            <boxGeometry args={[0.08, 1, 0.08]} />
          </mesh>
          <mesh material={fence} position={[0.8, 0.7, 0]}>
            <boxGeometry args={[1.6, 0.05, 0.04]} />
          </mesh>
          <mesh material={fence} position={[0.8, 0.35, 0]}>
            <boxGeometry args={[1.6, 0.05, 0.04]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Smoke = () => (
  <>
    <Sparkles count={40} scale={[30, 6, 30]} position={[0, 3, 0]} size={1.2} speed={0.12} opacity={0.25} color="#ffd8a8" />
    <Sparkles count={20} scale={[2, 4, 2]} position={[0, 2, -4.6]} size={1.6} speed={0.25} opacity={0.4} color="#ffcf80" />
  </>
);

const Setup = () => {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);
  return null;
};

const VillageScene = ({ onReady }: { onReady: () => void }) => {
  const [low, setLow] = useState(false);
  const setDpr = useThree((s) => s.setDpr);
  useEffect(() => {
    const t = window.setTimeout(onReady, 300);
    return () => window.clearTimeout(t);
  }, [onReady]);

  return (
    <>
      <PerformanceMonitor
        onDecline={() => {
          setLow(true);
          setDpr(1);
        }}
        flipflops={2}
      />
      <color attach="background" args={['#0d0a12']} />
      <fogExp2 attach="fog" args={['#151018', 0.035]} />
      <Setup />
      <Sky />
      <Lights />
      <Ground />
      <Buildings />
      <Villagers />
      {!low && <Smoke />}
      <VillagePlayer />
      <Timon collide={collide} />
      <FirstPersonHands sleeve="#1b1714" />
    </>
  );
};

export default VillageScene;
