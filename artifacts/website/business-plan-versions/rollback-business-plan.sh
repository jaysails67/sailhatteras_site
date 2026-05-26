#!/bin/bash
# Rollback business plan to a previous backup
# Usage: ./rollback-business-plan.sh

set -e

VERSIONS_DIR="/home/ca12a15/sites/sailhatteras_site/artifacts/website/business-plan-versions"
PROD="/home/ca12a15/sites/sailhatteras_site/artifacts/website/dist/public/business-plan-content.html"

# Get list of backups (most recent first)
echo "📦 Available backups (most recent first):"
echo ""

backups=($(ls -t "$VERSIONS_DIR"/business-plan.backup.*.html 2>/dev/null || true))

if [ ${#backups[@]} -eq 0 ]; then
  echo "❌ No backups found. Cannot rollback."
  exit 1
fi

# Show last 10 backups with numbering
count=0
for backup in "${backups[@]}"; do
  if [ $count -ge 10 ]; then
    echo "... and more"
    break
  fi
  
  filename=$(basename "$backup")
  timestamp="${filename#business-plan.backup.}"
  timestamp="${timestamp%.html}"
  
  # Format timestamp for readability
  pretty_date=$(date -d "${timestamp:0:4}-${timestamp:4:2}-${timestamp:6:2} ${timestamp:9:2}:${timestamp:11:2}:${timestamp:13:2}" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "$timestamp")
  size=$(du -h "$backup" | cut -f1)
  
  echo "  [$((count + 1))] $pretty_date ($size)"
  
  ((count++))
done

echo ""
read -p "Enter backup number to restore (1-$count): " choice

# Validate input
if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt "$count" ]; then
  echo "❌ Invalid choice."
  exit 1
fi

# Get the chosen backup
selected_backup="${backups[$((choice - 1))]}"
backup_name=$(basename "$selected_backup")

echo ""
echo "⚠️  About to restore: $backup_name"
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Rollback cancelled."
  exit 0
fi

echo ""
echo "🔄 Restoring from backup..."

# Restore the backup
cp "$selected_backup" "$PROD"

# Restart the server
su - ca12a15 -c "pm2 restart pamliecoconnect-website"

echo ""
echo "✅ Rollback complete!"
echo "📁 Restored from: $backup_name"
echo "🌐 Changes live at: https://pamliecoconnect.com/investors/business-plan"
