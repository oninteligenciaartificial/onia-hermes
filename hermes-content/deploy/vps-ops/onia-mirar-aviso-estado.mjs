// Pure notification state: no filesystem, browser, credentials or network.
const SEIS_HORAS = 6 * 3600 * 1000;

export function tituloAviso(aviso, rotas, total) {
  if (rotas > 0) return `🔴 <b>Onia — lo que ve el cliente esta ROTO</b> (${rotas}/${total})`;
  return !aviso.desconocido && aviso.previo.roto === true
    ? "🟢 <b>Onia — las pantallas del cliente volvieron a estar bien</b>"
    : "🟢 <b>Onia — La comprobación actual no detectó alertas</b>";
}

export function planAviso(raw, roto, ahora, forzar = false) {
  if (typeof roto !== "boolean" || !Number.isSafeInteger(ahora) || ahora < 0 || typeof forzar !== "boolean")
    throw new TypeError("estado actual/fecha invalidos");
  const fechaValida = (v) => Number.isSafeInteger(v) && v >= 0 && v <= ahora;
  const valido = raw && typeof raw.roto === "boolean" && fechaValida(raw.ts)
    && (raw.intentoTs === undefined || (fechaValida(raw.intentoTs) && typeof raw.intentoRoto === "boolean"));
  // Unknown history cannot justify a recovery claim; start from healthy baseline.
  const previo = valido ? raw : { roto: false, ts: 0 };
  const cambio = roto !== previo.roto;
  const pendiente = cambio || (roto && ahora - previo.ts > SEIS_HORAS);
  const intentoReciente = previo.intentoRoto === roto && ahora - previo.intentoTs <= SEIS_HORAS;
  const debeAvisar = forzar || (pendiente && !intentoReciente);
  return {
    previo, desconocido: !valido, debeAvisar,
    despues(enviado = false) {
      if (typeof enviado !== "boolean") throw new TypeError("resultado de envio invalido");
      if (!debeAvisar) return { ...previo };
      // Only confirmed delivery advances the notified state/time. Failed attempts
      // retain the pending transition and are bounded by the same six-hour interval.
      return enviado
        ? { roto, ts: ahora, intentoRoto: roto, intentoTs: ahora, ultimoEnvioOk: true }
        : { ...previo, intentoRoto: roto, intentoTs: ahora, ultimoEnvioOk: false };
    },
  };
}
