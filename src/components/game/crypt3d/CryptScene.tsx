import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Architecture from '@/components/game/crypt3d/Architecture';
import Props from '@/components/game/crypt3d/Props';
import Candles, { CANDLE_COUNT } from '@/components/game/crypt3d/Candles';
import Water from '@/components/game/crypt3d/Water';
import Hecate from '@/components/game/crypt3d/Hecate';
import HeroBody from '@/components/game/crypt3d/HeroBody';
import Player from '@/components/game/crypt3d/Player';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import { HALF_D, DOOR } from '@/components/game/crypt3d/layout';
import CinematicFX from '@/components/game/crypt3d/fx/CinematicFX';
import LightShafts from '@/components/game/crypt3d/fx/LightShafts';
import Dust from '@/components/game/crypt3d/fx/Dust';

const Lighting = () => {
  const exitLight = useRef<THREE.SpotLight>(null);
  const keyLight = useRef<THREE.PointLight>(null);
  const exitK = useRef(0);

  useFrame(({ clock }, dt) => {
    const s = crypt.get();
    exitK.current = THREE.MathUtils.damp(exitK.current, s.stage === 'gift' || s.stage === 'leaving' ? 1 : 0, 0.8, dt);
    if (exitLight.current) exitLight.current.intensity = exitK.current * 60;
    const lit = Math.min(1, s.candlesLit / CANDLE_COUNT);
    const dim = s.stage === 'hecate' ? 0.55 : 1;
    if (keyLight.current)
      keyLight.current.intensity = lit * dim * (11 + Math.sin(clock.elapsedTime * 9) * 0.5 + Math.random() * 0.4);
  });

  return (
    <>
      <ambientLight color="#1b2638" intensity={0.32} />
      <hemisphereLight color="#2a3b5c" groundColor="#05070a" intensity={0.35} />
      <pointLight
        ref={keyLight}
        position={[0, 1.9, 0]}
        color="#7fb0ff"
        distance={11}
        decay={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.002}
        shadow-radius={6}
      />
      <spotLight
        ref={exitLight}
        position={[0, 4.2, -HALF_D - 2.4]}
        target-position={[0, 0, -HALF_D + 2]}
        angle={0.55}
        penumbra={0.8}
        distance={14}
        color="#d6c7a3"
        intensity={0}
      />
    </>
  );
};

const Exposure = () => {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.15;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);
  return null;
};

const CryptScene = ({ onExitReached, onReady }: { onExitReached: () => void; onReady: () => void }) => {
  useEffect(() => {
    const t = window.setTimeout(onReady, 300);
    return () => window.clearTimeout(t);
  }, [onReady]);
  const [low, setLow] = useState(false);
  const setDpr = useThree((s) => s.setDpr);

  return (
    <>
      <PerformanceMonitor
        onDecline={() => {
          setLow(true);
          setDpr(1);
        }}
        flipflops={2}
      />
      <color attach="background" args={['#020306']} />
      <fogExp2 attach="fog" args={['#05080f', 0.085]} />
      <Exposure />
      <Lighting />
      <Architecture />
      <Props />
      <Candles lowQuality={low} />
      <Water reflect={!low} />
      <Hecate />
      <Sparkles count={low ? 60 : 160} scale={[9, 4.5, 15]} position={[0, 2.3, 0]} size={1.4} speed={0.12} opacity={0.35} color="#9fb6d8" />
      <mesh position={[0, DOOR.h / 2, -HALF_D - 2.7]}>
        <planeGeometry args={[DOOR.w, 4]} />
        <meshBasicMaterial color="#020306" />
      </mesh>
      <Player onExitReached={onExitReached} />
      <HeroBody />
      <LightShafts
        shafts={[
          { from: [0.3, 5.2, 0.4], to: [0, 0, 0.6], r0: 0.25, r1: 1.1, color: '#8fb4ff', opacity: 0.22 },
          { from: [-2.2, 5.0, -4.6], to: [-1.6, 0, -4.2], r0: 0.15, r1: 0.7, color: '#7c9ee8', opacity: 0.14 },
          { from: [0, 4.2, -9.6], to: [0, 0, -6.4], r0: 0.5, r1: 1.4, color: '#d6c7a3', opacity: 0.12 },
        ]}
      />
      <Dust count={low ? 150 : 380} area={[9, 4.2, 15]} color="#bcd0ff" />
      <CinematicFX ao={2.4} bloom={1.0} />
    </>
  );
};

export default CryptScene;
