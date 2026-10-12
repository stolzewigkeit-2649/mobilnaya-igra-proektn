import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Figure from '@/components/game/crypt3d/grave/Figure';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { necro, type Corpse } from '@/components/game/crypt3d/necro/necro';

const SOUL = '#9fc4ff';
const RAISE = '#7dffb0';

function sigilTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.translate(128, 128);
  g.strokeStyle = '#fff';
  g.fillStyle = '#fff';
  g.lineWidth = 3;
  [118, 100, 46].forEach((r) => {
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.stroke();
  });
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const b = ((i + 2) / 5) * Math.PI * 2 - Math.PI / 2;
    g.beginPath();
    g.moveTo(Math.cos(a) * 100, Math.sin(a) * 100);
    g.lineTo(Math.cos(b) * 100, Math.sin(b) * 100);
    g.stroke();
  }
  g.font = 'bold 16px Georgia';
  g.textAlign = 'center';
  for (let i = 0; i < 16; i++) {
    g.save();
    g.rotate((i / 16) * Math.PI * 2);
    g.fillText('ᚱᚾᛉᛟᚦᛗᛞᛇ'[i % 8], 0, -104);
    g.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const POSES = {
  lying: { armL: [0.1, 0, 0.6], armR: [-0.1, 0, -0.9], legL: [0, 0, 0.06], legR: [0, 0, -0.1], head: [0.1, 0, 0.3] },
  sitting: { armL: [-0.3, 0, 0.2], armR: [-0.2, 0, -0.25], legL: [-1.45, 0, 0.1], legR: [-1.45, 0, -0.1], head: [0.6, 0, 0.2] },
  slumped: { armL: [0.2, 0, 0.9], armR: [0.4, 0, -1.4], legL: [0, 0, 0.3], legR: [0, 0, -0.2], head: [0.6, 0.4, 0.5] },
};
const STAND = { armL: [0.25, 0, 0.12], armR: [0.3, 0, -0.12], legL: [0, 0, 0.02], legR: [0, 0, -0.02], head: [0.35, 0, 0.12] };

type V3 = [number, number, number];
const lerpV = (a: number[], b: number[], k: number) => a.map((v, i) => v + (b[i] - v) * k) as V3;

const Undead = ({ c }: { c: Corpse }) => {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const ghost = useRef<THREE.Group>(null);
  const sigil = useRef<THREE.Mesh>(null);
  const sigilMat = useRef<THREE.MeshBasicMaterial>(null);
  const eyes = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const rise = useRef(0);
  const soulK = useRef(0);
  const tex = useMemo(sigilTexture, []);
  const glow = useMemo(() => glowTexture('rgba(170,210,255,1)'), []);

  const mats = useMemo(
    () => ({
      skin: new THREE.MeshPhysicalMaterial({ color: c.skin, roughness: 0.7, sheen: 0.3, sheenColor: new THREE.Color('#c8d8c8') }),
      cloth: new THREE.MeshStandardMaterial({ color: c.cloth, roughness: 1 }),
      pants: new THREE.MeshStandardMaterial({ color: '#2b2722', roughness: 1 }),
      hair: new THREE.MeshStandardMaterial({ color: '#2a2018', roughness: 0.9 }),
    }),
    [c.skin, c.cloth],
  );
  const ghostMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({ color: SOUL, emissive: '#4f7fd8', emissiveIntensity: 1, transparent: true, opacity: 0, roughness: 0.2, depthWrite: false }),
    [],
  );
  const pose = POSES[c.pose];
  const limbs = useRef<Record<string, THREE.Object3D | null>>({});

  useFrame(({ clock, camera }, dt) => {
    const n = necro.get();
    const cs = n.states[c.id];
    if (!cs || !root.current || !body.current) return;
    const t = clock.elapsedTime;
    const isTarget = n.target === c.id;
    const casting = isTarget ? n.casting : null;

    const wantRise = cs.raised === 'up' ? 1 : 0;
    rise.current = THREE.MathUtils.damp(rise.current, wantRise, wantRise ? 1.1 : 2.2, dt);
    const k = THREE.MathUtils.smootherstep(rise.current, 0, 1);
    const lying = c.pose === 'lying' || c.pose === 'slumped';
    body.current.rotation.x = lying ? THREE.MathUtils.lerp(-Math.PI / 2, 0, k) : 0;
    body.current.position.set(0, lying ? THREE.MathUtils.lerp(0.12, 0, k) : THREE.MathUtils.lerp(-0.45, 0, k), lying ? THREE.MathUtils.lerp(0.85, 0, k) : 0);
    if (cs.raised === 'up') {
      body.current.position.y += Math.sin(t * 1.1) * 0.01;
      body.current.rotation.z = Math.sin(t * 0.7) * 0.05;
      const dx = camera.position.x - c.pos.x;
      const dz = camera.position.z - c.pos.z;
      const want = Math.atan2(dx, dz) - c.rot;
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, want, 1.5, dt);
    } else root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, 0, 2, dt);
    const shake = casting === 'raise' ? n.charge * 0.03 : 0;
    body.current.position.x = (Math.random() - 0.5) * shake;

    const L = limbs.current;
    const st = STAND as Record<string, number[]>;
    const ps = pose as Record<string, number[]>;
    (['armL', 'armR', 'legL', 'legR', 'head'] as const).forEach((key) => {
      const o = L[key];
      if (!o) return;
      const r = lerpV(ps[key], st[key], k);
      if (key.startsWith('arm') && cs.raised === 'up') r[0] -= 0.35 + Math.sin(t * 0.9 + (key === 'armL' ? 0 : 1)) * 0.06;
      o.rotation.set(r[0], r[1], r[2]);
    });

    if (eyes.current) eyes.current.visible = k > 0.6;

    const wantSoul = cs.soul === 'up' ? 1 : 0;
    soulK.current = THREE.MathUtils.damp(soulK.current, wantSoul, wantSoul ? 1.3 : 0.8, dt);
    ghostMat.opacity = soulK.current * 0.5 + Math.sin(t * 7) * 0.03 * soulK.current;
    if (ghost.current) {
      ghost.current.visible = soulK.current > 0.01;
      ghost.current.position.y = -0.3 + soulK.current * 0.35 + Math.sin(t * 1.3) * 0.05;
    }

    const active = casting ? n.charge : cs.raised === 'up' ? 0.35 : 0;
    const color = casting === 'soul' ? SOUL : RAISE;
    if (sigilMat.current) {
      sigilMat.current.opacity = THREE.MathUtils.damp(sigilMat.current.opacity, active * 0.9 + (isTarget && !casting ? 0.08 : 0), 6, dt);
      sigilMat.current.color.set(color);
    }
    if (sigil.current) {
      sigil.current.rotation.z += dt * (0.3 + active * 2.5);
      sigil.current.scale.setScalar(1 + active * 0.15);
    }
    if (light.current) {
      light.current.intensity = active * 4 + soulK.current * 2.5;
      light.current.color.set(cs.soul === 'up' ? SOUL : color);
    }
  });

  const setL = (k: string, o: THREE.Object3D | null) => {
    limbs.current[k] = o;
  };

  return (
    <group position={c.pos} rotation={[0, c.rot, 0]}>
      <group ref={root}>
        <group ref={body}>
          <Figure {...mats} armL={pose.armL as V3} armR={pose.armR as V3} legL={pose.legL as V3} legR={pose.legR as V3} head={pose.head as V3} limbRef={setL} />
          <group ref={eyes} position={[0, 1.71, 0.1]} visible={false}>
            {[-0.035, 0.035].map((x) => (
              <mesh key={x} position={[x, 0, 0]}>
                <sphereGeometry args={[0.011, 8, 8]} />
                <meshBasicMaterial color={RAISE} toneMapped={false} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      <group ref={ghost} position={[0.6, 0, 0.6]} visible={false}>
        <Figure skin={ghostMat} cloth={ghostMat} pants={ghostMat} hair={ghostMat} armL={[-0.3, 0, 0.3]} armR={[-0.5, 0, -0.3]} head={[0.15, 0, 0]} />
        <sprite position={[0, 1.2, 0]} scale={[2.4, 2.4, 1]}>
          <spriteMaterial map={glow} color={SOUL} transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <Sparkles count={25} scale={[0.8, 1.8, 0.8]} position={[0, 1, 0]} size={2} speed={0.5} color="#cfe0ff" />
      </group>

      <mesh ref={sigil} position={[0, 0.02, c.pose === 'lying' || c.pose === 'slumped' ? 0.5 : 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial ref={sigilMat} map={tex} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 0.6, 0.4]} intensity={0} distance={4} decay={2} />
    </group>
  );
};

export default Undead;
