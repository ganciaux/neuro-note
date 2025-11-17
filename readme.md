#remove data
rm -rf ./docker-data/postgres/*

#init
docker compose -f docker-compose.dev.yml down --volumes
docker compose -f docker-compose.dev.yml up --build

#dev
docker compose -f docker-compose.dev.yml up

#bash
docker exec -it neuro-note-postgres psql -U neuro -d neuronote
docker compose exec backend bash
docker compose exec backend npx ts-node scripts/seed.ts db-init/02_seed.sql
docker compose exec backend npm run seed -- db-init/02_seed.sql
