#!/bin/bash

# Usage:
# ./docker.sh [env] [mode]
# env: dev | prod (default: dev)
# mode: up | logs | reset-build | stop (default: reset-build)

ENV=${1:-dev}               # environment (default dev)
MODE=${2:-reset-build}      # execution mode (default reset-build)

COMPOSE_FILE="docker-compose.$ENV.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Error: file $COMPOSE_FILE not found!"
  exit 1
fi

case "$MODE" in
  up)
    echo "Starting environment $ENV..."
    docker compose -f "$COMPOSE_FILE" up -d
    ;;
  logs)
    echo "Showing logs for environment $ENV..."
    docker compose -f "$COMPOSE_FILE" logs -f
    ;;
  reset-build)
    echo "Performing clean reset and rebuild of environment $ENV..."
    docker compose -f "$COMPOSE_FILE" down --volumes
    docker compose -f "$COMPOSE_FILE" up --build -d
    docker compose -f "$COMPOSE_FILE" logs -f
    ;;
  stop)
    echo "Stopping environment $ENV..."
    docker compose -f "$COMPOSE_FILE" stop
    ;;
  *)
    echo "Unknown mode: $MODE"
    echo "Usage: $0 [dev|prod] [up|logs|reset-build|stop]"
    exit 1
    ;;
esac
