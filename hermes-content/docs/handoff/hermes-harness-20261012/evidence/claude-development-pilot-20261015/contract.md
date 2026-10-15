META: META: implement a small local development-job selector with durable task/attempt receipts and safe pre-effect fallback, not a scheduler/framework. You are Claude, the ONLY implementation author. Root Astra reviews. Operator will run tests. First invoke exactly one custom onia-reader subagent to Read windows_job.py and identify how this helper contains descendants; it must not edit. Then implement ONLY development_job.py and test_development_job.py and a short README.md in current working directory. Do not change reference input files. No Bash/PowerShell/REPL/network/MCP/hooks/Git or installs; use file tools. Tools/permissions are CLI scoped, not OS filesystem sandbox. Never read outside cwd.

PRUEBA: real Claude file tools + custom read-only subagent, tests, one real Codex fallback before effects.
PARADA: local package reviewed by root Astra, no VPS expansion.
Sources: https://code.claude.com/docs/en/cli-reference ; https://code.claude.com/docs/en/sub-agents ; https://code.claude.com/docs/en/permissions .
WindowsJob is process-tree containment, NOT filesystem sandbox. Read rules are best-effort for Glob/Grep. Write paths use Edit permission rules. Parent dontAsk, Agent(onia-reader) only; no Bash/MCP/network.
Primary code author is Claude; operator only creates this contract and operational bootstrap.
Prompt SHA256 b914ef34b3121dffda2166d3e3daa147be534198dd245bd290ddd94d1ced1fd3
Skill full SHA256 88c7a99d8959c215b391f6279556165338b8f5008fde4bd595126fd00d8b1768
Selected section SHA256 f56038812a47434aca2e0b667af123528a13e418805a64df3f934fb3be021eb6
