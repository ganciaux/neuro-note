#!/bin/bash

# Usage:
# ./seed.sh [env]
# env: dev | prod (default: dev)

ENV=${1:-dev}   # environment (default dev)

case "$ENV" in
  dev)
    CONTAINER_NAME="dev-neuro-note-backend"
    ;;
  prod)
    CONTAINER_NAME="prod-neuro-note-backend"
    ;;
  *)
    echo "Unknown environment: $ENV"
    echo "Usage: $0 [dev|prod]"
    exit 1
    ;;
esac

if ! docker ps --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
  echo "Error: container $CONTAINER_NAME is not running!"
  exit 1
fi

echo "Seeding database in $ENV environment ($CONTAINER_NAME)..."
docker exec -it "$CONTAINER_NAME" npx ts-node scripts/seed-fake.ts
