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
-- ENTITY MAPPING
-- ============================================
CREATE TABLE entity_mapping (
  code VARCHAR(128) NOT NULL,
  table_name VARCHAR(128) NOT NULL,
  id_column VARCHAR(128),
  UNIQUE (code, table_name)
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
  user_name VARCHAR(256) NOT NULL,
  first_name VARCHAR(256) NOT NULL,
  last_name VARCHAR(256) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

-- ============================================
-- PATIENTS
-- ============================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(64) UNIQUE NOT NULL,
  title_code VARCHAR(128) REFERENCES enum_types(code),
  first_name VARCHAR(256) NOT NULL,
  last_name VARCHAR(256) NOT NULL,
  search_name VARCHAR(256) NOT NULL,
  birth_date DATE,
  phone VARCHAR(256) NOT NULL,
  email VARCHAR(256) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

-- ============================================
-- ADDRESSES
-- ============================================
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(256) NOT NULL,
  entity_type VARCHAR(128) REFERENCES enum_types(code),
  entity_id UUID NOT NULL,
  type_code VARCHAR(128) REFERENCES enum_types(code),
  street VARCHAR(256) NOT NULL,
  postal_code VARCHAR(256) NOT NULL,
  city VARCHAR(256) NOT NULL,
  country_code VARCHAR(128) REFERENCES enum_types(code),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_addresses_entity ON addresses(entity_type, entity_id);