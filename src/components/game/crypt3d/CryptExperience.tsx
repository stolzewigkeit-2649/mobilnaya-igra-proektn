import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import Icon from '@/components/ui/icon';
import CryptScene from '@/components/game/crypt3d/CryptScene';
import Hud from '@/components/game/crypt3d/Hud';
import Intro from '@/components/game/crypt3d/Intro';
import { crypt, input, useCrypt, type Stage } from '@/components/game/crypt3d/crypt-store';
import { interact, lookAtHands, advanceLine, resetSummon } from '@/components/game/crypt3d/interactables';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';

type Props = { onComplete: () => void; onExit: () => void; startStage?: Stage; volume?: number };

const Loader = ({ ready }: { ready: boolean }) => {
  const { progress } = useProgress();
  if (ready) return null;
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
      <p className="font-display text-lg italic text-white/80">Склеп пробуждается…</p>
      <div className="mt-4 h-0.5 w-48 overflow-hidden rounded bg-white/10">
        <div className="h-full bg-[#7fb0ff] transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-xs tabular-nums text-white/40">{Math.round(progress)}%</p>
    </div>
  );
};

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

const CryptExperience = ({ onComplete, onExit, startStage = 'intro', volume = 0.8 }: Props) => {
  const touch = useMemo(() => 'ontouchstart' in window || window.innerWidth < 900, []);
  const stage = useCrypt((s) => s.stage);
  const paused = useCrypt((s) => s.paused);
  const [fade, setFade] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const webgl = useMemo(hasWebGL, []);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(startStage !== 'intro');
  const onReady = useCallback(() => setReady(true), []);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    crypt.reset(startStage);
    resetSummon();
    cryptAudio.setVolume(volume);
    if (startStage === 'explore') crypt.set({ objective: 'Осмотрись. Нажми H, чтобы посмотреть на руки.' });
    if (startStage === 'hecate')
      crypt.say([{ who: 'hecate', text: 'Та, кто знает, куда уходят мёртвые.' }]);
    return () => {
      cryptAudio.close();
      input.keys.clear();
    };
  }, [startStage, volume]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      input.keys.add(e.code);
      const s = crypt.get();
      if (e.code === 'KeyE' && !s.lines.length) interact(s.focus);
      if (e.code === 'KeyH') lookAtHands();
      if (e.code === 'Enter' || e.code === 'Space') advanceLine();
      if (e.code === 'Escape') crypt.set({ paused: true });
    };
    const up = (e: KeyboardEvent) => input.keys.delete(e.code);
    const lockChange = () => {
      setLocked(!!document.pointerLockElement);
      if (!document.pointerLockElement && ['explore', 'gift'].includes(crypt.get().stage)) crypt.set({ paused: true });
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    document.addEventListener('pointerlockchange', lockChange);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      document.removeEventListener('pointerlockchange', lockChange);
    };
  }, []);

  useEffect(() => {
    if (stage !== 'leaving') return;
    document.exitPointerLock?.();
    cryptAudio.chime(262);
    setFade(true);
    const t = window.setTimeout(onComplete, 1800);
    return () => window.clearTimeout(t);
  }, [stage, onComplete]);

  const lock = () => {
    cryptAudio.unlock();
    if (document.pointerLockElement && crypt.get().lines.length) {
      advanceLine();
      return;
    }
    if (!touch && ['explore', 'gift'].includes(crypt.get().stage))
      wrap.current?.querySelector('canvas')?.requestPointerLock?.();
    if (crypt.get().paused) crypt.set({ paused: false });
  };

  if (!webgl)
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-black p-6 text-center">
        <p className="text-white/80">Твоё устройство не поддерживает 3D-графику.</p>
        <button type="button" onClick={onExit} className="rounded-lg px-5 py-3 font-bold text-primary-foreground btn-play-surface">
          Продолжить текстом
        </button>
      </div>
    );

  return (
    <div ref={wrap} className="fixed inset-0 z-[60] bg-black" onPointerDown={lock}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 68, near: 0.03, far: 40 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <CryptScene onExitReached={() => crypt.set({ stage: 'leaving' })} onReady={onReady} />
        </Suspense>
      </Canvas>
      <Loader ready={ready} />
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
      <Hud touch={touch} />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          document.exitPointerLock?.();
          crypt.set({ paused: true });
        }}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-lg bg-black/50 text-white/80 backdrop-blur hover:text-white"
      >
        <Icon name="Pause" size={18} />
      </button>

      {paused && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onPointerDown={(e) => e.stopPropagation()}>
          <div className="w-full max-w-xs space-y-2.5 rounded-xl p-5 text-center panel-surface">
            <p className="font-display text-lg font-extrabold">Пауза</p>
            {!touch && <p className="text-xs text-muted-foreground">WASD — идти · Shift — быстрее · мышь — смотреть · E — осмотреть · H — руки</p>}
            <button type="button" onClick={lock} className="h-11 w-full rounded-lg font-bold text-primary-foreground btn-play-surface">
              Продолжить
            </button>
            <button type="button" onClick={onComplete} className="h-11 w-full rounded-lg text-sm font-semibold tile-surface">
              Пропустить 3D-сцену
            </button>
            <button type="button" onClick={onExit} className="h-11 w-full rounded-lg text-sm text-muted-foreground tile-surface">
              Выйти
            </button>
          </div>
        </div>
      )}

      {stage === 'explore' && !paused && !touch && !locked && ready && (
        <p className="pointer-events-none absolute inset-x-0 bottom-6 z-10 text-center text-xs text-white/50">
          Кликни, чтобы управлять взглядом
        </p>
      )}

      <div className={`pointer-events-none absolute inset-0 z-50 bg-black transition-opacity duration-[1600ms] ${fade ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default CryptExperience;
