import { useCallback } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { DEFAULT_CHARACTER, type Character, type ListField } from '@/data/character-model';
import {
  GENDERS,
  BUILDS,
  AGES,
  FACE_SHAPES,
  SKIN_COLORS,
  HAIRSTYLES,
  HAIR_COLORS,
  EYE_COLORS,
  EYE_EFFECTS,
  BROW_SHAPES,
  BROW_DENSITY,
  BROW_COLORS,
  NOSES,
  LIPS,
  FACE_SCARS,
  SCAR_NATURE,
  FACE_TATTOOS,
  BODY_SCARS,
  BODY_TATTOOS,
  SKIN_ANOMALIES,
  HANDS,
  GAITS,
  type Option,
} from '@/data/character-options';
import {
  FACTIONS,
  COMMON_WEAR,
  HOODS,
  HATS,
  CROWNS,
  MASKS,
  BLINDFOLDS,
  NECKWEAR,
  RINGS,
  EARRINGS,
  BELTS,
  BRACERS,
  BAGS,
  AURA_EFFECTS,
  VOICES,
  POSTURES,
  MOVEMENTS,
  MAGIC_COLORS,
} from '@/data/character-gear';

export { DEFAULT_CHARACTER } from '@/data/character-model';
export type { Character, ListField } from '@/data/character-model';

const pick = (list: Option[]) => list[Math.floor(Math.random() * list.length)].id;

const some = (list: Option[], max: number) =>
  list
    .filter(() => Math.random() < 0.35)
    .slice(0, max)
    .map((o) => o.id);

export function useCharacter() {
  const { character, setCharacter } = useProfile();

  const set = useCallback(
    <K extends keyof Character>(field: K, value: Character[K]) => {
      setCharacter((prev) => ({ ...prev, [field]: value }));
    },
    [setCharacter],
  );

  const toggle = useCallback((field: ListField, value: string) => {
    setCharacter((prev) => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  }, [setCharacter]);

  const randomize = useCallback(() => {
    const faction = pick(FACTIONS.map((f) => ({ id: f.id, label: f.label })));
    const items = FACTIONS.find((f) => f.id === faction)!.items;
    setCharacter({
      gender: pick(GENDERS),
      build: pick(BUILDS),
      age: pick(AGES),
      faceShape: pick(FACE_SHAPES),
      skin: pick(SKIN_COLORS),
      hairstyle: pick(HAIRSTYLES),
      hairColor: pick(HAIR_COLORS),
      eyeColor: pick(EYE_COLORS),
      eyeEffects: some(EYE_EFFECTS, 2),
      browShape: pick(BROW_SHAPES),
      browDensity: pick(BROW_DENSITY),
      browColor: pick(BROW_COLORS),
      nose: pick(NOSES),
      lips: pick(LIPS),
      faceScars: some(FACE_SCARS, 2),
      scarNature: pick(SCAR_NATURE),
      glowingScars: Math.random() < 0.3,
      faceTattoos: some(FACE_TATTOOS, 2),
      bodyScars: some(BODY_SCARS, 2),
      bodyTattoos: some(BODY_TATTOOS, 2),
      glowingTattoos: Math.random() < 0.3,
      anomalies: some(SKIN_ANOMALIES, 2),
      hands: some(HANDS, 2),
      gait: pick(GAITS),
      faction,
      wear: some(items, 3),
      common: some(COMMON_WEAR, 3),
      hood: Math.random() < 0.6 ? pick(HOODS) : '',
      hat: Math.random() < 0.3 ? pick(HATS) : '',
      crown: Math.random() < 0.25 ? pick(CROWNS) : '',
      mask: Math.random() < 0.35 ? pick(MASKS) : '',
      blindfold: Math.random() < 0.15 ? pick(BLINDFOLDS) : '',
      neckwear: some(NECKWEAR, 3),
      rings: some(RINGS, 2),
      earrings: some(EARRINGS, 2),
      belts: some(BELTS, 2),
      bracers: some(BRACERS, 2),
      bags: some(BAGS, 2),
      aura: some(AURA_EFFECTS, 3),
      voice: pick(VOICES),
      posture: pick(POSTURES),
      movement: pick(MOVEMENTS),
      magicColor: pick(MAGIC_COLORS),
    });
  }, [setCharacter]);

  const reset = useCallback(() => setCharacter(DEFAULT_CHARACTER), [setCharacter]);

  return { character, set, toggle, randomize, reset };
}
