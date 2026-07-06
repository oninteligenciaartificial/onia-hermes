/*
 * Logica pura canonica del intake (core). Implementa las normalizationRules del
 * intakePolicy del contrato: canal oficial registrado, dedupe por contacto+canal
 * en 24h, ruteo por routedAreaId/routingRule y asignacion round-robin por carga.
 * Sin estado, sin IO. Referencia unica para que los productos no la dupliquen.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Busca un canal oficial registrado por tipo + direccion. */
export function findChannel(channels = [], channelType, address) {
  return channels.find((channel) => channel?.channelType === channelType && channel?.address === address) ?? null;
}

/** Gobernanza: un mensaje por canal no registrado es una alerta (no se rutea a ciegas). */
export function isRegisteredChannel(channels, channelType, address) {
  return findChannel(channels, channelType, address) !== null;
}

/** Clave de dedupe: organizacion + canal + contacto. */
export function intakeDedupeKey(intake) {
  return [
    intake?.organizationId,
    intake?.channelId ?? "",
    intake?.partnerId ?? intake?.contactKey ?? intake?.from ?? "",
  ].join(":");
}

/**
 * Duplicado si ya existe un intake con la misma clave dentro de la ventana
 * (24h por defecto). Evita crear dos WorkItem por el mismo mensaje/reintento.
 */
export function isDuplicateIntake(existing = [], candidate, { windowMs = DAY_MS, now = new Date().toISOString() } = {}) {
  const key = intakeDedupeKey(candidate);
  const nowMs = new Date(now).getTime();
  return existing.some((item) => {
    if (intakeDedupeKey(item) !== key) {
      return false;
    }
    const createdMs = new Date(item?.createdAt ?? 0).getTime();
    return nowMs - createdMs <= windowMs;
  });
}

/**
 * Responsable segun la regla de ruteo del canal:
 *  - fixed_owner: el ownerId del canal.
 *  - round_robin: el miembro del area con menor carga (empate -> primero).
 */
export function resolveAssignee(channel, areaMemberIds = [], loadByMember = {}) {
  if (channel?.routingRule === "round_robin") {
    let best = null;
    let bestLoad = Infinity;
    for (const memberId of areaMemberIds) {
      const load = Number(loadByMember[memberId] ?? 0);
      if (load < bestLoad) {
        best = memberId;
        bestLoad = load;
      }
    }
    return best ?? channel?.ownerId ?? null;
  }
  return channel?.ownerId ?? null;
}

/**
 * Normaliza un mensaje entrante a un WorkItem draft usando el canal de origen.
 * type/priority pueden venir sugeridos (por IA fuera del core); si no, defaults.
 */
export function normalizeIntake(raw, channel, { now = new Date().toISOString() } = {}) {
  return {
    organizationId: channel?.organizationId,
    type: channel?.intakeWorkItemType ?? raw?.type ?? "solicitud_manual",
    priority: raw?.priority ?? "normal",
    status: "open",
    channelId: channel?.id,
    areaId: channel?.routedAreaId,
    partnerId: raw?.partnerId ?? null,
    title: raw?.title ?? `${channel?.channelType ?? "canal"} - ${raw?.from ?? "entrante"}`,
    createdAt: now,
    payload: raw?.payload ?? {},
  };
}
