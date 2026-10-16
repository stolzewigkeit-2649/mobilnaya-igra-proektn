import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type HandMats = {
  skin: THREE.Material;
  palm: THREE.Material;
  line: THREE.Material;
  nail: THREE.Material;
  sleeve: THREE.Material;
  lining: THREE.Material;
  trim: THREE.Material;
  vein: THREE.Material;
};

export type Pose = { curl: number; spread: number };

const FINGERS = [
  { x: 0.026, y: 0.093, len: 0.084, r: 0.0074, spread: -0.12, base: -0.004 },
  { x: 0.0088, y: 0.098, len: 0.093, r: 0.0077, spread: -0.025, base: 0 },
  { x: -0.0088, y: 0.095, len: 0.088, r: 0.0073, spread: 0.07, base: -0.002 },
  { x: -0.0255, y: 0.087, len: 0.07, r: 0.0064, spread: 0.17, base: -0.008 },
];
const SPLIT = [0.46, 0.3, 0.24];

function palmGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.031, 0.0);
  s.bezierCurveTo(-0.036, 0.03, -0.038, 0.06, -0.034, 0.088);
  s.bezierCurveTo(-0.02, 0.1, 0.02, 0.104, 0.034, 0.094);
  s.bezierCurveTo(0.04, 0.07, 0.042, 0.035, 0.036, 0.008);
  s.bezierCurveTo(0.02, -0.006, -0.018, -0.006, -0.031, 0.0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.0075, bevelSize: 0.0065, bevelSegments: 5, curveSegments: 20 });
  g.translate(0, 0, -0.006);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const arch = Math.cos((x / 0.04) * Math.PI * 0.5) * 0.004;
    p.setZ(i, z - arch * (z < 0 ? 1 : -0.3) - (y > 0.08 ? (y - 0.08) * 0.08 : 0));
  }
  g.computeVertexNormals();
  return g;
}

function forearmGeometry() {
  const pts: THREE.Vector2[] = [];
  const n = 18;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const y = -0.26 + t * 0.27;
    const r = 0.021 + (1 - t) * 0.012 + Math.sin(t * Math.PI) * 0.004 - (t > 0.85 ? (t - 0.85) * 0.03 : 0);
    pts.push(new THREE.Vector2(r, y));
  }
  const g = new THREE.LatheGeometry(pts, 28);
  g.scale(1.25, 1, 0.82);
  return g;
}

function sleeveGeometry() {
  const pts: THREE.Vector2[] = [];
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const y = -0.42 + t * 0.4;
    const r = 0.05 + t * t * 0.045;
    pts.push(new THREE.Vector2(r, y));
  }
  const g = new THREE.LatheGeometry(pts, 40);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const a = Math.atan2(z, x);
    const t = (y + 0.42) / 0.4;
    const fold = Math.sin(a * 7 + y * 18) * 0.004 * (0.4 + t) + Math.sin(a * 3) * 0.003;
    const droop = z > 0 ? 0 : -t * t * 0.05 * Math.max(0, -Math.sin(a));
    const k = 1 + fold / Math.max(0.02, Math.hypot(x, z));
    p.setXYZ(i, x * k, y + droop + (t > 0.95 ? Math.sin(a * 5) * 0.004 : 0), z * k);
  }
  g.computeVertexNormals();
  return g;
}

const Seg = ({ len, r, mat, knuckle, taper = 0.92 }: { len: number; r: number; mat: THREE.Material; knuckle?: boolean; taper?: number }) => (
  <>
    <mesh material={mat} position={[0, len / 2, 0]} scale={[1, 1, 0.84]}>
      <cylinderGeometry args={[r * taper, r, len, 14, 1]} />
    </mesh>
    <mesh material={mat} position={[0, len, 0]} scale={[1, 0.9, 0.84]}>
      <sphereGeometry args={[r * taper * 1.04, 14, 10]} />
    </mesh>
    {knuckle && (
      <mesh material={mat} position={[0, 0.001, -r * 0.35]} scale={[1.15, 1, 1]}>
        <sphereGeometry args={[r * 1.12, 14, 10]} />
      </mesh>
    )}
  </>
);

const Tip = ({ len, r, skin, nail }: { len: number; r: number; skin: THREE.Material; nail: THREE.Material }) => (
  <>
    <mesh material={skin} position={[0, len / 2, 0]} scale={[1, 1, 0.84]}>
      <cylinderGeometry args={[r * 0.82, r, len, 14, 1]} />
    </mesh>
    <mesh material={skin} position={[0, len, 0.0008]} scale={[1, 1.25, 0.86]}>
      <sphereGeometry args={[r * 0.84, 14, 12]} />
    </mesh>
    <mesh material={nail} position={[0, len * 0.72, -r * 0.62]} rotation={[0.12, 0, 0]} scale={[r * 0.78, len * 0.42, r * 0.2]}>
      <sphereGeometry args={[1, 16, 10]} />
    </mesh>
    <mesh material={nail} position={[0, len * 1.02, -r * 0.5]} scale={[r * 0.7, r * 0.42, r * 0.22]}>
      <sphereGeometry args={[1, 12, 8]} />
    </mesh>
  </>
);

