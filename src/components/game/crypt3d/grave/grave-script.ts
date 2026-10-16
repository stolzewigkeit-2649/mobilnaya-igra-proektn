import * as THREE from 'three';
import { crypt, type Line } from '@/components/game/crypt3d/crypt-store';
import { cryptAudio } from '@/components/game/crypt3d/use-crypt-audio';
import { setTimon } from '@/components/game/crypt3d/companion/companion';
import { BODY, SARIEL_SPOT, CRYPT_DOOR, GRAVES, GATE } from '@/components/game/crypt3d/grave/grave-layout';

export type GraveResult = { flags: string[]; sanity: number; cloth: boolean };

export type GSpot = { id: string; label: string; at: THREE.Vector3; radius: number; when: () => boolean };

const st = () => crypt.get();
const has = (id: string) => st().inspected.includes(id);
const mark = (id: string) => !has(id) && crypt.set({ inspected: [...st().inspected, id] });

const nearGrave = GRAVES.reduce((a, g) => (Math.hypot(g.x + 3, g.z - 4) < Math.hypot(a.x + 3, a.z - 4) ? g : a));

export const GSPOTS: GSpot[] = [
  { id: 'body', label: 'Осмотреть тело', at: new THREE.Vector3(BODY.x, 0.25, BODY.z + 0.3), radius: 0.9, when: () => st().stage === 'walk' && !has('body') },
  { id: 'call', label: 'Позвать душу', at: new THREE.Vector3(BODY.x, 0.3, BODY.z + 0.3), radius: 0.9, when: () => st().stage === 'walk' && has('body') && !has('called') },
  { id: 'cloth', label: 'Поднять лоскут', at: new THREE.Vector3(BODY.x + 0.5, 0.05, BODY.z + 0.2), radius: 0.7, when: () => has('cloth-seen') && !has('cloth') },
  { id: 'sariel', label: 'Говорить с Сариэлом', at: new THREE.Vector3(SARIEL_SPOT.x, 1.6, SARIEL_SPOT.z), radius: 0.6, when: () => st().stage === 'sariel' },
  { id: 'grave', label: 'Прочесть надпись', at: new THREE.Vector3(nearGrave.x, 0.6, nearGrave.z), radius: 0.6, when: () => st().stage === 'walk' },
  { id: 'gate', label: 'Выйти к деревне', at: new THREE.Vector3(GATE.x, 1.1, GATE.z + 0.4), radius: 1.3, when: () => ['walk', 'follow'].includes(st().stage) },
  { id: 'crypt', label: 'Вернуться в склеп', at: new THREE.Vector3(CRYPT_DOOR.x, 1, CRYPT_DOOR.z), radius: 1, when: () => st().stage === 'walk' },
];

let result: GraveResult = { flags: [], sanity: 0, cloth: false };
export const graveResult = () => result;

export function graveReset() {
  result = { flags: [], sanity: 0, cloth: false };
  setTimon(false);
  crypt.set({ objective: 'Найди того, кто лежит между надгробиями' });
}

const L = (who: Line['who'], text: string): Line => ({ who, text });

function soulScene() {
  mark('called');
  result.sanity -= 4;
  cryptAudio.whisper(true);
  crypt.set({ stage: 'soul', grey: true, objective: '' });
  crypt.say(
    [
      L('note', 'Звук уходит. Капли с надгробных столбов повисают в воздухе. Цвета выцветают в серое.'),
      L('soul', 'Я… не должен был здесь оказаться…'),
      L('hero', 'Кто это сделал?'),
      L('soul', 'Люди в белом. Пришли в деревню с «милосердием». Сказали, что спасут меня от лихорадки.'),
      L('soul', 'Отвели в подвал под часовней. Там клетки. И другие — из Овражья. Мы слышали, как они поют, когда режут.'),
      L('soul', 'Потом сказали, что мой страх — доказательство веры. И забрали кровь. Три сосуда.'),
      L('soul', 'Я вырвался. Добежал досюда. Дальше не помню.'),
      L('note', 'Он начинает таять с краёв, как иней на стекле.'),
    ],
    () =>
      crypt.ask(
        [
          { id: 'name', label: '«Как тебя зовут?»' },
          { id: 'let', label: 'Отпустить его', hint: 'Он уйдёт навсегда. Правду придётся искать без него.' },
        ],
        (id) => {
          if (id === 'let') return letGo();
          result.flags.push('named-first');
          crypt.say(
            [
              L('soul', 'Тимон. Сын кожевника из Овражья. Мать… она до сих пор думает, что я ушёл «к Единому».'),
              L('soul', 'Я не хочу уходить так. Не зная, зачем им была моя кровь.'),
            ],
            () =>
              crypt.ask(
                [
                  { id: 'raise', label: 'Вернуть душу в тело: «Встань. Найдём правду вместе»', hint: 'Некромантия. Тяжело для рассудка (−10). Тимон пойдёт с тобой.' },
                  { id: 'let', label: '«Иди с миром. Я расскажу твоей матери»' },
                ],
                (c) => (c === 'raise' ? raiseTimon() : letGo()),
              ),
          );
        },
      ),
  );
}

