# Handoff — madre-local (sesión MADRE, en la PC de Sergio Urcullo)

Regla: CLAUDE.md §1. Método (ids, canales, cómo se delega a Codex, tokens): **skill `onia-sesion-madre`**.
Este archivo es el ESTADO al **5-oct, 20:40 UTC**, cuando Sergio Urcullo pidió «cambio de sesión madre».
La madre saliente (`cfdce1bb…`, rama `claude/onia-sesion-madre-77f719`, worktree `infra-loops-revision-3fc7b1`) llevaba
días abierta y su conversación costó ~777 M de tokens. **La madre nueva arranca de cero y lee solo esto.**

## 0. Al abrir (en este orden)
1. Remote Control encendido; Chrome con la extensión Claude (`list_connected_browsers` ≠ []).
2. `ListAgents`. Cada sesión deja en su transcript un **«RESUMEN PARA LA MADRE NUEVA»** (pedido el 5-oct): leer SOLO ese
   evento con `RemoteTrigger get_run_log` (es lo último de cada transcript). La madre v2 (local
   `local_4cf12f8b-cd4b-4c1a-8900-f37da63ae707`) contesta por SendMessage.
3. No recrear la ronda de 30 min salvo que Sergio Urcullo la pida: gasta tokens sin novedad.

## 1. Objetivo vigente (decidido por Sergio Urcullo, 3/4-oct)
**La 1.0 lista para cobrarle a las primeras 5 clínicas dentales**: `hermes-content/docs/ONIA_PLAN_1.0_Y_CAJA.md`
(15 puntos; los 1-4 para el **16-oct**, todo para el **30-oct**). Orden del negocio de Sergio Urcullo:
1) marca personal + auditorías + llamadas 1 a 1 + comunidad (gratis); 2) la 1.0; 3) competencia (ya cubierta).
Caja de **Bs 4.000**. Gasto fijo de ~Bs 1.611/mes (Codex USD 100, VPS USD 40, Higgsfield anual ya pagado).
Techo para conseguir clientes: **Bs 1.400** (Meta 750). Solo dental hasta tener la factura del SIAT.

## 2. Qué quedó en producción / en main
- **onia-platform master** (verificar el deploy: el handoff de Plataforma decía `release-13b67dda` del 3-oct):
  - #108 (tratamiento a medias en la prueba de 14 días, agenda y cobros, textos a pacientes de **usted**, seguridad B22
    del canal de citas);
  - #109 (punto 12, de Codex: CSV con «;» + WhatsApp de soporte en /help);
  - #111 (punto 2: la factura llega después de verificar el pago y el titular del QR se explica).
  Mergeados del 4 al 5-oct. **Confirmar con Plataforma que están PUBLICADOS y mirados en prod.**
