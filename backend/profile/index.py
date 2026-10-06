import hashlib
import json
import os

import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}

FIELDS = ('character', 'story', 'archetype')
MAX_SIZE = 200_000


def q(value: str) -> str:
    return "'" + str(value).replace("'", "''") + "'"


def pepper() -> str:
    return os.environ.get('AUTH_PEPPER', 'requiem-local-pepper')


def reply(status: int, payload: dict) -> dict:
    return {
        'statusCode': status,
        'headers': {'Content-Type': 'application/json', **CORS},
        'body': json.dumps(payload, ensure_ascii=False),
        'isBase64Encoded': False,
    }


def player_id(cur, token: str):
    token_hash = hashlib.sha256((pepper() + token).encode()).hexdigest()
    cur.execute(
        f"SELECT player_id FROM sessions WHERE token_hash = {q(token_hash)} "
        f"AND revoked = false AND expires_at > now()"
    )
    row = cur.fetchone()
    return row[0] if row else None


def handler(event: dict, context) -> dict:
    """Облачное сохранение игрока: облик героя, выбранный архетип некроманта
    и прогресс сюжета. GET — получить профиль, POST — сохранить изменённые поля
    (передаются только те, что поменялись; null — очистить поле)."""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    token = headers.get('x-auth-token', '')
    if not token:
        return reply(401, {'error': 'no_token'})

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        with conn, conn.cursor() as cur:
            pid = player_id(cur, token)
            if not pid:
                return reply(401, {'error': 'bad_token'})

            if method == 'GET':
                cur.execute(
                    f"SELECT character, story, archetype, updated_at FROM player_profiles "
                    f"WHERE player_id = {pid}"
                )
                row = cur.fetchone()
                if not row:
                    return reply(200, {'profile': None})
                return reply(200, {'profile': {
                    'character': row[0], 'story': row[1], 'archetype': row[2],
                    'updatedAt': row[3].isoformat(),
                }})

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                patch = {k: body[k] for k in FIELDS if k in body}
                if not patch:
                    return reply(400, {'error': 'empty'})
                values = {}
                for k, v in patch.items():
                    raw = json.dumps(v, ensure_ascii=False)
                    if len(raw) > MAX_SIZE:
                        return reply(413, {'error': 'too_large', 'field': k})
                    values[k] = 'NULL' if v is None else f'{q(raw)}::jsonb'
                cols = ', '.join(values.keys())
                vals = ', '.join(values.values())
                sets = ', '.join(f'{k} = EXCLUDED.{k}' for k in values)
                cur.execute(
                    f"INSERT INTO player_profiles (player_id, {cols}, updated_at) "
                    f"VALUES ({pid}, {vals}, now()) "
                    f"ON CONFLICT (player_id) DO UPDATE SET {sets}, updated_at = now() "
                    f"RETURNING updated_at"
                )
                return reply(200, {'ok': True, 'updatedAt': cur.fetchone()[0].isoformat()})
    finally:
        conn.close()

    return reply(405, {'error': 'method_not_allowed'})
