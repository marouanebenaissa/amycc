# Backup & Disaster Recovery Guide

## 1. Database Backups
- Supabase automatically takes daily backups on managed infrastructure.
- For manual or offline backups, use the PostgreSQL CLI (`pg_dump`):
  ```powershell
  pg_dump -h db.your-project-ref.supabase.co -U postgres -d postgres -F c -b -v -f amycc_backup.dump
  ```

## 2. Restoring from Backup
To restore to a new Supabase instance:
```powershell
pg_restore -h db.your-new-project.supabase.co -U postgres -d postgres -v amycc_backup.dump
```

## 3. Codebase Recovery
The complete source code, database migrations (`supabase/migrations/`), and configuration templates are version-controlled in the private GitHub repository:
- `https://github.com/marouanebenaissa/amycc`

To rebuild the environment on any new Windows or Linux machine:
1. `git clone https://github.com/marouanebenaissa/amycc.git`
2. `cd amycc`
3. `npm install`
4. Copy `.env.example` to `.env.local` and configure keys
5. `npm run build`
6. `npm run dev`
