import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Figure from '@/components/game/crypt3d/grave/Figure';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import { usePbr } from '@/components/game/crypt3d/materials';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { BODIES, CART, CART_TRACK, PREACHER, SARIEL_POST, VILLAGER, WIDOWER } from '@/components/game/crypt3d/village/village-layout';

const skin = (c: string) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.6, sheen: 0.4, sheenColor: new THREE.Color('#ffd9d0') });
const cloth = (c: string) => new THREE.MeshStandardMaterial({ color: c, roughness: 1 });

const LookAt = ({ at, children, sway = 1 }: { at: THREE.Vector3; children: React.ReactNode; sway?: number }) => {
  const g = useRef<THREE.Group>(null);
  useFrame(({ camera, clock }, dt) => {
    if (!g.current) return;
    const d = Math.hypot(camera.position.x - at.x, camera.position.z - at.z);
    const want = d < 7 ? Math.atan2(camera.position.x - at.x, camera.position.z - at.z) : g.current.userData.base ?? 0;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, want, 2, dt);
    g.current.position.y = Math.sin(clock.elapsedTime * 1.3 + at.x) * 0.006 * sway;
  });
  return (
    <group position={[at.x, 0, at.z]}>
      <group ref={g}>{children}</group>
    </group>
  );
};

const Preacher = () => {
  const m = useMemo(() => ({ skin: skin('#e2cfc0'), cloth: cloth('#efeadd'), pants: cloth('#e6e0d0'), hair: cloth('#8a7a68') }), []);
  const halo = useMemo(() => glowTexture('rgba(255,235,190,1)'), []);
  const arm = useRef<THREE.Object3D | null>(null);
  useFrame(({ clock }) => {
    if (arm.current) arm.current.rotation.x = -1.2 + Math.sin(clock.elapsedTime * 1.6) * 0.25;
  });
  return (
    <LookAt at={new THREE.Vector3(PREACHER.x, 0.5, PREACHER.z)}>
      <group position={[0, 0.5, 0]}>
        <Figure {...m} coat armL={[-0.5, 0, 0.3]} armR={[-1.2, 0, -0.2]} head={[0.05, 0, 0]} limbRef={(k, o) => { if (k === 'armR') arm.current = o; }} />
        <mesh position={[0, 1.32, 0.13]}>
          <boxGeometry args={[0.04, 0.22, 0.02]} />
          <meshStandardMaterial color="#e8c46a" metalness={0.9} roughness={0.25} emissive="#7a5a20" />
        </mesh>
        <mesh position={[0, 1.36, 0.13]}>
          <boxGeometry args={[0.13, 0.035, 0.02]} />
          <meshStandardMaterial color="#e8c46a" metalness={0.9} roughness={0.25} emissive="#7a5a20" />
        </mesh>
        <sprite position={[0, 1.2, -0.3]} scale={[1.8, 2.6, 1]}>
          <spriteMaterial map={halo} color="#ffe8b0" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
    </LookAt>
  );
};

