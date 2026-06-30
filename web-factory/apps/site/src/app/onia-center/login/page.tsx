"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import "../onia-center.css";

type LoginResult = {
  ok: boolean;
  mode?: string;
  message?: string;
  missingConfiguration?: string[];
};

export default function OniaCenterLoginPage() {
  const searchParams = useSearchParams();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState("Acceso interno. Usa el usuario creado en Supabase Auth.");

  useEffect(() => {
    const reason = searchParams?.get("reason");
    if (reason === "sergio_only") {
      setNotice("ONIA Center completo esta bloqueado para Sergio. Arthur y vendedores deben entrar por /onia-center/equipo.");
      return;
    }

    if (reason === "team_view") {
      setNotice("Tu usuario usa la vista segura del equipo. No carga capital, caja ni estrategia privada.");
      return;
    }

    if (reason === "auth_verify") {
      setNotice("No pude verificar tu perfil activo en ONIA Center. Revisa el mapeo Auth -> user_profiles.");
      return;
    }

    if (reason === "auth_required") {
      setNotice("Inicia sesion para abrir ONIA Center.");
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice("Validando sesion...");

    try {
      const response = await fetch("/api/onia-center/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: login, password }),
      });
      const body = (await response.json()) as LoginResult;

      if (!response.ok || !body.ok) {
        const missing = body.missingConfiguration?.length ? ` Falta: ${body.missingConfiguration.join(", ")}.` : "";
        setNotice(`${body.message ?? "No se pudo iniciar sesion."}${missing}`);
        return;
      }

      const nextPath = searchParams?.get("next") || "/onia-center";
      setNotice("Sesion iniciada. Abriendo ONIA Center...");
      window.location.href = nextPath;
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
            Email o usuario
            <input
              autoComplete="username"
              inputMode="text"
              onChange={(event) => setLogin(event.target.value)}
              placeholder="sergio.urcullo.m"
              required
              type="text"
              value={login}
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
