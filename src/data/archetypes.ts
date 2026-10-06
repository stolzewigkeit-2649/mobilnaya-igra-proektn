import { PSYCHOPOMP } from '@/data/archetype-psychopomp';
import { ROT_PRIEST } from '@/data/archetype-rot';
import { ABYSS_CALLER } from '@/data/archetype-abyss';
import { LORE_GODS } from '@/data/lore-gods';
import { MAGIC_COLORS } from '@/data/character-gear';
import type { Archetype, ArchetypeChoice } from '@/data/archetype-types';

export type {
  Archetype,
  ArchetypeChoice,
  ArchetypeLook,
  ArchetypeSkill,
  ArchetypeStat,
  ArchetypeSummon,
  ArchetypeVariant,
} from '@/data/archetype-types';

export const ARCHETYPES: Archetype[] = [PSYCHOPOMP, ROT_PRIEST, ABYSS_CALLER];

export const ACTIVE_SKILLS = 3;

export const findArchetype = (id: string | undefined | null) =>
  ARCHETYPES.find((a) => a.id === id) ?? null;

export const godOf = (a: Archetype) => LORE_GODS.find((g) => g.id === a.linkedGod) ?? null;

export const magicHex = (id: string) => MAGIC_COLORS.find((m) => m.id === id)?.color ?? '#9b59d0';

export const defaultChoice = (a: Archetype, prev?: ArchetypeChoice | null): ArchetypeChoice => ({
  id: a.id,
  lookId: a.looks[0].id,
  variantId: a.variants[0].id,
  magicColor: prev?.magicColor ?? 'violet',
  name: prev?.name ?? '',
  skills: a.skills.slice(0, ACTIVE_SKILLS).map((s) => s.id),
  relic: a.accessories[0],
});

export const resolveChoice = (choice: ArchetypeChoice) => {
  const archetype = findArchetype(choice.id);
  if (!archetype) return null;
  const look = archetype.looks.find((l) => l.id === choice.lookId) ?? archetype.looks[0];
  const variant = archetype.variants.find((v) => v.id === choice.variantId) ?? archetype.variants[0];
  return { archetype, look, variant, magic: magicHex(choice.magicColor) };
};
