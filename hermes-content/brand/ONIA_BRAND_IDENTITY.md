# ONIA — Brand Identity

> Fuente de verdad de marca. Colores/tipografía codificados en
> [`tokens.css`](tokens.css). Logo en [`onia-logomark.svg`](onia-logomark.svg) y
> [`onia-logo-horizontal.svg`](onia-logo-horizontal.svg). Al cambiar marca,
> editar `tokens.css` primero — el motor de carruseles lo lee.

ONIA = agencia boliviana de **diseño web + automatización con IA** (Santa Cruz).
Marca no vende "una web", vende **resultado**: captar, convertir, automatizar.
La identidad debe verse **intencional, confiada, técnica — nunca template Canva**.

---

## 1. Logo

Punto de partida: wordmark verde "OnIA" plano sobre off-white. Débil (default
font, sin sistema). Refinado al máximo:

- **Logomark** (`onia-logomark.svg`): un *loop de automatización* (la "O") que se
  abre en un **nodo IA** verde arriba-derecha. Vector puro, no depende de
  fuentes. Lee a 32px en grid de Instagram.
- **Wordmark** (`onia-logo-horizontal.svg`): `ON` en tinta + `IA` en verde —
  resalta *Inteligencia Artificial* como núcleo. Display geométrica, tracking
  ajustado (-4).
- **Construcción**: usar siempre con aire = altura de la "O" alrededor. Nunca
  estirar, recolorear fuera de paleta, ni añadir sombras/degradados al mark.
- **Variantes**: full-color sobre claro · todo-tinta · todo-blanco (sobre verde
  o ink). El nodo verde se mantiene en versión color.

---

## 2. Paleta

| Token | Hex | Uso |
|-------|-----|-----|
| ONIA Green | `#10C26B` | Primario. Hooks, CTA, nodo, acento. Color de marca. |
| Green Deep | `#0B8F4F` | Degradados, estado pressed. |
| Green Soft | `#D6F5E5` | Tints, subrayados/realces sobre claro. |
| Ink | `#0A0F0D` | Texto principal, fondos oscuros (verde-negro cálido). |
| Ink 2 | `#1C2622` | Superficie oscura secundaria, tarjetas. |
| Surface | `#F4F5F2` | Off-white base. |
| White | `#FFFFFF` | Texto sobre oscuro, superficies limpias. |
| Muted | `#6B756F` / `#9FB0A8` | Texto secundario (claro / oscuro). |

**Regla 60-30-10**: dominante (ink o surface) 60 · secundario 30 · verde 10.
El verde es acento de alto contraste, no relleno. Portadas pueden invertir a
verde-dominante para *pattern interrupt*.

---

## 3. Tipografía

Máximo **2 familias** (regla de carrusel):

- **Display — Space Grotesk** (700/500): titulares, hooks. Geométrica, técnica,
  con carácter. Fallback `Archivo`/`Arial Black`.
- **Body — Inter** (600/400): cuerpos, captions, UI. Neutra, legible.

Tamaños carrusel (lienzo 1080px): hook ≥ 96px · titular slide 64–80px ·
cuerpo 36–44px · pie/numeración 24–28px. Interlineado 1.15 display, 1.45 body.

---

## 4. Estética

Dirección: **B2B técnico-editorial, alto contraste, mínimo pero con peso.**
No dark-mode por defecto: alterna superficies claras y verde-ink intencional.

Demuestra ≥4 de:
1. Jerarquía por contraste de escala (hook gigante vs cuerpo).
2. Ritmo intencional de espacio — no padding uniforme.
3. Acento verde semántico (lo que importa / la acción), no decorativo.
4. Numeración de slides `01 / 07` y barra "Guardá esto" repetida.
5. Cue de continuación al borde derecho (peek/flecha) para ganar el swipe.
6. Una idea por slide, mucho aire.
7. Logomark discreto como firma, no marca de agua ruidosa.
8. Composición editorial: titular dominante, no grid de tarjetas iguales.

**Prohibido** (anti-template): grids de tarjetas uniformes, gradient blob +
headline centrado genérico, 3+ fuentes, claims de IA exagerados, métricas
falsas, screenshots robados.

---

## 5. Voz

Claro, consultivo, directo, útil para negocios bolivianos. Sin hype. Habla de
*resultado* (más clientes, menos trabajo manual, autoridad), no de píxeles.
Español rioplatense-boliviano natural. Ver ángulos en el generador.
