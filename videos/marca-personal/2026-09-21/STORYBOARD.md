---
mode: autonomous
status: composition-ready
message: "Un lead no se pierde cuando el flujo recibe, valida, registra y avisa."
audience: "Dueños y operadores de negocios que están empezando a automatizar"
aspect: 1080x1920
duration: "40.0s"
---

# Storyboard final · 01-feed-3-nodos

## 0.0–3.8 s · Gancho a cámara

- Sergio ocupa el formato vertical original, sin franjas ni fondo duplicado.
- Título: `Tu primera automatización`.
- Chip: `4 pasos antes de conectar 20 apps`.
- Transición: salida vertical corta hacia la primera pantalla.

## 3.8–11.9 s · ENTRADA

- Mockup editorial a pantalla completa; no imita la interfaz real de n8n.
- Mapa del flujo con Webhook activo y campos `name`, `phone`, `service`, `source`.
- Sergio se conserva en PiP vertical 9:16, sin barras laterales.

## 11.9–19.1 s · VALIDACIÓN

- Dos condiciones legibles: `phone is not empty` y `service is not empty`.
- Se muestran explícitamente las salidas `TRUE` y `FALSE`.
- Transición por wipe y stagger de condiciones.

## 19.1–27.4 s · REGISTRO + AVISO

- Rama true: `Google Sheets / Append Row → Telegram / Send Message`.
- Rama false: pedir `phone` o `service` y no guardar incompletos.
- Dos paneles paralelos para que ambas rutas se entiendan sin audio.

## 27.4–35.9 s · SISTEMA MÍNIMO

- Cierre visual en cuatro tarjetas: `ENTRADA`, `VALIDACIÓN`, `REGISTRO`, `AVISO`.
- Mensaje: `SIN AI AGENT · TODAVÍA`.
- Sergio continúa en PiP para sostener presencia personal.

## 35.9–40.0 s · CTA a cámara

- Regreso animado al plano vertical completo.
- CTA: `Comentá una tarea repetitiva`.
- Hold final limpio; sin música y sin endcard genérico.

## Subtítulos

- Identidad `anchor`: rail frontal, máximo dos líneas, una familia tipográfica.
- Zona vertical segura: y≈1368 px, fuera del 22 % inferior reservado a UI.
- Acento verde solo en palabras clave; sin subtítulo sobre la boca.
