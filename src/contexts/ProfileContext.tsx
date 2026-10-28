import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type SetStateAction } from 'react';
import { DEFAULT_CHARACTER } from '@/data/character-model';
import type { Player } from '@/hooks/use-auth';
import type { Character } from '@/data/character-model';
import type { ArchetypeChoice } from '@/data/archetypes';
import type { StoryState } from '@/lib/story-state';
import type { ProfileField } from '@/lib/cloud-profile';
import { readLocalProfile, writeLocal, type ProfileData } from '@/lib/local-profile';
import { useCloudSync, type SyncStatus } from '@/contexts/use-cloud-sync';

export type { SyncStatus } from '@/contexts/use-cloud-sync';

type Setter<T> = (value: SetStateAction<T>) => void;

type ProfileContextValue = {
  character: Character;
  story: StoryState | null;
  archetype: ArchetypeChoice | null;
  setCharacter: Setter<Character>;
  setStory: Setter<StoryState | null>;
  setArchetype: Setter<ArchetypeChoice | null>;
  status: SyncStatus;
  lastSyncedAt: string | null;
  signedIn: boolean;
  flushNow: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

const EMPTY_PROFILE: ProfileData = { character: DEFAULT_CHARACTER, story: null, archetype: null };

type ProfileProviderProps = { player: Player | null; children: ReactNode };

export const ProfileProvider = ({ player, children }: ProfileProviderProps) => {
  const [data, setData] = useState<ProfileData>(EMPTY_PROFILE);
  const dataRef = useRef(data);

  const apply = useCallback((next: ProfileData) => {
    dataRef.current = next;
    setData(next);
  }, []);

  useEffect(() => {
    apply(readLocalProfile());
  }, [apply]);

  const { status, lastSyncedAt, markDirty, flushNow } = useCloudSync(player, dataRef, apply);

  const update = useCallback(
    <K extends ProfileField>(field: K, value: SetStateAction<ProfileData[K]>) => {
      const prev = dataRef.current[field];
      const resolved =
        typeof value === 'function'
          ? (value as (p: ProfileData[K]) => ProfileData[K])(prev)
          : value;
      if (resolved === prev) return;
      const next = { ...dataRef.current, [field]: resolved };
      dataRef.current = next;
      setData(next);
      writeLocal(field, resolved);
      markDirty(field);
    },
    [markDirty],
  );

  const setCharacter = useCallback<Setter<Character>>((v) => update('character', v), [update]);
  const setStory = useCallback<Setter<StoryState | null>>((v) => update('story', v), [update]);
  const setArchetype = useCallback<Setter<ArchetypeChoice | null>>(
    (v) => update('archetype', v),
    [update],
  );

  const value = useMemo<ProfileContextValue>(
    () => ({
      ...data,
      setCharacter,
      setStory,
      setArchetype,
      status,
      lastSyncedAt,
      signedIn: player !== null,
      flushNow,
    }),
    [data, setCharacter, setStory, setArchetype, status, lastSyncedAt, player, flushNow],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
};