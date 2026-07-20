"use client";

import { useEffect, useRef, useState } from "react";

type ChatRole = "user" | "assistant" | "system";
type SystemTone = "warn" | "error" | "info";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  tone?: SystemTone;
}

interface AssistantResponse {
  ok?: boolean;
  mode?: string;
  message?: string;
  answer?: string | null;
}

const NOT_CONFIGURED_MODES = new Set([
  "assistant_not_configured",
  "openai_not_configured",
  "dify_not_configured",
  "configuration_pending",
]);

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "system",
  tone: "info",
  text: "Preguntá sobre leads, tareas, servicios o precios de ONIA Center. Solo veo lo que permite tu rol.",
};

export function AssistantChatPanel() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(0);

  const nextId = () => {
    idRef.current += 1;
    return `m${idRef.current}`;
  };

  // Cerrar con Escape y con click fuera del panel (sin overlay fixed, para no romper el iframe).
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Enfocar el input al abrir.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Auto-scroll al último mensaje.
  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, busy]);

  async function send() {
    const text = question.trim();
    if (!text || busy) {
      return;
    }

    setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
    setQuestion("");
    setBusy(true);

    try {
      const response = await fetch("/api/onia-center/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      let body: AssistantResponse;
      try {
        body = (await response.json()) as AssistantResponse;
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "system", tone: "error", text: "No pude leer la respuesta del asistente." },
        ]);
        return;
      }

      if (body.ok && body.answer) {
        setMessages((prev) => [...prev, { id: nextId(), role: "assistant", text: body.answer as string }]);
        return;
      }

      const tone: SystemTone = NOT_CONFIGURED_MODES.has(body.mode ?? "") ? "warn" : "error";
      const fallback =
        tone === "warn"
          ? "El asistente no está configurado todavía."
          : "No se pudo obtener respuesta del asistente.";
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "system", tone, text: body.message ?? fallback },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "system", tone: "error", text: "Error de red, reintentá." },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        ONIA Bot
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Asistente ONIA Bot"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-40 flex w-[min(92vw,380px)] flex-col rounded-lg border border-border bg-card shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-card-foreground">ONIA Bot</p>
              <p className="text-xs text-muted-foreground">Asistente interno · respeta tu rol</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Cerrar
            </button>
          </div>

          <div ref={listRef} className="flex max-h-[52vh] flex-col gap-2 overflow-y-auto px-4 py-3">
            {messages.map((message) => {
              if (message.role === "system") {
                const toneClass =
                  message.tone === "warn"
                    ? "onia-center-tone-yellow"
                    : message.tone === "error"
                      ? "onia-center-tone-red"
                      : "onia-center-tone-neutral";
                return (
                  <p
                    key={message.id}
                    className={`rounded-md px-3 py-2 text-xs leading-relaxed ${toneClass}`}
                  >
                    {message.text}
                  </p>
                );
              }

              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    isUser
                      ? "self-end bg-secondary text-foreground"
                      : "self-start bg-muted text-foreground"
                  }`}
                >
                  {message.text}
                </div>
              );
            })}
            {busy ? (
              <div className="self-start rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                Pensando…
              </div>
            ) : null}
          </div>

          <div className="border-t border-border p-3">
            <textarea
              ref={inputRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Preguntá algo sobre ONIA Center…"
              className="w-full resize-none rounded-md border border-border bg-background p-2.5 text-sm outline-none focus:border-ring"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Enter envía · Shift+Enter salta línea</span>
              <button
                type="button"
                onClick={() => void send()}
                disabled={busy || question.trim() === ""}
                className="h-8 rounded-md border border-border bg-secondary px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
              >
                {busy ? "Enviando…" : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
