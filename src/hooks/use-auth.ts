import { useCallback, useEffect, useState } from 'react';

const AUTH_URL = 'https://functions.poehali.dev/3e280247-7653-448b-a8e5-31262dcd52a0';
const TOKEN_KEY = 'rpv-auth-token';

export type Provider = {
  id: string;
  label: string;
  icon: string;
  kind: 'oauth' | 'openid' | 'soon';
  ready: boolean;
};

export type Player = {
  id: number;
  nickname: string;
  provider: string;
  since: string;
};

export const useAuth = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromRedirect = url.searchParams.get('auth_token');
    if (fromRedirect) {
      localStorage.setItem(TOKEN_KEY, fromRedirect);
      url.searchParams.delete('auth_token');
      window.history.replaceState({}, '', url.toString());
    }

    const token = localStorage.getItem(TOKEN_KEY);

    Promise.all([
      fetch(`${AUTH_URL}?action=providers`).then((r) => r.json()),
      token
        ? fetch(`${AUTH_URL}?action=me`, { headers: { 'X-Auth-Token': token } }).then((r) => r.json())
        : Promise.resolve({ player: null }),
    ])
      .then(([list, me]) => {
        setProviders(list.providers ?? []);
        setPlayer(me.player ?? null);
        if (token && !me.player) localStorage.removeItem(TOKEN_KEY);
      })
      .catch(() => setError('Сервис входа недоступен. Попробуй позже.'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (providerId: string) => {
    setPending(providerId);
    setError(null);
    try {
      const back = window.location.origin + window.location.pathname;
      const res = await fetch(
        `${AUTH_URL}?action=start&provider=${providerId}&back=${encodeURIComponent(back)}`,
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(
        data.error === 'not_configured'
          ? 'Этот сервис ещё не подключён — нужны ключи разработчика.'
          : 'Не удалось начать вход. Попробуй другой сервис.',
      );
    } catch {
      setError('Не удалось связаться с сервисом входа.');
    }
    setPending(null);
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setPlayer(null);
    if (token) {
      await fetch(`${AUTH_URL}?action=logout`, {
        method: 'POST',
        headers: { 'X-Auth-Token': token },
      }).catch(() => undefined);
    }
  }, []);

  return { player, providers, loading, pending, error, login, logout };
};
