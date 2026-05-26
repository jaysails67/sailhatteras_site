# Business Plan Update Workflow

This directory manages the business plan content for pamliecoconnect.com's investor portal at `/investors/business-plan`.

## File Structure

- **`business-plan.original.html`** — Read-only original. NEVER EDIT. Serves as reference and recovery anchor.
- **`business-plan.working.html`** — Your working copy. Edit this file to make changes.
- **`business-plan.backup.*.html`** — Timestamped backups (auto-created on each deploy).
- **`deploy-business-plan.sh`** — Deployment script (one-step publish to production).
- **`rollback-business-plan.sh`** — Rollback script (restore to previous version).

## Quick Start: Update the Business Plan

### Step 1: Edit the Working Copy
```bash
nano business-plan.working.html
# Make your edits, save with Ctrl+X → Y → Enter
```

### Step 2: Deploy to Production
```bash
./deploy-business-plan.sh
```
This will:
- Verify the working copy exists
- Back up the current production file (with timestamp)
- Copy your working file to production
- Restart the PM2 process
- Report success

### Step 3: Verify Live
Visit `https://pamliecoconnect.com/investors/business-plan` and confirm your changes appear.

## If Something Goes Wrong: Rollback

If the deploy breaks the site or shows stale content:

```bash
./rollback-business-plan.sh
```

This will:
- Show you the last 3 backups
- Let you pick which one to restore
- Restore that backup to production
- Restart the PM2 process
- Confirm success

## How It Works

### Deployment Process
1. **Safety check**: Verify working copy exists (fail if missing)
2. **Backup**: Copy current production to timestamped backup (`backup.YYYYMMDD_HHMMSS.html`)
3. **Deploy**: Copy working → production (`dist/public/business-plan-content.html`)
4. **Restart**: Reboot the PM2 process for immediate effect
5. **Report**: Show timestamp and backup filename

### Rollback Process
1. **List**: Show recent backups with dates
2. **Select**: Let you choose which backup to restore
3. **Restore**: Copy chosen backup → production
4. **Restart**: Reboot PM2 process
5. **Confirm**: Show what was restored

## File Locations

- **Working directory**: `/home/ca12a15/sites/sailhatteras_site/artifacts/website/business-plan-versions/`
- **Production file**: `/home/ca12a15/sites/sailhatteras_site/artifacts/website/dist/public/business-plan-content.html`
- **React wrapper**: Served at `/investors/business-plan` (auth-protected)

## Important Notes

- **Always edit the `.working.html` file**, never `.original.html`
- **Backups are auto-timestamped**, so you can't accidentally lose a version
- **Deployments are instant** — the PM2 restart is fast, no downtime
- **Rollbacks are safe** — just pick a backup, run rollback, you're done
- **Test locally first** (optional) — if you want to preview before deploying, use the dev server or open `.working.html` in your browser

## Example Workflow

```
# 1. Make changes
nano business-plan.working.html

# 2. Deploy
./deploy-business-plan.sh
# Output:
# ✅ Business plan deployed at 20260526_100530
# 📦 Backup saved: business-plan.backup.20260526_100530.html

# 3. Check live site
# Visit https://pamliecoconnect.com/investors/business-plan

# 4. If you need to undo:
./rollback-business-plan.sh
```

## Questions?

Refer to the deployment script (`deploy-business-plan.sh`) or rollback script (`rollback-business-plan.sh`) for details on what each step does.
