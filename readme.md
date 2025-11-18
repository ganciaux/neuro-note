#init
docker compose -f docker-compose.dev.yml down --volumes
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.dev.yml up

#exec
docker compose -f docker-compose.dev.yml exec backend bash
docker compose -f docker-compose.dev.yml exec backend npx ts-node scripts/seed.ts db-init/02_seed.sql
docker compose -f docker-compose.dev.yml exec backend npm run seed -- db-init/02_seed.sql
docker compose -f docker-compose.dev.yml exec backend npm run typeorm:migrate
docker compose -f docker-compose.dev.yml run --rm backend sh

#postgres
docker exec -it dev-neuro-note-postgres psql -U neuro -d neuronote

#typeorm
docker compose -f docker-compose.dev.yml exec backend npm run typeorm:generate -- src/migrations/InitSchema
docker compose -f docker-compose.dev.yml exec backend npm run typeorm:migrate