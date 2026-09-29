# Funciones comunes de las acciones de hermes-jarvis. NO se ejecuta sola: el workflow
# la concatena delante de la acción (diagnostico.sh, aplicar.sh, revertir.sh) y manda
# el conjunto por `ssh ... bash -s`. REDACTAR_SED llega definida en la primera línea
# del flujo, con el contenido de redactar.sed.
set +e
export HOME=/root LC_ALL=C.UTF-8
HPY=/usr/local/lib/hermes-agent/venv/bin/python

redactar() { sed -E "${REDACTAR_SED:?falta REDACTAR_SED}"; }
sec() { printf '\n==================== %s ====================\n' "$*"; }
