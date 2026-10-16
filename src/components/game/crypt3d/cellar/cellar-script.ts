import * as THREE from 'three';
import { crypt, type Line } from '@/components/game/crypt3d/crypt-store';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';
import { companion } from '@/components/game/crypt3d/companion/companion';
import { CAGES, TABLE, CIRCLE, ALTAR, SHELF, STAIRS, HD } from '@/components/game/crypt3d/cellar/cellar-layout';

export type CellarResult = { flags: string[]; sanity: number; rep: number };

export type LedgerEntry = { name: string; age: string; note: string; status: 'dead' | 'alive' | 'gone' };

export const LEDGER: LedgerEntry[] = [
  { name: 'Агния, дочь мельника', age: '14 лет', note: 'держалась 4 дня. Пела. На пятый — замолчала.', status: 'dead' },
  { name: 'Тимон, подмастерье', age: '19 лет', note: 'Кровь — 3 сосуда. Бежал ночью, нашли у старого кладбища мёртвым. Записать: «отпущен к Единому».', status: 'dead' },
  { name: 'Ерема Кожух', age: '52 года', note: 'на третьем сосуде — бред. Звал жену.', status: 'dead' },
  { name: 'Вдова Ирмина', age: '61 год', note: 'смерть не побеждена.', status: 'dead' },
  { name: 'Лука, пастух', age: '33 года', note: 'жив. Держится. Повторить на новолуние.', status: 'alive' },
  { name: 'Безымянный, пришлый', age: '—', note: 'переведён «наверх». Пометка: «Избранный доволен».', status: 'gone' },
];

export type CSpot = { id: string; label: string; at: THREE.Vector3; radius: number; when: () => boolean };

const st = () => crypt.get();
const has = (id: string) => st().inspected.includes(id);
const mark = (id: string) => !has(id) && crypt.set({ inspected: [...st().inspected, id] });
const L = (who: Line['who'], text: string): Line => ({ who, text });

const clueIds = ['cage-1', 'cage-3', 'circle', 'tools', 'ledger', 'shelf', 'altar'];
const clues = () => clueIds.filter(has).length;

export const CSPOTS: CSpot[] = [
  { id: 'timon', label: 'Спросить Тимона', at: companion.head, radius: 0.55, when: () => st().stage === 'walk' && companion.timon },
  { id: 'ledger', label: 'Прочесть списки', at: new THREE.Vector3(TABLE.x - 0.1, TABLE.h, TABLE.z - 0.25), radius: 0.4, when: () => st().stage === 'walk' },
  { id: 'tools', label: 'Осмотреть инструменты', at: new THREE.Vector3(TABLE.x + 0.25, TABLE.h, TABLE.z + 0.45), radius: 0.4, when: () => st().stage === 'walk' },
  { id: 'circle', label: 'Осмотреть ритуальный круг', at: new THREE.Vector3(CIRCLE.x, 0.05, CIRCLE.z), radius: 0.9, when: () => st().stage === 'walk' },
  { id: 'cage-1', label: 'Заглянуть в клетку', at: new THREE.Vector3(CAGES[0].x, 0.8, CAGES[0].z), radius: 0.6, when: () => st().stage === 'walk' },
  { id: 'cage-2', label: 'Клетка с пленником', at: new THREE.Vector3(CAGES[1].x, 0.8, CAGES[1].z), radius: 0.6, when: () => st().stage === 'walk' && !has('freed') },
  { id: 'cage-3', label: 'Заглянуть в клетку', at: new THREE.Vector3(CAGES[2].x, 0.8, CAGES[2].z), radius: 0.6, when: () => st().stage === 'walk' },
  { id: 'shelf', label: 'Осмотреть сосуды', at: new THREE.Vector3(SHELF.x, 1.1, SHELF.z), radius: 0.6, when: () => st().stage === 'walk' },
  { id: 'altar', label: 'Осмотреть алтарь', at: new THREE.Vector3(ALTAR.x, ALTAR.h, ALTAR.z + 0.2), radius: 0.6, when: () => st().stage === 'walk' },
  { id: 'survivor', label: 'Поговорить с выжившим', at: new THREE.Vector3(CAGES[1].x + 0.9, 1.0, CAGES[1].z), radius: 0.6, when: () => st().stage === 'walk' && has('freed') && !has('talked') },
  { id: 'stairs', label: 'Лестница наверх', at: new THREE.Vector3(STAIRS.x, 1.2, HD - 1.3), radius: 0.7, when: () => st().stage === 'walk' },
];

let result: CellarResult = { flags: [], sanity: 0, rep: 0 };
export const cellarResult = () => result;

export function cellarReset() {
  result = { flags: [], sanity: 0, rep: 0 };
  crypt.set({ objective: 'Осмотри подвал. В клетках кто-то есть.' });
}

export const ledgerUi = { open: false, listeners: new Set<() => void>() };
export function setLedger(open: boolean) {
  ledgerUi.open = open;
  if (open) document.exitPointerLock?.();
  ledgerUi.listeners.forEach((f) => f());
}

function updateObjective() {
  if (has('talked')) return crypt.set({ objective: 'Поднимись по лестнице' });
  if (has('freed')) return crypt.set({ objective: 'Поговори с выжившим' });
  const n = clues();
  crypt.set({ objective: `Осмотри подвал (${n}/${clueIds.length}) · освободи пленника` });
}

