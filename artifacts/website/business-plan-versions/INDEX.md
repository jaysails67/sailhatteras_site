# Business Plan Update System — Index

## Quick Navigation

### 👤 For Jay (User Guide)
- **Start here:** `WORKFLOW.md` — 3-step process to update and deploy
- Want details? → `README.md` — Full system documentation

### 🔧 For Developers/Support
- **Architecture & internals:** `TECHNICAL.md` — Deep dive into how it works
- **Scripts:** See below

---

## Files in This Directory

| File | Purpose | Audience |
|------|---------|----------|
| **WORKFLOW.md** | 3-step quick guide (Edit → Deploy → Verify) | Jay / End-users |
| **README.md** | Comprehensive documentation | Anyone needing details |
| **TECHNICAL.md** | Architecture, scripts, troubleshooting | Developers / Support |
| **INDEX.md** | This file | Navigation |
| `deploy-business-plan.sh` | Deployment script (publish working → production) | Automated / CLI |
| `rollback-business-plan.sh` | Rollback script (restore from backup) | Emergency / CLI |
| `business-plan.original.html` | Read-only reference copy | Archive / Recovery |
| `business-plan.working.html` | **Your editing file** | Daily editing |
| `business-plan.backup.*.html` | Timestamped backups (auto-created) | History / Rollback |

---

## The Three-Step Workflow

### 1. Edit
```bash
nano business-plan.working.html
```

### 2. Deploy
```bash
./deploy-business-plan.sh
```

### 3. Verify
Visit: `https://pamliecoconnect.com/investors/business-plan`

---

## If You Need to Undo

```bash
./rollback-business-plan.sh
```

Select a backup from the list, confirm, done.

---

## Directory Structure

```
business-plan-versions/
├── WORKFLOW.md                     ← START HERE (Jay)
├── README.md                       ← Full docs
├── TECHNICAL.md                    ← Architecture & troubleshooting
├── INDEX.md                        ← This file
├── deploy-business-plan.sh         ← Deploy tool
├── rollback-business-plan.sh       ← Rollback tool
├── business-plan.original.html     ← Reference (locked)
├── business-plan.working.html      ← EDIT THIS FILE
└── business-plan.backup.*.html     ← Auto-backups (timestamped)
```

---

## Common Tasks

### Update the business plan
→ See `WORKFLOW.md` (3 steps)

### Restore a previous version
→ See `WORKFLOW.md` section "Rollback"

### Understand how it works
→ See `TECHNICAL.md`

### Need details on the scripts
→ See `README.md` or `TECHNICAL.md`

---

## Key Points

✅ **Always edit** `business-plan.working.html` (not `.original`)
✅ **Deploy via** `./deploy-business-plan.sh` (not manual copy)
✅ **Backups are auto-created** before each deploy (timestamped)
✅ **Rollback is safe** — choose backup, confirm, restore (2 steps)
✅ **No downtime** — PM2 restart is instant

---

## Files to Edit

- **Weekly/Monthly edits:** `business-plan.working.html`
- **Never edit:** `business-plan.original.html` (archive only)
- **Never manually edit:** `business-plan.backup.*.html` (use rollback script)

---

## Live Site

- **URL:** `https://pamliecoconnect.com/investors/business-plan`
- **Auth:** Requires login (investor portal)
- **Served as:** React component wrapping the HTML file
- **Update lag:** Instant (after PM2 restart)

---

## Questions?

- **"How do I update?"** → `WORKFLOW.md`
- **"How do I undo?"** → `WORKFLOW.md` (Rollback section)
- **"How does it work?"** → `TECHNICAL.md`
- **"What if something breaks?"** → `README.md` (Important Notes section) or `TECHNICAL.md` (Troubleshooting)

---

## Version Info

- **Created:** 2026-05-26
- **System:** Business plan auto-versioning for pamliecoconnect.com
- **Component:** React wrapper at `/investors/business-plan`
- **Production file:** `dist/public/business-plan-content.html`
