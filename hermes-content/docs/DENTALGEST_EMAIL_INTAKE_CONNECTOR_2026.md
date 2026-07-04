# DentalGest Email Intake Connector 2026

Fecha: 2026-07-03.
Estado: workflow listo para importar; requiere 2 credenciales en n8n UI.
Owner: ONIA / Hermes.

## Que hace

Cierra el circuito de la columna vertebral (ONIA Core v0.5.0): lee los correos
de la clinica y los convierte en pendientes con responsable.

```text
Correo a recepcion@clinica.bo
  -> n8n (VPS ONIA, workflow "DentalGest - Email Intake")
  -> POST https://www.dentalgest.app/api/onia-core/intake
  -> WorkItem "mensaje_correo" con dueno (round-robin recepcion)
  -> visible en /pending y en el panel del dueno
```

Garantias que ya da el endpoint (no las implementa n8n):

- Dedupe 24h por contacto+canal: el mismo remitente insistiendo NO duplica.
- Match de paciente por email (si existe, el pendiente queda ligado).
- Canal `email_shared` ya registrado en el contrato; el buzon debe estar
  declarado como CommunicationChannel via wizard `/setup` de la clinica.

## Archivo

`hermes-content/deploy/n8n/workflows/dentalgest-email-intake.json`

## Pasos de activacion (n8n UI del VPS ONIA, ~10 min)

1. **Credencial IMAP** (Credentials > New > IMAP): buzon de la clinica
   (host, usuario, password de aplicacion). Nombrarla
   `DentalGest Intake Mailbox`.
2. **Credencial Header Auth** (Credentials > New > Header Auth):
   - Name: `x-intake-secret`
   - Value: el `ONIA_INTAKE_SECRET` de Vercel (Vercel > dental-gest >
     Settings > Environment Variables; ya esta configurado desde 2026-07-03).
   - Nombrarla `DentalGest Intake Secret`.
3. Importar el JSON (Workflows > Import from File).
4. En el nodo Code, completar `ORG_BY_MAILBOX` con el/los organizationId
   reales (tabla `organizations` de DentalGest; un buzon -> una clinica).
5. Asignar las 2 credenciales a sus nodos y **Activar**.
6. Probar: enviar un correo al buzon -> debe aparecer en `/pending` de la
   clinica en el siguiente poll del IMAP.

## Reglas respetadas (CLAUDE.md n8n VPS)

- Sin `$env` en nodos: URL hardcodeada, secreto en credencial Header Auth.
- Workflow autonomo: nada local, solo VPS + API publica de DentalGest.

## Extension futura

- Mismo patron para GestiOS/ProveeGest: cambiar URL y ORG_BY_MAILBOX.
- WhatsApp/Chatwoot usa el mismo endpoint con canal `whatsapp_chatwoot`
  (gated: requiere `whatsappAddon` activo en la organizacion).
