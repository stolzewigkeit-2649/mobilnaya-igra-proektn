import { PROLOGUE_SCENES } from '@/data/story/scenes-prologue';
import { HEKATE_SCENES } from '@/data/story/scenes-hekate';
import { BONES_SCENES } from '@/data/story/scenes-bones';
import { SILENCE_SCENES } from '@/data/story/scenes-silence';
import { TRADER_SCENES } from '@/data/story/scenes-traders';
import { EXILE_SCENES } from '@/data/story/scenes-exiles';
import { CLIMAX_SCENES } from '@/data/story/scenes-climax';
import { CLASH_SCENES } from '@/data/story/scenes-clash';
import { CLASH_SCENES_B } from '@/data/story/scenes-clash2';
import { ENDING_SCENES } from '@/data/story/scenes-endings';
import type { StoryScene } from '@/data/story/types';

export const CHAPTER_TITLE = 'Глава I. Пепел храма';

export const START_SCENE = 'prologue';

export const STORY_SCENES: StoryScene[] = [
  ...PROLOGUE_SCENES,
  ...HEKATE_SCENES,
  ...BONES_SCENES,
  ...SILENCE_SCENES,
  ...TRADER_SCENES,
  ...EXILE_SCENES,
  ...CLIMAX_SCENES,
  ...CLASH_SCENES,
  ...CLASH_SCENES_B,
  ...ENDING_SCENES,
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

export * from '@/data/story/types';
export * from '@/data/story/meta';