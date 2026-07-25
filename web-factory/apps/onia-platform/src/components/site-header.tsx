"use client";

import { useCallback, useEffect, useState } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { APP_URL, WA_URL } from "@/lib/site";
import styles from "./site-header.module.css";

/* hrefs absolutos ("/#...") para que la nav tambien funcione desde
   las paginas legales (/terminos, /privacidad). */
const NAV = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#rubros", label: "Rubros" },
  { href: "/#modulos", label: "Módulos" },
  { href: "/#bolivia", label: "Bolivia" },
  { href: "/#preguntas", label: "Preguntas" },
] as const;

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") {
      setTheme(attr);
      return;
    }
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("onia-theme", next);
    } catch {
      /* almacenamiento bloqueado: el tema queda solo para esta vista */
    }
  }, [theme]);

  return (
    <button
      type="button"
      className={styles.themeBtn}
      onClick={toggle}
      aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        {theme === "dark" ? (
          <circle cx="8" cy="8" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        ) : (
          <path
            d="M12.8 9.7A5.4 5.4 0 0 1 6.3 3.2a5.4 5.4 0 1 0 6.5 6.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

/**
 * Header sticky delgado. Sin animacion de entrada — el header no compite.
 * El unico estado diseñado es el hover de los links: subrayado que corre
 * (transform scaleX desde la izquierda, ver CSS).
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="/" className={styles.brand} aria-label="Onia — inicio">
          <BrandWordmark height={26} />
          <span className={styles.tagline}>El sistema con IA para tu negocio</span>
        </a>

        <nav aria-label="Secciones" className={styles.nav}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <a href={APP_URL} className={`btn btn-ghost btn-sm ${styles.appCta}`}>
            Entrar a la app
          </a>
          <a href={WA_URL} className="btn btn-wa btn-sm">
            <span className="btn-dot" aria-hidden />
            Hablanos por WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
