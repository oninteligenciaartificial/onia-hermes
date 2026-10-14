# Bundle de continuidad — 2026-10-14

Preservación de informes públicos/saneados y evidencias QA autorizadas. No se copian credenciales, mensajes, logs, payloads privados ni datos de autorización. La captura gateway tiene fecha fija y no constituye runtime actual.

| Artefacto | SHA-256 | Procedencia y límite |
|---|---|---|
| `instagram-skills-infra-20261014.md` | `6D1504E3B9998AA23F900B9E5869193BB61A9C33E80D39E88F3A925D6DBCA17C` | Copia del informe leído; caption+gráfica 10/10, audio 0, video temporal parcial, Diagram Design ambiguo; README/licencias, sin revisión de scripts. |
| `x-agent-infrastructure-reference-20261014.md` | `08DDA10715473E465AECE1C9D7950D37CBD6B0811A3D21C5C8DA3F4CA93FBC13` | Copia canónica con corrección editorial derivada de observación directa de Root en Chrome y fuente oficial; origen externo SHA `A8939D0C0F7CAB68FCDF5A3F70A69838765F28904771A0D68E5BF5B4432B500D`. No byte-identical al origen; el 403 inicial queda como antecedente del canal web. |
| `onia-infrastructure-critical-path-20261014.md` | `AA6A76A5E4F18A7A5F9CBC063DF7E2BB147266651DBC389AD5A96389ECE2E4AF` | Copia del informe read-only ya revisado; snapshot puntual, no estado vivo posterior. |
| `gateway-binding-luna-20261014.md` | `7B43BB750E87315E318256AC932ACFFE763DDF26D6C5FE9EABAC88FB0382E1C5` | Informe final saneado; SSH directo funcional en una lectura pública; glob fallido `inspection_failed_unknown`, sin conclusión de ausencia global; hook de aprobación no implementado/UNKNOWN. |
| `hermes-gateway-metadata-20261014.json` | `A9040F8DA109B5F43108FDC3DBED43C220254E24C71BC677901E634A9300C530` | Snapshot AST público fechado: 10/248 candidatos; no inventario total ni estado vivo actual. |
| `readonly-metrics-independent-qa-20261014.md` | `AAEEF1E3CA71CEA42A388CF0C6F62A11D221528E09C61F5BE131B650DD10E60C` | 5 escenarios focales sobre hash inicial del instrumento `E1D97C3B8E9FF50D5C2EB5DBBFBACD478F4D03246448F652042555FCB3338187`; solo fixtures temporales. |
| `readonly-metrics-independent-qa-delta-20261014.md` | `BCDE7FDC559285109F30C5B06F002D4677A044EC35AC6362379856BE53B73117` | 3 escenarios focales sobre instrumento revisado `45931969F759F2CAF32D90C8D07C73FDC297F449A670E4870A8A9629E99035E8`; no suite ni cola real. |
| `work-metrics-snapshot-20261014.json` | `EFE960B86E3E605EBA99BB4026BB55C23D742003E789240101C7A9E2A112B816` | Exportación revisada del autor desde cola existente; este revisor no abrió cola ni repitió export. Solo agregados; ejecución/servido/costo/contexto UNKNOWN. |
| `work-metrics-luna-20261014.md` | `DBEBEA00EAFB3E2CCB7EBD5C7180A4D6512DBAF776E31504318119FB466FD8F7` | Informe del autor, capturado antes de publicar; la frase futura se explica en el recibo de publicación aparte. |
| `metrics-exporter-publication-receipt-20261014.md` | `15CC0142DCAA74A28C01F9CC13D561B78879C7DC98599258826E6652C81400E8` | Estado posterior reportado por el autor: commit `0fb11294ba1018e55523f122d29cc667baddfdfb`, `ls-remote` exacto y worktree limpio. Solo exporter; sin main/merge/deploy. |

La investigación Hermes funciones/modelos ya existe en `hermes-content/research/infra/HERMES-FUNCIONES-Y-MODELOS-20261013.md`; no se duplica. El informe de métricas del autor y su recibo de publicación se preservan separados para mantener correcta la secuencia temporal.

**Nota de preservación:** la QA inicial referencia snapshot previo SHA-256 `4DD92C79159FC99941232EBAC9ED9A644B7AAAE85782CDE7D8B75B42FA7BB76D`; el archivo externo fue reemplazado por la exportación revisada `EFE960...` antes de archivarse su original. Se preserva la QA inicial con sus valores resumidos y el hash original; sus bytes exactos no están en este bundle. No se presenta la exportación nueva como byte-identical al snapshot inicial.
