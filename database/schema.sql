-- ============================================================
-- NEXUS – Human Intelligence Operating System
-- PostgreSQL Database Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email            VARCHAR(255) UNIQUE NOT NULL,
    name             VARCHAR(255) NOT NULL,
    hashed_password  VARCHAR(255) NOT NULL,
    domain           VARCHAR(100) DEFAULT 'Engineering',
    career_goal      VARCHAR(255) DEFAULT '',
    level            VARCHAR(50)  DEFAULT 'Beginner',
    xp               INTEGER      DEFAULT 0,
    is_active        BOOLEAN      DEFAULT TRUE,
    created_at       TIMESTAMPTZ  DEFAULT NOW(),
    updated_at       TIMESTAMPTZ
);

-- ── Skills Master ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) UNIQUE NOT NULL,
    domain      VARCHAR(100) NOT NULL,
    category    VARCHAR(50) DEFAULT 'Technical',
    description TEXT DEFAULT ''
);

-- ── User Skills (Junction) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS user_skills (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name   VARCHAR(100) NOT NULL,
    proficiency  INTEGER DEFAULT 50 CHECK (proficiency BETWEEN 0 AND 100),
    verified     BOOLEAN DEFAULT FALSE,
    added_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_name)
);

-- ── Simulations ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS simulations (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       VARCHAR(255) NOT NULL,
    domain      VARCHAR(100) NOT NULL,
    difficulty  VARCHAR(50)  DEFAULT 'Medium',
    time_limit  INTEGER      DEFAULT 300,
    steps       JSONB        NOT NULL,
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ── User Responses ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_responses (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    simulation_id  UUID NOT NULL,
    choices        JSONB DEFAULT '[]',
    time_taken     INTEGER DEFAULT 0,
    completed_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Scores ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scores (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    simulation_id  UUID NOT NULL,
    accuracy       FLOAT DEFAULT 0,
    logic          FLOAT DEFAULT 0,
    risk           FLOAT DEFAULT 0,
    speed          FLOAT DEFAULT 0,
    overall        FLOAT DEFAULT 0,
    scored_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Predictions ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS predictions (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_readiness     FLOAT DEFAULT 0,
    growth_potential  FLOAT DEFAULT 0,
    risk_score        FLOAT DEFAULT 0,
    career_level      VARCHAR(50) DEFAULT 'Junior',
    details           JSONB DEFAULT '{}',
    predicted_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Chat History ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_history (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        VARCHAR(20) NOT NULL CHECK (role IN ('user','assistant','system')),
    content     TEXT NOT NULL,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Knowledge Gaps ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_gaps (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    career_id     VARCHAR(100) NOT NULL,
    missing_skill VARCHAR(100) NOT NULL,
    priority      VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('High','Medium','Low')),
    progress      INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id    ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_user_id         ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id    ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id   ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_gaps_user_id ON knowledge_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created   ON chat_history(created_at DESC);

-- ── Sample Skill Data ─────────────────────────────────────────
INSERT INTO skills (name, domain, category) VALUES
  ('JavaScript',   'Engineering', 'Technical'),
  ('Python',       'Engineering', 'Technical'),
  ('React',        'Engineering', 'Technical'),
  ('Node.js',      'Engineering', 'Technical'),
  ('SQL',          'Engineering', 'Technical'),
  ('Git',          'Engineering', 'Technical'),
  ('System Design','Engineering', 'Technical'),
  ('AWS',          'Engineering', 'DevOps'),
  ('Kubernetes',   'Engineering', 'DevOps'),
  ('Docker',       'Engineering', 'DevOps'),
  ('PyTorch',      'Engineering', 'AI/ML'),
  ('TensorFlow',   'Engineering', 'AI/ML'),
  ('Machine Learning','Engineering','AI/ML'),
  ('LLMs',         'Engineering', 'AI/ML'),
  ('Figma',        'Arts',        'Design'),
  ('User Research','Arts',        'Design'),
  ('Prototyping',  'Arts',        'Design'),
  ('Strategy',     'Business',    'Management'),
  ('Agile',        'Business',    'Process'),
  ('Analytics',    'Business',    'Data')
ON CONFLICT (name) DO NOTHING;
