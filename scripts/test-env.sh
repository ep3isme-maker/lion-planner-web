#!/usr/bin/env bash
set -euo pipefail

IMAGE=lion-planner-web:test
CONTAINER=lion-planner-web-test

echo "Building image..."
docker build -t "$IMAGE" .

echo "Starting container on http://localhost:8080..."
docker run -d --rm --name "$CONTAINER" -p 8080:80 "$IMAGE"

echo "Waiting for server..."
for i in {1..20}; do
  if curl -fsS http://127.0.0.1:8080 >/tmp/lion-planner-home.html; then
    break
  fi
  sleep 1
done

if ! curl -fsS http://127.0.0.1:8080 | grep -qi "Lion ADHD Planner"; then
  echo "Smoke check failed: expected app signature missing."
  docker stop "$CONTAINER" >/dev/null
  exit 1
fi

echo "Smoke test passed."
docker stop "$CONTAINER" >/dev/null
