import { useMemo } from 'react';
import * as THREE from 'three';

type Props = {
  size?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  dim?: boolean;
};

const SectSign = ({ size = 1, position, rotation, dim }: Props) => {
  const gold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: dim ? '#8a7440' : '#c9a452',
        metalness: 0.85,
        roughness: 0.4,
        emissive: '#3a2a10',
        emissiveIntensity: 0.4,
      }),
    [dim],
  );
  const spire = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.09, -0.32);
    s.lineTo(0.09, -0.32);
    s.lineTo(0.05, 0.12);
    s.lineTo(0, 0.42);
    s.lineTo(-0.05, 0.12);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: false });
  }, []);

  return (
    <group position={position} rotation={rotation} scale={size}>
      <mesh material={gold} castShadow>
        <torusGeometry args={[0.32, 0.035, 8, 32]} />
      </mesh>
      <mesh material={gold} geometry={spire} position={[0, 0, -0.02]} castShadow />
    </group>
  );
};

export default SectSign;
