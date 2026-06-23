"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import "../onia-center.css";

type LoginResult = {
  ok: boolean;
  mode?: string;
  message?: string;
  missingConfiguration?: string[];
};

export default function OniaCenterLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState("Acceso interno. Usa el usuario creado en Supabase Auth.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice("Validando sesion...");

    try {
      const response = await fetch("/api/onia-center/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await response.json()) as LoginResult;

      if (!response.ok || !body.ok) {
        const missing = body.missingConfiguration?.length ? ` Falta: ${body.missingConfiguration.join(", ")}.` : "";
        setNotice(`${body.message ?? "No se pudo iniciar sesion."}${missing}`);
        return;
      }

      setNotice("Sesion iniciada. Abriendo ONIA Center...");
      window.location.href = "/onia-center";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido.";
      setNotice(`No se pudo conectar con Auth. ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="onia-login-page">
      <section className="onia-login-panel" aria-label="Login ONIA Center">
        <Link className="onia-login-back" href="/onia-center">
          <ArrowLeft size={16} />
          Volver
        </Link>

        <div className="onia-login-brand">
          <span>
            <ShieldCheck size={22} />
          </span>
          <div>
            <p>ONIA Center</p>
            <h1>Acceso interno</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="onia-login-form">
          <label>
            Email
            <input
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="sergio@onia..."
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <button disabled={isSubmitting} type="submit">
            <LockKeyhole size={16} />
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="onia-login-notice">{notice}</p>
      </section>
    </main>
  );
}
