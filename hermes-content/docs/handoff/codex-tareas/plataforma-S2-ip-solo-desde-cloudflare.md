---
id: plataforma-S2
carril: plataforma
estado: pendiente
modelo: gpt-6-astra
repo: onia-platform
rama: codex/s2-ip-solo-desde-cloudflare
base: master
pr:
escrita: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
actualizada: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
nota: seguridad (Astra). HIGH de Hermes E5 sobre #140, que vale para toda la plataforma; medido en el VPS el 11-oct
---
# S2 · La IP del cliente sale de `cf-connecting-ip` solo cuando el pedido viene de Cloudflare

Sos Codex. Trabajás SOLO en un clon de `onia-platform`, en la rama `codex/s2-ip-solo-desde-cloudflare`, creada desde
`origin/master`; anotá el SHA base en el resumen.
- Primero `git branch --show-current`: tiene que decir esa rama. Si `git status` trae cambios, seguí desde ahí.
- Sin red, sin npm install y sin producción. Nadie contesta preguntas: decidí con este documento y el código.

## META
`lib/http/client-ip.ts` le cree a `cf-connecting-ip` siempre. Si no viene, usa el PRIMER valor de `x-forwarded-for`.
Los dos los escribe el cliente cuando el pedido no pasa por Cloudflare, y el origen se puede alcanzar sin pasar por
Cloudflare. Medido por Plataforma el 11-oct en el VPS:
- `ufw` permite 80 y 443 desde cualquier origen. Traefik publica en modo `host`, así que ve la IP real del par TCP.
- Traefik corre con `TRAEFIK_ENTRYPOINTS_HTTPS_FORWARDEDHEADERS_INSECURE=true`: no borra los `X-Forwarded-*` ni el
  `X-Real-Ip` que manda el cliente.
- Pasa la cabecera tal cual y AGREGA al final de `x-forwarded-for` la IP del par que se le conectó. Así se comporta el
  proxy de Go en modo Director, el que usa Traefik; Plataforma lo confirma con el release antes de publicar. Entre
  Traefik y la app no hay otro proxy.

El resultado: cualquiera que le pegue al VPS directo elige su IP en cada pedido. Los topes por IP (`claveDeIp`: alta,
reserva, chat público y demás) no frenan nada, y la auditoría guarda una IP inventada.

El arreglo: el par real es el ÚLTIMO valor de `x-forwarded-for`.
- Si es de Cloudflare, se le cree a `cf-connecting-ip`, y a `cf-connecting-ipv6` con la regla de Pseudo IPv4 que ya existe.
- Si no es de Cloudflare, la IP del cliente es ese par, y se ignoran `cf-connecting-ip` y el resto de `x-forwarded-for`.

## Rangos de Cloudflare (bajados de cloudflare.com/ips-v4 y /ips-v6 el 11-oct-2026)
IPv4: 173.245.48.0/20 · 103.21.244.0/22 · 103.22.200.0/22 · 103.31.4.0/22 · 141.101.64.0/18 · 108.162.192.0/18 ·
190.93.240.0/20 · 188.114.96.0/20 · 197.234.240.0/22 · 198.41.128.0/17 · 162.158.0.0/15 · 104.16.0.0/13 ·
104.24.0.0/14 · 172.64.0.0/13 · 131.0.72.0/22
IPv6: 2400:cb00::/32 · 2606:4700::/32 · 2803:f800::/32 · 2405:b500::/32 · 2405:8100::/32 · 2a06:98c0::/29 · 2c0f:f248::/32

Van en una constante con la fecha y la URL de origen en un comentario. Se comprueban con `net.BlockList`
(`addSubnet` y `check`) de Node: nada de dependencias nuevas. Una IPv4 escrita como IPv6 mapeada (`::ffff:a.b.c.d`)
se normaliza antes de comprobarla.

## PRUEBA DE HECHO
1. Tests nuevos en `lib/http/client-ip.test.ts` (o el archivo de tests que ya tenga). Primero en rojo con el código de
   hoy, y anotá en el resumen cuáles fallaron:
   - el par es de Cloudflare (`x-forwarded-for: 1.2.3.4, 104.16.0.10`) y `cf-connecting-ip: 1.2.3.4` → `clientIp` da
     `1.2.3.4`;
   - el par NO es de Cloudflare (`x-forwarded-for: 9.9.9.9, 203.0.113.7`) y `cf-connecting-ip: 1.1.1.1` → da
     `203.0.113.7`, y `claveDeIp` también;
   - sin `cf-connecting-ip`, con `x-forwarded-for: 6.6.6.6, 203.0.113.7` → da el par `203.0.113.7`, no el primero;
   - la Pseudo IPv4 (Clase E en `cf-connecting-ip` más `cf-connecting-ipv6`) solo vale si el par es de Cloudflare;
   - sin `x-forwarded-for` ni nada → `"unknown"`, como hoy;
   - un par de Cloudflare IPv6 (`2606:4700::1`) y un par `::ffff:104.16.0.10` cuentan como Cloudflare.
2. Los tests de quien llama a `clientIp` y `claveDeIp`, y los de los límites (`rate-limit`, `chat-publico`, alta), siguen
   en verde. Si alguno armaba los pedidos solo con `cf-connecting-ip`, se le agrega un `x-forwarded-for` con un par de
   Cloudflare. Ningún test se borra ni se saltea.
3. `npx tsc --noEmit` 0, eslint de lo tocado 0 errores y `npx vitest run` completo en verde.

## REGLA DE PARADA
- Solo `lib/http/client-ip.ts`, sus tests y los tests de quien lo llama, si hace falta. No cambies las firmas de
  `clientIp` ni de `claveDeIp`, ni quién las llama.
- No toques la infraestructura, Traefik ni `app.env`. Cerrar el origen a Cloudflare es otra decisión: la toma Sergio
  Urcullo con la madre.
- Si un llamador necesita a propósito el primer valor de `x-forwarded-for` (por ejemplo, un webhook interno entre
  contenedores), pará y anotalo con la ruta y la línea. No lo «arregles».
- Si después de dos intentos `tsc` o la suite siguen en rojo por algo fuera de esta lista, pará y anotalo.

## Entrega
Un commit conventional en castellano, que explique el porqué. Resumen final con:
- el SHA base y el del commit;
- los tests que se pusieron rojos con el código viejo;
- los números de `tsc`, eslint y vitest;
- cada llamador revisado.

Draft PR contra `master`.

**Antes de publicar (Plataforma):** con el release nuevo, un pedido normal por Cloudflare tiene que seguir dando IPs
distintas por visitante. Si todos los visitantes caen en el mismo balde, es que el último salto no era Cloudflare: se
revierte y se mide de nuevo.
