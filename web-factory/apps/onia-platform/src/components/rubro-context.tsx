"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { RubroId } from "@/lib/pricing";

/**
 * El rubro elegido es UNA sola decision del visitante y viaja por toda la
 * pagina: lo elige en la seccion de rubros y manda que planes ve en precios y
 * que dice el mensaje de WhatsApp de las puertas. Sin esto, el visitante tiene
 * que volver a explicar quien es en cada seccion.
 *
 * Estado en memoria a proposito: no persiste nada del visitante (misma regla
 * que el wizard /empezar — nada viaja a servidores de Onia).
 */

type RubroCtxValue = {
  rubro: RubroId;
  setRubro: (id: RubroId) => void;
};

const RubroCtx = createContext<RubroCtxValue | null>(null);

export function RubroProvider({
  children,
  inicial = "dental",
}: {
  children: ReactNode;
  inicial?: RubroId;
}) {
  const [rubro, setRubroState] = useState<RubroId>(inicial);
  const setRubro = useCallback((id: RubroId) => setRubroState(id), []);
  const value = useMemo(() => ({ rubro, setRubro }), [rubro, setRubro]);
  return <RubroCtx.Provider value={value}>{children}</RubroCtx.Provider>;
}

/**
 * Devuelve el rubro compartido. Si un componente se usa fuera del provider
 * (por ejemplo una pagina legal), cae a "dental" sin romper: la landing nunca
 * debe reventar por un contexto ausente.
 */
export function useRubro(): RubroCtxValue {
  const ctx = useContext(RubroCtx);
  const [local, setLocal] = useState<RubroId>("dental");
  const fallback = useMemo(
    () => ({ rubro: local, setRubro: setLocal }),
    [local],
  );
  return ctx ?? fallback;
}
