import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Hand, { type HandMats, type Pose } from '@/components/game/crypt3d/hands/Hand';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import { glowTexture } from '@/components/game/crypt3d/glow';

const SKIN = '#cdbfb8';

function useMats(sleeveColor: string): HandMats {
  return useMemo(
    () => ({
      skin: new THREE.MeshPhysicalMaterial({
        color: SKIN,
        roughness: 0.55,
        sheen: 0.6,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color('#ffd0c4'),
        clearcoat: 0.08,
        clearcoatRoughness: 0.6,
        transmission: 0,
        thickness: 0.01,
      }),
      palm: new THREE.MeshPhysicalMaterial({ color: '#d9b8ae', roughness: 0.65, sheen: 0.7, sheenColor: new THREE.Color('#ffb8a8') }),
      line: new THREE.MeshStandardMaterial({ color: '#9a7a70', roughness: 0.9 }),
      nail: new THREE.MeshPhysicalMaterial({ color: '#b8b0b4', roughness: 0.2, clearcoat: 0.9 }),
      vein: new THREE.MeshPhysicalMaterial({ color: '#9fa6bd', roughness: 0.6, transparent: true, opacity: 0.55, sheen: 0.3, sheenColor: new THREE.Color('#bcd0ff') }),
      sleeve: new THREE.MeshPhysicalMaterial({
        color: sleeveColor,
        roughness: 0.92,
        sheen: 1,
        sheenRoughness: 0.6,
        sheenColor: new THREE.Color('#3a4a8a'),
        side: THREE.DoubleSide,
      }),
      lining: new THREE.MeshStandardMaterial({ color: '#070810', roughness: 1, side: THREE.DoubleSide }),
      trim: new THREE.MeshStandardMaterial({ color: '#9aa2b8', metalness: 0.85, roughness: 0.35 }),
    }),
    [sleeveColor],
  );
}

const SoulFlame = ({ k }: { k: React.MutableRefObject<number> }) => {
  const g = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Sprite>(null);
  const core = useRef<THREE.Sprite>(null);
  const light = useRef<THREE.PointLight>(null);
  const tex = useMemo(() => glowTexture('rgba(140,190,255,1)'), []);
  const wisps = useRef<(THREE.Sprite | null)[]>([]);
  useFrame(({ clock }) => {
    const v = k.current;
    if (!g.current) return;
    g.current.visible = v > 0.02;
    const t = clock.elapsedTime;
    const f = 0.85 + Math.sin(t * 11) * 0.07 + Math.sin(t * 5.3) * 0.06;
    outer.current?.scale.set(0.11 * f * v, 0.17 * f * v, 1);
    core.current?.scale.set(0.035 * v, 0.05 * v, 1);
    wisps.current.forEach((w, i) => {
      if (!w) return;
      const ph = (t * 0.9 + i * 0.37) % 1;
      w.position.set(Math.sin(t * 3 + i * 2) * 0.012 * (1 + ph), 0.02 + ph * 0.11, Math.cos(t * 2 + i) * 0.008);
      const sc = (1 - ph) * 0.045 * v;
      w.scale.set(sc, sc * 1.6, 1);
      (w.material as THREE.SpriteMaterial).opacity = (1 - ph) * 0.8;
    });
    if (light.current) light.current.intensity = v * (1.6 + Math.sin(t * 9) * 0.25);
  });
  return (
    <group ref={g} position={[0, 0.06, 0.05]}>
      <sprite ref={outer} position={[0, 0.03, 0]}>
        <spriteMaterial map={tex} color="#4f8cff" transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite ref={core}>
        <spriteMaterial map={tex} color="#e6f2ff" transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      {[0, 1, 2, 3, 4].map((i) => (
        <sprite key={i} ref={(o) => { wisps.current[i] = o; }}>
          <spriteMaterial map={tex} color="#7fb0ff" transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </sprite>
      ))}
      <pointLight ref={light} color="#6fa4ff" distance={2.2} decay={2} intensity={0} />
    </group>
  );
};

const mirror = (e: THREE.Euler) => new THREE.Euler(e.x, -e.y, -e.z);
const backR = new THREE.Euler(-1.05, Math.PI, -0.38);
const palmR = new THREE.Euler(-0.95, 0, 0.32);
const BACK = {
  L: { pos: new THREE.Vector3(-0.115, -0.15, -0.34), rot: mirror(backR) },
  R: { pos: new THREE.Vector3(0.115, -0.15, -0.34), rot: backR },
};
const PALM = {
  L: { pos: new THREE.Vector3(-0.095, -0.125, -0.3), rot: mirror(palmR) },
  R: { pos: new THREE.Vector3(0.095, -0.125, -0.3), rot: palmR },
};
const HIDE = new THREE.Vector3(0, -0.55, -0.3);

const qa = new THREE.Quaternion();
const qb = new THREE.Quaternion();

const FirstPersonHands = ({ sleeve = '#141a33' }: { sleeve?: string }) => {
  const camera = useThree((s) => s.camera);
  const mats = useMats(sleeve);
  const rig = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const show = useRef(0);
  const palm = useRef(0);
  const pose = useRef<Pose>({ curl: 0.35, spread: 0.2 });

  useFrame(({ clock }, dt) => {
    const s = crypt.get();
    if (!rig.current) return;
    rig.current.position.copy(camera.position);
    rig.current.quaternion.copy(camera.quaternion);
    show.current = THREE.MathUtils.damp(show.current, s.looking ? 1 : 0, 6, dt);
    palm.current = THREE.MathUtils.damp(palm.current, s.palms ? 1 : 0, 5, dt);
    pose.current.curl = THREE.MathUtils.lerp(0.4, 0.08, palm.current);
    pose.current.spread = THREE.MathUtils.lerp(0.15, 0.75, palm.current);

    const t = clock.elapsedTime;
    const breathe = Math.sin(t * 1.4) * 0.004;
    rig.current.visible = show.current > 0.01;

    [
      [left.current, BACK.L, PALM.L, 0],
      [right.current, BACK.R, PALM.R, 1.3],
    ].forEach(([g, b, p, ph]) => {
      const grp = g as THREE.Group | null;
      if (!grp) return;
      const back = b as typeof BACK.L;
      const pal = p as typeof PALM.L;
      const k = palm.current;
      grp.position.lerpVectors(back.pos, pal.pos, k);
      grp.position.lerpVectors(HIDE, grp.position.clone(), show.current);
      grp.position.y += breathe + Math.sin(t * 0.8 + (ph as number)) * 0.0025;
      qa.setFromEuler(back.rot);
      qb.setFromEuler(pal.rot);
      grp.quaternion.slerpQuaternions(qa, qb, k);
    });
  });

  return (
    <group ref={rig}>
      <group ref={left} scale={[-1, 1, 1]}>
        <Hand mats={mats} pose={pose} phase={0} />
      </group>
      <group ref={right}>
        <Hand mats={mats} pose={pose} phase={1.7} />
        <SoulFlame k={palm} />
      </group>
      <pointLight position={[0, 0.08, -0.12]} intensity={0.28} distance={0.9} decay={2} color="#c8d4ff" />
    </group>
  );
};

export default FirstPersonHands;