#!/usr/bin/env bash
# SailHatteras InMotion deploy script
# Run as root: bash /home/ca12a15/sites/sailhatteras_site/deploy.sh
set -e

SITE_DIR="/home/ca12a15/sites/sailhatteras_site"
SITE_USER="ca12a15"

echo "=== $(date '+%Y-%m-%d %H:%M:%S') — SailHatteras deploy started ==="

echo "--- git pull ---"
su - "$SITE_USER" -c "cd $SITE_DIR && git pull origin main"

echo "--- pnpm install ---"
su - "$SITE_USER" -c "cd $SITE_DIR && pnpm install --frozen-lockfile 2>&1 | tail -5"

echo "--- build api-server ---"
su - "$SITE_USER" -c "cd $SITE_DIR/artifacts/api-server && pnpm run build 2>&1 | tail -5"

echo "--- build frontend ---"
su - "$SITE_USER" -c "cd $SITE_DIR/artifacts/sail-hatteras && BASE_PATH=/ pnpm run build 2>&1 | tail -5"

echo "--- copy frontend dist to web root ---"
WEBROOT="/home/ca12a15/public_html/sailhatteras.org"
if [ -d "$WEBROOT" ]; then
  cp -r "$SITE_DIR/artifacts/sail-hatteras/dist/public/." "$WEBROOT/"
  echo "Copied dist to $WEBROOT"
else
  echo "NOTE: $WEBROOT not found — skipping static copy (nginx may serve from dist directly)"
fi

echo "--- restart PM2 ---"
su - "$SITE_USER" -c "cd $SITE_DIR && set -a && source .env && set +a && pm2 restart sailhatteras-api --update-env"

echo "--- health check ---"
sleep 2
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/healthz)
if [ "$STATUS" = "200" ]; then
  echo "✓ API healthy (HTTP $STATUS)"
else
  echo "✗ API returned HTTP $STATUS — check pm2 logs"
  exit 1
fi

echo "=== Deploy complete ==="
