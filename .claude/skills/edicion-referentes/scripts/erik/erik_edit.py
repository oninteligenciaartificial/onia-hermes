#!/usr/bin/env python3
"""erik_edit.py — edita un talking head con la receta de Erik Taveras (medida cuadro a cuadro el 3-oct-2026).

Entrada: bruto + cutplan aprobado (keep = tramos del bruto) + transcript corregido EN TIEMPO DE SALIDA
(words con start/end) + storyboard (JSON). Salida: MP4 1080x1920 a 30 fps, H.264 CRF 18, AAC 256k 48 kHz,
voz a -14 LUFS. Todos los tiempos salen de las PALABRAS del transcript (o de los cortes del cutplan), nunca a mano.

Lo que hace, en el orden de la receta:
- Tiempo: las palabras se re-alinean con Vosk (Kaldi, local y gratis) y se verifican con la envolvente RMS
  (Whisper erraba -0,3/+0,3 s). Los huecos de más de 0,25 s se aprietan a 0,25 s (como auto-editor con margen
  0,2 s) y se quitan las frases que el storyboard marca en `corte.quitar`. Sale un cutplan derivado
  (`cutplan-erik.json`) con su tabla (`tabla-cortes.md`) para mostrarle a Sergio Urcullo ANTES de publicar.
- Audio: empalmes con cruce de igual potencia de 15 ms (nunca a cero) y los huecos de silencio digital del
  teléfono rellenos con room tone de la misma toma. Pasa-altos, compresión pareja, -14 LUFS, pico ≤ -1,5 dBTP.
- Tres layouts y solo corte seco entre ellos: T (cámara completa), G (lámina de fuente sobre papel cuadriculado:
  gafete + captura 1080x606 + chip FUENTE + contorno verde y pastilla sobre la línea clave) y S (pantalla arriba
  0-840 px, la MISMA toma abajo a escala 1,00, solo recortada, subtítulo sobre la costura).
- Ritmo: ningún plano de cámara pasa de 3,3 s. Si un plano es más largo, mete un jump cut en el borde de frase
  (reencuadre 1,00 ↔ 1,08 en T; en S, el mismo recorte movido 90 px, sin zoom).
- Tarjetas de papel con borde de tinta, esquineros, rótulo mono y divisor: se despliegan desde una línea en 5
  cuadros y se arman pieza por pieza 2 cuadros después de la palabra que nombra cada pieza; con tarjeta en
  pantalla el subtítulo se apaga con un fundido de 0,3 s.
- Sellos estampados, punch-in 1,12-1,15 con rampa de 0,35 s que vuelve a 1,00 solo por corte, CTA tecleado.
- Karaoke de a 3 palabras, centro del bloque en y 1427 (74 %), 2 líneas en 72 % y 76,5 %, nada debajo del 80 %;
  la activa crece de 1,00 a 1,08 en 3 cuadros.

Uso:
  python3 erik_edit.py --bruto B.mp4 --cutplan cutplan.json --transcript segments-cut.json \
      --storyboard storyboard.json --salida prueba.mp4 [--trabajo DIR] [--hojas DIR] [--cuadros 1.5,12,40]
      [--sin-apretar] [--sin-vosk] [--sin-recorte-cola]
"""
from __future__ import annotations

import argparse
import difflib
import json
import math
import os
import re
import subprocess
import sys
import types
import unicodedata
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1080, 1920, 30
AQUI = Path(__file__).resolve().parent

# Paletas. Para Sergio Urcullo va "onia" (QA del 3-oct: la menta y el verde de datos de Erik son SU marca; los
# tokens de la marca personal son #FFFFFF, #0A0F0D, #0B8F4F para datos y #10C26B para la activa y los esquineros,
# nunca como texto sobre blanco). "erik" queda para medir contra el referente.
PALETAS = {
    "erik": dict(papel="#F1F1EC", papel_grilla="#E2E2DC", tinta="#121114", linea="#D6D6D1", menta="#36D19E",
                 esquinero="#2EC48F", datos="#037756", kraft="#F6E4B6", kraft_tinta="#504010", oscuro="#0D1115",
                 sub_blanco="#F0F0EC", sub_tinta="#0F1017", sub_activa_claro="#007052", rojo="#D2483C",
                 ambar="#E8A93A", gris="#6E6E69", terminal="#1F2130", terminal_txt="#C9CBE0", terminal_gris="#8D8FA8"),
    "onia": dict(papel="#FFFFFF", papel_grilla="#E6EAE8", tinta="#0A0F0D", linea="#D8DDDA", menta="#10C26B",
                 esquinero="#10C26B", datos="#0B8F4F", kraft="#F6E4B6", kraft_tinta="#504010", oscuro="#0A0F0D",
                 sub_blanco="#FFFFFF", sub_tinta="#0A0F0D", sub_activa_claro="#0B8F4F", rojo="#D2483C",
                 ambar="#E8A93A", gris="#5F6763", terminal="#111613", terminal_txt="#D6E2DC", terminal_gris="#8A968F"),
}

# Geometría de la receta (px o fracciones del alto)
SUB_Y_T = 1427 / H       # centro del bloque a cámara completa: y 1427 (74 %)
SUB_L2 = (0.72, 0.765)   # bloque de 2 líneas: centros en 72 % y 76,5 % (crece hacia arriba)
SUB_Y_MAX = 0.80 * H     # ningún glifo debajo de y 1536
SUB_Y_G = 0.602          # en lámina: 60 % (DevDay), tinta oscura
SUB_Y_S = 0.435          # en pantalla partida: sobre la costura
COSTURA = 840            # S: pantalla 0-840 px
CAP_SUB = 60             # alto de glifo del subtítulo (57-63 px)
ACTIVA_ESCALA = 1.08     # la activa crece de 1,00 a 1,08 en 3 cuadros
ANCHO_SUB = 680          # 44-63 % del ancho
CARD_X, CARD_W = 72, 820 # tarjeta ancha: 76 % del ancho, anclada en x ≈ 72
ZONA_ARRIBA_Y = 150      # variante «banda arriba» (EVOX2/Dots) cuando la cara ocupa el pecho
DESFASE_PIEZA = 2 / FPS  # cada pieza entra 2 cuadros (0,067 s) después del inicio REAL de su palabra
UNFOLD = 5 / FPS         # despliegue desde una línea: 4-6 cuadros
GHOST = 0.28             # salida fantasma 0,25-0,3 s
ZOOM_RAMPA = 0.35        # punch-in ease-out 0,3-0,5 s
APAGA_FUNDIDO = 0.3      # el subtítulo se apaga con un fundido de 0,3 s mientras hay tarjeta de datos
# Ritmo de cortes (3-5 cada 10 s; plano medio de 2-3,3 s con jump cut en el borde de cada frase)
PLANO_MAX = 3.3
PLANO_MIN = 1.2
PLANO_IDEAL = 2.5
JUMP_ESCALA = 1.08       # reencuadre del jump cut cuando no se quita tiempo
REENCUADRE_S = 90        # en S no hay zoom: el jump cut mueve el recorte 90 px
# Huecos de audio (auto-editor con margen 0,2 s: el hueco más largo queda en ≤ 0,25 s)
HUECO_MAX = 0.25
HUECO_POST = 0.13        # se deja 0,13 s después de la última palabra…
HUECO_PRE = 0.12         # …y 0,12 s antes de la siguiente (arranques suaves: /f/, /s/)
HUECO_MIN_QUITAR = 0.05  # quitar menos de esto no vale un corte
XFADE = 0.015            # cruce de igual potencia en cada empalme (10-20 ms)
VOSK_MODELO = Path(os.environ.get("ERIK_VOSK_MODELO", str(Path.home() / ".cache/vosk/vosk-model-small-es-0.42")))


# ───────────────────────────── utilidades ─────────────────────────────
def rgb(h: str, a: int = 255):
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def ease_out(p: float) -> float:
    p = min(1.0, max(0.0, p))
    return 1 - (1 - p) ** 3


def ease_out_quad(p: float) -> float:
    p = min(1.0, max(0.0, p))
    return 1 - (1 - p) ** 2


def ease_out_back(p: float, s: float = 1.4) -> float:
    p = min(1.0, max(0.0, p)) - 1
    return 1 + (s + 1) * p ** 3 + s * p ** 2


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def norm(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9+]", "", s)


def unicos(tiempos, tol=0.05):
    """Ordena y funde los tiempos a menos de `tol` (un cambio de layout y un corte del cutplan en el mismo cuadro
    son UN corte, no dos con un plano de 0 s en el medio)."""
    out = []
    for t in sorted(tiempos):
        if not out or t - out[-1] > tol:
            out.append(t)
    return out


def con_alpha(im: Image.Image, a: float) -> Image.Image:
    if a >= 0.999:
        return im
    im = im.copy()
    im.putalpha(im.getchannel("A").point(lambda v: int(v * max(0.0, a))))
    return im


def pegar(dest: Image.Image, src: Image.Image, xy, alpha: float = 1.0, escala: float = 1.0, centro=None):
    """alpha_composite con opacidad y escala alrededor de un centro (por defecto el del src)."""
    if alpha <= 0.003:
        return
    if abs(escala - 1.0) > 1e-3:
        cx, cy = centro if centro else (xy[0] + src.width / 2, xy[1] + src.height / 2)
        nw, nh = max(1, int(src.width * escala)), max(1, int(src.height * escala))
        src = src.resize((nw, nh), Image.LANCZOS)
        xy = (cx - nw / 2, cy - nh / 2)
    src = con_alpha(src, alpha)
    x, y = int(round(xy[0])), int(round(xy[1]))
    sx0, sy0 = max(0, -x), max(0, -y)
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(dest.width, x + src.width), min(dest.height, y + src.height)
    if x1 <= x0 or y1 <= y0:
        return
    if sx0 or sy0 or x1 - x0 < src.width or y1 - y0 < src.height:
        src = src.crop((sx0, sy0, sx0 + x1 - x0, sy0 + y1 - y0))
    dest.alpha_composite(src, dest=(x0, y0))


def monocromo(im: Image.Image, color=(255, 255, 255, 255)) -> Image.Image:
    """El logo en un solo color, conservando su alfa (ícono monocromo blanco sobre la caja)."""
    out = Image.new("RGBA", im.size, color)
    out.putalpha(im.getchannel("A"))
    return out


# ───────────────────────────── fuentes ─────────────────────────────
class Fuentes:
    ARCHIVOS = {
        "cond": (["Anton-Regular.ttf", "Anton.ttf", "BebasNeue-Regular.ttf"], "Anton"),
        "mono": (["JetBrainsMono-ExtraBold.ttf", "JetBrainsMono-Bold.ttf"], "JetBrains Mono:bold"),
        "mono_b": (["JetBrainsMono-Bold.ttf", "JetBrainsMono-ExtraBold.ttf"], "JetBrains Mono:bold"),
        "sans": (["Inter-SemiBold.ttf"], "Inter:semibold"),
    }

    def __init__(self, dirs):
        self.rutas = {}
        for k, (nombres, patron) in self.ARCHIVOS.items():
            ruta = None
            for d in dirs:
                for n in nombres:
                    p = Path(d) / n
                    if p.exists():
                        ruta = str(p)
                        break
                if ruta:
                    break
            if not ruta:
                ruta = subprocess.run(["fc-match", "-f", "%{file}", patron], capture_output=True, text=True).stdout
                print(f"[fuentes] {k}: no está en {dirs}; uso {ruta} (fc-match)")
            self.rutas[k] = ruta

    @lru_cache(maxsize=None)
    def f(self, k: str, size: int) -> ImageFont.FreeTypeFont:
        return ImageFont.truetype(self.rutas[k], max(6, int(size)))

    @lru_cache(maxsize=None)
    def por_cap(self, k: str, cap: int) -> ImageFont.FreeTypeFont:
        """Fuente cuyo alto de mayúscula (H) mide `cap` px."""
        lo, hi = 6, 400
        while lo < hi:
            mid = (lo + hi) // 2
            b = self.f(k, mid).getbbox("H")
            if b[3] - b[1] < cap:
                lo = mid + 1
            else:
                hi = mid
        return self.f(k, lo)


def texto_espaciado(d: ImageDraw.ImageDraw, xy, texto, font, fill, tracking=0.16, anchor="ls"):
    """Mono con tracking amplio (rótulos de Erik). anchor ls/rs/ms sobre la línea de base."""
    ancho = sum(font.getlength(c) for c in texto) + tracking * font.size * (len(texto) - 1)
    x, y = xy
    if anchor[0] == "r":
        x -= ancho
    elif anchor[0] == "m":
        x -= ancho / 2
    for c in texto:
        d.text((x, y), c, font=font, fill=fill, anchor="ls")
        x += font.getlength(c) + tracking * font.size
    return ancho


def ancho_espaciado(texto, font, tracking=0.16):
    return sum(font.getlength(c) for c in texto) + tracking * font.size * (len(texto) - 1)


# ───────────────────────────── voz: análisis ─────────────────────────────
SR = 48000      # audio de salida
SR_AN = 16000   # audio de análisis (RMS, banda alta, Vosk)


def decodificar(p: Path, sr: int, canales: int) -> np.ndarray:
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-f", "f32le", "-ac", str(canales), "-ar", str(sr),
                          "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(out, np.float32).copy()
    return x.reshape(-1, canales) if canales > 1 else x


def concat_seco(x: np.ndarray, keep, sr: int) -> np.ndarray:
    """Concatena los tramos keep (segundos del bruto) sin procesar: sirve para medir, no para escuchar."""
    return np.concatenate([x[int(round(a * sr)):int(round(b * sr))] for a, b in keep])


