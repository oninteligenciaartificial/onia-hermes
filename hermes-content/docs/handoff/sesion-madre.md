# Sesión principal de Onia Platform y plan común de venta

> Sergio Urcullo, 30-sep-2026: «como sesión madre me refiero a que aquí manejamos la mayoría de
> cosas, pero tu objetivo es Onia Platform». Quedó así:
> - **«Onia platform development handoff»** es la sesión PRINCIPAL de trabajo: acá se maneja la mayoría
>   de lo de Onia Platform (producto, web pública, SIAT, sales-kit). Su objetivo único es la plataforma:
>   publicar la 1.0 y empezar a venderla. Corre en la nube, entorno **«Onia»**
>   (`env_01BLwXdgpqDS3sx4rg3r2uvg`), con acceso al VPS por la llave revocable `claude-cloud-20260930`.
> - **La orquestación entre sesiones sigue siendo de la sesión de control** («Hermes y Sergio
>   management system»): EL HILO, entrega a Sergio, calendario, tablero. Dos orquestadores se pisan.
> - Cada sesión hace lo suyo con sus propios agentes, hooks y reglas, y se entera solo de lo que le
>   sirve (regla de Sergio del 29-sep). La principal le pasa a las demás solo lo que toca la plataforma.

## 1. Objetivo común (todas las sesiones)

**Empezar a vender.** Etapa 1 de `ONIA_ESTRATEGIA_DE_EMPRESA.md`: 5 clientes pagando.
Sergio, 30-sep: «la 1.0 puede ser una mierda, nadie la quiera comprar». Por eso el plan NO es pulir
más: es **ponerla frente a clínicas reales ya** y cambiar el producto según lo que digan.
Regla: si tras 10 demos nadie quiere pagar, se escuchan las objeciones y se cambia el producto, no el
discurso.

## 2. Plan de 14 días (30-sep → 13-oct)

| Quién | Qué | Hecho cuando |
|---|---|---|
| **Principal (Plataforma)** | Publicar la 1.0 (OK de Sergio dado el 30-sep, «modificable hasta que me guste»); demo dental con datos que muestren los agentes (una cita de mañana sin confirmar, un tratamiento a medias); medición probada (alta con `?utm_source=prueba` guardada con su origen, píxel visto en «Probar eventos») | 5 migraciones aplicadas con respaldo, pantallas miradas en producción, medición vista en vivo |
| **Sergio** | Contestar los 3 pedidos de acceso sin contactar; hablar con 10 clínicas de Santa Cruz (demo); crear cuentas de competencia (Lety y Dapta primero) | 10 conversaciones con objeciones anotadas |
| **Mercado** | Pauta chica de clic a WhatsApp, solo dental (plan en `research/onia-1.0-29sep/CAMPANA_META_ADS.md` + `ONIA_ADQUISICION_Y_PAUTA.md`), nada gastado sin el OK de Sergio | Campaña lista para encender cuando la 1.0 esté publicada |
| **Marca personal** | Contenido que lleve al WhatsApp o a la web con `utm_*` en cada link; nada de «la IA maneja tu negocio» | Cada pieza con su código de origen |
| **Control (Hermes)** | Tablero diario: prospectos, demos, altas, pagos; aviso de alta nueva por la aduana (lee `organizations.signupOrigin`) | Sergio ve el embudo cada mañana |
| **Lucía** | Sigue su carril; no toca venta de Onia salvo pedido | — |

Métricas que mandan: conversaciones calificadas → demos → pruebas activas → primer pago.

## 3. Mapa de sesiones

