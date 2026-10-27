# Prueba el approvals.deny de config.onia.yaml con el código real de Hermes de la PC (v0.22.2), sin copiarlo.
# Se corre con el python del venv activo de Hermes (trae ruamel); el venv activo lo dice installs\*\facts.json.
# Desde la raíz del repo, en PowerShell:
#   $py = (Get-Content "$env:LOCALAPPDATA\hermes\installs\*\facts.json" -Raw | ConvertFrom-Json).packages.venv.environment + '\Scripts\python.exe'
#   & $py -I hermes-content/deploy/hermes-pc/probar-deny.py hermes-content/deploy/hermes-pc/config.onia.yaml
#   & $py -I hermes-content/deploy/hermes-pc/probar-deny.py hermes-content/deploy/hermes-pc/config.onia.yaml --vivo
# El 26-oct ese python era C:\Users\PC\AppData\Local\hermes\installs\5d7df4803f0bba63\environments\da0069aae7b047fa80465c54ef5398c5\venv\Scripts\python.exe
#
# Modo repo: lee approvals.deny del YAML con hermes_yaml (el parser de Hermes) y pasa cada caso por
#   tools.approval_floors._match_user_deny_rule, con esos patrones inyectados en approval_context._get_approval_config.
# --vivo: lee la config que usa Hermes (hermes_cli.config.load_config_readonly, como al arrancar; Hermes guarda de paso
#   su copia "good" de config.yaml) y falla si su approvals.deny no es igual al del repo; si es igual, corre los mismos
#   casos sin inyectar nada.
# Sale 0 si todo lo de "bad" queda bloqueado y todo lo de "good" pasa; 1 si no; 2 si falta algo de Hermes.
import os
import sys

HA = os.path.join(os.environ.get("LOCALAPPDATA", ""), "hermes", "hermes-agent")


