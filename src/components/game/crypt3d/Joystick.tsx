import { useRef, useState } from 'react';
import { input } from '@/components/game/crypt3d/crypt-store';

const R = 52;

export const Joystick = () => {
  const [knob, setKnob] = useState({ x: 0, y: 0, on: false });
  const origin = useRef({ x: 0, y: 0 });
  const id = useRef<number | null>(null);

  const update = (cx: number, cy: number) => {
    let dx = cx - origin.current.x;
    let dy = cy - origin.current.y;
    const d = Math.hypot(dx, dy);
    if (d > R) {
      dx = (dx / d) * R;
      dy = (dy / d) * R;
    }
    setKnob({ x: dx, y: dy, on: true });
    input.move.x = dx / R;
    input.move.y = -dy / R;
  };

  const end = () => {
    id.current = null;
    setKnob({ x: 0, y: 0, on: false });
    input.move.x = 0;
    input.move.y = 0;
  };

  return (
    <div
      className="absolute bottom-6 left-5 h-36 w-36 touch-none select-none"
      onPointerDown={(e) => {
        id.current = e.pointerId;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        const r = e.currentTarget.getBoundingClientRect();
        origin.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => e.pointerId === id.current && update(e.clientX, e.clientY)}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div className="absolute inset-0 rounded-full border border-white/15 bg-white/5 backdrop-blur-[2px]" />
      <div
        className={`absolute left-1/2 top-1/2 h-14 w-14 rounded-full border border-white/30 transition-colors ${
          knob.on ? 'bg-white/30' : 'bg-white/15'
        }`}
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
};

export const LookPad = () => {
  const last = useRef<{ id: number; x: number; y: number } | null>(null);
  return (
    <div
      className="absolute inset-y-0 right-0 w-[55%] touch-none"
      onPointerDown={(e) => {
        last.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const l = last.current;
        if (!l || l.id !== e.pointerId) return;
        input.look.dx += (e.clientX - l.x) * 1.6;
        input.look.dy += (e.clientY - l.y) * 1.6;
        last.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => (last.current = null)}
      onPointerCancel={() => (last.current = null)}
    />
  );
};
