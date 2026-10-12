import Icon from '@/components/ui/icon';
import { SCENE_ART } from '@/data/story';

const KINDS = {
  crypt: {
    art: 'p-awaken',
    kicker: 'Пролог · сцена 1',
    title: 'Пробуждение',
    text: 'Открой глаза на каменном алтаре, осмотри склеп своими глазами и встреть ту, что знает, куда уходят мёртвые.',
    button: 'Войти в склеп',
    time: '3–5 минут',
  },
  grave: {
    art: 'p-sariel',
    kicker: 'Пролог · сцена 3',
    title: 'Первая душа',
    text: 'Выйди на ночное кладбище, найди брошенное тело, позови его душу, подбери первую улику и встреть Сариэла Лунного.',
    button: 'Выйти на кладбище',
    time: '5–7 минут',
  },
};

type Props = { kind?: keyof typeof KINDS; onEnter: () => void; onText: () => void };

const CryptInvite = ({ kind = 'crypt', onEnter, onText }: Props) => {
  const k = KINDS[kind];
  return (
  <div className="absolute inset-0 z-20 flex animate-fade-in items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md overflow-hidden rounded-xl panel-surface">
      <div className="relative">
        <img src={SCENE_ART[k.art]} alt="" className="aspect-[16/9] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#9fc4ff] backdrop-blur">
          3D · от первого лица
        </span>
      </div>
      <div className="space-y-3 p-5 pt-2">
        <p className="text-[0.64rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">{k.kicker}</p>
        <h3 className="font-display text-2xl font-extrabold leading-tight">{k.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{k.text}</p>
        <ul className="grid grid-cols-2 gap-1.5 text-[0.7rem] text-muted-foreground">
          <li className="flex items-center gap-1.5"><Icon name="Keyboard" size={12} className="text-ink" />WASD + мышь</li>
          <li className="flex items-center gap-1.5"><Icon name="Smartphone" size={12} className="text-ink" />джойстик на телефоне</li>
          <li className="flex items-center gap-1.5"><Icon name="Headphones" size={12} className="text-ink" />лучше в наушниках</li>
          <li className="flex items-center gap-1.5"><Icon name="Clock" size={12} className="text-ink" />{k.time}</li>
        </ul>
        <button
          type="button"
          onClick={onEnter}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg font-display text-sm font-extrabold uppercase tracking-[0.16em] text-primary-foreground btn-play-surface"
        >
          <Icon name="Box" size={16} />
          {k.button}
        </button>
        <button
          type="button"
          onClick={onText}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm text-muted-foreground transition-colors tile-surface hover:text-foreground"
        >
          <Icon name="BookOpen" size={14} />
          Читать текстом
        </button>
      </div>
    </div>
  </div>
  );
};

export default CryptInvite;
