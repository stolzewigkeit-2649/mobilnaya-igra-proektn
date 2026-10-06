import Icon from '@/components/ui/icon';
import { SCENE_ART } from '@/data/story';

type Props = { onEnter: () => void; onText: () => void };

const CryptInvite = ({ onEnter, onText }: Props) => (
  <div className="absolute inset-0 z-20 flex animate-fade-in items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md overflow-hidden rounded-xl panel-surface">
      <div className="relative">
        <img src={SCENE_ART['p-awaken']} alt="" className="aspect-[16/9] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#9fc4ff] backdrop-blur">
          3D · от первого лица
        </span>
      </div>
      <div className="space-y-3 p-5 pt-2">
        <p className="text-[0.64rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">Пролог</p>
        <h3 className="font-display text-2xl font-extrabold leading-tight">Пробуждение</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Открой глаза на каменном алтаре, осмотри склеп своими глазами и встреть ту, что знает, куда
          уходят мёртвые.
        </p>
        <ul className="grid grid-cols-2 gap-1.5 text-[0.7rem] text-muted-foreground">
          <li className="flex items-center gap-1.5"><Icon name="Keyboard" size={12} className="text-ink" />WASD + мышь</li>
          <li className="flex items-center gap-1.5"><Icon name="Smartphone" size={12} className="text-ink" />джойстик на телефоне</li>
          <li className="flex items-center gap-1.5"><Icon name="Headphones" size={12} className="text-ink" />лучше в наушниках</li>
          <li className="flex items-center gap-1.5"><Icon name="Clock" size={12} className="text-ink" />3–5 минут</li>
        </ul>
        <button
          type="button"
          onClick={onEnter}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg font-display text-sm font-extrabold uppercase tracking-[0.16em] text-primary-foreground btn-play-surface"
        >
          <Icon name="Box" size={16} />
          Войти в склеп
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

export default CryptInvite;
