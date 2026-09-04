import base64
import hashlib
import json
import os
import secrets
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}

PROVIDERS = [
    {'id': 'google', 'label': 'Google', 'icon': 'Chrome', 'kind': 'oauth'},
    {'id': 'apple', 'label': 'Apple', 'icon': 'Apple', 'kind': 'oauth'},
    {'id': 'steam', 'label': 'Steam', 'icon': 'Gamepad2', 'kind': 'openid'},
    {'id': 'psn', 'label': 'PlayStation Network', 'icon': 'Gamepad', 'kind': 'soon'},
    {'id': 'xbox', 'label': 'Xbox Live', 'icon': 'Joystick', 'kind': 'soon'},
    {'id': 'epic', 'label': 'Epic Games', 'icon': 'Swords', 'kind': 'soon'},
    {'id': 'facebook', 'label': 'Facebook', 'icon': 'Facebook', 'kind': 'soon'},
]

ADJ = ['Тихий', 'Пепельный', 'Полынный', 'Сумрачный', 'Костяной', 'Ржавый', 'Немой',
       'Забытый', 'Хладный', 'Терновый', 'Смолистый', 'Лунный']
NOUN = ['Жрец', 'Дознаватель', 'Ходатай', 'Некромант', 'Свидетель', 'Псаломщик',
        'Гробничий', 'Отступник', 'Плакальщик', 'Звонарь']


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def q(value: str) -> str:
    return "'" + str(value).replace("'", "''") + "'"


def pepper() -> str:
    return os.environ.get('AUTH_PEPPER', 'requiem-local-pepper')


def anon_id(provider: str, subject: str) -> str:
    raw = f'{pepper()}|{provider}|{subject}'.encode()
    return hashlib.sha256(raw).hexdigest()


def nickname_for(digest: str) -> str:
    n = int(digest[:12], 16)
    return f'{ADJ[n % len(ADJ)]} {NOUN[(n // len(ADJ)) % len(NOUN)]} {n % 900 + 100}'


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode().rstrip('=')


def http_post(url: str, data: dict) -> dict:
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(url, data=body, headers={
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    })
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read().decode())


def http_get(url: str) -> str:
    req = urllib.request.Request(url, headers={'Accept': '*/*'})
    with urllib.request.urlopen(req, timeout=10) as r:
        return r.read().decode()


def id_token_subject(id_token: str) -> str:
    payload = id_token.split('.')[1]
    payload += '=' * (-len(payload) % 4)
    return json.loads(base64.urlsafe_b64decode(payload))['sub']


def configured(provider: str) -> bool:
    if provider == 'google':
        return bool(os.environ.get('GOOGLE_CLIENT_ID') and os.environ.get('GOOGLE_CLIENT_SECRET'))
    if provider == 'apple':
        return all(os.environ.get(k) for k in
                   ('APPLE_CLIENT_ID', 'APPLE_TEAM_ID', 'APPLE_KEY_ID', 'APPLE_PRIVATE_KEY'))
    if provider == 'steam':
        return bool(os.environ.get('STEAM_WEB_API_KEY'))
    return False


def apple_client_secret() -> str:
    import jwt
    now = int(time.time())
    return jwt.encode(
        {
            'iss': os.environ['APPLE_TEAM_ID'],
            'iat': now,
            'exp': now + 3600,
            'aud': 'https://appleid.apple.com',
            'sub': os.environ['APPLE_CLIENT_ID'],
        },
        os.environ['APPLE_PRIVATE_KEY'].replace('\\n', '\n'),
        algorithm='ES256',
        headers={'kid': os.environ['APPLE_KEY_ID']},
    )


def self_url(event: dict) -> str:
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    host = headers.get('host', '')
    return f'https://{host}'


def json_response(status: int, payload: dict) -> dict:
    return {
        'statusCode': status,
        'headers': {'Content-Type': 'application/json', **CORS},
        'body': json.dumps(payload, ensure_ascii=False),
        'isBase64Encoded': False,
    }


def redirect(url: str) -> dict:
    return {'statusCode': 302, 'headers': {'Location': url, **CORS}, 'body': '', 'isBase64Encoded': False}


def issue_session(cur, provider: str, subject: str) -> dict:
    digest = anon_id(provider, subject)
    nick = nickname_for(digest)
    cur.execute(
        f"INSERT INTO players (provider, subject_hash, nickname) "
        f"VALUES ({q(provider)}, {q(digest)}, {q(nick)}) "
        f"ON CONFLICT (provider, subject_hash) DO UPDATE SET last_seen_at = now() "
        f"RETURNING id, nickname, created_at"
    )
    player_id, nickname, created_at = cur.fetchone()
    token = b64url(secrets.token_bytes(32))
    token_hash = hashlib.sha256((pepper() + token).encode()).hexdigest()
    expires = datetime.now(timezone.utc) + timedelta(days=30)
    cur.execute(
        f"INSERT INTO sessions (token_hash, player_id, expires_at) "
        f"VALUES ({q(token_hash)}, {player_id}, {q(expires.isoformat())})"
    )
    return {'token': token, 'player': {'id': player_id, 'nickname': nickname,
                                       'provider': provider, 'since': created_at.isoformat()}}


