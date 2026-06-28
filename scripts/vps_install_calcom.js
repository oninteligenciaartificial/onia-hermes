/**
 * Cal.com / Cal.diy deployment kit generator for ONIA.
 *
 * This script does not deploy or print real secrets. It prepares a reviewable
 * Docker Compose kit for the ONIA VPS/Easypanel flow.
 *
 * Usage:
 *   node scripts/vps_install_calcom.js
 *   node scripts/vps_install_calcom.js --kit hermes-content/deploy/calcom
 *   node scripts/vps_install_calcom.js --output ./calcom-compose.yml
 */

const fs = require("fs");
const path = require("path");

function argValue(name) {
  const idx = process.argv.indexOf(name);
  return idx === -1 ? null : process.argv[idx + 1] || null;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function getConfig() {
  const domain = process.env.CALCOM_DOMAIN || "cal.onia.com.bo";
  const baseUrl = process.env.CALCOM_BASE_URL || `https://${domain}`;
  return {
    domain,
    baseUrl,
    port: process.env.CALCOM_PORT || "3050",
    image: process.env.CALCOM_IMAGE || "calcom/cal.com:v6.2.0",
    postgresImage: process.env.CALCOM_POSTGRES_IMAGE || "postgres:15-alpine",
    redisImage: process.env.CALCOM_REDIS_IMAGE || "redis:7-alpine",
    dbName: process.env.CALCOM_DB_NAME || "calcom",
    dbUser: process.env.CALCOM_DB_USER || "calcom",
    emailFrom: process.env.CALCOM_EMAIL_FROM || "business@onia.com.bo",
    smtpHost: process.env.CALCOM_SMTP_HOST || "smtp.gmail.com",
    smtpPort: process.env.CALCOM_SMTP_PORT || "587",
    webhookUrl:
      process.env.CALCOM_N8N_WEBHOOK_URL ||
      "https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/calcom-booking",
  };
}

function buildDockerCompose(config) {
  return `# ONIA Cal.com/Cal.diy deployment kit.
# Review current Cal.com/Cal.diy licensing and image choice before public use.
# Default image is pinned from DockerHub for repeatability; override CALCOM_IMAGE if needed.

services:
  calcom:
    image: \${CALCOM_IMAGE:-${config.image}}
    restart: unless-stopped
    expose:
      - "3000"
    env_file:
      - .env
    environment:
      DATABASE_URL: postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@calcom-db:5432/\${POSTGRES_DB}
      DATABASE_DIRECT_URL: postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@calcom-db:5432/\${POSTGRES_DB}
      REDIS_URL: redis://calcom-redis:6379
      NEXTAUTH_URL: \${NEXTAUTH_URL}
      NEXT_PUBLIC_WEBAPP_URL: \${NEXT_PUBLIC_WEBAPP_URL}
      NEXT_PUBLIC_WEBSITE_URL: \${NEXT_PUBLIC_WEBSITE_URL}
      NEXTAUTH_SECRET: \${NEXTAUTH_SECRET}
      CALENDSO_ENCRYPTION_KEY: \${CALENDSO_ENCRYPTION_KEY}
      EMAIL_FROM: \${EMAIL_FROM}
      EMAIL_SERVER_HOST: \${EMAIL_SERVER_HOST}
      EMAIL_SERVER_PORT: \${EMAIL_SERVER_PORT}
      EMAIL_SERVER_USER: \${EMAIL_SERVER_USER}
      EMAIL_SERVER_PASSWORD: \${EMAIL_SERVER_PASSWORD}
      NEXT_PUBLIC_LICENSE_CONSENT: \${NEXT_PUBLIC_LICENSE_CONSENT:-agree}
      CALCOM_TELEMETRY_DISABLED: \${CALCOM_TELEMETRY_DISABLED:-1}
      NODE_ENV: production
    depends_on:
      calcom-db:
        condition: service_healthy
      calcom-redis:
        condition: service_started
    networks:
      default:
      easypanel:
        aliases:
          - onia-calcom

  calcom-db:
    image: \${CALCOM_POSTGRES_IMAGE:-${config.postgresImage}}
    restart: unless-stopped
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - calcom_db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER} -d \${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      default:

  calcom-redis:
    image: \${CALCOM_REDIS_IMAGE:-${config.redisImage}}
    restart: unless-stopped
    volumes:
      - calcom_redis_data:/data
    networks:
      default:

volumes:
  calcom_db_data:
  calcom_redis_data:

networks:
  easypanel:
    external: true
`;
}

function buildEnvExample(config) {
  return `# ONIA Cal.com/Cal.diy environment example.
# Copy to .env on the VPS and replace placeholders there. Do not commit real values.

CALCOM_IMAGE=${config.image}
POSTGRES_DB=${config.dbName}
POSTGRES_USER=${config.dbUser}
POSTGRES_PASSWORD=REPLACE_WITH_STRONG_PASSWORD

NEXTAUTH_URL=${config.baseUrl}
NEXT_PUBLIC_WEBAPP_URL=${config.baseUrl}
NEXT_PUBLIC_WEBSITE_URL=${config.baseUrl}
NEXTAUTH_SECRET=REPLACE_WITH_OPENSSL_RAND_BASE64_32
CALENDSO_ENCRYPTION_KEY=REPLACE_WITH_OPENSSL_RAND_BASE64_24
NEXT_PUBLIC_LICENSE_CONSENT=agree
CALCOM_TELEMETRY_DISABLED=1

EMAIL_FROM=${config.emailFrom}
EMAIL_SERVER_HOST=${config.smtpHost}
EMAIL_SERVER_PORT=${config.smtpPort}
EMAIL_SERVER_USER=REPLACE_WITH_SMTP_USER
EMAIL_SERVER_PASSWORD=REPLACE_WITH_SMTP_APP_PASSWORD

# Configure this webhook manually inside Cal after setup.
CALCOM_N8N_WEBHOOK_URL=${config.webhookUrl}
`;
}

function buildReadme(config) {
  return `# ONIA Cal.com / Cal.diy Deploy Kit

Target: \`${config.baseUrl}\`

## Purpose

Self-host booking pages for ONIA meetings and route bookings into:

1. Cal booking page.
2. n8n webhook \`/webhook/calcom-booking\`.
3. Google Calendar event.
4. Telegram notification to Sergio.
5. ONIA shared Supabase operations layer.

## Important Decision

ONIA already has a VPS and a private self-hosted Supabase stack. Supabase is the
shared data layer for ONIA projects, not something created only for Cal.

Cal should not own or expose the shared Supabase instance. Cal uses its own
Postgres/Redis runtime, and n8n mirrors booking events into Supabase alongside
other ONIA project data such as Web Factory, internal operations, automations,
content systems and future project dashboards.

## Before Deploy

- Point DNS \`cal.onia.com.bo\` to the ONIA VPS.
- Confirm VPS/Easypanel access.
- Generate real secrets on the VPS:
  - \`openssl rand -base64 32\` for \`NEXTAUTH_SECRET\`
  - \`openssl rand -base64 24\` for \`CALENDSO_ENCRYPTION_KEY\`
  - strong hex password for \`POSTGRES_PASSWORD\`; avoid raw base64 in database URLs
- Confirm SMTP credentials for \`business@onia.com.bo\` or the selected sender.
- Review current Cal.com/Cal.diy licensing and image choice before public use.

## Event Types To Create

- \`consulta-inicial\`: 30 minutes, free, for new prospects.
- \`demo-onia\`: 45 minutes, for DentalGest/Gesti-OS/Web demos.
- \`reunion-proyecto\`: 60 minutes, for active clients.
- \`auditoria-pagada\`: 60 minutes, only after payment.

## Webhook

Create a Cal webhook:

- URL: \`${config.webhookUrl}\`
- Event: \`BOOKING_CREATED\`

Recommended follow-up events later:

- \`BOOKING_RESCHEDULED\`
- \`BOOKING_CANCELLED\`

## Health Checks

\`\`\`bash
docker compose ps
curl -I ${config.baseUrl}
curl -I ${config.baseUrl}/api/auth/session
\`\`\`

## Rollback

\`\`\`bash
docker compose down
docker compose logs --tail=200 calcom
\`\`\`

Do not delete volumes unless a backup exists.
`;
}

function writeKit(dir, config) {
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, "docker-compose.yml"), buildDockerCompose(config));
  fs.writeFileSync(path.join(dir, ".env.example"), buildEnvExample(config));
  fs.writeFileSync(path.join(dir, "README.md"), buildReadme(config));
}

function main() {
  const config = getConfig();
  const kitDir = argValue("--kit");
  const outputFile = argValue("--output");

  if (kitDir) {
    writeKit(kitDir, config);
    console.log(`Cal deploy kit written to: ${kitDir}`);
    return;
  }

  if (outputFile) {
    fs.writeFileSync(outputFile, buildDockerCompose(config));
    const envFile = outputFile.replace(/\.ya?ml$/i, ".env.example");
    fs.writeFileSync(envFile, buildEnvExample(config));
    console.log(`docker-compose.yml written to: ${outputFile}`);
    console.log(`.env.example written to: ${envFile}`);
    return;
  }

  console.log(buildReadme(config));
  console.log("\n--- docker-compose.yml ---\n");
  console.log(buildDockerCompose(config));
  console.log("\n--- .env.example ---\n");
  console.log(buildEnvExample(config));
}

main();
