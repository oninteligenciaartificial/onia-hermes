#!/usr/bin/env bash
# ONIA — VIGIA DEL DISCO DEL VPS.
#
# POR QUE EXISTE: el 2026-09-02, midiendo si el sistema podia correr sin la
# laptop de Sergio, aparecio que / estaba al 90% con 20 GB libres y que 93 de los
# 174 GB usados los ocupa /root/loops — que NO es produccion, pero comparte disco
# con Docker. Ahi viven las webs (onia-landing, onia-platform), la base
# (supabase-db) y n8n: si el disco se llena, se caen los tres JUNTOS.
#
# Y crece a escalones, no en goteo: ~5,5 GB de golpe cada vez que un loop crea un
# worktree nuevo (cada uno arrastra una copia de los 4,3 GB de hermes-content).
# Con 20 GB libres eso son unos TRES worktrees mas antes del desastre. Un goteo se
# ve venir; un escalon de 5,5 GB en un disco al 90% no.
#
# Nadie miraba esto. El supervisor audita loops, el vigia de Hermes audita jobs,
# el watchdog del bot audita el webhook — y el disco, que los tumba a todos, no
# tenia quien lo mirara.
#
# Deliberadamente tonto: mide, compara con el umbral y avisa. No borra nada solo.
# Borrar sin que nadie mire es como se pierden cosas, y aca lo que sobra son
# worktrees de carriles que pueden estar trabajando ahora mismo.
set -uo pipefail

UMBRAL="${ONIA_DISCO_UMBRAL:-88}"      # % de uso a partir del cual avisa
MARCA="/var/lib/onia-disco.avisado"    # un aviso por incidente, no uno por hora

USO=$(df --output=pcent / | tail -1 | tr -dc '0-9')
LIBRE=$(df -h --output=avail / | tail -1 | tr -d ' ')

if [ "${USO:-0}" -lt "$UMBRAL" ]; then
  # Se recupero: avisar UNA vez y limpiar la marca.
  if [ -f "$MARCA" ]; then
    /root/bin/onia-tg.sh "🟢 <b>Disco del VPS recuperado</b> — ${USO}% usado, ${LIBRE} libres." >/dev/null 2>&1 || true
    rm -f "$MARCA"
  fi
  exit 0
fi

# Ya avisamos de este incidente: callar. El cron corre seguido y 30 mensajes
# iguales logran que nadie lea el numero 31.
[ -f "$MARCA" ] && exit 0

LOOPS=$(du -sh /root/loops 2>/dev/null | cut -f1)
DOCKER=$(du -sh /var/lib/docker 2>/dev/null | cut -f1)
# Cuantos worktrees mas entran antes de llenarlo. 5,5 GB es lo que pesa uno nuevo,
# medido el 2026-09-02 sobre los 12 que habia.
LIBRE_GB=$(df -BG --output=avail / | tail -1 | tr -dc '0-9')
MARGEN=$(( LIBRE_GB / 6 ))

/root/bin/onia-tg.sh "🔴 <b>Disco del VPS al ${USO}%</b> — quedan ${LIBRE}

Si se llena se caen JUNTOS: onia.com.bo, app.onia.com.bo, la base y n8n.

• <code>/root/loops</code>: ${LOOPS} (no es produccion)
• <code>/var/lib/docker</code>: ${DOCKER} (si lo es)

Margen: ~${MARGEN} worktree(s) mas antes de llenarlo.
Cada worktree nuevo se lleva 5,5 GB porque copia entero <code>hermes-content</code>." >/dev/null 2>&1 || true

touch "$MARCA"
