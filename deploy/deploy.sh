#!/usr/bin/env bash
# Deploy, roll back, or inspect the sepehrgr.dev app.
# Usage: deploy.sh deploy <sha-tag> | rollback | status
set -euo pipefail

APP_DIR=/srv/sepehrgr
HEALTH_URL=http://127.0.0.1:3000/
cd "$APP_DIR"

log() { echo "[$(date -u +%FT%TZ)] $*"; }
tag_in() { grep -E '^IMAGE_TAG=' "$1" 2>/dev/null | cut -d= -f2 || true; }

health_check() {
  for _ in $(seq 1 30); do                       # up to ~60 seconds
    if curl -fsS -o /dev/null --max-time 3 "$HEALTH_URL"; then
      log "Health check passed"; return 0
    fi
    sleep 2
  done
  log "Health check FAILED"; return 1
}

start() {
  docker compose pull --quiet
  docker compose up -d --remove-orphans
}

case "${1:-}" in
  deploy)
    NEW_TAG="${2:-}"
    # Accept only real commit tags: "sha-" + 40 hex characters. Blocks typos and injection.
    [[ "$NEW_TAG" =~ ^sha-[0-9a-f]{40}$ ]] || { log "Invalid tag: '$NEW_TAG'"; exit 2; }
    OLD_TAG="$(tag_in .env)"
    log "Deploying $NEW_TAG (previous: ${OLD_TAG:-none})"
    if [[ -n "$OLD_TAG" ]]; then cp .env .env.previous; fi
    echo "IMAGE_TAG=$NEW_TAG" > .env
    if start && health_check; then
      docker image prune -f > /dev/null          # remove unused image layers to save disk
      log "Deploy OK: $NEW_TAG"
    else
      if [[ -f .env.previous ]]; then
        log "Automatic rollback to $(tag_in .env.previous)"
        cp .env.previous .env
        if start && health_check; then log "Rollback OK"; else log "Rollback ALSO failed: manual attention needed"; fi
      fi
      exit 1
    fi
    ;;
  rollback)
    [[ -f .env.previous ]] || { log "No previous version recorded"; exit 1; }
    cp .env .env.tmp && cp .env.previous .env && mv .env.tmp .env.previous
    log "Rolling back to $(tag_in .env)"
    start && health_check
    ;;
  status)
    log "Current: $(tag_in .env)   Previous: $(tag_in .env.previous)"
    docker compose ps
    ;;
  *)
    echo "Usage: $0 deploy <sha-tag> | rollback | status" >&2; exit 2
    ;;
esac
