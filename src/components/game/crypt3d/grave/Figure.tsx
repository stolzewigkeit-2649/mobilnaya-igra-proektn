import { forwardRef, type ReactNode } from 'react';
import * as THREE from 'three';

export type FigureMats = {
  skin: THREE.Material;
  cloth: THREE.Material;
  pants: THREE.Material;
  hair: THREE.Material;
};

type Props = FigureMats & {
  hairLong?: boolean;
  coat?: boolean;
  armL?: [number, number, number];
  armR?: [number, number, number];
  legL?: [number, number, number];
  legR?: [number, number, number];
  head?: [number, number, number];
  children?: ReactNode;
};

const Limb = ({ mat, len, r, rot, at }: { mat: THREE.Material; len: number; r: number; rot?: [number, number, number]; at: [number, number, number] }) => (
  <group position={at} rotation={rot ?? [0, 0, 0]}>
    <mesh material={mat} position={[0, -len / 2, 0]} castShadow>
      <capsuleGeometry args={[r, len - r * 2, 6, 12]} />
    </mesh>
  </group>
);

const Figure = forwardRef<THREE.Group, Props>(
  ({ skin, cloth, pants, hair, hairLong, coat, armL, armR, legL, legR, head, children }, ref) => (
    <group ref={ref}>
      <Limb mat={pants} len={0.9} r={0.075} at={[-0.1, 0.92, 0]} rot={legL} />
      <Limb mat={pants} len={0.9} r={0.075} at={[0.1, 0.92, 0]} rot={legR} />
      <mesh material={cloth} position={[0, 1.2, 0]} scale={[1, 1, 0.62]} castShadow>
        <capsuleGeometry args={[0.18, 0.4, 8, 16]} />
      </mesh>
      {coat && (
        <mesh material={cloth} position={[0, 0.78, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.36, 0.9, 20, 1, true]} />
        </mesh>
      )}
      <Limb mat={cloth} len={0.62} r={0.06} at={[-0.25, 1.46, 0]} rot={armL ?? [0, 0, 0.12]} />
      <Limb mat={cloth} len={0.62} r={0.06} at={[0.25, 1.46, 0]} rot={armR ?? [0, 0, -0.12]} />
      <mesh material={skin} position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 12]} />
      </mesh>
      <group position={[0, 1.7, 0]} rotation={head ?? [0, 0, 0]}>
        <mesh material={skin} scale={[0.86, 1.06, 0.95]} castShadow>
          <sphereGeometry args={[0.115, 24, 18]} />
        </mesh>
        <mesh material={skin} position={[0, -0.02, 0.105]} scale={[0.5, 0.7, 0.4]}>
          <sphereGeometry args={[0.04, 10, 8]} />
        </mesh>
        <mesh material={hair} position={[0, 0.03, -0.012]} scale={[0.92, 0.95, 1]}>
          <sphereGeometry args={[0.122, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        {hairLong && (
          <mesh material={hair} position={[0, -0.09, -0.05]} scale={[1, 1, 0.65]}>
            <cylinderGeometry args={[0.125, 0.14, 0.24, 20, 1, true, Math.PI * 0.2, Math.PI * 1.6]} />
          </mesh>
        )}
      </group>
      {children}
    </group>
  ),
);

Figure.displayName = 'Figure';

export default Figure;
