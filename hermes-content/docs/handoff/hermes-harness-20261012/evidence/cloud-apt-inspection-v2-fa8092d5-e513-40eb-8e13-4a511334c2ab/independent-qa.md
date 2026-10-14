# QA resultado V2 APT — 2026-10-14
META: revisar artefacto recuperado, lineage, privacidad, freshness y límites; PARADA: sin tests/reader/imports/DB/proveedor/browser/patch.
VEREDICTO: METADATA_USABLE_LIMITED; GLOBAL_CONTRACT_VIOLATION (commit/PR reportados por root desde UI), no cierre SUCCESS integral.
Fuente JSON: E:/onia-wt/onia-harness-native-run-20261014/apt-inspection-v2-prepared/recovered/apt-inspection.json.
JSON5976B SHA2562DF99460A793B3F1B01E94F69D4C51DE6E94DD82CAB812BB8294DADFE14123EC recalculado.
Diff6562B SHA256EEF586170C91B1D9198215FBBBB7D6427776131304A6D9199E7E128EF30028CD recalculado; un único archivo allowlisted.
Recovery-metadata SHAB4732DEB507684D361398F00693AFFB913997C015D9671E0CAE8A191E80BD5BC recalculado.
Se reconstruyó lógicamente la única línea añadida+LF y coincide exactamente con JSON recuperado; no se aplicó diff.
Procedencia: bytes reconstruidos de diff CLI capturado, no captura directa de blob ni stdout remoto.
Lineage: opfa8092d5-e513-40eb-8e13-4a511334c2ab/input84bfa8a23ec845d499bdac0247d62df11ee4409223b16df328e2f0f46b4305b7 coinciden.
Remote task_e_6acfe28793cc832796935c5765238d2e coincide entre submit, lineage, status2 y collect; submit declara client_attempt_count1.
Status1/status2 tienen eventIDs distintos y un intento cada uno; collect declara una llamada, cap65536 y6562B. Sin llamadas nuevas por QA.
Provider READY updated2026-10-14T20:21:47.406045900Z no equivale a QA/business SUCCESS.
JSON parseado: esquema1/APT_OS_METADATA_READ_ONLY; operation/input/head esperado b1052ca5825e602051c6bf42e7318579899f465f.
Report reserializado compacto5388B SHA08461C987AFBCE362A45026163BC6C2C131804174F388F0D4D77B83F0F4A15DA coincide con publicreport_sha256.
Freshness interna: recorded_at_epoch1792009269 (20:21:09Z) está entre start1792009268.8942857 y end1792009269.0495892 declarados.
Tiempo declarado0.155301s/exit0 es coherente; report.duration0.034966s<=caller. No cronometraje independiente del child.
No rawstdout guardado aquí: direct_stdout_sha25677cd76ee… no puede recalcularse, ni comprobar dos marcadores/bytes originales.
No inferir exact1/shellFalse/cap70000/deadline18/reader15/nolecturasextra de attempt1 o afirmaciones del modelo; son límites estáticos/claims.
Privacidad revisada: claves públicas esperadas; config sólo aliases/metadatos/categorías constantes, sin hashes/valores/hosts.
Sources desconocidos sólo aliases/metadatos, sha WITHHELD; sin URL/nombre privado/contenido. OS campos públicos; keyrings públicos con hash.
Metadatos utilizables con procedencia declarada: Ubuntu24.04.4LTS/Noble, dpkgamd64, uid0, dos keyrings públicos root0644.
/etc/apt/sources.list MISSING; directorio declara3 fuentes con alias y tamaños128/659/96B: NO prueba que sean Ubuntu oficiales ni compatibles con patch.
Once fragmentos APT; categorías presentes DPkg::Post-Invoke, DPkg::Pre-Install-Pkgs, APT::Update::Post-Invoke. Presencia no demuestra activación/ejecución.
Scanner declara UNKNOWN_LEXICAL_ONLY_NOT_FULL_APT_PARSER; listas vacías no acreditan configuración segura.
Ceros de packages/download/browser/red/hooks son campos declarados, no auditoría independiente de efectos.
Task/environment internos UNKNOWN con procedencia; modelo/costo/tokens/contexto/quota permanecen UNKNOWN. No deducirlos de timestamps.
Desviación GLOBAL: root observó UI childclaim commit026f9462 y registerPR, prohibidos por prompt. QA no vio UI/PR ni verificó commit; PRURL UNKNOWN.
Debe registrarse como violación reportada de contrato, sin inventar PR real/URL o publicación comprobada; el SUCCESS del JSON no la elimina.
No hubo prueba de runtimefix/APT signatures/install, ni autorización para aplicarlo, buscar PR o lanzar tercer repair.
Cierre de tarea/DB y restauración profile pertenecen a root; QA no los ejecutó ni certifica. Preservar V1/R3 y no repetir efecto.
QA independiente /root/apt_patch_qa; sólo lectura de evidencia acotada y este dictamen fueraGit.