function letGo() {
  crypt.say([L('soul', 'Скажи матери…'), L('note', 'И его больше нет.')], () => {
    cryptAudio.whisper(false);
    crypt.set({ stage: 'walk', grey: false, objective: 'Подними то, что он держал в руке' });
    mark('cloth-seen');
    crypt.say([L('note', 'Мир возвращает цвет. В разжатых пальцах мертвеца белеет клочок ткани.')]);
  });
}

function raiseTimon() {
  result.sanity -= 10;
  result.flags.push('timon-raised');
  mark('timon');
  cryptAudio.whisper(false);
  cryptAudio.chime(247);
  crypt.set({ grey: false });
  setTimon(true, new THREE.Vector3(BODY.x, 0, BODY.z), true);
  crypt.say(
    [
      L('note', 'Ты не отпускаешь душу — ты тянешь её обратно. Вниз, в остывшее тело. Пальцы сводит холодом.'),
      L('note', 'Мертвец вздрагивает. Грудь поднимается — не дыханием, привычкой. В глазах загорается бледно-зелёный огонь.'),
      L('note', 'Тимон садится. Смотрит на свои руки. Потом — на тебя.'),
      L('soul', 'Я… здесь. Холодно, но не больно. Я помню всё — и подвал, и лица.'),
      L('soul', 'Ты меня держишь. Я чувствую нить. Пока она есть — я с тобой.'),
      L('note', 'Он разжимает кулак. На ладони — белый лоскут с золотой нитью.'),
      L('soul', 'Это я сорвал с одного из них. Возьми. Пусть будет первым.'),
    ],
    () => {
      mark('cloth');
      result.cloth = true;
      cryptAudio.chime(587);
      crypt.set({
        stage: 'walk',
        objective: '',
        card: { kicker: 'Новый спутник', title: 'Тимон, поднятый', text: 'Жертва секты · помнит подвал и лица · чует следы мёртвых · идёт за тобой, пока держится нить', icon: 'Skull', color: '#7dffb0' },
      });
      window.setTimeout(() => {
        crypt.set({ card: { kicker: 'Первая улика', title: 'Белый фрагмент одежды', text: 'Лоскут тонкого белого полотна с золотой нитью. Тимон сорвал его с рясы сектанта.', icon: 'Shirt', color: '#d8c89a' } });
        window.setTimeout(sarielArrive, 3200);
      }, 4200);
    },
  );
}

function sarielArrive() {
  cryptAudio.chime(880);
  crypt.set({ stage: 'sariel', objective: 'Кто-то стоит между надгробиями' });
  crypt.say([L('note', 'Звон — тонкий, как от стекла. Ты оборачиваешься.')]);
}

