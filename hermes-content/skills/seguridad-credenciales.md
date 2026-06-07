# Skill: seguridad-credenciales

## Objetivo
Proteger credenciales del VPS, Meta, OpenAI y Notion.

## Reglas
- No repetir secretos completos en respuestas.
- Si el usuario pega un secreto, recomendar rotarlo.
- Guardar secretos solo en `/root/.hermes/.env`.
- Para verificar, mostrar solo `<set>` o longitud aproximada.

## Comandos seguros

Ver claves configuradas sin revelar valores:

```bash
grep -E '^(META_LONG_LIVED_TOKEN|IG_BUSINESS_ACCOUNT_ID|OPENAI_API_KEY|NOTION_TOKEN)=' /root/.hermes/.env | sed 's/=.*/=<set>/'
```

Ver estado Instagram:

```bash
ig-publish healthcheck
```

## Runbook: Rotar token Meta Instagram

1. Obtener un user long-lived token desde Meta.
2. Usar ese token solo para pedir el Page Access Token:

```text
/1140384625819526?fields=name,id,access_token,instagram_business_account{id,username}
```

3. Copiar el `access_token` devuelto por la Page `Onia Marketing`.
4. Verificarlo en Meta Access Token Debugger:
   - `Type: Page`
   - `Expires: Never` ideal
5. Desplegarlo desde Windows:

```powershell
cd C:\dev\Expermimentos\Hermes
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
$env:VPS_PASSWORD="<VPS_PASSWORD>"
$env:IG_BUSINESS_ACCOUNT_ID="17841423363059652"
$env:META_LONG_LIVED_TOKEN="<PAGE_ACCESS_TOKEN>"
npm run deploy:instagram
```

Nota: `META_LONG_LIVED_TOKEN` es el nombre historico del script. Debe contener
el Page Access Token, no el user token.

## Runbook: Validar token

Ejecutar en el VPS o por SSH:

```powershell
ssh root@187.77.16.63 "ig-publish healthcheck"
```

Aceptar solo si:
- `ok` es `true`.
- `debug_token.data.type` es `PAGE`.
- `debug_token.data.is_valid` es `true`.
- `debug_token.data.profile_id` es `1140384625819526`.

Si `expires_at` existe y no es `0`, agendar rotacion antes de esa fecha.

## Runbook: Si el token vence

- Generar un nuevo Page Access Token.
- Repetir `npm run deploy:instagram`.
- Validar con `ig-publish healthcheck`.
- No cambiar codigo ni publicar contenido hasta que el healthcheck vuelva a OK.

## Respuesta ante secreto expuesto
Decir:
- El secreto debe tratarse como expuesto.
- Rotar password/token.
- Actualizar `/root/.hermes/.env`.
- Reiniciar servicios si aplica.
- Buscar y eliminar cualquier copia en Markdown, capturas o logs compartidos.
