import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePbr } from '@/components/game/crypt3d/materials';
import { AREA, CRYPT_DOOR } from '@/components/game/crypt3d/grave/grave-layout';

const GRASS = 5200;

const Grass = () => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.05, 0.32, 1, 3);
    g.translate(0, 0.16, 0);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      pos.setX(i, pos.getX(i) * (1 - y / 0.34));
      pos.setZ(i, (y * y) * 0.6);
    }
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2d3b2c',
        roughness: 0.9,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const c = new THREE.Color();
    for (let i = 0; i < GRASS; i++) {
      let x = (Math.random() - 0.5) * AREA * 1.8;
      let z = (Math.random() - 0.5) * AREA * 1.8;
      if (Math.abs(x) < 1.1 && z > -3) x += Math.sign(x || 1) * 1.2;
      if (Math.hypot(x - CRYPT_DOOR.x, z - CRYPT_DOOR.z) < 1.4) z -= 1.5;
      o.position.set(x, 0, z);
      o.rotation.set(0, Math.random() * Math.PI, 0);
      const s = 0.6 + Math.random() * 1.1;
      o.scale.set(s, s * (0.7 + Math.random() * 0.8), s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, c.setHSL(0.22 + Math.random() * 0.06, 0.25, 0.14 + Math.random() * 0.1));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.004;
  });

  return <instancedMesh ref={ref} args={[geo, mat, GRASS]} receiveShadow />;
};

const Terrain = ({ lowQuality }: { lowQuality: boolean }) => {
  const ground = usePbr('forrest_ground_01', [14, 14], { tint: '#7d8a86', normal: 1.6 });
  const path = usePbr('cobblestone_floor_08', [1.2, 6], { tint: '#6d7476', normal: 1.3 });
  const wall = usePbr('castle_brick_07', [2, 1], { tint: '#7f8789' });

  const groundGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(AREA * 2.6, AREA * 2.6, 80, 80);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const far = Math.max(0, Math.hypot(x, y) - AREA) * 0.18;
      const n = Math.sin(x * 0.7) * Math.cos(y * 0.6) * 0.06 + Math.sin(x * 2.1 + y * 1.7) * 0.025;
      pos.setZ(i, n + far * far);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group>
      <mesh geometry={groundGeo} material={ground} rotation={[-Math.PI / 2, 0, 0]} receiveShadow />
      <mesh material={path} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 3]} receiveShadow>
        <planeGeometry args={[1.6, 13]} />
      </mesh>
      {!lowQuality && <Grass />}

      <group position={[CRYPT_DOOR.x, 0, CRYPT_DOOR.z + 0.9]}>
        <mesh material={wall} position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 2.8, 1.6]} />
        </mesh>
        <mesh material={wall} position={[0, 3.0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[2.3, 2.3, 1.7]} />
        </mesh>
        <mesh position={[0, 1.05, -0.81]}>
          <planeGeometry args={[1.3, 2.1]} />
          <meshStandardMaterial color="#030405" roughness={1} />
        </mesh>
        <pointLight position={[0, 0.9, -1.2]} color="#6fa8ff" intensity={1.6} distance={4} decay={2} />
      </group>
    </group>
  );
};

export default Terrain;
