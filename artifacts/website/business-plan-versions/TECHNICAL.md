# Business Plan Update System — Technical Reference

## Architecture Overview

The business plan content is managed as a **static HTML file wrapped in a React component** for the investor portal.

```
React Component (at /investors/business-plan)
        ↓
    Loads HTML file
        ↓
/dist/public/business-plan-content.html (PRODUCTION)
        ↓
Update source → /business-plan-versions/business-plan.working.html
        ↓
Deploy script copies working → production
        ↓
PM2 restart (instant reload)
```

## File System Structure

```
/home/ca12a15/sites/sailhatteras_site/
├── artifacts/
│   └── website/
│       ├── dist/
│       │   └── public/
│       │       └── business-plan-content.html       ← PRODUCTION (deployed here)
│       ├── business-plan-versions/
│       │   ├── business-plan.original.html          ← Reference (locked, never edit)
│       │   ├── business-plan.working.html           ← EDITOR'S WORKING COPY
│       │   ├── business-plan.backup.*.html          ← Timestamped backups (auto-created)
│       │   ├── deploy-business-plan.sh              ← Deployment tool
│       │   ├── rollback-business-plan.sh            ← Rollback tool
│       │   ├── README.md                            ← Full documentation
│       │   ├── WORKFLOW.md                          ← Quick 3-step guide for Jay
│       │   └── TECHNICAL.md                         ← This file
│       ├── deploy-business-plan.sh                  ← Mirror copy (can be removed)
│       └── [other site files]
└── [other folders]
```

## Deployment Script (`deploy-business-plan.sh`)

**Purpose:** Publish the working copy to production with auto-timestamped backup

**Location:** `/business-plan-versions/deploy-business-plan.sh`

**What it does:**
1. Verifies working copy exists at `business-plan.working.html`
2. Creates timestamped backup of current production: `business-plan.backup.YYYYMMDD_HHMMSS.html`
3. Copies working file → production (`dist/public/business-plan-content.html`)
4. Restarts PM2 process `pamliecoconnect-website`
5. Reports success with timestamp and backup filename

**Usage:**
```bash
./deploy-business-plan.sh
```

**Output:**
```
✅ Business plan deployed at 20260526_100530
📦 Backup saved: business-plan.backup.20260526_100530.html
```

**Error handling:**
- Fails early if working copy not found
- Fails if PM2 restart fails (with error output)
- All operations are atomic (backup created before deploy)

## Rollback Script (`rollback-business-plan.sh`)

**Purpose:** Restore a previous version from backup with user selection

**Location:** `/business-plan-versions/rollback-business-plan.sh`

**What it does:**
1. Lists recent backups (up to 10) with timestamps and human-readable dates
2. Prompts user to pick a backup number
3. Confirms the selection with a safety prompt
4. Restores chosen backup to production
5. Restarts PM2 process
6. Reports what was restored

**Usage:**
```bash
./rollback-business-plan.sh
```

**Output:**
```
📦 Available backups (most recent first):

  [1] 2026-05-26 10:05:30 (531K)
  [2] 2026-05-26 09:45:15 (531K)
  [3] 2026-05-26 09:30:02 (531K)

Enter backup number to restore (1-3): 2
⚠️  About to restore: business-plan.backup.20260526_094515.html
Continue? (yes/no): yes

🔄 Restoring from backup...
✅ Rollback complete!
📁 Restored from: business-plan.backup.20260526_094515.html
🌐 Changes live at: https://pamliecoconnect.com/investors/business-plan
```

## Versioning Strategy

### Three-File System

1. **`.original.html`** (Read-only reference)
   - First copy of the business plan
   - Locked (permissions: `644`)
   - Used as recovery anchor if all backups are lost
   - Never edited

