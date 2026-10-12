import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import Icon from '@/components/ui/icon';
import { crypt, input, useCrypt } from '@/components/game/crypt3d/crypt-store';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';
import { LookPad } from '@/components/game/crypt3d/Joystick';
import { look } from '@/components/game/crypt3d/hands/hand-state';
import KeyTurn from '@/components/game/crypt3d/KeyTurn';
import KeysPanel from '@/components/game/crypt3d/KeysPanel';

type Props = {
  scene: ReactNode;
  overlay: ReactNode;
  ready: boolean;
  loading: string;
  accent: string;
  freeStages: string[];
  helpText: string;
  fade: boolean;
  onInteract: () => void;
  onHands?: () => void;
  onAdvance: () => void;
  onSkip: () => void;
  onExit: () => void;
};

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

export const isTouch = () => 'ontouchstart' in window || window.innerWidth < 900;

const Loader = ({ ready, text, accent }: { ready: boolean; text: string; accent: string }) => {
  const { progress } = useProgress();
  if (ready) return null;
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
      <p className="font-display text-lg italic text-white/80">{text}</p>
      <div className="mt-4 h-0.5 w-48 overflow-hidden rounded bg-white/10">
        <div className="h-full transition-all" style={{ width: `${progress}%`, background: accent }} />
      </div>
      <p className="mt-2 text-xs tabular-nums text-white/40">{Math.round(progress)}%</p>
    </div>
  );
};

const Shell3D = (p: Props) => {
  const touch = useMemo(isTouch, []);
  const webgl = useMemo(hasWebGL, []);
  const stage = useCrypt((s) => s.stage);
  const paused = useCrypt((s) => s.paused);
  const choosing = useCrypt((s) => s.choices.length > 0);
  const [locked, setLocked] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const lockedAt = useRef(0);
  const handlers = useRef(p);
  handlers.current = p;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
      input.keys.add(e.code);
      const s = crypt.get();
      if (s.choices.length && /^Digit[1-9]$/.test(e.code)) {
        const c = s.choices[Number(e.code.slice(5)) - 1];
        if (c) crypt.choose(c.id);
        return;
      }
      if (e.code === 'KeyE' && !s.lines.length) handlers.current.onInteract();
      if (e.code === 'KeyH') handlers.current.onHands?.();
      if (e.code === 'Enter' || e.code === 'Space') handlers.current.onAdvance();
      if (e.code === 'Escape') crypt.set({ paused: true });
    };
    const up = (e: KeyboardEvent) => input.keys.delete(e.code);
    const move = (e: MouseEvent) => {
      if (!document.pointerLockElement) return;
      look.lastInput = performance.now();
      input.look.dx += e.movementX;
      input.look.dy += e.movementY;
    };
    document.addEventListener('mousemove', move);
    const lockChange = () => {
      setLocked(!!document.pointerLockElement);
      if (document.pointerLockElement) lockedAt.current = performance.now();
      const s = crypt.get();
      if (!document.pointerLockElement && !s.choices.length && !s.paused && performance.now() - lockedAt.current > 300)
        crypt.set({ paused: true });
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    document.addEventListener('pointerlockchange', lockChange);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('pointerlockchange', lockChange);
      input.keys.clear();
      input.move.x = input.move.y = 0;
    };
  }, []);

  const lock = () => {
    cryptAudio.unlock();
    const s = crypt.get();
    if (s.choices.length) return;
    if (document.pointerLockElement) {
      if (s.lines.length) p.onAdvance();
      else p.onInteract();
      return;
    }
    if (!touch && !s.paused) wrap.current?.querySelector('canvas')?.requestPointerLock?.();
    if (s.paused) crypt.set({ paused: false });
  };

  if (!webgl)
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-black p-6 text-center">
        <p className="text-white/80">Твоё устройство не поддерживает 3D-графику.</p>
        <button type="button" onClick={p.onSkip} className="rounded-lg px-5 py-3 font-bold text-primary-foreground btn-play-surface">
          Продолжить текстом
        </button>
      </div>
    );

  return (
    <div ref={wrap} className="fixed inset-0 z-[60] bg-black" onPointerDown={lock}>
      <Canvas shadows dpr={[1, 1.75]} camera={{ fov: 68, near: 0.03, far: 80 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <Suspense fallback={null}>{p.scene}</Suspense>
        <KeyTurn />
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.85) 100%)' }}
      />
      <Loader ready={p.ready} text={p.loading} accent={p.accent} />
      {touch && !paused && !choosing && p.ready && (
        <div className="absolute inset-0 z-[1]">
          <LookPad />
        </div>
      )}
      {p.overlay}
      {!touch && p.ready && !paused && <KeysPanel />}

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => {
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
            {!touch && <p className="text-xs text-muted-foreground">{p.helpText}</p>}
            <button type="button" onClick={lock} className="h-11 w-full rounded-lg font-bold text-primary-foreground btn-play-surface">
              Продолжить
            </button>
            <button type="button" onClick={p.onSkip} className="h-11 w-full rounded-lg text-sm font-semibold tile-surface">
              Пропустить 3D-сцену
            </button>
            <button type="button" onClick={p.onExit} className="h-11 w-full rounded-lg text-sm text-muted-foreground tile-surface">
              Выйти
            </button>
          </div>
        </div>
      )}

      {!paused && !touch && !locked && !choosing && p.ready && stage !== 'leaving' && (
        <p className="pointer-events-none absolute inset-x-0 bottom-6 z-10 text-center text-xs text-white/50">
          Кликни, чтобы осматриваться мышью
        </p>
      )}

      <div className={`pointer-events-none absolute inset-0 z-50 bg-black transition-opacity duration-[1600ms] ${p.fade ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default Shell3D;
