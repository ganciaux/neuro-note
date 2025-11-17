import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const fileName = process.argv[2];
if (!fileName) {
  console.error("❌ Usage: npx ts-node scripts/seed.ts <filename.sql>");
  process.exit(1);
}

const client = new Client({
  host: process.env.DATABASE_HOST || 'postgres',
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USER || 'neuro',
  password: process.env.DATABASE_PASSWORD || 'neuro',
  database: process.env.DATABASE_NAME || 'neuronote',
});

const sqlPath = path.join(__dirname, '..', fileName);

if (!fs.existsSync(sqlPath)) {
  console.error(`❌ Fichier introuvable : ${sqlPath}`);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf-8');

async function runSeed() {
  try {
    await client.connect();
    console.log(`📥 Exécution du script : ${fileName}`);
    await client.query(sql);
    console.log(`✅ Seed terminé : ${fileName}`);
  } catch (err) {
    console.error("❌ Erreur lors de l'exécution du seed:", err);
  } finally {
    await client.end();
  }
}

runSeed();
