import * as THREE from 'three';

export type FxUniforms = {
  uReveal: { value: number };
  uTalk: { value: number };
  uSmile: { value: number };
  uTime: { value: number };
  uEdge: { value: THREE.Color };
};

export const makeFx = (edge = '#9fc4ff'): FxUniforms => ({
  uReveal: { value: 1 },
  uTalk: { value: 0 },
  uSmile: { value: 0 },
  uTime: { value: 0 },
  uEdge: { value: new THREE.Color(edge) },
});

const NOISE = /* glsl */ `
varying vec3 vFxPos;
float fxHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float fxNoise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(fxHash(i), fxHash(i + vec3(1,0,0)), f.x), mix(fxHash(i + vec3(0,1,0)), fxHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(fxHash(i + vec3(0,0,1)), fxHash(i + vec3(1,0,1)), f.x), mix(fxHash(i + vec3(0,1,1)), fxHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fxField(vec3 p){ return fxNoise(p * 9.0) * 0.6 + fxNoise(p * 23.0) * 0.4; }
`;

const FACE = /* glsl */ `
{
  float S = 0.047;
  float ax = abs(transformed.x);
  float jaw = (1.0 - smoothstep(-0.05 * S, 0.14 * S, transformed.y)) * smoothstep(-1.55 * S, -0.95 * S, transformed.y)
            * (1.0 - smoothstep(1.0 * S, 1.7 * S, ax)) * smoothstep(0.2 * S, 1.3 * S, transformed.z);
  transformed.y -= jaw * uTalk * 0.011;
  transformed.z -= jaw * uTalk * 0.003;
  float corner = smoothstep(0.25 * S, 0.6 * S, ax) * (1.0 - smoothstep(0.75 * S, 1.15 * S, ax))
               * smoothstep(-0.55 * S, -0.2 * S, transformed.y) * (1.0 - smoothstep(0.1 * S, 0.35 * S, transformed.y))
               * smoothstep(1.0 * S, 1.6 * S, transformed.z);
  transformed.y += corner * uSmile * 0.004;
  transformed.z -= corner * uSmile * 0.002;
  transformed.x += sign(transformed.x) * corner * uSmile * 0.002;
}
`;

export function applyFx(mat: THREE.Material, fx: FxUniforms, opts: { face?: boolean; scale?: number } = {}) {
  const scale = (opts.scale ?? 1).toFixed(3);
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, fx);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nuniform float uTalk;\nuniform float uSmile;\nvarying vec3 vFxPos;`)
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>\n${opts.face ? FACE : ''}\nvFxPos = (modelMatrix * vec4(transformed, 1.0)).xyz * ${scale};`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nuniform float uReveal;\nuniform float uTime;\nuniform vec3 uEdge;\n${NOISE}`)
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>\nfloat fxN = fxField(vFxPos + vec3(0.0, uTime * 0.05, 0.0));\nif (fxN > uReveal * 1.08) discard;`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>\nfloat fxRim = 1.0 - smoothstep(0.0, 0.07, uReveal * 1.08 - fxN);\ntotalEmissiveRadiance += uEdge * fxRim * 3.0 * step(uReveal, 0.999);`,
      );
  };
  mat.customProgramCacheKey = () => `fx-${opts.face ? 'face' : 'body'}`;
  mat.needsUpdate = true;
  return mat;
}
