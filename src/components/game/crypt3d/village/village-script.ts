import * as THREE from 'three';
import { crypt, type Line } from '@/components/game/crypt3d/crypt-store';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';
import { BARN, BODIES, CART, CHAPEL_DOOR, PREACHER, SARIEL_POST, VILLAGER, WELL, WIDOWER } from '@/components/game/crypt3d/village/village-layout';

export type VillageResult = { flags: string[]; sanity: number; health: number; evidence: string[]; rep: Record<string, number>; done: boolean };

export type VSpot = { id: string; label: string; at: THREE.Vector3; radius: number; when: () => boolean };

const st = () => crypt.get();
const has = (id: string) => st().inspected.includes(id);
const mark = (id: string) => !has(id) && crypt.set({ inspected: [...st().inspected, id] });
const L = (who: Line['who'], text: string): Line => ({ who, text });
const walk = () => st().stage === 'walk';

const CLUES = ['clue-lime', 'clue-cart', 'clue-chapel'];

export const VSPOTS: VSpot[] = [
  { id: 'villager', label: 'Заговорить с женщиной', at: new THREE.Vector3(VILLAGER.x, 1.5, VILLAGER.z), radius: 0.6, when: () => walk() && !has('villager') },
  { id: 'preacher', label: 'Подойти к проповеднику', at: new THREE.Vector3(PREACHER.x, 2.0, PREACHER.z), radius: 0.6, when: () => walk() },
  { id: 'widower', label: 'Поговорить со стариком', at: new THREE.Vector3(WIDOWER.x, 1.5, WIDOWER.z), radius: 0.6, when: () => walk() && !has('widower') },
  { id: 'sariel', label: 'Спросить Сариэла', at: new THREE.Vector3(SARIEL_POST.x, 1.6, SARIEL_POST.z), radius: 0.6, when: walk },
  ...BODIES.map((b, i) => ({
    id: `body-${i}`,
    label: i === 2 ? 'Откинуть полотно с женщины' : i === 4 ? 'Откинуть полотно с девушки' : 'Откинуть полотно',
    at: new THREE.Vector3(b.x, 0.45, b.z),
    radius: 0.55,
    when: () => walk() && !has(`body-${i}`),
  })),
  { id: 'letter', label: 'Достать бумагу из рукава', at: new THREE.Vector3(BODIES[4].x + 0.24, 0.4, BODIES[4].z + 0.25), radius: 0.35, when: () => walk() && has('girl-spoke') && !has('letter') },
  { id: 'tracks', label: 'Осмотреть колею', at: new THREE.Vector3(BARN.x - BARN.w / 2 - 1, 0.1, BARN.z - 1.2), radius: 0.8, when: () => walk() && !has('tracks') },
  { id: 'cart', label: 'Осмотреть телегу', at: new THREE.Vector3(CART.x, 0.8, CART.z), radius: 0.9, when: () => walk() && !has('cart') },
  { id: 'well', label: 'Заглянуть в колодец', at: new THREE.Vector3(WELL.x, 0.7, WELL.z), radius: 0.7, when: () => walk() && !has('well') },
  { id: 'chapel', label: 'Войти в часовню', at: new THREE.Vector3(CHAPEL_DOOR.x, 1.5, CHAPEL_DOOR.z), radius: 0.9, when: walk },
];

let result: VillageResult = { flags: [], sanity: 0, health: 0, evidence: [], rep: {}, done: false };
export const villageResult = () => result;

const flag = (f: string) => !result.flags.includes(f) && result.flags.push(f);
const clues = () => CLUES.filter((c) => result.flags.includes(c)).length + (result.evidence.includes('letter') ? 1 : 0);

function updateObjective() {
  if (result.evidence.includes('letter') || CLUES.every((c) => result.flags.includes(c)))
    return crypt.set({ objective: 'Под часовней что-то есть. Войди в неё ночью' });
  crypt.set({ objective: `Найди, где на самом деле умерли жертвы · следы ${clues()}/3` });
}

const card = (title: string, text: string, icon = 'Search', color = '#d8c89a') => {
  cryptAudio.chime(587);
  crypt.set({ card: { kicker: 'Новый след', title, text, icon, color } });
};

export function villageReset() {
  result = { flags: [], sanity: 0, health: 0, evidence: [], rep: {}, done: false };
  crypt.set({ objective: '' });
}

