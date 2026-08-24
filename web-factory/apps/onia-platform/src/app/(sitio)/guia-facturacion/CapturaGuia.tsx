"use client";

import { useId, useState } from "react";
import g from "./guia.module.css";

/**
 * La captura del lead magnet: UN campo obligatorio, el correo.
 *
 * Por qué así:
 *  · La guía se lee entera sin dar nada (está debajo, indexable). Esto es un
 *    content upgrade, no un muro: el correo compra la HOJA imprimible y el
 *    aviso si el SIN mueve la fecha otra vez. Ya la movió dos veces.
 *  · WhatsApp es opcional porque en Bolivia es el canal real, pero pedirlo
 *    como obligatorio en el primer contacto espanta más de lo que suma.
 *  · Ni rubro, ni ciudad, ni nombre del negocio. Cada campo extra es una
 *    razón más para cerrar la pestaña.
 *
 * ENDPOINT: `/api/agenda-intake`, el proxy que ya existe. No se creó endpoint
 * nuevo ni tabla nueva: ese handler reenvía a Onia Center por la red interna
 * del VPS con el secreto compartido, que el browser nunca ve. Responde 204
 * siempre — el registro del lead es best-effort y NUNCA puede quedarse con la
 * hoja de alguien que ya dejó su correo. Por eso el éxito de esta pantalla no
 * depende de que el pipeline conteste bien.
 *
 * ATRIBUCIÓN: `?src=` viaja en la URL de cada canal (guia-siat-bio,
 * guia-siat-dm, guia-siat-ads, guia-siat-facturacion) y se lee de
 * `window.location.search` en el submit. Deliberadamente NO se usa
 * `useSearchParams`: obliga a envolver en <Suspense> y saca la página del
 * prerender estático, y acá el dato solo hace falta al enviar.
 *
 * EL "PDF" es esta misma página impresa (`window.print()` + @media print en
 * guia.module.css). Cero pipeline de PDF, cero storage, cero archivo que se
 * desactualice el día que cambie una RND.
 */

const SRC_POR_DEFECTO = "guia-siat";

/** Suficiente para atajar el dedo gordo; el resto lo dice el rebote del correo. */
function correoPlausible(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
}

type Estado = "vacio" | "enviando" | "listo";

export function CapturaGuia() {
  const idCorreo = useId();
  const idWa = useId();
  const idError = useId();

  const [correo, setCorreo] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [estado, setEstado] = useState<Estado>("vacio");
  const [error, setError] = useState("");

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const limpio = correo.trim();

    if (!correoPlausible(limpio)) {
      setError("Revisá el correo: falta el @ o el punto del dominio.");
      return;
    }
    setError("");
    setEstado("enviando");

    let src = SRC_POR_DEFECTO;
    try {
      src = new URLSearchParams(window.location.search).get("src") || src;
    } catch {
      /* sin URL utilizable: queda el valor por defecto */
    }

    try {
      await fetch("/api/agenda-intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: limpio,
          whatsapp: whatsapp.trim(),
          src,
        }),
      });
    } catch {
      // Best-effort a propósito: la persona ya cumplió su parte y la hoja es
      // suya. Si el pipeline está caído, se pierde el lead, no la entrega.
    }

    setEstado("listo");
  }

  if (estado === "listo") {
    return (
      <div className={g.formListo} role="status" aria-live="polite">
        <p className={g.listoTitulo}>Listo. La hoja es tuya.</p>
        <p className={g.listoTexto}>
          Está completa acá abajo. Guardala en PDF o imprimila para tenerla al
          lado mientras hacés el trámite: sale en una sola página, sin el resto
          del sitio.
        </p>
        <button
          type="button"
          className={g.btnImprimir}
          onClick={() => window.print()}
        >
          Guardar la hoja en PDF
        </button>
        <p className={g.listoNota}>
          Si el SIN vuelve a mover la fecha, te escribimos. Ya lo hizo dos veces.
        </p>
      </div>
    );
  }

  return (
    <form className={g.form} onSubmit={enviar} noValidate>
      <div className={g.campo}>
        <label className={g.label} htmlFor={idCorreo}>
          Tu correo
        </label>
        <input
          id={idCorreo}
          className={g.input}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nombre@tunegocio.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? idError : undefined}
          required
        />
      </div>

      <div className={g.campo}>
        <label className={g.label} htmlFor={idWa}>
          WhatsApp <span className={g.labelOpcional}>opcional</span>
        </label>
        <input
          id={idWa}
          className={g.input}
          type="tel"
          name="whatsapp"
          inputMode="tel"
          autoComplete="tel"
          placeholder="7 000 0000"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </div>

      {error && (
        <p id={idError} className={g.error} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={g.btnEnviar}
        disabled={estado === "enviando"}
      >
        {estado === "enviando" ? "Un segundo…" : "Quiero la hoja"}
      </button>

      <p className={g.formNota}>
        Un correo, nada más. La guía completa está debajo y se lee sin dejar
        nada: el correo es para que te llegue la hoja y el aviso si cambia la
        fecha.
      </p>
    </form>
  );
}
