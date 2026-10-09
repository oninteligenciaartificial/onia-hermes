# Cola · Hermes-Jarvis

- [x] P2 de #173: el aviso de rechazo se reintenta si Telegram falla (test fallo → recuperación → segunda corrida) — `31aebd95`, en `main` con el #173
- [x] Runbook de `aplicar` (#174) listo para que la madre lo corra desde la PC — `fecb4813` (§8 de `TELEGRAM_COMMAND_CENTER.md`)
- [ ] Formato corto (Pasó · Necesito · Sigue) en lo que Hermes le manda: regla en el SOUL y en el resumen/cierre (`jarvis-resumen.sh`). Inerte hasta `aplicar`
- [ ] `diagnostico` muestra el log del recolector de respuestas (pendiente 6 del handoff)
- [ ] `herramientas-desplegadas` lee la fuente del `poner`, no la adivina por el nombre del archivo (pendiente 4 del handoff)

## Bloqueado
- Pruebas P2-P5 (`TELEGRAM_COMMAND_CENTER.md` §8): necesitan `aplicar` en el VPS, que corre la madre desde la PC con el «sí» de Sergio Urcullo. Desde esta sesión no se toca el VPS sin su «sí» acá.
