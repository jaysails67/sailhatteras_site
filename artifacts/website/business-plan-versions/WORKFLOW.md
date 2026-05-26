# Business Plan Update — Quick Workflow for Jay

## 3-Step Update Process

### 1️⃣ Edit the Working Copy
Open the file and make your changes:
```
cd /home/ca12a15/sites/sailhatteras_site/artifacts/website/business-plan-versions
nano business-plan.working.html
```
Make edits, save (`Ctrl+X` → `Y` → `Enter`)

### 2️⃣ Deploy to Live
Run one command:
```
./deploy-business-plan.sh
```
You'll see:
```
✅ Business plan deployed at 20260526_100530
📦 Backup saved: business-plan.backup.20260526_100530.html
```

### 3️⃣ Verify Online
Visit: `https://pamliecoconnect.com/investors/business-plan`

**Done.** Your changes are live.

---

## Rollback (If Needed)

If something went wrong:
```
./rollback-business-plan.sh
```

You'll see a list of recent backups. Pick the one you want, type `yes` to confirm, and it's restored.

---

## What's Being Protected

- **`.original.html`** — Locked reference copy. Don't touch it.
- **`.working.html`** — Your editing file. This is what you deploy.
- **`.backup.*.html`** — Auto-saved versions after each deploy (timestamped).

Every deploy creates an automatic backup. You can't lose a version by accident.

---

## Where It Happens

- **Edit location**: `business-plan-versions/business-plan.working.html`
- **Live location**: `dist/public/business-plan-content.html`
- **Served as**: React component at `/investors/business-plan` (auth-protected)

---

## Example Workflow in Action

```
$ cd /home/ca12a15/sites/sailhatteras_site/artifacts/website/business-plan-versions

$ nano business-plan.working.html
# Make edits, save

$ ./deploy-business-plan.sh
✅ Business plan deployed at 20260526_100530
📦 Backup saved: business-plan.backup.20260526_100530.html

# Check live site — changes appear instantly

# If you need to undo:
$ ./rollback-business-plan.sh
📦 Available backups (most recent first):

  [1] 2026-05-26 10:05:30 (531K)
  [2] 2026-05-26 09:45:15 (531K)
  [3] 2026-05-26 09:30:02 (531K)

Enter backup number to restore (1-3): 1
⚠️  About to restore: business-plan.backup.20260526_100530.html
Continue? (yes/no): yes

🔄 Restoring from backup...
✅ Rollback complete!
📁 Restored from: business-plan.backup.20260526_100530.html
```

---

## Key Points

✅ **Simple** — 3 steps to deploy, 1 command to rollback
✅ **Safe** — Automatic timestamped backups before each deploy
✅ **Fast** — PM2 restart is instant, no downtime
✅ **Reversible** — Rollback anytime with a confirmation prompt

That's it. You're good to go.
