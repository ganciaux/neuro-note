import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

module.exports = async () => {
  console.log('[INT] Starting PostgreSQL testcontainer...');

  const container = await new PostgreSqlContainer('postgres:15')
    .withDatabase('testdb')
    .withUsername('test')
    .withPassword('test')
    .start();

  process.env.TEST_DATABASE_URL = container.getConnectionUri();

  (global as any).__PG_CONTAINER__ = container;

  console.log('[INT] PostgreSQL started at', process.env.TEST_DATABASE_URL);

  const sqlDir = join(__dirname, '../../db-init');
  const sqlFiles = readdirSync(sqlDir).filter((f) => f.endsWith('.sql'));

  const client = new Client({ connectionString: process.env.TEST_DATABASE_URL });
  await client.connect();

  console.log('[INT] Running SQL files...');
  for (const file of sqlFiles.sort()) {
    const sqlPath = join(sqlDir, file);
    const sql = readFileSync(sqlPath, 'utf8');
    console.log('[INT] Executing', file);
    await client.query(sql);
  }

  await client.end();
  console.log('[INT] Database ready.');
};