const Villager = () => {
  const m = useMemo(() => ({ skin: skin('#d9bfae'), cloth: cloth('#6a4e3e'), pants: cloth('#3a2c22'), hair: cloth('#e8e4da') }), []);
  return (
    <LookAt at={VILLAGER}>
      <Figure {...m} coat hairLong armL={[-0.9, 0.3, 0.5]} armR={[-0.9, -0.3, -0.5]} head={[0.25, 0, 0]} />
      <mesh position={[0, 1.78, -0.02]}>
        <sphereGeometry args={[0.135, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#efe9da" roughness={1} />
      </mesh>
    </LookAt>
  );
};

const Widower = () => {
  const m = useMemo(() => ({ skin: skin('#c9b2a0'), cloth: cloth('#4a4034'), pants: cloth('#2b241e'), hair: cloth('#cfcac0') }), []);
  return (
    <LookAt at={WIDOWER} sway={2}>
      <group rotation={[0.18, 0, 0]}>
        <Figure {...m} armL={[-0.25, 0, 0.18]} armR={[-0.6, 0, -0.1]} head={[0.45, 0, 0]} />
      </group>
      <mesh position={[0.32, 0.6, 0.2]} rotation={[0.18, 0, -0.08]}>
        <cylinderGeometry args={[0.025, 0.025, 1.2, 6]} />
        <meshStandardMaterial color="#4a3424" roughness={1} />
      </mesh>
    </LookAt>
  );
};

const Sariel = () => {
  const coat = usePbr('bark_brown_02', [1, 1], { tint: '#1c1f2a', normal: 0.3, roughness: 1 });
  const m = useMemo(() => ({ skin: skin('#e3dcd8'), cloth: coat, pants: cloth('#111318'), hair: new THREE.MeshPhysicalMaterial({ color: '#d8dde6', roughness: 0.35, sheen: 1 }) }), [coat]);
  const bell = useMemo(() => glowTexture('rgba(220,230,255,1)'), []);
  return (
    <LookAt at={SARIEL_POST}>
      <group rotation={[0, 0, 0.05]} scale={1.06}>
        <Figure {...m} coat hairLong armL={[0.3, 0, 0.5]} armR={[0.3, 0, -0.5]} head={[0.08, 0, 0]} />
      </group>
      <sprite position={[0.24, 1.05, 0.14]} scale={[0.35, 0.35, 1]}>
        <spriteMaterial map={bell} color="#cfd8ff" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <pointLight position={[0.3, 1.2, 0.4]} color="#c9d4ff" intensity={0.8} distance={2.5} decay={2} />
    </LookAt>
  );
};

const Bodies = () => {
  const sheet = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d8d2c2', roughness: 1, side: THREE.DoubleSide }), []);
  const plank = useMemo(() => cloth('#4a382a'), []);
  const sheetGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.75, 1.95, 10, 20);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      const t = (y + 0.975) / 1.95;
      const body = Math.max(0, 1 - Math.pow(x / 0.28, 2));
      const head = t > 0.84 ? Math.max(0, 1 - Math.pow((t - 0.92) / 0.08, 2)) * 0.06 : 0;
      const feet = t < 0.08 ? 0.07 : 0;
      p.setZ(i, body * (0.14 + head) + feet * body + Math.sin(i * 7.1) * 0.006);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const ins = crypt.get().inspected;
    ref.current?.children.forEach((c, i) => {
      const lifted = ins.includes(`body-${i}`) || (i === 2 && ins.includes('bodies'));
      const s = c.getObjectByName('sheet');
      if (s) s.position.z = THREE.MathUtils.lerp(s.position.z, lifted ? -0.6 : 0, 0.08);
      const mark = c.getObjectByName('mark');
      if (mark) mark.visible = lifted || ins.includes('bodies');
    });
  });
  return (
    <group ref={ref}>
      {BODIES.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]} rotation={[0, b.rot, 0]}>
          <mesh material={plank} position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.62, 0.1, 1.95]} />
          </mesh>
          {[-0.8, 0.8].map((z) => (
            <mesh key={z} material={plank} position={[0, 0.1, z]}>
              <boxGeometry args={[0.55, 0.2, 0.12]} />
            </mesh>
          ))}
          <mesh position={[0, 0.34, 0.52]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 0.32]} />
            <meshStandardMaterial color="#b2a090" roughness={0.8} />
          </mesh>
          <mesh name="mark" position={[0, 0.341, 0.52]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
            <ringGeometry args={[0.04, 0.06, 3]} />
            <meshBasicMaterial color="#5a0e0e" />
          </mesh>
          <group name="sheet" position={[0, 0, 0]}>
            <mesh geometry={sheetGeo} material={sheet} position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow />
          </group>
          {b.marked === 'girl' && (
            <mesh position={[0.24, 0.33, 0.25]} rotation={[-Math.PI / 2, 0, 0.4]}>
              <planeGeometry args={[0.08, 0.06]} />
              <meshStandardMaterial color="#efe6cf" emissive="#c8b890" emissiveIntensity={0.25} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

const Cart = () => {
  const wood = usePbr('old_planks_02', [1, 1], { tint: '#5a4636', normal: 1.2 });
  const track = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1f1812', roughness: 1, transparent: true, opacity: 0.75 }), []);
  const glowRef = useRef<THREE.Group>(null);
  const ruts = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(CART_TRACK.map(([x, z]) => new THREE.Vector3(x, 0.015, z)));
    const pts = curve.getSpacedPoints(60);
    return pts.slice(0, -1).map((p, i) => {
      const n = pts[i + 1];
      const ang = Math.atan2(n.x - p.x, n.z - p.z);
      return { p, ang, len: p.distanceTo(n) };
    });
  }, []);
  useFrame(({ clock }) => {
    const on = crypt.get().inspected.includes('tracks');
    glowRef.current?.children.forEach((c) => {
      const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = on ? 0.25 + Math.sin(clock.elapsedTime * 3) * 0.1 : 0;
    });
  });
  return (
    <group>
      {ruts.map(({ p, ang, len }, i) =>
        [-0.45, 0.45].map((o) => (
          <mesh key={`${i}${o}`} material={track} position={[p.x + Math.cos(ang) * o, 0.012, p.z - Math.sin(ang) * o]} rotation={[-Math.PI / 2, 0, ang]}>
            <planeGeometry args={[0.13, len + 0.02]} />
          </mesh>
        )),
      )}
      <group ref={glowRef}>
        {ruts.map(({ p, ang, len }, i) => (
          <mesh key={i} position={[p.x, 0.02, p.z]} rotation={[-Math.PI / 2, 0, ang]}>
            <planeGeometry args={[1.1, len + 0.02]} />
            <meshBasicMaterial color="#9fe0b4" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
      <group position={[CART.x, 0, CART.z]} rotation={[0, 0.5, 0]}>
        <mesh material={wood} position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[1.1, 0.1, 1.9]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} material={wood} position={[s * 0.55, 0.85, 0]}>
            <boxGeometry args={[0.05, 0.35, 1.9]} />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={'w' + s} material={wood} position={[s * 0.62, 0.42, 0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.07, 14]} />
          </mesh>
        ))}
        <mesh material={wood} position={[0, 0.55, 1.6]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 1.6]} />
        </mesh>
        <mesh position={[0.1, 0.71, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.9]} />
          <meshStandardMaterial color="#e6e2d6" roughness={1} />
        </mesh>
      </group>
    </group>
  );
};

const Hint = () => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.visible = crypt.get().stage === 'walk';
  });
  return (
    <group ref={ref}>
      <Sparkles count={14} scale={[1.2, 0.4, 1.2]} position={[CART.x, 0.3, CART.z]} size={2} speed={0.3} color="#d8c89a" opacity={0.5} />
    </group>
  );
};

const Villagers = () => (
  <>
    <Preacher />
    <Villager />
    <Widower />
    <Sariel />
    <Bodies />
    <Cart />
    <Hint />
  </>
);

export default Villagers;
