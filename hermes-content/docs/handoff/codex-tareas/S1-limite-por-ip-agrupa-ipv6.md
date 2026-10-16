# S1 · Los límites por IP agrupan IPv6 por /64 y salen de una sola función (toda la plataforma)

> **Estado 9-oct:** hecho en onia-platform#141 (`c38938ba`). La revisión de Plataforma encontró un bloqueante que venía de ESTA tarea: decía «si llega `cf-connecting-ipv6`, el /64 sale de esa», y creerle siempre deja que el cliente elija su clave. Arreglado en S1b (`4c1ad334`, bundle `docs/cola/ramas-locales/plataforma-s1b-20261009.bundle`). La regla buena está abajo.

Sos Codex. SOLO `onia-platform`, rama nueva `codex/s1-ip-ipv6` desde `master`. `git branch --show-current` primero y
anotá el SHA base.

## META
Revisión de Plataforma (9-oct, al revisar W1d en onia-platform#140): `app.onia.com.bo` también se publica por IPv6
(medido: AAAA de Cloudflare `2606:4700:…`) y `lib/http/client-ip.ts` devuelve la dirección IPv6 entera. Quien tenga un
/64 (cualquier VPS lo trae) cambia de dirección en cada pedido y ningún límite por IP lo frena: altas, pedidos de
acceso, bloqueo del login (`email|ip`), reserva pública, portal y widget. **Eso sigue así aunque el origen se cierre a
Cloudflare.** Además, dos lugares no usan esa función:
- `app/api/auth/register/route.ts:144` lee `x-forwarded-for` a mano. Según cómo la deje Traefik, es el borde de
  Cloudflare (todos los visitantes de ese borde en un mismo balde de 10 altas/min) o lo que mande el cliente (sin tope).
  Las dos opciones están mal.
- `lib/login-lockout.ts` tiene su propia copia (`ipDe`).

## Lo que se hace
1. En `lib/http/client-ip.ts`, una función para los límites (p. ej. `claveDeIp(req)`):
   - IPv4: igual que hoy.
   - IPv6: el prefijo /64 normalizado (expandir `::`, minúsculas, los 4 primeros grupos). Una IPv4 mapeada
     (`::ffff:1.2.3.4`) cuenta como IPv4.
   - `cf-connecting-ipv6` vale SOLO si `cf-connecting-ip` es una Clase E (240.0.0.0/4), que es lo que pone el Pseudo
     IPv4 «Overwrite» de Cloudflare. Sin eso la ignora: Cloudflare no la agrega y no está documentado que borre la
     que manda el cliente (corregido 9-oct; antes decía «si llega, el /64 sale de esa»).
   - Un valor que no es IP (`net.isIP` da 0) se vuelve `"unknown"`. Hoy cualquier texto en la cabecera es una clave
     nueva.
   - `clientIp` queda como está para la auditoría: `lib/audit.ts` sigue guardando la dirección entera.
2. Todos los límites pasan a `claveDeIp`:
   - `lib/rate-limit.ts` (los 6 `keyGenerator`);
   - `app/api/access-requests/route.ts`;
   - `app/api/auth/register/route.ts`, que reemplaza la lectura a mano;
   - `app/api/auth/verificacion-whatsapp/{enviar,confirmar}`;
   - `app/api/n8n/callback/subscription-approve`;
   - `app/api/webhooks/bcp`;
   - `lib/login-lockout.ts` (`ipDe`).

   La ruta del widget (`app/api/chat-publico/[...ruta]/route.ts`) vive en #140. Si ya está en `master` cuando empieces,
   entra acá; si no, anotalo en el PR para que el segundo en mergear la pase a `claveDeIp`.
3. Grep de cierre: `grep -rn "x-forwarded-for\|cf-connecting-ip" app lib` sale solo en `lib/http/client-ip.ts` y en
   tests.

## PRUEBA DE HECHO
Tests que fallen sin el cambio:
- dos direcciones del mismo /64 dan la misma clave, y de distinto /64, distinta;
- la forma comprimida y la expandida de una dirección dan la misma clave;
- `::ffff:1.2.3.4` da la misma clave que `1.2.3.4`;
- basura en la cabecera da `unknown`;
- `cf-connecting-ipv6` gana sobre un pseudo IPv4 de `cf-connecting-ip`;
- el registro y el bloqueo del login usan la clave nueva.

Gates: `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` COMPLETO en verde, con números reales. Si en tu
entorno vitest no arranca (el 9-oct dio `spawn EPERM` al cargar `vitest.config.ts`), decilo: la suite la corre la
madre o Plataforma antes de mergear.

## REGLA DE PARADA
Sin infraestructura ni producción. No cambies los topes (los números) ni los textos. La auditoría sigue con la IP
entera.

## Entrega
Commits conventional en castellano con el porqué. PR draft contra `master` con el SHA base y los números reales.
