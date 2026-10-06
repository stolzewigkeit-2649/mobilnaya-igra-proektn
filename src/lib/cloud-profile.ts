export const PROFILE_URL = 'https://functions.poehali.dev/45226b7b-db66-489f-bb6a-a91c55af14b8';
export const TOKEN_KEY = 'rpv-auth-token';

export type ProfileField = 'character' | 'story' | 'archetype';

export type CloudProfile = {
  character: unknown | null;
  story: unknown | null;
  archetype: unknown | null;
  updatedAt: string;
};

export type ProfilePatch = Partial<Record<ProfileField, unknown | null>>;

export class ProfileError extends Error {
  status: number;
  constructor(status: number) {
    super(`profile_${status}`);
    this.status = status;
  }
}

export const readToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export async function getProfile(token: string): Promise<CloudProfile | null> {
  const res = await fetch(PROFILE_URL, { headers: { 'X-Auth-Token': token } });
  if (!res.ok) throw new ProfileError(res.status);
  const data = (await res.json()) as { profile: CloudProfile | null };
  return data.profile ?? null;
}

export async function saveProfile(
  token: string,
  patch: ProfilePatch,
  keepalive = false,
): Promise<string> {
  const res = await fetch(PROFILE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
    body: JSON.stringify(patch),
    keepalive,
  });
  if (!res.ok) throw new ProfileError(res.status);
  const data = (await res.json()) as { ok: boolean; updatedAt: string };
  return data.updatedAt;
}