def morir(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(2)


if len(sys.argv) < 2 or sys.argv[1].startswith("--"):
    morir("uso: probar-deny.py <config.onia.yaml> [--vivo]")
sys.path.insert(0, HA)
try:
    import hermes_yaml
    from hermes_cli import config as hconfig
    from tools import approval_context, approval_floors
except Exception as e:
    morir(f"no se pudo cargar Hermes desde {HA} con {sys.executable}: {e!r}. ¿Es el python del venv de Hermes?")
for mod, attr in ((hermes_yaml, "safe_load"), (hconfig, "load_config_readonly"), (hconfig, "get_config_path"),
                  (approval_context, "_get_approval_config"), (approval_floors, "_match_user_deny_rule")):
    if not callable(getattr(mod, attr, None)):
        morir(f"Hermes ya no tiene {mod.__name__}.{attr}: hay que rehacer esta prueba")
if getattr(approval_floors, "_ctx", None) is not approval_context:
    morir("approval_floors ya no lee la config por approval_context._get_approval_config: hay que rehacer esta prueba")


def limpiar(pats):
    return [p.strip() for p in pats if isinstance(p, str) and p.strip()]  # lo mismo que hace _match_user_deny_rule


with open(sys.argv[1], encoding="utf-8-sig") as f:
    repo_cfg = hermes_yaml.safe_load(f)
deny_raw = ((repo_cfg or {}).get("approvals") or {}).get("deny")
if not isinstance(deny_raw, list) or not deny_raw:
    morir(f"{sys.argv[1]} no tiene una lista approvals.deny")
deny = limpiar(deny_raw)
if len(deny) != len(deny_raw):
    morir("approvals.deny tiene entradas vacías o que no son texto")
print(f"{len(deny)} patrones en approvals.deny de {sys.argv[1]}")

if "--vivo" in sys.argv[2:]:
    os.environ.setdefault("HERMES_HOME", str(hconfig.get_hermes_home()))
    vivo = hconfig.load_config_readonly()
    if getattr(vivo, "read_error", None) is not None:
        morir(f"Hermes no pudo leer {hconfig.get_config_path()}: {vivo.read_error!r}")
    deny_vivo = limpiar(approval_context._get_approval_config().get("deny") or [])
    if deny_vivo != deny:
        faltan = [p for p in deny if p not in deny_vivo]
        sobran = [p for p in deny_vivo if p not in deny]
        print(f"FALLA --vivo: {hconfig.get_config_path()} tiene {len(deny_vivo)} patrones en approvals.deny y el repo "
              f"{len(deny)}; faltan {len(faltan)}, sobran {len(sobran)}"
              + ("" if faltan or sobran else ", mismo contenido en otro orden"))
        for p in faltan:
            print(f"  falta: {p}")
        for p in sobran:
            print(f"  sobra: {p}")
        sys.exit(1)
    print(f"--vivo: {hconfig.get_config_path()} tiene el mismo approvals.deny; se prueba sin inyectar nada")
else:
    approval_context._get_approval_config = lambda: {"deny": deny}

bad = [
    # git que escribe, publica o borra
    "git push", "git -C C:/x push", "git -c a=b push", "git --git-dir=.git push", "git.exe push",
    r'"C:\Program Files\Git\cmd\git.exe" push', "/c/Program\\ Files/Git/cmd/git push", "git -C x commit -m x",
    "git.exe commit -m x", "git rebase main", "git pull", "git cherry-pick abc", "git update-ref refs/heads/main abc",
    "git reset --hard origin/main", "git reset HEAD~1", "git stash push -m x", "git restore .", "git checkout -- .",
    "git checkout main", "git checkout -b x", "git -C x checkout main", "git switch main", "git switch -c x",
    "git worktree remove x", "git worktree add ../x", "git branch -D x", "git branch --delete x", "git clean -fd",
    "git merge origin/main", "git tag v1", "git rm x", "git apply x.patch", "git send-email x", "git credential fill",
    "git -c alias.p=push p", "git config alias.p push", "git push; git status", "git status && git push",
    "GIT_DIR=.git git push", "env git push", "command git push", "g''it push", "\\git push", "bash -c 'git push'",
    "nohup git push", "timeout 60 git push",
    # el ejecutable escondido
    "$x push", 'x="git"; $x push', '"$x" push', "${G} push", "$(which gh) issue edit 1", "eval 'git push'",
    r"'C:\Program Files\Git\cmd\git.exe' push", r'"C:\Program Files\Git\cmd\git" push',
    r'cd x && "C:\Program Files\GitHub CLI\gh.exe" issue edit 1', r'"C:\Users\PC\AppData\Roaming\npm\codex" exec x',
    "xargs gh issue edit < f", "ls | xargs -I{} git push", "find . -maxdepth 0 -exec git push \\;",
    # GitHub
    "gh issue create -t x -l orquesta", "gh issue new -t x", "gh issue edit 1 --remove-label necesita-ok",
    "gh -R o/r issue edit 1 --add-label x", "gh --repo=o/r issue edit 1", "gh --repo o/r issue comment 1 -b ok",
    "gh issue -R o/r edit 1", "gh issue --repo=o/r close 1", "gh.exe issue edit 1",
    r'"C:\Program Files\GitHub CLI\gh.exe" issue edit 1', r'"C:\Program Files\GitHub CLI\gh.exe" -R o/r pr merge 5',
    "/c/Program\\ Files/GitHub\\ CLI/gh issue close 1", "gh issue comment 1 -b ok", "gh issue close 1",
    "gh issue develop 1", "gh issue pin 1", "gh issue lock 1", "gh pr merge 5", "gh -R o/r pr merge 5",
    "gh pr -R o/r merge 5", "gh pr review 1 --approve", "gh pr create", "gh pr new", "gh pr update-branch 5",
    "gh pr checkout 5", "gh pr co 5", "gh co 5", "gh pr revert 5", "gh run rerun 1", "gh run delete 1",
    "gh workflow run orquesta.yml", "gh api repos/a/b", "gh.exe api repos/a/b", "gh -R o/r api x", "gh auth token",
    "gh auth status -t", "gh auth status --show-token", "gh auth status -h github.com -t", "gh auth login",
    "gh auth setup-git", "gh label delete x", "gh label -R o/r delete x", "echo $(gh auth token)",
    "gh repo edit --visibility public", "gh repo edit o/r --visibility public --accept-visibility-change-consequences",
    "gh repo create x --public", "gh repo new x", "gh repo archive -y", "gh repo rename y", "gh repo sync",
    "gh repo deploy-key add k.pub", "gh repo delete o/r --yes", "gh repo fork", "gh gist create x.md",
    "gh release create v1", "gh agent-task create x", "gh agent create x", "gh codespace create", "gh cs ssh",
    "gh ssh-key add k.pub", "gh secret set X", "gh secret list", "gh variable set X", "gh project item-add 1",
    "gh copilot", "gh config set editor x", "gh cache delete --all", "gh ext install x/y", "gh alias set p 'pr merge'",
    "curl -X DELETE https://api.github.com/repos/a/b/issues/1/labels/necesita-ok",
    # git o gh dentro de otra shell
    'powershell -c "git push"', 'pwsh -Command "git -C x push"', "cmd /c git push", "cmd /k git push",
    "cmd //c git push", "cmd.exe /c gh issue edit 1", "cmd /k gh pr merge 5", 'powershell -NoProfile -Command "git commit -m x"',
    'PowerShell -c "git.exe push"', 'powershell -c "gh pr merge 5"', 'pwsh -c "gh issue edit 1"', "powershell git push",
    "powershell -enc ZwBpAHQAIABwAHUAcwBoAA==", "powershell -c \"& ('gi'+'t') push\"", "echo x | cmd //c claude -p x",
    # otros agentes, orquesta, tareas programadas, VPS
    "node scripts/orquesta/orquesta.mjs --donde pc", "codex exec 'x'", "codex.cmd exec x", "npx codex exec x",
    "npx @openai/codex exec x", r"node C:\Users\PC\AppData\Roaming\npm\node_modules\@openai\codex\bin\codex.js exec x",
    "claude -p 'x'", "claude", "claude.exe -p x", "claude.cmd -p x", r"C:\Users\PC\.local\bin\claude.exe -p x",
    "npx -y @anthropic-ai/claude-code -p x", "Start-Process claude -ArgumentList '-p x'", "start claude -p x",
    "bash scripts/codex-tarea.sh x", "schtasks /run /tn x", "schtasks.exe /create /tn x", "Start-ScheduledTask x",
    "Register-ScheduledTask -TaskName x", "Set-ScheduledTask x", "Enable-ScheduledTask x", "New-ScheduledTask",
    "ssh root@vps", "ssh.exe root@vps", "sftp root@vps", "wsl ssh root@vps",
    # borrar y gastar
    "Remove-Item -Recurse x", "rm -rf x", "higgsfield generate create x",
    # su propia config y colas paralelas (26-oct)
    "hermes config set approvals.mode off", "hermes.exe cron create x", "hermes kanban add x",
    "hermes.cmd config set approvals.mode off", "hermes-agent 'x'", "hermes-acp", "hermes",
    "python -m hermes_cli.main config set x y", "py -m hermes_cli.main cron create x",
    "hermes plugins install x",
]
good = [
    "git status", "git status -sb", "git log --oneline -5", "git diff origin/main...HEAD", "git show HEAD:AGENTS.md",
    "git fetch origin", "git merge-base origin/main HEAD", "git -C E:/onia-wt/hermes-base log -3",
    "git -C x log", "git rev-parse HEAD", "git worktree list", "git branch -a", "git remote -v",
    "gh issue list --label orquesta", "gh issue list --state closed", "gh issue view 12", "gh issue view 12 --comments",
    "gh -R o/r issue view 1", "gh issue view 1 -R o/r", "gh pr view 5", "gh pr view 5 --json title,mergeable",
    "gh pr diff 5", "gh pr checks 5", "gh pr list", "gh pr list --state merged", "gh run view 1", "gh run list",
    "gh label list", "gh auth status",
    "node scripts/orquesta/cargar-issue.mjs --dry --archivo x", "node scripts/orquesta/cargar-issue.mjs --archivo x",
    "node scripts/orquesta/cargar-issue.mjs --dry --titulo x", "node --test scripts/orquesta/cargar-issue.test.mjs",
    "rg orquesta scripts", "rg deny .claude/skills", "cat E:/onia-wt/hermes-base/.claude/skills/onia-router/SKILL.md",
    "cat hermes-content/docs/ONIA_HARNESS.md", "rg hermes scripts", "cd E:/onia-wt/hermes-base",
    "ls C:/Users/PC/AppData/Local/hermes/pedidos",
    "Get-Content scripts/orquesta/README.md", "cat $(git rev-parse --show-toplevel)/AGENTS.md", "echo $HOME",
    "git log --oneline | head -5", "/c/Program\\ Files/Git/cmd/git status",
]

fails = 0
for titulo, casos, debe in (("tienen que quedar bloqueados", bad, True), ("tienen que pasar", good, False)):
    print(f"--- {titulo}")
    for c in casos:
        p = approval_floors._match_user_deny_rule(c)
        ok = (p is not None) == debe
        fails += not ok
        print("ok  " if ok else "MAL ", "DENY" if p else "PASA", "|", c, "|", p or "")
print(f"bad: {len(bad)}  good: {len(good)}  fallas: {fails}")
sys.exit(1 if fails else 0)
