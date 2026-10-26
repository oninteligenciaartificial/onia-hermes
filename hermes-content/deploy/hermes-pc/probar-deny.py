# Prueba el approvals.deny de config.onia.yaml contra la lógica real de Hermes instalada en la PC
# (tools/approval_detection.py). Correr después de cada actualización de Hermes:
#   python -I hermes-content/deploy/hermes-pc/probar-deny.py hermes-content/deploy/hermes-pc/config.onia.yaml
# Sale 0 si todo lo de "bad" queda bloqueado y todo lo de "good" pasa.
import sys, os, re, fnmatch, importlib.util

HA = os.path.expandvars(r"%LOCALAPPDATA%\hermes\hermes-agent")
sys.path.insert(0, HA)
spec = importlib.util.spec_from_file_location("ad", os.path.join(HA, "tools", "approval_detection.py"))
ad = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ad)

cfg = open(sys.argv[1], encoding="utf-8").read()
pats = re.findall(r'^\s+- "([^"]+)"', cfg, re.M)
print(f"{len(pats)} patrones leídos")

def match(cmd):
    for v in ad._deny_command_variants(cmd):
        c = v.lower().strip()
        for p in pats:
            if fnmatch.fnmatchcase(c, p.lower()):
                return p
    return None

bad = ["git push", "git -C C:/x push", "git -c a=b push", "git --git-dir=.git push", "git.exe push",
       r'"C:\Program Files\Git\cmd\git.exe" push', "git -C x commit -m x", "git.exe commit -m x",
       "git rebase main", "git pull", "git cherry-pick abc", "git update-ref refs/heads/main abc",
       "git reset --hard origin/main", "git reset HEAD~1", "git stash push -m x", "git restore .",
       "git checkout -- .", "git branch -D x", "git clean -fd", "git merge origin/main", "git tag v1",
       "gh issue create -t x -l orquesta", "gh issue edit 1 --remove-label necesita-ok", "gh issue comment 1 -b ok",
       "gh issue close 1", "gh pr merge 5", "gh pr review 1 --approve", "gh pr create", "gh run rerun 1",
       "gh workflow run orquesta.yml", "gh api repos/a/b", "gh auth token", "git credential fill",
       "gh label delete x", "echo $(gh auth token)",
       "curl -X DELETE https://api.github.com/repos/a/b/issues/1/labels/necesita-ok",
       "node scripts/orquesta/orquesta.mjs --donde pc", "codex exec 'x'", "claude -p 'x'",
       "bash scripts/codex-tarea.sh x", "schtasks /run /tn x", "Start-ScheduledTask x", "ssh root@vps",
       "ssh.exe root@vps", "sftp root@vps", "wsl ssh root@vps", "Remove-Item -Recurse x", "rm -rf x",
       "higgsfield generate create x", 'powershell -c "git push"', "git push; git status",
       "git status && git push", "pwsh -Command \"git -C x push\"", "cmd /c git push", "powershell -NoProfile -Command \"git commit -m x\"", "PowerShell -c \"git.exe push\""]
good = ["git status", "git status -sb", "git log --oneline -5", "git diff origin/main...HEAD",
        "git show HEAD:AGENTS.md", "git fetch origin", "git merge-base origin/main HEAD",
        "git -C E:/onia-wt/hermes-base log -3", "git rev-parse HEAD", "git worktree list", "git branch -a",
        "gh issue list --label orquesta", "gh issue view 12", "gh pr view 5", "gh pr diff 5", "gh pr checks 5",
        "gh pr list", "gh run view 1", "gh run list", "gh label list", "gh auth status",
        "node scripts/orquesta/cargar-issue.mjs --dry --titulo x", "node --test scripts/orquesta/cargar-issue.test.mjs",
        "rg orquesta scripts", "Get-Content scripts/orquesta/README.md"]

fails = 0
print("--- tienen que quedar bloqueados")
for c in bad:
    p = match(c)
    if not p:
        fails += 1
    print("DENY " if p else "PASA", "|", c, "|", p or "")
print("--- tienen que pasar")
for c in good:
    p = match(c)
    if p:
        fails += 1
    print("DENY " if p else "PASA", "|", c, "|", p or "")
print(f"fallas: {fails}")
sys.exit(1 if fails else 0)
