# Hermes Agent — ONIA Business Assistant

## Estado actual
- VPS: 187.77.16.63 (Hostinger KVM2)
- Bot Telegram: Alfredhq
- Modelo: gpt-4o (OpenAI API)
- Gateway: activo 24/7 como servicio systemd

## Casos de uso a implementar

### 1. Base de datos de clientes
- Guardar nombre, contacto, empresa, notas
- Comando: "Guarda cliente: [nombre], [email], [empresa], [notas]"
- Hermes lo guarda en archivo local

### 2. Recordatorios de impuestos
- Alertas automáticas antes de fechas de vencimiento
- Implementado via cron de Hermes

### 3. Facturas
- Registrar facturas enviadas/recibidas
- Seguimiento de pagos pendientes

### 4. Carruseles para redes sociales
- Generar copy para carruseles de Instagram/LinkedIn
- Requiere: fal.ai API key para imágenes (opcional)

### 5. Prospección de clientes
- Buscar posibles clientes por industria/ubicación
- Requiere: Tavily API key (gratis 1000 búsquedas/mes)

## APIs pendientes de configurar
- [ ] Tavily (web search) — tavily.com — free tier
- [ ] fal.ai (imágenes) — fal.ai — pay per use

## Comandos útiles (en VPS SSH)
```bash
hermes gateway status      # ver si está corriendo
hermes gateway restart     # reiniciar
hermes doctor              # diagnóstico
hermes update              # actualizar
journalctl --user -u hermes-gateway -f   # logs en vivo
```

## Fix aplicado
reasoning_effort=none en /root/.hermes/config.yaml
(resuelve error "Encrypted content not supported" con gpt-4o)
