# Handoff — madre v2 (revisión de calidad de las sesiones)

Pedido de Sergio Urcullo, 2-oct-2026: la madre v2 **solo revisa** el trabajo de cada sesión contra los
estándares (`CLAUDE.md`), le avisa a la madre v1 (la que ordena y hace lo de la PC), habla con las sesiones y
marca el plan de cada una. No construye, no publica, no mergea.

**Cómo revisa:** `ListAgents` → `RemoteTrigger get_run_log` de cada sesión de la nube → `git` de su rama y PR →
verificación propia de lo que afirma (se corre, se mira). Ids y canales: skill `onia-sesion-madre`.

## Ronda 1 — 2-oct ~13:20 UTC (main = `84fd0c9e`)

Etapa vigente: **Etapa 1 — 5 clínicas dentales pagando, Bs 3.750/mes** (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7).

### Plan por sesión

| Sesión | Plan (en curso → siguiente) | Estado | Hallazgos de la revisión |
|---|---|---|---|
| **Plataforma** (SIAT runner) | ✅ #99 publicado (`release-af2ded5c`, 12:52) → cuenta de prueba para el chip de Sergio Urcullo → cuenta demo que muestre «Vuelve a citar» encontrando a alguien → barrer el catálogo | 🟢 bien | MEDIO: `ONIA_CATALOGO_DE_VENTA.md` sigue diciendo «NO se puede decir… tratamiento a medias»; se barre recién cuando se MIRE al detector encontrar a alguien. BAJO: la clave de la cuenta de prueba no va a chat/logs/repo (`seguridad-credenciales.md`); la org queda marcada como de prueba |
| **Ventas y pauta** | D1 v3 «Los de mañana» y D4 v3 «Tratamiento a medias» con pantallas reales y marca de la web → OK de Sergio Urcullo → subir a Meta | 🟡 bien hecho, con freno | ALTO: D4 promete algo que el catálogo de `main` prohíbe; no sale a Meta hasta que Plataforma lo vea funcionar y barra el catálogo. MEDIO: render, briefs y salidas sin commitear (rama `claude/lucid-mayer-2ejv6v` 0 commits sobre main) |
| **Marca personal** | Video «modo auto» re-editado (receta 17-sep, sin SFX) → investigar cómo editaba Codex → más imágenes en los 18 carruseles → agendarlos 1/día a las 16:00 | 🟡 freno en publicar | ALTO: los 18 carruseles van a llevar imágenes NUEVAS que Sergio Urcullo no vio; construir y publicar son dos permisos — se le muestra el pack terminado antes de agendar. MEDIO: las imágenes son gasto pago → lote con costo y tope aprobado antes. MEDIO: PR #76 borrador, 32 commits fuera de main y 140 atrás |
| **Lucía v4** | Investigación (0 créditos) → mundo de Lucía y plan v2 → espera OK + capturas de IG de la madre v1 | 🟡 decisión de Sergio | ALTO (estrategia): el plan v2 la viste de «abogada, de todo»; la Etapa 1 vende SOLO dental y el influencer IA es 🔴 «otro producto entero» (§10). Que Sergio Urcullo decida: Lucía solo dental mientras dure la Etapa 1. BAJO: «Stop hook error» en cada turno; 3 PRs/ramas de Lucía abiertas (#78, #82) para consolidar |
| **Hermes-Jarvis** | PR #91: respuesta de pedidos SIN token de Actions (recolector en el VPS) + guarda del autosync para ramas `pedido/*` | 🟢 muy bien (TDD + mutación) | MEDIO: trabaja en HEAD desacoplado → el autosync no lo guarda; crear rama y pushear. MEDIO: toca `scripts/git-autosync.js`, que corre en el Stop de TODAS las sesiones → revisión de la madre antes del merge |

### Transversal

- 🔴 **`main` tiene 2 pruebas en rojo** (verificado por la madre v2 sobre `84fd0c9e`):
  `test:herramientas-desplegadas` (falta la línea `poner` de `onia-vps.sh` ← `scripts/velocidad/vps.sh` en
  `scripts/loops/sincronizar.sh`) y `test:guards-cableados` (`scripts/loops/tandas-v1.test.mjs` no está en
  `npm test`). Ninguna CI de `main` corre `npm test`: nadie se entera. Arreglo de 2 líneas; dueño a asignar.
- 🔴 **Commit local sin publicar `5f0c8aec`** (213 archivos, incluye `pricing.ts`): está en el `main` LOCAL de la
  PC, así que todo worktree local nuevo nace con él y su autosync lo publicaría. La madre v2 nació así y movió su
  rama a `origin/main` antes de escribir nada. Pendiente: que Sergio Urcullo decida publicar o descartar, y
  revisar si otro worktree local ya lo empujó.

### Lo que depende de Sergio Urcullo (de esta ronda)

1. OK al video «modo auto» y ver el pack de los 18 carruseles antes de agendarlos.
2. OK a D1 v3 (D4 espera a Plataforma). Tarjeta en ONIA Ads + reconectar el conector de Meta Ads.
3. Lucía: ¿solo dental mientras dure la Etapa 1? y OK al plan.
4. Qué hacer con `5f0c8aec`.

## Próxima ronda

Re-leer las 5 sesiones; cerrar o arrastrar cada hallazgo con su estado (✅ arreglado / ⏳ / ❌ ignorado).

## Cierre — 3-oct (alcance congelado por Sergio Urcullo el 2-oct)

Ronda automática cancelada a pedido de Sergio Urcullo. Los 4 workflows de fondo murieron el 2-oct 10:28 (La Paz)
al reiniciarse la sesión: se usó lo que habían dejado en su journal y no se relanzaron.

### Resultados por sesión

| Sesión | Hecho (verificado) | A medias | Hallazgos abiertos | Qué cambiaría |
|---|---|---|---|---|
| Plataforma | #99 publicado (`release-af2ded5c`); web v1 + legales 1.3; platform#102 (demo solo superadmin) | cuenta demo (platform#103 abierto); mirar el detector encontrando a alguien; barrer el catálogo | 🔴 CRITICAL #98: el botón del recordatorio se acepta desde el widget web → un anónimo cancela la cita de otro y ve su nombre. HIGH #98 ×3, HIGH #99 (caso B con falsos positivos). La web promete lo que el catálogo prohíbe (/chatbot «entiende fotos», /rubros tratamiento a medias, agente de WhatsApp como disponible, recordatorios por WhatsApp en Términos, factura) | Revisión independiente antes de mergear código que va a producción: hoy se mergea sola (#93 entró con 0 checks) |
| Ventas | D1/D4 v3 con pantalla real y marca de la web; D4 congelado; sacó «la IA escribe cada mensaje» | subir a Meta (tarjeta + conector) | — | Chequear cada frase contra el catálogo ANTES de renderizar |
| Marca | Video N03 re-editado; 18 carruseles; lote de 32 imágenes cotizado; molde de edición = Erik Taveras y Santiago Muñoz | video sin OK; carruseles sin agendar | 3 commits fuera de main | Fijar el molde de edición antes de editar (salieron 3 versiones del mismo video) |
| Lucía | Investigación sin gastar; plan v2 con la decisión de la Etapa 1; L02/L05/L08 editados con editor-videos | plan sin OK; prueba de ropa; capturas de IG (madre v1) | HIGH: #82 entró a main por el fast-forward del autosync, sin revisión, con «Hoy soy odontóloga» (IA como profesional de salud) y el chiste «¿Lucía es real? No sé» + «tu agenda llena» | Nada entra a main sin pasar por un PR revisado |
| Hermes-Jarvis | #91 mergeado; #96 (main en verde) y #94 (punto 6) revisados | #96 y #94 esperan el merge de Sergio Urcullo | #94 antes de cargar la llave: respuesta no atada al pedido, tope medido después de bajar, guarda del autosync por nombre de rama (3 MEDIUM) | — (muy buen rigor: TDD + mutación) |
| Madre v2 | Ronda 1; #96 revisado; #94 con revisión fuerte; triage de 5f0c8aec + PR #101 + main local = GitHub + brutos fuera de git (`C:/Users/PC/Videos/ONIA-brutos/2026-09-21/`); conteo y 5 más viejos de 14 competidores | capturas de anuncios (sin OK de gasto); AgendaPro, Doctoralia, Eholo; comparar el próximo video de Marca con `FORMULAS-REFERENTES.md` | — | Revisión proporcional al riesgo: usé 12-20 agentes con 3 refutadores para todo (~100 M tokens) |

### Transversal
- El fast-forward del autosync mete `claude/*` a main sin ninguna revisión (#82 y #76 entraron así).
- La regla «se publica sin preguntar» dice «revisión», pero no define quién revisa.
- `main` sigue en rojo hasta que se mergee #96.
- El merge de un PR de otra sesión lo frena el control de permisos de las dos madres: queda para Sergio Urcullo.

### Estado al reiniciar la PC (3-oct)
- Sergio Urcullo aprobó los 4 puntos. **#96 mergeado** (`19681b6b`): main vuelve a verde.
- **#101 (rescate de 5f0c8aec)** actualizado contra main (`cf6dfa17`, MERGEABLE/CLEAN). El único conflicto era la cadena `test` de
  package.json, y quedaron las dos: tandas-v1 y acceso-local. En verde en Windows: guards-cableados,
  herramientas-desplegadas y acceso-local. Lo mergea la madre v1.
- **#94** lo actualiza Hermes contra main. Antes de cargar la llave de la rutina hay que cerrar los 3 MEDIUM (arriba).
- CRITICAL #98, las promesas de la web y Lucía («que no se identifique como odontóloga pero que tenga la ropa») los
  pasó la madre v1 a Plataforma y a Lucía.
- **Pendiente de la madre v2 para cuando se retome:**
  1. Capturas de anuncios: la madre v1 dijo que Sergio Urcullo las aprobó el 3-oct; confirmarlo con él antes de gastar. Faltan además AgendaPro, Doctoralia y Eholo. Hacerlas
     chicas, un anunciante por vez, y no en un workflow grande.
  2. Comparar el próximo video de Marca contra `hermes-content/references/marca-personal/FORMULAS-REFERENTES.md`
     (campos «Edición»; molde Erik Taveras y Santiago Muñoz).
  3. Verificar que Plataforma cerró el CRITICAL de #98 (prueba + publicado + mirado).
- Para retomar: `ListAgents`; esta tabla; la skill `onia-sesion-madre`. Revisión proporcional al riesgo (lo fuerte solo
  para root en el VPS, producción, plata o git-autosync.js) y workflows de hasta 5 agentes.
