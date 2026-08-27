# Handoff — nit-navegador-issue

Rama `claude/nit-navegador-issue-9b2d2f` · worktree
`C:\dev\proyectos\onia-hermes\.claude\worktrees\nit-navegador-issue-9b2d2f`

**Objetivo**
Averiguar qué traba el NIT / la facturación SIAT mirando el portal en vivo, y dejar el
runner de la Fase 1 parametrizado por los casos que el SIN realmente exige.
*Hecho* = la matriz de casos implementada, con tests, y la documentación escrita.
**Cumplido**, con una salvedad: el runner **todavía no se corrió** contra el piloto —
depende de que Sergio confirme que existe el Punto de Venta 1 (ver abajo).

**Qué quedó EN PRODUCCIÓN**
Nada. Este carril no toca producción: es el runner de homologación (ambiente piloto,
`codigoAmbiente=2`) y documentación. El emisor sigue sin estar deployado como servicio, y
`onia-platform` sigue en modo mock (`SIAT_SERVICE_URL` vacía).

**Qué quedó a medias, y dónde**
- **La corrida.** El código está listo pero no se ejecutó. El siguiente paso es
  `--etapa gate` (6 operaciones de humo) antes del volumen.
- **Etapa VIII (690 casos, firma digital):** sin salida hasta decidir certificado AGETIC
  vs. reducir la solicitud a modalidad computarizada. Sin eso la Fase 1 no llega al 100%.
- **Etapas VI y IX:** el eje de casos está inferido por aritmética (sus totales dividen
  limpio por 2 PdV) pero no se abrió su "Listado de Pruebas". Marcadas `[VERIFICAR]` en
  `STAGE_PLAN`.

**Archivos y cambios**
- `hermes-content/integrations/siat/src/fase1-runner.mjs` — el cambio de fondo:
  `PUNTOS_VENTA` / `DOC_SECTOR_CASES` / `EMISION_CASES` reemplazan el combo hardcodeado;
  `this.combo` + `withCombo()`; `cuisByPv` / `cufdByPv` + `migrateState()`; cada factura
  guarda su combo y anular/revertir filtran por él; `STAGE_TARGETS` pasa a ser por caso y
  aparece `STAGE_TOTALS`; `summary()` reporta contra el total del SIN.
- `hermes-content/integrations/siat/test/fase1-runner.test.mjs` — +22 tests (311 → **333**).
- `hermes-content/docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md` — **nuevo, fuente de verdad del
  trámite**.
- `hermes-content/integrations/siat/README.md` — sección de la matriz de casos + puntero
  al doc de estado.

**Intentos fallidos**
- **Hipótesis descartada: "el problema es haber registrado dos modalidades".** Sostuve que
  la modalidad electrónica duplicaba toda la matriz y que quitarla cortaba ~2.500 casos.
  **Falso.** El request lleva `codigoModalidad` como valor único; la modalidad no
  multiplica nada. Lo único que cuesta la electrónica es la etapa VIII (690). Lo que
  duplicaba era el **punto de venta**, y eso solo se vio abriendo el Listado de Pruebas.
  Moraleja: los 50% clavados tenían una explicación aritmética simple y elegí la
  narrativa antes que la cuenta.
- **Dar por buena la nota heredada.** La memoria y `fase1-state.json` decían "Fase 1
  completa, 1.968 operaciones OK". El portal decía 24,8%. El estado local contaba
  intentos; el SIN cuenta casos distintos. Un checkpoint propio no es evidencia del lado
  del SIN.
- **Manejar el portal `fman` desde una pestaña nueva del MCP de Chrome:** rebota a
  `chrome://newtab`. No arrastra la sesión JSF del launcher. Las capturas las tuvo que
  sacar Sergio. El de `siat.impuestos.gob.bo/v2/launcher/` sí funcionó; el módulo RNC
  cargó en blanco (no confirmado si es caído o la sesión nueva).
- El menú lateral del launcher no abre por click en `ref` ni por coordenadas — el
  screenshot llega escalado raro. Se llegó al RNC por el botón "Ir a RNC" del dashboard.

**Qué depende de Sergio**
1. **Confirmar que existe el Punto de Venta 1** bajo la sucursal 0. Sin él la etapa I no
   cierra: el CUIS se pide por sucursal+PdV. **Bloquea la corrida.**
2. **Llamar al SIN** (800 10 3444 / siat.soporte@impuestos.gob.bo): ¿se puede reducir la
   solicitud 9473 a modalidad Computarizada conservando los casos ya enviados, o hay que
   registrar un sistema nuevo y re-correr?
3. **Los 3 botones de la columna Opciones** del Seguimiento y el menú `≡ ▾` de "Datos de
   Autorización": identificar cuál mueve el estado. **No clickear a ciegas** — alguno
   puede enviar algo irreversible.
4. Decidir camino de la etapa VIII: certificado AGETIC vs. sacar la modalidad electrónica.
5. Aparte del trámite, tres cosas del padrón: F-608 RC-IVA figura recurrente (presentar en
   cero o dar de baja), F-772 Impuesto al Juego no corresponde, F-530 IUE-BE sin usar.

**Próximos pasos**
1. Confirmar PdV 1 *(listo = Sergio lo verifica en el portal)*.
2. `node src/fase1-runner.mjs --etapa gate` *(listo = 6 emisiones + 6 anulaciones + 6
   reversiones OK, una por combo)*.
3. Corrida completa *(listo = el "Listado de Etapas" del portal sube en I, III y IV)*.
4. Cotejar `summary()` contra el portal y ajustar `STAGE_PLAN` en VI/IX si no coincide.
5. Resolver etapa VIII, después solicitar Fase 2 *(listo = estado ≠ INICIADO)*.
6. En paralelo y sin depender del SIN: wrapper HTTP del emisor + deploy contra el piloto,
   para que el día de la autorización el cambio sea una variable de entorno.

**Reloj:** límite de pruebas **04/11/2026**. Faltan 68 días.
