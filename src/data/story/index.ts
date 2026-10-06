import { PROLOGUE_SCENES } from '@/data/story/scenes-prologue';
import { CH1_SCENES } from '@/data/story/scenes-ch1';
import { CH2_SCENES } from '@/data/story/scenes-ch2';
import { CH3_SCENES } from '@/data/story/scenes-ch3';
import { CH4_SCENES } from '@/data/story/scenes-ch4';
import { CH5_SCENES } from '@/data/story/scenes-ch5';
import type { StoryScene } from '@/data/story/types';

export const DEMO_TITLE = 'Доказательство лжи';

export const CHAPTER_TITLE = `Демо · ${DEMO_TITLE}`;

export const START_SCENE = 'p-awaken';

export const STORY_SCENES: StoryScene[] = [
  ...PROLOGUE_SCENES,
  ...CH1_SCENES,
  ...CH2_SCENES,
  ...CH3_SCENES,
  ...CH4_SCENES,
  ...CH5_SCENES,
];

export const SCENE_MAP: Record<string, StoryScene> = STORY_SCENES.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<string, StoryScene>,
);

export const SCENE_ORDER: Record<string, number> = STORY_SCENES.reduce(
  (acc, s, i) => {
    acc[s.id] = i + 1;
    return acc;
  },
  {} as Record<string, number>,
);

export const SCENE_TOTAL = STORY_SCENES.length;

export * from '@/data/story/types';
export * from '@/data/story/meta';
export * from '@/data/story/art';
