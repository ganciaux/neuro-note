CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================
CREATE TABLE enum_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(64) NOT NULL,
  code VARCHAR(128) NOT NULL UNIQUE,
  short_code VARCHAR(64) NOT NULL,
  label VARCHAR(256) NOT NULL,
  UNIQUE (type, short_code)
);

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(256) UNIQUE NOT NULL,
  password_hash VARCHAR(256) NOT NULL,
  role_code VARCHAR(128) REFERENCES enum_types(code),
  full_name VARCHAR(256) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);