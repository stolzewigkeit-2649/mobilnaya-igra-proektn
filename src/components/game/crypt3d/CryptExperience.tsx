import { useCallback, useEffect, useState } from 'react';
import CryptScene from '@/components/game/crypt3d/CryptScene';
import Hud from '@/components/game/crypt3d/Hud';
import Intro from '@/components/game/crypt3d/Intro';
import Shell3D, { isTouch } from '@/components/game/crypt3d/Shell3D';
import { crypt, useCrypt, type Stage } from '@/components/game/crypt3d/crypt-store';
import { SPOTS, interact, lookAtHands, advanceLine, resetSummon } from '@/components/game/crypt3d/interactables';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';
import { touchShard } from '@/components/game/crypt3d/hands/hand-state';

type Props = { onComplete: () => void; onExit: () => void; startStage?: Stage; volume?: number };

const FREE = ['explore', 'gift'];

const CryptExperience = ({ onComplete, onExit, startStage = 'intro', volume = 0.8 }: Props) => {
  const stage = useCrypt((s) => s.stage);
  const [fade, setFade] = useState(false);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(startStage !== 'intro');
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    crypt.reset(startStage);
    resetSummon();
    cryptAudio.setVolume(volume);
    if (startStage === 'explore') crypt.set({ objective: 'Осмотрись. Нажми H, чтобы посмотреть на руки.' });
    return () => cryptAudio.close();
  }, [startStage, volume]);

  useEffect(() => {
    if (stage !== 'leaving') return;
    document.exitPointerLock?.();
    cryptAudio.chime(262);
    setFade(true);
    const t = window.setTimeout(onComplete, 1800);
    return () => window.clearTimeout(t);
  }, [stage, onComplete]);

  return (
    <Shell3D
      ready={ready}
      loading="Склеп пробуждается…"
      accent="#7fb0ff"
      freeStages={FREE}
      helpText="Список всех клавиш — в правом нижнем углу (F1)"
      fade={fade}
      onInteract={() => (crypt.get().stage === 'shard' ? touchShard() : interact(crypt.get().focus))}
      onHands={lookAtHands}
      onAdvance={advanceLine}
      onSkip={onComplete}
      onExit={onExit}
      scene={<CryptScene onExitReached={() => crypt.set({ stage: 'leaving' })} onReady={onReady} />}
      overlay={
        <>
          <Intro skip={startStage !== 'intro'} ready={ready && started} />
          {ready && !started && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-black">
              <p className="font-display text-base italic text-white/60">Темнота. Где-то капает вода.</p>
              <button
                type="button"
                onClick={() => {
                  cryptAudio.unlock();
                  setStarted(true);
                }}
                className="rounded-full border border-[#7fb0ff]/50 px-7 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-[#bcd8ff] shadow-[0_0_40px_-10px_#7fb0ff] transition-colors hover:bg-[#7fb0ff]/10"
              >
                Открыть глаза
              </button>
              <p className="text-[0.66rem] text-white/35">лучше в наушниках</p>
            </div>
          )}
          <Hud
            touch={isTouch()}
            free={FREE.includes(stage)}
            spots={SPOTS}
            onInteract={interact}
            onAdvance={advanceLine}
            onHands={lookAtHands}
          />
        </>
      }
    />
  );
};

export default CryptExperience;
