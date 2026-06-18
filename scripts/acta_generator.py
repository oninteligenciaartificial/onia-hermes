#!/usr/bin/env python3
"""acta-generator: genera un acta de reunion en Word (.docx) desde notas o audio.

Pipeline (todo free/OSS):
  notas o transcripcion (texto)  ->  LLM (Ollama gratis, respaldo gpt-4o)  ->  Markdown  ->  pandoc  ->  .docx
  audio (--audio)                ->  faster-whisper (OSS) transcribe primero

Uso:
  acta-generator --notes "puntos tratados..." [--title "Reunion semanal"] [--type ordinaria]
  acta-generator --notes-file notas.txt
  acta-generator --audio reunion.m4a
  echo "notas..." | acta-generator -

Salida: crea <assets>/actas/<ts>-<slug>.docx (+ .md) e imprime un JSON con ruta y URL.
Si TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID estan en el entorno, ademas envia el .docx por Telegram.

Variables (de /root/.hermes/.env):
  ENGINE                 auto|ollama|openai   (default auto: intenta Ollama y cae a OpenAI)
  OLLAMA_BASE_URL        default http://localhost:11434/v1
  OLLAMA_MODEL           default qwen2.5:3b
  OPENAI_API_KEY         (para el respaldo / engine openai)
  OPENAI_BASE_URL        default https://api.openai.com/v1
  OPENAI_MODEL           default gpt-4o
  HERMES_ASSETS_DIR      default /var/www/html/hermes-assets
  HERMES_ASSETS_BASE_URL default http://<host>:8099  (para construir la URL publica)
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID  (opcional, para enviar el archivo)
"""
import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
import unicodedata
import urllib.request

ASSETS_DIR = os.environ.get("HERMES_ASSETS_DIR", "/var/www/html/hermes-assets")
ACTAS_SUBDIR = "actas"


def log(msg):
    sys.stderr.write(msg + "\n")
    sys.stderr.flush()


def slugify(text, maxlen=50):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text).strip().lower()
    text = re.sub(r"[\s_-]+", "-", text)
    return (text[:maxlen].strip("-")) or "acta"


def _post_json(url, payload, headers, timeout):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def chat_ollama(messages):
    base = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434/v1").rstrip("/")
    model = os.environ.get("OLLAMA_MODEL", "qwen2.5:3b")
    out = _post_json(
        f"{base}/chat/completions",
        {"model": model, "messages": messages, "temperature": 0.3, "stream": False},
        {"Content-Type": "application/json", "Authorization": "Bearer ollama-local"},
        timeout=300,
    )
    return out["choices"][0]["message"]["content"]


def chat_openai(messages):
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY no esta configurada")
    base = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.environ.get("OPENAI_MODEL", "gpt-4o")
    out = _post_json(
        f"{base}/chat/completions",
        {"model": model, "messages": messages, "temperature": 0.3},
        {"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
        timeout=180,
    )
    return out["choices"][0]["message"]["content"]


def run_llm(messages, engine):
    if engine == "ollama":
        return chat_ollama(messages), "ollama"
    if engine == "openai":
        return chat_openai(messages), "openai"
    # auto: Ollama (gratis) y respaldo OpenAI
    try:
        return chat_ollama(messages), "ollama"
    except Exception as exc:  # noqa: BLE001
        log(f"[warn] Ollama fallo ({exc}); probando OpenAI gpt-4o...")
        return chat_openai(messages), "openai"


def transcribe_audio(path):
    try:
        from faster_whisper import WhisperModel  # type: ignore
    except ImportError as exc:
        raise RuntimeError(
            "faster-whisper no esta instalado. En el VPS: pip install faster-whisper"
        ) from exc
    model_name = os.environ.get("WHISPER_MODEL", "base")
    log(f"[info] Transcribiendo con faster-whisper ({model_name})...")
    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    segments, _info = model.transcribe(path, language="es")
    return " ".join(seg.text.strip() for seg in segments).strip()


SYSTEM_PROMPT = (
    "Eres un asistente que redacta ACTAS DE REUNION formales en espanol.\n"
    "Reglas:\n"
    "- Devuelve SOLO el Markdown del acta, sin texto antes ni despues, sin bloques de codigo.\n"
    "- No inventes datos. Si un dato no aparece en las notas, escribe exactamente: No especificado\n"
    "- No copies estas instrucciones ni textos de ejemplo dentro del acta.\n"
    "- Rellena las tablas con los datos reales de las notas; si no hay datos, deja una sola fila con 'No especificado'.\n\n"
    "Devuelve EXACTAMENTE esta plantilla, reemplazando los valores entre <>:\n\n"
    "# Acta de Reunion - <titulo>\n\n"
    "**Tipo:** <tipo>  \n**Fecha:** <fecha>  \n**Lugar:** <lugar o No especificado>  \n**Hora:** <hora o No especificado>\n\n"
    "## Asistentes\n\n"
    "| Nombre | Rol/Cargo |\n|---|---|\n| <nombre> | <rol> |\n\n"
    "## Orden del dia\n\n"
    "1. <punto>\n\n"
    "## Desarrollo\n\n"
    "<resumen de lo discutido por cada punto>\n\n"
    "## Acuerdos\n\n"
    "- <acuerdo>\n\n"
    "## Tareas\n\n"
    "| Tarea | Responsable | Fecha limite |\n|---|---|---|\n| <tarea> | <responsable> | <fecha o No especificado> |\n\n"
    "## Proxima reunion\n\n"
    "<fecha y hora, o No especificado>\n"
)


def strip_unfilled_placeholders(md):
    """Reemplaza los marcadores <...> que el modelo dejo sin rellenar.

    Modelos pequenos (p.ej. qwen2.5:3b) a veces copian literal '<punto>' o
    '<nombre>' de la plantilla. Se sustituyen por 'No especificado' para que el
    acta no muestre la sintaxis de la plantilla.
    """
    return re.sub(r"<[^<>\n]{1,40}>", "No especificado", md)


def build_messages(notes, title, tipo, fecha):
    user = (
        f"Titulo de la reunion: {title}\n"
        f"Tipo: {tipo}\n"
        f"Fecha: {fecha}\n\n"
        f"NOTAS / TRANSCRIPCION DE LA REUNION:\n{notes}\n\n"
        "Redacta el acta completa siguiendo la estructura indicada."
    )
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user},
    ]