export function villageIntro() {
  crypt.set({ stage: 'talk' });
  cryptAudio.chime(659);
  crypt.say(
    [
      L('note', 'Овражье встречает вас колоколом — не набатом, праздничным перезвоном. Между столбами на площади висят белые ленты.'),
      L('note', 'За неделю здесь умерли пятеро. Деревня называет это благодатью.'),
      L('preacher', 'Входите, путники! Сегодня у нас праздник: пятеро наших ушли к Богу за всех нас.'),
      L('sariel', '(тихо) Голос у него ласковый. А глаза — нет. Тела в амбаре, справа. Я буду там.'),
    ],
    () => {
      crypt.set({ stage: 'walk' });
      updateObjective();
    },
  );
}

function soulOfGirl() {
  mark('girl-spoke');
  result.sanity -= 10;
  cryptAudio.whisper(true);
  crypt.set({ grey: true });
  crypt.say(
    [
      L('note', 'Ты кладёшь ладонь ей на лоб. Девушка открывает глаза и кричит — без звука.'),
      L('soul', 'Холодно… под полом… там темно…'),
      L('soul', 'Они пели, пока резали. Пели красиво.'),
      L('note', 'Её рука падает. Из рукава выглядывает сложенный клочок бумаги.'),
    ],
    () => {
      cryptAudio.whisper(false);
      crypt.set({ grey: false });
      flag('clue-under');
    },
  );
}

function preacher() {
  if (!has('preacher')) {
    mark('preacher');
    crypt.say([
      L('preacher', 'Вы не здешние. Паломники?'),
      L('hero', 'Вроде того. Отчего умерли эти пятеро?'),
      L('preacher', 'Они отдали себя добровольно. Страх — это лишь доказательство веры, сын мой. Они его преодолели.'),
      L('note', 'Он улыбается. На пальце — перстень с крестом. Он постукивает им по перилам, когда молчит.'),
      L('preacher', 'Вечером проповедь. Приходите. Узнаете больше.'),
    ]);
    flag('met-preacher');
    return;
  }
  if (!result.flags.includes('clue-chapel')) {
    crypt.ask(
      [
        { id: 'pray', label: '«Хочу помолиться внутри»', hint: 'Попытаться заглянуть в часовню' },
        { id: 'leave', label: 'Отойти' },
      ],
      (id) => {
        if (id !== 'pray') return;
        flag('clue-chapel');
        result.health -= 6;
        cryptAudio.chime(880);
        crypt.say(
          [
            L('preacher', 'Только притвор, сын мой. Дальше — для посвящённых.'),
            L('note', 'Под ногами — свежая известь, замазанная половица. Сариэл за твоей спиной тихо звонит в колокол.'),
            L('note', 'Звук уходит вниз и не возвращается. Там пусто. И глубоко.'),
            L('note', 'Проповедник берёт тебя под локоть — пальцы как клещи. Синяк останется.'),
          ],
          () => {
            card('Пустота под часовней', 'Колокол Сариэла не вернул эха: под полом часовни — большая полость.', 'BellRing');
            updateObjective();
          },
        );
      },
    );
    return;
  }
  crypt.say([L('preacher', 'До вечера, путники. Бог всё видит.')]);
}

