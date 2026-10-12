import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { TABLE, ROOM, HW, CIRCLE, ALTAR } from '@/components/game/crypt3d/cellar/cellar-layout';

type L = { p: [number, number, number]; hang: boolean; shadow?: boolean; power: number };

const LIGHTS: L[] = [
  { p: [0.4, ROOM.h - 0.55, -1.4], hang: true, shadow: true, power: 9 },
  { p: [TABLE.x - 0.25, TABLE.h + 0.18, TABLE.z + 0.55], hang: false, power: 3.2 },
  { p: [-HW + 1.6, ROOM.h - 0.6, 0.4], hang: true, power: 4.5 },
  { p: [ALTAR.x + 0.7, ALTAR.h + 0.2, ALTAR.z + 0.1], hang: false, power: 2.4 },
];

const FLAME = new THREE.Color('#ffb46a');

const Lanterns = () => {
  const lights = useRef<(THREE.PointLight | null)[]>([]);
  const sprites = useRef<(THREE.Sprite | null)[]>([]);
  const swings = useRef<(THREE.Group | null)[]>([]);
  const glow = useMemo(() => glowTexture('rgba(255,190,120,1)'), []);
  const iron = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1f1b18', metalness: 0.7, roughness: 0.55 }), []);
  const pane = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ffcf8a', emissive: '#ff9a40', emissiveIntensity: 1.6, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    LIGHTS.forEach((l, i) => {
      const f = 0.86 + Math.sin(t * 11 + i * 2) * 0.05 + Math.sin(t * 6.3 + i) * 0.06 + Math.random() * 0.04;
      const pl = lights.current[i];
      if (pl) pl.intensity = l.power * f;
      const sp = sprites.current[i];
      if (sp) sp.scale.setScalar((l.hang ? 0.5 : 0.28) * f);
      const sw = swings.current[i];
      if (sw) sw.rotation.z = Math.sin(t * 0.7 + i) * 0.035;
    });
  });

  return (
    <group>
      {LIGHTS.map((l, i) => (
        <group key={i}>
          {l.hang ? (
            <group ref={(g) => (swings.current[i] = g)} position={[l.p[0], ROOM.h - 0.24, l.p[2]]}>
              <mesh material={iron} position={[0, -0.12, 0]}>
                <cylinderGeometry args={[0.004, 0.004, 0.24, 4]} />
              </mesh>
              <group position={[0, -0.31, 0]}>
                <mesh material={iron} position={[0, 0.08, 0]}>
                  <coneGeometry args={[0.08, 0.06, 4]} />
                </mesh>
                <mesh material={pane}>
                  <boxGeometry args={[0.1, 0.14, 0.1]} />
                </mesh>
                <mesh material={iron} position={[0, -0.075, 0]}>
                  <boxGeometry args={[0.12, 0.015, 0.12]} />
                </mesh>
              </group>
            </group>
          ) : (
            <group position={[l.p[0], l.p[1] - 0.15, l.p[2]]}>
              <mesh position={[0, 0.04, 0]} castShadow>
                <cylinderGeometry args={[0.022, 0.025, 0.12, 12]} />
                <meshStandardMaterial color="#e8dfc8" roughness={0.6} />
              </mesh>
              <mesh material={iron} position={[0, -0.02, 0]}>
                <cylinderGeometry args={[0.05, 0.06, 0.015, 16]} />
              </mesh>
            </group>
          )}
          <sprite ref={(s) => (sprites.current[i] = s)} position={l.hang ? [l.p[0], ROOM.h - 0.55, l.p[2]] : [l.p[0], l.p[1] - 0.05, l.p[2]]}>
            <spriteMaterial map={glow} color={FLAME} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </sprite>
          <pointLight
            ref={(p) => (lights.current[i] = p)}
            position={l.p}
            color="#ff9d55"
            distance={l.hang ? 8 : 4}
            decay={1.8}
            castShadow={l.shadow}
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.002}
            shadow-radius={5}
          />
        </group>
      ))}
      <pointLight position={[CIRCLE.x, 0.3, CIRCLE.z]} color="#7a1a10" intensity={0.8} distance={2.5} decay={2} />
    </group>
  );
};

export default Lanterns;
