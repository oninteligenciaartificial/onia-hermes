"use client";

// La barra de navegación del sitio.
//
// Pedido de Sergio Urcullo (2026-09-07): «que la barra siga el mismo color,
// pero scrolleás y sale barra blanca» — la mecánica de Hostinger.
//
// ⚠️ Arriba del todo la barra NO es transparente: toma el MISMO verde del hero.
// Parece lo mismo y no lo es. `barras-opacas.test.ts` prohíbe una barra que
// deje pasar el texto de atrás, y nació de un caso real (2026-09-05: el título
// blanco de la sección verde de /chatbot se leía fantasma detrás del nav). Un
// fondo opaco del color del hero da el efecto de continuidad que él pidió sin
// reabrir ese defecto.
//
// El logo cambia con la barra, según el manual de marca (§4-bis de
// ONIA_MARCA_ESTRATEGIA_20260727.md): sobre fondo oscuro va el wordmark claro
// con el punto verde; sobre fondo claro, el wordmark tinta con el punto verde.
// Las dos versiones son ARCHIVOS distintos y se intercambian por CSS, porque un
// SVG externo no hereda `currentColor`.

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CTA_ALTA } from "./alta";
import { EMPEZAR_URL, LOGIN_URL, NAV_HEADER } from "./nav";
import { MobileMenu } from "./menu";
import s from "./sitio.module.css";

/** Relación del viewBox de los assets v2 (1898.3 / 763). */
const RATIO = 2.4879;
const ALTO = 26;

/** Sólo la portada tiene el hero oscuro con el que la barra se funde. */
const RUTAS_CON_HERO_OSCURO = new Set(["/"]);

export function BarraSitio({ children }: { children: React.ReactNode }) {
  const ruta = usePathname();
  const [enElTope, setEnElTope] = useState(true);

  useEffect(() => {
    const mirar = () => setEnElTope(window.scrollY < 8);
    mirar();
    window.addEventListener("scroll", mirar, { passive: true });
    return () => window.removeEventListener("scroll", mirar);
  }, []);

  const sobreElHero = enElTope && RUTAS_CON_HERO_OSCURO.has(ruta ?? "");
  const ancho = Math.round(ALTO * RATIO);

  return (
    <header className={`${s.header}${sobreElHero ? ` ${s.headerSobreHero}` : ""}`}>
      <div className={s.headerInner}>
        <a className={s.wordmark} href="/" aria-label="Onia — inicio">
          {/* Las dos versiones del wordmark. La que no corresponde se oculta con
              `display:none`, así no queda expuesta a lectores de pantalla. */}
          <img
            className={`${s.logoImg} ${s.logoTinta}`}
            src="/brand/v2/onia-logo.svg"
            alt=""
            width={ancho}
            height={ALTO}
          />
          <img
            className={`${s.logoImg} ${s.logoClaro}`}
            src="/brand/v2/onia-logo-dark.svg"
            alt=""
            width={ancho}
            height={ALTO}
          />
        </a>
        <nav className={s.nav} aria-label="Secciones">
          {NAV_HEADER.map((item) => (
            <a key={item.href} className={s.navLink} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={s.headerCta}>
          <a className={s.headerLogin} href={LOGIN_URL}>
            Entrar
          </a>
          {/* El CTA lo pasa el servidor: es el mismo <Btn> del resto del sitio y
              no necesita estado. */}
          {children}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export { CTA_ALTA, EMPEZAR_URL };
