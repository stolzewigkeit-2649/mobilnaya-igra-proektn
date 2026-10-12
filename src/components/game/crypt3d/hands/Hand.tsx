import { useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export type HandMats = {
  skin: THREE.Material;
  palm: THREE.Material;
  line: THREE.Material;
  nail: THREE.Material;
  sleeve: THREE.Material;
};

export type Pose = { curl: number; spread: number };

const FINGERS = [
  { x: 0.0285, y: 0.097, len: 0.074, r: 0.0084, spread: -0.13 },
  { x: 0.0095, y: 0.101, len: 0.082, r: 0.0087, spread: -0.03 },
  { x: -0.0095, y: 0.098, len: 0.077, r: 0.0083, spread: 0.07 },
  { x: -0.0285, y: 0.091, len: 0.061, r: 0.0073, spread: 0.18 },
];

const SPLIT = [0.45, 0.31, 0.24];

const Seg = ({ len, r, mat, knuckle }: { len: number; r: number; mat: THREE.Material; knuckle?: boolean }) => (
  <>
    <mesh material={mat} position={[0, len / 2, 0]} scale={[1, 1, 0.86]}>
      <capsuleGeometry args={[r, len, 5, 12]} />
    </mesh>
    {knuckle && (
      <mesh material={mat} position={[0, 0, -r * 0.25]} scale={[1.08, 1, 0.95]}>
        <sphereGeometry args={[r * 1.05, 14, 10]} />
      </mesh>
    )}
  </>
);

const Nail = ({ len, r, mat }: { len: number; r: number; mat: THREE.Material }) => (
  <mesh material={mat} position={[0, len * 0.62, -r * 0.7]} scale={[r * 0.82, len * 0.4, r * 0.22]}>
    <sphereGeometry args={[1, 16, 10]} />
  </mesh>
);

const Crease = ({ r, arc, x, y, tilt, mat }: { r: number; arc: number; x: number; y: number; tilt: number; mat: THREE.Material }) => (
  <mesh material={mat} position={[x, y - r, 0.0166]} rotation={[0, 0, Math.PI / 2 - arc / 2 + tilt]}>
    <torusGeometry args={[r, 0.0008, 4, 32, arc]} />
  </mesh>
);

const Hand = ({ mats, pose, phase }: { mats: HandMats; pose: MutableRefObject<Pose>; phase: number }) => {
  const j = useRef<(THREE.Group | null)[]>([]);
  const set = (i: number) => (g: THREE.Group | null) => {
    j.current[i] = g;
  };

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    const { curl, spread } = pose.current;
    FINGERS.forEach((f, i) => {
      const w = Math.sin(t * 0.9 + i * 0.7) * 0.035;
      const a = j.current[i * 3];
      const b = j.current[i * 3 + 1];
      const c = j.current[i * 3 + 2];
      if (a) {
        a.rotation.x = curl * (0.3 + i * 0.06) + w;
        a.rotation.z = f.spread * (0.35 + spread * 0.9);
      }
      if (b) b.rotation.x = 0.06 + curl * (0.55 + i * 0.08) + w;
      if (c) c.rotation.x = 0.05 + curl * 0.35 + w * 0.5;
    });
    const ta = j.current[12];
    const tb = j.current[13];
    const tc = j.current[14];
    if (ta) {
      ta.rotation.z = -0.5 - spread * 0.4;
      ta.rotation.x = 0.1 + curl * 0.15;
    }
    if (tb) tb.rotation.x = 0.12 + curl * 0.25;
    if (tc) tc.rotation.x = 0.08 + curl * 0.3;
  });

  return (
    <group>
      <RoundedBox args={[0.084, 0.098, 0.027]} radius={0.012} smoothness={4} position={[0, 0.05, 0]} material={mats.skin} />
      <RoundedBox args={[0.07, 0.04, 0.026]} radius={0.012} smoothness={4} position={[0, 0.012, 0]} material={mats.skin} />
      <mesh material={mats.skin} position={[0, 0.058, -0.0105]} scale={[0.04, 0.045, 0.006]}>
        <sphereGeometry args={[1, 20, 12]} />
      </mesh>

      <mesh material={mats.palm} position={[0, 0.052, 0.0125]} scale={[0.038, 0.045, 0.004]}>
        <sphereGeometry args={[1, 24, 12]} />
      </mesh>
      <mesh material={mats.palm} position={[0.024, 0.03, 0.008]} scale={[0.02, 0.03, 0.012]}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh material={mats.palm} position={[-0.026, 0.04, 0.008]} scale={[0.016, 0.032, 0.009]}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <Crease r={0.09} arc={0.62} x={-0.006} y={0.084} tilt={0.05} mat={mats.line} />
      <Crease r={0.11} arc={0.5} x={0.004} y={0.066} tilt={-0.12} mat={mats.line} />

      {FINGERS.map((f, i) => {
        const s = SPLIT.map((k) => f.len * k);
        return (
          <group key={i} ref={set(i * 3)} position={[f.x, f.y, 0]}>
            <Seg len={s[0]} r={f.r} mat={mats.skin} knuckle />
            <group ref={set(i * 3 + 1)} position={[0, s[0], 0]}>
              <Seg len={s[1]} r={f.r * 0.93} mat={mats.skin} />
              <group ref={set(i * 3 + 2)} position={[0, s[1], 0]}>
                <Seg len={s[2]} r={f.r * 0.86} mat={mats.skin} />
                <Nail len={s[2]} r={f.r * 0.86} mat={mats.nail} />
              </group>
            </group>
          </group>
        );
      })}

      <group position={[0.03, 0.026, 0.008]} rotation={[0, -0.6, 0]}>
        <group ref={set(12)}>
          <Seg len={0.036} r={0.0118} mat={mats.skin} />
          <group ref={set(13)} position={[0, 0.036, 0]}>
            <Seg len={0.03} r={0.0102} mat={mats.skin} />
            <group ref={set(14)} position={[0, 0.03, 0]}>
              <Seg len={0.025} r={0.0095} mat={mats.skin} />
              <Nail len={0.025} r={0.0095} mat={mats.nail} />
            </group>
          </group>
        </group>
      </group>

      <mesh material={mats.skin} position={[0, -0.1, 0]} scale={[1.1, 1, 0.72]}>
        <capsuleGeometry args={[0.024, 0.2, 6, 14]} />
      </mesh>
      <mesh material={mats.sleeve} position={[0, -0.21, 0]}>
        <cylinderGeometry args={[0.04, 0.052, 0.3, 20, 1, true]} />
      </mesh>
      <mesh material={mats.sleeve} position={[0, -0.062, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]}>
        <torusGeometry args={[0.04, 0.007, 8, 24]} />
      </mesh>
    </group>
  );
};

export default Hand;
