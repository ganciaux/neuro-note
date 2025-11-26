import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

module.exports = async () => {
  console.log('[E2E] Starting PostgreSQL testcontainer...');

  const container = await new PostgreSqlContainer('postgres:15')
    .withDatabase('testdb')
    .withUsername('test')
    .withPassword('test')
    .start();

  process.env.TEST_DATABASE_URL = container.getConnectionUri();

  (global as any).__PG_CONTAINER__ = container;

  console.log('[E2E] PostgreSQL started at', process.env.TEST_DATABASE_URL);

  const sqlDir = join(__dirname, '../../db-init');
  const sqlFiles = readdirSync(sqlDir).filter((f) => f.endsWith('.sql'));

  const client = new Client({ connectionString: process.env.TEST_DATABASE_URL });
  await client.connect();

  console.log('[E2E] Running SQL files...');
  for (const file of sqlFiles.sort()) {
    const sqlPath = join(sqlDir, file);
    const sql = readFileSync(sqlPath, 'utf8');
    console.log('[E2E] Executing', file);
    await client.query(sql);
  }

  await client.end();
  console.log('[E2E] Database ready.');
};
