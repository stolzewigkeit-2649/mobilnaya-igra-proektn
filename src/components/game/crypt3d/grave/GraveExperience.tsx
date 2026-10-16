import { useCallback, useEffect, useState } from 'react';
import Hud from '@/components/game/crypt3d/Hud';
import NecroHud from '@/components/game/crypt3d/necro/NecroHud';
import { withNecro } from '@/components/game/crypt3d/necro/necro-result';
import Shell3D, { isTouch } from '@/components/game/crypt3d/Shell3D';
import GraveScene from '@/components/game/crypt3d/grave/GraveScene';
import { crypt, useCrypt } from '@/components/game/crypt3d/crypt-store';
import { GSPOTS, graveInteract, graveReset, graveResult, type GraveResult } from '@/components/game/crypt3d/grave/grave-script';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';
import { cycleHands } from '@/components/game/crypt3d/hands/hand-state';

type Props = { onComplete: (r: GraveResult | null) => void; onExit: () => void; volume?: number };

const FREE = ['walk', 'sariel', 'follow'];

const GraveExperience = ({ onComplete, onExit, volume = 0.8 }: Props) => {
  const stage = useCrypt((s) => s.stage);
  const grey = useCrypt((s) => s.grey);
  const [ready, setReady] = useState(false);
  const [fade, setFade] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    crypt.reset('walk');
    graveReset();
    cryptAudio.setVolume(volume);
    return () => cryptAudio.close();
  }, [volume]);

  useEffect(() => {
    if (stage !== 'leaving') return;
    document.exitPointerLock?.();
    setFade(true);
    const t = window.setTimeout(() => onComplete(withNecro(graveResult())), 1800);
    return () => window.clearTimeout(t);
  }, [stage, onComplete]);

  return (
    <Shell3D
      ready={ready}
      loading="Луна поднимается над крестами…"
      accent="#b9c8ff"
      freeStages={FREE}
      helpText="Список всех клавиш — в правом нижнем углу (F1)"
      fade={fade}
      onInteract={() => graveInteract(crypt.get().focus)}
      onAdvance={() => crypt.advance()}
      onHands={cycleHands}
      onSkip={() => onComplete(null)}
      onExit={onExit}
      scene={<GraveScene onReady={onReady} />}
      overlay={
        <>
          <div
            className="pointer-events-none absolute inset-0 transition-[backdrop-filter] duration-[1500ms]"
            style={{ backdropFilter: grey ? 'grayscale(0.85) contrast(1.1)' : 'grayscale(0)' }}
          />
          {['walk', 'sariel'].includes(stage) && <NecroHud touch={isTouch()} />}
          <Hud
            touch={isTouch()}
            free={FREE.includes(stage)}
            spots={GSPOTS}
            onInteract={graveInteract}
            onAdvance={() => crypt.advance()}
            onHands={cycleHands}
          />
        </>
      }
    />
  );
};

export default GraveExperience;