- **Docs en onia-hermes main:**
  - el plan de la 1.0 y la caja;
  - la auditoría de cobro y autoservicio (`research/ONIA_PAGO_AUTOSERVICIO_AUDITORIA.md`);
  - el costo del chatbot (`research/ONIA_COSTO_CHATBOT_META_2026.md`: Bs 390 = ~99 % de margen; Meta le cobra a la
    clínica, con 1.000 mensajes de servicio gratis por número y por mes, verificado en la página renderizada);
  - el mapa de 28 competidores (`research/competencia/MAPA_COMPETENCIA.md` + fichas);
  - el plan de grabación por escena (`docs/cola/plan-3-semanas/PLAN-GRABACION-3-OCT.md`) y el KIT-GRABACION;
  - fichas de montaje y video-intake de los reels (mensaje + tema + edición);
  - el playbook de seguimiento de leads (`sales-kit/SEGUIMIENTO-LEADS.md`);
  - el kit de Lucía (7 fotos + 3 clips, 30,5 cr aprobados por Sergio Urcullo el 3-oct, #118);
  - las capturas del presupuesto por fases (`docs/cola/capturas-presupuesto-fases/`, #116);
  - la corrección fiscal: hoy NO hay IVA a servicios digitales del exterior, solo IUE-BE 12,5 % (#123).

## 3. A medias y dónde
| Frente | Estado exacto | Cómo se retoma |
|---|---|---|
| **Caja diaria (punto 8, Codex)** | onia-platform#110 (draft), rama `codex/punto-8-caja-diaria`, head `83f93948`. APROBADA por la madre v2 en 2 vueltas (9 hallazgos arreglados + 2 LOW; 21 tests verdes). Migración `20261004190000_add_daily_cash` **APLICAR ANTES DEL SWAP**. | Plataforma saca capturas (pedido) → la madre se las muestra a Sergio Urcullo → con su OK lo publica Plataforma. Worktree de Codex: `C:/dev/proyectos/onia-platform-codex-caja` (borrar al mergear). |
| **Presupuesto por fases (P2)** | Separado de #108 y sin publicar. Capturas en main (`docs/cola/capturas-presupuesto-fases/`, 12 PNG). | Mostrárselas a Sergio Urcullo (ya se le mandaron 2 el 5-oct) → con su OK lo publica Plataforma. |
| **SQL de permisos del B22 en prod** | `prisma/migrations/20261003230000_revoke_anon_onia_sends/migration.sql`: solo REVOKE, sin datos. **Falta el OK de Sergio Urcullo** para correrlo. | Pedírselo de nuevo; con su OK textual se lo pasás a Plataforma. |
| **Plantillas A y B para los 6 leads de agosto** | Texto aprobado («está bueno»). Desde la nube el control de permisos frenó crearlas porque la orden vino de la madre. El seguimiento ya está (`sales-kit/SEGUIMIENTO-LEADS.md`). | Sergio Urcullo las crea en WhatsApp Manager o se lo pide directo a Plataforma en esa sesión. Después: «salen». |
| **Meta / pauta** | ONIA Ads sigue SIN tarjeta: a Sergio Urcullo le falta el «control total» de la cuenta publicitaria («Unable to update permissions»). El número del bot **+591 75414930** hay que vincularlo a la página «Onia» («Conectar otro número»; no borrar su celular 78491375). | Configuración de la empresa → Usuarios → Personas → él → control total de ONIA Ads → Métodos de pago → Visa 4028. Verificar con `ads_get_ad_accounts` (`has_payment_method`). La pauta va desde el 16-oct, con reglas de corte (plan §3). |
| **Firma de la respuesta del bot a la pauta** | Versión de USTED en el chat del 3-oct; el commit `363dcf10` está en main sin publicar. | Pedir «firmo»; Ventas actualiza el knowledge y lo publica. |
| **Grabación** | Sergio Urcullo grababa el 3/4-oct con PLAN-GRABACION. | Cuando mande los brutos: T1 de Codex (`docs/handoff/codex-relevo.md`) o Marca → tabla de cortes + preview 360p ANTES de cortar. |
| **Hermes** | #94 en main y apagado. Propuesta: que el autosync deje de hacer fast-forward de main (variable para el integrador). Toca CLAUDE.md. | Sí o no de Sergio Urcullo. Si es sí, los 3 MEDIUM + el cambio del autosync, con revisión fuerte. |
| **Codex** | CLI `0.139` viejo: `gpt-6-*` falla y se usa `-m gpt-5.5`. | Preguntar si se actualiza el CLI (`npm i -g @openai/codex`, pide OK). Cola: `docs/handoff/codex-relevo.md`. |

## 4. Archivos de la madre
`.claude/skills/onia-sesion-madre/SKILL.md` (tokens y delegación a Codex) · `.claude/skills/ver-videos/SKILL.md` (regla
mensaje/tema/edición) · `AGENTS.md` (skills para Codex) · `docs/handoff/codex-relevo.md` · este archivo.

## 5. Intentos fallidos (y su causa)
- **Aviso por Telegram programado vía Hermes (3-oct):** no salió. La nube no entra al VPS si la orden viene de otra
  sesión. Los avisos los manda la madre desde la PC.
- **`codex exec` sin `-m`:** falla (`gpt-6-luna` del config no está soportado; los gpt-6 piden un CLI más nuevo).
- **Codex no puede commitear:** el `.git` del worktree queda fuera del sandbox. Commitea la madre.
- **La madre subió un test rojo (`5c58175c`):** el `grep` de la salida no cortaba la cadena. Ahora hay un gate en el comando.
- **Plantillas y skills editadas «a pedido de otra sesión»:** el control de permisos de la nube las frena
  (Self-Modification, «transacción real»). Lo que es de Sergio Urcullo lo pide él en la sesión destino.
- **«1.000 mensajes gratis» de Meta:** primero se leyó en la ayuda de Wati, después WebFetch trajo una versión vieja que
  decía «sin tramo». La verdad salió de la página **renderizada en Chrome**.
- **Tokens:** la v2 gastó ~425 M y esta madre ~1.840 M, el 95 % releyendo contexto. Madres cortas y workflows de 5
  agentes como máximo.

## 6. Qué depende de Sergio Urcullo (en orden)
1. OK al SQL de permisos del B22 (seguridad, sin datos).
2. Control total de ONIA Ads → tarjeta; número 75414930 en la página.
3. Crear las plantillas A y B en WhatsApp Manager (o pedirlo en la sesión de Plataforma) → «salen».
4. Firmar la respuesta del bot a la pauta.
5. Ver las capturas: el presupuesto por fases (ya están) y la caja diaria (pendientes).
6. Sí o no al cambio del autosync de Hermes. ¿Actualizar Codex?
7. Fechas y techo del plan (16-oct / 30-oct, Bs 1.400). ¿La web y los anuncios pasan a usted?
8. CAFC del SIAT; bucket de respaldos (punto 4); titular del QR con el BCP.

## 7. Próximos pasos (madre nueva)
1. Paso 0 y los resúmenes de cada sesión.
2. Confirmar con Plataforma qué está PUBLICADO (#108, #109, #111) y mirado en prod.
3. Capturas de la caja diaria → Sergio Urcullo → publicar con la migración antes del swap.
4. Destrabar la lista de §6 con Sergio Urcullo, de a una.
5. Siguientes puntos de la 1.0 para Codex (sin pisar a Plataforma): mirar `ONIA_PLAN_1.0_Y_CAJA.md` §1 y elegir los
   cerrados (5, 6, 10 y 11 tocan agenda y pacientes: coordinar con Plataforma antes).
