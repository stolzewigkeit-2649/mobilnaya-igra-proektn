import * as THREE from 'three';
import { crypt, type CryptState, type Line } from '@/components/game/crypt3d/crypt-store';
import { SARCOPHAGI, PUDDLE, DOOR, HALF_D } from '@/components/game/crypt3d/layout';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';

export type Spot = {
  id: string;
  label: string;
  at: THREE.Vector3;
  radius: number;
  lines: Line[];
  counts?: boolean;
};

export const SPOTS: Spot[] = [
  ...SARCOPHAGI.map((s, i) => ({
    id: `sarc-${i}`,
    label: 'Осмотреть саркофаг',
    at: new THREE.Vector3(s.x, 0.7, s.z),
    radius: 1.1,
    counts: true,
    lines: [
      { who: 'note' as const, text: `На крышке выбито: «${s.name}». Ниже — «спит до суда».` },
      {
        who: 'note' as const,
        text:
          i % 2 === 0
            ? 'Пыль на крышке стёрта ладонями. Кто-то приходил сюда недавно — и не за покойником.'
            : 'Шов между крышкой и коробом залит свежим воском. Белым. Не синим, как свечи здесь.',
      },
    ],
  })),
  {
    id: 'puddle',
    label: 'Посмотреть в воду',
    at: new THREE.Vector3(PUDDLE.x, 0.1, PUDDLE.z),
    radius: 1.3,
    counts: true,
    lines: [
      { who: 'note', text: 'В чёрной воде отражаются синие огни и чьё-то лицо. Твоё. Ты его не узнаёшь.' },
      { who: 'note', text: 'Капля падает, отражение дрожит — и на миг кажется, что за твоим плечом стоит кто-то ещё.' },
    ],
  },
  {
    id: 'candle',
    label: 'Коснуться свечи',
    at: new THREE.Vector3(-1.7, 0.6, 0.6),
    radius: 0.9,
    counts: true,
    lines: [
      { who: 'note', text: 'Огонь холодный. Ни тепла, ни запаха воска. Он не жжёт пальцы — он их узнаёт.' },
    ],
  },
  {
    id: 'altar',
    label: 'Осмотреть алтарь',
    at: new THREE.Vector3(0, 1.0, 0),
    radius: 1.2,
    counts: true,
    lines: [
      { who: 'note', text: 'Камень отполирован телами. На нём — вмятина по форме спины. Твоей спины. Очень старая.' },
    ],
  },
  {
    id: 'exit',
    label: 'Подняться наверх',
    at: new THREE.Vector3(0, 1.3, -HALF_D + 0.2),
    radius: DOOR.w * 0.7,
    lines: [{ who: 'note', text: 'Ступени уходят в темноту. Ещё рано. Сначала — она.' }],
  },
];

const ray = new THREE.Ray();
const dir = new THREE.Vector3();
const toSpot = new THREE.Vector3();

export function pickFocus(camera: THREE.Camera, s: CryptState): string | null {
  camera.getWorldDirection(dir);
  ray.set(camera.position, dir);
  let best: string | null = null;
  let bestD = Infinity;
  for (const sp of SPOTS) {
    const dist = toSpot.copy(sp.at).sub(camera.position).length();
    if (dist > 2.4 + sp.radius) continue;
    const off = ray.distanceToPoint(sp.at);
    if (off < sp.radius * 0.75 && dist < bestD) {
      best = sp.id;
      bestD = dist;
    }
  }
  if (best === 'exit' && s.stage === 'gift') return 'exit';
  return best;
}

const HECATE_LINES: Line[] = [
  { who: 'hecate', text: 'Та, кто знает, куда уходят мёртвые.' },
  { who: 'hecate', text: 'И та, кто знает, сколько лжи живые способны придумать.' },
];

const HECATE_TAIL: Line[] = [
  { who: 'note', text: 'Геката улыбается — всеми тремя лицами по очереди.' },
  { who: 'hecate', text: 'Много раз.' },
  { who: 'hecate', text: 'И ещё умрёшь.' },
  { who: 'hecate', text: 'Но пока твоя работа не закончена, смерть будет возвращать тебя обратно.' },
];

let summonPending = false;

function summon() {
  summonPending = false;
  setTimeout(() => {
    const s = crypt.get();
    if (s.stage !== 'explore') return;
    const looked = s.inspected.includes('hands');
    cryptAudio.whisper(true);
    crypt.set({ stage: 'hecate', objective: '', looking: false });
    crypt.say([...HECATE_LINES, ...(looked ? [] : [{ who: 'hero' as const, text: 'Я умер?' }]), ...HECATE_TAIL]);
  }, 900);
}

function maybeSummon() {
  const s = crypt.get();
  if (s.stage !== 'explore') return;
  const looked = s.inspected.includes('hands');
  const count = s.inspected.filter((i) => i !== 'hands').length;
  if ((looked && count >= 1) || count >= 3) summonPending = true;
}

export function interact(id: string | null) {
  const s = crypt.get();
  if (!id) return;
  if (id === 'exit' && s.stage === 'gift') {
    crypt.set({ stage: 'leaving' });
    return;
  }
  const sp = SPOTS.find((x) => x.id === id);
  if (!sp) return;
  crypt.say(sp.lines);
  if (sp.counts && !s.inspected.includes(id)) crypt.set({ inspected: [...s.inspected, id] });
  maybeSummon();
}

export function lookAtHands() {
  const s = crypt.get();
  if (s.stage !== 'explore' && s.stage !== 'gift') return;
  const on = !s.looking;
  crypt.set({ looking: on });
  if (on && !s.inspected.includes('hands')) {
    crypt.set({ inspected: [...s.inspected, 'hands'] });
    crypt.say([
      { who: 'note', text: 'Руки твои. Но кожа на них новая, как после долгой болезни.' },
      { who: 'hero', text: 'Я умер?' },
    ]);
    maybeSummon();
  }
}

export function resetSummon() {
  summonPending = false;
}

export function advanceLine() {
  const s = crypt.get();
  if (!crypt.advance()) return;
  if (summonPending && s.stage === 'explore') summon();
  if (s.stage === 'hecate') {
    cryptAudio.whisper(false);
    cryptAudio.chime(392);
    crypt.set({
      stage: 'gift',
      objective: 'Выйди наверх по лестнице',
      card: {
        kicker: 'Получено',
        title: 'Бессмертие некроманта',
        text: 'Смерть будет возвращать тебя обратно. Но каждый раз — забирая часть рассудка.',
        icon: 'Infinity',
        color: '#c9a6ff',
      },
    });
  }
}