def envolvente(x: np.ndarray, sr: int = SR_AN, paso: float = 0.01, ventana: float = 0.025):
    """RMS de banda ancha y energía de 3-8 kHz (las fricativas /s/ /f/ tienen poca RMS pero mucha banda alta)."""
    hop, win = int(paso * sr), int(ventana * sr)
    n = max(0, (len(x) - win) // hop)
    idx = np.arange(n)[:, None] * hop + np.arange(win)[None, :]
    fr = x[idx] * np.hanning(win)[None, :]
    full = 10 * np.log10(np.mean(fr ** 2, axis=1) / 0.375 + 1e-14)
    F = np.abs(np.fft.rfft(fr, axis=1)) ** 2
    f = np.fft.rfftfreq(win, 1 / sr)
    alta = 10 * np.log10(F[:, (f > 3000) & (f < 8000)].sum(axis=1) + 1e-14)
    return full, alta


def silencios(full, alta, paso=0.01, min_dur=0.06):
    """Corridas sin voz (ni vocal ni fricativa fuerte), con umbrales relativos a la toma. Medido el 3-oct con el
    micrófono de Sergio Urcullo: la pausa tiene ruido de -42 a -30 dB y soplidos de banda alta, así que un umbral
    pegado al piso parte una pausa de 0,8 s en pedacitos y no se aprieta nada. Voz = 8 dB debajo del percentil 75;
    fricativa = 13,5 dB arriba del piso de banda alta Y 2 dB arriba del piso de banda ancha (la /s/ de «instalar»
    pasa; el arranque suave de la /f/ de «force» no, y lo cubre el margen de 0,12 s antes de la palabra)."""
    vivo = full > -90                                   # fuera los huecos digitales del teléfono
    piso = float(np.percentile(full[vivo], 10))
    voz = float(np.percentile(full[vivo], 75))
    thr = voz - 8.0
    piso_a = float(np.percentile(alta[vivo], 10))
    thr_a = piso_a + 13.5
    # una respiración tiene banda alta pero queda en el piso (-34/-37 dB): eso es pausa, no fricativa
    sil = (full < thr) & ~((alta > thr_a) & (full > piso + 2.0))
    corridas, i = [], 0
    while i < len(sil):
        if sil[i]:
            j = i
            while j < len(sil) and sil[j]:
                j += 1
            if (j - i) * paso >= min_dur:
                # el centro de la ventana de análisis es el tiempo del cuadro
                corridas.append((i * paso + 0.0125, j * paso + 0.0125))
            i = j
        else:
            i += 1
    return corridas, dict(piso=round(piso, 1), voz=round(voz, 1), umbral=round(thr, 1), umbral_alta=round(thr_a, 1))


def vosk_palabras(x16: np.ndarray, cache: Path, clave: str):
    """Reconocimiento local con Vosk (Kaldi) y tiempos por palabra. Devuelve None si no está instalado."""
    if cache.exists():
        c = json.loads(cache.read_text())
        if c.get("clave") == clave:
            return c["palabras"]
    if not VOSK_MODELO.exists():
        print(f"[vosk] no está el modelo en {VOSK_MODELO}: quedan los tiempos del transcript")
        return None
    try:
        sys.modules.setdefault("srt", types.ModuleType("srt"))   # vosk lo importa solo para exportar SRT
        from vosk import KaldiRecognizer, Model, SetLogLevel
    except Exception as e:  # noqa: BLE001
        print(f"[vosk] no se pudo importar ({e}): quedan los tiempos del transcript")
        return None
    SetLogLevel(-1)
    rec = KaldiRecognizer(Model(str(VOSK_MODELO)), SR_AN)
    rec.SetWords(True)
    pcm = (np.clip(x16, -1, 1) * 32767).astype("<i2").tobytes()
    res = []
    for k in range(0, len(pcm), 8000):
        if rec.AcceptWaveform(pcm[k:k + 8000]):
            res += json.loads(rec.Result()).get("result", [])
    res += json.loads(rec.FinalResult()).get("result", [])
    pal = [dict(word=r["word"], start=float(r["start"]), end=float(r["end"]), conf=float(r["conf"])) for r in res]
    cache.write_text(json.dumps({"clave": clave, "palabras": pal}))
    return pal


def alinear(A, B, sim, gap=-0.45, pen=0.1):
    """Needleman-Wunsch con fusiones: 1 palabra ↔ 1 token, 1 palabra ↔ 2 tokens («.claude» → «punto» «clave») y
    2 palabras ↔ 1 token («arranca en» → «arranquen»). Devuelve [(i0, i1, j0, j1, similitud)] con rangos cerrados."""
    n, m = len(A), len(B)
    S = np.full((n + 1, m + 1), -1e9)
    P = np.zeros((n + 1, m + 1), np.int8)
    S[0, 0] = 0.0
    S[1:, 0] = gap * np.arange(1, n + 1)
    S[0, 1:] = gap * np.arange(1, m + 1)
    P[1:, 0], P[0, 1:] = 1, 2
    M = np.array([[sim(a, b) for b in B] for a in A]) if n and m else np.zeros((n, m))
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            opciones = [(S[i - 1, j - 1] + 2 * M[i - 1, j - 1] - 1, 0), (S[i - 1, j] + gap, 1), (S[i, j - 1] + gap, 2)]
            if j >= 2 and M[i - 1, j - 1] < 0.9:
                opciones.append((S[i - 1, j - 2] + 2 * sim(A[i - 1], B[j - 2] + B[j - 1]) - 1 - pen, 3))
            if i >= 2 and M[i - 1, j - 1] < 0.9:
                opciones.append((S[i - 2, j - 1] + 2 * sim(A[i - 2] + A[i - 1], B[j - 1]) - 1 - pen, 4))
            S[i, j], P[i, j] = max(opciones, key=lambda o: o[0])
    pares, i, j = [], n, m
    while i > 0 or j > 0:
        mv = P[i, j]
        if i > 0 and j > 0 and mv == 0:
            pares.append((i - 1, i - 1, j - 1, j - 1, M[i - 1, j - 1]))
            i, j = i - 1, j - 1
        elif mv == 3:
            pares.append((i - 1, i - 1, j - 2, j - 1, sim(A[i - 1], B[j - 2] + B[j - 1])))
            i, j = i - 1, j - 2
        elif mv == 4:
            pares.append((i - 2, i - 1, j - 1, j - 1, sim(A[i - 2] + A[i - 1], B[j - 1])))
            i, j = i - 2, j - 1
        elif i > 0 and (j == 0 or mv == 1):
            i -= 1
        else:
            j -= 1
    return pares[::-1]


def token_dicho(palabra: str) -> str:
    """Cómo suena la palabra para el reconocedor: «.claude» se dice «punto claude»."""
    t = norm(palabra)
    return ("punto" + t) if palabra.strip().startswith(".") else t


def refinar_palabras(words, vw, corridas):
    """Tiempos por palabra: Vosk donde coincide el texto, interpolado donde no, y el inicio llevado al final del
    silencio real cuando la palabra arranca después de una pausa (envolvente RMS + banda alta)."""
    out = [dict(w, start_w=w["start"], end_w=w["end"]) for w in words]
    if vw:
        A = [token_dicho(w["word"]) for w in words]
        B = [norm(v["word"]) for v in vw]
        pares = alinear(A, B, lambda a, b: difflib.SequenceMatcher(None, a, b).ratio() if a and b else 0.0)
        anclas = {}
        for i0, i1, j0, j1, s in pares:
            ini, fin = vw[j0]["start"], vw[j1]["end"]
            if s < 0.6 or abs(ini - words[i0]["start"]) > 0.6:
                continue
            if i0 == i1:
                anclas[i0] = (ini, fin)
            else:   # dos palabras en un token: se reparte por largo de letras
                la, lb = max(1, len(A[i0])), max(1, len(A[i1]))
                corte = ini + (fin - ini) * la / (la + lb)
                anclas[i0], anclas[i1] = (ini, corte), (corte, fin)
        idx = sorted(anclas)
        for i, w in enumerate(out):
            if i in anclas:
                w["start"], w["end"] = anclas[i]
                w["fuente"] = "vosk"
                continue
            # sin ancla: se corre con el desfase interpolado entre las anclas vecinas
            prev = max([k for k in idx if k < i], default=None)
            nxt = min([k for k in idx if k > i], default=None)
            dp = anclas[prev][0] - words[prev]["start"] if prev is not None else 0.0
            dn = anclas[nxt][0] - words[nxt]["start"] if nxt is not None else dp
            if prev is None:
                dp = dn
            if prev is not None and nxt is not None and words[nxt]["start"] > words[prev]["start"]:
                k = (words[i]["start"] - words[prev]["start"]) / (words[nxt]["start"] - words[prev]["start"])
                d = dp + (dn - dp) * min(1.0, max(0.0, k))
            else:
                d = dp
            w["start"] += d
            w["end"] += d
            w["fuente"] = "interpolada"
    # la PRIMERA palabra que arranca después de un silencio real empieza donde termina el silencio
    for a, b in corridas:
        if b - a < 0.06:
            continue
        w = next((w for w in out if w["start"] > a - 0.02), None)
        if w is not None and w["start"] <= b + 0.12 and abs(w["start"] - b) > 1e-3:
            w["start"] = b
            w["fuente"] = w.get("fuente", "transcript") + "+rms"
    for i, w in enumerate(out):
        if i:
            w["start"] = max(w["start"], out[i - 1]["start"] + 0.03)
        w["end"] = max(w["end"], w["start"] + 0.05)
    return out


class Recorte:
    """Tramos a QUITAR del tiempo de salida viejo (huecos apretados y frases sacadas) y su mapa al tiempo nuevo."""

    def __init__(self, quitar):
        q = sorted((a, b) for a, b in quitar if b - a > 1e-4)
        m = []
        for a, b in q:
            if m and a <= m[-1][1] + 1e-4:
                m[-1] = (m[-1][0], max(m[-1][1], b))
            else:
                m.append((a, b))
        self.q = m

    def nuevo(self, t: float) -> float:
        d = 0.0
        for a, b in self.q:
            if t >= b:
                d += b - a
            elif t > a:
                return a - d
            else:
                break
        return t - d

    def dentro(self, t: float) -> bool:
        return any(a < t < b for a, b in self.q)

    def tramos(self, keep, cum):
        """keep nuevo en segundos del bruto: cada tramo viejo menos lo quitado. Devuelve (src_a, src_b, out_a, out_b)."""
        out = []
        for k, (sa, _sb) in enumerate(keep):
            piezas = [(cum[k], cum[k + 1])]
            for a, b in self.q:
                nuevas = []
                for x, y in piezas:
                    if b <= x or a >= y:
                        nuevas.append((x, y))
                        continue
                    if a > x:
                        nuevas.append((x, a))
                    if b < y:
                        nuevas.append((b, y))
                piezas = nuevas
            for x, y in piezas:
                if y - x > 1e-4:
                    out.append((sa + x - cum[k], sa + y - cum[k], x, y))
        return out


# ───────────────────────────── tiempo ─────────────────────────────
class Linea:
    """Mapa entre tiempo de salida, cortes del cutplan y palabras del transcript."""

    def __init__(self, keep, words, fps_src=30.0, n_src=None, cortes_base=None):
        self.keep = keep
        self.durs = [b - a for a, b in keep]
        self.cum = [0.0]
        for d in self.durs:
            self.cum.append(self.cum[-1] + d)
        self.total = self.cum[-1]
        self.cortes = self.cum[1:-1]          # límites del keep vigente, en tiempo de salida
        # {"corte": k} del storyboard se refiere al cutplan APROBADO, llevado al tiempo nuevo
        self.cortes_base = list(cortes_base) if cortes_base is not None else list(self.cortes)
        self.words = words
        self.toks = [norm(w["word"]) for w in words]
        self.fps_src = fps_src
        self.n_src = n_src
        self.registro = []                    # (frase, inicio de la palabra, tiempo devuelto) para el informe

    def src_t(self, t: float) -> float:
        k = max(0, min(len(self.keep) - 1, int(np.searchsorted(self.cum, t, side="right") - 1)))
        return self.keep[k][0] + (t - self.cum[k])

    def src_frame(self, t: float) -> int:
        j = int(round(self.src_t(t) * self.fps_src))
        return min(j, (self.n_src or 10 ** 9) - 1)

    def buscar(self, frase: str, n: int = 1, despues_de: float = -1.0):
        objetivo = [norm(x) for x in frase.split()]
        hallado = 0
        for i in range(len(self.toks) - len(objetivo) + 1):
            if self.words[i]["start"] < despues_de:
                continue
            if self.toks[i:i + len(objetivo)] == objetivo:
                hallado += 1
                if hallado == n:
                    return i, i + len(objetivo) - 1
        raise KeyError(f"palabra «{frase}» (n={n}, después de {despues_de}) no está en el transcript")

    def t(self, trig, desfase: float = 0.0) -> float:
        if trig is None:
            return None
        if isinstance(trig, (int, float)):
            return float(trig)
        extra = trig.get("desfase", desfase)
        if "t" in trig:
            return float(trig["t"]) + trig.get("desfase", 0.0)
        if "corte" in trig:
            return self.cortes_base[int(trig["corte"]) - 1] + trig.get("desfase", 0.0)
        if trig.get("fin_video"):
            return self.total
        i, j = self.buscar(trig["palabra"], trig.get("n", 1), trig.get("despues_de", -1.0))
        if trig.get("fin"):
            return self.words[j]["end"] + trig.get("desfase", 0.0)
        out = self.words[i]["start"] + extra
        self.registro.append((trig["palabra"], self.words[i], out))
        return out

    def siguiente_corte(self, t: float, extra=()):
        cands = [c for c in list(self.cortes) + list(extra) if c > t + 1e-3]
        return min(cands) if cands else self.total


# ───────────────────────────── caras ─────────────────────────────
def analizar_caras(bruto: Path, linea: Linea, cache: Path, modelo: Path):
    """Caja de la cara (YuNet) en tiempo de salida, 6 muestras/s, suavizada. Devuelve arrays por cuadro."""
    firma_keep = ",".join(f"{a:.3f}-{b:.3f}" for a, b in linea.keep)
    clave = f"v3-{bruto.stat().st_size}-{bruto.stat().st_mtime_ns}-{hash(firma_keep) & 0xFFFFFFFF:x}"
    if cache.exists():
        c = json.loads(cache.read_text())
        if c.get("clave") == clave:
            return {k: np.array(v) for k, v in c["datos"].items()}
    import cv2
    ws, hs = 270, 480
    esc = W / ws
    det = cv2.FaceDetectorYN.create(str(modelo), "", (ws, hs), 0.6, 0.3, 5000)
    n_out = int(math.floor(linea.total * FPS))
    muestras_t = np.arange(0, n_out, 5) / FPS
    necesito = {}
    for t in muestras_t:
        necesito.setdefault(linea.src_frame(t), []).append(t)
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(bruto), "-vf", f"scale={ws}:{hs}", "-f", "rawvideo",
                          "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    res = {}
    j = 0
    ultimo = max(necesito)
    while j <= ultimo:
        b = p.stdout.read(ws * hs * 3)
        if len(b) < ws * hs * 3:
            break
        if j in necesito:
            f = np.frombuffer(b, np.uint8).reshape(hs, ws, 3)
            _, faces = det.detect(f)
            if faces is not None and len(faces):
                fc = max(faces, key=lambda r: r[2] * r[3])
                x, y, w, h = [float(v) * esc for v in fc[:4]]
                ojos = float(fc[5] + fc[7]) / 2 * esc
                boca = float(fc[11] + fc[13]) / 2 * esc
                # la caja de YuNet baja ~100 px de más cuando se inclina (medido el 3-oct): la barbilla sale de
                # los puntos de ojos y boca (boca→barbilla ≈ media distancia ojos→boca)
                barbilla = boca + 0.5 * (boca - ojos)
                for t in necesito[j]:
                    res[t] = (x + w / 2, y, barbilla, ojos, w, h)
        j += 1
    p.stdout.close()
    p.kill()
    p.wait()
    ts = np.array(sorted(res))
    if len(ts) == 0:
        raise RuntimeError("YuNet no encontró ninguna cara: revisá el bruto")
    vals = np.array([res[t] for t in ts])
    suav = np.copy(vals)
    for i in range(len(ts)):
        suav[i] = np.median(vals[max(0, i - 2):i + 3], axis=0)
    tf = np.arange(n_out) / FPS
    datos = {k: np.interp(tf, ts, suav[:, i]) for i, k in enumerate(["cx", "top", "chin", "ojos", "w", "h"])}
    cache.write_text(json.dumps({"clave": clave, "datos": {k: v.round(1).tolist() for k, v in datos.items()}}))
    return datos


# ───────────────────────────── dibujo: iconos y piezas ─────────────────────────────
class Lienzo:
    """Contexto compartido de dibujo: paleta, fuentes y assets."""

    def __init__(self, paleta, fuentes: Fuentes, assets: list[Path]):
        self.p = paleta
        self.F = fuentes
        self.assets = assets
        self._img = {}

    def ruta(self, nombre: str) -> Path:
        for d in self.assets:
            for cand in (d / nombre, d / f"{nombre}.png"):
                if cand.exists():
                    return cand
        raise FileNotFoundError(f"asset «{nombre}» no está en {self.assets}")

    def img(self, nombre: str) -> Image.Image:
        if nombre not in self._img:
            self._img[nombre] = Image.open(self.ruta(nombre)).convert("RGBA")
        return self._img[nombre]

    def c(self, k, a=255):
        v = self.p.get(k, k)
        if isinstance(v, str) and v.startswith("#"):
            return rgb(v, a)
        return v


def icono(L: Lienzo, d: ImageDraw.ImageDraw, im: Image.Image, tipo: str, cx, cy, s, color):
    """Iconos de línea dibujados con código (las ✓ ✕ ⏸ no existen en las fuentes: se dibujan)."""
    w = max(3, int(s * 0.075))
    r = s / 2
    if tipo.startswith("logo:"):
        lg = L.img(tipo[5:])
        k = s * 0.78 / max(lg.width, lg.height)
        lg = lg.resize((int(lg.width * k), int(lg.height * k)), Image.LANCZOS)
        im.alpha_composite(lg, (int(cx - lg.width / 2), int(cy - lg.height / 2)))
    elif tipo == "persona":
        d.ellipse((cx - r * .28, cy - r * .62, cx + r * .28, cy - r * .06), outline=color, width=w)
        d.arc((cx - r * .55, cy + r * .02, cx + r * .55, cy + r * 1.1), 180, 360, fill=color, width=w)
    elif tipo == "escudo":
        pts = [(cx, cy - r * .62), (cx + r * .5, cy - r * .42), (cx + r * .46, cy + r * .12), (cx, cy + r * .62),
               (cx - r * .46, cy + r * .12), (cx - r * .5, cy - r * .42), (cx, cy - r * .62)]
        d.line(pts, fill=color, width=w, joint="curve")
        d.line([(cx - r * .2, cy), (cx - r * .04, cy + r * .17), (cx + r * .24, cy - r * .2)], fill=color, width=w)
    elif tipo == "check":
        d.line([(cx - r * .42, cy + r * .02), (cx - r * .12, cy + r * .32), (cx + r * .45, cy - r * .32)],
               fill=color, width=int(w * 1.3), joint="curve")
    elif tipo == "cruz":
        k = r * .36
        d.line((cx - k, cy - k, cx + k, cy + k), fill=color, width=int(w * 1.3))
        d.line((cx - k, cy + k, cx + k, cy - k), fill=color, width=int(w * 1.3))
    elif tipo == "alerta":
        d.line((cx, cy - r * .42, cx, cy + r * .12), fill=color, width=int(w * 1.4))
        d.ellipse((cx - w, cy + r * .3, cx + w, cy + r * .3 + 2 * w), fill=color)
    elif tipo == "pausa":
        d.rounded_rectangle((cx - r * .32, cy - r * .4, cx - r * .1, cy + r * .4), 3, fill=color)
        d.rounded_rectangle((cx + r * .1, cy - r * .4, cx + r * .32, cy + r * .4), 3, fill=color)
    elif tipo == "auto":
        for dx in (-r * .36, r * .04):
            d.polygon([(cx + dx, cy - r * .36), (cx + dx + r * .34, cy), (cx + dx, cy + r * .36)], fill=color)
    elif tipo == "rama":
        d.line((cx - r * .25, cy - r * .45, cx - r * .25, cy + r * .45), fill=color, width=w)
        d.arc((cx - r * .25, cy - r * .55, cx + r * .45, cy + r * .2), 0, 90, fill=color, width=w)
        for ex, ey in ((cx - r * .25, cy - r * .45), (cx - r * .25, cy + r * .45), (cx + r * .45, cy - r * .2)):
            d.ellipse((ex - r * .13, ey - r * .13, ex + r * .13, ey + r * .13), fill=im.getpixel((int(cx), int(cy))),
                      outline=color, width=w)
    elif tipo == "servidor":
        for k in (-1, 1):
            y0 = cy + (k - 1) * r * .3 + (r * .02 if k > 0 else 0)
            d.rounded_rectangle((cx - r * .5, y0, cx + r * .5, y0 + r * .5), 6, outline=color, width=w)
            d.ellipse((cx + r * .22, y0 + r * .19, cx + r * .34, y0 + r * .31), fill=color)
    elif tipo == "globo":
        d.ellipse((cx - r * .5, cy - r * .5, cx + r * .5, cy + r * .5), outline=color, width=w)
        d.ellipse((cx - r * .22, cy - r * .5, cx + r * .22, cy + r * .5), outline=color, width=w)
        d.line((cx - r * .5, cy, cx + r * .5, cy), fill=color, width=w)
    elif tipo == "terminal":
        d.line([(cx - r * .42, cy - r * .25), (cx - r * .12, cy), (cx - r * .42, cy + r * .25)], fill=color, width=w)
        d.line((cx - r * .02, cy + r * .28, cx + r * .4, cy + r * .28), fill=color, width=w)
    elif tipo == "archivo":
        d.line([(cx - r * .35, cy - r * .5), (cx + r * .12, cy - r * .5), (cx + r * .38, cy - r * .24),
                (cx + r * .38, cy + r * .5), (cx - r * .35, cy + r * .5), (cx - r * .35, cy - r * .5)],
               fill=color, width=w, joint="curve")
    else:
        raise ValueError(f"icono desconocido: {tipo}")


def caja_icono(L: Lienzo, tipo: str, estilo: str, s: int = 104) -> Image.Image:
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if estilo == "verde":
        d.rounded_rectangle((0, 0, s - 1, s - 1), 10, fill=L.c("datos"))
        col = (255, 255, 255, 255)
    elif estilo == "rojo":
        d.rounded_rectangle((0, 0, s - 1, s - 1), 10, fill=L.c("rojo"))
        col = (255, 255, 255, 255)
    else:
        d.rounded_rectangle((2, 2, s - 3, s - 3), 10, fill=(255, 255, 255, 255), outline=L.c("tinta"), width=4)
        col = L.c("tinta")
    icono(L, d, im, tipo, s / 2, s / 2, s * 0.9, col)
    return im


def pastilla(L: Lienzo, texto: str, fondo="datos", color=(255, 255, 255, 255), size=22, icono_tipo=None) -> Image.Image:
    f = L.F.f("mono", size)
    aw = ancho_espaciado(texto, f, 0.12)
    extra = size * 1.3 if icono_tipo else 0
    im = Image.new("RGBA", (int(aw + 36 + extra), int(size * 1.9)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, im.width - 1, im.height - 1), int(size * 0.45), fill=L.c(fondo))
    if icono_tipo:
        icono(L, d, im, icono_tipo, 18 + size * 0.5, im.height / 2, size * 1.25, color)
    texto_espaciado(d, (18 + extra, im.height / 2 + size * 0.36), texto, f, color, 0.12)
    return im


def esquineros(L: Lienzo, w, h, brazo=46, grosor=5, sep=17, color=None) -> Image.Image:
    """Los corchetes verdes, por fuera de la tarjeta."""
    color = color or L.c("esquinero")
    im = Image.new("RGBA", (w + 2 * sep, h + 2 * sep), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x1, y1 = im.width - 1, im.height - 1
    for (x, y, dx, dy) in ((0, 0, 1, 1), (x1, 0, -1, 1), (0, y1, 1, -1), (x1, y1, -1, -1)):
        d.line((x, y, x + dx * brazo, y), fill=color, width=grosor)
        d.line((x, y, x, y + dy * brazo), fill=color, width=grosor)
    return im


# ───────────────────────────── elementos ─────────────────────────────
class Pieza:
    def __init__(self, img: Image.Image, xy, t_in: float, modo="pop", dur=0.12, extra=None):
        self.img, self.xy, self.t_in, self.modo, self.dur = img, xy, t_in, modo, dur
        self.extra = extra or {}

    def dibujar(self, capa: Image.Image, t: float, ox=0, oy=0, alpha=1.0):
        if t < self.t_in:
            return
        p = (t - self.t_in) / self.dur
        x, y = self.xy[0] + ox, self.xy[1] + oy
        if self.modo == "fade":
            pegar(capa, self.img, (x, y), alpha * ease_out(p))
        elif self.modo == "deslizar":
            pegar(capa, self.img, (x - 16 * (1 - ease_out(p)), y), alpha * ease_out(p))
        elif self.modo == "trazo":   # se dibuja de izquierda a derecha (flechas, contornos)
            k = ease_out(p)
            if k > 0:
                pegar(capa, self.img.crop((0, 0, max(1, int(self.img.width * k)), self.img.height)), (x, y), alpha)
        elif self.modo == "tecleo":  # 1 letra por cuadro: la imagen se regenera con el prefijo
            n = int((t - self.t_in) * FPS * self.extra.get("letras_por_cuadro", 1)) + 1
            img = self.extra["render"](n, t)
            pegar(capa, img, (x, y), alpha)
        else:  # pop
            pegar(capa, self.img, (x, y), alpha * ease_out(p), 0.86 + 0.14 * ease_out(p))


class Elemento:
    capa_layout = "T"   # en qué layout se ve: T, S, G o "*"
    t0 = 0.0
    t1 = 0.0
    fantasma = True     # salida fantasma de 0,28 s (se apaga cuando otra tarjeta la releva en el mismo lugar)

    def visible(self, t):
        return self.t0 <= t < self.t1 + (GHOST if self.fantasma else 0.0)

    def alpha_salida(self, t):
        return 1.0 if t < self.t1 else max(0.0, 1 - (t - self.t1) / GHOST)


class Tarjeta(Elemento):
    """Tarjeta de papel: se despliega desde una línea, esquineros después, piezas por palabra, salida fantasma."""

    def __init__(self, L: Lienzo, ev, linea: Linea, F, zona_y):
        self.L, self.ev = L, ev
        c = ev["contenido"]
        self.w = ev.get("ancho", CARD_W)
        self.x = ev.get("x", CARD_X)
        self.piezas: list[Pieza] = []
        # una tarjeta de DATOS apaga el subtítulo (DevDay): por defecto sí
        self.apaga = ev.get("apaga_subtitulos", True)
        y = 92
        tipo = c["tipo"]
        if tipo == "lista":
            y = self._lista(c, linea, y)
        elif tipo == "flujo":
            y = self._flujo(c, linea, y)
        elif tipo == "estado":
            y = self._estado(c, linea, y)
        else:
            raise ValueError(f"contenido de tarjeta desconocido: {tipo}")
        if c.get("pie"):
            pie = c["pie"]
            f = L.F.f("mono_b", 18)
            im = Image.new("RGBA", (self.w - 60, 30), (0, 0, 0, 0))
            texto_espaciado(ImageDraw.Draw(im), (0, 22), pie["texto"], f, L.c("gris"), 0.08)
            self.piezas.append(Pieza(im, (30, y + 4), linea.t(pie["en"], DESFASE_PIEZA), "fade", 0.1))
            y += 40
        self.h = max(y + 18, int(ev.get("alto_min", 0.17) * H))   # la tarjeta mide 17-24 % del alto
        t_pzs = [p.t_in for p in self.piezas]
        self.t0 = linea.t(ev["desde"]) if ev.get("desde") else min(t_pzs) - 0.33
        self.t1 = linea.t(ev["hasta"])
        self.y = zona_y(self, ev)
        self.esq = esquineros(L, self.w, self.h)
        f = L.F.f("mono", 23)
        self.cab = Image.new("RGBA", (self.w, 80), (0, 0, 0, 0))
        d = ImageDraw.Draw(self.cab)
        texto_espaciado(d, (30, 48), ev.get("rotulo", ""), f, L.c("tinta"), 0.2)
        if ev.get("rotulo_der"):
            texto_espaciado(d, (self.w - 30, 48), ev["rotulo_der"], f, L.c(ev.get("rotulo_der_color", "datos")), 0.2,
                            anchor="rs")
        d.line((30, 70, self.w - 30, 70), fill=L.c("linea"), width=2)

    # -- contenidos --
    def _lista(self, c, linea, y):
        """Filas ✕/✓/!. Con `mono: true` la fila es un DATO (el comando real), no la frase que se oye."""
        L = self.L
        alto = c.get("alto_fila", 54)
        for fila in c["filas"]:
            im = Image.new("RGBA", (self.w - 40, alto), (0, 0, 0, 0))
            d = ImageDraw.Draw(im)
            marca = fila.get("marca", "x")
            col = {"x": "rojo", "ok": "datos", "alerta": "ambar"}[marca]
            if fila.get("resalta"):
                d.rounded_rectangle((0, 2, im.width - 1, alto - 3), 8, fill=L.c(col, 38), outline=L.c(col), width=3)
            q = alto - 16
            d.rounded_rectangle((12, 8, 12 + q, 8 + q), 7, fill=L.c(col))
            icono(L, d, im, {"x": "cruz", "ok": "check", "alerta": "alerta"}[marca], 12 + q / 2, 8 + q / 2, q,
                  (255, 255, 255, 255))
            if c.get("mono") or fila.get("mono"):
                fm = L.F.f("mono_b", c.get("tam_mono", 30))
                d.text((12 + q + 20, alto / 2 + 11), fila["texto"], font=fm, fill=L.c("tinta"), anchor="ls")
            else:
                fc = L.F.por_cap("cond", 27)
                d.text((12 + q + 18, alto / 2 + 14), fila["texto"], font=fc, fill=L.c("tinta"), anchor="ls")
            if fila.get("nota"):
                fm = L.F.f("mono_b", 18)
                texto_espaciado(d, (im.width - 14, alto / 2 + 7), fila["nota"], fm, L.c("gris"), 0.04, anchor="rs")
            self.piezas.append(Pieza(im, (20, y), linea.t(fila["en"], DESFASE_PIEZA), "deslizar", 0.12))
            y += alto + 2
        return y

    def _flujo(self, c, linea, y):
        L = self.L
        nodos = c["nodos"]
        n = len(nodos)
        s = c.get("caja", 100)
        margen = 30
        anchos = [int(s * 1.65) if nd.get("doble") else s for nd in nodos]
        hueco = (self.w - 2 * margen - sum(anchos)) / max(1, n - 1) if n > 1 else 0
        xs = [margen + sum(anchos[:i]) + i * hueco for i in range(n)]
        y_caja = y + 18
        fs = L.F.f("sans", 24)
        fm = L.F.f("mono_b", 16)
        max_y = y_caja + s
        for i, nd in enumerate(nodos):
            x = xs[i]
            t_in = linea.t(nd["en"], DESFASE_PIEZA)
            if nd.get("doble"):  # salida doble: ✓ PASA / ✕ FRENA
                im = Image.new("RGBA", (anchos[i], s), (0, 0, 0, 0))
                d = ImageDraw.Draw(im)
                hh = (s - 10) // 2
                for k, (txt, col, ic) in enumerate(nd["doble"]):
                    y0 = k * (hh + 10)
                    d.rounded_rectangle((0, y0, im.width - 1, y0 + hh), 8, fill=L.c(col))
                    icono(L, d, im, ic, hh / 2 + 4, y0 + hh / 2, hh * 0.9, (255, 255, 255, 255))
                    d.text((hh + 6, y0 + hh / 2 + 10), txt, font=L.F.por_cap("cond", 24), fill=(255, 255, 255, 255),
                           anchor="ls")
                self.piezas.append(Pieza(im, (x, y_caja), t_in, "pop", 0.12))
            else:
                caja = caja_icono(L, nd["icono"], nd.get("estilo", "blanco"), s)
                ancho_et = int(s + hueco * 0.9)
                et = Image.new("RGBA", (ancho_et, 70), (0, 0, 0, 0))
                d = ImageDraw.Draw(et)
                d.text((ancho_et / 2, 26), nd["texto"], font=fs, fill=L.c("tinta"), anchor="ms")
                if nd.get("nota"):
                    texto_espaciado(d, (ancho_et / 2, 56), nd["nota"].upper(), fm, L.c("gris"), 0.06, anchor="ms")
                self.piezas.append(Pieza(caja, (x, y_caja), t_in, "pop", 0.12))
                self.piezas.append(Pieza(et, (x + s / 2 - ancho_et / 2, y_caja + s + 8), t_in + 0.03, "fade", 0.1))
                max_y = max(max_y, y_caja + s + 8 + 64)
                if nd.get("cambia"):  # el nodo cambia de estado más tarde (p. ej. producción → roja)
                    cb = nd["cambia"]
                    caja2 = caja_icono(L, cb.get("icono", nd["icono"]), cb["estilo"], s)
                    self.piezas.append(Pieza(caja2, (x, y_caja), linea.t(cb["en"], DESFASE_PIEZA), "pop", 0.1))
            if i > 0:  # flecha desde el nodo anterior, entra con este nodo
                x0 = xs[i - 1] + anchos[i - 1] + 8
                largo = int(hueco - 16)
                if largo > 20:
                    fl = Image.new("RGBA", (largo, 24), (0, 0, 0, 0))
                    d = ImageDraw.Draw(fl)
                    d.line((0, 12, largo - 4, 12), fill=L.c("tinta"), width=3)
                    d.line([(largo - 14, 3), (largo - 3, 12), (largo - 14, 21)], fill=L.c("tinta"), width=3)
                    self.piezas.append(Pieza(fl, (x0, y_caja + s / 2 - 12), t_in - 0.02, "trazo", 0.14))
        y = max_y + 6
        if c.get("pastilla"):
            pz = c["pastilla"]
            im = pastilla(L, pz["texto"], pz.get("fondo", "datos"), size=pz.get("size", 21), icono_tipo=pz.get("icono"))
            px = self.w - 30 - im.width if pz.get("alinear", "der") == "der" else 30
            if pz.get("sobre_nodo") is not None:
                i = pz["sobre_nodo"]
                px = int(xs[i] + anchos[i] / 2 - im.width / 2)
                px = max(16, min(self.w - im.width - 16, px))
                self.piezas.append(Pieza(im, (px, y_caja - im.height / 2 - 6), linea.t(pz["en"], DESFASE_PIEZA),
                                         "pop", 0.12))
            else:
                self.piezas.append(Pieza(im, (px, y), linea.t(pz["en"], DESFASE_PIEZA), "pop", 0.12))
                y += im.height + 10
        return y

    def _estado(self, c, linea, y):
        """Barra de estado de la terminal dentro de la tarjeta: tira oscura + texto tecleado + pastilla."""
        L = self.L
        tira_h = 84
        tira = Image.new("RGBA", (self.w - 60, tira_h), (0, 0, 0, 0))
        ImageDraw.Draw(tira).rounded_rectangle((0, 0, tira.width - 1, tira_h - 1), 12, fill=L.c("terminal"))
        t_tira = linea.t(c["tira_en"], DESFASE_PIEZA)
        self.piezas.append(Pieza(tira, (30, y + 14), t_tira, "fade", 0.1))
        texto = c["texto"]
        fm = L.F.f("mono_b", 36)
        col = L.c(c.get("color", "menta"))
        ic = c.get("icono")

        def render(n, t, _texto=texto):
            im = Image.new("RGBA", (tira.width - 40, tira_h), (0, 0, 0, 0))
            d = ImageDraw.Draw(im)
            x = 0
            if ic:
                icono(L, d, im, ic, 22, tira_h / 2, 44, col)
                x = 58
            parcial = _texto[:max(0, n)]
            d.text((x, tira_h / 2 + 13), parcial, font=fm, fill=col, anchor="ls")
            if n <= len(_texto) or int(t * 2) % 2 == 0:
                cx = x + fm.getlength(parcial) + 4
                d.rectangle((cx, tira_h / 2 - 18, cx + 18, tira_h / 2 + 16), fill=col)
            return im

        cursor0 = Pieza(render(0, 0), (50, y + 14), t_tira + 0.1, "fade", 0.1)
        self.piezas.append(cursor0)
        t_txt = linea.t(c["en"], DESFASE_PIEZA)
        cursor0.hasta = t_txt
        self.piezas.append(Pieza(None, (50, y + 14), t_txt, "tecleo", 0.1, {"render": render}))
        y += tira_h + 28
        if c.get("pastilla"):
            pz = c["pastilla"]
            im = pastilla(L, pz["texto"], pz.get("fondo", "datos"), size=21, icono_tipo=pz.get("icono"))
            self.piezas.append(Pieza(im, (30, y), linea.t(pz["en"], DESFASE_PIEZA), "pop", 0.12))
            y += im.height + 6
        return y

    def dibujar(self, canvas: Image.Image, t: float, ctx):
        a = self.alpha_salida(t)
        p = (t - self.t0) / UNFOLD
        h_cur = int(6 + (self.h - 6) * ease_out(p))
        capa = Image.new("RGBA", (self.w + 40, self.h + 40), (0, 0, 0, 0))
        d = ImageDraw.Draw(capa)
        d.rounded_rectangle((20, 20, 20 + self.w, 20 + h_cur), 7, fill=self.L.c("papel"), outline=self.L.c("tinta"),
                            width=3)
        if p >= 1:
            pegar(capa, self.cab, (20, 20), ease_out((t - self.t0 - UNFOLD) / 0.1))
            sub = Image.new("RGBA", capa.size, (0, 0, 0, 0))
            for pz in self.piezas:
                if getattr(pz, "hasta", None) is not None and t >= pz.hasta:
                    continue
                pz.dibujar(sub, t, 20, 20)
            capa.alpha_composite(sub.crop((0, 0, capa.width, 20 + h_cur)), (0, 0))
        y0 = ctx["card_y"](self, t)
        pegar(canvas, capa, (self.x - 20, y0 - 20), a)
        if p >= 1:  # los esquineros encajan después del despliegue
            q = ease_out((t - self.t0 - UNFOLD) / 0.1)
            pegar(canvas, self.esq, (self.x - 17, y0 - 17), a * q, 1.0 + 0.06 * (1 - q))


class Sello(Elemento):
    def __init__(self, L: Lienzo, ev, linea: Linea):
        self.t0 = linea.t(ev["en"], ev.get("desfase_pieza", DESFASE_PIEZA) if "palabra" in ev["en"] else 0.0)
        self.t1 = linea.t(ev["hasta"])
        self.capa_layout = ev.get("layout", "T")
        self.centro = tuple(ev.get("centro", (420, 360)))
        fondo, tinta = {"kraft": ("kraft", "kraft_tinta"), "rojo": ("rojo", "#FFFFFF"),
                        "verde": ("datos", "#FFFFFF")}[ev.get("color", "kraft")]
        fc = L.F.por_cap("cond", ev.get("cap", 92))
        fm = L.F.f("mono", 22)
        tw = fc.getlength(ev["texto"])
        sw = ancho_espaciado(ev.get("sub", ""), fm, 0.18) if ev.get("sub") else 0
        w = int(max(tw, sw) + 70)
        h = int(ev.get("cap", 92) + (70 if ev.get("sub") else 46) + 20)
        im = Image.new("RGBA", (w + 20, h + 20), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rectangle((10, 10, 10 + w, 10 + h), fill=L.c(fondo), outline=L.c(tinta), width=4)
        d.text((10 + w / 2, 10 + 30 + ev.get("cap", 92)), ev["texto"], font=fc, fill=L.c(tinta), anchor="ms")
        if ev.get("sub"):
            texto_espaciado(d, (10 + w / 2, 10 + h - 22), ev["sub"], fm, L.c(tinta), 0.18, anchor="ms")
        # «-6°» de la receta = inclinado hacia arriba a la derecha (antihorario): en PIL es un ángulo positivo
        self.img = im.rotate(-ev.get("rot", -6), resample=Image.BICUBIC, expand=True)

    def dibujar(self, canvas, t, ctx):
        f = (t - self.t0) * FPS  # asienta en 5 cuadros con rebote leve
        p = min(1.0, f / 5)
        esc = 1.8 - 0.8 * ease_out_back(p, 1.2)
        img = self.img
        if p < 1:
            img = img.filter(ImageFilter.GaussianBlur(6 * (1 - p)))
        cx, cy = self.centro
        pegar(canvas, img, (cx - img.width / 2, cy - img.height / 2), self.alpha_salida(t) * min(1.0, 0.55 + p), esc,
              self.centro)


class Lamina(Elemento):
    """Layout G: papel cuadriculado, gafete en 13-20 %, captura 1080x606 en 22-53 %, chip FUENTE y marca verde."""
    capa_layout = "G"

    def __init__(self, L: Lienzo, ev, linea: Linea, capturas_meta, firma):
        self.t0 = linea.t(ev["desde"])
        self.t1 = linea.t(ev["hasta"])
        self.L = L
        base = Image.new("RGBA", (W, H), L.c("papel"))
        d = ImageDraw.Draw(base)
        for x in range(0, W, 44):
            d.line((x, 0, x, H), fill=L.c("papel_grilla"), width=2)
        for y in range(0, H, 44):
            d.line((0, y, W, y), fill=L.c("papel_grilla"), width=2)
        g = ev["gafete"]
        fc = L.F.por_cap("cond", 52)
        fm = L.F.f("mono", 22)
        lg = L.img(g["logo"]) if g.get("logo") else None
        gw = int(max(fc.getlength(g["titulo"]), ancho_espaciado(g.get("sub", ""), fm, 0.2)) + (140 if lg else 50))
        gy = 250
        d.rectangle((72, gy, 72 + gw, gy + 110), fill=(250, 250, 247, 255), outline=L.c("tinta"), width=3)
        tx = 72 + 24
        if lg:
            k = 78 / lg.height
            l2 = lg.resize((int(lg.width * k), 78), Image.LANCZOS)
            base.alpha_composite(l2, (tx, gy + 16))
            tx += l2.width + 18
        d.text((tx, gy + 66), g["titulo"], font=fc, fill=L.c("tinta"), anchor="ls")
        if g.get("sub"):
            texto_espaciado(d, (tx, gy + 96), g["sub"], fm, L.c("datos"), 0.2)
        meta = capturas_meta[ev["captura"]]
        cap = L.img(meta["archivo"]).convert("RGBA")
        cy = 421
        mask = Image.new("L", cap.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, cap.width - 1, cap.height - 1), 12, fill=255)
        base.paste(cap, (0, cy), mask)
        d.rounded_rectangle((1, cy, W - 2, cy + cap.height), 12, outline=L.c("tinta"), width=4)
        if firma.get("handle"):
            fmh = L.F.f("mono", 30)
            texto_espaciado(d, (W / 2, int(0.77 * H)), firma["handle"], fmh, L.c("gris", 150), 0.16, anchor="ms")
        self.base = base
        self.piezas = []
        if ev.get("fuente"):
            f = L.F.f("mono", 21)
            cw = ancho_espaciado(ev["fuente"], f, 0.12)
            chip = Image.new("RGBA", (int(cw + 28), 38), (0, 0, 0, 0))
            dc = ImageDraw.Draw(chip)
            dc.rounded_rectangle((0, 0, chip.width - 1, 37), 6, fill=L.c("tinta"))
            texto_espaciado(dc, (14, 27), ev["fuente"], f, (255, 255, 255, 255), 0.12)
            self.piezas.append(Pieza(chip, (W - 14 - chip.width, cy + 14), self.t0 + 4 / FPS, "fade", 0.1))
        if ev.get("marca") and meta.get("marca"):
            x0, y0, x1, y1 = meta["marca"]
            pad = 10
            mk = Image.new("RGBA", (int(x1 - x0 + 2 * pad + 8), int(y1 - y0 + 2 * pad + 8)), (0, 0, 0, 0))
            ImageDraw.Draw(mk).rounded_rectangle((4, 4, mk.width - 5, mk.height - 5), 12, outline=L.c("datos"), width=5)
            t_m = linea.t(ev["marca"]["en"], DESFASE_PIEZA) if ev["marca"].get("en") else self.t0 + 0.3
            self.piezas.append(Pieza(mk, (x0 - pad - 4, cy + y0 - pad - 4), t_m, "trazo", 0.15))
            if ev["marca"].get("pastilla"):
                pz = pastilla(L, ev["marca"]["pastilla"], "datos", size=24)
                py = cy + y1 + pad + 10
                if py + pz.height > cy + cap.height - 8:
                    py = cy + y0 - pad - 10 - pz.height
                px = max(24, min(W - 24 - pz.width, x0 - pad))
                self.piezas.append(Pieza(pz, (px, py), t_m + 0.15, "pop", 0.12))

    def dibujar(self, canvas, t, ctx):
        canvas.alpha_composite(self.base)
        for pz in self.piezas:
            pz.dibujar(canvas, t)


class Grabacion:
    """Lector secuencial de una grabación de pantalla REAL (el panel de arriba del layout S)."""

    def __init__(self, ruta: Path, recorte=None, encuadre="contener", fondo=(0, 0, 0)):
        self.ruta, self.recorte, self.encuadre, self.fondo = ruta, recorte, encuadre, fondo
        self.proc, self.j, self.cuadro = None, -1, None

    def _vf(self):
        f = []
        if self.recorte:
            x, y, w, h = self.recorte
            f.append(f"crop={w}:{h}:{x}:{y}")
        if self.encuadre == "cubrir":
            f.append(f"scale={W}:{COSTURA}:force_original_aspect_ratio=increase,crop={W}:{COSTURA}")
        else:
            f.append(f"scale={W}:{COSTURA}:force_original_aspect_ratio=decrease,"
                     f"pad={W}:{COSTURA}:(ow-iw)/2:(oh-ih)/2:color=0x{bytes(self.fondo).hex()}")
        f.append(f"fps={FPS}")
        return ",".join(f)

    def cuadro_en(self, seg: float) -> Image.Image:
        j = max(0, int(round(seg * FPS)))
        if self.proc is None or j < self.j:
            if self.proc:
                self.proc.kill()
            self.proc = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", f"{j / FPS:.4f}", "-i", str(self.ruta),
                                          "-vf", self._vf(), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                         stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
            self.j = j - 1
        while self.j < j:
            b = self.proc.stdout.read(W * COSTURA * 3)
            if len(b) < W * COSTURA * 3:
                break
            self.cuadro = b
            self.j += 1
        if self.cuadro is None:
            return Image.new("RGBA", (W, COSTURA), self.fondo + (255,))
        return Image.frombytes("RGB", (W, COSTURA), self.cuadro).convert("RGBA")


class Pantalla(Elemento):
    """Layout S: pantalla arriba, 0-840 px. `grabacion` = la pantalla real grabada (lo que pide la receta);
    `terminal` y `codigo` = mockup dibujado con código (piso de Sergio Urcullo cuando no hay grabación)."""
    capa_layout = "S"

    def __init__(self, L: Lienzo, ev, linea: Linea, base_dir: Path):
        self.L = L
        self.t0 = linea.t(ev["desde"])
        self.t1 = linea.t(ev["hasta"])
        self.piezas = []
        self.grab = None
        p = ev["pantalla"]
        self.tipo = p["tipo"]
        self.base = Image.new("RGBA", (W, COSTURA), L.c("terminal"))
        d = ImageDraw.Draw(self.base)
        fm = L.F.f("mono_b", 34)
        fms = L.F.f("mono_b", 28)
        if p["tipo"] == "grabacion":
            self._grabacion(p, linea, base_dir)
            return
        self.cabecera = p.get("cabecera", True)
        if self.cabecera:  # cabecera de Claude Code: glifo oficial + versión + carpeta
            lg = L.img(p.get("logo", "logo-claudecode.png"))
            k = 130 / lg.height
            self.base.alpha_composite(lg.resize((int(lg.width * k), 130), Image.LANCZOS), (40, 120))
            d.text((210, 170), "Claude Code", font=fm, fill=rgb("#D7D5FF"), anchor="ls")
            d.text((210 + fm.getlength("Claude Code "), 170), p.get("version", ""), font=fm,
                   fill=L.c("terminal_gris"), anchor="ls")
            d.text((210, 220), p.get("carpeta", "~/mi-proyecto"), font=fms, fill=L.c("terminal_gris"), anchor="ls")
        if p["tipo"] == "terminal":
            self._terminal(p, linea, d, fm, fms)
        elif p["tipo"] == "codigo":
            self._codigo(p, linea, d, fm, fms)
        else:
            raise ValueError(p["tipo"])

    # -- grabación real --
    def _grabacion(self, p, linea, base_dir):
        L = self.L
        ruta = Path(p["archivo"])
        if not ruta.is_absolute():
            ruta = base_dir / ruta
        self.grab = Grabacion(ruta, p.get("recorte"), p.get("encuadre", "contener"))
        # mapa tiempo de salida → segundo de la grabación: lineal por tramos con las anclas de `sincro`
        anclas = [(self.t0, float(p.get("inicio", 0.0)))]
        for s in p.get("sincro", []):
            anclas.append((linea.t(s["en"]), float(s["seg"])))
        self.anclas = sorted(anclas)
        for ev in p.get("piezas", []):   # contorno verde + pastilla sobre la línea clave (subagentes, 75 s)
            t_in = linea.t(ev["en"], DESFASE_PIEZA)
            t_out = linea.t(ev["hasta"]) if ev.get("hasta") else None
            x, y, w, h = ev["rect"]
            mk = Image.new("RGBA", (w + 16, h + 16), (0, 0, 0, 0))
            ImageDraw.Draw(mk).rounded_rectangle((3, 3, w + 12, h + 12), 12, outline=L.c("menta"), width=5)
            pz = Pieza(mk, (x - 8, y - 8), t_in, "trazo", 0.15)
            pz.hasta = t_out
            self.piezas.append(pz)
            if ev.get("pastilla"):
                pl = pastilla(L, ev["pastilla"], "datos", size=24)
                py = y - 8 - pl.height - 10 if y - 8 - pl.height - 10 > 8 else y + h + 18
                pz2 = Pieza(pl, (max(16, min(W - 16 - pl.width, x)), py), t_in + 0.15, "pop", 0.12)
                pz2.hasta = t_out
                self.piezas.append(pz2)

    def _seg_grab(self, t):
        a = self.anclas
        if len(a) == 1 or t <= a[0][0]:
            return a[0][1] + (t - a[0][0])
        for (t0, s0), (t1, s1) in zip(a, a[1:]):
            if t <= t1:
                return s0 + (t - t0) * (s1 - s0) / max(1e-6, t1 - t0)
        return a[-1][1] + (t - a[-1][0])

    def _estado_img(self, texto, icono_tipo, color, resto="", ancho=W - 40):
        L = self.L
        f = L.F.f("mono_b", 32)
        im = Image.new("RGBA", (ancho, 56), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        icono(L, d, im, icono_tipo, 24, 28, 46, color)
        d.text((58, 40), texto, font=f, fill=color, anchor="ls")
        if resto:
            d.text((58 + f.getlength(texto + " "), 40), resto, font=f, fill=L.c("terminal_gris"), anchor="ls")
        return im

    def _terminal(self, p, linea, d, fm, fms):
        L = self.L
        y_reg1, y_prompt, y_reg2, y_est = 560, 616, 668, 690
        d.line((20, y_reg1, W - 20, y_reg1), fill=rgb("#4A4D63"), width=2)
        d.text((40, y_prompt), "❯", font=fm, fill=L.c("terminal_txt"), anchor="ls")
        d.text((90, y_prompt), p.get("placeholder", 'Try "how do I log an error?"'), font=fms,
               fill=L.c("terminal_gris"), anchor="ls")
        d.line((20, y_reg2, W - 20, y_reg2), fill=rgb("#4A4D63"), width=2)
        e0 = p["estado"]
        self.base.alpha_composite(self._estado_img(e0["texto"], e0["icono"], L.c(e0.get("color", "ambar")),
                                                   e0.get("resto", "")), (24, y_est))
        for ev in p.get("piezas", []):
            t_in = linea.t(ev["en"], DESFASE_PIEZA)
            t_out = linea.t(ev["hasta"]) if ev.get("hasta") else None
            if ev["tipo"] == "marca_estado":
                mk = Image.new("RGBA", (W - 30, 72), (0, 0, 0, 0))
                ImageDraw.Draw(mk).rounded_rectangle((3, 3, mk.width - 4, 68), 14, outline=L.c("menta"), width=5)
                pz = Pieza(mk, (15, y_est - 8), t_in, "trazo", 0.15)
                pz.hasta = t_out
                self.piezas.append(pz)
                pl = pastilla(L, ev["pastilla"], "datos", size=24)
                pz2 = Pieza(pl, (W - 30 - pl.width, y_est - 8 - pl.height - 12), t_in + 0.15, "pop", 0.12)
                pz2.hasta = t_out
                self.piezas.append(pz2)
            elif ev["tipo"] == "teclas":
                self.piezas.extend(self._teclas(ev, linea, t_in, t_out))
            elif ev["tipo"] == "cambia_estado":
                e1 = ev["estado"]
                col = L.c(e1.get("color", "terminal_txt"))
                texto = e1["texto"]

                def render(n, t, _t=texto, _ic=e1["icono"], _c=col):
                    im = Image.new("RGBA", (W - 40, 56), L.c("terminal"))
                    if n > 0:
                        im.alpha_composite(self._estado_img(_t[:n], _ic, _c))
                    return im

                pz = Pieza(None, (24, y_est), t_in, "tecleo", 0.1, {"render": render})
                self.piezas.append(pz)
            else:
                raise ValueError(ev["tipo"])

    def _teclas(self, ev, linea, t_in, t_out):
        L = self.L
        out = []
        f = L.F.f("mono", 50)
        x = 140
        y = 290
        for i, k in enumerate(ev["teclas"]):
            tw = int(f.getlength(k) + 90)
            im = Image.new("RGBA", (tw, 150), (0, 0, 0, 0))
            d = ImageDraw.Draw(im)
            d.rounded_rectangle((0, 12, tw - 1, 149), 20, fill=rgb("#07080C"))
            d.rounded_rectangle((0, 0, tw - 1, 136), 20, fill=rgb("#2B2E40"), outline=rgb("#5A5E78"), width=3)
            d.text((tw / 2, 88), k, font=f, fill=(255, 255, 255, 255), anchor="ms")
            pz = Pieza(im, (x, y), t_in + i * 0.1, "pop", 0.12)
            pz.hasta = t_out
            out.append(pz)
            x += tw + 30
            if i < len(ev["teclas"]) - 1:
                mas = Image.new("RGBA", (60, 150), (0, 0, 0, 0))
                ImageDraw.Draw(mas).text((30, 92), "+", font=f, fill=L.c("terminal_gris"), anchor="ms")
                pz = Pieza(mas, (x - 15, y), t_in + i * 0.1 + 0.05, "fade", 0.1)
                pz.hasta = t_out
                out.append(pz)
                x += 45
        if ev.get("nota"):
            fm = L.F.f("mono_b", 26)
            im = Image.new("RGBA", (W - 280, 40), (0, 0, 0, 0))
            texto_espaciado(ImageDraw.Draw(im), (0, 30), ev["nota"], fm, L.c("menta"), 0.1)
            pz = Pieza(im, (140, y + 175), t_in + 0.2, "fade", 0.1)
            pz.hasta = t_out
            out.append(pz)
        return out

    def _codigo(self, p, linea, d, fm, fms):
        L = self.L
        y0 = 300 if self.cabecera else 120
        d.rounded_rectangle((30, y0, W - 30, COSTURA - 30), 18, fill=rgb("#14151F"), outline=rgb("#3A3D52"), width=2)
        d.rounded_rectangle((30, y0, W - 30, y0 + 70), 18, fill=rgb("#1B1C29"))
        d.rectangle((30, y0 + 50, W - 30, y0 + 70), fill=rgb("#1B1C29"))
        icono(L, d, self.base, "archivo", 74, y0 + 35, 44, L.c("terminal_gris"))
        d.text((104, y0 + 46), p["archivo"], font=fms, fill=L.c("terminal_txt"), anchor="ls")
        lineas = p["lineas"]
        fl = L.F.f("mono_b", 36)
        self.code_y = []
        for i, ln in enumerate(lineas):
            y = y0 + 130 + i * 70
            self.code_y.append(y)
            d.text((60, y), str(i + 1), font=fl, fill=rgb("#5A5E78"), anchor="ls")
            if not ln.get("tecleo"):
                d.text((120, y), ln["texto"], font=fl, fill=L.c(ln.get("color", "terminal_txt")), anchor="ls")
        for i, ln in enumerate(lineas):
            if not ln.get("tecleo"):
                continue
            y = self.code_y[i]
            t_in = linea.t(ln["tecleo"], DESFASE_PIEZA)
            texto = ln["texto"]
            col = L.c(ln.get("color", "menta"))

            def render(n, t, _texto=texto, _col=col):
                im = Image.new("RGBA", (W - 160, 60), (0, 0, 0, 0))
                dd = ImageDraw.Draw(im)
                dd.rounded_rectangle((0, 0, im.width - 1, 59), 8, fill=L.c("datos", 70))
                parcial = _texto[:n]
                dd.text((10, 46), parcial, font=fl, fill=_col, anchor="ls")
                if n <= len(_texto) or int(t * 2) % 2 == 0:
                    cx = 10 + fl.getlength(parcial) + 2
                    dd.rectangle((cx, 12, cx + 4, 52), fill=_col)
                return im

            self.piezas.append(Pieza(None, (110, y - 46), t_in, "tecleo", 0.1, {"render": render}))
        for ev in p.get("piezas", []):
            t_in = linea.t(ev["en"], DESFASE_PIEZA)
            if ev["tipo"] == "pastilla":
                pl = pastilla(L, ev["texto"], ev.get("fondo", "datos"), size=24)
                xy = ev.get("xy", (W - 60 - pl.width, y0 + 12))
                self.piezas.append(Pieza(pl, tuple(xy), t_in, "pop", 0.12))
            elif ev["tipo"] == "marca_linea":
                i = ev["linea"] - 1
                mk = Image.new("RGBA", (W - 130, 76), (0, 0, 0, 0))
                ImageDraw.Draw(mk).rounded_rectangle((3, 3, mk.width - 4, 72), 12, outline=L.c("menta"), width=5)
                self.piezas.append(Pieza(mk, (95, self.code_y[i] - 56), t_in, "trazo", 0.15))
            else:
                raise ValueError(ev["tipo"])

    def dibujar(self, canvas, t, ctx):
        if self.grab is not None:
            canvas.alpha_composite(self.grab.cuadro_en(self._seg_grab(t)), (0, 0))
        else:
            canvas.alpha_composite(self.base, (0, 0))
        for pz in self.piezas:
            if getattr(pz, "hasta", None) is not None and t >= pz.hasta:
                continue
            pz.dibujar(canvas, t)


class CTA(Elemento):
    """Caja verde tecleada: rótulo mono + PALABRA a 1 letra por cuadro con cursor «_», logo monocromo blanco
    dentro de la caja y firma en mono debajo."""

    def __init__(self, L: Lienzo, ev, linea: Linea, firma, zona_y):
        self.L, self.ev = L, ev
        self.t0 = linea.t(ev["desde"])
        self.t1 = linea.t(ev.get("hasta", {"fin_video": True})) + 1
        self.w = ev.get("ancho", 895)
        self.x = 70
        self.h = 150
        self.palabra = ev["palabra"]
        self.fc = L.F.por_cap("cond", 66)
        self.fm = L.F.f("mono", 22)
        self.esq = esquineros(L, self.w, self.h, brazo=40, grosor=5, sep=14, color=L.c("esquinero"))
        self.firma = firma
        self.t_recibe = linea.t(ev["recibe_en"], DESFASE_PIEZA) if ev.get("recibe_en") else self.t0 + 0.6
        self.y = zona_y(self, ev)
        self.logo = None
        if ev.get("logo"):
            lg = L.img(ev["logo"])
            k = 92 / lg.height
            lg = lg.resize((int(lg.width * k), 92), Image.LANCZOS)
            self.logo = monocromo(lg) if ev.get("logo_mono", True) else lg

    def dibujar(self, canvas, t, ctx):
        L = self.L
        y0 = self.y
        f = (t - self.t0) * FPS
        p = min(1.0, f / 4)   # línea → caja en 4 cuadros (EVOX2)
        h_cur = int(6 + (self.h - 6) * ease_out(p))
        capa = Image.new("RGBA", (W, self.h + 120), (0, 0, 0, 0))
        d = ImageDraw.Draw(capa)
        d.rounded_rectangle((self.x, 0, self.x + self.w, h_cur), 8, fill=L.c("datos"))
        if p >= 1:
            fa = ease_out((f - 4) / 3)
            sub = Image.new("RGBA", capa.size, (0, 0, 0, 0))
            ds = ImageDraw.Draw(sub)
            texto_espaciado(ds, (self.x + 30, 38), self.ev.get("rotulo", "COMENTÁ"), self.fm, (255, 255, 255, 255), 0.18)
            n = int(max(0, f - 6)) + 1 if f >= 6 else 0  # 1 letra por cuadro
            parcial = self.palabra[:n]
            ds.text((self.x + 28, 116), parcial, font=self.fc, fill=(255, 255, 255, 255), anchor="ls")
            if n <= len(self.palabra) or int(t * 2.5) % 2 == 0:
                cx = self.x + 28 + self.fc.getlength(parcial) + 6
                ds.rectangle((cx, 108, cx + 40, 116), fill=(255, 255, 255, 255))
            capa.alpha_composite(con_alpha(sub, fa))
            if t >= self.t_recibe and self.ev.get("recibe"):
                q = ease_out((t - self.t_recibe) / 0.12)
                fr = L.F.f("mono_b", 24)
                ims = Image.new("RGBA", capa.size, (0, 0, 0, 0))
                texto_espaciado(ImageDraw.Draw(ims), (self.x + 30, self.h + 52), self.ev["recibe"], fr,
                                L.c("sub_blanco"), 0.1)
                sh = ims.getchannel("A").filter(ImageFilter.GaussianBlur(4))
                sombra = Image.new("RGBA", capa.size, (0, 0, 0, 255))
                sombra.putalpha(sh.point(lambda v: int(v * 0.85)))
                capa.alpha_composite(con_alpha(sombra, q))
                capa.alpha_composite(con_alpha(ims, q))
        pegar(canvas, capa, (0, y0), 1.0)
        if p >= 1:
            q = ease_out((f - 4) / 3)
            pegar(canvas, self.esq, (self.x - 14, y0 - 14), q, 1.0 + 0.06 * (1 - q))
            if self.logo is not None:  # ícono monocromo blanco SOBRE la caja, a la derecha
                pegar(canvas, self.logo, (self.x + self.w - 34 - self.logo.width, y0 + (self.h - self.logo.height) / 2),
                      q, 0.86 + 0.14 * q)
            if self.firma.get("nombre"):
                fq = ease_out((f - 8) / 4)
                fi = L.F.f("mono", 24)
                im = Image.new("RGBA", (700, 60), (0, 0, 0, 0))
                dd = ImageDraw.Draw(im)
                dd.rectangle((2, 6, 40, 52), outline=L.c("esquinero"), width=3)
                dd.text((21, 41), self.firma.get("inicial", "S"), font=L.F.f("mono", 30), fill=L.c("sub_blanco"),
                        anchor="ms")
                texto_espaciado(dd, (56, 39), self.firma["nombre"], fi, L.c("sub_blanco"), 0.2)
                pegar(canvas, im, (self.x + 4, y0 + self.h + 82), fq)


# ───────────────────────────── subtítulos ─────────────────────────────
class Karaoke:
    def __init__(self, L: Lienzo, linea: Linea, layout_en, cortes_visuales, cfg):
        self.L = L
        self.linea = linea
        words = linea.words
        n_obj = cfg.get("palabras_por_bloque", 3)
        self.fc = L.F.por_cap("cond", CAP_SUB)
        self.fc_act = L.F.por_cap("cond", int(round(CAP_SUB * ACTIVA_ESCALA)))
        # 1) tramos: un bloque no cruza un cambio de layout
        tramos, cur = [], []
        for i, w in enumerate(words):
            if cur and layout_en(w["start"]) != layout_en(words[cur[-1]]["start"]):
                tramos.append(cur)
                cur = []
            cur.append(i)
        if cur:
            tramos.append(cur)
        # 2) bloques de 3 (2-4), cortados mecánicamente aunque crucen la puntuación
        bloques = []
        for tr in tramos:
            grupos = [tr[k:k + n_obj] for k in range(0, len(tr), n_obj)]
            if len(grupos) > 1 and len(grupos[-1]) == 1:
                ult = grupos.pop()
                if len(grupos[-1]) + 1 <= 4:
                    grupos[-1] = grupos[-1] + ult
                else:
                    grupos.append(ult)
            bloques.extend(grupos)
        self.bloques = []
        for b_i, g in enumerate(bloques):
            ini = words[g[0]]["start"]
            # entra EN el corte si su primera palabra llega hasta 0,25 s después (esconde el salto)
            previos = [c for c in cortes_visuales if ini - 0.25 <= c <= ini + 1e-6]
            if previos:
                ini = min(previos)
            if b_i == 0 and ini < 0.3:
                ini = 0.0   # «arrancá con el subtítulo ya puesto en el cuadro 0»
            fin = words[g[-1]]["end"]
            self.bloques.append({"idx": g, "ini": ini, "fin_palabras": fin, "layout": layout_en(words[g[0]]["start"])})
        for k, b in enumerate(self.bloques):
            sig = self.bloques[k + 1]["ini"] if k + 1 < len(self.bloques) else linea.total
            b["fin"] = sig if sig - b["fin_palabras"] < 0.7 else b["fin_palabras"] + 0.35
            b["lineas"] = self._lineas(b)
            b["centros"] = self._centros(b)
        self._cache = {}

    def _texto(self, i):
        return self.linea.words[i]["word"].upper()

    def _lineas(self, b):
        idx = b["idx"]
        gap = 0.7 * CAP_SUB
        anchos = [self.fc_act.getlength(self._texto(i)) for i in idx]
        total = sum(anchos) + gap * (len(idx) - 1)
        if total <= ANCHO_SUB or len(idx) == 1:
            return [idx]
        corte = 2 if len(idx) >= 3 else 1
        return [idx[:corte], idx[corte:]]

    def _centros(self, b):
        """Centro vertical (alto de mayúscula) de cada línea. En T el bloque es FIJO: 1 línea en 74 %, 2 líneas en
        72 % y 76,5 %. No baja para esquivar la cara (eso se arregla grabando con los ojos al 30 %)."""
        n = len(b["lineas"])
        if b["layout"] == "T":
            return [SUB_Y_T * H] if n == 1 else [SUB_L2[0] * H, SUB_L2[1] * H]
        y = (SUB_Y_G if b["layout"] == "G" else SUB_Y_S) * H
        paso = (SUB_L2[1] - SUB_L2[0]) * H
        return [y] if n == 1 else [y - paso / 2, y + paso / 2]

    def caja_glifos(self, b):
        """(y_arriba, y_abajo) del bloque en pantalla, con la activa a escala máxima."""
        c = b["centros"]
        m = CAP_SUB * ACTIVA_ESCALA / 2
        return c[0] - m, c[-1] + m

    def _render(self, b, activa, escala):
        L = self.L
        claro = b["layout"] == "G"
        blanco = L.c("sub_tinta") if claro else L.c("sub_blanco")
        verde = L.c("sub_activa_claro") if claro else L.c("menta")
        gap = 0.7 * CAP_SUB
        top = int(b["centros"][0] - CAP_SUB - 60)
        alto = int(b["centros"][-1] + CAP_SUB + 60) - top
        capa = Image.new("RGBA", (W, alto), (0, 0, 0, 0))
        d = ImageDraw.Draw(capa)
        for li, fila in enumerate(b["lineas"]):
            anchos = [self.fc.getlength(self._texto(i)) for i in fila]
            total = sum(anchos) + gap * (len(fila) - 1)
            x = W / 2 - total / 2
            yb = b["centros"][li] - top + CAP_SUB / 2      # línea de base = centro + medio alto de mayúscula
            for i, aw in zip(fila, anchos):
                txt = self._texto(i)
                es_act = i == activa
                f = self.fc
                yy = yb
                if es_act and escala > 1.001:
                    f = self.L.F.f("cond", int(round(self.fc.size * escala)))
                    yy = yb + CAP_SUB * (escala - 1) / 2     # crece desde su centro, no desde la base
                kw = dict(font=f, fill=verde if es_act else blanco, anchor="ms")
                if not claro:
                    kw.update(stroke_width=3, stroke_fill=(0, 0, 0, 235))
                d.text((x + aw / 2, yy), txt, **kw)
                x += aw + gap
        if not claro:  # sombra suave
            sh = capa.getchannel("A").filter(ImageFilter.GaussianBlur(7))
            sombra = Image.new("RGBA", capa.size, (0, 0, 0, 255))
            sombra.putalpha(sh.point(lambda v: int(v * 0.5)))
            out = Image.new("RGBA", capa.size, (0, 0, 0, 0))
            out.alpha_composite(sombra, (0, 4))
            out.alpha_composite(capa)
            capa = out
        return capa, top

    def bloque_en(self, t):
        for k, b in enumerate(self.bloques):
            if b["ini"] <= t < b["fin"]:
                return k, b
        return None, None

    def dibujar(self, canvas, t, alpha=1.0):
        k, b = self.bloque_en(t)
        if b is None:
            return None
        words = self.linea.words
        activa, esc = None, 1.0
        for i in b["idx"]:
            if words[i]["start"] <= t + 1e-6:
                activa = i
        if activa is not None:
            fr = int(round((t - words[activa]["start"]) * FPS))
            # 1,00 → 1,08 en 3 cuadros con ease-out: el cuadro en que se activa todavía mide 1,00
            esc = round(1 + (ACTIVA_ESCALA - 1) * ease_out_quad(fr / 3), 3)
        key = (k, activa, esc)
        if key not in self._cache:
            if len(self._cache) > 64:
                self._cache.clear()
            self._cache[key] = self._render(b, activa, esc)
        capa, top = self._cache[key]
        pegar(canvas, capa, (0, top), alpha)
        return b


# ───────────────────────────── audio ─────────────────────────────
def escribir_wav_f32(p: Path, x: np.ndarray):
    proc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                             "-c:a", "pcm_f32le", str(p)], stdin=subprocess.PIPE)
    proc.stdin.write(x.astype(np.float32).tobytes())
    proc.stdin.close()
    proc.wait()


def banda(ruido, lo, hi):
    F = np.fft.rfft(ruido)
    fr = np.fft.rfftfreq(len(ruido), 1 / SR)
    F[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(F, len(ruido))


def sfx_brillo(dur=0.55, seed=3):
    """Brillo agudo de Erik: energía en 9-16 kHz, ataque de 8 ms y cola de ~0,5 s."""
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    env = (1 - np.exp(-t / 0.008)) * np.exp(-t / 0.15)
    out = np.zeros((n, 2))
    for ch in range(2):
        s = np.zeros(n)
        for k, f in enumerate([9300, 10700, 12400, 13900, 15300]):
            s += np.sin(2 * np.pi * (f * t + (220 if k % 2 else -180) * t ** 2) + rng.uniform(0, 6.28)) / (1 + 0.3 * k)
        s += 1.6 * banda(rng.standard_normal(n), 9000, 16000)
        s *= 0.75 + 0.25 * np.sin(2 * np.pi * (21 + 3 * ch) * t)
        out[:, ch] = s * env
    return out / np.abs(out).max()


def sfx_golpe(seed=5):
    """Golpe del sello: cuerpo grave corto + chasquido de papel en estéreo."""
    rng = np.random.default_rng(seed)
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    cuerpo = np.sin(2 * np.pi * (95 * t - 60 * t ** 2)) * np.exp(-t / 0.06)
    out = np.zeros((n, 2))
    for ch in range(2):
        chas = banda(rng.standard_normal(n), 1500, 7000) * np.exp(-t / 0.018)
        out[:, ch] = 0.9 * cuerpo + 1.4 * chas / (np.abs(chas).max() + 1e-9)
    return out / np.abs(out).max()


def medir(p: Path):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", str(p), "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    s = r[r.rfind("Summary:"):]
    I = float(re.search(r"I:\s+(-?[\d.]+) LUFS", s).group(1))
    LRA = float(re.search(r"LRA:\s+(-?[\d.]+) LU", s).group(1))
    TP = float(re.search(r"Peak:\s+(-?[\d.inf]+) dBFS", s).group(1))
    return I, LRA, TP


def concat_cruzado(full: np.ndarray, keep, total: float) -> np.ndarray:
    """Concatena los tramos con un cruce de igual potencia de XFADE centrado en cada empalme (nunca baja a cero).
    El total queda idéntico a la suma de los tramos: el audio no se corre contra el video."""
    h = XFADE / 2
    nf = int(round(XFADE * SR))
    n_tot = int(round(total * SR))
    out = np.zeros((n_tot + nf + 8, full.shape[1]))
    pos = 0.0
    ult = len(keep) - 1
    for k, (a, b) in enumerate(keep):
        pre = h if k > 0 else 0.0
        post = h if k < ult else 0.0
        i0 = int(round((a - pre) * SR))
        i1 = int(round((b + post) * SR))
        seg = np.zeros((i1 - i0, full.shape[1]))
        s0, s1 = max(0, i0), min(len(full), i1)
        if s1 > s0:
            seg[s0 - i0:s1 - i0] = full[s0:s1]
        w = np.ones(len(seg))
        if k > 0:
            w[:nf] = np.sin(np.pi / 2 * np.linspace(0, 1, nf))
        if k < ult:
            w[-nf:] = np.cos(np.pi / 2 * np.linspace(0, 1, nf))
        o0 = int(round((pos - pre) * SR))
        o1 = min(len(out), o0 + len(seg))
        out[max(0, o0):o1] += (seg * w[:, None])[max(0, -o0):o1 - o0]
        pos += b - a
    return out[:n_tot]


def rellenar_room_tone(x: np.ndarray, full: np.ndarray, seed=7):
    """Los huecos que caen 12 dB debajo del piso de la toma (el teléfono corta a cero) se rellenan con room tone
    de la MISMA toma, con fundidos de 5 ms. Devuelve (audio, [(inicio, dur)])."""
    rng = np.random.default_rng(seed)
    fr = int(0.0025 * SR)

    def rms_frames(y):
        m = y.mean(axis=1) if y.ndim > 1 else y
        n = len(m) // fr
        return np.sqrt(np.mean(m[:n * fr].reshape(n, fr) ** 2, axis=1) + 1e-20)

    rf = rms_frames(full)
    vivos = rf[rf > 1e-5]
    piso = float(np.percentile(vivos, 8))
    umbral = piso * 10 ** (-12 / 20)
    # pool de room tone: la ventana de 0,4 s más callada de la toma que no tenga ningún cuadro bajo el umbral
    win = int(0.4 * SR / fr)
    mejor, i_mejor = None, None
    for i in range(0, len(rf) - win, 4):
        seg = rf[i:i + win]
        if seg.min() < umbral:
            continue
        v = float(np.mean(seg))
        if mejor is None or v < mejor:
            mejor, i_mejor = v, i
    if i_mejor is None:
        return x, []
    pool = full[i_mejor * fr:(i_mejor + win) * fr]
    r = rms_frames(x)
    malo = r < umbral
    huecos, i = [], 0
    while i < len(malo):
        if malo[i]:
            j = i
            while j < len(malo) and malo[j]:
                j += 1
            if j - i >= 2:
                huecos.append((i * fr, j * fr))
            i = j
        else:
            i += 1
    f = int(0.005 * SR)
    x = x.copy()
    for a, b in huecos:
        a0, b0 = max(0, a - f), min(len(x), b + f)
        L = b0 - a0
        reps = int(math.ceil((L + len(pool)) / len(pool))) + 1
        tono = np.concatenate([pool] * reps)
        off = int(rng.integers(0, len(pool)))
        tono = tono[off:off + L]
        p = np.ones(L)
        ki, ko = a - a0, b0 - b
        if ki:
            p[:ki] = np.sin(np.pi / 2 * np.linspace(0, 1, ki))
        if ko:
            p[-ko:] = np.cos(np.pi / 2 * np.linspace(0, 1, ko))
        q = np.sqrt(np.clip(1 - p ** 2, 0, 1))
        x[a0:b0] = x[a0:b0] * q[:, None] + tono * p[:, None]
    return x, [(a / SR, (b - a) / SR) for a, b in huecos]


# ───────────────────────────── editor ─────────────────────────────
class Editor:
    def __init__(self, args):
        self.args = args
        self.sb = json.loads(Path(args.storyboard).read_text())
        self.sb_dir = Path(args.storyboard).resolve().parent
        cut = json.loads(Path(args.cutplan).read_text())
        keep0 = [(float(k["start"]), float(k["end"])) for k in cut["keep"]]
        tr = json.loads(Path(args.transcript).read_text())
        words0 = [w for w in tr["words"] if w["word"].strip()]
        self.bruto = Path(args.bruto)
        n_src = int(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets",
                                    "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", str(self.bruto)],
                                   capture_output=True, text=True).stdout.strip() or 0) or None
        num, den = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                   "stream=r_frame_rate", "-of", "csv=p=0", str(self.bruto)],
                                  capture_output=True, text=True).stdout.strip().split("/")
        fps_src = float(num) / float(den or 1)
        self.trabajo = Path(args.trabajo or Path(args.salida).with_suffix("").as_posix() + "-trabajo")
        self.trabajo.mkdir(parents=True, exist_ok=True)
        # 1) tiempo: palabras reales (Vosk + RMS) y huecos/frases a quitar sobre el cutplan aprobado
        linea0 = Linea(keep0, words0, fps_src, n_src)
        self._tiempo(linea0, keep0, words0)
        self.linea = Linea(self.keep, self.words, fps_src, n_src,
                           cortes_base=[self.recorte.nuevo(c) for c in linea0.cortes])
        assets = [Path(a) for a in self.sb.get("assets", [])]
        assets = [a if a.is_absolute() else (self.sb_dir / a) for a in assets] + [AQUI / "assets-ejemplo"]
        fuentes = Fuentes([a / "fuentes" for a in assets] + [Path.home() / ".fonts/onia-carruseles",
                                                              Path("/root/.fonts/onia-carruseles")])
        self.L = Lienzo(PALETAS[self.sb.get("paleta", "onia")], fuentes, assets)
        self.firma = self.sb.get("firma", {})
        self.capturas_meta = {}
        for a in assets:
            cj = a / "capturas.json"
            if cj.exists():
                for k, v in json.loads(cj.read_text())["capturas"].items():
                    self.capturas_meta.setdefault(k, v)
        self.fin = self.linea.total
        if not args.sin_recorte_cola:   # corte seco 0,15 s después de la última palabra, sin placa final
            ult = self.linea.words[-1]["end"] + 0.15
            if self.linea.total - ult > 0.05:
                self.fin = min(self.linea.total, ult)
        modelo = AQUI.parent.parent.parent / "editor-videos" / "assets" / "models" / "face_detection_yunet_2023mar.onnx"
        self.caras = analizar_caras(self.bruto, self.linea, self.trabajo / "caras.json", modelo)
        self._armar()

    # -- tiempo --
    def _tiempo(self, linea0: Linea, keep0, words0):
        x16 = decodificar(self.bruto, SR_AN, 1)
        voz0 = concat_seco(x16, keep0, SR_AN)
        full_db, alta_db = envolvente(voz0)
        corridas, self.umbrales = silencios(full_db, alta_db)
        clave = f"{self.bruto.stat().st_size}-{self.bruto.stat().st_mtime_ns}-" + \
                ",".join(f"{a:.3f}-{b:.3f}" for a, b in keep0)
        vw = None if self.args.sin_vosk else vosk_palabras(voz0, self.trabajo / "vosk.json", clave)
        self.tiempo_fuente = "vosk+rms" if vw else "transcript+rms"
        w0 = refinar_palabras(words0, vw, corridas)
        total0 = linea0.total
        quitar, motivos = [], []
        cfg = self.sb.get("corte", {})
        hueco_max = cfg.get("hueco_max", HUECO_MAX)
        post = hueco_max * HUECO_POST / HUECO_MAX
        pre = hueco_max * HUECO_PRE / HUECO_MAX
        if not self.args.sin_apretar:
            starts = sorted(w["start"] for w in w0)
            cands = []
            for a, b in corridas:
                if a < 0.05 or b > total0 - 0.05:
                    continue
                x, y = a + post, b - pre
                sig = next((s for s in starts if s > x), None)   # nunca comerse el arranque de una palabra
                if sig is not None:
                    y = min(y, sig - 0.04)
                if y - x >= HUECO_MIN_QUITAR:
                    cands.append((x, y, a, b))
            # cada hueco apretado es un jump cut: si cae a menos de 0,9 s de otro corte deja un plano-flash.
            # Un hueco chico (< 0,25 s quitados) al lado de un corte se deja como está; uno pegado (≤ 0,12 s) se
            # funde con ese corte y no agrega nada.
            aceptados = []
            for x, y, a, b in sorted(cands, key=lambda c: c[1] - c[0], reverse=True):
                otros = list(linea0.cortes) + [v for xa, ya in aceptados for v in (xa, ya)]
                d = min([min(abs(x - c), abs(y - c)) for c in otros if not (x - 0.12 <= c <= y + 0.12)], default=9)
                if y - x < 0.25 and d < 0.9:
                    continue
                aceptados.append((x, y))
                antes = next((w for w in reversed(w0) if w["start"] < a), None)
                despues = next((w for w in w0 if w["start"] >= b - 0.02), None)
                quitar.append((x, y))
                motivos.append(("hueco", x, y, f"pausa de {b - a:.2f} s entre «{antes['word'] if antes else '·'}» "
                                               f"y «{despues['word'] if despues else '·'}» → {hueco_max:.2f} s"))
        for fr in ([] if self.args.sin_apretar else cfg.get("quitar", [])):
            i, _ = linea0.buscar(fr["desde"]["palabra"], fr["desde"].get("n", 1), fr["desde"].get("despues_de", -1))
            _, j = linea0.buscar(fr["hasta"]["palabra"], fr["hasta"].get("n", 1), fr["hasta"].get("despues_de", -1))
            ta, tb = w0[i]["start"], w0[j]["end"]
            antes = [c for c in corridas if ta - 0.3 <= c[1] <= ta + 0.12]
            despues = [c for c in corridas if tb - 0.12 <= c[0] <= tb + 0.3]
            x = antes[-1][0] + post if antes else ta - 0.03
            y = despues[0][1] - pre if despues else tb + 0.03
            frase = " ".join(w["word"] for w in w0[i:j + 1])
            quitar.append((x, y))
            motivos.append(("frase", x, y, f"frase «{frase}» ({fr.get('por_que', 'storyboard')})"))
        rec = Recorte(quitar)
        # ningún tramo nuevo de menos de 0,12 s (cuadros sueltos entre dos cortes): se suma a lo quitado
        cum0 = linea0.cum
        for _ in range(5):
            chicos = [(x, y) for _sa, _sb, x, y in rec.tramos(keep0, cum0) if y - x < 0.12]
            if not chicos:
                break
            rec = Recorte(rec.q + chicos)
        self.recorte = rec
        tr = rec.tramos(keep0, cum0)
        self.keep = [(sa, sb) for sa, sb, _x, _y in tr]
        self.words = []
        for w in w0:
            if rec.dentro((w["start"] + w["end"]) / 2):   # palabra de una frase quitada
                continue
            nw = dict(w)
            for k in ("start", "end", "start_w", "end_w"):
                nw[k] = round(rec.nuevo(w[k]), 3)
            self.words.append(nw)
        self.corridas_nuevas = [(rec.nuevo(a), rec.nuevo(b)) for a, b in corridas]
        self.motivos = motivos
        # salidas para Sergio Urcullo: el cutplan derivado y su tabla (regla de oro: se mira ANTES de publicar)
        (self.trabajo / "cutplan-erik.json").write_text(json.dumps({
            "derivado_de": str(self.args.cutplan), "hueco_max": hueco_max, "tiempo": self.tiempo_fuente,
            "duracion_antes": round(total0, 3), "duracion_despues": round(sum(b - a for a, b in self.keep), 3),
            "keep": [{"start": round(a, 3), "end": round(b, 3)} for a, b in self.keep],
            "quitado": [{"start": round(a, 3), "end": round(b, 3)} for a, b in rec.q]}, indent=1))
        filas = ["| # | Salida vieja (s) | Bruto (s) | Quita (s) | Qué |", "|---|---|---|---|---|"]
        for n, (tipo, a, b, txt) in enumerate(sorted(motivos, key=lambda m: m[1]), 1):
            filas.append(f"| {n} | {a:.2f}-{b:.2f} | {linea0.src_t(a):.2f}-{linea0.src_t(b - 1e-3):.2f} | "
                         f"{b - a:.2f} | {txt} |")
        tot = sum(b - a for a, b in rec.q)
        (self.trabajo / "tabla-cortes.md").write_text(
            f"# Cortes derivados del cutplan aprobado\n\nAntes {total0:.2f} s → después {total0 - tot:.2f} s "
            f"(quita {tot:.2f} s). Tiempos de palabra: {self.tiempo_fuente}.\n\n" + "\n".join(filas) + "\n")

    # -- caras --
    def _fr(self, t):
        return int(min(len(self.caras["chin"]) - 1, max(0, round(t * FPS))))

    def chin_max(self, t0, t1):
        a, b = self._fr(t0), max(self._fr(t0) + 1, self._fr(t1))
        chin = self.caras["chin"][a:b]
        return float(np.percentile(chin, 90)) if len(chin) else float(self.caras["chin"][a])

    def frente_min_pantalla(self, t0, t1):
        """Borde superior de la frente en pantalla (caja de YuNet, con el zoom aplicado), el mínimo del tramo."""
        best = H
        for f in range(self._fr(t0), max(self._fr(t0) + 1, self._fr(t1)), 3):
            top = self.caras["top"][f]
            s, ax, ay = self.zoom_en(f / FPS)
            best = min(best, ay - (ay - top) * s)
        return best

    # -- armado del timeline --
    def _armar(self):
        L, linea = self.L, self.linea
        evs = self.sb["eventos"]
        self.laminas = [Lamina(L, e, linea, self.capturas_meta, self.firma) for e in evs if e["tipo"] == "lamina"]
        self.pantallas = [Pantalla(L, e, linea, self.sb_dir) for e in evs if e["tipo"] == "pantalla"]
        self.cambios = sorted({x for e in self.laminas + self.pantallas for x in (e.t0, e.t1)})
        self._planos(evs)
        self.cortes_visuales = unicos([c for c in linea.cortes if c < self.fin] + list(self.cambios)
                                      + list(self.cortes_ritmo))
        # los que se VEN: un corte del cutplan con lámina antes y después queda tapado por la lámina
        self.cortes_vistos = [c for c in self.cortes_visuales if 0 < c < self.fin and not (
            self.layout_en(c - 1e-3) == "G" and self.layout_en(c + 1e-3) == "G")]
        # zooms: rampa al entrar, vuelven a 1,00 en el siguiente corte (cutplan, layout o jump cut)
        self.zooms = []
        for e in evs:
            if e["tipo"] != "zoom":
                continue
            t0 = linea.t(e["en"])
            t1 = linea.siguiente_corte(t0, list(self.cambios) + list(self.cortes_ritmo))
            if e.get("hasta"):
                t1 = min(t1, linea.t(e["hasta"]))
            en_corte = any(abs(t0 - c) < 0.5 / FPS for c in self.cortes_visuales)
            a, b = self._fr(t0), max(self._fr(t0) + 1, self._fr(t1))
            self.zooms.append(dict(t0=t0, t1=t1, s=e.get("escala", 1.13),
                                   ax=float(np.median(self.caras["cx"][a:b])),
                                   ay=float(np.median(self.caras["chin"][a:b])),
                                   salto=e.get("salto", 1.04 if en_corte else None)))
        self._bases()
        self.tarjetas = [Tarjeta(L, e, linea, None, self._zona_y) for e in evs if e["tipo"] == "tarjeta"]
        # relevo: si otra tarjeta se despliega en el mismo lugar mientras ésta sale, ésta no deja fantasma (si no,
        # asoma por debajo de la nueva, que todavía está abriéndose)
        for c in self.tarjetas:
            for o in self.tarjetas:
                if o is not c and c.t1 - 1 / FPS <= o.t0 < c.t1 + GHOST and o.y < c.y + c.h and c.y < o.y + o.h:
                    c.fantasma = False
        self.sellos = [Sello(L, e, linea) for e in evs if e["tipo"] == "sello"]
        self.ctas = [CTA(L, e, linea, self.firma, self._zona_y) for e in evs if e["tipo"] == "cta"]
        self.sfx = []
        for s in self.sellos:
            self.sfx.append(("golpe", s.t0, 0.55))
        for c in self.ctas:
            self.sfx.append(("brillo", c.t0, c.ev.get("sfx_nivel", 2.6)))
        for e in evs:
            if e["tipo"] == "sfx":
                self.sfx.append((e["sonido"], linea.t(e["en"]), e.get("nivel", 0.8)))
        self.karaoke = Karaoke(L, linea, self.layout_en, self.cortes_visuales, self.sb.get("subtitulos", {}))

    def _planos(self, evs):
        """Planos de cámara (T y S) y jump cuts de ritmo en los bordes de frase de los que pasan de 3,3 s."""
        linea = self.linea
        reales = set(c for c in linea.cortes if c < self.fin)
        forzados = [linea.t(e["en"]) for e in evs if e["tipo"] == "corte_ritmo"]
        lim = unicos(list(reales) + list(self.cambios) + forzados)
        bordes = [0.0] + [c for c in lim if 0.05 < c < self.fin - 0.05] + [self.fin]
        ritmo = list(forzados)
        w = linea.words
        for a, b in zip(bordes, bordes[1:]):
            lay = self.layout_en((a + b) / 2)
            if lay == "G" or b - a <= PLANO_MAX:
                continue
            cands = []
            for i in range(len(w) - 1):
                c = math.floor(w[i + 1]["start"] * FPS) / FPS        # el cuadro donde arranca la frase nueva
                if not (a + PLANO_MIN <= c <= b - PLANO_MIN):
                    continue
                pal = w[i]["word"]
                bono = 1.0 if pal[-1:] in ".?!" else 0.8 if pal[-1:] in ",;:" else 0.0
                bono += min(0.25, max(0.0, w[i + 1]["start"] - w[i]["end"])) * 4
                if w[i + 1]["word"].lower().strip("¿¡") in ("y", "pero", "a", "con", "en", "un", "la", "el"):
                    bono += 0.3                                       # frase que arranca con un nexo
                cands.append((c, bono))
            x = a
            while b - x > PLANO_MAX:
                ok = [(c, s) for c, s in cands if x + PLANO_MIN <= c <= x + PLANO_MAX and b - c >= PLANO_MIN]
                if not ok:
                    ok = [(c, s) for c, s in cands if c >= x + PLANO_MIN and b - c >= PLANO_MIN]
                if not ok:
                    break
                c, _ = max(ok, key=lambda cs: cs[1] - 0.6 * abs((cs[0] - x) - PLANO_IDEAL))
                ritmo.append(c)
                x = c
        self.cortes_ritmo = sorted(set(round(c, 4) for c in ritmo))

    def _bases(self):
        """Encuadre base de cada plano: el jump cut sin tiempo quitado alterna 1,00 ↔ 1,08 (T) o mueve el recorte
        (S); el que viene de un corte real o de un cambio de layout arranca en 1,00."""
        lim = unicos([c for c in self.linea.cortes if c < self.fin] + list(self.cambios) + list(self.cortes_ritmo))
        bordes = [0.0] + [c for c in lim if 0.05 < c < self.fin - 0.05] + [self.fin]
        self.planos = []
        prev_fin, prev_dy, prev_lay = 1.0, 0, None
        for a, b in zip(bordes, bordes[1:]):
            lay = self.layout_en((a + b) / 2)
            ritmo = any(abs(a - c) < 0.05 for c in self.cortes_ritmo) and not any(
                abs(a - c) < 0.05 for c in list(self.linea.cortes) + list(self.cambios))
            base, dy = 1.0, 0
            if lay == "T" and ritmo and prev_lay == "T":
                base = JUMP_ESCALA if prev_fin < 1.05 else 1.0
            if lay == "S" and ritmo and prev_lay == "S":
                dy = 0 if prev_dy else REENCUADRE_S
            ff = self._fr(a), max(self._fr(a) + 1, self._fr(b))
            pl = dict(t0=a, t1=b, lay=lay, base=base, dy=dy, ritmo=ritmo,
                      ax=float(np.median(self.caras["cx"][ff[0]:ff[1]])),
                      ay=float(np.median(self.caras["chin"][ff[0]:ff[1]])))
            self.planos.append(pl)
            z_fin = [z for z in self.zooms if z["t0"] < b - 1e-3 and z["t1"] >= b - 1e-3]
            prev_fin = max([max(z["s"], base + 0.05) for z in z_fin], default=base)
            prev_dy, prev_lay = dy, lay

    def plano_en(self, t):
        for p in self.planos:
            if p["t0"] <= t < p["t1"]:
                return p
        return self.planos[-1]

    def _zona_y(self, el, ev):
        zona = ev.get("zona", "auto")
        t0 = el.t0 if hasattr(el, "t0") and el.t0 else 0
        if zona == "auto":
            chin = self.chin_max(t0, getattr(el, "t1", t0 + 1))
            zona = "pecho" if chin < 0.5 * H else "arriba"
        if zona == "pecho":
            return int(0.51 * H)
        if isinstance(zona, (int, float)):
            return int(zona)
        return ZONA_ARRIBA_Y

    def layout_en(self, t):
        for e in self.laminas:
            if e.t0 <= t < e.t1:
                return "G"
        for e in self.pantallas:
            if e.t0 <= t < e.t1:
                return "S"
        return "T"

    def zoom_en(self, t):
        pl = self.plano_en(t) if getattr(self, "planos", None) else None
        base = pl["base"] if pl else 1.0
        for z in self.zooms:
            if z["t0"] <= t < z["t1"]:
                s = max(z["s"], base + 0.05)
                desde = z["salto"] if z["salto"] else base
                p = ease_out((t - z["t0"]) / ZOOM_RAMPA)
                return desde + (s - desde) * p, z["ax"], z["ay"]
        if pl and base > 1.0005:
            return base, pl["ax"], pl["ay"]
        return 1.0, W / 2, H / 2

    def apaga_subs(self, t):
        """Con una tarjeta de datos en pantalla el subtítulo se apaga con un fundido de 0,3 s."""
        a = 1.0
        for c in self.tarjetas:
            if not c.apaga:
                continue
            if c.t0 - APAGA_FUNDIDO <= t < c.t0:
                a = min(a, 1 - (t - (c.t0 - APAGA_FUNDIDO)) / APAGA_FUNDIDO)
            elif c.t0 <= t < c.t1:
                a = 0.0
            elif c.t1 <= t < c.t1 + APAGA_FUNDIDO:
                a = min(a, (t - c.t1) / APAGA_FUNDIDO)
        return max(0.0, a)

    # -- render de un cuadro --
    def componer(self, src_rgb: np.ndarray, t: float) -> Image.Image:
        import cv2
        lay = self.layout_en(t)
        if lay == "G":
            canvas = Image.new("RGBA", (W, H))
        elif lay == "S":
            canvas = Image.new("RGBA", (W, H), (0, 0, 0, 255))
            a, b = self._tramo_s(t)
            fa, fb = self._fr(a), max(self._fr(a) + 1, self._fr(b))
            top = float(np.median(self.caras["top"][fa:fb] - 0.28 * self.caras["h"][fa:fb]))
            dy = self.plano_en(t)["dy"]
            # la MISMA toma a escala 1,00, solo recortada (1080x1080): nada de escalar para llenar
            y0 = int(max(0, min(H - (H - COSTURA), top - 50 + dy)))
            abajo = src_rgb[y0:y0 + H - COSTURA]
            canvas.paste(Image.fromarray(abajo).convert("RGBA"), (0, COSTURA))
        else:
            s, ax, ay = self.zoom_en(t)
            if s > 1.0005:
                x0, y0 = ax * (1 - 1 / s), ay * (1 - 1 / s)
                M = np.float32([[s, 0, -x0 * s], [0, s, -y0 * s]])
                frame = cv2.warpAffine(src_rgb, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
            else:
                frame = src_rgb
            canvas = Image.fromarray(frame).convert("RGBA")
        ctx = {"card_y": lambda c, tt: c.y}
        for el in self.laminas + self.pantallas:
            if el.t0 <= t < el.t1:
                el.dibujar(canvas, t, ctx)
        if lay != "G":  # en S sólo llega el fundido fantasma que cruza el corte
            for el in self.tarjetas + self.sellos + self.ctas:
                if el.visible(t) and (lay == "T" or t >= el.t1):
                    el.dibujar(canvas, t, ctx)
        self.karaoke.dibujar(canvas, t, self.apaga_subs(t))
        return canvas.convert("RGB")

    def _tramo_s(self, t):
        for e in self.pantallas:
            if e.t0 <= t < e.t1:
                return e.t0, e.t1
        return t, t + 1

    # -- video --
    def render_video(self, salida_video: Path, solo=None):
        linea = self.linea
        n_out = int(math.floor(self.fin * FPS))
        if solo is not None:
            for t in solo:
                t = round(t * FPS) / FPS
                j = linea.src_frame(t)
                buf = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{j / linea.fps_src:.4f}", "-i", str(self.bruto),
                                      "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                     capture_output=True, check=True).stdout
                src = np.frombuffer(buf[: W * H * 3], np.uint8).reshape(H, W, 3)
                self.componer(src, t).save(Path(salida_video) / f"cuadro-{t:06.2f}.png")
            return
        dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(self.bruto), "-f", "rawvideo", "-pix_fmt", "rgb24",
                                "-"], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, bufsize=W * H * 3 * 2)
        enc = subprocess.Popen(
            ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
             "-i", "-", "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
             "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-maxrate", "9M", "-bufsize", "18M",
             "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
             "-movflags", "+faststart", str(salida_video)], stdin=subprocess.PIPE)
        j_leido, actual = -1, None
        for i in range(n_out):
            t = i / FPS
            j = linea.src_frame(t)
            if j < j_leido:   # el keep nuevo nunca vuelve atrás en el bruto; si pasara, se relee
                dec.kill()
                dec = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", f"{j / linea.fps_src:.4f}", "-i",
                                        str(self.bruto), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                       stdout=subprocess.PIPE, bufsize=W * H * 3 * 2)
                j_leido = j - 1
            while j_leido < j:
                buf = dec.stdout.read(W * H * 3)
                if len(buf) < W * H * 3:
                    break
                j_leido += 1
                actual = buf
            if actual is None:
                raise RuntimeError(f"no pude leer el cuadro {j} del bruto")
            src = np.frombuffer(actual, np.uint8).reshape(H, W, 3)
            enc.stdin.write(self.componer(src, t).tobytes())
            if i % 150 == 0:
                print(f"  cuadro {i}/{n_out}", flush=True)
        dec.stdout.close()
        dec.kill()
        enc.stdin.close()
        enc.wait()

    # -- audio --
    def render_audio(self, salida: Path):
        linea = self.linea
        full = decodificar(self.bruto, SR, 2)
        cruda = concat_cruzado(full, linea.keep, linea.total)
        cruda, self.huecos_rellenos = rellenar_room_tone(cruda, full)
        crudo_wav = self.trabajo / "voz-cruda.wav"
        escribir_wav_f32(crudo_wav, cruda)
        voz = self.trabajo / "voz.wav"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(crudo_wav), "-af",
             "highpass=f=80,acompressor=threshold=0.06:ratio=2.6:attack=5:release=120:makeup=2:knee=4",
             "-ac", "2", "-c:a", "pcm_f32le", str(voz)])
        x = decodificar(voz, SR, 2).astype(np.float64)
        nfin = int(self.fin * SR)
        x = x[:nfin]
        pico_voz = np.percentile(np.abs(x), 99.9)
        for nombre, t, k in self.sfx:
            s = {"brillo": sfx_brillo, "golpe": sfx_golpe}[nombre]()
            i0 = int(t * SR)
            i1 = min(nfin, i0 + len(s))
            if i1 > i0:
                x[i0:i1] += s[: i1 - i0] * k * pico_voz
        mezcla = self.trabajo / "mezcla.wav"
        escribir_wav_f32(mezcla, x)
        I, LRA, TP = medir(mezcla)
        gan = -14.0 - I
        for _ in range(3):
            run(["ffmpeg", "-v", "error", "-y", "-i", str(mezcla), "-af",
                 # limitador sobremuestreado a 192 kHz: el brillo de 9-16 kHz genera picos entre muestras que un
                 # limitador a 48 kHz no ve (medido: -3 dBFS de muestra daban -1,2 dBTP)
                 f"volume={gan:.2f}dB,aresample=192000,alimiter=limit=0.76:attack=1:release=60:level=disabled,"
                 f"aresample={SR}", "-c:a", "pcm_f32le", str(salida)])
            I2, LRA2, TP2 = medir(salida)
            if abs(I2 + 14) <= 0.1:
                break
            gan += -14.0 - I2
        print(f"  audio: I={I2:.1f} LUFS  LRA={LRA2:.1f} LU  pico={TP2:.1f} dBTP  fin={self.fin:.2f}s  "
              f"huecos rellenos con room tone: {len(self.huecos_rellenos)} "
              f"({sum(d for _, d in self.huecos_rellenos):.2f} s)")
        self.audio_medido = (I2, LRA2, TP2)

    def medir_pausas(self, audio: Path):
        """Nivel mínimo (ventanas de 50 ms) dentro de cada pausa de 0,2 s o más: no puede caer debajo de -40 dBFS."""
        x = decodificar(audio, SR, 1)
        peor = 0.0
        for a, b in self.corridas_nuevas:
            if b - a < 0.2 or b > self.fin:
                continue
            seg = x[int(a * SR):int(b * SR)]
            n = len(seg) // 2400
            if n == 0:
                continue
            r = np.sqrt(np.mean(seg[:n * 2400].reshape(n, 2400) ** 2, axis=1) + 1e-20)
            peor = min(peor, float(20 * np.log10(r.min())))
        return peor

    def hojas(self, video: Path, carpeta: Path):
        carpeta.mkdir(parents=True, exist_ok=True)
        for v in carpeta.glob("sheet-*.jpg"):
            v.unlink()
        fuente = subprocess.run(["fc-match", "-f", "%{file}", "DejaVu Sans Mono:bold"], capture_output=True,
                                text=True).stdout
        run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-vf",
             f"fps=2,scale=216:-2,drawtext=fontfile={fuente}:text='%{{pts\\:hms}}':x=4:y=4:fontsize=13:"
             f"fontcolor=yellow:box=1:boxcolor=black@0.6,tile=5x4:padding=2", str(carpeta / "sheet-%02d.jpg")])

    def informe(self):
        """Reporte de QA en texto: duración, cortes, planos, anclas, subtítulos y avisos de geometría."""
        linea = self.linea
        print(f"tiempo de palabras: {self.tiempo_fuente} · umbrales {self.umbrales}")
        print(f"recorte: quita {sum(b - a for a, b in self.recorte.q):.2f} s en {len(self.recorte.q)} tramos "
              f"(tabla en {self.trabajo / 'tabla-cortes.md'})")
        vis = self.cortes_vistos
        print(f"duración: {self.fin:.2f} s · cortes que se ven: {len(vis)} ({len(vis) / self.fin * 10:.1f} cada 10 s; "
              f"{len(self.cortes_ritmo)} jump cuts de ritmo; meta 4-4,5)")
        largos = [p for p in self.planos if p["lay"] != "G" and p["t1"] - p["t0"] > PLANO_MAX + 1e-3]
        mx = max((p["t1"] - p["t0"] for p in self.planos if p["lay"] != "G"), default=0)
        print(f"  plano de cámara más largo: {mx:.2f} s; de más de {PLANO_MAX} s: "
              f"{[(round(p['t0'], 2), round(p['t1'], 2)) for p in largos] or 'ninguno'}")
        cortos = [(round(p["t0"], 2), round(p["t1"] - p["t0"], 2)) for p in self.planos
                  if p["lay"] != "G" and p["t1"] - p["t0"] < 0.8]
        print(f"  planos-flash de cámara (< 0,8 s): {cortos or 'ninguno'}")
        for k in range(0, int(math.ceil(self.fin / 10))):
            n = len([c for c in vis if k * 10 <= c < (k + 1) * 10])
            print(f"    {k * 10:>2}-{(k + 1) * 10:>2} s: {n} cortes")
        gaps = [(self.linea.words[i + 1]["start"] - self.linea.words[i]["end"], self.linea.words[i]["word"])
                for i in range(len(self.linea.words) - 1)]
        sil = max((b - a for a, b in self.corridas_nuevas if b <= self.fin), default=0)
        print(f"  silencio real más largo (RMS): {sil:.2f} s · hueco más largo entre palabras: "
              f"{max(gaps)[0]:.2f} s después de «{max(gaps)[1]}»")
        for c in self.tarjetas:
            frente = self.frente_min_pantalla(c.t0, c.t1)
            aviso = "  ⚠ TAPA LA FRENTE" if c.y + c.h > frente and c.y < H / 2 else ""
            dur = c.t1 - c.t0
            print(f"  tarjeta «{c.ev.get('rotulo')} / {c.ev.get('rotulo_der')}» {c.t0:.2f}-{c.t1:.2f}s ({dur:.1f} s"
                  f"{' ⚠ >7,5' if dur > 7.5 else ''}) y={c.y}-{c.y + c.h} (frente desde y={frente:.0f}){aviso}")
        arriba = min(self.karaoke.caja_glifos(b)[0] for b in self.karaoke.bloques if b["layout"] == "T")
        abajo = max(self.karaoke.caja_glifos(b)[1] for b in self.karaoke.bloques if b["layout"] == "T")
        print(f"  subtítulos T: glifos entre y {arriba:.0f} y {abajo:.0f} ({abajo / H * 100:.1f} %, tope 80 %)")
        print("  anclas (palabra → inicio real · Whisper · pieza):")
        vistos = set()
        for frase, w, t_out in linea.registro:
            k = (frase, round(w["start"], 3), round(t_out, 3))
            if k in vistos:
                continue
            vistos.add(k)
            print(f"    «{frase}»: {w['start']:.2f} ({w.get('fuente', '?')}) · whisper {w.get('start_w', w['start']):.2f}"
                  f" · entra {t_out:.2f} ({t_out - w['start']:+.3f})")
        sin_cubrir = []
        visuales = set()
        for e in self.laminas + self.pantallas:
            visuales |= {round(e.t0, 3), round(e.t1, 3)}
        for c in self.tarjetas + self.ctas:
            visuales.add(round(c.t0, 3))
        for b in self.karaoke.bloques:
            visuales.add(round(b["ini"], 3))
        for z in self.zooms:
            visuales.add(round(z["t0"], 3))
        for c in linea.cortes_base:
            if c < self.fin and not any(abs(c - v) < 0.5 / FPS for v in visuales):
                sin_cubrir.append(round(c, 2))
        print(f"  cortes del cutplan aprobado sin cambio de apoyo en ese cuadro: {sin_cubrir or 'ninguno'}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--bruto", required=True)
    ap.add_argument("--cutplan", required=True)
    ap.add_argument("--transcript", required=True)
    ap.add_argument("--storyboard", required=True)
    ap.add_argument("--salida", required=True)
    ap.add_argument("--trabajo")
    ap.add_argument("--hojas", help="carpeta para las hojas de control (2 fps, 5x4)")
    ap.add_argument("--cuadros", help="solo estos segundos a PNG (ej. 1.5,12,40), para mirar antes del render")
    ap.add_argument("--sin-recorte-cola", action="store_true", help="no recortar el silencio final")
    ap.add_argument("--sin-apretar", action="store_true", help="no apretar huecos (usa el cutplan tal cual)")
    ap.add_argument("--sin-vosk", action="store_true", help="no re-alinear palabras con Vosk")
    args = ap.parse_args()
    ed = Editor(args)
    if args.cuadros:
        out = ed.trabajo / "cuadros"
        out.mkdir(exist_ok=True)
        ed.render_video(out, solo=[float(x) for x in args.cuadros.split(",")])
        ed.informe()
        print(out)
        return
    audio = ed.trabajo / "audio-final.wav"
    ed.render_audio(audio)
    print(f"  pausas: el nivel más bajo dentro de una pausa de ≥0,2 s es {ed.medir_pausas(audio):.1f} dBFS "
          f"(piso -40)")
    video = ed.trabajo / "video.mp4"
    ed.informe()
    ed.render_video(video)
    run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", str(audio), "-map", "0:v", "-map", "1:a",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-t", f"{ed.fin:.3f}",
         "-movflags", "+faststart", args.salida])
    I, LRA, TP = medir(Path(args.salida))
    print(f"listo: {args.salida}  I={I:.1f} LUFS  LRA={LRA:.1f}  pico={TP:.1f} dBTP")
    if args.hojas:
        ed.hojas(Path(args.salida), Path(args.hojas))
        print(f"hojas: {args.hojas}")


if __name__ == "__main__":
    main()
