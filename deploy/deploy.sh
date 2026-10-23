#!/usr/bin/env bash
# Deploy, roll back, or inspect the sepehrgr.dev app. Installed at /srv/sepehrgr/deploy.sh;
# CI reaches it only through /usr/local/bin/deploy-gate (deploy, rollback, status).
# CI doesn't update this file: after changing it, copy it to the server and
# `sudo install -o root -g root -m 755 deploy.sh /srv/sepehrgr/deploy.sh`.
# Usage: deploy.sh deploy <sha-tag> | rollback | status | logs
set -euo pipefail

APP_DIR=/srv/sepehrgr
IMAGE=ghcr.io/sepehrgr/sepehrgr.dev
HEALTH_URL=http://127.0.0.1:3000/
DISK_LIMIT=90   # percent used; a deploy refuses to start above it
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

# Chained with &&: `set -e` is off inside the `if start` callers, so each step must stop the next.
start() {
  docker compose pull --quiet &&
    docker compose up -d --remove-orphans
}

# Write a tag file, or delete it when there's no tag to record
set_tag() { if [[ -n "$2" ]]; then echo "IMAGE_TAG=$2" > "$1"; else rm -f "$1"; fi; }

# Pulling a new version needs room for its image; a full disk would fail halfway
disk_ok() {
  local used
  used="$(df --output=pcent / | tail -1 | tr -dc '0-9')"
  (( used < DISK_LIMIT )) || { log "Disk ${used}% full (limit ${DISK_LIMIT}%): free some space before deploying"; return 1; }
}

# Keep the current and previous versions (rollback needs the previous one) and
# delete older ones; `image prune` alone only removes untagged layers.
prune_images() {
  local keep
  keep=" $(tag_in .env) $(tag_in .env.previous) "
  docker image ls "$IMAGE" --format '{{.Tag}}' | while read -r tag; do
    [[ "$keep" == *" $tag "* ]] || docker image rm "$IMAGE:$tag" > /dev/null || true
  done
  docker image prune -f > /dev/null
}

case "${1:-}" in
  deploy)
    NEW_TAG="${2:-}"
    # Accept only real commit tags: "sha-" + 40 hex characters. Blocks typos and injection.
    [[ "$NEW_TAG" =~ ^sha-[0-9a-f]{40}$ ]] || { log "Invalid tag: '$NEW_TAG'"; exit 2; }
    disk_ok || exit 1
    OLD_TAG="$(tag_in .env)"; OLD_PREV="$(tag_in .env.previous)"
    log "Deploying $NEW_TAG (previous: ${OLD_TAG:-none})"
    if [[ -n "$OLD_TAG" ]]; then set_tag .env.previous "$OLD_TAG"; fi
    set_tag .env "$NEW_TAG"
    if start && health_check; then
      prune_images
      log "Deploy OK: $NEW_TAG"
    else
      # Put both tag files back as they were, so a failed deploy leaves no trace,
      # including the rollback point
      set_tag .env "$OLD_TAG"; set_tag .env.previous "$OLD_PREV"
      if [[ -n "$OLD_TAG" ]]; then
        log "Automatic rollback to $OLD_TAG"
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
  logs)
    docker compose logs --tail 100 --timestamps web
    ;;
  *)
    echo "Usage: $0 deploy <sha-tag> | rollback | status | logs" >&2; exit 2
    ;;
esac
