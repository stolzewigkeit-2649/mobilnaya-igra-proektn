import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CIRCLE, ALTAR } from '@/components/game/crypt3d/cellar/cellar-layout';
import { crypt } from '@/components/game/crypt3d/crypt-store';
import { usePbr } from '@/components/game/crypt3d/materials';

function circleTexture(fresh: boolean) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d')!;
  g.translate(256, 256);
  g.strokeStyle = fresh ? 'rgba(232,226,210,0.95)' : 'rgba(150,40,30,0.55)';
  g.fillStyle = g.strokeStyle;
  g.lineCap = 'round';
  const ring = (r: number, w: number, gaps = 0) => {
    g.lineWidth = w;
    const n = 64;
    for (let i = 0; i < n; i++) {
      if (gaps && Math.random() < gaps) continue;
      g.beginPath();
      g.arc(0, 0, r + (Math.random() - 0.5) * 3, (i / n) * Math.PI * 2, ((i + 1) / n) * Math.PI * 2);
      g.stroke();
    }
  };
  ring(236, 7, fresh ? 0.03 : 0.4);
  ring(212, 3, fresh ? 0 : 0.45);
  ring(110, 4, fresh ? 0.05 : 0.5);
  g.lineWidth = 4;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    const b = ((i + 3) / 7) * Math.PI * 2 - Math.PI / 2;
    if (!fresh && Math.random() < 0.4) continue;
    g.beginPath();
    g.moveTo(Math.cos(a) * 210, Math.sin(a) * 210);
    g.lineTo(Math.cos(b) * 210, Math.sin(b) * 210);
    g.stroke();
  }
  g.font = 'bold 30px Georgia, serif';
  g.textAlign = 'center';
  const glyphs = 'ΑΩΣΨΦΞΔΛΘΠ';
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    g.save();
    g.rotate(a);
    g.fillText(glyphs[i % glyphs.length], 0, -218 + 0);
    g.restore();
  }
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    g.beginPath();
    g.arc(Math.cos(a) * 160, Math.sin(a) * 160, 10, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const Vessel = ({ x, z, s, blood }: { x: number; z: number; s: number; blood: boolean }) => (
  <group position={[x, 0, z]} scale={s}>
    <mesh position={[0, 0.11, 0]} castShadow>
      <latheGeometry
        args={[[[0, 0], [0.07, 0.005], [0.09, 0.06], [0.085, 0.15], [0.05, 0.2], [0.055, 0.24]].map(([a, b]) => new THREE.Vector2(a, b)), 20]}
      />
      <meshPhysicalMaterial color="#8d7a5f" roughness={0.45} clearcoat={0.6} side={THREE.DoubleSide} />
    </mesh>
    {blood && (
      <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.05, 16]} />
        <meshPhysicalMaterial color="#2a0705" roughness={0.1} clearcoat={1} />
      </mesh>
    )}
  </group>
);

const Ritual = () => {
  const old = useMemo(() => circleTexture(false), []);
  const fresh = useMemo(() => circleTexture(true), []);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const stone = usePbr('marble_01', [1.2, 0.5], { tint: '#8b8378', roughness: 0.85 });

  useFrame(({ clock }) => {
    const seen = crypt.get().inspected.includes('circle');
    if (glow.current) glow.current.opacity = seen ? 0.08 + Math.sin(clock.elapsedTime * 1.3) * 0.04 : 0;
  });

  return (
    <group>
      <mesh position={[CIRCLE.x - 0.25, 0.004, CIRCLE.z + 0.2]} rotation={[-Math.PI / 2, 0, 0.6]}>
        <planeGeometry args={[CIRCLE.r * 2.3, CIRCLE.r * 2.3]} />
        <meshStandardMaterial map={old} transparent depthWrite={false} roughness={0.6} polygonOffset polygonOffsetFactor={-3} />
      </mesh>
      <mesh position={[CIRCLE.x, 0.006, CIRCLE.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CIRCLE.r * 2, CIRCLE.r * 2]} />
        <meshStandardMaterial map={fresh} transparent depthWrite={false} roughness={0.95} polygonOffset polygonOffsetFactor={-4} />
      </mesh>
      <mesh position={[CIRCLE.x, 0.008, CIRCLE.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CIRCLE.r * 2, CIRCLE.r * 2]} />
        <meshBasicMaterial ref={glow} map={fresh} color="#ff6a4a" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
        const r = CIRCLE.r * 0.68;
        return <Vessel key={i} x={CIRCLE.x + Math.cos(a) * r} z={CIRCLE.z + Math.sin(a) * r} s={0.75} blood={i % 2 === 0} />;
      })}
      <group position={[CIRCLE.x, 0.02, CIRCLE.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0.4]} receiveShadow>
          <planeGeometry args={[0.55, 1.6]} />
          <meshStandardMaterial color="#3a2a22" roughness={1} />
        </mesh>
        {[-0.65, 0.65].map((z) => (
          <mesh key={z} position={[Math.sin(0.4) * z * -1, 0.02, z * Math.cos(0.4)]}>
            <torusGeometry args={[0.05, 0.01, 6, 14]} />
            <meshStandardMaterial color="#2c2724" metalness={0.8} roughness={0.5} />
          </mesh>
        ))}
      </group>

      <group position={[ALTAR.x, 0, ALTAR.z]}>
        <mesh material={stone} position={[0, ALTAR.h / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[ALTAR.w, ALTAR.h, ALTAR.d]} />
        </mesh>
        <mesh material={stone} position={[0, ALTAR.h + 0.04, 0]} castShadow>
          <boxGeometry args={[ALTAR.w + 0.12, 0.08, ALTAR.d + 0.1]} />
        </mesh>
        <mesh position={[0, ALTAR.h + 0.09, 0]}>
          <boxGeometry args={[1.2, 0.02, 0.4]} />
          <meshStandardMaterial color="#e9e3d2" roughness={0.95} />
        </mesh>
        <mesh position={[0, ALTAR.h + 0.42, 0.05]} castShadow>
          <boxGeometry args={[0.035, 0.6, 0.035]} />
          <meshStandardMaterial color="#c49a52" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, ALTAR.h + 0.56, 0.05]} castShadow>
          <boxGeometry args={[0.3, 0.035, 0.035]} />
          <meshStandardMaterial color="#c49a52" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0.62, 0.5, -0.31]}>
          <planeGeometry args={[0.04, 0.9]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  );
};

export default Ritual;
