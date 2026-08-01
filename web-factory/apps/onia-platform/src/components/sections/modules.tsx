"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { ModulePower, ModuleToggle, Reveal, StaggerGrid, StaggerItem } from "@/motion";
import { WA_URL } from "@/lib/site";
import {
  AgendaScene,
  ApprovalScene,
  BookingScene,
  BrowserScene,
  ChatScene,
  FlowScene,
} from "./module-scenes";
import styles from "./modules.module.css";

/**
 * Seccion d — bento asimetrico de 6 modulos, NO 6 cards iguales.
 * Cada tile tiene SU interruptor real (el visitante puede apagar/encender el
 * modulo y ver la mecanica) y una micro-escena que enseña que hace.
 * Al entrar al viewport los modulos se encienden en cascada — la seccion se
 * demuestra sola. reduced-motion: todo encendido de entrada, sin cascada.
 */

type ModuleDef = {
  id: string;
  name: string;
  copy: string;
  big?: boolean;
  Scene: ComponentType<{ active: boolean }>;
};

const MODULES: readonly ModuleDef[] = [
  {
    id: "gestion",
    name: "Sistema de gestión",
    big: true,
    copy: "La base: agenda, clientes, cobros y facturación de tu rubro, en un solo lugar. Se acabó el cuaderno, la planilla y el «después lo paso en limpio».",
    Scene: AgendaScene,
  },
  {
    id: "agentes",
    name: "Agentes con IA, 24/7 — con tu aprobación",
    big: true,
    copy: "Trabajan de noche, los domingos y feriados: detectan huecos, preparan cobros, proponen reprogramaciones. Pero nada sale sin tu OK — cada acción espera tu aprobación en una cola, y vos decidís con un toque.",
    Scene: ApprovalScene,
  },
  {
    id: "chatbot",
    name: "Chatbot de WhatsApp",
    copy: "Tu negocio responde al instante por el canal que todo el mundo usa acá: contesta consultas, califica interesados y te deriva los que valen la pena. El botón de WhatsApp en tu web va gratis; esto es el bot que conversa por vos.",
    Scene: ChatScene,
  },
  {
    id: "web",
    name: "Página web",
    copy: "Tu presencia online, conectada al sistema: lo que publicás y lo que agendás viven en el mismo lugar. Sin diseñador de por medio ni web huérfana que nadie actualiza.",
    Scene: BrowserScene,
  },
  {
    id: "autos",
    name: "Automatizaciones",
    copy: "Los circuitos repetitivos de tu negocio — confirmaciones, avisos de pago, seguimiento — corren solos y quedan registrados. Vos ponés las reglas una vez.",
    Scene: FlowScene,
  },
  {
    // CORREGIDO 2026-07-30: aca habia un modulo "Version local" que prometia
    // correr en el equipo del cliente y sincronizar sin conexion. Eso NO
    // existe —ni en el codigo ni en ningun doc— y ademas se contradecia con
    // lo que la propia pagina dice dos secciones mas arriba. Se reemplaza por
    // la reserva publica de citas, que si esta construida y funcionando
    // (ONIA_PLATFORM_ESTRUCTURA_20260730 §3: ruta /book con confirmacion por
    // token) y ademas vende: el paciente se agenda solo, sin llamar.
    id: "reserva",
    name: "Reserva pública de citas",
    copy: "Tu paciente entra, ve los horarios libres y se agenda solo — a las once de la noche, un domingo, sin que nadie atienda el teléfono. La cita cae directo en tu agenda y queda confirmada.",
    Scene: BookingScene,
  },
] as const;

const CASCADE_MS = 420;

export function Modules() {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();
  const [on, setOn] = useState<boolean[]>(() => MODULES.map(() => false));
  const cascaded = useRef(false);

  // Cascada de encendido al entrar al viewport (una sola vez).
  useEffect(() => {
    if (!inView || cascaded.current) return;
    cascaded.current = true;
    if (reduced) {
      setOn(MODULES.map(() => true));
      return;
    }
    const ids = MODULES.map((_, i) =>
      window.setTimeout(() => {
        setOn((prev) => {
          if (prev[i]) return prev;
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 350 + i * CASCADE_MS),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [inView, reduced]);

  function toggle(i: number, next: boolean) {
    setOn((prev) => {
      const copy = [...prev];
      copy[i] = next;
      return copy;
    });
  }

  return (
    <section id="modulos" className={`section ${styles.section}`}>
      <div className="container">
        <Reveal>
          <p className="kicker">Módulos</p>
          <h2 className="h2">Encendé lo que tu negocio necesita. Ni más, ni antes.</h2>
          <p className="lead">
            Todos viven dentro de la misma cuenta. Ninguno te obliga a migrar,
            reinstalar ni empezar de nuevo.
          </p>
        </Reveal>

        <div ref={gridRef}>
          <StaggerGrid className={styles.bento} stagger={0.06}>
            {MODULES.map((mod, i) => (
              <StaggerItem
                key={mod.id}
                as="article"
                className={`${styles.tile} ${mod.big ? styles.tileBig : ""} ${on[i] ? styles.tileOn : ""}`}
              >
                <header className={styles.tileHead}>
                  <h3 className={styles.tileName}>{mod.name}</h3>
                  <ModuleToggle
                    on={on[i]}
                    onToggle={(next) => toggle(i, next)}
                    label={`Módulo ${mod.name}`}
                    className={styles.tileToggle}
                  />
                </header>
                <ModulePower
                  on={on[i]}
                  placeholder={
                    <span className={`mono ${styles.tileOffNote}`}>
                      apagado — encendelo cuando lo necesités
                    </span>
                  }
                >
                  <p className={styles.tileCopy}>{mod.copy}</p>
                  <div className={styles.tileScene}>
                    <mod.Scene active={on[i]} />
                  </div>
                </ModulePower>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>

        <p className={styles.closing}>
          Los módulos se cotizan según tu caso —{" "}
          <a href={WA_URL}>hablanos y te armamos la cuenta a medida</a>.
        </p>
      </div>
    </section>
  );
}
