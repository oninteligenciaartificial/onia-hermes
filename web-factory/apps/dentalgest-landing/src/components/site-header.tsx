import { APP_URL, WHATSAPP_URL } from "@/lib/constants";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="wordmark">
          DentalGest<span className="wm-dot">.</span>
        </a>
        <nav className="header-actions" aria-label="Acciones principales">
          <a href={APP_URL} className="btn btn-ghost btn-sm gt-sm">
            Entrar a la app
          </a>
          <a href={WHATSAPP_URL} className="btn btn-primary btn-sm">
            <svg
              className="sm-only"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" />
            </svg>
            <span className="gt-sm">WhatsApp</span>
            <span className="sm-only">Demo</span>
            <span className="btn-arrow gt-sm" aria-hidden="true">
              →
            </span>
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