function survivorTalk() {
  mark('talked');
  crypt.set({ stage: 'talk', objective: '' });
  crypt.say(
    [
      L('note', 'Он лёгкий, как ребёнок, хотя взрослый мужчина. Губы потрескались. Он долго пьёт из фляги Сариэла.'),
      L('soul', 'Они говорили, что так велел Единый.'),
      L('hero', 'Ты видел этого Единого?'),
      L('soul', 'Нет.'),
      L('hero', 'Кто отдавал приказ?'),
      L('note', 'Он молчит. Осколок на твоей груди становится тёплым.'),
    ],
    () =>
      crypt.ask(
        [
          { id: 'wait', label: 'Не давить. Просто ждать рядом', hint: 'Рассудок +3' },
          { id: 'press', label: '«Имя. Мне нужно имя»', hint: 'Рассудок −4' },
        ],
        (id) => {
          const done = () => {
            crypt.set({ stage: 'walk' });
            updateObjective();
          };
          if (id === 'wait') {
            result.flags.push('altar-hint');
            result.sanity += 3;
            crypt.say(
              [L('note', 'Через долгую минуту он шепчет:'), L('soul', 'Он приходил из-за алтаря. Не через дверь. Из-за алтаря.'), L('note', 'И больше ни слова.')],
              done,
            );
          } else {
            result.sanity -= 4;
            crypt.say([L('note', 'Он сжимается и начинает плакать.'), L('sariel', 'Не здесь.')], done);
          }
        },
      ),
  );
}

export function cellarInteract(id: string | null) {
  const sp = CSPOTS.find((s) => s.id === id);
  if (!sp || !sp.when()) return;
  if (id === 'timon') {
    if (!has('timon-cage')) {
      mark('timon-cage');
      result.flags.push('timon-remembers');
      result.sanity -= 2;
      crypt.say([
        L('timon', 'Третья клетка. Моя. Солома ещё примята — я лежал на левом боку, чтобы не видеть стол.'),
        L('timon', 'Главный приходил не по лестнице. Он выходил из-за алтаря. Я слышал, как скрипит камень.'),
        L('note', 'Нить между вами дрожит. Ему больно здесь — даже мёртвому.'),
      ]);
      if (!result.flags.includes('altar-hint')) result.flags.push('altar-hint');
      return;
    }
    crypt.say([L('timon', 'Вытащи того, кто ещё живой. Я не успел. Пусть хоть кто-то успеет.')]);
    return;
  }
  const first = !has(id!);
  if (clueIds.includes(id!)) mark(id!);

  if (id === 'ledger') {
    if (first) {
      cryptAudio.chime(330);
      crypt.set({ card: { kicker: 'Улика', title: 'Списки из-под часовни', text: 'Имена похищенных жителей и пометки об опытах над смертью.', icon: 'ListOrdered', color: '#d07a5f' } });
      result.sanity -= 3;
    }
    setLedger(true);
  }
  if (id === 'tools')
    crypt.say([
      L('note', 'Ножи, иглы, щипцы — разложены по размеру, вычищены до блеска. Так раскладывает инструмент мастер, который любит свою работу.'),
      L('note', 'Рядом — кожаный жгут, протёртый в одном месте. Его затягивали много раз.'),
    ]);
  if (id === 'circle')
    crypt.say([
      L('note', 'Два круга, один поверх другого. Старый — бурый, стёртый. Новый — начерчен известью, свежо, ровно.'),
      L('note', 'Знаки не церковные. Ты узнаёшь их — так когда-то запирали души, чтобы те не ушли.'),
      L('hero', 'Они не лечили. Они держали.'),
    ]);
  if (id === 'cage-1') crypt.say([L('note', 'Девочка. Совсем маленькая. Руки связаны над головой. Холодная.'), L('note', 'На запястье — тот же аккуратный надрез, что у Тимона.')]);
  if (id === 'cage-3')
    crypt.say([
      L('note', 'Пусто. Солома примята. На полу — обрывок бумаги: «переведён наверх».'),
      ...(companion.timon ? [L('timon', 'Здесь сидел я. А «наверх» — это не наверх. Это за алтарь.')] : []),
    ]);
  if (id === 'shelf')
    crypt.say([
      L('note', 'Склянки с тёмным осадком. На каждой — бирка с именем и числом. «Агния — 3». «Тимон — 3». «Ерема — 4».'),
      L('note', 'Они не выливали. Они хранили.'),
    ]);
  if (id === 'altar') {
    crypt.say(
      has('altar-hint') || result.flags.includes('altar-hint')
        ? [L('note', 'Ты проводишь рукой по боковой стенке. Шов. Тонкий, как волос. Из-за алтаря тянет сквозняком.')]
        : [L('note', 'Белое полотно, золотой круг со шпилем — знак секты. Самое чистое место в этом подвале, вычищенное до блеска среди крови. От этого только страшнее.')],
    );
  }
  if (id === 'cage-2') {
    if (first) {
      mark('cage-2');
      crypt.say([L('note', 'Мужчина. Связан. Грудь поднимается — еле-еле. Он жив.'), L('sariel', 'Замок простой. Открывай.')]);
    } else {
      mark('freed');
      result.flags.push('freed-captives');
      result.rep += 1;
      cryptAudio.chime(440);
      crypt.say([L('note', 'Засов поддаётся со скрежетом. Ты режешь верёвки. Он не сопротивляется — у него нет сил.')]);
    }
  }
  if (id === 'survivor') {
    survivorTalk();
    return;
  }
  if (id === 'stairs') {
    if (!has('talked')) {
      crypt.say([L('sariel', has('freed') ? 'Сначала выслушай его. Мёртвые подождут — живые нет.' : 'Ты оставишь их здесь?')]);
      return;
    }
    crypt.set({ stage: 'leaving' });
    return;
  }
  updateObjective();
}
