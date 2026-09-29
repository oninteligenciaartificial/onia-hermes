# hermes-jarvis / revertir — deshace el último `aplicar` que sigue vigente.
# (comun.sh va delante.) Corre el rollback.sh que ese aplicar dejó en su respaldo: el crontab
# vuelve a como estaba (por marcas, sin pisar lo que otro haya cambiado después), Hermes
# reanuda lo que se pausó, n8n reactiva lo que se apagó y la aduana vuelve a su interruptor.
#
# Lo que NO deshace, a propósito: el código de main (la aduana, el lector de calendario, el
# guardia y el vigía de aprobaciones). Con el interruptor apagado ese código se porta como
# antes; volverlo atrás es un revert en git, no un botón.

sec "hermes-jarvis · revertir · $(date -u +%FT%TZ)"
BK=""
for d in $(ls -dt /root/backups/hermes-jarvis-*/ 2>/dev/null); do
  d=${d%/}
  if [ -f "$d/aplicado" ] && [ ! -f "$d/revertido" ] && [ ! -f "$d/reemplazado" ]; then BK=$d; break; fi
done
if [ -z "$BK" ] || [ ! -x "$BK/rollback.sh" ]; then
  echo "No hay un aplicar vigente para deshacer: nada que hacer."
  exit 0
fi
echo "deshago: $BK (commit $(cat "$BK/commit" 2>/dev/null | cut -c1-9))"
bash "$BK/rollback.sh" </dev/null 2>&1 | redactar
[ -f "$BK/revertido" ] && echo "✅ revertido" || { echo "❌ el rollback no terminó: revisar $BK"; exit 1; }
