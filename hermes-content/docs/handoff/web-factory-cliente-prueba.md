# Handoff — carril web-factory: cliente de prueba

> Worktree `hyperframes-onia-export-formats-053cf9` · rama `claude/onia-web-architecture-b37eca` · puerto 4319.
> Sesión del 2026-08-28. Se actualiza EN este archivo (uno por carril).

## Objetivo

Armar la web de un cliente de PRUEBA con el motor `web-factory/` punta a punta
(intake → perfil → receta → out/), en loop de render → mirar → arreglar, y dejar
mapeado cómo se conecta una web de cliente a Onia Platform. Pedido de Sergio
mismo día: el loop además revisa docs/código y agiliza a su paso, sin chocar con
otras sesiones.

## Qué quedó hecho (commit `88111bd1`, pusheado a la rama — NO en producción; el motor no tiene deploy)

- **Cliente de prueba `dental-amanecer`** (Clínica Dental Amanecer, Santa Cruz,
  ficticia): `data/intakes/dental-amanecer.intake.json` → `out/dental-amanecer/`.
  Template `landing-clinic`. 4 iteraciones de loop visual con capturas en 3
  viewports, mirando cada una. Gates: 194 unit + 88 e2e verdes, `images:check` OK.
- **Arreglos de MOTOR que el recorrido destapó** (benefician a todo cliente futuro):
  1. `data/intake-schema.ts` mapea `trustProofs→credenciales`,
     `heroImage→imagenSecundaria` (si hay heroPoster distinto), `content.proceso`
     y `content.faqs`. Antes se tiraban en silencio → el clinic salía sin banda
     editorial, sin proceso y sin FAQ.
  2. `landing-clinic` carga la tipografía del perfil (Google Fonts, rango
     variable `wght@300..900`, un link por familia). El CSS pide peso 820 y sin
     link todo caía al fallback del sistema.
  3. Celda destacada del bento: si hay foto de hero, el vacío 2x2 pasa a franja
     de foto fundida a la tarjeta (texto nunca pisa imagen). Kicker y números de
     proceso al color de acento (antes el acento del intake no existía en pantalla).
- **Docs/skill al día**: skill `onia-web-factory` con los 7 templates reales,
  subagente retirado anotado, y 3 trampas nuevas (mapeo de intake, capturas
  fullPage mienten con lazy+scroll-driven, fuentes variables). `dental-demo.json`
  sin el pendiente de mapeo (cerrado). Carril declarado en `COORDINATION_MANIFEST.md`.
- **Artifact para Sergio**: https://claude.ai/code/artifact/e84e3f0f-6040-492f-a04f-fc05ab2b65be
  (la web empaquetada en un HTML, con dark del sistema de tokens).

## Qué quedó a medias / anotado

- **1 flaky e2e preexistente**: a11y dark de `dental-demo` (axe serious/critical
  no determinista, pasó en retry). Investigar si repite.
- Footer del template clinic: flaco (3 columnas sin jerarquía). Candidato de polish.
- La web ofrece 5 rubros y el catálogo cuenta 3 vendibles; en `onia-platform`
  master la API de servicios profesionales ya deja pasar `patients` pero su nav
  sigue sin la pantalla. Decisión de Sergio, no defecto de la web.

## Intentos fallidos (para no repetir)

- Capturar con `preview_start` (pane no visible en sesión desatendida) → Playwright
  headless con el binario del repo PRINCIPAL vía `createRequire` (worktree sin
  node_modules propio hasta correr install).
- `du`/`ls` de node_modules en el directorio equivocado: el cwd del Bash PERSISTE
  entre llamadas — usar rutas absolutas.
- Primer intake rechazado: `antiReferences` son objetos (no strings) y
  `assetPermission` es enum (`client-owned|generate-ai|stock-licensed|pending`).
- Capturas fullPage «mostraban» huecos que no existían: eran lazy-load sin scroll
  y animaciones `view()` congeladas a 0%. Pase de scroll + `reducedMotion: reduce`.

## Depende de Sergio

- Ver la pieza (Artifact) y decir si este nivel es el listón o se sigue puliendo.
- Si el cliente de prueba se usa como demo interna permanente o se descarta.

## Conexión web ↔ plataforma (mapa, estado real)

Circuito vivo HOY: CTA WhatsApp de la web → número con chatbot de Onia →
conversación en Chatwoot/panel. Los otros 3 (formulario→lead vía n8n con
precedente en forms.onia.com.bo/alta; catálogo→web — falta endpoint público;
reserva→agenda — falta widget) están en
`hermes-content/docs/ONIA_WEB_CONECTADA_AL_SISTEMA.md` (doc de OTRO carril — no
se editó desde acá). n8n tiene dueño de turno (sesión chatbot/infra): nada de
workflows nuevos desde este carril.

## Iteración 2 del mismo día (commit segundo, pusheado)

Pedido de Sergio: *"tiene que poder conectarse al sistema — ¿cómo por API?"* +
*"mejora tus diseños"*. Resuelto:

- **Circuito web→sistema implementado hasta el borde del carril**: el template
  clinic renderiza `inline-quote-form` con `cotizacion` del perfil (form con
  `src=<slug>` de atribución; sin `accion` = invitación centrada con canales
  directos, nunca un form muerto). Intake con passthrough de `cotizacion`.
  Encender el form cuando exista el webhook = UNA línea en el intake.
- **Blueprint API completo** en `web-factory/docs/CONEXION_WEB_SISTEMA_API.md`:
  patrón verificado del producto (`lib/n8n-auth.ts`, header `X-N8N-API-KEY`,
  superficie `/api/n8n/**`), payload propuesto, y TODO por carril: endpoint
  `POST /api/n8n/web-leads` (~40 líneas, carril producto) + workflow `web-lead`
  (carril infra, hoy con dueño de turno).
- **Diseño**: footer clinic rediseñado (marca serif, contacto etiquetado, borde
  de cierre, scoped), banda de pedido con superficie propia, y fix del link
  WhatsApp roto en el footer compartido (teléfono crudo en href → wa.me).
- Gates: 194 unit + 86 e2e verdes, 0 flaky en esta corrida.

## Próximos pasos del loop

1. Investigar el flaky a11y dark (¿contraste real en dark?).
2. Polish del footer clinic.
3. Pasada de verdad sobre `web-factory/FACTORY.md` (lista de templates, comandos).
4. Si Sergio quiere: segundo cliente de prueba de otro rubro (comercio) para ver
   el motor multi-vertical.
