# Spec — Propuestas comerciales dentro de ONIA Center

Fecha: 2026-07-05 · Pedido por Sergio ("quiero que esto esté en el onia-center").
Ejecuta: carril A (web-factory `src/app/onia-center/**` + `api/onia-center/**`).
Carril C (propuestas) NO toca ese código; esta spec es el contrato entre ambos.

## Objetivo

Que Sergio vea y opere desde ONIA Center (center.onia.com.bo) el pipeline
comercial de propuestas: qué propuestas existen, sus precios ratificados,
quién las abrió y cuándo, sin abrir el repo.

## Qué ya existe (no rehacer)

| Pieza | Dónde |
|---|---|
| Generador + data de propuestas | `hermes-content/propuestas/generador/clientes.json` (8 clientes; campos v3: paquetes con `resultado`+`limite`, portada, comparativa, CTA) |
| PDFs/HTML generados | `hermes-content/propuestas/propuesta-<slug>.{html,pdf}` |
| Pixel de apertura | workflow n8n **"ONIA - Propuesta Abierta (pixel)"** id `UMpcKi7wfMmC9KCw` — `GET /webhook/propuesta-abierta?t=<token>&s=<slug>` → Telegram a Sergio. Probado (ejecución 21418). |
| Variante trackeada | `node generar-propuestas.js <slug> --track <token>` |
| Precios ratificados | `onia-core/ONIA_CATALOGO_COMERCIAL_2026.md` §Decisiones (2026-07-05) |
| Panel Agente Vendedor | ya visible en ONIA Center (sesión great-chandrasekhar 2026-07-05) |

## Alcance de la vista (dentro del Agente Vendedor)

1. **Lista de propuestas**: slug, nombre, título, plan recomendado, precios
   (leer `clientes.json` — en el VPS el repo no está; empaquetar el JSON en el
   build o servirlo vía API que lea el filesystem del contenedor si el deploy
   copia `hermes-content/propuestas`; decidir en la sesión).
2. **Estado por propuesta**: borrador / lista para enviar / enviada (campo
   nuevo `_estado` en clientes.json — carril C lo mantiene; el panel solo lee).
3. **Aperturas**: registro por token con hora y dispositivo.
   - Fuente de datos: agregar al workflow n8n `UMpcKi7wfMmC9KCw` un nodo
     Supabase (credencial `supabaseApi` existente) que inserte en
     `onia_center.propuesta_aperturas` (token, slug, user_agent, opened_at).
     La tabla vive en el MISMO Supabase self-hosted que ya usa el panel
     (stack dentalgest-staging). Crear tabla con migración desde el panel.
   - El panel lee esa tabla igual que lee `onia_center.tasks`.
   - El Telegram directo se mantiene (no reemplazar, sumar).
4. **Links**: abrir HTML/PDF de cada propuesta (si el deploy los incluye) o
   al menos mostrar la ruta canónica del repo.

## Reglas

- No duplicar la fuente de verdad: `clientes.json` sigue siendo del carril C;
  el panel es solo lectura.
- Tocar el workflow n8n = cambio ADITIVO (agregar nodo tras el webhook), no
  modificar el aviso Telegram existente.
- Deploy: el panel del VPS se actualiza manual (ver memoria/runbook deploy
  topology). Coordinar con carril G si hay otro deploy en curso.
- Gates: `tsc --noEmit` + revisar en preview antes de mergear, como carril A.

## Prompt kickoff (copiar en sesión nueva)

```
Sos el carril ONIA CENTER (sesion onia-center-propuestas). Repo onia-hermes,
app web-factory/apps/site. Dueno SOLO de src/app/onia-center/** y
api/onia-center/**. Tarea: integrar el pipeline de propuestas comerciales al
panel del Agente Vendedor segun la spec
hermes-content/docs/ONIA_CENTER_PROPUESTAS_SPEC_20260705.md (leela entera;
define ahi datos, tabla Supabase de aperturas y reglas). No toques
hermes-content/propuestas (carril C). Gates: tsc --noEmit + preview verificado.
Commit conventional, rebase sobre main antes de mergear.
```
