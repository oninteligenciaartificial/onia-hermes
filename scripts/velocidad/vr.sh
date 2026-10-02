#!/bin/bash
# usage: vr.sh <local-script-file>
B=$(base64 -w0 "$1")
cd /c/dev/proyectos/onia-hermes/.claude/worktrees/skills-setup-config-8d4674 && VPS_HOST=187.77.16.63 VPS_USER=root VPS_KEY_PATH="C:/Users/PC/.ssh/onia_hermes_vps_ed25519" node scripts/vps-cmd.js "echo $B | base64 -d | bash"
