# Pendientes que salieron del video-intake

Lo que las fichas dejaron como trabajo, ya filtrado y listo para abrir sesión. **No es un
tablero nuevo**: usa el mismo modelo de carriles y la misma regla anti-descarrilamiento de
`../../docs/ONIA_PLAN_ARRANQUE_LIMPIO_20260718.md` (una sesión = una tarea chica = un
"listo" verificable). Cada ítem trae su prompt para pegar.

**Filtro aplicado:** *¿ayuda a vender o cobrar en las próximas semanas?* Por eso Lucía
(SOUL 2.0 / Seedance) y Ganadero OS quedan anotados pero **no se abren** — están en pausa
en el plan vigente.

| ID | Qué | Carril | Estado | Sale de |
|---|---|---|---|---|
| V-1 | Piezas antes/después de las webs entregadas | B web-factory | **listo para abrir** | [web antes/después](2026-08-09-web-antes-despues-find-real-estate.md) |
| V-2 | Cerrar los 3 agujeros de seguridad de prod | G infra | **listo para abrir** | [10 errores](2026-08-09-10-errores-seguridad-apps-ia.md) |
| V-3 | Verificar costo real de SOUL 2.0 / Seedance 2.5 | H (consulta) | **micro-tarea, gratis** | [SOUL 2.0](2026-08-09-higgsfield-soul2-seedance25.md) |
| V-4 | Tiles LTV:CAC + ROAS + toast de venta en Center | A center | **condicionado** | [LIVE OPS](2026-08-09-live-ops-dashboard-maria-wendt.md) |
| V-5 | Campos de consistencia en la skill de video | H | anotado (Lucía en pausa) | [SOUL 2.0](2026-08-09-higgsfield-soul2-seedance25.md) |
| V-6 | Overlay táctico como recurso de demo | H / ventas | anotado | [Supra Vision](2026-08-09-supra-vision-ganado-vision-computacional.md) |
| V-7 | CTA comentario→DM como motor de leads | ventas | manual ya; automático bloqueado por S6 | [INDEX](INDEX.md) |

---

## V-1 · Portafolio antes/después (el que más rápido toca la caja)

**Por qué primero:** el precio está en 790 / 1.500 *porque no hay portafolio*; la línea
premium (2.000 / 4.500) pide 3-5 casos mostrables. Las webs ya existen. Producir esto no
gasta créditos ni depende de ningún token pendiente.

```text
Carril B (web-factory). Corré `git branch --show-current` primero y trabajá en tu worktree.
TAREA ÚNICA: producir 3 piezas verticales antes/después de webs YA entregadas. Nada más.
Formato (de hermes-content/references/video-intake/2026-08-09-web-antes-despues-find-real-estate.md):
  - 0-4 s: wireframe gris de NUESTRO diseño, con rótulo "Cliente: necesito una web de X".
  - 5-17 s: scroll continuo de la web final, mismo encuadre. Rótulo "Después:".
  - Sin voz, sin cara, música. Vertical 9:16.
LISTO = 3 mp4 en hermes-content/references/... + una línea por pieza diciendo de qué cliente es.
NO HAGAS: no mostrar la plantilla base ni mencionar que usamos plantillas (CLAUDE.md pto 8).
No usar como "antes" la web vieja real del cliente sin su OK — usá wireframe propio.
No publicar nada: solo dejar las piezas listas para que Sergio apruebe.
```

## V-2 · Cerrar los 3 agujeros que el video nombró y tenemos abiertos

**Por qué:** no vende, pero **bloquea vender**. Estamos por cobrar por un SaaS que guarda
datos de pacientes y facturación con RLS ausente donde viven los datos, el panel de
Easypanel expuesto sin TLS y el firewall inactivo. Hoy no hay fuga sólo porque
`PGRST_DB_SCHEMAS` no expone esos esquemas — eso es un tapón de configuración, no una
defensa.

```text
Carril G (infra: VPS / Supabase). UN SOLO DUEÑO a la vez. git branch --show-current primero.
TAREA ÚNICA: cerrar los 3 bloqueantes de seguridad de producción, en este orden:
  1. RLS en las tablas donde viven los datos de cliente (no confiar en PGRST_DB_SCHEMAS).
  2. Firewall del VPS activo + panel de Easypanel detrás de TLS y no abierto a internet.
  3. Logging mínimo que permita detectar acceso no autorizado.
LISTO = cada punto verificado EN PRODUCCIÓN (no "aplicado"), con la prueba pegada en la sesión.
NO HAGAS: no tocar features, no migrar datos, no rediseñar el panel. Solo seguridad.
Referencia de los 10 puntos: hermes-content/references/video-intake/2026-08-09-10-errores-seguridad-apps-ia.md
```

## V-3 · Verificar SOUL 2.0 / Seedance 2.5 (5 minutos, costo cero)

Consultar el catálogo de Higgsfield **no gasta créditos**; generar sí. Vale hacerlo aunque
Lucía esté en pausa, porque decide si V-5 tiene sentido.

```text
TAREA ÚNICA (micro): con el MCP de Higgsfield, listar modelos disponibles en la cuenta y
el costo en créditos de: SOUL 2.0 (imagen) y Seedance 2.5 (video). Comparar contra kling.
LISTO = una tabla de 3 filas pegada en la ficha 2026-08-09-higgsfield-soul2-seedance25.md.
NO HAGAS: NO generar ni una imagen ni un video (eso gasta créditos y necesita OK de Sergio).
Verificar además si es cierto lo de "hasta 50 referencias" o es afirmación del creador.
```

## V-4 · LTV:CAC + ROAS en ONIA Center — condicionado

**No abrir todavía.** Estas métricas se calculan sobre ventas reales, y hoy no hay ventas
que dividir. Se abre **cuando haya el primer cliente pagando** o cuando se encienda pauta
real en Meta (el motor está deployado en DRY). Antes de eso serían tiles vacíos.

Cuando toque: tiles `LTV:CAC`, `ROAS`, `AOV` en la vista Finanzas + toast de venta nueva
(ya existe el pipeline de leads con atribución `?src=`).

## V-5 · Consistencia en la skill de video — anotado

Añadir `lock_vestuario`, `raccord_luz` y `timestamps` como campos del brief de generación.
Es la mejora más barata que dejó la tanda, pero **Lucía está en pausa**: no se abre sesión.
Se hace cuando se reactive el carril H.

## V-6 · Overlay táctico como recurso de demo — anotado

Cajas de detección con ID/confianza sobre metraje real, hechas con ffmpeg (sin modelo
entrenado). Sirve para demos de cualquier rubro, no sólo ganadero. **Regla:** si se usa,
se declara que es una demo. Nunca mostrarlo como capacidad instalada.

## V-7 · Comentario→DM — arrancar manual

Cuatro de los seis videos cierran con "comentá X y te mando la guía". Varios de los
recursos que prometen ya los tenemos escritos (los 10 puntos de seguridad, el checklist de
release). **Manual funciona desde hoy** y no depende de nada. La automatización en IG
necesita permisos de mensajería de la Graph API — bloqueo S6 (token IG) — y el costeo de
cualquier embudo que termine en WhatsApp cambia el **1-oct-2026**, cuando se cierra la
ventana gratuita de 24 h.

Se activa naturalmente después de V-1: primero hay que tener qué publicar.
