# Reglas de UX aplicables a cada build — @agenticmatt (reglas 6-15)

Fuente: reel de Instagram (`/p/DcmoHfNJDWO/`, @agenticmatt), caption completo
bajado con yt-dlp (metadata pública, sin login). Son reglas de UX de producto/
móvil; varias aplican directo a las webs de cliente. Las reglas **1-5 están en
un post previo** — pendiente cosecharlas.

## Las 10 reglas (verbatim del caption) + cómo aplican a nuestros sitios

6. **Una X cierra un modal/flujo; una flecha izquierda va una pantalla atrás.**
   → No mezclar los dos íconos. En popups/diálogos usar X.
7. **Nunca pantalla en blanco mientras carga: skeleton, spinner o barra.**
   → Estados de carga en formularios y fetch. (Ya aplicado: LeadForm muestra
   "Enviando…"; para listas/datos, skeleton.)
8. **Preservar la posición exacta de scroll al volver a un feed.**
   → Catálogos/tiendas: restaurar scroll al volver de una ficha de producto.
9. **Tocar el tab activo del bottom-nav vuelve al tope de ese tab.**
   → Apps/paneles nivel 2 con bottom-nav.
10. **Cargar el próximo lote ANTES de llegar al fondo** (infinite scroll).
    → Catálogos largos: prefetch del siguiente lote.
11. **Likes/follows/saves se actualizan al instante y sincronizan de fondo**
    (optimistic update). → Cualquier acción con feedback: aplicar optimista +
    rollback si falla (ya es patrón de nuestro LeadForm/estado).
12. **Autosave de drafts y de input a medio llenar: volver atrás no borra.**
    → Formularios largos (pedido/cotización): guardar en localStorage y
    restaurar. APLICADO a dental-premium LeadForm.
13. **Pedir permisos (notif/fotos/cámara/ubicación) SOLO al usar la función**
    (just-in-time), no de entrada.
14. **Quick actions en bottom-sheet; swipe-down cierra.** → Móvil.
15. **Notificaciones y links compartidos abren el contenido EXACTO, no el home**
    (deep links). → Que cada `?src=`/link de campaña caiga en la sección/estado
    que promete.

## Aplicado ya (learning → build)

- **Regla 12 (autosave):** el LeadForm de `apps/dental-premium` guarda lo tipeado
  en localStorage y lo restaura si volvés — un pedido a medias no se pierde.
- **Regla 7 (loading):** el submit muestra "Enviando…" y bloquea el botón.
- **Regla 11 (optimista + rollback):** el form ya maneja estado enviando/ok/error.

## Pendiente

- Cosechar reglas 1-5 (post previo de @agenticmatt).
- Reglas 8/10 al template `store`; 6/14 al bloque de popup (backlog G4).
