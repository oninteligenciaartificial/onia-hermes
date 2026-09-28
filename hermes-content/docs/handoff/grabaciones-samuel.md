# Handoff — grabaciones de pantalla para Samuel

Actualizado 21-sep-2026, hora America/Caracas (el rodaje terminó después de las
00:00 UTC del 22-sep). Rama `codex/samuel-grabaciones-20260921`.

**Objetivo**

Completar las grabaciones para Samuel sobre Higgsfield, n8n y avatar IA. Hecho
significa proceso capturado, resultados comprobados y archivos reproducibles.
El objetivo completo no está cumplido: las generaciones están bloqueadas por
Cloudflare y no hay autorización para el mensaje de prueba.

**Qué quedó EN PRODUCCIÓN**

Nada. Se crearon únicamente borradores de demostración inactivos en n8n y
artefactos locales; no hubo despliegue, publicación ni entrega externa.

**Qué quedó a medias, y dónde**

Siete clips (5 min 59 s) de configuración y construcción grabados con Playwright,
Chrome persistente y cursor visible. MP4 H.264, 1440×900, 30 fps, sin voz. Son material de edición;
el tutorial completo de cada herramienta requiere las tomas finales indicadas.

| Clip | Contenido |
|---|---|
| `higgsfield-00-herramientas.mp4` | Inicio, menús de herramientas y personajes |
| `higgsfield-01-crear-soul.mp4` | Acceso a crear personaje y requisitos de fotos |
| `higgsfield-02-avatar-prompt-limpio.mp4` | Lucía sintética existente, Soul 2.0 y escritura del prompt; sin anuncio superpuesto |
| `n8n-01-mensaje-programado.mp4` | Horario diario a las 09:00 y configuración Telegram |
| `n8n-02-monitor-y-alerta.mp4` | Cada 5 minutos, HTTP, condición de fallo y aviso |
| `n8n-03-construccion-paso-a-paso.mp4` | Desde el lienzo vacío: crear Schedule, configurar 09:00, añadir Telegram y escribir mensaje (58,3 s) |
| `n8n-04-construccion-monitor.mp4` | Desde el lienzo vacío: horario de 5 minutos → HTTP → IF → aviso Telegram (136,3 s) |

Fuente de trabajo: `E:/ONIA-YouTube/grabaciones/samuel/`.
Entrega seleccionada: `E:/ONIA-YouTube/grabaciones/samuel/ENTREGA-20260921/`.
ZIP de los mismos archivos: `E:/ONIA-YouTube/grabaciones/samuel/grabaciones-samuel-20260921.zip`.
No compartir la carpeta de trabajo completa: también contiene credenciales demo
de la tanda anterior. La entrega contiene únicamente MP4 elegidos, índice y notas.

Alcance que todavía no está ejecutado:

- No se generaron imágenes nuevas, no se subieron referencias y no se entrenó un Soul nuevo.
- No se publicó ni activó ningún workflow. Los borradores nuevos son:
  `rDdlijedMLN22fhC` (recorrido mensaje), `dlWHWx34RWImpo1N` (recorrido monitor)
  y `XhA3Z2BE6X8LmFEy` / `ZPDOxyNmQHotEJ3j` (construcciones mensaje/monitor).
- Ningún mensaje enviado ni prueba de fallo real. `TU_CHAT_ID` sigue siendo un
  marcador; el HTTP del ejemplo apunta a `https://example.com`.
- Los recorridos 01/02 partieron de JSON importado. Las construcciones 03/04 se
  grabaron nodo por nodo con los controles nativos de n8n, desde borradores vacíos.
  Ambos quedaron persistidos e inactivos. n8n autoasignó una credencial Telegram
  existente, sin abrirla ni usarla; fue eliminada de los exports del repo.
- No se publicó ni se envió el material a Samuel.

**Qué depende de Sergio Urcullo**

Se pidió por error una aprobación para dos imágenes pequeñas. `CLAUDE.md` §5
ya la otorga: no volver a pedirla. Tras la indicación de Sergio Urcullo de leer
las reglas completas, se intentó la primera imagen con Playwright: el POST al
gateway `fnf-api-gw.higgsfield.ai` falló con `net::ERR_FAILED`, y el listado de
trabajos también presenta errores CORS. No hay resultado confirmado. La CLI
1.1.24 no tiene autenticación utilizable. Registro: `demos-samuel/lote-soul.json`.
No confundir sesión visible en la portada con acceso confirmado a generar.
La comprobación OPTIONS del endpoint devuelve HTTP 403, servidor Cloudflare,
sin encabezado Access-Control-Allow-Origin. No se desactivaron protecciones del
navegador ni se intentó eludir ese rechazo.
La página devuelve el título `Just a moment...`. Se intentó abrir esa verificación
en Chrome para intervención humana, pero la revisión automática rechazó el
comando: `blocked by policy`, sin otra razón. No se reintentó por otro mecanismo.

Sigue pendiente autorización para un único mensaje al Telegram de Sergio Urcullo:
«Prueba para el tutorial de Samuel: mensaje programado recibido».
No inferir autorización del silencio. Revalidar el destino antes de enviar.
Los horarios deben seguir desactivados. Antes de reenviar generaciones, revisar
trabajos recientes y transacciones para descartar un resultado no confirmado.

