"use client";

import { useState } from "react";
import { ModuleToggle } from "@/motion";
import styles from "./landing.module.css";

const INICIAL = [
  { label: "Gestión", on: true },
  { label: "Agentes IA", on: true },
  { label: "WhatsApp", on: true },
  { label: "Página web", on: false },
  { label: "Reserva online", on: false },
  { label: "Automatizaciones", on: false },
] as const;

/**
 * La maqueta del paso 03, pero VIVA: los interruptores se tocan de verdad
 * (ModuleToggle del kit). "Encendé módulos" deja de contarse y se prueba —
 * la animación explica el producto, no decora. Es solo demo: no persiste ni
 * llama a nada.
 */
export function ModulesDemo() {
  const [mods, setMods] = useState<readonly { label: string; on: boolean }[]>(INICIAL);

  return (
    <div className={styles.mods}>
      {mods.map((mod, i) => (
        <span
          key={mod.label}
          className={`${styles.mod} ${mod.on ? styles.modOn : ""}`}
        >
          {mod.label}
          <ModuleToggle
            on={mod.on}
            label={`Módulo ${mod.label} (demostración)`}
            onToggle={(next) =>
              setMods((prev) =>
                prev.map((m, j) => (j === i ? { ...m, on: next } : m)),
              )
            }
          />
        </span>
      ))}
    </div>
  );
}
