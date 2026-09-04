CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    provider VARCHAR(32) NOT NULL,
    subject_hash CHAR(64) NOT NULL,
    nickname VARCHAR(48) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (provider, subject_hash)
);

CREATE TABLE IF NOT EXISTS sessions (
    id BIGSERIAL PRIMARY KEY,
    token_hash CHAR(64) NOT NULL UNIQUE,
    player_id BIGINT NOT NULL REFERENCES players(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_sessions_player ON sessions(player_id);

CREATE TABLE IF NOT EXISTS auth_states (
    state CHAR(43) PRIMARY KEY,
    provider VARCHAR(32) NOT NULL,
    verifier VARCHAR(128),
    redirect_uri TEXT NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