| Sesión | Dónde | Rama | Es dueña de | Estado / handoff |
|---|---|---|---|---|
| **Onia platform development handoff** (principal) | nube, entorno Onia | ramas `wip/v1-*` (platform y hermes) | onia-platform, web pública (código), SIAT, sales-kit | `handoff/codex-continuar-1.0.md` (bloque «EMPEZÁ ACÁ 30-sep madrugada») en `origin/wip/v1-hermes-20260928` |
| **Hermes y Sergio management system** (control) `session_01BZJvUfEXbqT9wNLJ6n5XZP` | nube | `claude/hermes-jarvis` | entrega a Sergio, EL HILO, calendario, tablero | `handoff/hermes-jarvis.md` |
| **Análisis de mercado Onia Platform** `session_01BnctfaNRsm3ogJ46A7B5P5` | nube | `claude/nice-lamport-5og9lv` | cómo consiguen clientes, pauta Meta Ads, tamaño de mercado | `handoff/mercado-y-pauta.md` |
| **Marca personal: comunidad y contenido** `session_01LV2Djb9n8BgziusUEoJRq7` | local (laptop) | `claude/marca-personal-contenido-ae658c` | guiones, carruseles, publicador IG/Buffer | `handoff/marca-personal.md` |
| **Lucía v4 y Higgsfield** `session_01KdXWrUrmcitf33fEDePwX7` | nube, entorno onia-higgsfield | `claude/confident-ramanujan-j79bkq` | identidad de Lucía, créditos Higgsfield | `handoff/higgsfield-lucia.md` |

Canal entre sesiones de la nube: rutina de un solo disparo (`create_trigger` con
`persistent_session_id` y `run_once_at`) + la sección «EL HILO» de `COORDINATION_MANIFEST.md`.

## 4. Estado por frente (30-sep)

- **1.0 de la plataforma:** candidato `6088e478` en `origin/wip/v1-integracion-20260928` (PR #90),
  suite 8.570 ok; CI de Linux relanzado tras dar 30 s a los tests que recorren el repo. Qué trae y cómo
  se publica: `handoff/codex-continuar-1.0.md`. Página de revisión:
  https://claude.ai/artifact/RLKFmPwBxqaat4gpU1LyCW
- **Web (onia.com.bo):** rama `codex/v1-hermes-20260928` (utm/src/fbclid al registro, ?plan=, píxel
  liviano, política v1.3, nombres de agentes, letra Instrument Sans). Sale con la 1.0.
- **SIAT Fase 1:** 5.222/5.732 (91 %); faltan 410 de VI y 100 de IX. Runner listo en
  `/opt/onia-siat/runner-20260929`, frenado hasta leer el portal. El portal SOLO se lee desde el Chrome
  de la laptop (pestaña donde Sergio inicia sesión); en la nueva interfaz v2 del SIN no se encontró el
  acceso a «Gestión de Autorización de Sistemas (PILOTO)» desde el menú: Sergio abre «Seguimiento de
  Sistemas → 9473 → Listado de Pruebas» y una sesión LOCAL lo lee. Motivos 5/6/7 necesitan CAFC (solo
  Sergio). Vence el 04/11.
- **Competencia:** `research/onia-1.0-29sep/COMPETENCIA_*.md` (SendyPro, ManyChat, Doctocliq por
  dentro; 9 bots desde la web). Regla: ideas para evaluar, no copiar; web viva, no guías. Cuentas que
  faltan: Lety, Dapta, Dentalink, AgendaPro, Rimay, Odoo, Nitro Pro, Kommo, Respond.io, TuDoc.
- **Infra:** llave `claude-cloud-20260930` para que el entorno Onia llegue al VPS (revocable:
  `sed -i '/claude-cloud-20260930/d' /root/.ssh/authorized_keys`). Vigía externo y copia de la base
  fuera del VPS esperan el conector de Cloudflare.

## 5. Lo que depende de Sergio

1. Contestar los 3 pedidos de acceso. 2. Crear cuentas de competencia (Lety y Dapta primero).
3. Autorizar el conector de Cloudflare. 4. Tarjeta y página vinculada en ONIA Ads
(`act_1073680778314945`). 5. SIAT: abrir el Listado de Pruebas en la laptop y sacar el CAFC.
6. Leer la política de privacidad v1.3. 7. Decisiones chicas post-1.0 (lista en el handoff de la
plataforma §7).

## 6. Reglas compartidas (resumen; la fuente es CLAUDE.md)

- Dirigirse siempre a **«Sergio Urcullo»** (canario).
- Velocidad y que no se caiga, primero. No es solo dental: 5 rubros. 2.º rubro a empujar: importadora.
- Nada pago, publicado ni enviado a terceros sin su OK. Nunca crear cuentas de terceros.
- Competencia = ideas, no copiar. La venta nunca exhibe obra ni promete lo que no existe.
- Avisar entre sesiones solo lo que a cada una le sirve.
