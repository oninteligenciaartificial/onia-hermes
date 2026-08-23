# Handoff — carril `claude/ads-creatividades-publicos`

> Última actualización: 2026-08-22, cierre de la sesión de contenido y lanzamiento de Lucía.
> Formato: los 6 campos de `README.md` de esta carpeta.

## 1. Objetivo

Dejar a Lucía lista para publicar (reel de lanzamiento aprobable + sistema de contenido
documentado) y el sistema de marketing de las tres cuentas escrito como fuente de verdad.

## 2. Estado en que terminó

**EN PRODUCCIÓN (encendido y verificado ahí):**
- Workflow n8n `1jS4jwmNmvcQpqqH` v9 publicado: comentario→DM en 3 cuentas. La cuenta de
  Sergio quedó mapeada (entry_id `17841441395192146`) y suscrita al webhook de comentarios.
- Postiz: backend caído y **reparado** (pm2 lo reportaba "online" con 64 MB pero no escuchaba
  el 3000; el VPS se había reiniciado 6 h antes). `/api/user/self` responde 401 = sano.
- Cola de @oniahq: 2 publicados + 8 en cola hasta el 9-sep, corriendo sola.

**A MEDIAS, con el dónde exacto:**
- `final/lucia-lanzamiento.mp4` (reel v6, 22 s, master −14.33 LUFS) — **renderizado, sin OK
  de Sergio**. Nada se publica hasta ese OK.
- Soul `LUCIA-SINTETICA-v3` (`e6d8703c-…`) — **entrenando** cuando terminó la sesión. Falta
  validarlo contra el ancla antes de usarlo.
- Facebook en Postiz: **bloqueado, y no por credenciales**. Ver campo 4.
- Limpieza de versiones viejas de Lucía en Higgsfield: **no se puede por API** (el MCP solo
  lista y crea, no borra). Queda para hacer por la interfaz web; la lista de qué se borra y
  qué se queda está en `LUCIA.md §14`.

## 3. Archivos y cambios

- `hermes-content/references/modelos/lucia/LUCIA.md` — §12 arquitectura de prompt por bloques,
  §13 guion multi-escena, §14 inventario de Higgsfield.
- `hermes-content/references/modelos/lucia/PRODUCCION_MES_1.md` — las 8 piezas guionizadas.
- `hermes-content/docs/ONIA_SISTEMA_MARKETING_LUCIA_ONIA.md` — escalera + §10 moldes medidos.
- `hermes-content/docs/ONIA_ARQUITECTURA_CUENTAS_Y_MODELOS.md` — 1 modelo, 3 personas.
- `hermes-content/docs/ONIA_AUDITORIA_LUCIA_Y_PLAN_DIARIO.md` — la cuenta medida por API.
- `.claude/skills/editor-videos/scripts/karaoke-captions.mjs` — verde de marca, sin sombra,
  fuente 0.042.
- `.claude/skills/editor-videos/scripts/tts-elevenlabs.mjs` — sin `voice_settings` forzados.
- `hermes-content/references/marca-personal-sergio/` — foto de perfil, 3 fondos.
- `hermes-content/references/modelos/lucia/reel-lanzamiento-20260822/` — el reel completo.

## 4. Intentos fallidos

- **Voz de Lucía, dos veces rechazada.** Primero usé la voz element de Higgsfield, que Sergio
  había descartado el 25-jul (la memoria la titulaba como "la voz de Lucía" e invitaba al
  error). Después, con la Marcela correcta, seguía sonando mal: la causa eran los
  `voice_settings` que el script forzaba (stability .45 / style .35) — le cambian el timbre.
  **La voz aprobada sale con los defaults de la API.**
- **Narración en 4 llamadas separadas** → 4 prosodias distintas pegadas. Va en UNA sola.
- **Subtítulo activo con borde engrosado** (`\bord ×1.35`): el trazo negro se come el glifo a
  81 px y la palabra sale como un bloque negro. El énfasis va solo por color.
- **`toAssColor` con el hex como fallback**: devuelve el fallback SIN convertir → libass pinta
  la palabra de negro. El default va como VALOR del flag.
- **Sombra en el karaoke** (`Shadow 2`): con outline grueso se lee como un segundo subtítulo
  fantasma detrás. Va en 0.
- **Foto: convertir P3→sRGB** es correcto en teoría pero sube el rojo de 168 a 178 y empeora
  en visores sin gestión de color. Va: píxeles originales + perfil P3 original embebido.
- **Detección del logo por `r-g>45`**: agarró 34.318 px (toda la piel, que tiene matiz 26).
  El logo es rojo puro, matiz <12 → 587 px.
- **Máscara dura + erosión para el pelo**: destruye los mechones. Va alpha matting +
  decontaminación de color.
- **`sfx.mjs` con rutas estilo Git Bash** (`/c/...`): no las resuelve. Rutas `C:\`.
- **Speaches en el VPS** se colgó (el VPS venía de reiniciarse). Se instaló Whisper local;
  ya no dependemos del VPS para transcribir.
- **Facebook en Postiz** — el hallazgo que importa: las credenciales vacías eran solo el
  primer problema. La app "OnIA Social API" usa **"Inicio de sesión con Facebook para
  empresas"** (Login for Business), que trabaja con `config_id`; **Postiz manda el flujo
  clásico con `scope`**. Cargar el App Secret NO alcanza. Hay que agregar el caso de uso de
  Facebook clásico a la app, o crear una app aparte para Postiz.

## 5. Próximos pasos

1. OK de Sergio al reel → publicar el lanzamiento de Lucía (dispara el calendario 23-30 ago).
2. Validar el Soul `LUCIA-SINTETICA-v3` contra el ancla; si gana, pasa a ser la vía de
   primeros planos.
3. Facebook: decidir entre agregar caso de uso clásico o app nueva.
4. Limpiar versiones viejas de Lucía en Higgsfield por la interfaz web.
5. Palabra clave en 5 de los 8 posts en cola de @oniahq + horario 19:00 → 20:00 Bolivia.
6. PDF de la palabra HUMO; piezas L3-L8.

## 6. Qué depende de Sergio

- **OK al reel** — bloquea todo el calendario de Lucía.
- **Tarjeta en ONIA Ads** — bloqueo de amplificación desde hace días.
- **Link en la bio de Lucía** (hoy dice 👇 y no apunta a nada) y calentamiento de la cuenta
  (seguir 50-70 cuentas del nicho).
- **Facebook**: decidir el camino de la app. ⚠️ El App Secret **no se manda por chat**.
- Precio del curso (fase 3, sin apuro).
