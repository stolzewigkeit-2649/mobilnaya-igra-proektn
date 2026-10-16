import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const frag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying vec3 vNormal;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
  }
  void main() {
    vec3 view = normalize(cameraPosition - vWorld);
    float rim = pow(abs(dot(view, vNormal)), 1.6);
    float fall = pow(1.0 - vUv.y, 1.4) * smoothstep(0.0, 0.08, vUv.y) ;
    float top = smoothstep(1.0, 0.85, vUv.y);
    float n = noise(vec2(vUv.x * 8.0 + uTime * 0.05, vUv.y * 3.0 - uTime * 0.12));
    float a = rim * (1.0 - vUv.y * 0.35) * top * (0.55 + n * 0.6) * uOpacity;
    a *= smoothstep(0.0, 0.25, vUv.y);
    gl_FragColor = vec4(uColor * a, a);
  }
`;

export type Shaft = { from: [number, number, number]; to: [number, number, number]; r0: number; r1: number; color: string; opacity?: number };

const Beam = ({ s }: { s: Shaft }) => {
  const ref = useRef<THREE.Mesh>(null);
  const { geo, pos, quat } = useMemo(() => {
    const a = new THREE.Vector3(...s.from);
    const b = new THREE.Vector3(...s.to);
    const len = a.distanceTo(b);
    const g = new THREE.CylinderGeometry(s.r0, s.r1, len, 32, 1, true);
    g.translate(0, -len / 2, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), b.clone().sub(a).normalize());
    return { geo: g, pos: a, quat: q };
  }, [s]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(s.color) }, uTime: { value: 0 }, uOpacity: { value: s.opacity ?? 0.25 } },
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        fog: false,
      }),
    [s],
  );
  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
  });
  return <mesh ref={ref} geometry={geo} material={mat} position={pos} quaternion={quat} renderOrder={10} frustumCulled={false} />;
};

const LightShafts = ({ shafts }: { shafts: Shaft[] }) => (
  <group>
    {shafts.map((s, i) => (
      <Beam key={i} s={s} />
    ))}
  </group>
);

export default LightShafts;
