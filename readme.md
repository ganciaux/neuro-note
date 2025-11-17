#remove data
rm -rf ./docker-data/postgres/*

#init
docker compose -f docker-compose.dev.yml down --volumes
docker compose -f docker-compose.dev.yml up --build

#dev
docker compose -f docker-compose.dev.yml up

#bash
docker exec -it dev-neuro-note-postgres psql -U neuro -d neuronote
docker compose -f docker-compose.dev.yml exec backend bash
docker compose -f docker-compose.dev.yml exec backend npx ts-node scripts/seed.ts db-init/02_seed.sql
docker compose -f docker-compose.dev.yml exec backend npm run seed -- db-init/02_seed.sql
docker compose -f docker-compose.prod.yml run --rm backend sh