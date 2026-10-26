# Skill: operaciones-dashboard

## Objetivo
Ayudar al usuario a abrir y usar el dashboard propio de Hermes.

## Comando
`Dashboard Hermes`

## Respuesta
Indicar:
```powershell
ssh -L 9119:localhost:9119 root@187.77.16.63
```
Luego abrir `http://localhost:9119`.

## Estado
Para revisar servicios:
```bash
hermes gateway status
ig-publish healthcheck
docker ps
journalctl --user -u hermes-gateway -n 80 --no-pager
```

