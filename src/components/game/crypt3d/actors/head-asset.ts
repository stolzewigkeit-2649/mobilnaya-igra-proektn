import { useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const HEAD_URL = '/models/head.glb';
const COL = '/models/head_col.webp';
const NOR = '/models/head_nor.webp';

export const S = 0.047;
export const BUST_BOTTOM = -3.9 * S;
export const EYE_Y = 1.5 * S;

function source(scene: THREE.Object3D) {
  let g: THREE.BufferGeometry | null = null;
  scene.traverse((o) => {
    if (!g && (o as THREE.Mesh).isMesh) g = (o as THREE.Mesh).geometry;
  });
  return g as unknown as THREE.BufferGeometry;
}

export function useHeadGeometry() {
  const gltf = useGLTF(HEAD_URL);
  return useMemo(() => {
    const g = source(gltf.scene).clone();
    g.scale(S, S, S);
    g.computeBoundingSphere();
    return g;
  }, [gltf]);
}

export function useHairGeometry(long: boolean) {
  const gltf = useGLTF(HEAD_URL);
  return useMemo(() => {
    const src = source(gltf.scene);
    const pos = src.attributes.position;
    const nor = src.attributes.normal;
    const idx = src.index!;
    const keep = (i: number) => {
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const x = Math.abs(pos.getX(i));
      if (y > 2.35) return true;
      if (z < 0.6 && y > (long ? -1.2 : 0.2) && x < 2.6) return true;
      if (x > 1.45 && y > 1.6 && z < 1.4) return true;
      return false;
    };
    const out: number[] = [];
    for (let t = 0; t < idx.count; t += 3) {
      const a = idx.getX(t);
      const b = idx.getX(t + 1);
      const c = idx.getX(t + 2);
      if (keep(a) && keep(b) && keep(c)) out.push(a, b, c);
    }
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const lift = 0.16 + (pos.getY(i) > 2.6 ? 0.12 : 0);
      p[i * 3] = (pos.getX(i) + nor.getX(i) * lift) * S;
      p[i * 3 + 1] = (pos.getY(i) + nor.getY(i) * lift) * S;
      p[i * 3 + 2] = (pos.getZ(i) + nor.getZ(i) * lift) * S;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('uv', src.attributes.uv ?? src.attributes.TEXCOORD_0);
    g.setIndex(out);
    g.computeVertexNormals();
    return g;
  }, [gltf, long]);
}

export type SkinOpts = { tint: string; ghost?: boolean; emissive?: string; roughness?: number };

export function useSkin({ tint, ghost = false, emissive = '#000000', roughness = 0.5 }: SkinOpts) {
  const [col, nor] = useTexture([COL, NOR]);
  return useMemo(() => {
    const map = col.clone();
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
    const normalMap = nor.clone();
    normalMap.needsUpdate = true;
    return new THREE.MeshPhysicalMaterial({
      map,
      normalMap,
      normalScale: new THREE.Vector2(1, 1),
      color: new THREE.Color(tint),
      roughness: ghost ? 0.2 : roughness,
      sheen: ghost ? 0 : 0.6,
      sheenRoughness: 0.55,
      sheenColor: new THREE.Color('#ffcfc4'),
      clearcoat: ghost ? 0.5 : 0.06,
      clearcoatRoughness: 0.5,
      emissive: new THREE.Color(emissive),
      emissiveIntensity: ghost ? 0.8 : emissive === '#000000' ? 0 : 0.35,
      transparent: ghost,
      depthWrite: !ghost,
    });
  }, [col, nor, tint, ghost, emissive, roughness]);
}

export function hairMaterial(color: string, sheen = '#ffffff') {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.42,
    sheen: 1,
    sheenRoughness: 0.35,
    sheenColor: new THREE.Color(sheen),
    side: THREE.DoubleSide,
  });
}

export function clothMaterial(color: string, opts: { sheen?: string; roughness?: number; emissive?: string } = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: opts.roughness ?? 0.9,
    sheen: 0.8,
    sheenRoughness: 0.7,
    sheenColor: new THREE.Color(opts.sheen ?? '#8090b0'),
    emissive: new THREE.Color(opts.emissive ?? '#000000'),
    emissiveIntensity: opts.emissive ? 0.25 : 0,
    side: THREE.DoubleSide,
  });
}

useGLTF.preload(HEAD_URL);
