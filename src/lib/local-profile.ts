import { DEFAULT_CHARACTER, type Character } from '@/data/character-model';
import { findArchetype, type ArchetypeChoice } from '@/data/archetypes';
import { normalizeStory, type StoryState } from '@/lib/story-state';
import type { ProfileField } from '@/lib/cloud-profile';

export const LOCAL_KEYS: Record<ProfileField, string> = {
  character: 'rpv-character',
  story: 'rpv-story',
  archetype: 'rpv-archetype',
};

export type ProfileData = {
  character: Character;
  story: StoryState | null;
  archetype: ArchetypeChoice | null;
};

export const normalizeCharacter = (raw: unknown): Character | null =>
  raw && typeof raw === 'object' ? { ...DEFAULT_CHARACTER, ...(raw as Partial<Character>) } : null;

export const normalizeArchetype = (raw: unknown): ArchetypeChoice | null => {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Partial<ArchetypeChoice>;
  const a = findArchetype(c.id);
  if (!a) return null;
  return {
    id: a.id,
    lookId: c.lookId ?? a.looks[0].id,
    variantId: c.variantId ?? a.variants[0].id,
    magicColor: c.magicColor ?? 'violet',
    name: typeof c.name === 'string' ? c.name.slice(0, 24) : '',
    skills: Array.isArray(c.skills) ? c.skills.slice(0, 3) : [],
    relic: c.relic ?? a.accessories[0],
  };
};

const readRaw = (field: ProfileField): unknown => {
  try {
    const raw = window.localStorage.getItem(LOCAL_KEYS[field]);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const hasLocal = (field: ProfileField) => readRaw(field) !== null;

export const writeLocal = (field: ProfileField, value: unknown) => {
  try {
    if (value === null || value === undefined) window.localStorage.removeItem(LOCAL_KEYS[field]);
    else window.localStorage.setItem(LOCAL_KEYS[field], JSON.stringify(value));
  } catch {
    return;
  }
};

export const readLocalProfile = (): ProfileData => ({
  character: normalizeCharacter(readRaw('character')) ?? DEFAULT_CHARACTER,
  story: normalizeStory(readRaw('story')),
  archetype: normalizeArchetype(readRaw('archetype')),
});
