# P05 · Crear el Design System de Onia en claude.ai/design con DesignSync (sin Figma, sin gasto)

- **Destino:** `web-factory`
- **Sale de:** [la ficha](../2026-08-23-cosecha-claude-design-sistema-de-diseno-de-marca.md) · `DbZHuAuIDhh` · @vison.studios
- **Fuente:** https://www.instagram.com/p/DbZHuAuIDhh/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Nada bloqueante, y menos de lo que el post sugiere. No hay ningun .fig en el repo (find -iname '*.fig' = 0 resultados) y no hace falta: el formulario de Claude Design declara los insumos 'all optional' y acepta codigo local, repo de GitHub, o directamente fuentes/logos/assets por drag. Los tres insumos ya existen: hermes-content/brand/tokens.css (9 colores + 2 familias), onia-logo-horizontal.svg + onia-logomark.svg, y hermes-content/brand/fonts/. Sin gasto, sin credencial nueva, sin permiso. Unica decision pendiente (no bloqueante): si el sistema se genera con la marca actual o si primero se resuelve la pareja tipografica — hoy display y body son ambas sans, y el post demuestra que el contraste serif/sans es lo que da el aire.

---

```text
OBJETIVO UNICO DE LA SESION: dejar publicado el Design System de Onia en claude.ai/design, generado desde los archivos de marca que YA existen en el repo, para que toda pieza futura (landing, propuesta, carrusel, deck) herede la identidad sin re-describirla en cada prompt.

De donde sale esto: analisis del carrusel https://www.instagram.com/p/DbZHuAuIDhh/ (@vison.studios), ficha en hermes-content/references/video-intake/. El post ensena el flujo Figma -> .fig -> Claude Design. NO copies ese paso: el formulario de Claude Design declara sus insumos 'all optional' y acepta codigo local, repo de GitHub o simplemente fuentes/logos/assets. No tenemos ni necesitamos un .fig.

INSUMOS QUE YA EXISTEN (verificados, no los busques de nuevo):
- hermes-content/brand/tokens.css — 9 colores (--onia-green #10C26B, --onia-green-deep #0B8F4F, --onia-green-soft #D6F5E5, --onia-ink #0A0F0D, --onia-ink-2 #1C2622, --onia-surface #F4F5F2, --onia-white, --onia-muted #6B756F, --onia-muted-dark #9FB0A8) + 2 familias (--font-display Space Grotesk, --font-body Inter) + canvas 1080x1350 y radios.
- hermes-content/brand/onia-logo-horizontal.svg y onia-logomark.svg
- hermes-content/brand/fonts/
- hermes-content/brand/ONIA_BRAND_IDENTITY.md

PASOS

1. Lee hermes-content/brand/ONIA_BRAND_IDENTITY.md y tokens.css enteros antes de tocar nada. Carga la skill design-md.

2. DECISION A RESOLVER PRIMERO (y a preguntarle a Sergio si no es obvia desde ONIA_BRAND_IDENTITY.md): hoy --font-display y --font-body son AMBAS sans (Space Grotesk / Inter). El carrusel analizado demuestra que el contraste serif-display / sans-body es lo que da aire y jerarquia. Propone la pareja, mostrala renderizada en un HTML de una pantalla, y espera OK antes de hornearla en el sistema. Si Sergio prefiere quedarse con la pareja sans, se respeta y se sigue — no reabras el tema.

3. Construi el bundle local del sistema de diseno en web-factory/design-system/onia/ con, como minimo: escala tipografica (display/H1/H2/subtitulo/cuerpo/caption), los 9 colores con su rol semantico (no solo el hex: cuando se usa cada uno), escala de espaciado, radios, ambos logos con sus reglas de uso, estados de boton (default/hover/focus/active/disabled) y una tarjeta de superficie. Un archivo HTML de preview por componente, cada uno con el marcador de primera linea <!-- @dsCard group="..." --> para que la Design System pane arme el indice sola.

4. Publica con DesignSync, EN ESTE ORDEN OBLIGATORIO: list_projects -> (si no hay uno de tipo design system) create_project name="Onia Design System" -> get_project para VERIFICAR que type es PROJECT_TYPE_DESIGN_SYSTEM (ese tipo es inmutable al crearse; empujar a un proyecto normal nunca lo convierte en sistema de diseno) -> finalize_plan con localDir en web-factory/design-system/onia y los writes como globs -> write_files usando localPath (no data inline: asi los contenidos no entran al contexto).

5. VERIFICA MIRANDO, no suponiendo (regla del proyecto): abri el proyecto publicado y mira las tarjetas renderizadas. Un write_files con exito NO es verificacion. Si alguna tarjeta sale vacia, rota o sin estilos, arreglala antes de cerrar.

6. PRUEBA REAL DE QUE EL SISTEMA SIRVE: genera UNA pieza nueva heredando el sistema — una seccion de landing de Onia — y compara sus colores y tipografias contra tokens.css. Si no coinciden, el sistema esta mal armado, no la pieza.

PROHIBIDO
- No inventes colores, fuentes ni valores que no esten en tokens.css o ONIA_BRAND_IDENTITY.md. Si falta un valor, preguntá; no lo rellenes con criterio propio.
- No fabriques testimonios, logos de clientes ni cifras en ninguna pieza de ejemplo (cero clientes pagando).
- No escribas 'beta', 'muy pronto', 'en construccion' ni ningun estado de obra en material que pueda ver un cliente.
- No hardcodees hex fuera de tokens.css. tokens.css es la fuente unica.
- No toques archivos fuera de web-factory/design-system/onia/ y hermes-content/brand/ sin avisar.

AL CERRAR: escribi el handoff en .claude/handoff/<rama-con-guiones>.md con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md — y no te saltees 'intentos fallidos'.

LISTO = existe un proyecto de tipo PROJECT_TYPE_DESIGN_SYSTEM llamado "Onia Design System" en claude.ai/design, confirmado por DesignSync get_project; sus tarjetas se ven renderizadas correctamente al abrirlo (verificado MIRANDO, con captura, no con un codigo de respuesta); y una pieza nueva generada desde ese sistema usa colores y tipografias que coinciden exactamente con hermes-content/brand/tokens.css.
```
