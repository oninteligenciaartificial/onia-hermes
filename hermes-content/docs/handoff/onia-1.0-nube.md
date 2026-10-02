# Handoff — onia-1.0-nube (carril Plataforma, en la nube)

Sesión saliente: `session_01VGmpNv4eSMnpA3wXrypR4L` (1-oct-2026). La sesión **madre** (local, PC de Sergio Urcullo)
ordena por mensaje (CLAUDE.md §1 «Sesión MADRE local + carriles en la nube»). Las respuestas a la madre se escriben
en el transcript propio: la nube no puede mandar mensajes.
Historia anterior a esta versión: `git log -- hermes-content/docs/handoff/onia-1.0-nube.md`.

## 1. Objetivo

Desarrollar y publicar Onia Platform 1.0 hasta cobrar al primer cliente. Qué sale y qué falta:
`hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` (§6 «Lo que falta para cobrar»).

## 2. Qué quedó EN PRODUCCIÓN (verificado)

- **Plataforma `release-8ff1284d`** (1-oct ~21:05 UTC). `/login` y `/register` cargan sin errores (medido con Chromium).
  - PR #97: «Completada» y «No asistió» solo en citas que ya empezaron (la API da 409); «Ver mi plan» lleva a `/checkout`; la ayuda no ofrece pantallas que el rubro o el rol no pueden abrir.
  - PR #95: Crece con 4 usuarios.
  - PR #96: `POST /api/auth/register` solo acepta los 5 rubros que se venden. Medido en vivo: `vetgest-clinical` y `onia-interna` → 400.
  - PR #92: verificación por WhatsApp en el alta, con interruptor `ONIA_VERIFICACION_WHATSAPP=plantillas` (crea/lee plantillas; NO pide WhatsApp todavía).
- **Web onia.com.bo**: Crece con 4 usuarios; `/privacidad` sin el error React #418 (lo causaba la ofuscación de correos de Cloudflare); título de `/rubros` en móvil arreglado. Verificado con Chromium en 1280 y 390 px.
- **Bot de ventas** desde `c7f44ba5` (textos aprobados por Sergio Urcullo).
- **Plantillas de WhatsApp en Meta:** 4 en revisión. `onia_codigo_verificacion` (AUTHENTICATION) **bloqueada por Meta a nivel cuenta** (code 10 / subcode 2388185). Ver §5.

## 3. Qué quedó a medias y dónde

| Qué | Dónde | Estado |
|---|---|---|
| Plan B de verificación inversa (`wa.me`), APAGADO y terminado | ramas `v1/verificacion-inversa` (plataforma) y `wip/bot-verificacion-inversa` (onia-hermes), sin merge | Cómo se enciende: skill `onia-chatbot`. Solo si Meta no habilita la plantilla AUTHENTICATION |
| Web v1 (home nueva + legales) | rama `wip/web-v1-correcciones-20261001` (`15ec950d`), al día con main | Espera el OK de Sergio Urcullo; se la muestra la madre. Con el OK: merge a main + publicar landing |
| SIAT: runner que valida cada paquete | `/opt/onia-siat/runner-20260929/emisor-v2/` + rama `wip/siat-validar-cada-paquete` | Comandos de VI y IX en `BITACORA.md`, **sin lanzar**: esperan las capturas del portal que pide la madre |
| Respuestas con datos de la ayuda (deuda, stock) leen tablas del pack dental | — | Anotado: revisar la fuente para comercio, importadora y servicios |

## 4. Archivos

- Catálogo 1.0: `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`.
- Competencia por dentro: `hermes-content/research/competencia/PRODUCTO_COMPETENCIA_RESUMEN.md` + 4 teardowns.
- Capacidades de las sesiones: `hermes-content/docs/ONIA_CAPACIDADES_DE_LAS_SESIONES.md`.
- Bitácora SIAT (VPS): `/opt/onia-siat/runner-20260929/BITACORA.md`.

## 5. Intentos fallidos e hipótesis falsas

- **Plantilla AUTHENTICATION:** el error es de cuenta, no de contenido. Falla igual con payload mínimo y por `upsert_message_templates`. Ya descartado: negocio verificado, WABA aprobada, salud OK. Falta probar: método de pago y lo que muestre WhatsApp Manager. **No** usar una UTILITY con el código.
- **SendMessage desde la nube:** bloqueado («this cloud session cannot message other sessions yet»).
- **Ping a la sesión de Control por `create_trigger`:** no contestó. Sergio Urcullo descartó los mensajes programados.
- **YouTube** bloquea la IP de la nube: los videos de la competencia se ven desde la PC (ids en cada teardown).
- **Los «primeros candidatos a cobrar» eran falsos:** «Tienda La Esquina» es la demo y «Bolivian electricidad» es una org de la lista «no tocar». El único lead real, Importadora Rojas, no tiene contacto válido.
- Turbopack entra en pánico con `node_modules` symlinkeado en worktrees: usar `--webpack`.

## 6. Qué depende de Sergio Urcullo (lo canaliza la madre)

- Sesión de Facebook en la PC para la plantilla del código y la configuración de pagos de la WABA.
- Aprobar el pago de prueba en `/admin/payments` (superadmin) cuando la madre avise.
- Capturas del SIAT: filas 4 y 6, «Listado de Etapas» y CAFC.
- OK a la web v1 y a los legales.
- Chip prepago para la prueba del WhatsApp del cliente.

## 7. Próximos pasos (en orden)

1. Esperar los mensajes de la madre: OK de la web v1, aviso del pago de prueba, capturas del SIAT, resultado de la plantilla en Meta.
2. Pago de prueba de punta a punta cuando la madre avise.
3. **Producto, según la competencia:**
   - **Recordatorio por WhatsApp con botones Confirmar / Cancelar / Reprogramar** (4 de 5 lo tienen). Necesita la primera conexión real de un número de cliente.
   - Después, el presupuesto por fases desde el odontograma.
4. SIAT: con las capturas, lanzar VI (motivos 2-4) y IX con `emisor-v2`, como dice la bitácora.
