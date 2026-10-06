# Handoff — madre Codex

Estado: relevo autorizado por Sergio, 5-oct-2026; base Hermes `672d78e8`, desarrollo Platform `5102535c` tras fetch.
Producción Platform `97fe3061` es el release reportado por handoff, sin comprobación nueva propia.
Este archivo es el estado Codex; `madre-local.md` conserva el relevo Claude. No reconstruir transcripts completos.

**Actualización de cierre de turno:** coordinación en PR Hermes #143 (draft), commit inicial `69038fd4`.
Cuota compartida: última consulta 16% usada / 84% restante. C13 #113 tiene CI pendiente de revisión, no aprobado todavía.
C15 `b662d24e` NO aprobado: revisión Astra reprodujo exención fiscal inducida por email mutable del cliente
(`demo-cliente@example.com` → cuenta de la casa). Devuelto a autor C15 para corrección mínima y regresión;
Autor confirmó además onboarding y registro controlables. Decisión técnica local: `Organization.cuentaDeLaCasaVerificada`
con default false, solo SUPERADMIN y audit; API/UI admin mínima, pruebas focales, migración aditiva NO aplicada.
Sin backfill inferido ni confianza en email/slug/track. Conserva QA interna genuina; no crea excepción para clientes.
Marcado de cuentas existentes y activación en producción siguen pendientes de autorización de Sergio.
V2 Astra encontró además P2 C13: retroactividad aplicada tras baja efectiva que no disfrutó gracia.
Autor C13 corrige pasando `planCanceledAt` al cálculo y añade regresión; conserva PR #113.
Arreglo C13 entregado en `7d97f2f34bf655edf03fc406ad4b05f8b0fb2c39`: seis archivos delta; protege también
renovación de addons para no introducir gracia nueva. Autor reporta 133/133 pruebas focales y lint/diff limpios.
V2 Astra recibió revisión focal del nuevo SHA; CI y aprobación todavía pendientes.
Ambas tareas esperan una revisión focal de sus arreglos. No abrir siguiente tanda el 5-oct: terminar correcciones
y revisiones de C13/C15; próxima asignación el 6-oct solo tras verificar cuota y tareas cerradas.

**META:** llevar ONIA a las primeras cinco clínicas que pagan; continuar los cinco carriles sin doble dueño.
**PRUEBA DE HECHO:** cada ítem termina ejecutado y validado, con runbook verificable, o bloqueado por dato/permiso
concreto; siempre SHA, paths, pruebas y revisión. **REGLA DE PARADA:** sin cambio accionable no hay ronda ni mensaje;
publicación, producción, migración, gasto y terceros conservan aprobación específica.

## Dueños y leases

Una madre ordena. La v2 no ordena a carriles ni abre tareas: revisa y respalda. Lease de madre se transfiere SOLO
por entrega explícita registrada (origen, destino, hora, tarea) o Sergio; ni silencio ni límite lo transfieren.
Sergio autorizó mensajes a estos chats Codex. Leer/esperar sus resultados no requiere recrearlos.

| Rol | Chat local Codex | Modelo/lease inicial |
|---|---|---|
| Madre | `01a10f44-2bb7-73c0-8769-8bbe5000b32f` | Sol 6.1 medium solicitado y continuación con model_switch recibida |
| V2 | `01a10f47-3d92-7bb1-b9f4-6979e258a6dc` | #138 Sol entregada; ahora override Astra medium revisión C15; después Sol para coordinación |
| Marca | `01a10f47-f110-7131-b14f-9de1d3241406` | Sol 6.1; inventario entregado, en espera |
| Ventas | `01a10f48-047d-79b2-9bb6-f7addd70c4c7` | Sol 6.1; inventario entregado, en espera |
| Lucía | `01a10f48-8d90-7103-8c17-612244fd5dd5` | Sol 6.1; inventario entregado, en espera |
| Hermes | `01a10f48-99eb-7d43-927f-83c4eebc8d1c` | Sol 6.1; inventario entregado, en espera; no duplicar #138 |
| Platform C13 | `01a10f46-c910-79a3-9670-7e990fcb1257` | Astra medium; draft #113, espera revisión independiente; `codex/punto-13-gracia-y-no-renovar` |
| Platform C15 | `01a10f4a-5dd1-76c3-844e-45b1c360adad` | Astra medium corrige P2; `codex/punto-15-factura-al-aprobar` |

Lease documental madre: `COORDINATION_MANIFEST.md`, `AI_MODEL_ROUTING_2026.md`, skill `onia-sesion-madre` y este archivo,
en rama `codex/madre-orquestacion-20261005`, worktree `C:/Users/PC/.codex/worktrees/madre-codex/onia-hermes`.
Los carriles read-only todavía NO tienen lease para editar. Al asignarla: paths, rama, worktree y SHA base por escrito.
La carpeta raíz Platform `claude/f2-f3-panel` es histórica y sucia: no desarrollar ni limpiar ahí.

