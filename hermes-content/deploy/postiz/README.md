# Postiz self-host (preparado, arranque GATED)

Alternativa OSS a Buffer para programar redes de ONIA y ofrecer scheduling como
servicio a clientes. Sigue la convencion del kit selfhosted: privado primero,
bind a `127.0.0.1`, arranque solo tras validar recursos.

## Estado

- 2026-07-04: **PREPARADO, NO ARRANCAR TODAVIA.**
- Gate: el VPS tiene swap al 100% (ver `docs/ONIA_TOOLING_ASSESSMENT_20260704.md`).
  Postiz suma ~1-1.5GB (app + Postgres + Redis + Temporal). Arrancar recien tras
  liberar RAM (consolidar Supabase / apagar Cal.com) o subir el VPS a 32GB.

## Por que Postiz (vs Mixpost)

- Postiz: AGPL-3.0, 30+ redes, agentic, muy activo. Free edition con workspaces.
- Mixpost: MIT, pago unico, workflows de aprobacion multi-nivel, mas estable para
  agencias. Alternativa si se necesita aprobacion formal de posts de cliente.
- Recomendacion ONIA: **Postiz** por cobertura de redes y ritmo de desarrollo.

## Requisitos (oficial)

- Fuente unica de verdad: repo `gitroomhq/postiz-docker-compose`. Siempre traer
  el compose del repo, no copiar snapshot.
- Servicios: app Postiz + PostgreSQL + Redis + Temporal.
- Probado en Ubuntu 24.04, 2GB RAM, 2 vCPU (minimo).
- Puertos: 4007 (frontend), 8080 (Temporal UI). Bind a localhost hasta validar.

## Deploy (cuando el gate se libere)

```bash
# En el VPS, en ventana de mantenimiento, tras `docker stats` con RAM libre.
cd /opt/onia-selfhosted
git clone https://github.com/gitroomhq/postiz-docker-compose postiz
cd postiz
cp .env.example .env
# Editar .env: MAIN_URL, NEXT_PUBLIC_BACKEND_URL, JWT_SECRET (aleatorio),
# DATABASE_URL, REDIS_URL. Bind de puertos a 127.0.0.1 en el compose.
docker compose up -d
docker compose ps
curl -fsS http://127.0.0.1:4007 || true
```

## Acceso inicial

Igual que el resto del kit: tunnel SSH antes de dominio publico.

```bash
ssh -L 4007:127.0.0.1:4007 root@187.77.16.63
```

Solo tras validar, darle dominio en Traefik/Easypanel (letsencrypt).

## Credenciales de redes

Cada red (Instagram, Facebook, LinkedIn, X, TikTok, etc.) requiere su app/API
propia. Reusar la app de Meta ya registrada para IG/Facebook. No commitear `.env`.

## Regla de autonomia

Postiz es herramienta de operador (programar contenido a mano/asistido). No
convertirlo en dependencia dura de un cron n8n critico; los workflows autonomos
siguen sobre APIs gestionadas.
