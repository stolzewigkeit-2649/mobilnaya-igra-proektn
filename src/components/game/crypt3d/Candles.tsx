import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { ALTAR_CANDLES, EXTRA_CANDLES } from '@/components/game/crypt3d/layout';
import { crypt } from '@/components/game/crypt3d/crypt-store';

const FLAME = new THREE.Color('#7fb4ff');
const FLAME_HOT = new THREE.Color('#bcd8ff').multiplyScalar(4);
const WAX = '#c9cfd6';

type CandleDef = { p: [number, number, number]; h: number; light: boolean };

const ALL: CandleDef[] = [
  ...ALTAR_CANDLES.map((p, i) => ({ p, h: 0.55 + ((i * 37) % 7) * 0.09, light: i % 4 === 0 })),
  ...EXTRA_CANDLES.map((p, i) => ({ p, h: 0.22 + ((i * 13) % 5) * 0.05, light: i === 8 || i === 9 })),
];

const Candles = ({ lowQuality }: { lowQuality: boolean }) => {
  const flames = useRef<(THREE.Sprite | null)[]>([]);
  const cores = useRef<(THREE.Mesh | null)[]>([]);
  const lights = useRef<(THREE.PointLight | null)[]>([]);
  const lit = useRef<number[]>(ALL.map(() => 0));
  const glow = useMemo(() => glowTexture('rgba(150,195,255,1)'), []);
  const lean = useRef(0);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const s = crypt.get();
    const target = s.stage === 'hecate' ? 1 : 0;
    lean.current = THREE.MathUtils.damp(lean.current, target, 1.6, dt);

    ALL.forEach((c, i) => {
      const want = i < s.candlesLit ? 1 : 0;
      lit.current[i] = THREE.MathUtils.damp(lit.current[i], want, 3, dt);
      const on = lit.current[i];
      const f = 0.82 + Math.sin(t * 13 + i * 3.1) * 0.06 + Math.sin(t * 7.3 + i) * 0.08 + Math.random() * 0.05;
      const sp = flames.current[i];
      if (sp) {
        const k = on * f * (1 + lean.current * 0.6);
        sp.scale.set(0.42 * k, 0.62 * k, 1);
        sp.position.set(c.p[0] - lean.current * 0.05, c.p[1] + c.h + 0.07, c.p[2] - lean.current * 0.06);
      }
      const core = cores.current[i];
      if (core) {
        core.scale.set(on * f, on * f * (1.1 + lean.current * 0.6), on * f);
        core.rotation.x = -lean.current * 0.55;
      }
      const l = lights.current[i];
      if (l) l.intensity = on * f * (lowQuality ? 5 : 4.2) * (1 + lean.current * 0.8);
    });
  });

  return (
    <group>
      {ALL.map((c, i) => (
        <group key={i}>
          <mesh position={[c.p[0], c.p[1] + c.h / 2, c.p[2]]} castShadow>
            <cylinderGeometry args={[0.035, 0.042, c.h, 12]} />
            <meshStandardMaterial color={WAX} roughness={0.55} emissive="#24406e" emissiveIntensity={0.25} />
          </mesh>
          <mesh
            ref={(m) => { cores.current[i] = m; }}
            position={[c.p[0], c.p[1] + c.h + 0.045, c.p[2]]}
          >
            <coneGeometry args={[0.018, 0.075, 8]} />
            <meshBasicMaterial color={FLAME_HOT} toneMapped={false} />
          </mesh>
          <sprite ref={(s) => { flames.current[i] = s; }}>
            <spriteMaterial map={glow} color={FLAME} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </sprite>
          {c.light && (
            <pointLight
              ref={(l) => { lights.current[i] = l; }}
              position={[c.p[0], c.p[1] + c.h + 0.15, c.p[2]]}
              color="#6fa8ff"
              distance={lowQuality ? 7 : 9}
              decay={1.7}
              intensity={0}
            />
          )}
        </group>
      ))}
    </group>
  );
};

export const CANDLE_COUNT = ALL.length;

export default Candles;