# ONIA - Master Plan de Automatizacion con Hermes

## Estado actual (2026-05-31)

### Infraestructura VPS (187.77.16.63)
- Hermes Agent: ACTIVO (gpt-4o, reasoning_effort=none)
- Telegram bot: ACTIVO (Alfredhq, ID: 6830070978)
- SearXNG: ACTIVO (localhost:8080) - busqueda web ilimitada
- n8n: ACTIVO (Docker)
- Chatwoot: ACTIVO (Docker)
- Dashboard Hermes: puerto 9119 (tunel SSH para acceder)

### Fix critico aplicado
`reasoning_effort=none` en `/root/.hermes/config.yaml`.
Sin esto, Hermes falla con `Encrypted content not supported` usando gpt-4o.

---

## Automatizaciones

### 1. Contenido para redes sociales
**Que hace:** Hermes investiga tendencias, genera planes semanales, crea carruseles, historias y posts para ONIA.

**Estado:** EN PROGRESO - contexto, tendencias y plan semanal listos; falta workflow n8n y credenciales finales de Instagram.

**Listo:**
- [x] Contexto operativo de ONIA
- [x] Skill de carruseles
- [x] Skill de tendencias IA/redes con fuentes fiables
- [x] Skill de plan semanal ONIA
- [x] Regla de aprobacion manual antes de publicar

**Pendiente:**
- [ ] Desplegar contenido Hermes al VPS
- [ ] Probar comandos desde Telegram
- [ ] Crear workflow n8n `ONIA - Plan semanal`
- [x] Referencia operativa para workflow n8n `ONIA - Plan semanal`
- [ ] Instagram Graph API token long-lived
- [ ] Instagram Business Account ID
- [ ] Prueba controlada de publicacion aprobada

### 2. Publicacion Instagram protegida
**Que hace:** Publica Reels y carruseles usando `ig-publish`.

**Estado:** EN PROGRESO - script instalado por deploy, publicacion automatica desactivada por defecto.

**Regla:** Hermes solo ejecuta `ig-publish` si el usuario aprueba la pieza exacta, caption y assets.

### 3. Prospeccion ONIA
**Que hace:** Busca prospectos por industria y ubicacion usando fuentes publicas verificables.

**Estado:** SKILL LISTA - falta probar con casos reales.

**Comando:** `Busca prospectos ONIA: <industria> | <ubicacion>`

**Criterio:** pocos prospectos buenos con senal de oportunidad antes que listas largas sin contexto.

### 4. Recordatorios fiscales Bolivia
**Que hace:** Prepara recordatorios editables para IVA, IT, RC-IVA e IUE.

**Estado:** PLANTILLA LISTA - falta completar NIT, regimen, responsable, canales y calendario confirmado.

**Regla:** no activar fechas exactas sin validacion del usuario, contador o fuente oficial.

### 5. ManyChat - DMs automaticos IG + TikTok
**Que hace:** Responde DMs, comenta automaticamente y nutre leads.

**Estado:** PENDIENTE - requiere cuenta ManyChat y conexion con Meta Business/TikTok.

### 6. WhatsApp Business API
**Estado:** BLOQUEADO - falta verificacion de negocio en Meta.

**Cuando este listo:** conectar con Chatwoot.

### 7. Gestion de facturas
**Estado:** PENDIENTE.

---

## Contexto de ONIA

**Empresa:** ONIA - Agencia de Diseno Web e IA  
**Fundador:** Sergio Urcullo  
**Ubicacion:** Santa Cruz, Bolivia  
**Web:** https://onia.com.bo  
**Tel:** +591 75470140  
**Email:** oninteligenciaartificial@gmail.com

**Productos:**
1. Diseno y desarrollo web (Next.js, TypeScript)
2. Soluciones IA para empresas bolivianas
3. DentalGest - SaaS para clinicas dentales
4. Gestios - plataforma de gestion empresarial
5. Automatizaciones n8n + Chatwoot
6. Paginas web/landings conectadas a captacion
7. Marketing con Higgsfield para contenido, UGC y ads

**Cliente ideal:** Empresas y emprendedores de Bolivia, clinicas dentales y negocios que quieren IA practica.

---

## Stack tecnico

| Herramienta | Proposito | Estado |
|-------------|-----------|--------|
| Hermes Agent | Cerebro central / asistente personal | ACTIVO |
| Telegram | Canal rapido de operacion | ACTIVO |
| SearXNG | Busqueda web para tendencias y prospeccion | ACTIVO |
| n8n | Automatizaciones, horarios y aprobaciones | ACTIVO |
| Chatwoot | Atencion al cliente centralizada | ACTIVO |
| Instagram Publisher | Publicacion IG con aprobacion | EN PROGRESO |
| ManyChat | DMs automaticos IG + TikTok | PENDIENTE |
| WhatsApp Business API | Atencion por WhatsApp | BLOQUEADO |

---

## Comandos Hermes

### Contenido e investigacion
- `Investiga tendencias IA`
- `Investiga tendencias redes`
- `Investiga tendencias ONIA: <tema o industria>`
- `Plan semanal ONIA`
- `Plan semanal ONIA: <tema o industria>`
- `Genera carrusel ONIA: <tema> | <objetivo> | <audiencia>`

### Instagram
- `Estado IG`
- `Publica IG Reel: <url_video> | <caption>`
- `Publica IG Carrusel: <urls_imagenes> | <caption>`

### Prospeccion
- `Busca prospectos ONIA: <industria> | <ubicacion>`
- `Guarda prospecto: <datos>`
- `Orquesta ONIA: <empresa o rubro> | <objetivo>`
- `Prepara venta DentalGest: <clinica>`
- `Prepara venta Gestios: <empresa>`
- `Prepara venta Web ONIA: <negocio>`
- `Prepara marketing Higgsfield: <negocio> | <oferta>`

### Fiscal
- `Recordatorios fiscales ONIA`
- `Configura impuestos ONIA: <datos>`

### Operacion
- `Dashboard Hermes`

---

## Reglas operativas

- Publicacion automatica desactivada por defecto.
- Hermes puede investigar, planificar y generar borradores sin aprobacion.
- Hermes solo publica si el usuario aprueba pieza, caption y assets.
- Hermes solo contacta prospectos si Sergio aprueba el mensaje y canal exactos.
- n8n es el orquestador recomendado para flujos recurrentes.
- Las fechas fiscales deben validarse antes de activar alertas.
- Usar solo fuentes fiables para tendencias y fuentes publicas para prospeccion.

---

## Proximos pasos

1. Desplegar contenido Hermes al VPS con `npm run deploy:hermes-content`.
2. Verificar en VPS que existan las nuevas skills y referencias.
3. Probar desde Telegram `Investiga tendencias IA`.
4. Probar `Plan semanal ONIA: clinicas dentales Bolivia`.
5. Probar `Busca prospectos ONIA: clinicas dentales | Santa Cruz Bolivia`.
6. Probar `Recordatorios fiscales ONIA`.
7. Crear workflow n8n `ONIA - Plan semanal`.
8. Completar credenciales de Instagram Graph API.
9. Hacer prueba controlada de publicacion con aprobacion manual.

---

## Comandos utiles VPS

```bash
ssh root@187.77.16.63

hermes gateway status
docker ps
docker ps | grep searxng
docker ps | grep n8n
docker ps | grep chatwoot
ig-publish healthcheck

journalctl --user -u hermes-gateway -f
hermes gateway restart
```

Dashboard:
```powershell
ssh -L 9119:localhost:9119 root@187.77.16.63
```

Abrir:
```text
http://localhost:9119
```