export function villageInteract(id: string | null) {
  const sp = VSPOTS.find((s) => s.id === id);
  if (!sp || !sp.when()) return;

  if (id === 'villager') {
    mark('villager');
    crypt.say([
      L('villager', 'Это была воля Бога. Они ушли за нас всех.'),
      L('hero', 'Ты их знала?'),
      L('villager', 'Агафью — с детства. Она так боялась темноты, что спала со свечой… А теперь ей не страшно.'),
      L('note', 'Она теребит белую ленту на запястье. Пальцы дрожат.'),
    ]);
    return;
  }

  if (id === 'preacher') return preacher();

  if (id === 'widower') {
    mark('widower');
    flag('clue-night');
    result.rep.exiles = (result.rep.exiles ?? 0) + 1;
    crypt.say(
      [
        L('note', 'Старик опирается на палку у порога. Оглядывается на часовню, прежде чем заговорить.'),
        L('widower', 'Моя Марфа не хотела «уходить за всех». Её увели ночью. «На беседу».'),
        L('widower', 'Утром принесли. Уже накрытую. А я её даже не…'),
        L('note', 'Он замолкает. Отворачивается к стене.'),
      ],
      () => card('Ночные беседы', 'Жертв уводили ночью «на беседу» — не добровольно.', 'Moon', '#c9b79a'),
    );
    return;
  }

  if (id === 'sariel') {
    const n = clues();
    crypt.say(
      n === 0
        ? [L('sariel', 'Смотри на мёртвых, не на живых. Живые врут охотнее.')]
        : n < 3
          ? [L('sariel', `Неплохо. Следов: ${n}. Мне нужно три, чтобы поверить, что это не совпадение.`)]
          : [L('sariel', 'Хватит. Всё ведёт под часовню. Пойдём, пока проповедник не понял, кто мы.')],
    );
    return;
  }

  if (id?.startsWith('body-')) {
    const i = Number(id.slice(5));
    mark(id);
    if (!has('bodies')) {
      mark('bodies');
      result.sanity -= 3;
      crypt.say([
        L('note', 'Ты откидываешь полотно. У всех пятерых одинаковые порезы на запястьях. На груди — один и тот же знак.'),
        L('note', 'Порезы сделаны одним ножом, одной рукой. Знак кривой — вырезан после смерти: кровь не шла.'),
      ]);
    }
    if (i === 2) {
      flag('clue-lime');
      crypt.say(
        [L('note', 'Под ногтями у женщины — белая известковая пыль. В деревне нигде нет извести. Нигде, кроме…')],
        () => {
          card('Известь под ногтями', 'Женщина царапала известковую стену перед смертью. Извести в деревне нет.', 'Fingerprint');
          updateObjective();
        },
      );
    }
    if (i === 4) {
      crypt.say(
        [L('note', 'Совсем молодая. Губы искусаны. Рука прижата к груди, будто она что-то прячет.')],
        () =>
          crypt.ask(
            [
              { id: 'call', label: 'Позвать её душу', hint: 'Речь с мёртвыми. Она была напугана — это тяжело (−10 рассудка).' },
              { id: 'no', label: 'Оставить её в покое' },
            ],
            (c) => {
              if (c === 'call') soulOfGirl();
              else crypt.say([L('note', 'Ты накрываешь её обратно. Рука под полотном всё ещё прижата к груди.')], () => mark('girl-spoke'));
            },
          ),
      );
    }
    return;
  }

  if (id === 'letter') {
    mark('letter');
    result.evidence.push('letter');
    crypt.say(
      [L('note', '«Если со мной что-нибудь случится, ищите под часовней». Почерк дрожит.')],
      () => {
        card('Письмо из рукава', '«Если со мной что-нибудь случится, ищите под часовней».', 'Mail', '#e8d8b0');
        updateObjective();
      },
    );
    return;
  }

  if (id === 'tracks') {
    mark('tracks');
    flag('clue-cart');
    crypt.say(
      [L('note', 'От амбара — свежая колея. Тележная, ночная. Возили тяжёлое. Не по дороге, а задами, через огороды.'), L('note', 'Колея светится в твоих глазах бледно-зелёным: мёртвые оставляют след. Она ведёт к часовне.')],
      () => {
        card('Ночная колея', 'Телега ходила от амбара к часовне — задворками, по ночам.', 'Footprints');
        updateObjective();
      },
    );
    return;
  }

  if (id === 'cart') {
    mark('cart');
    crypt.say([L('note', 'Телега у боковой стены часовни. На дне — белое полотно, такое же, как в амбаре. И белые пятна на досках: известь.')]);
    if (!result.flags.includes('clue-cart')) {
      flag('clue-cart');
      card('Телега у часовни', 'На досках — известь и полотно. Тела возили отсюда.', 'Truck');
      updateObjective();
    }
    return;
  }

  if (id === 'well') {
    mark('well');
    crypt.say([L('note', 'Вода чёрная, неподвижная. В ней отражается колокольня — и ты. Над твоим плечом на миг отражается кто-то третий. Ты оборачиваешься. Никого.')]);
    result.sanity -= 2;
    return;
  }

  if (id === 'chapel') {
    const ready = result.evidence.includes('letter') || CLUES.every((c) => result.flags.includes(c));
    if (!ready) {
      crypt.say([
        L('preacher', 'Проповедь вечером, сын мой. Сейчас часовня закрыта.'),
        L('sariel', '(тихо) Нам нужно больше, чем подозрение. Найди, откуда возили тела.'),
      ]);
      return;
    }
    if (!result.evidence.includes('letter')) result.evidence.push('letter');
    result.done = true;
    crypt.set({ stage: 'talk', objective: '' });
    crypt.say(
      [
        L('note', 'Вы ждёте темноты за колодцем. Последний прихожанин уходит. Огни в окнах гаснут один за другим.'),
        L('sariel', 'Известь, колея, пустота под полом. Их убивали не в домах.'),
        L('note', 'Дверь часовни не заперта. Внутри пахнет воском и железом. Под третьей скамьёй — половица, замазанная известью.'),
      ],
      () => crypt.set({ stage: 'leaving' }),
    );
  }
}
