/**
 * Cal.com self-host installer para VPS/Easypanel
 *
 * Genera docker-compose.yml y guia de configuracion para desplegar
 * Cal.com en el VPS existente (187.77.16.63 / Easypanel).
 *
 * Uso:
 *   node scripts/vps_install_calcom.js
 *   node scripts/vps_install_calcom.js --output ./calcom-compose.yml
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function buildDockerCompose(config) {
  return `version: '3.8'

services:
  calcom:
    image: calcom/cal.com:latest
    restart: always
    ports:
      - "${config.port}:3000"
    environment:
      DATABASE_URL: postgresql://${config.dbUser}:${config.dbPassword}@calcom-db:5432/${config.dbName}
      NEXTAUTH_SECRET: ${config.nextauthSecret}
      NEXTAUTH_URL: ${config.baseUrl}
      CALENDSO_ENCRYPTION_KEY: ${config.encryptionKey}
      EMAIL_FROM: ${config.emailFrom}
      EMAIL_SERVER_HOST: ${config.smtpHost}
      EMAIL_SERVER_PORT: ${config.smtpPort}
      EMAIL_SERVER_USER: ${config.smtpUser}
      EMAIL_SERVER_PASSWORD: ${config.smtpPassword}
      NEXT_PUBLIC_WEBAPP_URL: ${config.baseUrl}
      NODE_ENV: production
    depends_on:
      calcom-db:
        condition: service_healthy

  calcom-db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: ${config.dbName}
      POSTGRES_USER: ${config.dbUser}
      POSTGRES_PASSWORD: ${config.dbPassword}
    volumes:
      - calcom_db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${config.dbUser} -d ${config.dbName}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  calcom_db_data:
`;
}

function buildEnvExample(config) {
  return `# Cal.com — Variables de entorno
# Copiar a .env y completar valores reales

DATABASE_URL=postgresql://${config.dbUser}:CAMBIA_ESTO@calcom-db:5432/${config.dbName}
NEXTAUTH_SECRET=${config.nextauthSecret}
NEXTAUTH_URL=${config.baseUrl}
CALENDSO_ENCRYPTION_KEY=${config.encryptionKey}
EMAIL_FROM=noreply@onia.ai
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=tu_email@gmail.com
EMAIL_SERVER_PASSWORD=tu_app_password

# URL publica (dominio configurado en Easypanel/Nginx)
NEXT_PUBLIC_WEBAPP_URL=${config.baseUrl}
`;
}

const args = process.argv.slice(2);
const outputArg = args.indexOf('--output');
const outputFile = outputArg !== -1 ? args[outputArg + 1] : null;

const config = {
  port: '3050',
  dbName: 'calcom',
  dbUser: 'calcom',
  dbPassword: generateSecret(16),
  nextauthSecret: generateSecret(32),
  encryptionKey: generateSecret(16),
  baseUrl: 'https://cal.onia.ai',
  emailFrom: 'noreply@onia.ai',
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUser: 'TU_EMAIL',
  smtpPassword: 'TU_APP_PASSWORD',
};

const compose = buildDockerCompose(config);
const envExample = buildEnvExample(config);

const guide = `
=====================================
CAL.COM SELF-HOST — GUIA INSTALACION
=====================================

1. EASYPANEL (recomendado para tu VPS)
   - Ir a Easypanel → New Service → Docker Compose
   - Pegar el docker-compose.yml generado
   - Configurar dominio: cal.onia.ai (o el que uses)
   - Activar SSL automático

2. ALTERNATIVA: SSH directo al VPS
   scp calcom-compose.yml root@187.77.16.63:/opt/calcom/docker-compose.yml
   ssh root@187.77.16.63 "cd /opt/calcom && docker-compose up -d"

3. PRIMERA CONFIGURACION (solo una vez)
   - Ir a https://cal.onia.ai/setup
   - Crear cuenta de admin con email de ONIA
   - Configurar tipos de evento:
     * Consulta inicial (30min)
     * Reunion de proyecto (60min)
     * Demo ONIA (45min)

4. WEBHOOK PARA N8N
   - En Cal.com → Settings → Developer → Webhooks
   - URL: https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/calcom-booking
   - Eventos: BOOKING_CREATED
   - Esto activa el workflow "ONIA - Agenda: Cal.com Booking" en n8n

5. CONFIGURAR VARIABLE EN N8N
   - En n8n → Settings → Variables
   - Crear variable: SERGIO_TELEGRAM_CHAT_ID = TU_CHAT_ID
   - Para obtener tu chat ID: enviarle un mensaje a @get_id_bot en Telegram

6. ACTIVAR WORKFLOWS EN N8N
   Activar los 4 workflows (aparecen inactivos por defecto):
   - ONIA - Agenda: Briefing Diario
   - ONIA - Agenda: Crear Evento
   - ONIA - Agenda: Recordatorios
   - ONIA - Agenda: Cal.com Booking

=====================================
DOCKER COMPOSE GENERADO:
=====================================
${compose}

=====================================
.ENV EJEMPLO:
=====================================
${envExample}
`;

if (outputFile) {
  fs.writeFileSync(outputFile, compose);
  console.log('docker-compose.yml guardado en:', outputFile);
  const envFile = outputFile.replace('.yml', '.env.example');
  fs.writeFileSync(envFile, envExample);
  console.log('.env.example guardado en:', envFile);
} else {
  console.log(guide);
}