La subida/entrenamiento de un nuevo Soul requiere referencias aprobadas y costo
concreto; la aprobación anterior de dos imágenes no autoriza entrenamientos.

**Archivos y cambios**

Requiere Node, Playwright, Chrome y FFmpeg/ffprobe. El runtime instalado se resuelve
desde `C:/dev/proyectos/onia-hermes/package.json`; se puede especificar otro mediante
`SAMUEL_RUNTIME_PACKAGE`. Los perfiles permanecen fuera del repo, sin exportar cookies.
Cerrar las ventanas del perfil antes de grabar; no cerrar el Chrome personal general.

```powershell
node scripts/marca-personal/crear-demos-samuel.cjs
node scripts/marca-personal/grabar-higgsfield-samuel.cjs herramientas
node scripts/marca-personal/grabar-higgsfield-samuel.cjs recorrido
node scripts/marca-personal/grabar-higgsfield-samuel.cjs prompt nombre-nuevo
node scripts/marca-personal/grabar-n8n-samuel.cjs mensaje
node scripts/marca-personal/grabar-n8n-samuel.cjs monitor
node scripts/marca-personal/grabar-construccion-n8n.cjs mensaje
node scripts/marca-personal/grabar-construccion-n8n.cjs monitor
node scripts/marca-personal/empaquetar-grabaciones-samuel.cjs
```

El helper impide sobrescribir una toma terminada y conserva los crudos. Para
repetir una toma existente, ajustar su nombre de salida antes de grabar. La
construcción requiere un nuevo borrador vacío propio y actualizar su ID/nombre;
el script se detiene si el título difiere o ya hay nodos. No borra flujos.
El empaquetador exige los siete MP4 y los valida antes de modificar la entrega.
El mismo comando genera el ZIP desde una lista explícita y comprueba SHA256 de
cada archivo comprimido; solo entonces sustituye el ZIP anterior.
Los scripts n8n dependen de los IDs de borrador anteriores; los JSON de
`scripts/marca-personal/demos-samuel/` permiten importarlos en otro entorno,
pero entonces deben actualizarse los IDs. No tocar workflows productivos.
Los JSON 03/04 son exports de las construcciones nativas, sin referencias de
credencial, webhookId ni metadata de instancia. Los JSON 01/02 son las plantillas
de los recorridos; no se sustituyen entre sí.
En 04, `minutesInterval` no aparece porque cinco minutos es el valor predeterminado
del nodo; se comprobó el valor 5 tras recargar la UI. En 03 se comprobó 9am.

Principal: preparación, captura, empaquetado y revisión visual.
Subagente: antecedentes, helper, construcción nativa en n8n y QA independiente.
Validación: sintaxis Node, conexiones JSON, ffprobe, decodificación FFmpeg y
fotogramas de apertura/parámetros/cierre. Los tiempos y hashes finales están en
el manifiesto de entrega generado por `empaquetar-grabaciones-samuel.cjs`, también
guardado en `scripts/marca-personal/demos-samuel/entrega-manifest.json`.
Los siete videos cargaron sin error en la galería de Chrome; el ZIP se inspeccionó
y contiene exactamente los siete MP4, manifest, LEEME e índice. Pasaron los 18
tests existentes de `scripts/docs-hygiene.test.mjs`. Este carril contiene CommonJS
y documentos, sin proyecto TypeScript al que aplicar `tsc`.
Revisión de código independiente: se corrigieron la omisión silenciosa de clips
opcionales y la falta de regeneración del ZIP; segunda revisión sin hallazgos materiales.

**Intentos fallidos**

Selector duplicado/oculto del texto de subida, timeout de
escritura en el editor Soul y popup publicitario en la primera toma del prompt.
No se promovieron tomas fallidas. La toma de prompt con anuncio se conserva como
historial local y se excluye de la entrega. Se corrigió la referencia del reloj
de recorte; las aperturas ya generadas se inspeccionaron directamente.
También se omitió inicialmente la lectura de CLAUDE.md y se pidió permiso por
imágenes pequeñas que ya estaban autorizadas; Sergio Urcullo lo corrigió. Se leyó
el archivo completo y se aplicó onia-router. No repetir esa pregunta.
El primer reempaquetado automático falló porque `Get-FileHash` no estaba disponible
en Windows PowerShell del proceso Node. Se sustituyó por SHA256 de .NET y el
comando completo pasó; se conservó el ZIP previo durante el intento fallido.

**Próximos pasos**

1. Reanudar las imágenes cuando se resuelva el control de Cloudflare; verificar
   trabajos/transacciones antes para evitar duplicados. No eludir la verificación.
2. Solo con aprobación explícita, configurar el destino de prueba y enviar un
   mensaje al Telegram de Sergio Urcullo. No publicar horarios.
3. Completar la toma de entrenamiento de un Soul nuevo, actualmente bloqueada por
   referencias y costo específicos, sin presentarla como cubierta por reutilizar
   el personaje existente.
