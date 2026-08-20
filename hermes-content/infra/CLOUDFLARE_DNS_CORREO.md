# DNS del correo — los 4 registros que van en CLOUDFLARE

> ⚠️ El DNS de `onia.com.bo` lo sirve **Cloudflare** (delegación del registro .bo),
> NO Vercel. Todo lo cargado en Vercel es invisible al mundo. Detalle:
> memoria `onia-dns-cloudflare-no-vercel`.

Estos 4 registros hacen que Gmail acepte el correo del servidor propio
(hoy rebota con 550 "sender unauthenticated"). Van en el panel de Cloudflare →
onia.com.bo → DNS → Records, o por API si hay token con permiso DNS.

## 1. A — el servidor de correo (SIN proxy)

| Campo | Valor |
|---|---|
| Type | `A` |
| Name | `mail` |
| IPv4 | `187.77.16.63` |
| Proxy | **DNS only (nube GRIS)** — imprescindible: proxiado, la IP que ve el mundo es la de Cloudflare y el SPF no cierra |

## 2. TXT — SPF (en la raíz `@`)

```
v=spf1 include:_spf.google.com ip4:187.77.16.63 ~all
```

- `include:_spf.google.com` → Google Workspace sigue pudiendo enviar (tu correo actual).
- `ip4:187.77.16.63` → autoriza al VPS **por IP**, no por nombre (con el comodín
  proxiado de Cloudflare, `a:mail...` autorizaría a Cloudflare).
- ⚠️ Si ya existe OTRO TXT que empiece con `v=spf1` en `@`, se **edita ese** — dos
  SPF en el mismo nombre = permerror, rechaza todo.

## 3. TXT — DKIM

| Campo | Valor |
|---|---|
| Type | `TXT` |
| Name | `mail._domainkey` |
| Value | el contenido de `/opt/onia-mail/dkim/onia.com.bo.txt` del VPS, en UNA línea sin comillas ni espacios: `v=DKIM1;h=sha256;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqm5tpnvBdIOaIIpZa4AbxowxMgaqD5ny7ASFUge8A3RdV/AI4HJLVZbK1sc9h4xhOXVFqW6ShR0b4rd3GC8sHODBiOaFF2lVqkEaz/eYVLEz9yWF66+0ITGEiEv5AN3U49gfPdIiCpgTCvHmTU8NC9/x5wzypC5uvkPZJCAJRlWwBsPcpy/BDVmg7Iqm/MCLyYPdkzxRllmxDag3prWIUxtmxGmBySDxrtDoGcpZqLYhCtlCnRqrCkwCeIMPZ4DAV+BRAyXmw6gtojqiUfMWs3+KwrWq5vYofC92pjFlh0Zi7qj+fzhsHcHe+8aw8RskPC4rumI5jUNH3lKE8Iz+vQIDAQAB` |

## 4. TXT — DMARC

| Campo | Valor |
|---|---|
| Type | `TXT` |
| Name | `_dmarc` |
| Value | `v=DMARC1; p=none; rua=mailto:business@onia.com.bo; fo=1` |

`p=none` = solo monitorea, no rechaza nada. Se endurece con reportes en mano.

## Verificación (después de cargar)

```bash
nslookup -type=TXT onia.com.bo 1.1.1.1          # debe mostrar el SPF
nslookup -type=TXT mail._domainkey.onia.com.bo 1.1.1.1   # debe mostrar v=DKIM1
nslookup mail.onia.com.bo 1.1.1.1                # debe dar 187.77.16.63, NO 2606:4700::
```

Y la prueba real: mandar un correo de prueba desde el VPS y ver en Gmail
"Mostrar original" → `SPF: PASS` y `DKIM: PASS`.

## Limpieza pendiente (menor)

Los registros fantasma cargados en Vercel (mail, SPF, DKIM, DMARC, postiz) no
hacen daño — nadie los consulta — pero conviene borrarlos para que no confundan
a la próxima sesión.
