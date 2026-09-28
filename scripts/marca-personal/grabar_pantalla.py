# -*- coding: utf-8 -*-
"""Screencasts sin mano humana — Playwright con video 1080p y cursor visible.

Por que existe: Samuel necesita material de pantalla para los videos (17-sep) y
Sergio Urcullo pidio grabarlo todo por script. Playwright no dibuja el puntero,
asi que se inyecta un cursor falso que sigue los movimientos — el patron estandar
de los screencasts de producto.

Uso como libreria:
    from grabar_pantalla import Grabador
    with Grabador("salida.mp4") as g:
        g.ir("https://ejemplo.com")
        g.click("text=Boton")
        g.scroll(600)
"""
import subprocess
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

CURSOR_JS = """
(() => {
  if (window.__cursor) return;
  const c = document.createElement('div');
  c.id = '__cursor_fake';
  c.style.cssText = `position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;
    pointer-events:none;border-radius:50%;background:rgba(20,20,20,.85);
    border:3px solid rgba(255,255,255,.95);box-shadow:0 2px 10px rgba(0,0,0,.4);
    transform:translate(-50%,-50%);transition:width .12s,height .12s`;
  document.body.appendChild(c);
  window.__cursor = c;
  document.addEventListener('mousemove', e => {
    c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px';
  }, true);
  document.addEventListener('mousedown', () => { c.style.width='20px'; c.style.height='20px'; }, true);
  document.addEventListener('mouseup', () => { c.style.width='26px'; c.style.height='26px'; }, true);
})();
"""


class Grabador:
    def __init__(self, salida, ancho=1920, alto=1080, perfil=None):
        """perfil: nombre de una sesion guardada por abrir_sesion.py (n8n, higgsfield...)."""
        self.salida = Path(salida)
        self.ancho, self.alto = ancho, alto
        self._x, self._y = ancho // 2, alto // 2
        self.perfil = perfil

    def __enter__(self):
        self._pw = sync_playwright().start()
        video = {
            "record_video_dir": str(self.salida.parent / "_crudo"),
            "record_video_size": {"width": self.ancho, "height": self.alto},
        }
        if self.perfil:
            ruta = Path(r"E:\ONIA-YouTube\grabaciones\_perfiles") / self.perfil
            self.browser = None
            self.ctx = self._pw.chromium.launch_persistent_context(
                str(ruta), headless=True,
                viewport={"width": self.ancho, "height": self.alto}, **video)
            self.page = self.ctx.pages[0] if self.ctx.pages else self.ctx.new_page()
        else:
            self.browser = self._pw.chromium.launch(headless=True)
            self.ctx = self.browser.new_context(
                viewport={"width": self.ancho, "height": self.alto}, **video)
            self.page = self.ctx.new_page()
        # el cursor se reinyecta en cada navegacion
        self.page.add_init_script(CURSOR_JS)
        return self

    def __exit__(self, *exc):
        video = self.page.video
        self.ctx.close()
        webm = video.path()
        if self.browser:
            self.browser.close()
        self._pw.stop()
        # webm -> mp4 (H.264, compatible con cualquier editor)
        self.salida.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(webm),
             "-c:v", "libx264", "-crf", "18", "-preset", "medium",
             "-pix_fmt", "yuv420p", "-r", "30", str(self.salida)],
            check=True,
        )
        Path(webm).unlink(missing_ok=True)
        return False

    # --- gestos suaves -------------------------------------------------
    def ir(self, url, espera=2.5):
        self.page.goto(url, wait_until="domcontentloaded")
        try:
            self.page.evaluate(CURSOR_JS)
        except Exception:
            pass
        time.sleep(espera)

    def mover(self, x, y, pasos=28):
        self.page.mouse.move(x, y, steps=pasos)
        self._x, self._y = x, y

    def click(self, selector, espera=1.8, pasos=30):
        el = self.page.locator(selector).first
        el.wait_for(state="visible", timeout=15000)
        caja = el.bounding_box()
        if caja:
            self.mover(caja["x"] + caja["width"] / 2, caja["y"] + caja["height"] / 2, pasos)
            time.sleep(0.35)
        el.click()
        try:
            self.page.evaluate(CURSOR_JS)
        except Exception:
            pass
        time.sleep(espera)

    def click_xy(self, x, y, espera=1.5):
        self.mover(x, y)
        time.sleep(0.3)
        self.page.mouse.click(x, y)
        try:
            self.page.evaluate(CURSOR_JS)
        except Exception:
            pass
        time.sleep(espera)

    def tipear(self, selector, texto, delay=55, espera=0.8):
        el = self.page.locator(selector).first
        caja = el.bounding_box()
        if caja:
            self.mover(caja["x"] + 30, caja["y"] + caja["height"] / 2)
        el.click()
        el.type(texto, delay=delay)
        time.sleep(espera)

    def scroll(self, px, tramos=14, espera=0.9):
        """Scroll suave por tramos, como una rueda humana lenta."""
        paso = px / tramos
        for _ in range(tramos):
            self.page.mouse.wheel(0, paso)
            time.sleep(0.07)
        time.sleep(espera)

    def pausa(self, seg):
        time.sleep(seg)
