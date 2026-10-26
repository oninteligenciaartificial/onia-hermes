# Revisión de hooks Claude/Codex/Hermes — 25-10-2026

## Dictamen
**Salud actual no demostrada.** Hay definiciones de hooks en disco y una traza real anterior; ninguna acredita por sí sola carga, confianza o ejecución vigente. No ejecuté handlers ni cambié configuración.

## Inventario y estado
- Claude proyecto: 2 definiciones; Claude usuario: 16.
- Codex proyecto: 1; Codex usuario: 9; plugin claude-mem en caché: 7. Rutas y eventos allowlisted están en `inventario-hooks-20261025.json`; rutas relativas/no resueltas se marcan, nunca se reconstruyen comandos.
- El dispatcher Codex, el binario de hook de Orca y el adaptador `codex-windows.cjs` se registran como destinos/compañero. Su presencia no demuestra activación; el adaptador no se ejecutó. Respaldos del 24-oct se clasifican como referencia, no como configuración activa.
- En los dos `config.yaml` Hermes inspeccionados no aparecieron secciones superiores `hooks/notify/notifications/webhooks`. No equivale a demostrar que ningún componente Hermes tenga hooks.

## Salud observable: hechos vs límites
- La traza que localizó el hijo (`C:/Users/PC/.codex/onia-hooks/execution.jsonl`) contenía 181 registros hasta 24-oct, incluidos53fixtures. **El coordinador verificó que los tres exits no cero son `event=fixture`, exit7, casos intencionales de propagación de error. No son tres fallos nuevos de hooks reales.** Las fixtures posteriores agregan registros; esa cifra pertenece al snapshot del hijo.
- `orca agent hooks status` terminó con exit 0, pero la salida no aportó campos allowlisted de salud; no es un verde verificable. No hubo vista `/hooks` de Claude/Codex ni ciclo real actual observado.
- **Antecedente, no estado actual:** dos ciclos reales reportados (17 invocaciones/8 handlers y12/5, exit0). **Actualización del coordinador:** el25-oct se inspeccionó y ejecutó `check-codex-hook-launcher.py`:25fixtures inertes pasan, sin arrancar los handlers reales. Evidencia: `prueba-hooks-inertes-20261025.json`. No certifica el runtime actual.

## Fallos observados / hipótesis
- **Observado:** ninguna falla nueva se reprodujo porque no se ejecutó handler; la traza localizada es histórica. El incidente separado `legacy_notify` / WinError 206 permanece abierto según el antecedente.
- **No demostrado:** si las definiciones actuales fueron cargadas/confiadas por sesiones activas, si cada ruta resuelve en el runtime, y si hoy los handlers devuelven salida aceptada.

## Prueba pendiente concreta
Para cerrar salud hace falta, fuera de este alcance, leer el estado `/hooks` de las sesiones activas y observar un ciclo inocuo autorizado hasta después del mensaje final, registrando solo evento/exit/bytes. No desactivar hooks ni inferir éxito desde `enabled`, fixture o exit del worker.

## Reconciliación del coordinador

Las35definiciones de las cinco fuentes se agruparon en34entradas (una representa dos definiciones). Las rutas POSIX con variables no resueltas por el inventario estático no se diagnostican como rotas: deben evaluarse con el override Windows y el entorno del runner. No se cambió ni desactivó un hook. La revisión documental y las fixtures quedan cerradas; el ciclo real actual y el incidente `legacy_notify`/WinError206 permanecen explícitamente sin acreditar/resolver.
