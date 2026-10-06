type Ctx = {
  ac: AudioContext;
  out: GainNode;
  wet: GainNode;
  drone: GainNode;
};

let ctx: Ctx | null = null;
let volume = 0.8;
let whisperNode: { stop: () => void } | null = null;

function impulse(ac: AudioContext, seconds: number, decay: number) {
  const len = ac.sampleRate * seconds;
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function noiseBuffer(ac: AudioContext, seconds: number) {
  const buf = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function startDrone(c: Ctx) {
  const lp = c.ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 180;
  lp.connect(c.drone);
  [41, 41.6, 61.8].forEach((f, i) => {
    const o = c.ac.createOscillator();
    o.type = i === 2 ? 'sine' : 'sawtooth';
    o.frequency.value = f;
    const g = c.ac.createGain();
    g.gain.value = i === 2 ? 0.25 : 0.12;
    o.connect(g).connect(lp);
    o.start();
  });
  const lfo = c.ac.createOscillator();
  lfo.frequency.value = 0.07;
  const lg = c.ac.createGain();
  lg.gain.value = 60;
  lfo.connect(lg).connect(lp.frequency);
  lfo.start();
}

export const cryptAudio = {
  setVolume(v: number) {
    volume = v;
    if (ctx) ctx.out.gain.value = v;
  },
  unlock() {
    if (ctx) {
      if (ctx.ac.state === 'suspended') ctx.ac.resume();
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    const out = ac.createGain();
    out.gain.value = volume;
    out.connect(ac.destination);
    const conv = ac.createConvolver();
    conv.buffer = impulse(ac, 3.6, 2.6);
    const wet = ac.createGain();
    wet.gain.value = 0.55;
    wet.connect(conv).connect(out);
    const drone = ac.createGain();
    drone.gain.value = 0;
    drone.connect(out);
    drone.connect(wet);
    drone.gain.linearRampToValueAtTime(0.32, ac.currentTime + 4);
    ctx = { ac, out, wet, drone };
    startDrone(ctx);
  },
  drip() {
    if (!ctx) return;
    const { ac, out, wet } = ctx;
    const t = ac.currentTime;
    const o = ac.createOscillator();
    o.type = 'sine';
    const f = 900 + Math.random() * 900;
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 2.2, t + 0.05);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g);
    g.connect(out);
    g.connect(wet);
    o.start(t);
    o.stop(t + 0.15);
  },
  step() {
    if (!ctx) return;
    const { ac, out, wet } = ctx;
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 0.12);
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 380 + Math.random() * 220;
    bp.Q.value = 0.9;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
    src.connect(bp).connect(g);
    g.connect(out);
    g.connect(wet);
    src.start(t);
  },
  chime(freq = 523) {
    if (!ctx) return;
    const { ac, out, wet } = ctx;
    const t = ac.currentTime;
    [1, 2.01, 2.76, 4.07].forEach((m, i) => {
      const o = ac.createOscillator();
      o.frequency.value = freq * m;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18 / (i + 1), t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5 / (i + 1));
      o.connect(g);
      g.connect(out);
      g.connect(wet);
      o.start(t);
      o.stop(t + 4);
    });
  },
  whisper(on: boolean) {
    if (!ctx) return;
    if (!on) {
      whisperNode?.stop();
      whisperNode = null;
      return;
    }
    if (whisperNode) return;
    const { ac, wet } = ctx;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac, 2);
    src.loop = true;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1400;
    bp.Q.value = 6;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 3.3;
    const lg = ac.createGain();
    lg.gain.value = 700;
    lfo.connect(lg).connect(bp.frequency);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.linearRampToValueAtTime(0.16, ac.currentTime + 2);
    src.connect(bp).connect(g).connect(wet);
    src.start();
    lfo.start();
    whisperNode = {
      stop: () => {
        g.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 1.5);
        setTimeout(() => {
          try {
            src.stop();
            lfo.stop();
          } catch {
            return;
          }
        }, 1600);
      },
    };
  },
  close() {
    whisperNode = null;
    ctx?.ac.close();
    ctx = null;
  },
};
