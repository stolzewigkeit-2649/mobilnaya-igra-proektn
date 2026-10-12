import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Undead from '@/components/game/crypt3d/necro/Undead';
import { necro, necroRange, type Corpse } from '@/components/game/crypt3d/necro/necro';
import { crypt, input } from '@/components/game/crypt3d/crypt-store';
import { glowTexture } from '@/components/game/crypt3d/glow';

const dir = new THREE.Vector3();
const ray = new THREE.Ray();
const mid = new THREE.Vector3();

const CastGlow = () => {
  const camera = useThree((s) => s.camera);
  const g = useRef<THREE.Group>(null);
  const tex = useMemo(() => glowTexture('rgba(255,255,255,1)'), []);
  const mats = useRef<(THREE.SpriteMaterial | null)[]>([]);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const n = necro.get();
    if (!g.current) return;
    g.current.position.copy(camera.position);
    g.current.quaternion.copy(camera.quaternion);
    const k = n.casting ? 0.3 + n.charge * 0.9 : 0;
    const color = n.casting === 'soul' ? '#9fc4ff' : '#7dffb0';
    mats.current.forEach((m, i) => {
      if (!m) return;
      m.opacity = k * (0.7 + Math.sin(clock.elapsedTime * 12 + i) * 0.2);
      m.color.set(color);
    });
    if (light.current) {
      light.current.intensity = k * 3;
      light.current.color.set(color);
    }
  });

  return (
    <group ref={g}>
      {[-0.17, 0.17].map((x, i) => (
        <sprite key={x} position={[x, -0.2, -0.42]} scale={[0.22, 0.22, 1]}>
          <spriteMaterial ref={(m) => (mats.current[i] = m)} map={tex} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </sprite>
      ))}
      <pointLight ref={light} position={[0, -0.15, -0.5]} intensity={0} distance={3} decay={2} />
    </group>
  );
};

const NecroSystem = ({ corpses, enabled = () => true }: { corpses: Corpse[]; enabled?: () => boolean }) => {
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    necro.init(corpses);
  }, [corpses]);

  useFrame((_, dt) => {
    const n = necro.get();
    const s = crypt.get();
    if (!enabled() || s.paused) {
      necro.setTarget(null);
      return;
    }
    camera.getWorldDirection(dir);
    ray.set(camera.position, dir);
    let best: string | null = null;
    let bestD = Infinity;
    for (const c of n.corpses) {
      const st = n.states[c.id];
      mid.copy(c.pos);
      mid.y = st?.raised === 'up' ? 1.2 : c.pose === 'sitting' ? 0.6 : 0.25;
      if (c.pose !== 'sitting' && st?.raised !== 'up') {
        mid.x += Math.sin(c.rot) * 0.5;
        mid.z += Math.cos(c.rot) * 0.5;
      }
      const d = camera.position.distanceTo(mid);
      if (d > necroRange + 1) continue;
      if (ray.distanceToPoint(mid) < 0.9 && d < bestD) {
        best = c.id;
        bestD = d;
      }
    }
    if (!n.casting) necro.setTarget(best);
    else if (best !== n.target) necro.cancel();

    const k = input.keys;
    if (n.casting === 'soul' && !k.has('KeyR') && !input.holdSoul) necro.cancel();
    if (n.casting === 'raise' && !k.has('KeyF') && !input.holdRaise) necro.cancel();
    necro.tick(dt);
  });

  return (
    <>
      {corpses.map((c) => (
        <Undead key={c.id} c={c} />
      ))}
      <CastGlow />
    </>
  );
};

export default NecroSystem;
