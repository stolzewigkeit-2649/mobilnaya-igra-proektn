import { necro } from '@/components/game/crypt3d/necro/necro';

export function withNecro<T extends { flags: string[]; sanity: number }>(r: T): T {
  const n = necro.get();
  const flags = [...r.flags, ...n.flags];
  if (n.souls > 0) flags.push('necro-called');
  if (n.raised > 0) flags.push('necro-raised');
  return { ...r, flags: Array.from(new Set(flags)), sanity: r.sanity + n.sanity };
}
