CREATE TABLE IF NOT EXISTS player_profiles (
    player_id BIGINT PRIMARY KEY REFERENCES players(id),
    character JSONB,
    story JSONB,
    archetype JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);