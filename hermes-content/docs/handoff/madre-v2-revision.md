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