function sarielTalk() {
  crypt.set({ stage: 'talk', objective: '' });
  crypt.say(
    [
      L('note', 'Высокий, бледный, серебряные волосы до плеч. На поясе — колокол, будто отлитый из лунного света, и короткий серп.'),
      L('sariel', 'Ты слишком долго разговариваешь с мёртвыми.'),
      ...(has('timon') ? [L('note', 'Сариэл смотрит на Тимона. Долго. Тимон не отводит зелёных глаз.'), L('sariel', 'И не только разговариваешь, вижу. Ладно. Свидетель, который помнит подвал, нам пригодится.')] : []),
      L('hero', 'А ты слишком много знаешь.'),
      L('sariel', 'Это профессиональное заболевание.'),
      L('note', 'Он садится на могильную плиту и рассказывает спокойно, как о погоде: аврамисты собирают осколки Абсолюта. У них уже сотни. И ради каждого кто-то умирает.'),
      L('sariel', 'Тот, у тебя на груди, — тоже осколок. Так что они придут и за тобой.'),
      L('sariel', 'Я бы предпочёл быть рядом, когда это случится.'),
    ],
    () =>
      crypt.ask(
        [
          { id: 'trust', label: '«Идём. Мне нужен кто-то, кто помнит больше меня»' },
          { id: 'doubt', label: '«Ты пойдёшь впереди. Я хочу видеть твою спину»' },
        ],
        (id) => {
          result.flags.push(id === 'trust' ? 'trust-sariel' : 'doubt-sariel');
          crypt.set({
            card: { kicker: 'Новый спутник', title: 'Сариэл Лунный', text: 'Лунная некромантия · Управление духами · Сны мёртвых · Лунный колокол', icon: 'MoonStar', color: '#b9c8ff' },
          });
          const tail = id === 'doubt' ? [L('sariel', 'Разумно. Я бы тоже себе не доверял.')] : [L('sariel', 'Тогда не отставай. Деревня за холмом.')];
          crypt.say(tail, () => crypt.set({ stage: 'follow', objective: 'Иди за Сариэлом к воротам кладбища' }));
        },
      ),
  );
}

export function graveInteract(id: string | null) {
  const sp = GSPOTS.find((s) => s.id === id);
  if (!sp || !sp.when()) return;
  if (id === 'body') {
    mark('body');
    result.flags.push('saw-cut');
    crypt.set({ objective: 'Позови душу (E у тела)' });
    crypt.say([
      L('note', 'Молодой. Рубаха разорвана, руки исцарапаны, на шее след верёвки.'),
      L('note', 'Под ногтями — кровь, не его. Он царапался.'),
      L('note', 'На запястье — тонкий надрез, слишком аккуратный для драки. Кто-то брал у него кровь, как у скотины.'),
      L('note', 'Внутри что-то откликается — тяга, похожая на голод. Руки знают раньше головы.'),
    ]);
  }
  if (id === 'call') soulScene();
  if (id === 'cloth') {
    mark('cloth');
    result.cloth = true;
    cryptAudio.chime(587);
    crypt.set({
      objective: '',
      card: { kicker: 'Первая улика', title: 'Белый фрагмент одежды', text: 'Лоскут тонкого белого полотна с золотой нитью по краю. Так шьют рясы аврамистов — тех, кто приходит с «милосердием» и уносит людей.', icon: 'Shirt', color: '#d8c89a' },
    });
    window.setTimeout(sarielArrive, 3200);
  }
  if (id === 'grave') crypt.say([L('note', 'Старый камень, на нём вырезан серп луны и имя рода. Поверх кто-то грубо выбил круг со шпилем — знак секты. Имя под ним стёсано. Здесь хоронили по старому обычаю, а секта пометила могилу как свою.')]);
  if (id === 'gate') {
    if (st().stage === 'follow') {
      cryptAudio.chime(330);
      crypt.say([L('note', 'Ворота скрипят за спиной. Дорога уходит вниз, к огням деревни. Там звонят — не набат, праздник.')], () => crypt.set({ stage: 'leaving' }));
    } else if (!has('cloth')) crypt.say([L('note', 'Ворота заперты на цепь. И ты ещё не узнал, кто лежит между надгробиями.')]);
    else crypt.say([L('note', 'Кто-то смотрит тебе в спину. Обернись — между надгробиями.')]);
    return;
  }
  if (id === 'crypt') crypt.say([L('note', 'Из проёма тянет холодом и синим светом. Там тебе больше нечего делать.')]);
  if (id === 'sariel') sarielTalk();
}
