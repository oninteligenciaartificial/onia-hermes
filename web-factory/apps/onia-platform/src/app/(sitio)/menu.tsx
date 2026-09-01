"use client";

import { useRef } from "react";
import { NAV_PRODUCTO, NAV_DECIDIR, NAV_LEGAL, EMPEZAR_URL, LOGIN_URL } from "./nav";
import { CTA_ALTA } from "./alta";
import s from "./sitio.module.css";

/**
 * Menú de teléfono. `<dialog>` + `showModal()` a propósito: el navegador ya
 * trae gratis las tres cosas que acá se piden y que a mano salen mal — foco
 * atrapado adentro, Escape que cierra, y el resto de la página inerte.
 *
 * NO hay estado de React que refleje si está abierto. El evento `close` del
 * <dialog> se dispara en una tarea ENCOLADA, así que un `useState` espejo llega
 * tarde y el botón queda mintiendo (aria-expanded="true" con el menú ya
 * cerrado). Sin espejo no hay nada que desincronizar: el botón declara
 * aria-haspopup="dialog", que es lo que corresponde para abrir un modal.
 *
 * Los enlaces son <a> planos: navegan de verdad y el diálogo se va con la
 * página. Cero animación, así que reduced-motion no tiene nada que apagar.
 */
export function MobileMenu() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className={s.burger}
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        <span className={s.burgerBars} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        Menú
      </button>

      <dialog ref={ref} className={s.sheet} aria-label="Menú de secciones">
        <div className={s.sheetInner}>
          <div className={s.sheetTop}>
            <span className={s.wordmark}>
              Onia<b>.</b>
            </span>
            <button
              type="button"
              className={s.sheetClose}
              onClick={() => ref.current?.close()}
            >
              Cerrar
            </button>
          </div>

          <nav className={s.sheetNav} aria-label="Secciones">
            <p className={s.sheetGroup}>Producto</p>
            {NAV_PRODUCTO.map((item) => (
              <a key={item.href} className={s.sheetLink} href={item.href}>
                {item.label}
              </a>
            ))}
            <p className={s.sheetGroup}>Decidir</p>
            {NAV_DECIDIR.map((item) => (
              <a key={item.href} className={s.sheetLink} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={s.sheetFoot}>
            <a className={s.btn} href={EMPEZAR_URL}>
              {CTA_ALTA}
            </a>
            <a className={`${s.btn} ${s.btnLine}`} href={LOGIN_URL}>
              Entrar
            </a>
            <p className={s.sheetLegal}>
              {NAV_LEGAL.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
