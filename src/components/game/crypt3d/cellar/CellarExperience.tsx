import { useCallback, useEffect, useState } from 'react';
import Hud from '@/components/game/crypt3d/Hud';
import NecroHud from '@/components/game/crypt3d/necro/NecroHud';
import { withNecro } from '@/components/game/crypt3d/necro/necro-result';
import Shell3D, { isTouch } from '@/components/game/crypt3d/Shell3D';
import CellarScene from '@/components/game/crypt3d/cellar/CellarScene';
import LedgerView from '@/components/game/crypt3d/cellar/LedgerView';
import { crypt, useCrypt } from '@/components/game/crypt3d/crypt-store';
import { CSPOTS, cellarInteract, cellarReset, cellarResult, setLedger, ledgerUi, type CellarResult } from '@/components/game/crypt3d/cellar/cellar-script';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';
import { cycleHands } from '@/components/game/crypt3d/hands/hand-state';

type Props = { onComplete: (r: CellarResult | null) => void; onExit: () => void; volume?: number };

const FREE = ['walk'];

const CellarExperience = ({ onComplete, onExit, volume = 0.8 }: Props) => {
  const stage = useCrypt((s) => s.stage);
  const [ready, setReady] = useState(false);
  const [fade, setFade] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    crypt.reset('walk');
    cellarReset();
    setLedger(false);
    cryptAudio.setVolume(volume);
    return () => {
      setLedger(false);
      cryptAudio.close();
    };
  }, [volume]);

  useEffect(() => {
    if (stage !== 'leaving') return;
    document.exitPointerLock?.();
    cryptAudio.chime(262);
    setFade(true);
    const t = window.setTimeout(() => onComplete(withNecro(cellarResult())), 1800);
    return () => window.clearTimeout(t);
  }, [stage, onComplete]);

  const interact = () => {
    if (ledgerUi.open) return setLedger(false);
    cellarInteract(crypt.get().focus);
  };

  return (
    <Shell3D
      ready={ready}
      loading="Половица поднимается…"
      accent="#d07a5f"
      freeStages={FREE}
      helpText="Список всех клавиш — в правом нижнем углу (F1)"
      fade={fade}
      onInteract={interact}
      onHands={cycleHands}
      onAdvance={() => crypt.advance()}
      onSkip={() => onComplete(null)}
      onExit={onExit}
      scene={<CellarScene onReady={onReady} />}
      overlay={
        <>
          {stage === 'walk' && <NecroHud touch={isTouch()} />}
          <Hud touch={isTouch()} free={FREE.includes(stage)} spots={CSPOTS} onInteract={cellarInteract} onAdvance={() => crypt.advance()} onHands={cycleHands} />
          <LedgerView />
        </>
      }
    />
  );
};

export default CellarExperience;
