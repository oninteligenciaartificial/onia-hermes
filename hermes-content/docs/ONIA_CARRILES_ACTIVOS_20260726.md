# ONIA — Carriles activos (2026-07-26)

> Fuente de verdad de quién toca qué. Sergio: *"tenemos otra sesión de ONIA Platform… mirá los
> carriles, mirá las sesiones, mirá los árboles y hacé que no se mezcle."*
> Regla base de `CLAUDE.md`: **1 carril = 1 sesión = 1 worktree = 1 rama = 1 carpeta**.

---

## 1. Las DOS sesiones vivas (y qué es de cada una)

| | **Sesión A — ONIA SYSTEM** (esta) | **Sesión B — ONIA PLATFORM** (la otra) |
|---|---|---|
| **Qué es** | Lo que hace funcionar la empresa **por dentro** | El **producto que se vende** + la marca |
| **Rama** | `claude/onia-colaboradores-sin-inversion-d69b19` | `claude/git-status-935f47` |
| **Worktree** | `.claude/worktrees/onia-colaboradores-sin-inversion-d69b19` | `.claude/worktrees/skills-setup-config-8d4674` |
| **Carpetas propias** | `.claude/skills/**` · `.agents/skills/**` · `web-factory/apps/site/src/app/onia-center/**` · `hermes-content/deploy/vps-ops/**` · `supabase/migrations/**` (schema `onia_center`) | `web-factory/apps/onia-platform/**` · `web-factory/docs/ONIA_BRAND_*` · `hermes-content/infra/vps-db/**` |
| **Frentes** | V (video) · C (chatbot propio) · M (Meta/cuentas) | Plataforma unificada · marca/logo · **migración DentalGest Cloud→VPS** |

**Verificado hoy con `git diff --name-only main...rama`: las dos ramas NO comparten un solo archivo.** Se pueden mergear en cualquier orden.

---

## 2. Los frentes de ESTA sesión (Sesión A)

No chocan entre sí (carpetas distintas), por eso conviven en la misma rama.

| Frente | Qué es | Dónde vive | Estado |
|---|---|---|---|
| **V — Video / Estudio** | Que ONIA vea y edite video sin editores humanos + la campaña de Lucía | `.claude/skills/{ver-videos,editor-videos}` · `apps/site/.../onia-center/components/views/estudio/**` | Motor **terminado y probado**; campaña con 10 piezas cargadas, pieza del día 2 lista |
| **C — Chatbot propio** | El bot que atiende el "DEMO" del embudo (y es la demo viva del producto) | `hermes-content/deploy/vps-ops/bot/**` · `supabase/migrations/2026072*_bot_*` | **Fase 1 construida**: motor 9 estados + guardrails + simulador + 35 tests |
| **M — Meta / cuentas** | Verificar el negocio, página, WhatsApp API, publicación de Lucía | Navegador + `hermes-content/docs/ONIA_META_*` | Portfolio y datos legales **cargados**; falta nombre de página + enviar verificación |

---

## 3. El ÚNICO recurso compartido: el VPS

No hay choque de archivos, pero **sí de máquina**:

- La **Sesión B** va a migrar DentalGest a un stack Supabase propio en el VPS (`/opt/dentalgest-supabase`). Su propio runbook dice: **swap 100% lleno, la caja ya tocó techo en picos**; la migración necesita ~1–1,5 GiB.
- La **Sesión A** escribe al OTRO stack (contenedor `supabase-db`, schema `onia_center`) → **son bases distintas, no se pisan**.

**Reglas duras mientras dure la migración:**
1. **Infra = un solo dueño a la vez. Hoy la tiene la Sesión B.** La A no levanta contenedores nuevos ni corre nada pesado en el VPS.
2. El chatbot (frente C) corre **dentro del n8n que ya existe** → 0 GiB nuevos. Compatible.
3. El **render de video corre LOCAL** (máquina de Sergio), nunca en el VPS. Ya era la regla.
4. Si la A necesita tocar infra: avisar y esperar a que B cierre su ventana de corte.

---

## 4. Qué sigue en cada frente (Sesión A)

**M — Meta (bloquea al chatbot en WhatsApp):**
1. Nombre de página → decisión pendiente (`ONIA · Sistemas con IA`, y ver si el logo se alinea).
2. Categoría: sacar "Agencia de marketing" → software/automatización.
3. Teléfono de la página + email **business@onia.com.bo** (ya creado por Sergio).
4. Página principal del portfolio (hoy "ninguna").
5. **Enviar verificación** con el certificado SEPREC. Desbloquea 2→20 números de WhatsApp.

**C — Chatbot (avanza sin Meta):**
1. Aplicar migración `bot_conversations` + `bot_messages`.
2. Fase 2: workflow n8n + prueba real por **Telegram** (bot nuevo de BotFather; el Command Center ya ocupa el webhook del actual).
3. Fase 3: conectar WhatsApp cuando la verificación pase.
4. **Bloqueo humano:** los 2 horarios de demo (`DEMO_SLOTS` está como placeholder).

**V — Video:**
1. Rehacer la pieza del día 2 cuando haya captura de agenda **con citas cargadas** (hoy el calendario se ve vacío y contradice el guion).
2. Las otras 7 piezas de costo cero (carruseles días 1/4/8 ya generados).
3. Tandas A/B de Higgsfield → **esperan OK de Sergio** con costo verificado (49 cr vs 114 cr).

---

## 5. Datos de la empresa (actualizados 2026-07-26)

- Denominación legal: **OniaAgency** · Matrícula/NIT **5371375010** · vigente hasta 31/08/2028
- Propietaria: **Leslie Mercado Moreno** (madre de Sergio) → firma lo legal y financiero; Sergio opera
- Dirección: Calle Tulipanes Nº 9, Zona Norte, Santa Cruz de la Sierra
- Teléfono / WhatsApp: **+591 78491375** · Web: **onia.com.bo**
- **Email corporativo: business@onia.com.bo** (reemplaza los gmail; usar este en Meta y en la web)

---

## 6. Antinorma (lo que rompió esta sesión y no se repite)

Abrir muchos frentes en un mismo hilo hasta perder el objetivo. **Cada mensaje de trabajo declara su frente (V / C / M)**; lo que aparece fuera del frente se anota acá y se retoma después.
