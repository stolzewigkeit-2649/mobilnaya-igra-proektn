import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { Player } from '@/hooks/use-auth';
import { getProfile, readToken, saveProfile, type ProfileField } from '@/lib/cloud-profile';
import { writeLocal, type ProfileData } from '@/lib/local-profile';
import { buildPatch, FIELDS, mergeProfile } from '@/lib/profile-merge';

export type SyncStatus = 'local' | 'loading' | 'syncing' | 'synced' | 'error';

const DEBOUNCE = 1200;

export function useCloudSync(
  player: Player | null,
  dataRef: MutableRefObject<ProfileData>,
  apply: (next: ProfileData) => void,
) {
  const [status, setStatus] = useState<SyncStatus>('local');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const token = useRef<string | null>(null);
  const ready = useRef(false);
  const dirty = useRef(new Set<ProfileField>());
  const timer = useRef<number | null>(null);
  const inflight = useRef(false);
  const loadFailed = useRef(false);
  const loadRef = useRef<() => void>(() => undefined);

  const clearTimer = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  const flush = useCallback(
    async (keepalive = false) => {
      clearTimer();
      const t = token.current;
      if (!t || !ready.current || dirty.current.size === 0) return;
      if (inflight.current && !keepalive) {
        timer.current = window.setTimeout(() => void flush(), DEBOUNCE);
        return;
      }
      const fields = [...dirty.current];
      dirty.current.clear();
      const patch = buildPatch(dataRef.current, fields);
      inflight.current = true;
      if (!keepalive) setStatus('syncing');
      try {
        const at = await saveProfile(t, patch, keepalive);
        if (token.current !== t) return;
        setLastSyncedAt(at);
        setStatus(dirty.current.size ? 'syncing' : 'synced');
      } catch {
        fields.forEach((f) => dirty.current.add(f));
        if (token.current === t) setStatus('error');
      } finally {
        inflight.current = false;
      }
    },
    [dataRef],
  );

  const load = useCallback(async () => {
    const t = token.current;
    if (!t) return;
    ready.current = false;
    loadFailed.current = false;
    setStatus('loading');
    const edited = new Set(dirty.current);
    try {
      const cloud = await getProfile(t);
      if (token.current !== t) return;
      dirty.current.forEach((f) => edited.add(f));
      const { next, push } = mergeProfile(dataRef.current, cloud, edited);
      FIELDS.forEach((f) => {
        if (!push.has(f)) writeLocal(f, next[f]);
      });
      apply(next);
      dirty.current = push;
      ready.current = true;
      if (cloud?.updatedAt) setLastSyncedAt(cloud.updatedAt);
      if (push.size) await flush();
      else setStatus('synced');
    } catch {
      if (token.current !== t) return;
      loadFailed.current = true;
      setStatus('error');
    }
  }, [apply, dataRef, flush]);

  loadRef.current = () => void load();

  const markDirty = useCallback(
    (field: ProfileField) => {
      if (!token.current) return;
      dirty.current.add(field);
      if (!ready.current) {
        if (loadFailed.current) loadRef.current();
        return;
      }
      clearTimer();
      setStatus('syncing');
      timer.current = window.setTimeout(() => void flush(), DEBOUNCE);
    },
    [flush],
  );

  const flushNow = useCallback(() => flush(true), [flush]);

  useEffect(() => {
    if (player) {
      token.current = readToken();
      if (token.current) loadRef.current();
      return;
    }
    if (token.current && ready.current && dirty.current.size) void flush(true);
    token.current = null;
    ready.current = false;
    dirty.current.clear();
    clearTimer();
    setStatus('local');
    setLastSyncedAt(null);
  }, [player, flush]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') void flush(true);
    };
    const onUnload = () => void flush(true);
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [flush]);

  return { status, lastSyncedAt, markDirty, flushNow };
}