const Hand = ({ mats, pose, phase }: { mats: HandMats; pose: MutableRefObject<Pose>; phase: number }) => {
  const j = useRef<(THREE.Group | null)[]>([]);
  const set = (i: number) => (g: THREE.Group | null) => {
    j.current[i] = g;
  };
  const palm = useMemo(palmGeometry, []);
  const forearm = useMemo(forearmGeometry, []);
  const sleeve = useMemo(sleeveGeometry, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    const { curl, spread } = pose.current;
    FINGERS.forEach((f, i) => {
      const w = Math.sin(t * 0.9 + i * 0.7) * 0.03;
      const a = j.current[i * 3];
      const b = j.current[i * 3 + 1];
      const c = j.current[i * 3 + 2];
      const c2 = curl * (1 + i * 0.12);
      if (a) {
        a.rotation.x = 0.06 + c2 * 0.42 + w;
        a.rotation.z = f.spread * (0.3 + spread * 1.1);
      }
      if (b) b.rotation.x = 0.1 + c2 * 0.7 + w;
      if (c) c.rotation.x = 0.08 + c2 * 0.45 + w * 0.5;
    });
    const ta = j.current[12];
    const tb = j.current[13];
    const tc = j.current[14];
    if (ta) {
      ta.rotation.z = -0.62 - spread * 0.35;
      ta.rotation.x = 0.25 + curl * 0.3;
    }
    if (tb) tb.rotation.x = 0.15 + curl * 0.35;
    if (tc) tc.rotation.x = 0.12 + curl * 0.4;
  });

  return (
    <group>
      <mesh geometry={palm} material={mats.skin} castShadow />
      <mesh material={mats.palm} position={[0, 0.048, 0.0115]} scale={[0.031, 0.04, 0.004]}>
        <sphereGeometry args={[1, 24, 12]} />
      </mesh>
      <mesh material={mats.palm} position={[0.022, 0.026, 0.01]} scale={[0.017, 0.026, 0.01]}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh material={mats.palm} position={[-0.024, 0.036, 0.0095]} scale={[0.012, 0.03, 0.007]}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      {[0.09, 0.11].map((r, i) => (
        <mesh key={r} material={mats.line} position={[i ? 0.004 : -0.006, (i ? 0.066 : 0.082) - r, 0.0158]} rotation={[0, 0, Math.PI / 2 - (i ? 0.25 : 0.3) + (i ? -0.12 : 0.05)]}>
          <torusGeometry args={[r, 0.0006, 4, 32, i ? 0.5 : 0.6]} />
        </mesh>
      ))}

      {FINGERS.map((f, i) => (
        <mesh key={'t' + i} material={mats.vein} position={[f.x * 0.75, f.y * 0.55, -0.0128]} rotation={[0, 0, f.spread * 0.6]} scale={[1, 1, 0.5]}>
          <capsuleGeometry args={[0.0018, f.y * 0.75, 4, 6]} />
        </mesh>
      ))}
      <mesh material={mats.vein} position={[0.004, 0.03, -0.0135]} rotation={[0, 0, 0.5]} scale={[1, 1, 0.5]}>
        <capsuleGeometry args={[0.0014, 0.03, 4, 6]} />
      </mesh>

      {FINGERS.map((f, i) => {
        const s = SPLIT.map((k) => f.len * k);
        return (
          <group key={i} ref={set(i * 3)} position={[f.x, f.y + f.base, 0]}>
            <Seg len={s[0]} r={f.r} mat={mats.skin} knuckle />
            <group ref={set(i * 3 + 1)} position={[0, s[0], 0]}>
              <Seg len={s[1]} r={f.r * 0.9} mat={mats.skin} />
              <group ref={set(i * 3 + 2)} position={[0, s[1], 0]}>
                <Tip len={s[2]} r={f.r * 0.82} skin={mats.skin} nail={mats.nail} />
              </group>
            </group>
          </group>
        );
      })}

      <group position={[0.03, 0.016, 0.004]} rotation={[0.1, -0.7, 0]}>
        <mesh material={mats.skin} position={[-0.004, 0.014, 0]} scale={[0.016, 0.026, 0.013]}>
          <sphereGeometry args={[1, 16, 12]} />
        </mesh>
        <group ref={set(12)}>
          <Seg len={0.034} r={0.0102} mat={mats.skin} knuckle />
          <group ref={set(13)} position={[0, 0.034, 0]}>
            <Seg len={0.028} r={0.0092} mat={mats.skin} />
            <group ref={set(14)} position={[0, 0.028, 0]}>
              <Tip len={0.025} r={0.0086} skin={mats.skin} nail={mats.nail} />
            </group>
          </group>
        </group>
      </group>

      <mesh geometry={forearm} material={mats.skin} castShadow />
      <mesh material={mats.skin} position={[0.0, -0.004, -0.004]} scale={[0.03, 0.014, 0.018]}>
        <sphereGeometry args={[1, 16, 10]} />
      </mesh>
      {[0.006, -0.008].map((x) => (
        <mesh key={x} material={mats.vein} position={[x, -0.07, -0.018]} rotation={[0, 0, x * 8]} scale={[1, 1, 0.5]}>
          <capsuleGeometry args={[0.0016, 0.09, 4, 6]} />
        </mesh>
      ))}

      <group position={[0, -0.02, 0]}>
        <mesh geometry={sleeve} material={mats.sleeve} castShadow />
        <mesh material={mats.lining} position={[0, -0.006, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.07, 0.093, 40]} />
        </mesh>
        <mesh material={mats.trim} position={[0, -0.03, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
          <torusGeometry args={[0.087, 0.0028, 6, 48]} />
        </mesh>
        <mesh material={mats.trim} position={[0, -0.042, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.083, 0.0018, 6, 48]} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} material={mats.trim} position={[Math.cos(a) * 0.086, -0.036, Math.sin(a) * 0.086]} rotation={[0, -a, Math.PI / 4]}>
              <boxGeometry args={[0.0035, 0.008, 0.008]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

export default Hand;
