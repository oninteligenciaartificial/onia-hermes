#!/usr/bin/env bash
# Tablero de ONIA para una pestaña de Orca: qué espera revisión y qué se publicó. Se refresca cada 5 min.
R=oninteligenciaartificial
while true; do
  clear; date '+ONIA · %d-%m %H:%M'
  for repo in onia-hermes onia-platform; do
    echo; echo "== $repo · abiertos"
    gh pr list --repo "$R/$repo" --state open --limit 15 --json title,isDraft,updatedAt \
      --jq '.[] | "\(if .isDraft then "borrador" else "listo   " end)  \(.updatedAt[5:16])  \(.title[0:72])"'
    echo "-- publicados"
    gh pr list --repo "$R/$repo" --state merged --limit 5 --json title,mergedAt \
      --jq '.[] | "\(.mergedAt[5:16])  \(.title[0:72])"'
  done
  sleep 300
done