## Cola finita y revisión

Máximo **dos tareas de implementación y una revisión** simultáneas. No iniciar trabajo por mantener chats ocupados.
Una tarea por turno, contrato cerrado; cada resultado pasa a revisión sobre SHA exacto. Tras dos intentos del mismo
fallo, registrar evidencia, causa y alternativa segura o dato necesario; no insistir con llamadas idénticas. Un bloqueo
técnico no obliga a parar los demás frentes. La madre toma el siguiente ítem seguro y cierra el resto con dueño.

1. V2 entregó #138 sobre `d479d3aa`: sin bloqueantes nuevos; CI run `37376490476`; autosync22/22 Windows
   (primera pasada21: fixture sin `.git`; dos casos repetidos tras corregir fixture), sintaxis4Bash PASS.
   No pruebas Node Linux locales, ni merge. Conservar este límite de la revisión.
2. C13 hecho en rama: [draft #113](https://github.com/oninteligenciaartificial/onia-platform/pull/113), SHA
   `9f09b067e745e7df0e80087853500baf189902cb`, base `5102535c`, worktree `C:/Users/PC/.codex/worktrees/1de2/onia-platform`
   limpio. Autor reporta suite3646 PASS/1omitida y foco64 PASS, CI pendiente. Revisión propia cruzada Astra no
   reemplaza independiente: v2 revisa DESPUÉS de C15, sin paralelo. No migración; legal/gracia semanal pendientes.
3. C15 terminado por autor, EN REVISIÓN por v2 Astra medium sobre commit exacto
   `b662d24ed349bd3f09b703e124e9742ef8eef57b`; worktree `C:/Users/PC/.codex/worktrees/1752/onia-platform` limpio.
   Autor reporta1137tests/54archivos PASS y lint6TS/TSX PASS; sin push, CI ni QA visual. No convertirlos en verificación
   independiente. Con migración: ningún merge hasta confirmar capacidad facturar SIN. Ambos hechos en rama, NOprod.
   Sin nuevos subagentes; #110 sigue en cola.
4. C14 después de prueba de pago y aprobación casilla legal. C11a siguiente tanda; C11b recién con C11a mergeado.

Plataforma se revisa con Astra; finanzas, permisos y autosync con dos lentes independientes. Docs triviales: una
pasada. No contar comentario de autor o CI solo como revisión de lógica. Gates en checkout propio, evidencia por SHA;
no repetir toda la suite si no hubo cambio o duda nueva. Nada entra a main/master sin revisión.

## Estado contrastado de los cinco carriles

Consulta GitHub y documentos remotos 5-oct; producción/timers abajo son reportes del carril, no medición nueva propia.

| Carril | Estado confirmado y siguiente acción segura |
|---|---|
| Platform | Base desarrollo tras fetch `5102535c`; handoff producción `97fe3061` reporta #108/#109/#111 publicados. Falta QA visual con cuenta. #110 head `83f93948`: CI FAILURE por TS2339 `app/api/caja-diaria/route.ts:254`, `openingFund` en unión; Security SUCCESS. Arreglo/capturas/OK y migración antes swap pendientes. |
| Marca | Handoff 5-oct noche: 11 IG agendados 6–16oct; auditoría **B elegida**, renombrar `/20min`. PR #140 draft `031d8bfc` declara 33 timers IG/LinkedIn/TikTok y control 6oct20:10UTC, sin checks CI. Revisar, no reagendar a ciegas. |
| Ventas | Bot usted #114 en repo, seguimiento #117, mapa #122. D1 debe sacar claim “La IA escribe el mensaje”; D4 congelado hasta detector visto+catálogo. Sin nuevos mensajes/envíos/gasto. |
| Lucía | #118 kit7fotos3clips, D1 ambo decidido sin identificarse odontóloga, consumo reportado52,5/150cr. L02 editado sin publicar. Preparar montaje con pantalla real; no generar más. |
| Hermes | #88/#91/#96/#94 en main. #138 CI SUCCESS, aprobación autosync/3MEDIUM y revisión v2 sin bloqueantes nuevos; no merge. Rutina/llave/aplicar no activados según último handoff; no afirmar salud VPS actual. |

Fuentes: `onia-1.0-nube.md`, `codex-relevo.md`, `marca-personal.md`, `mercado-y-pauta.md`, `higgsfield-lucia.md`,
`hermes-jarvis.md` y PRs abiertos. Auditoría inicial externa: `C:/Users/PC/.codex/tmp/onia-continuidad-audit.md`.
Correcciones necesarias: madre-local todavía dice carruseles sin agendar/A-B sin decidir/autosync esperando sí;
son históricos superados por fuentes anteriores. Plan§5 reserva vieja contradice§2; no cambiar caja como decisión nueva.

## Gates y bloqueos que no se inventan

### Contenido: siguiente entrega para Sergio

Reporte de continuidad: `C:/Users/PC/.codex/tmp/onia-contenido-continuidad.md`. Carril reporta11carruseles del6al16oct,
IG16:00, LinkedIn16:01 y TikTok16:02 Caracas (UTC-4),33timers; publicación real todavía sin probar. Control histórico
Claude6oct16:10 no verificable con tools actuales: no duplicar/reagendar. Próxima verificación registra IDs/URLs publicados.
Sergio solo hace cámara; editor prepara pantallas. Seis guiones canónicos en `cola/plan-3-semanas/GRABAR-2-14-OCT.md`:
DD-A/CACHE, N04/VERIFY, N06/ANTIGRAVITY, D03-A/HOOK, D01-A/SKILL, S2-D08-A/PROMESA. Sus seis brutos faltan;
no sustituir por21sep. Revalidar los tres claims señalados en el reporte antes de pedir grabación. Próxima tarea documental:
actualizar canónicamente `AVISOS-POR-DIA.md` con fechas6oct; no se edita en este relevo. La calificación “SSH autorizado”
del reporte Marca no amplía permiso: ese turno tenía restricción sinSSH y no se toma como autorización.

- Platform: confirmación correo QA de pago y aprobación comprobante PRUEBA; OK textual SQL B22; R2 bucket/token;
  P2 y caja diseño/capturas; capacidad facturar PortalSIN y CAFC del piloto. SIAT exclusivamente manual para Sergio.
- Ventas: control total/tarjeta ONIA Ads y número bot vinculado página; firma respuesta pauta; OK mensajes, plantillas,
  audio/imagen y decisión MUN. Bot deploy frenado por11 tests de firma según carril. No contacto sin permiso.
- Marca: siete carruseles esperan diez láminas (gasto1,20cr/tope1,50 o quitar), N03 aprobación publicación, brutos
  nuevos no disponibles en último inventario. Calendario/AVISOS debe reconciliarse; persistencia de timers tras
  reinicio VPS por verificar (no se comprobó si son transient).
- Lucía: D2–D6, kit/L02 y conexiónIG/etiquetaIA; demo existe pero falta acceso/capturas de este carril.
- Hermes: revisión/merge#138 primero, después rutina/llave/aplicar con alcance aprobado; protegermain es decisión aparte.
- No invocar autosync heredado: `codex/*` puede FFmain igualmente. `claude/*` además tiene integrador histórico.
  Merge Platform master dispara cron cada3hmin50 sin comprobar migraciones: backup/migración antes swap bajo dueño.

Protocolo: `hermes-content/docs/EXECUTION_PROTOCOL.md`; la referencia raíz `HERMES_EXECUTION_PROTOCOL.md` no existe.
Skills ONIA únicas `.claude/skills/`; skills producto en Platform. Cobertura en [`codex-skills-auditoria.md`](codex-skills-auditoria.md):
737 skills leídas mecánicamente,23propias comprendidas completas,714indexadas;232memorias indexadas. Indexar no es
comprender. Leer cuerpos/recetas restantes bajo demanda de cada tarea para preservar cuota, sin afirmar cobertura semántica total.

## Local/cloud y seguimiento

Sergio pide TODO cloud y dedicarse solo a grabar; es el destino, todavía no está validado. Local funciona como fallback.
CLI cloud autenticada y entornos enumerados:
Hermes `6abad782eba0819196ca234dc3abc327`, Platform `6abad6a0aae081919f0b315818becb21`.
Esto NO demuestra ejecución, modelo, repo ni permisos. Login navegador IAB falló; CLI0.139 no permite selección de
modelo verificable. No afirmar cloud listo. Verificar sesión sin duplicar login ni imprimir secretos; ninguna
instalación/actualización sin aprobación. No migrar bóveda/cookies al VPS o cloud.

Comunicación Codex: `send_message_to_thread`; espera compacta `wait_threads` con cursor; inspección `list_threads`/
`read_thread`. No asumir que herramientas Claude miden chats Codex. Navegador autenticado: serializado por madre.
Heartbeat **`madre-onia-continuidad` ACTIVE cada seis horas LOCAL**, creado con herramientas del app. Silencio sin
cambio accionable; solo novedades relevantes. Reserva20% semanal: consumo >=80% no inicia nuevos trabajos, sin
créditos/reset. Consumo cuenta10% frente3% inicial, no atribuible exclusivamente al agente. Compactar reportes y cerrar;
no rondas vacías30min ni cron como sustituto. El heartbeat aún no ejecuta trabajo cloud verificado.

## Cierre de este relevo documental

Archivos preparados para revisión de madre, sin commit/push por el agente documental. Validar `git diff --check`, ids,
enlaces internos y que no existan afirmaciones cloud/producción sin prueba. Guardar commit/PR/SHA al aprobar; este
documento no habilita autosync ni publica cambios por sí mismo.
