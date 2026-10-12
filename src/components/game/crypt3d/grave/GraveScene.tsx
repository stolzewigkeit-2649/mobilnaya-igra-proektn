import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, Sparkles, Cloud, Clouds, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Terrain from '@/components/game/crypt3d/grave/Terrain';
import Graves from '@/components/game/crypt3d/grave/Graves';
import Characters from '@/components/game/crypt3d/grave/Characters';
import GravePlayer from '@/components/game/crypt3d/grave/GravePlayer';
import { MOON_DIR } from '@/components/game/crypt3d/grave/grave-layout';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { crypt } from '@/components/game/crypt3d/crypt-store';

const MOON_COLOR = new THREE.Color('#b9c8ff');

const Sky = () => {
  const glow = useMemo(() => glowTexture('rgba(220,230,255,1)'), []);
  const moonPos = MOON_DIR.clone().multiplyScalar(60);
  return (
    <group>
      <Stars radius={70} depth={10} count={1500} factor={2.5} fade speed={0.2} />
      <mesh position={moonPos}>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial color="#eef2ff" toneMapped={false} fog={false} />
      </mesh>
      <sprite position={moonPos} scale={[26, 26, 1]}>
        <spriteMaterial map={glow} color="#9fb2e8" transparent depthWrite={false} blending={THREE.AdditiveBlending} fog={false} opacity={0.65} />
      </sprite>
    </group>
  );
};

const Lights = () => {
  const moon = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const scene = useThree((s) => s.scene);
  const grey = useRef(0);

  useEffect(() => {
    if (!moon.current) return;
    moon.current.target.position.set(0, 0, 0);
    scene.add(moon.current.target);
  }, [scene]);

  useFrame((_, dt) => {
    grey.current = THREE.MathUtils.damp(grey.current, crypt.get().grey ? 1 : 0, 1.5, dt);
    if (moon.current) moon.current.color.copy(MOON_COLOR).lerp(new THREE.Color('#9aa0a8'), grey.current);
    if (amb.current) amb.current.intensity = 0.28 - grey.current * 0.1;
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.set('#0a0f1c').lerp(new THREE.Color('#202428'), grey.current);
      scene.fog.density = 0.045 + grey.current * 0.03;
    }
  });

  return (
    <>
      <ambientLight ref={amb} color="#2a3550" intensity={0.28} />
      <hemisphereLight color="#3c4d78" groundColor="#0a0c0a" intensity={0.35} />
      <directionalLight
        ref={moon}
        position={MOON_DIR.clone().multiplyScalar(20)}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0006}
        shadow-normalBias={0.03}
      />
    </>
  );
};

const Setup = () => {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.25;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);
  return null;
};

const GraveScene = ({ onReady }: { onReady: () => void }) => {
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
      <color attach="background" args={['#070b16']} />
      <fogExp2 attach="fog" args={['#0a0f1c', 0.045]} />
      <Setup />
      <Sky />
      <Lights />
      <Terrain lowQuality={low} />
      <Graves />
      <Characters />
      {!low && (
        <Clouds limit={60}>
          <Cloud seed={3} position={[0, 0.4, -4]} bounds={[14, 0.4, 10]} segments={26} volume={7} opacity={0.18} color="#8a9ab8" speed={0.08} fade={30} />
        </Clouds>
      )}
      <Sparkles count={low ? 40 : 110} scale={[24, 3, 24]} position={[0, 1.4, 0]} size={1.3} speed={0.15} opacity={0.3} color="#b9c8ff" />
      <GravePlayer />
    </>
  );
};

export default GraveScene;
