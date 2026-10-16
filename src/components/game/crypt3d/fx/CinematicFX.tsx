import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, N8AO, Vignette, Noise, ToneMapping, SMAA } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import { isTouch } from '@/components/game/crypt3d/Shell3D';

type Props = { ao?: number; bloom?: number; aoColor?: string };

const CinematicFX = ({ ao = 2.2, bloom = 0.9, aoColor = '#000000' }: Props) => {
  const gl = useThree((s) => s.gl);
  const [tier, setTier] = useState<0 | 1 | 2>(() => (isTouch() ? 1 : 2));

  useEffect(() => {
    const prev = gl.toneMapping;
    return () => {
      gl.toneMapping = prev;
    };
  }, [gl]);

  return (
    <>
      <PerformanceMonitor onDecline={() => setTier((t) => (t > 0 ? ((t - 1) as 0 | 1) : 0))} flipflops={3} />
      {tier > 0 && (
        <EffectComposer multisampling={0}>
          {tier === 2 ? (
            <N8AO aoRadius={0.9} distanceFalloff={0.6} intensity={ao} quality="medium" color={aoColor} halfRes />
          ) : (
            <N8AO aoRadius={0.7} distanceFalloff={0.6} intensity={ao * 0.8} quality="performance" color={aoColor} halfRes />
          )}
          <Bloom mipmapBlur intensity={bloom} luminanceThreshold={0.82} luminanceSmoothing={0.2} radius={0.72} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette offset={0.28} darkness={0.72} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  );
};

export default CinematicFX;
