import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { PerformanceMonitor, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import CellarRoom from '@/components/game/crypt3d/cellar/CellarRoom';
import Cages from '@/components/game/crypt3d/cellar/Cages';
import Ritual from '@/components/game/crypt3d/cellar/Ritual';
import Workbench from '@/components/game/crypt3d/cellar/Workbench';
import Lanterns from '@/components/game/crypt3d/cellar/Lanterns';
import CellarPlayer from '@/components/game/crypt3d/cellar/CellarPlayer';
import Timon from '@/components/game/crypt3d/companion/Timon';
import { collide } from '@/components/game/crypt3d/cellar/cellar-layout';
import FirstPersonHands from '@/components/game/crypt3d/hands/FirstPersonHands';

import { ROOM, STAIRS, HD } from '@/components/game/crypt3d/cellar/cellar-layout';
import CinematicFX from '@/components/game/crypt3d/fx/CinematicFX';
import LightShafts from '@/components/game/crypt3d/fx/LightShafts';
import Dust from '@/components/game/crypt3d/fx/Dust';

const Setup = () => {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.1;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);
  return null;
};

const CellarScene = ({ onReady }: { onReady: () => void }) => {
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
      <color attach="background" args={['#050302']} />
      <fogExp2 attach="fog" args={['#0d0805', 0.11]} />
      <Setup />
      <ambientLight color="#3a2418" intensity={0.25} />
      <hemisphereLight color="#4a3020" groundColor="#050302" intensity={0.2} />
      <CellarRoom />
      <Cages />
      <Ritual />
      <Workbench />
      <Lanterns />
      <Sparkles count={low ? 30 : 90} scale={[7, ROOM.h, 10]} position={[0, ROOM.h / 2, 0]} size={1.2} speed={0.1} opacity={0.3} color="#d8b890" />
      <CellarPlayer />
      <Timon collide={collide} />
      <FirstPersonHands />
      <LightShafts
        shafts={[
          { from: [STAIRS.x, ROOM.h + 0.6, STAIRS.z + 0.3], to: [STAIRS.x, 0, STAIRS.z - 1.2], r0: 0.35, r1: 0.9, color: '#ffd9a0', opacity: 0.2 },
          { from: [0, ROOM.h, -HD + 0.6], to: [0, 0, -HD + 1.4], r0: 0.12, r1: 0.6, color: '#ffcf90', opacity: 0.1 },
        ]}
      />
      <Dust count={low ? 120 : 260} area={[7, ROOM.h, 10]} color="#ffd8b0" size={0.03} />
      <CinematicFX ao={2.6} bloom={0.9} />
    </>
  );
};

export default CellarScene;
