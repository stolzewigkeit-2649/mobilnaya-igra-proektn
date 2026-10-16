import { useCallback, useEffect, useState } from 'react';
import Hud from '@/components/game/crypt3d/Hud';
import NecroHud from '@/components/game/crypt3d/necro/NecroHud';
import { withNecro } from '@/components/game/crypt3d/necro/necro-result';
import Shell3D, { isTouch } from '@/components/game/crypt3d/Shell3D';
import VillageScene from '@/components/game/crypt3d/village/VillageScene';
import { crypt, useCrypt } from '@/components/game/crypt3d/crypt-store';
import { VSPOTS, villageInteract, villageIntro, villageReset, villageResult, type VillageResult } from '@/components/game/crypt3d/village/village-script';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';
import { cycleHands } from '@/components/game/crypt3d/hands/hand-state';

type Props = { onComplete: (r: VillageResult | null) => void; onExit: () => void; volume?: number };

const FREE = ['walk'];

const VillageExperience = ({ onComplete, onExit, volume = 0.8 }: Props) => {
  const stage = useCrypt((s) => s.stage);
  const grey = useCrypt((s) => s.grey);
  const [ready, setReady] = useState(false);
  const [fade, setFade] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    crypt.reset('walk');
    villageReset();
    cryptAudio.setVolume(volume);
    return () => cryptAudio.close();
  }, [volume]);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(villageIntro, 900);
    return () => window.clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    if (stage !== 'leaving') return;
    document.exitPointerLock?.();
    cryptAudio.chime(262);
    setFade(true);
    const t = window.setTimeout(() => onComplete(withNecro(villageResult())), 1800);
    return () => window.clearTimeout(t);
  }, [stage, onComplete]);

  return (
    <Shell3D
      ready={ready}
      loading="Колокол звенит над Овражьем…"
      accent="#d8c89a"
      freeStages={FREE}
      helpText="Список всех клавиш — в правом нижнем углу (F1)"
      fade={fade}
      onInteract={() => villageInteract(crypt.get().focus)}
      onAdvance={() => crypt.advance()}
      onHands={cycleHands}
      onSkip={() => onComplete(null)}
      onExit={onExit}
      scene={<VillageScene onReady={onReady} />}
      overlay={
        <>
          <div
            className="pointer-events-none absolute inset-0 transition-[backdrop-filter] duration-[1500ms]"
            style={{ backdropFilter: grey ? 'grayscale(0.85) contrast(1.1)' : 'grayscale(0)' }}
          />
          {stage === 'walk' && <NecroHud touch={isTouch()} />}
          <Hud touch={isTouch()} free={FREE.includes(stage)} spots={VSPOTS} onInteract={villageInteract} onAdvance={() => crypt.advance()} onHands={cycleHands} />
        </>
      }
    />
  );
};

export default VillageExperience;