def handle_start(event: dict, params: dict) -> dict:
    provider = params.get('provider', '')
    back = params.get('back', '')
    if provider not in {'google', 'apple', 'steam'}:
        return json_response(400, {'error': 'unknown_provider'})
    if not configured(provider):
        return json_response(409, {'error': 'not_configured', 'provider': provider})
    if not back.startswith('http'):
        return json_response(400, {'error': 'bad_back_url'})

    state = b64url(secrets.token_bytes(32))
    verifier = b64url(secrets.token_bytes(64))[:96]
    callback = f'{self_url(event)}?action=callback'

    with db() as conn, conn.cursor() as cur:
        cur.execute(
            f"INSERT INTO auth_states (state, provider, verifier, redirect_uri) "
            f"VALUES ({q(state)}, {q(provider)}, {q(verifier)}, {q(back)})"
        )

    if provider == 'google':
        challenge = b64url(hashlib.sha256(verifier.encode()).digest())
        url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urllib.parse.urlencode({
            'client_id': os.environ['GOOGLE_CLIENT_ID'],
            'redirect_uri': callback,
            'response_type': 'code',
            'scope': 'openid',
            'state': state,
            'code_challenge': challenge,
            'code_challenge_method': 'S256',
        })
    elif provider == 'apple':
        url = 'https://appleid.apple.com/auth/authorize?' + urllib.parse.urlencode({
            'client_id': os.environ['APPLE_CLIENT_ID'],
            'redirect_uri': callback,
            'response_type': 'code',
            'response_mode': 'form_post',
            'scope': '',
            'state': state,
        })
    else:
        url = 'https://steamcommunity.com/openid/login?' + urllib.parse.urlencode({
            'openid.ns': 'http://specs.openid.net/auth/2.0',
            'openid.mode': 'checkid_setup',
            'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.return_to': f'{callback}&state={state}',
            'openid.realm': self_url(event),
        })
    return json_response(200, {'url': url})


def handle_callback(event: dict, params: dict) -> dict:
    body = {}
    if event.get('httpMethod') == 'POST' and event.get('body'):
        raw = event['body']
        if event.get('isBase64Encoded'):
            raw = base64.b64decode(raw).decode()
        body = dict(urllib.parse.parse_qsl(raw))
    merged = {**params, **body}
    state = merged.get('state', '')
    if not state:
        return json_response(400, {'error': 'no_state'})

    with db() as conn, conn.cursor() as cur:
        cur.execute(f"SELECT provider, verifier, redirect_uri, used FROM auth_states WHERE state = {q(state)}")
        row = cur.fetchone()
        if not row or row[3]:
            return json_response(400, {'error': 'bad_state'})
        provider, verifier, back, _ = row
        cur.execute(f"UPDATE auth_states SET used = true WHERE state = {q(state)}")

        callback = f'{self_url(event)}?action=callback'
        if provider == 'google':
            tok = http_post('https://oauth2.googleapis.com/token', {
                'client_id': os.environ['GOOGLE_CLIENT_ID'],
                'client_secret': os.environ['GOOGLE_CLIENT_SECRET'],
                'code': merged.get('code', ''),
                'grant_type': 'authorization_code',
                'redirect_uri': callback,
                'code_verifier': verifier,
            })
            subject = id_token_subject(tok['id_token'])
        elif provider == 'apple':
            tok = http_post('https://appleid.apple.com/auth/token', {
                'client_id': os.environ['APPLE_CLIENT_ID'],
                'client_secret': apple_client_secret(),
                'code': merged.get('code', ''),
                'grant_type': 'authorization_code',
                'redirect_uri': callback,
            })
            subject = id_token_subject(tok['id_token'])
        else:
            check = {k: v for k, v in merged.items() if k.startswith('openid.')}
            check['openid.mode'] = 'check_authentication'
            answer = http_post('https://steamcommunity.com/openid/login', check)  # type: ignore
            if 'is_valid:true' not in json.dumps(answer):
                return json_response(400, {'error': 'steam_rejected'})
            subject = merged.get('openid.claimed_id', '').rsplit('/', 1)[-1]

        session = issue_session(cur, provider, subject)

    sep = '&' if '?' in back else '?'
    return redirect(f'{back}{sep}auth_token={urllib.parse.quote(session["token"])}')


def current_player(cur, token: str):
    token_hash = hashlib.sha256((pepper() + token).encode()).hexdigest()
    cur.execute(
        f"SELECT p.id, p.nickname, p.provider, p.created_at FROM sessions s "
        f"JOIN players p ON p.id = s.player_id "
        f"WHERE s.token_hash = {q(token_hash)} AND s.revoked = false AND s.expires_at > now()"
    )
    return cur.fetchone()


def handler(event: dict, context) -> dict:
    """Универсальный вход в игру через внешние сервисы (Google, Apple, Steam).
    Игра не хранит пароли, email и другие личные данные — только необратимый хеш
    идентификатора от провайдера и сгенерированный игровой псевдоним."""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'providers')
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}

    if action == 'providers':
        return json_response(200, {'providers': [
            {**p, 'ready': configured(p['id']) if p['kind'] != 'soon' else False} for p in PROVIDERS
        ]})

    if action == 'start':
        return handle_start(event, params)

    if action == 'callback':
        return handle_callback(event, params)

    if action == 'me':
        token = headers.get('x-auth-token', '')
        if not token:
            return json_response(200, {'player': None})
        with db() as conn, conn.cursor() as cur:
            row = current_player(cur, token)
            if not row:
                return json_response(200, {'player': None})
            return json_response(200, {'player': {
                'id': row[0], 'nickname': row[1], 'provider': row[2], 'since': row[3].isoformat()}})

    if action == 'logout':
        token = headers.get('x-auth-token', '')
        if token:
            token_hash = hashlib.sha256((pepper() + token).encode()).hexdigest()
            with db() as conn, conn.cursor() as cur:
                cur.execute(f"UPDATE sessions SET revoked = true WHERE token_hash = {q(token_hash)}")
        return json_response(200, {'ok': True})

    return json_response(404, {'error': 'unknown_action'})
