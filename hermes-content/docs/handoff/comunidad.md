# Handoff — carril comunidad (taller del 31-oct y contenido diario)

Archivo único del carril. Actualizado 19-oct-2026, 22:45 La Paz, por Claude (Opus 5.5), sesión local «taller + contenido diario».
Fuente del taller: `hermes-content/docs/TALLER_31_OCT.md` (manda sobre todo lo demás).

**▶ 26-oct: se retoma por el plan de supervivencia** (`ONIA_ESTRATEGIA_DE_EMPRESA.md`, sección del 26-oct). La página
ya tiene el número (cierre jue 29, como estaba; el `noindex` sigue hasta su OK), pero a Sergio Urcullo no le gusta el resultado
(26-oct): no se publica hasta saber qué cambiar. Falta también el QR de Leslie Mercado Moreno. El calendario comprimido está en `TALLER_31_OCT.md` §4, y las ofertas 1 a 1 en `sales-kit/07-OFERTAS-1-A-1.md`.

**⏸ 20-oct: venta en pausa por decisión de Sergio Urcullo** (19-oct, 23:00): «la página queda para después; por ahora haremos investigación y aprendizaje y ordenaremos las sesiones». Los carruseles «aún no salen». Pidió aprender a vender valor y psicología de compra con Iman Gadzhi: hecho en `references/video-intake/2026-10-20-gadzhi-vender-valor-psicologia.md` (§3 = auditoría del taller con propuestas, nada cambiado) y regla en `onia-ventas-pauta` §10. Cada día sin vender resta uno de los 9 días de venta: si la apertura pasa del vie 23, revisar la fecha del taller antes de abrir.

## 1. Objetivo
Sergio Urcullo, 19-oct: «el más importante ahora es ese, tenemos que conseguir 3k». Decidido: **Bs 3.000 cobrados con el taller del sáb 31-oct** (50 cupos 50/60/70) y contenido diario de la marca personal.
Hecho cuando: venta abierta con su OK y contenido diario corriendo.

## 2. Qué quedó en producción
Nada publicado, cobrado ni enviado al 19-oct 22:45. La página y los carruseles están listos en el repo, sin publicar.

## 3. Qué quedó a medias y dónde
- Rama `claude/taller-31-oct-fuente-unica` (PR con enlace en el cierre de la sesión): fuente única, página v4 con los 2 bloques de Meet, briefs v4 con nota corregida, docs del taller traídos de `claude/marca-workshops-ns83wx` y `claude/project-thread-y6ts0m` (esas dos ramas quedan reemplazadas por esta).
- Renders para el OK: `E:/onia-render/taller/` (carruseles v4 con hoja de contactos, página a 390 y 1440). Fuera de git.
- **Compuerta (5 condiciones), estado en `TALLER_31_OCT.md` §3:** falta el número de WhatsApp personal, el OK a página y carruseles, y lo de Leslie Mercado Moreno (QR, titular, factura, texto de devolución).
- PRs de la orquesta todavía abiertos: #239 (5 creadores), #240 (3 guiones, faltan `[FECHA]`/`[PRECIO]`), #241 (lista de lo que faltaba; esta rama la resuelve), #247 (rivales dentales, otro carril).

## 4. Archivos
`docs/TALLER_31_OCT.md` · `docs/ONIA_LANZAMIENTO_PREPAGO.md` (razonamiento) · `docs/comunidad/COMUNIDAD_WHATSAPP_ESTRUCTURA.md` · `sitio-sergiourcullo/auditoria/index.html` · `carousels/briefs/marca-personal/sergio-taller-{1-cuenta,2-que-sale}-20261017.json` · `docs/historial/2026-10-16-workshops-auditoria-ia-descartada.md` · skill `diseno-contenido-onia` («Aprendido el 19-oct»).

## 5. Intentos fallidos
- La fuente del taller vivía en `/mnt/project-files/` del proyecto de la nube: se perdió para el repo y produjo 7 contradicciones. No se repite: toda fuente va a git.
- `curl` al perfil de Instagram vuelve vacío; el navegador del panel sí lee `og:description` (497 seguidores el 19-oct).
- Edge sin pantalla a 390 de ancho recorta la página (render más ancho). Se captura con un `<iframe>` de 390.
- El primer intento de corregir referencias con `perl -e 's#…#…#'` falló porque el patrón tenía `#`: usar `s{…}{…}`.

## 6. Qué depende de Sergio Urcullo
1. ~~Número de WhatsApp~~ dado el 19-oct: **+591 71654992** (va en los 3 botones de la página al retomarla).
2. OK o cambios a la página y a los 2 carruseles (capturas enviadas el 19-oct).
3. Pedirle a Leslie Mercado Moreno: QR, titular, cómo se factura y revisar el texto de devolución.
4. Grabar los 3 reels del taller (mar 20, ~1 h) y subir los brutos a Drive.
5. Cambiar la bio de Instagram a `sergiourcullo.vercel.app/auditoria` el mié 21; mandar los mensajes 1 a 1; publicar la pauta de Bs 300 (aprobada el 19-oct) con el brief.

## 7. Próximos pasos
1. Con el número: ponerlo en la página, sacar el `noindex`, publicar en Vercel (deploy por MCP, ver `sitio-sergiourcullo/README.md`) y mirarla viva a 390 y 1440.
2. **Issues de la orquesta NO cargados** (la venta se pausó antes): al retomar, abrir los de `TALLER_31_OCT.md` §6 (`orquesta` + `carril:marca`/`carril:comunidad`, «Hecho cuando» y `ok: sergio`). Al llegar las entregas, revisar y pasarle a Sergio Urcullo solo lo que ve el público, con captura.
3. Con los brutos de los reels: issue `carril:video` (PC) para editar con el molde de cada guion.
4. Chequeo 1 el vie 23: contar pagos en `sales-kit/SEGUIMIENTO-LEADS.md` y aplicar la tabla de `TALLER_31_OCT.md` §7.