2. **`.working.html`** (Editor's working copy)
   - This is the file you edit
   - Deployed to production via `deploy-business-plan.sh`
   - Same permissions as original (`644`)

3. **`.backup.*.html`** (Timestamped archives)
   - Auto-created before each deploy
   - Timestamp format: `YYYYMMDD_HHMMSS` (e.g., `20260526_100530`)
   - Stored in same directory for easy access
   - No cleanup/rotation (disk is cheap; history is valuable)

### Backup Naming Convention

```
business-plan.backup.YYYYMMDD_HHMMSS.html

Example:
  business-plan.backup.20260526_100530.html
  ├─ Year: 2026
  ├─ Month: 05 (May)
  ├─ Day: 26
  ├─ Hour: 10 (UTC)
  ├─ Minute: 05
  └─ Second: 30
```

This ensures:
- Chronological sorting works (`ls -t` or `ls` alphabetical both work)
- Human-readable timestamps
- No accidental overwrites (every backup is unique)

## Deployment Workflow (Step-by-Step)

### Update Phase
```
User edits: business-plan.working.html
     ↓
Saves changes (in nano or preferred editor)
```

### Deploy Phase
```
./deploy-business-plan.sh
     ↓
[Script] Verify business-plan.working.html exists
     ↓
[Script] Get current timestamp (e.g., 20260526_100530)
     ↓
[Script] Copy current prod → business-plan.backup.20260526_100530.html
     ↓
[Script] Copy business-plan.working.html → production (dist/public/business-plan-content.html)
     ↓
[Script] Restart PM2 process: pm2 restart pamliecoconnect-website
     ↓
[Script] Report: ✅ Deployed at 20260526_100530
```

### Live Phase
```
React component reads updated HTML file from dist/public/
     ↓
Changes visible at: https://pamliecoconnect.com/investors/business-plan
```

**Total time:** ~2-3 seconds (PM2 restart is fast)

## Rollback Workflow (Step-by-Step)

### List Phase
```
./rollback-business-plan.sh
     ↓
[Script] List ls -t (time-sorted) backups
     ↓
[Script] Format timestamps, show file sizes
     ↓
[Script] Display numbered menu (most recent first)
```

### Select & Confirm Phase
```
User enters backup number (1, 2, 3, etc.)
     ↓
[Script] Verify input is valid (1 to N)
     ↓
[Script] Ask: "About to restore: business-plan.backup.20260526_094515.html"
     ↓
[Script] Ask: "Continue? (yes/no):"
     ↓
User confirms (yes)
```

### Restore Phase
```
[Script] Copy business-plan.backup.20260526_094515.html → production
     ↓
[Script] Restart PM2 process: pm2 restart pamliecoconnect-website
     ↓
[Script] Report: ✅ Rollback complete!
```

**Total time:** ~2-3 seconds

## React Integration

The React wrapper at `/investors/business-plan` is pre-configured to:
- Load the HTML file from `dist/public/business-plan-content.html`
- Require authentication (auth-protected route)
- Display inline without additional styling needed (static HTML carries its own CSS)

When you deploy a new version:
1. Production file is updated (`dist/public/business-plan-content.html`)
2. PM2 process restarts, reloading all assets
3. Next user visit fetches the new version (instant)

## PM2 Process Management

The service runs as:
- **Process name:** `pamliecoconnect-website`
- **User:** `ca12a15`
- **Restart on deploy:** `pm2 restart pamliecoconnect-website`

Command used in scripts:
```bash
su - ca12a15 -c "pm2 restart pamliecoconnect-website"
```

This ensures:
- Process is restarted by the correct user
- All file handles are refreshed
- Changes take effect immediately

## File Permissions

```
business-plan.original.html     644 (rw-r--r--)  ← Read-only in practice
business-plan.working.html      644 (rw-r--r--)  ← Owner (ca12a15) edits
business-plan.backup.*.html     644 (rw-r--r--)  ← Auto-created backups
dist/public/business-plan-content.html  644      ← Production file
```

All files are readable by the web server process, writable by `ca12a15` owner.

## Security & Safety Considerations

1. **Backups are immutable by design:**
   - Timestamped names prevent accidental overwrites
   - Kept in version-controlled directory
   - No automatic cleanup (retention is indefinite)

2. **Deployment is atomic:**
   - Backup is created BEFORE production file is replaced
   - If deploy fails mid-script, rollback is available
   - PM2 restart is the only external dependency

3. **Rollback is reversible:**
   - User must confirm before restoring
   - Choosing a backup doesn't delete current production (new backup is created)
   - Can "undo an undo" by deploying working copy again

4. **User protection:**
   - Rollback script shows human-readable dates
   - Prompts for confirmation before any destructive action
   - Reports what was restored (transparency)

## Troubleshooting

### "Working copy not found"
```
Error: Working copy not found at /path/to/business-plan.working.html
```
**Fix:** Ensure `business-plan.working.html` exists in the versions directory. Restore from `.original.html`:
```bash
cp business-plan.original.html business-plan.working.html
```

### "PM2 restart failed"
```
Error: pm2 restart pamliecoconnect-website failed
```
**Check:** Verify PM2 process is running:
```bash
pm2 status
pm2 restart pamliecoconnect-website
```

### Changes not appearing after deploy
```
Deployed, but live site shows old content
```
**Try:**
1. Hard-refresh browser: `Ctrl+Shift+R` (or Cmd+Shift+R on Mac)
2. Check that PM2 process restarted: `pm2 status`
3. Verify production file was updated: `ls -la dist/public/business-plan-content.html`

### Need to recover old version
```
Which backup do I need?
```
Use rollback script to see recent backups with dates:
```bash
./rollback-business-plan.sh
```

## File Size & Disk Impact

Current business plan file size: ~531 KB (544,090 bytes)

Storage impact:
- 1 original + 1 working = ~1 MB
- Each backup = ~531 KB
- Keeping 10 backups = ~5.3 MB total
- Keeping 30 backups = ~16 MB total

Disk usage is negligible on modern servers.

## Future Enhancements (Optional)

If needed later:
- Add automatic backup rotation (keep last N backups)
- Add backup to external storage (S3, cloud)
- Add email notification on deploy
- Add version comparison tool (diff original vs. working)
- Add scheduled auto-deploys from a git repo

For now, the system is **simple, safe, and maintainable**.
