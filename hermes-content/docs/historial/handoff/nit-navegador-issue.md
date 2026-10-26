# Handoff — nit-navegador-issue

Rama `claude/nit-navegador-issue-9b2d2f` · worktree
`C:\dev\proyectos\onia-hermes\.claude\worktrees\nit-navegador-issue-9b2d2f`

**Objetivo**
Averiguar qué traba el NIT / la facturación SIAT mirando el portal en vivo, y dejar el
runner de la Fase 1 parametrizado por los casos que el SIN realmente exige.
*Hecho* = la matriz de casos implementada, con tests, corrida contra el piloto, y la
documentación escrita. **Cumplido.** Correrla destapó tres bloqueos nuevos que antes
estaban tapados por un fallo genérico; están abajo con su causa exacta.

**Qué quedó EN PRODUCCIÓN**
Nada. Este carril no toca producción: es el runner de homologación (ambiente piloto,
`codigoAmbiente=2`) y documentación. El emisor sigue sin estar deployado como servicio, y
`onia-platform` sigue en modo mock (`SIAT_SERVICE_URL` vacía).

**Sí quedó corriendo contra el piloto** (que es su ambiente): el runner nuevo está en
`/opt/onia-siat/emisor/`, 345 tests verdes ahí también, y el estado local
(`/opt/onia-siat/fase1-state.json`) quedó **sembrado en 1.424**, clavado con el marcador
del portal. Backup del estado previo: `fase1-state.backup-20260827-2152.json`.

**Qué quedó a medias, y dónde**
Se corrió contra el piloto y **cada combo devolvió su propio error**, que es exactamente
lo que el cambio buscaba. De los 6, uno anda y cinco están bloqueados con el motivo
escrito en `blockedCases` del checkpoint:

| Combo | Bloqueo |
|---|---|
| `pv0-ds1-tf1` | **anda** (125/125) |
| `pv1-*` (3) | `933 · EL PUNTO DE VENTA ES INEXISTENTE O INVALIDO` → **crear el PdV 1** |
| `pv0-ds17-tf1` | `EL PARAMETRO ARCHIVO ES INVALIDO … cvc-elt.1.a` → falta el XML del sector 17 |
| `pv0-ds24-tf3` | operaciones de `ServicioFacturacionDocumentoAjuste` sin mapear |

- **Sector 17:** `ROOT_ELEMENTS` en `xml-builder.mjs` solo tiene
  `facturaComputarizadaCompraVenta`. Falta el root element y los campos del XSD de
  hospitales/clínicas.
- **Sector 24:** el servicio ya está en `SIAT_SERVICES` y el runner lo rutea, pero sus
  operaciones se llaman distinto (`recepcionDocumentoAjuste`,
  `anulacionDocumentoAjuste`, `reversionAnulacionDocumentoAjuste`) y no están en
  `soap-client.mjs`. Marcado explícito en `DOC_SECTOR_SIN_SOPORTE`.
- **Etapa VIII (690, firma digital):** sin salida hasta decidir certificado AGETIC vs.
  reducir la solicitud a modalidad computarizada.
- **Etapas VI y IX:** eje de casos inferido por aritmética, no se abrió su "Listado de
  Pruebas". Marcadas `[VERIFICAR]` en `STAGE_PLAN`.

**Archivos y cambios**
- `hermes-content/integrations/siat/src/fase1-runner.mjs` — el cambio de fondo:
  `PUNTOS_VENTA` / `DOC_SECTOR_CASES` / `EMISION_CASES` reemplazan el combo hardcodeado;
  `this.combo` + `withCombo()`; `cuisByPv` / `cufdByPv` + `migrateState()`; cada factura
  guarda su combo y anular/revertir filtran por él; `STAGE_TARGETS` pasa a ser por caso y
  aparece `STAGE_TOTALS`; `summary()` reporta contra el total del SIN. Además:
  `SERVICIO_POR_DOC_SECTOR` (ruteo por sector), `ensureCufd()` + `cufdVencido()`
  (renovación diaria), y `loop()` aísla el fallo de un caso en vez de matar la etapa —
  un prerequisito determinista bloquea en el acto, sin reintentos.
- `hermes-content/integrations/siat/src/soap-client.mjs` — `SIAT_SERVICES` suma
  `ServicioFacturacionDocumentoAjuste` y `ServicioFacturacionElectronica`.
- `hermes-content/integrations/siat/test/fase1-runner.test.mjs` — +34 tests (311 → **345**).
- `hermes-content/docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md` — **nuevo, fuente de verdad del
  trámite**.
- `hermes-content/integrations/siat/README.md` — sección de la matriz de casos + puntero
  al doc de estado.

**Hallazgos de correrlo (lo que no se sabía)**
1. **El PdV 1 no existe** — `SIN 933`. Confirmado, no inferido. Bloquea media matriz.
2. **Cada documento sector tiene su propio servicio SOAP.** Mandarlos todos a
   `ServicioFacturacionCompraVenta` da `995 · SERVICIO NO DISPONIBLE: Para la modalidad 2
   y/o sector N`. 1 → `ServicioFacturacionCompraVenta`, 17 → `ServicioFacturacionComputarizada`,
   24 → `ServicioFacturacionDocumentoAjuste`. Los 4 WSDL del piloto responden 200.
3. **El CUFD caduca a las 24h y el estado sobrevive días.** El guardado era del 6-ago →
   `CUFD FUERA DE TOLERANCIA`. Ahora `ensureCufd()` lo renueva antes de emitir/anular/
   revertir sin contarlo como prueba. Verificado: `cufd_refresh → ok=true`.
4. **El SIN topea cada caso en su cuota**: 500 emisiones locales → contó 125; 250
   anulaciones → contó 125. Por eso el estado sembrado da 1.424 exacto.

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
1. **CREAR el Punto de Venta 1** bajo la sucursal 0 — ya no es "confirmar": el SIN
   respondió `933 · EL PUNTO DE VENTA ES INEXISTENTE O INVALIDO`. **Bloquea 3 de 6 combos
   y la mitad de las etapas por PdV.**
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
1. **Sergio: crear el Punto de Venta 1** *(listo = `--etapa I` obtiene CUIS para pv1)*.
2. Con eso, correr `--etapa gate --retry-blocked` y después las etapas por PdV — se
   desbloquean I, II, III, V, VI, IX y el combo `pv1-ds1-tf1` *(listo = el portal sube)*.
3. **Sector 17**: sacar el root element y los campos del XSD de hospitales/clínicas del
   piloto y agregarlos a `ROOT_ELEMENTS` *(listo = `pv0-ds17-tf1` emite)*.
4. **Sector 24**: mapear `recepcionDocumentoAjuste` y compañía en `soap-client.mjs`, sacar
   `24` de `DOC_SECTOR_SIN_SOPORTE` *(listo = `pv0-ds24-tf3` emite)*.
5. Cotejar `summary()` contra el portal y ajustar `STAGE_PLAN` en VI/IX si no coincide.
6. Resolver etapa VIII, después solicitar Fase 2 *(listo = estado ≠ INICIADO)*.
7. En paralelo y sin depender del SIN: wrapper HTTP del emisor + deploy contra el piloto,
   para que el día de la autorización el cambio sea una variable de entorno.

**Reloj:** límite de pruebas **04/11/2026**. Faltan 68 días.
