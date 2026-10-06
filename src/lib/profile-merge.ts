import type { CloudProfile, ProfileField, ProfilePatch } from '@/lib/cloud-profile';
import {
  hasLocal,
  normalizeArchetype,
  normalizeCharacter,
  type ProfileData,
} from '@/lib/local-profile';
import { normalizeStory } from '@/lib/story-state';

export const FIELDS: ProfileField[] = ['character', 'story', 'archetype'];

export function mergeProfile(
  local: ProfileData,
  cloud: CloudProfile | null,
  editedMeanwhile: Set<ProfileField>,
) {
  const next: ProfileData = { ...local };
  const push = new Set<ProfileField>();

  const cloudCharacter = normalizeCharacter(cloud?.character);
  if (editedMeanwhile.has('character')) push.add('character');
  else if (cloudCharacter) next.character = cloudCharacter;
  else if (hasLocal('character')) push.add('character');

  const cloudArchetype = normalizeArchetype(cloud?.archetype);
  if (editedMeanwhile.has('archetype')) push.add('archetype');
  else if (cloudArchetype) next.archetype = cloudArchetype;
  else if (local.archetype) push.add('archetype');

  const cloudStory = normalizeStory(cloud?.story);
  if (editedMeanwhile.has('story')) push.add('story');
  else if (cloudStory && local.story) {
    if (local.story.visited.length > cloudStory.visited.length) push.add('story');
    else next.story = cloudStory;
  } else if (cloudStory) next.story = cloudStory;
  else if (local.story) push.add('story');

  return { next, push };
}

export const buildPatch = (data: ProfileData, fields: Iterable<ProfileField>): ProfilePatch => {
  const patch: ProfilePatch = {};
  for (const f of fields) patch[f] = data[f] ?? null;
  return patch;
};
