import { useMemo } from 'react';
import * as THREE from 'three';
import { TABLE, SHELF } from '@/components/game/crypt3d/cellar/cellar-layout';
import { usePbr } from '@/components/game/crypt3d/materials';

function paperTexture(lines: number) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 340;
  const g = c.getContext('2d')!;
  g.fillStyle = '#e4dcc5';
  g.fillRect(0, 0, 256, 340);
  g.fillStyle = 'rgba(120,90,50,0.15)';
  for (let i = 0; i < 40; i++) g.fillRect(Math.random() * 256, Math.random() * 340, 3, 3);
  g.strokeStyle = 'rgba(40,30,25,0.85)';
  g.lineWidth = 2;
  for (let i = 0; i < lines; i++) {
    const y = 30 + i * 22;
    g.beginPath();
    g.moveTo(18, y);
    let x = 18;
    while (x < 140 + Math.random() * 60) {
      x += 4 + Math.random() * 8;
      g.lineTo(x, y + (Math.random() - 0.5) * 3);
    }
    g.stroke();
    if (i % 3 === 0) {
      g.strokeStyle = 'rgba(130,20,15,0.8)';
      g.beginPath();
      g.moveTo(205, y - 6);
      g.lineTo(235, y + 2);
      g.stroke();
      g.strokeStyle = 'rgba(40,30,25,0.85)';
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const Tool = ({ p, r, kind, steel }: { p: [number, number, number]; r: number; kind: number; steel: THREE.Material }) => (
  <group position={p} rotation={[0, r, 0]}>
    <mesh position={[0, 0.012, -0.07]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.012, 0.014, 0.12, 8]} />
      <meshStandardMaterial color="#3d2a1c" roughness={0.8} />
    </mesh>
    {kind === 0 && (
      <mesh material={steel} position={[0, 0.008, 0.04]} castShadow>
        <boxGeometry args={[0.016, 0.004, 0.11]} />
      </mesh>
    )}
    {kind === 1 && (
      <mesh material={steel} position={[0, 0.008, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.002, 0.004, 0.14, 6]} />
      </mesh>
    )}
    {kind === 2 && (
      <mesh material={steel} position={[0, 0.01, 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.035, 0.005, 6, 16, Math.PI]} />
      </mesh>
    )}
  </group>
);

const Workbench = () => {
  const wood = usePbr('old_planks_02', [1, 2], { tint: '#7a6553', normal: 1.3 });
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: '#a7a9ab', metalness: 1, roughness: 0.28 }), []);
  const papers = useMemo(() => [paperTexture(12), paperTexture(9), paperTexture(13)], []);
  const glass = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#c4d4c8', roughness: 0.05, transmission: 0.85, thickness: 0.02, transparent: true, opacity: 0.6 }),
    [],
  );

  return (
    <group>
      <group position={[TABLE.x, 0, TABLE.z]}>
        <mesh material={wood} position={[0, TABLE.h, 0]} castShadow receiveShadow>
          <boxGeometry args={[TABLE.w, 0.06, TABLE.d]} />
        </mesh>
        {[
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} material={wood} position={[x * (TABLE.w / 2 - 0.06), TABLE.h / 2, z * (TABLE.d / 2 - 0.06)]} castShadow>
            <boxGeometry args={[0.07, TABLE.h, 0.07]} />
          </mesh>
        ))}
        {papers.map((m, i) => (
          <mesh key={i} position={[-0.12 + i * 0.05, TABLE.h + 0.032 + i * 0.001, -0.35 + i * 0.12]} rotation={[-Math.PI / 2, 0, 0.15 - i * 0.2]}>
            <planeGeometry args={[0.21, 0.28]} />
            <meshStandardMaterial map={m} roughness={0.95} />
          </mesh>
        ))}
        <mesh position={[0.2, TABLE.h + 0.07, -0.55]} castShadow>
          <cylinderGeometry args={[0.03, 0.035, 0.07, 14]} />
          <meshStandardMaterial color="#141210" roughness={0.3} />
        </mesh>
        <mesh position={[0.21, TABLE.h + 0.14, -0.55]} rotation={[0, 0, -0.35]}>
          <cylinderGeometry args={[0.002, 0.004, 0.16, 5]} />
          <meshStandardMaterial color="#d8d0bd" roughness={0.6} />
        </mesh>
        {[0, 1, 2, 0, 1, 2, 0].map((k, i) => (
          <Tool key={i} p={[0.25, TABLE.h + 0.03, 0.15 + i * 0.1]} r={Math.PI / 2 + (i % 2) * 0.05} kind={k} steel={steel} />
        ))}
        <mesh position={[0.1, TABLE.h + 0.03, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 0.18]} />
          <meshStandardMaterial color="#3d2a20" roughness={0.9} />
        </mesh>
      </group>

      <group position={[SHELF.x, 0, SHELF.z]}>
        {[0.5, 1.05, 1.6].map((y) => (
          <mesh key={y} material={wood} position={[0, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.36, 0.04, 1.7]} />
          </mesh>
        ))}
        {[-0.82, 0.82].map((z) => (
          <mesh key={z} material={wood} position={[0, 0.9, z]} castShadow>
            <boxGeometry args={[0.36, 1.8, 0.05]} />
          </mesh>
        ))}
        {Array.from({ length: 15 }, (_, i) => {
          const row = i % 3;
          const z = -0.7 + Math.floor(i / 3) * 0.33 + (row - 1) * 0.06;
          const h = 0.12 + ((i * 7) % 5) * 0.025;
          return (
            <group key={i} position={[-0.02, [0.52, 1.07, 1.62][row] + h / 2 + 0.02, z]}>
              <mesh material={glass} castShadow>
                <cylinderGeometry args={[0.045, 0.05, h, 14]} />
              </mesh>
              <mesh position={[0, -h * 0.15, 0]}>
                <cylinderGeometry args={[0.04, 0.045, h * 0.6, 14]} />
                <meshPhysicalMaterial color={i % 3 === 0 ? '#3a0806' : '#4a5a3a'} roughness={0.2} transparent opacity={0.85} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

export default Workbench;
