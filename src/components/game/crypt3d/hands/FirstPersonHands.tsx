import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Hand, { type HandMats, type Pose } from '@/components/game/crypt3d/hands/Hand';
import { crypt } from '@/components/game/crypt3d/crypt-store';

const SKIN = '#e6cdbd';

function useMats(sleeveColor: string): HandMats {
  return useMemo(
    () => ({
      skin: new THREE.MeshPhysicalMaterial({
        color: SKIN,
        roughness: 0.62,
        sheen: 0.7,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color('#ffc2b0'),
        clearcoat: 0.05,
      }),
      palm: new THREE.MeshPhysicalMaterial({
        color: '#efc4b4',
        roughness: 0.7,
        sheen: 0.8,
        sheenColor: new THREE.Color('#ffb6a2'),
      }),
      line: new THREE.MeshStandardMaterial({ color: '#b98c7c', roughness: 0.9 }),
      nail: new THREE.MeshPhysicalMaterial({ color: '#f1d6cc', roughness: 0.25, clearcoat: 0.7 }),
      sleeve: new THREE.MeshStandardMaterial({ color: sleeveColor, roughness: 0.95, side: THREE.DoubleSide }),
    }),
    [sleeveColor],
  );
}

const mirror = (e: THREE.Euler) => new THREE.Euler(e.x, -e.y, -e.z);
const backR = new THREE.Euler(-0.95, Math.PI, -0.32);
const palmR = new THREE.Euler(-0.85, 0, 0.3);
const BACK = {
  L: { pos: new THREE.Vector3(-0.1, -0.16, -0.36), rot: mirror(backR) },
  R: { pos: new THREE.Vector3(0.1, -0.16, -0.36), rot: backR },
};
const PALM = {
  L: { pos: new THREE.Vector3(-0.08, -0.13, -0.31), rot: mirror(palmR) },
  R: { pos: new THREE.Vector3(0.08, -0.13, -0.31), rot: palmR },
};
const HIDE = new THREE.Vector3(0, -0.55, -0.3);

const qa = new THREE.Quaternion();
const qb = new THREE.Quaternion();

const FirstPersonHands = ({ sleeve = '#15131b' }: { sleeve?: string }) => {
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
      </group>
      <pointLight position={[0, 0.05, -0.15]} intensity={0.35} distance={0.9} decay={2} color="#ffe2cf" />
    </group>
  );
};

export default FirstPersonHands;