def md_to_docx(md_path, docx_path):
    cmd = ["pandoc", md_path, "-o", docx_path, "--from", "gfm"]
    ref = os.environ.get("ACTA_REFERENCE_DOCX")
    if ref and os.path.isfile(ref):
        cmd += [f"--reference-doc={ref}"]
    subprocess.run(cmd, check=True, capture_output=True, text=True)


def telegram_send_document(path, caption):
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return False
    url = f"https://api.telegram.org/bot{token}/sendDocument"
    boundary = "----actaGenBoundary7MA4YWxkTrZu0gW"
    with open(path, "rb") as fh:
        file_bytes = fh.read()
    filename = os.path.basename(path)
    parts = []
    for field, value in (("chat_id", str(chat_id)), ("caption", caption)):
        parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{field}\"\r\n\r\n{value}\r\n".encode())
    parts.append(
        (
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"document\"; "
            f"filename=\"{filename}\"\r\nContent-Type: application/octet-stream\r\n\r\n"
        ).encode()
        + file_bytes
        + b"\r\n"
    )
    parts.append(f"--{boundary}--\r\n".encode())
    body = b"".join(parts)
    req = urllib.request.Request(
        url, data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8")).get("ok", False)


def read_notes(args):
    if args.audio:
        return transcribe_audio(args.audio)
    if args.notes_file:
        with open(args.notes_file, encoding="utf-8") as fh:
            return fh.read().strip()
    if args.notes == "-" or (not args.notes and not sys.stdin.isatty()):
        return sys.stdin.read().strip()
    return (args.notes or "").strip()


def main():
    ap = argparse.ArgumentParser(description="Genera un acta de reunion en Word (.docx).")
    ap.add_argument("notes", nargs="?", default=None, help="Notas en texto, o '-' para stdin")
    ap.add_argument("--notes", dest="notes_opt", default=None, help="Notas en texto")
    ap.add_argument("--notes-file", default=None)
    ap.add_argument("--audio", default=None, help="Ruta de audio (requiere faster-whisper)")
    ap.add_argument("--title", default="Reunion")
    ap.add_argument("--type", dest="tipo", default="ordinaria")
    ap.add_argument("--engine", default=os.environ.get("ENGINE", "auto"), choices=["auto", "ollama", "openai"])
    ap.add_argument("--no-telegram", action="store_true")
    args = ap.parse_args()
    args.notes = args.notes_opt or args.notes

    notes = read_notes(args)
    if not notes:
        log("ERROR: no se recibieron notas/audio. Usa --notes, --notes-file, --audio o stdin.")
        sys.exit(2)

    fecha = dt.date.today().isoformat()
    messages = build_messages(notes, args.title, args.tipo, fecha)
    log(f"[info] Redactando acta (engine={args.engine})...")
    md, used = run_llm(messages, args.engine)
    md = md.strip()
    if md.startswith("```"):
        md = re.sub(r"^```[a-zA-Z]*\n", "", md)
        md = re.sub(r"\n```$", "", md).strip()
    md = strip_unfilled_placeholders(md)

    ts = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    slug = slugify(args.title)
    out_dir = os.path.join(ASSETS_DIR, ACTAS_SUBDIR)
    os.makedirs(out_dir, exist_ok=True)
    base = os.path.join(out_dir, f"{ts}-{slug}")
    md_path, docx_path = base + ".md", base + ".docx"
    with open(md_path, "w", encoding="utf-8") as fh:
        fh.write(md + "\n")
    md_to_docx(md_path, docx_path)
    try:
        os.chmod(docx_path, 0o644)
        os.chmod(md_path, 0o644)
    except OSError:
        pass

    filename = os.path.basename(docx_path)
    base_url = os.environ.get("HERMES_ASSETS_BASE_URL", "").rstrip("/")
    public_url = f"{base_url}/{ACTAS_SUBDIR}/{filename}" if base_url else None

    sent = False
    if not args.no_telegram:
        try:
            sent = telegram_send_document(docx_path, f"Acta: {args.title} ({fecha})")
        except Exception as exc:  # noqa: BLE001
            log(f"[warn] No se pudo enviar por Telegram: {exc}")

    print(json.dumps({
        "ok": True,
        "engine_used": used,
        "docx_path": docx_path,
        "md_path": md_path,
        "public_url": public_url,
        "telegram_sent": sent,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
