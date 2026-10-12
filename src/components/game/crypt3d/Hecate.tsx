import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { HECATE_POS } from '@/components/game/crypt3d/layout';
import { glowTexture } from '@/components/game/crypt3d/glow';
import { crypt } from '@/components/game/crypt3d/crypt-store';

const IMG = '/gods/hekate.webp';
const H = 2.55;
const W = H * (1024 / 1536);
const TORCH: [number, number] = [-0.4, 0.86];

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform sampler2D map;
  uniform float uShow;
  uniform float uTime;
  uniform float uGlow;
  uniform vec3 uRim;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1, 0)), c = hash(i + vec2(0, 1)), d = hash(i + vec2(1, 1));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;
    float sway = smoothstep(0.55, 0.0, uv.y);
    uv.x += sin(uv.y * 9.0 + uTime * 1.3) * 0.006 * sway;
    vec4 c = texture2D(map, uv);

    float edge = 0.0;
    float px = 0.004;
    edge += texture2D(map, uv + vec2(px, 0.0)).a;
    edge += texture2D(map, uv - vec2(px, 0.0)).a;
    edge += texture2D(map, uv + vec2(0.0, px)).a;
    edge += texture2D(map, uv - vec2(0.0, px)).a;
    float rim = clamp(edge * 0.25 - c.a, 0.0, 1.0) + (1.0 - c.a) * step(0.02, edge) * 0.4;

    float n = noise(vUv * vec2(6.0, 10.0) + vec2(0.0, -uTime * 0.25));
    float reveal = smoothstep(n - 0.12, n + 0.02, uShow * 1.15 - (1.0 - vUv.y) * 0.15);
    float burn = smoothstep(0.0, 0.08, abs(uShow * 1.15 - (1.0 - vUv.y) * 0.15 - n)) ;

    float feet = smoothstep(0.0, 0.14, vUv.y);
    vec3 col = c.rgb * (0.82 + uGlow * 0.35);
    col += uRim * rim * (0.9 + uGlow);
    col = mix(uRim * 2.2, col, burn);
    float a = max(c.a, rim * 0.7) * reveal * feet;
    a *= 0.96 + sin(uTime * 23.0 + vUv.y * 60.0) * 0.015;
    if (a < 0.01) discard;
    gl_FragColor = vec4(col, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const Flame = () => {
  const outer = useRef<THREE.Sprite>(null);
  const inner = useRef<THREE.Sprite>(null);
  const light = useRef<THREE.PointLight>(null);
  const tex = useMemo(() => glowTexture('rgba(255,200,110,1)'), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const f = 0.88 + Math.sin(t * 13) * 0.06 + Math.sin(t * 7.3) * 0.05 + Math.random() * 0.04;
    outer.current?.scale.set(0.55 * f, 0.8 * f, 1);
    inner.current?.scale.set(0.2 * f, 0.34 * f, 1);
    if (light.current) light.current.intensity = 5 * f * (crypt.get().stage === 'gift' ? 1.4 : 1);
  });
  return (
    <group position={[TORCH[0], TORCH[1] * H, 0.08]}>
      <sprite ref={outer} position={[0, 0.12, 0]}>
        <spriteMaterial map={tex} color="#ffa040" transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite ref={inner} position={[0, 0.06, 0.01]}>
        <spriteMaterial map={tex} color="#fff2c8" transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <Sparkles count={20} scale={[0.25, 0.7, 0.25]} position={[0, 0.35, 0]} size={2.5} speed={1.4} color="#ffcf80" />
      <pointLight ref={light} color="#ffb060" distance={7} decay={1.7} castShadow={false} />
    </group>
  );
};

const Hecate = () => {
  const root = useRef<THREE.Group>(null);
  const face = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Sprite>(null);
  const moon = useRef<THREE.Sprite>(null);
  const light = useRef<THREE.PointLight>(null);
  const show = useRef(0);

  const map = useLoader(THREE.TextureLoader, IMG);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const glow = useMemo(() => glowTexture('rgba(255,255,255,1)'), []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: map },
          uShow: { value: 0 },
          uTime: { value: 0 },
          uGlow: { value: 0 },
          uRim: { value: new THREE.Color('#e0b866') },
        },
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [map],
  );

  useFrame(({ clock, camera }, dt) => {
    const s = crypt.get();
    const want = s.stage === 'hecate' || s.stage === 'gift' ? 1 : 0;
    show.current = THREE.MathUtils.damp(show.current, want, want ? 0.7 : 1.4, dt);
    const v = show.current;
    const t = clock.elapsedTime;
    const smiling = s.lines[s.lineIndex]?.text.startsWith('Геката улыбается');

    if (root.current) {
      root.current.visible = v > 0.005;
      root.current.position.y = HECATE_POS.y + 0.04 + Math.sin(t * 0.8) * 0.03;
    }
    if (face.current) {
      const dx = camera.position.x - HECATE_POS.x;
      const dz = camera.position.z - HECATE_POS.z;
      face.current.rotation.y = THREE.MathUtils.damp(face.current.rotation.y, Math.atan2(dx, dz), 3, dt);
    }
    mat.uniforms.uShow.value = v;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uGlow.value = THREE.MathUtils.damp(mat.uniforms.uGlow.value, (smiling ? 0.8 : 0) + (s.stage === 'gift' ? 0.4 : 0), 3, dt);

    if (halo.current) {
      const k = (1 + Math.sin(t * 1.4) * 0.06) * v;
      halo.current.scale.set(k * 3.2, k * 4.2, 1);
    }
    if (moon.current) {
      const k = (0.75 + Math.sin(t * 2.2) * 0.08) * v;
      moon.current.scale.set(k, k, 1);
    }
    if (light.current) light.current.intensity = v * (4 + Math.sin(t * 3) * 0.6);
  });

  return (
    <group ref={root} position={HECATE_POS} visible={false}>
      <group ref={face}>
        <sprite ref={halo} position={[0, H * 0.55, -0.12]}>
          <spriteMaterial map={glow} color="#5a3f8a" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </sprite>
        <sprite ref={moon} position={[0, H * 0.94, -0.02]}>
          <spriteMaterial map={glow} color="#e8c27a" transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </sprite>
        <mesh position={[0, H / 2, 0]} material={mat} renderOrder={5}>
          <planeGeometry args={[W, H]} />
        </mesh>
        <Flame />
      </group>
      <mesh position={[0, 0.01, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} depthWrite={false} />
      </mesh>
      <pointLight ref={light} position={[0, 1.9, 0.9]} color="#c8b6ff" distance={8} decay={1.7} intensity={0} />
      <Sparkles count={45} scale={[1.6, 2.6, 1]} position={[0, 1.3, 0]} size={2} speed={0.3} color="#e8d2a0" opacity={0.7} />
    </group>
  );
};

export default Hecate;
