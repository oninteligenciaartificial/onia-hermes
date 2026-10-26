Service Worker runbook 

Objetivo: servir un "fast shell" HTML cacheado para mejorar la percepci\u00f3n de carga (FCP) y permitir una versi\u00f3n ligera instant\u00e1nea.

Archivos creados (local):
- /out/designs/sw.js  (service worker minimal)
- /out/designs/offline.html  (archivo de shell; opcional, crear con layout minimal)

Pasos recomendados para integrar:
1) Añadir `offline.html` y `styles/critical.css` con el HTML shell del layout que quieres que pinte instant\u00e1neamente.
2) Incluir en el layout principal (Next.js / app shell) el registro del service worker (cliente):

```js
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('/designs/sw.js').then(()=>console.log('SW registered'))
  })
}
```

3) Deploy: subir `sw.js` y `offline.html` a la carpeta p\u00fablica del servidor (por ejemplo `/var/www/onia-landing/public/designs/`), o integrarlo en el build de Next/Node.
4) Pruebas locales:
- Abrir la web en modo https/localhost
- En DevTools > Application > Service Workers confirmar registro
- Simular offline y cargar la p\u00e1gina: debe responder con el shell cacheado.

Caveats:
- El SW controla cache y navegación; probar antes de ponerlo en producci\u00f3n.
- Control de version: modificar `CACHE_NAME` cuando actualices shell.

Siguiente paso propuesto:
- Creo `offline.html` minimal (60-120KB), lo subo y pruebo registro en staging. Me decis si avanzo.
