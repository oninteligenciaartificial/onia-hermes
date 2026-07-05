# CLAUDE.md — ONIA Hermes

Instrucciones de proyecto para Claude. Override sobre defaults.

## Propuestas comerciales (REGLA)

> Fuente de verdad: `hermes-content/skills/propuestas-comerciales-onia.md`
> (skill que lee Hermes en el VPS). Lo de abajo es resumen — al cambiar reglas,
> editar la skill primero.

Toda propuesta a cliente se genera con el sistema en
`hermes-content/propuestas/generador/` (`node generar-propuestas.js <slug> --pdf`).
Nunca escribir HTML de propuesta a mano.

Cada propuesta DEBE cumplir:

1. **Niveles diferenciados con claridad.** Los 3 paquetes no se distinguen por
   "más páginas" sino por un salto de valor:
   - Nivel 1 = estar online (presencia).
   - Nivel 2 = convertir (captar clientes / briefs / leads).
   - Nivel 3 = automatizar (motor de captación + seguimiento, valor recurrente).
   En `notaPaquetes` explicar la diferencia en una línea.

2. **Resultado por paquete** (`resultado`): cada paquete lleva una frase de
   resultado concreto, no solo qué incluye. Ej: "Convertís tu audiencia en briefs".

3. **Propuesta de valor** (`valor[]`): sección "Por qué te conviene" con el ROI
   real — automatización, conseguir más clientes, ahorro de tiempo, autoridad
   para cerrar cuentas más grandes. No vender "una web", vender resultado.

4. **Dominio + hosting a cargo del cliente**, a su nombre. Nunca en nuestro precio.

5. **Costos de terceros excluidos**: dominio, hosting, comisión pasarela,
   créditos IA, mensajería WhatsApp pagada, pauta.

6. **Add-ons especificados**: conexión redes, videos IA, cuidado web,
   pasarela — cada uno con setup y mensual.
   - **WhatsApp**: el botón click-to-chat va INCLUIDO en la web (simple). Lo que
     se cobra como add-on es el **chatbot IA** (responde, califica, deriva solo) —
     no confundir el botón gratis con el chatbot pago.

7. **Pricing**: cobrar la automatización y el resultado, no los píxeles. El
   margen vive en lo recurrente (Cuidado Web / GestiOS / videos). La web única se
   precia para cerrar y abrir el mensual. **Precio de lanzamiento vigente (fase
   sin portafolio, desde 2026-07-03): Landing 790 / Web Pro 1.500.** La línea
   premium (Landing 2,000 / Web Pro 4,500) es el objetivo con 3-5 casos en
   portafolio. Fuente de verdad:
   `hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md` sección 0.

8. **Plantillas internas = confidencial.** Nunca decir al cliente que usamos
   plantillas. Objetivo: maximizar producción.

9. **No fabricar.** Si falta dato del cliente (brochure, sector), no inventar —
   pedirlo o marcarlo. Personalizar con datos reales (cartera, números, sector).

Docs internos de referencia: `PRICING_RATIONALE_INTERNO.md`,
`PLAYBOOK_CONSTRUCCION_INTERNO.md`, `ESTRATEGIA_PLANTILLAS_WEB_INTERNO.md`,
`BCP_PASARELA_CREDENCIALES_INTERNO.md`.

## ONIA Core (REGLA)

> Fuente de verdad: `onia-core/contract.json` (beta v0.5.0, congelado para
> adopcion; ver `onia-core/CHANGELOG.md`). Docs canonicos en `onia-core/*.md`.
> Receta de instalacion en productos: `onia-core/ONIA_CORE_INSTALL_GUIDE_2026.md`.
> DentalGest esta `installing` (9/9 entidades, wizard /setup, intake vivo).

- ONIA Core es el nucleo operativo comun de los SaaS ONIA (DentalGest, GestiOS,
  Ganadero OS, ProveeGest). Vive SOLO en este repo hasta aprobar adopcion.
- `policy.installInProductRepos = false`: NO crear migraciones, rutas ni UI
  dependientes del core en los repos producto sin plan de adopcion aprobado.
- Todo cambio al contrato, schema o adapters DEBE pasar
  `npm run validate:onia-core` antes de commitear.
- Cada entidad nueva del core exige: entrada en `contract.json`, tabla en
  `schema/base-schema.sql` y mapeo en los 3 adapters (el validador lo bloquea).
- Clientes nuevos se mapean a un track vertical, nunca a un fork del core.
  Ver `onia-core/ONIA_CORE_CLIENT_ADOPTION_MAP_2026.md`.
- Integraciones externas (WhatsApp, SIAT, TR4) siguen `external_gate`: fuera
  del core, entran solo como intake normalizado (work items).
- Orden de adopcion: DentalGest beta → Bolivian Electric/ProveeGest → GestiOS
  → Ganadero OS (offline).

## Git — Auto-sync multi-dispositivo (REGLA)

> Trabajamos desde varios dispositivos. Nada debe quedar como archivo local sin
> subir. Todo cambio se sincroniza solo a GitHub.

- Commits: conventional (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- **Auto-sync activado.** Al terminar cualquier trabajo, commitear y pushear los
  cambios a la rama actual sin que el usuario lo pida. Lo hace el hook `Stop`
  (`.claude/settings.json` → `node scripts/git-autosync.js`); también se puede
  correr a mano: `node scripts/git-autosync.js`.
- El autosync respeta `.gitignore`: nunca sube `.env`, claves, `*.pem`,
  `node_modules/` ni cachés. Si creás un archivo con secretos, asegurate de que
  esté ignorado antes de que el autosync corra.
- Assets, fotos, briefs y outputs SÍ se sincronizan (para tenerlos en todos los
  dispositivos).
- El autosync empuja la rama de trabajo y, además, hace **fast-forward de `main`**
  cuando es seguro (avance lineal). Así `main` queda al día solo y todos los
  dispositivos sincronizan con `git pull` en `main`. Si `main` divergió (no es
  FF), no fuerza nada: queda merge manual.
