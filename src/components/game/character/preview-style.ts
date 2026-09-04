import {
  SKIN_COLORS,
  HAIR_COLORS,
  EYE_COLORS,
  HAIRSTYLES,
  GENDERS,
  BUILDS,
  AGES,
} from '@/data/character-options';
import { FACTIONS, MAGIC_COLORS } from '@/data/character-gear';
import type { Character } from '@/hooks/use-character';

const hex = (list: { id: string; color?: string }[], id: string, fallback: string) =>
  list.find((o) => o.id === id)?.color ?? fallback;

const label = (list: { id: string; label: string }[], id: string) =>
  list.find((o) => o.id === id)?.label ?? '';

export const FACE_RADIUS: Record<string, string> = {
  oval: '50% 50% 46% 46% / 58% 58% 42% 42%',
  square: '38% 38% 26% 26% / 34% 34% 30% 30%',
  triangle: '50% 50% 40% 40% / 46% 46% 60% 60%',
  round: '50%',
  angular: '42% 42% 20% 20% / 44% 44% 40% 40%',
};

export const HAIR_SHAPE: Record<string, { h: number; w: number; radius: string }> = {
  short: { h: 46, w: 104, radius: '50% 50% 40% 40% / 62% 62% 22% 22%' },
  mid: { h: 74, w: 116, radius: '50% 50% 34% 34% / 48% 48% 26% 26%' },
  long: { h: 118, w: 124, radius: '48% 48% 40% 40% / 34% 34% 32% 32%' },
  complex: { h: 92, w: 108, radius: '60% 40% 38% 38% / 52% 52% 26% 26%' },
};

export function derive(c: Character) {
  const skin = hex(SKIN_COLORS, c.skin, '#e6e2da');
  const hair = hex(HAIR_COLORS, c.hairColor, '#2e2723');
  const eye = hex(EYE_COLORS, c.eyeColor, '#4f9e6a');
  const magic = hex(MAGIC_COLORS, c.magicColor, '#9b59d0');
  const faction = FACTIONS.find((f) => f.id === c.faction) ?? FACTIONS[0];
  const hairMeta = HAIRSTYLES.find((h) => h.id === c.hairstyle)?.meta ?? 'mid';
  const hairShape = HAIR_SHAPE[hairMeta] ?? HAIR_SHAPE.mid;

  return {
    skin,
    hair,
    eye,
    magic,
    faction,
    hairShape,
    faceRadius: FACE_RADIUS[c.faceShape] ?? FACE_RADIUS.oval,
    hasGlow: c.eyeEffects.includes('glow') || c.aura.includes('eye-glow'),
    slitPupils: c.eyeEffects.includes('slit'),
    doublePupils: c.eyeEffects.includes('double'),
    noIris: c.eyeEffects.includes('no-iris'),
    hidden: Boolean(c.mask) || Boolean(c.blindfold),
    hooded: Boolean(c.hood) || c.common.includes('cloak-hood'),
  };
}

export function summary(c: Character) {
  return [
    label(GENDERS, c.gender),
    label(BUILDS, c.build),
    label(AGES, c.age),
    FACTIONS.find((f) => f.id === c.faction)?.label ?? '',
  ]
    .filter(Boolean)
    .join(' · ');
}
