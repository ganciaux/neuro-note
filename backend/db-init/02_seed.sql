-- exemple de seed idempotent
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

INSERT INTO users (name, email)
SELECT 'Alice', 'alice@example.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'alice@example.com');

INSERT INTO users (name, email)
SELECT 'Bob', 'bob@example.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'bob@example.com');
