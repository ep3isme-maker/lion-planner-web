#!/usr/bin/env bash
set -euo pipefail

APP_NAME="lion-planner-web"
IMAGE="${APP_NAME}:test"
CONTAINER="${APP_NAME}-test"
PORT="${1:-8080}"
MAX_WAIT_SECONDS=20
HOME_HTML_FILE="/tmp/lion-planner-home.html"
APP_JS_FILE="/tmp/lion-planner-app.js"
SMOKE_MARKERS_HTML=("Efficio Lion ADHD Planner" "Efficio Lion ADHD Planner")
SMOKE_MARKERS_JS=("Lion Command Center" "ops-")
USE_DOCKER=0

start_with_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker binary not found."
    return 1
  fi

  if ! docker info >/dev/null 2>&1; then
    echo "Docker daemon is unavailable."
    return 1
  fi

  USE_DOCKER=1
  echo "Docker available. Building image..."
  docker build -t "$IMAGE" .
  echo "Starting container on http://localhost:${PORT}..."
  docker run -d --rm --name "$CONTAINER" -p "${PORT}:80" "$IMAGE"
  return 0
}

start_with_python() {
  if ! command -v python3 >/dev/null 2>&1; then
    echo "Python 3 not found. Cannot start fallback test server."
    return 1
  fi

  echo "Docker unavailable. Falling back to Python local server on http://localhost:${PORT}..."
  CONTAINER="${APP_NAME}-fallback"
  (cd "$(dirname "$0")/.." && python3 -m http.server "$PORT" >/tmp/"${APP_NAME}"-fallback.log 2>&1 & echo $! > /tmp/"${APP_NAME}"-fallback.pid)
  return 0
}

stop_fallback() {
  if [[ "$USE_DOCKER" -eq 1 ]]; then
    docker stop "$CONTAINER" >/dev/null 2>&1 || true
  else
    if [[ -f "/tmp/${APP_NAME}-fallback.pid" ]]; then
      kill "$(cat /tmp/"${APP_NAME}"-fallback.pid)" >/dev/null 2>&1 || true
      rm -f "/tmp/${APP_NAME}-fallback.pid"
    fi
  fi
}

run_smoke() {
  local url="http://127.0.0.1:${PORT}"
  echo "Waiting for app response..."
  for _ in $(seq 1 "$MAX_WAIT_SECONDS"); do
    if curl -fsS "$url" > "$HOME_HTML_FILE"; then
      break
    fi
    sleep 1
  done

  if [[ ! -s "$HOME_HTML_FILE" ]]; then
    echo "Smoke check failed: no response on ${url}."
    [[ -f "/tmp/${APP_NAME}-fallback.log" ]] && tail -n 40 "/tmp/${APP_NAME}-fallback.log"
    return 1
  fi

  for marker in "${SMOKE_MARKERS_HTML[@]}"; do
    if ! grep -qi "$marker" "$HOME_HTML_FILE"; then
      echo "Smoke check failed: expected HTML marker '${marker}' missing."
      return 1
    fi
  done

  if ! curl -fsS "${url}/app.js" > "$APP_JS_FILE"; then
    echo "Smoke check failed: unable to fetch app.js."
    return 1
  fi

  for marker in "${SMOKE_MARKERS_JS[@]}"; do
    if ! grep -qi "$marker" "$APP_JS_FILE"; then
      echo "Smoke check failed: expected JS marker '${marker}' missing."
      return 1
    fi
  done
}

cleanup() {
  stop_fallback
}

trap cleanup EXIT

if ! start_with_docker; then
  start_with_python
fi

if ! run_smoke; then
  echo "Smoke check failed."
  exit 1
fi

echo "Smoke test passed."
