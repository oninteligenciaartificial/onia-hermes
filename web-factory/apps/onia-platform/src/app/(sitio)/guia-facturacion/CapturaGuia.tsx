"use client";

import { useId, useRef, useState } from "react";
import g from "./guia.module.css";

/**
 * La captura del lead magnet: UN campo obligatorio, el correo.
 *
 * Por qué así:
 *  · La guía se lee entera sin dar nada (está debajo, indexable). Esto es un
 *    content upgrade, no un muro: el correo compra la HOJA imprimible y el
 *    aviso si el SIN mueve la fecha otra vez. Ya la movió dos veces (y el
 *    30-sep-2026 dejó sin efecto el plazo, RND 102600000038).
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
  const refCorreo = useRef<HTMLInputElement>(null);

  const [correo, setCorreo] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [estado, setEstado] = useState<Estado>("vacio");
  const [error, setError] = useState("");
  // Si el pipeline se lo tragó, el lead NO existe para nosotros: la hoja se
  // entrega igual (es suya), pero el aviso no se promete. 204 = registrado.
  const [registrado, setRegistrado] = useState(false);

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const limpio = correo.trim();

    if (!correoPlausible(limpio)) {
      setError("Revisá el correo: falta el @ o el punto del dominio.");
      // El role="alert" ya lo anuncia, pero el foco se quedaba en el botón:
      // con teclado o lector de pantalla había que volver al campo a ciegas.
      refCorreo.current?.focus();
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
      const respuesta = await fetch("/api/agenda-intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: limpio,
          whatsapp: whatsapp.trim(),
          src,
        }),
      });
      setRegistrado(respuesta.status === 204);
    } catch {
      // Best-effort a propósito: la persona ya cumplió su parte y la hoja es
      // suya. Si el pipeline está caído, se pierde el lead, no la entrega.
      // `registrado` queda en false: la hoja sale igual, el aviso no se promete.
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
        {registrado && (
          <p className={g.listoNota}>
            Tu contacto quedó con nosotros. Dato para tenerlo en cuenta: el SIN
            ya cambió esta regla tres veces: la prorrogó dos y el 30 de
            septiembre dejó sin efecto el plazo.
          </p>
        )}
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
          ref={refCorreo}
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

      {/*
        Acá decía que el correo era «para que te llegue la hoja y el aviso si
        cambia la fecha», y las dos mitades eran falsas: la hoja se entrega en
        pantalla treinta líneas más abajo («Guardala en PDF o imprimila»), y
        del aviso no hay quién lo dispare. Medido el 2026-09-07: el handler del
        intake sólo hace `createOniaCenterEntity("lead", lead)`, esta app no
        tiene una sola biblioteca de correo, y ningún cron vigila al SIN. Lo
        que el dato SÍ hace es quedar como contacto, así que eso es lo que se
        declara. Lo vigila `proposito-del-dato.test.ts`.

        Y el 2026-09-11 la misma frase resultó tener un SEGUNDO defecto que
        aquel arreglo no podía ver, porque miró el PARA QUÉ y no el QUÉ: decía
        «Un correo, nada más» con el campo de WhatsApp a quince líneas y la
        clave `whatsapp` viajando en el `body`. La nota que existe para decir
        con qué nos quedamos negaba el dato más caro de los dos. Ahora nombra
        los dos, y lo vigila `dato-que-se-pide.test.ts`, que además exige que
        `content/legal/privacidad.md` tenga un sujeto para quien deja el
        contacto sin tener cuenta — hasta ese día la política distinguía dos y
        el visitante no era ninguno.
      */}
      {/* El link a la política no es cortesía: el formulario pide datos
          personales y la propia política cita el DS 1793 (consentimiento).
          La nota explicaba el uso pero no ofrecía el documento (A3,
          auditoría 2026-09-11). */}
      <p className={g.formNota}>
        Tu correo y, si querés, tu WhatsApp: nada más. La guía completa está acá
        abajo y se lee sin dejar nada; el contacto queda para hablar de tu caso,
        y no se usa para otra cosa (<a href="/privacidad">política de privacidad</a>).
      </p>
    </form>
  );
}
