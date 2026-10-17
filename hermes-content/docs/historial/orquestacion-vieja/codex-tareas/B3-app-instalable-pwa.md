# B3 · Onia instalable como app (PWA) que abre sin internet

Lanzada por la madre el 8-oct. Fuente: `hermes-content/docs/ONIA_BANDEJA_CHATBOT.md` (T3). Rama `codex/pwa-instalable`,
creada desde `origin/master`.

## META
Sergio Urcullo quiere usar Onia y el chatbot «desde todos lados» y poder «descargarla local». El manifiesto ya existe,
pero sin internet la app no abre. Primer escalón: una PWA instalable en el celular y en la PC.

## Lo que se hace
1. `public/sw.js`: precachear el «cascarón» de la app (HTML base, CSS, JS y los íconos) para que abra sin internet y
   muestre una pantalla «Sin conexión» de USTED, con un botón para reintentar. No cachear respuestas de la API con datos
   de clientes.
2. `public/manifest.json`: separar los íconos `any` de los `maskable`, y `start_url` a la pantalla principal del
   negocio. Evaluar un atajo (`shortcuts`) a `/inbox`.
3. Si hay push, que siga funcionando igual: no tocar las suscripciones.

## PRUEBA DE HECHO
- Tests que verifican:
  - el service worker registra el precache;
  - sin red, la navegación devuelve la pantalla de sin conexión;
  - nunca se cachean rutas de `/api/`.
- En el resumen, qué hace falta en producción. Por ejemplo, `NEXT_PUBLIC_VAPID_PUBLIC_KEY` en el build para los avisos:
  eso lo confirma Plataforma.

## REGLA DE PARADA
- Nada de Capacitor, tiendas ni dependencias nuevas: es el primer escalón.
- No cachees datos de clientes.
- Ninguna pantalla puede mostrar «beta», «próximamente» ni «muy pronto».
