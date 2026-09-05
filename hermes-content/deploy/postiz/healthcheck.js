// FUENTE ÚNICA del healthcheck del contenedor `postiz` del VPS.
//
// POR QUÉ EXISTE: el healthcheck que traía Postiz sólo pegaba a `http://localhost:5000/`
// —el frontend, servido por nginx— y aprobaba con cualquier código < 500. El backend NestJS
// escucha aparte, en :3000, y nginx le hace de proxy en `/api`. Cuando el backend no arranca
// (le falta Temporal, ver el comentario largo del override), nginx sigue vivo y contesta el
// frontend, así que el contenedor figuraba `Up (healthy)` con `/api` devolviendo 502.
// **La API estuvo muerta desde el 14-ago y nadie lo vio**: es un gate que falla ABIERTO, y
// encima el único camino por el que Onia publica (`scripts/postiz_schedule.mjs`) es `/api`.
//
// Peor de lo que parece: `/` contesta **307** (redirige al login), así que con el corte en
// «< 500» ni siquiera un 404 del frontend lo ponía en rojo.
//
// QUÉ MIDE AHORA: los DOS, por el mismo camino que usa un cliente real (nginx, :5000).
//   - `/`      → nginx y el frontend están vivos
//   - `/api/`  → el backend está vivo (con el backend caído, nginx devuelve 502 acá)
// Falla si CUALQUIERA da >= 500, no contesta, o no llega en 4 s.
//
// Este archivo es la fuente; el override lo lleva embebido en una línea (`node -e`) para no
// depender de un bind mount que se pueda borrar. `healthcheck.test.mjs` prueba el
// comportamiento contra servidores de mentira Y verifica que lo desplegado en /opt no se haya
// despegado de acá.
//
// ⚠️ Sólo comillas SIMPLES: el cuerpo va embebido dentro de un string de YAML entre comillas
// dobles. Una comilla doble acá rompe el docker-compose del VPS.

const h=require('http');const B=process.env.HC_BASE||'http://localhost:5000';const P=['/','/api/'];let n=P.length,bad=0;const fin=()=>{if(--n===0)process.exit(bad?1:0)};P.forEach(p=>{let s=0;const end=f=>{if(s++)return;if(f)bad=1;fin()};const r=h.get(B+p,res=>{res.resume();end(res.statusCode>=500)});r.on('error',()=>end(1));r.setTimeout(4000,()=>{r.destroy();end(1)})});
