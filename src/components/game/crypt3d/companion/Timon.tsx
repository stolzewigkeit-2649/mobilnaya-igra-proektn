import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Figure from '@/components/game/crypt3d/grave/Figure';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import { companion } from '@/components/game/crypt3d/companion/companion';

type V3 = [number, number, number];
const LYING = { armL: [0.1, 0, 0.9], armR: [-0.2, 0, -1.3], legL: [0, 0, 0.08], legR: [0, 0, -0.14], head: [0.2, 0, 0.35] };
const STAND = { armL: [0.05, 0, 0.1], armR: [0.05, 0, -0.1], legL: [0, 0, 0.02], legR: [0, 0, -0.02], head: [0.18, 0, 0.06] };
const lerpV = (a: number[], b: number[], k: number) => a.map((v, i) => v + (b[i] - v) * k) as V3;

type Props = { collide?: (p: THREE.Vector3) => void; lyingYaw?: number };

const Timon = ({ collide, lyingYaw = 0.4 }: Props) => {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const limbs = useRef<Record<string, THREE.Object3D | null>>({});
  const walk = useRef(0);
  const yaw = useRef(lyingYaw);
  const glow = useMemo(() => glowTexture('rgba(150,255,190,1)'), []);
  const m = useMemo(
    () => ({
      skin: new THREE.MeshPhysicalMaterial({ color: '#a9aea2', roughness: 0.65, sheen: 0.4, sheenColor: new THREE.Color('#bfe8cc') }),
      cloth: new THREE.MeshStandardMaterial({ color: '#8e8676', roughness: 1 }),
      pants: new THREE.MeshStandardMaterial({ color: '#2f2b26', roughness: 1 }),
      hair: new THREE.MeshStandardMaterial({ color: '#3a2a1e', roughness: 0.9 }),
    }),
    [],
  );
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const fwd = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock }, dt) => {
    const g = root.current;
    if (!g || !body.current) return;
    g.visible = companion.timon;
    if (!companion.timon) return;
    const t = clock.elapsedTime;

    companion.rise = Math.min(1, companion.rise + dt * 0.35);
    const k = THREE.MathUtils.smootherstep(companion.rise, 0, 1);
    const risen = companion.rise >= 1;

    const p = companion.pos;
    let speed = 0;
    if (risen && !crypt.get().paused) {
      camera.getWorldDirection(fwd);
      fwd.y = 0;
      fwd.normalize();
      tmp.set(camera.position.x, 0, camera.position.z).addScaledVector(fwd, -1.3);
      tmp.x += Math.cos(Math.atan2(fwd.x, fwd.z)) * 0.9;
      tmp.z -= Math.sin(Math.atan2(fwd.x, fwd.z)) * 0.9;
      const dx = tmp.x - p.x;
      const dz = tmp.z - p.z;
      const d = Math.hypot(dx, dz);
      const busy = crypt.get().lines.length > 0;
      if (d > 0.5 && !busy) {
        speed = Math.min(d * 1.4, 2.6);
        p.x += (dx / d) * speed * dt;
        p.z += (dz / d) * speed * dt;
        collide?.(p);
        const want = Math.atan2(dx, dz);
        let diff = want - yaw.current;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        yaw.current += diff * (1 - Math.exp(-dt * 6));
      } else {
        const want = Math.atan2(camera.position.x - p.x, camera.position.z - p.z);
        let diff = want - yaw.current;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        yaw.current += diff * (1 - Math.exp(-dt * 2.5));
      }
    }
    walk.current += speed * dt * 3.2;

    g.position.set(p.x, 0, p.z);
    g.rotation.y = yaw.current;
    body.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 2, 0, k);
    body.current.position.set(0, THREE.MathUtils.lerp(0.11, 0, k) + Math.abs(Math.sin(walk.current)) * 0.025 * k, THREE.MathUtils.lerp(0.85, 0, k));
    body.current.rotation.z = Math.sin(walk.current * 0.5) * 0.04 + (risen ? Math.sin(t * 0.8) * 0.02 : (Math.random() - 0.5) * 0.04 * (1 - k));

    const sw = Math.sin(walk.current) * Math.min(1, speed) * 0.45;
    const L = limbs.current;
    (['armL', 'armR', 'legL', 'legR', 'head'] as const).forEach((key) => {
      const o = L[key];
      if (!o) return;
      const r = lerpV((LYING as Record<string, number[]>)[key], (STAND as Record<string, number[]>)[key], k);
      if (key === 'legL') r[0] += sw;
      if (key === 'legR') r[0] -= sw;
      if (key === 'armL') r[0] -= sw * 0.6;
      if (key === 'armR') r[0] += sw * 0.6;
      o.rotation.set(r[0], r[1], r[2]);
    });

    if (eyes.current) eyes.current.visible = k > 0.5;
    companion.head.set(p.x, 1.6 * k + 0.3, p.z);
  });

  return (
    <group ref={root} visible={false}>
      <group ref={body}>
        <Figure
          {...m}
          armL={LYING.armL as V3}
          armR={LYING.armR as V3}
          legL={LYING.legL as V3}
          legR={LYING.legR as V3}
          head={LYING.head as V3}
          limbRef={(key, o) => {
            limbs.current[key] = o;
          }}
        />
        <group ref={eyes} position={[0, 1.71, 0.1]} visible={false}>
          {[-0.035, 0.035].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#8dffb8" toneMapped={false} />
            </mesh>
          ))}
          <sprite scale={[0.35, 0.18, 1]}>
            <spriteMaterial map={glow} color="#6dffa8" transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
        <mesh position={[0, 1.33, 0.12]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.035, 0.006, 6, 16]} />
          <meshBasicMaterial color="#7dffb0" toneMapped={false} />
        </mesh>
      </group>
      <Sparkles count={10} scale={[0.6, 1.6, 0.6]} position={[0, 0.9, 0]} size={1.4} speed={0.3} color="#9fffc4" opacity={0.5} />
      <pointLight position={[0, 1.4, 0.3]} color="#7dffb0" intensity={0.5} distance={2.2} decay={2} />
    </group>
  );
};

export default Timon;
