#!/bin/bash
# usage: runsql.sh file.sql [db] [user]
F="$1"; DB="${2:-postgres}"; U="${3:-postgres}"
B64=$(base64 -w0 "$F")
cd /c/dev/proyectos/onia-hermes/.claude/worktrees/skills-setup-config-8d4674 && VPS_HOST=187.77.16.63 VPS_USER=root VPS_KEY_PATH="C:/Users/PC/.ssh/onia_hermes_vps_ed25519" node scripts/vps-cmd.js "echo $B64 | base64 -d | docker exec -i supabase-db psql -U $U -d $DB -X -P pager=off -v ON_ERROR_STOP=0"
