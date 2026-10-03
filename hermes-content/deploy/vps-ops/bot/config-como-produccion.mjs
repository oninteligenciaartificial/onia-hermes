// La config del bot de VENTA armada como la arma PRODUCCION hoy — para los tests que miden lo que
// lee un lead. No es codigo del bot: es el molde de los tests de la pauta.
//
// POR QUE EXISTE (3-oct-2026). Los tests de la pauta (frase-de-la-pauta, profesionales-de-la-clinica,
// codigo-del-anuncio, paciente-de-la-pauta, tratamiento-a-medias, que-hacen-a-una-clinica) armaban la
// config con `buildConfig({ slots: HORARIOS }, …)`. Con `--slots` a mano el simulador devuelve
// `agenda: null`, o sea AGENDA PROPIA: los tests certificaban M0 con «**A)** jueves 2 de octubre».
// Desde 2bf4fd0df produccion saluda con M0_PERSONA (sin `ONIA_BOT_AGENDA=calcom` la demo la coordina
// la persona), y «la prueba de dos mensajes» —la condicion de la fila 5 §5.9 para encender la
// pauta— seguia verde midiendo una rama que ningun lead ve.
//
// Lo que produccion tiene hoy en webhook.env: los horarios del cron (`ONIA_BOT_SLOTS`) y Cal.com
// DECLARADO (`CALCOM_*`), sin `ONIA_BOT_AGENDA`. Se escribe eso en un temporal y se lo lee por el
// mismo camino que el simulador (`cargarSlotsPublicados`): si alguien cambia como se elige la rama,
// estos tests lo ven.
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { buildConfig } from "./simulate.mjs";

/**
 * @param {{horarios: string, now: number}} opciones  `now` es el instante del caso: sin el, los
 *   horarios fijos de un test se juzgan con el reloj de la maquina y vencen solos.
 */
export function configComoProduccion({ horarios, now } = {}) {
  if (!Number.isFinite(now)) throw new Error("configComoProduccion: pasá `now`, el instante del caso");
  const dir = mkdtempSync(join(tmpdir(), "onia-config-prod-"));
  try {
    const envFile = join(dir, "webhook.env");
    writeFileSync(
      envFile,
      [`ONIA_BOT_SLOTS="${horarios || ""}"`, "CALCOM_BASE_URL=http://calcom:3000", "CALCOM_BOT_EVENT_TYPE_ID=5", ""].join("\n"),
    );
    return buildConfig({}, { env: {}, envFile, now, warn: () => {} });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
