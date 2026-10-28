import { useCallback, useEffect, useState } from 'react';

export type Difficulty = 'penitent' | 'heretic' | 'apostate';

export type GameSettings = {
  master: number;
  music: number;
  voices: number;
  difficulty: Difficulty;
  vibration: boolean;
  bloodFilter: boolean;
  subtitles: boolean;
};

const DEFAULTS: GameSettings = {
  master: 80,
  music: 65,
  voices: 90,
  difficulty: 'heretic',
  vibration: true,
  bloodFilter: false,
  subtitles: true,
};

const KEY = 'rpv-settings';

export const DIFFICULTY_INFO: Record<
  Difficulty,
  { name: string; note: string; multiplier: string; icon: string }
> = {
  penitent: {
    name: 'Послушник',
    note: 'Дознаватели близоруки, смерть почти ничего не стоит. Для сюжета.',
    multiplier: '×1.0',
    icon: 'Feather',
  },
  heretic: {
    name: 'Еретик',
    note: 'Задуманный баланс: за тобой следят, но дары успевают перезаряжаться.',
    multiplier: '×1.3',
    icon: 'Flame',
  },
  apostate: {
    name: 'Отступник',
    note: 'Смерть отнимает улику, патрули секты слышат каждый шаг.',
    multiplier: '×1.6',
    icon: 'Skull',
  },
};

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<GameSettings>) });
    } catch {
      /* повреждённые данные — остаёмся на умолчаниях */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [settings, loaded]);

  const update = useCallback(<K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setSettings(DEFAULTS), []);

  return { settings, update, reset };
}