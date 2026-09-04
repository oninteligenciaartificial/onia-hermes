"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { FinanceEntry } from "@/lib/onia-center-store";

/**
 * Registro manual de movimientos: que entro y que salio, en Bs.
 * Solo lo ve y lo escribe Sergio (la API rechaza a cualquier otro rol).
 */

const API = "/onia-center/api/onia-center/finance/entries";
const FALLBACK_API = "/api/onia-center/finance/entries";

function fmtBs(n: number): string {
  return `Bs ${n.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

async function api(path: "GET" | "POST", body?: unknown): Promise<Response> {
  const init: RequestInit =
    path === "GET"
      ? { method: "GET" }
      : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) };
  const first = await fetch(FALLBACK_API, init);
  if (first.status !== 404) return first;
  return fetch(API, init);
}

export function MovimientosCard() {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [kind, setKind] = useState<"ingreso" | "gasto">("ingreso");
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    let alive = true;
    api("GET")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { entries?: FinanceEntry[] };
        if (alive) setEntries(data.entries ?? []);
      })
      .catch(() => {
        if (alive) setError("No se pudieron leer los movimientos.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amountBs = Number(amount);
    if (!concept.trim() || !Number.isFinite(amountBs) || amountBs <= 0) {
      setError("Concepto y monto (mayor a 0) son obligatorios.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await api("POST", { kind, concept: concept.trim(), amountBs });
      const data = (await res.json()) as { ok?: boolean; entry?: FinanceEntry; message?: string };
      if (!res.ok || !data.ok || !data.entry) {
        setError(data.message ?? "No se pudo registrar.");
        return;
      }
      setEntries((prev) => [data.entry as FinanceEntry, ...prev]);
      setConcept("");
      setAmount("");
    } catch {
      setError("Error de red, reintenta.");
    } finally {
      setBusy(false);
    }
  }

  const ingresos = entries.filter((e) => e.kind === "ingreso").reduce((sum, e) => sum + e.amountBs, 0);
  const gastos = entries.filter((e) => e.kind === "gasto").reduce((sum, e) => sum + e.amountBs, 0);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">Movimientos (registro manual)</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Que entro y que salio, en Bs. Lo registras vos; alimenta el cierre del mes.
          </p>
        </div>
        <p className="shrink-0 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">+{fmtBs(ingresos)}</span>
          {" · "}
          <span className="font-medium text-destructive">-{fmtBs(gastos)}</span>
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-3 flex flex-wrap items-end gap-2">
        <label className="grid gap-1 text-xs text-muted-foreground">
          Tipo
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as "ingreso" | "gasto")}
            className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
          >
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>
        </label>
        <label className="grid min-w-[180px] flex-1 gap-1 text-xs text-muted-foreground">
          Concepto
          <input
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
            placeholder="Web Clinica X · anticipo 50%"
            className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
          />
        </label>
        <label className="grid w-28 gap-1 text-xs text-muted-foreground">
          Monto (Bs)
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            placeholder="750"
            className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="h-8 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Guardando…" : "Registrar"}
        </button>
      </form>
      {error ? <p className="mt-1.5 text-xs text-destructive">{error}</p> : null}

      <ul className="mt-3 divide-y divide-border">
        {loading ? (
          <li className="py-2 text-sm text-muted-foreground">Cargando…</li>
        ) : entries.length === 0 ? (
          <li className="py-2 text-sm text-muted-foreground">
            Sin movimientos todavia. El primero que registres aparece aca.
          </li>
        ) : (
          entries.slice(0, 12).map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3 py-1.5 text-sm">
              <span>
                <span className="text-muted-foreground">{entry.entryDate}</span>
                <span className="ml-2">{entry.concept}</span>
              </span>
              <span
                className={`shrink-0 font-medium tabular-nums ${
                  entry.kind === "ingreso" ? "text-foreground" : "text-destructive"
                }`}
              >
                {entry.kind === "ingreso" ? "+" : "-"}
                {fmtBs(entry.amountBs)}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
