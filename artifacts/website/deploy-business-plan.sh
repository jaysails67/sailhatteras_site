#!/bin/bash
# Deploy business plan from working copy to production
# Usage: ./deploy-business-plan.sh

WORKING="/home/ca12a15/sites/sailhatteras_site/artifacts/website/business-plan-versions/business-plan.working.html"
PROD="/home/ca12a15/sites/sailhatteras_site/artifacts/website/dist/public/business-plan-content.html"
VERSIONS_DIR="/home/ca12a15/sites/sailhatteras_site/artifacts/website/business-plan-versions"

if [ ! -f "$WORKING" ]; then
  echo "ERROR: Working copy not found at $WORKING"
  exit 1
fi

# Create timestamped backup of current production
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp "$PROD" "$VERSIONS_DIR/business-plan.backup.$TIMESTAMP.html"

# Deploy working copy to production
cp "$WORKING" "$PROD"

# Restart the server
su - ca12a15 -c "pm2 restart pamliecoconnect-website"

echo "✅ Business plan deployed at $TIMESTAMP"
echo "📦 Backup saved: business-plan.backup.$TIMESTAMP.html"
