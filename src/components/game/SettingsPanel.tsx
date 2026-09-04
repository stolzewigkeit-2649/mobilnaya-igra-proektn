import Icon from '@/components/ui/icon';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  DIFFICULTY_INFO,
  type Difficulty,
  type GameSettings,
} from '@/hooks/use-game-settings';

type SettingsPanelProps = {
  settings: GameSettings;
  update: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  reset: () => void;
};

const VOLUMES: { key: 'master' | 'music' | 'voices'; label: string; icon: string }[] = [
  { key: 'master', label: 'Общая громкость', icon: 'Volume2' },
  { key: 'music', label: 'Музыка и хоралы', icon: 'Music' },
  { key: 'voices', label: 'Голоса мёртвых', icon: 'Mic' },
];

const TOGGLES: { key: 'vibration' | 'bloodFilter' | 'subtitles'; label: string; hint: string }[] = [
  { key: 'vibration', label: 'Вибрация', hint: 'Отклик при ударе и поднятии павшего' },
  { key: 'bloodFilter', label: 'Мягкий фильтр крови', hint: 'Приглушает сцены разложения' },
  { key: 'subtitles', label: 'Субтитры', hint: 'Текст откровений и диалогов' },
];

const SettingsPanel = ({ settings, update, reset }: SettingsPanelProps) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Звук
      </h3>
      {VOLUMES.map((v) => (
        <div key={v.key} className="rounded-xl border border-border bg-card/60 px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <Icon name={v.icon} size={15} className="text-ink" />
            <span className="flex-1 text-sm">{v.label}</span>
            <span className="text-xs font-bold tabular-nums text-ink">{settings[v.key]}</span>
          </div>
          <Slider
            className="mt-3"
            value={[settings[v.key]]}
            max={100}
            step={1}
            onValueChange={([val]) => update(v.key, val)}
            aria-label={v.label}
          />
        </div>
      ))}
    </div>

    <div className="space-y-2.5">
      <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Сложность
      </h3>
      {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((d) => {
        const info = DIFFICULTY_INFO[d];
        const active = settings.difficulty === d;
        return (
          <button
            key={d}
            type="button"
            onClick={() => update('difficulty', d)}
            className={`flex w-full items-start gap-3 rounded-xl px-4 py-3.5 text-left transition-all tile-surface ${
              active ? 'shadow-[inset_0_0_0_1px_hsl(var(--btn-hi))]' : 'hover:brightness-125'
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                active ? 'bg-primary text-primary-foreground' : 'bg-accent text-ink'
              }`}
            >
              <Icon name={info.icon} size={16} strokeWidth={1.6} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-foreground">{info.name}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-bold text-ink">
                  {info.multiplier}
                </span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {info.note}
              </span>
            </span>
          </button>
        );
      })}
    </div>

    <div className="space-y-2.5">
      <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Прочее
      </h3>
      {TOGGLES.map((t) => (
        <div
          key={t.key}
          className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground">{t.label}</p>
            <p className="text-xs text-muted-foreground">{t.hint}</p>
          </div>
          <Switch
            checked={settings[t.key]}
            onCheckedChange={(v) => update(t.key, v)}
            aria-label={t.label}
          />
        </div>
      ))}
    </div>

    <button
      type="button"
      onClick={reset}
      className="flex items-center gap-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
    >
      <Icon name="RotateCcw" size={13} />
      Сбросить настройки
    </button>
  </div>
);

export default SettingsPanel;
