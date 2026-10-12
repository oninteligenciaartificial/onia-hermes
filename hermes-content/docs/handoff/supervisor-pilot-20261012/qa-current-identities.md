# QA registro actual de cinco IDs — 12-oct-2026

Agente /root/qa_independiente, Sol6.1 solicitado, servido no observado. SOLO delta documental; ninguna CLI/401/login/request de workers.

QA leyó por GitHub connector fuente exacta oninteligenciaartificial/onia-hermes, ref codex/cloud-pc-audit-20261011, hermes-content/docs/handoff/codex-cloud-pc-20261011.md. Blob devuelto **ca95a30965b31df7dc5030114caf12dff8d8213e** coincide con madre/worker. Tabla contiene cinco UUID; registro local current-worker-identities.json y HANDOFF-MINIMO.md cotejados sin diferencias en IDs:

| Carril | UUID declarado canónico |
|---|---|
| Platform | 01a12c7e-97e2-7115-8561-0b7658008003 |
| Hermes QA | 01a13170-1c7e-7224-83c1-c5f369052039 |
| Marca | 01a13170-b488-71d9-83f8-12663d5a0013 |
| Lucía | 01a13171-0fdb-72c6-9fdc-81244d7e6006 |
| Ventas | 01a13171-6ac1-771e-b285-52e7284e203a |

Gate metadata/procedencia documental **VALIDADO**. Falta de ID Hermes resuelta documentalmente; NO es observación de UUIDpropio inyectado en runtime ni match backend. Registro marca los cinco live_state=not_observed y own_runtime_thread_id_observed=false; correcto. read/auth/backend_mapping/wake siguen bloqueados/no probados, sin retry401 ni afirmar cinco live.

Snapshots históricos preservados: supervisor-one-shot.json SHA256 **3f28a920d9bc9af7b1c639c3eed87e02b7d91ee673b40fa62757bdbe644f517d**, postpublication-read-gate.json **6e5d9cf1f94b8bbb6bd1594350503a05e1a9b1c156299017c558a1758cca02fb** coinciden con versiones previas; null/not_injected históricos no reescritos. Aceptado delta separado, no retroactividad.

Conservación misma rama privada por fuentes_relevo. Sin otros frentes, nuevas pruebas, loops, instalaciones, login, secretos ni producción.
