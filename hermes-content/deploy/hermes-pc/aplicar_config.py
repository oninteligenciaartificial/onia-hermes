# Mezcla config.onia.yaml en el config.yaml de Hermes de la PC (v0.22.2) con el código de Hermes, sin copiarlo.
# Lo llama aplicar.ps1 con el python del venv de Hermes y HERMES_HOME apuntando a la carpeta que se toca:
#   & $py -I aplicar_config.py <config.onia.yaml> <HERMES_HOME\config.yaml>
# Mezcla en profundidad: los dicts se mezclan; las listas y los escalares de config.onia.yaml reemplazan.
# Escribe con hermes_cli.config.atomic_config_write, el mismo camino que usa Hermes: ruamel round-trip, escritura
# atómica, se niega si el config.yaml no se puede leer y si la escritura borraría alguna clave. Se conservan los
# comentarios y el orden del config.yaml; los comentarios de config.onia.yaml NO pasan (Hermes escribe valores, no
# comentarios). Sale 0 si quedó aplicado (o ya estaba), 1 si después de escribir no coincide, 2 si falta algo.
import os
import sys
from pathlib import Path
from typing import Any

HA = os.path.join(os.environ.get("LOCALAPPDATA", ""), "hermes", "hermes-agent")
AUSENTE = object()


def morir(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(2)


def mezclar(base: dict, over: dict, ruta: tuple = ()) -> tuple[dict, list]:
    """Devuelve (base con over encima, [(clave.con.puntos, antes, después)]) sin tocar base."""
    out = dict(base)
    cambios = []
    for k, v in over.items():
        r = ruta + (str(k),)
        antes = base.get(k, AUSENTE)
        if isinstance(v, dict):
            if antes is not AUSENTE and not isinstance(antes, dict):
                cambios.append((".".join(r), antes, "(un mapa)"))
            out[k], sub = mezclar(antes if isinstance(antes, dict) else {}, v, r)
            cambios += sub
            continue
        # True == 1 en Python, pero para YAML es otro valor (lo mismo mira Hermes en _unchanged)
        if antes is AUSENTE or antes != v or isinstance(antes, bool) is not isinstance(v, bool):
            cambios.append((".".join(r), antes, v))
        out[k] = v
    return out, cambios


def corto(x: Any) -> str:
    if x is AUSENTE:
        return "(no estaba)"
    if isinstance(x, list):
        return f"lista de {len(x)}"
    s = repr(x)
    return s if len(s) <= 70 else s[:67] + "..."


def main() -> None:
    if len(sys.argv) != 3:
        morir("uso: aplicar_config.py <config.onia.yaml> <config.yaml>")
    overlay_path, destino = Path(sys.argv[1]), Path(sys.argv[2])
    if not os.environ.get("HERMES_HOME"):
        morir("falta HERMES_HOME: Hermes valida que config.yaml esté dentro de su home")
    if destino.parent.resolve() != Path(os.environ["HERMES_HOME"]).resolve():
        morir(f"{destino} no está en HERMES_HOME={os.environ['HERMES_HOME']}")
    if not destino.is_file():
        morir(f"no existe {destino}")
    sys.path.insert(0, HA)
    try:
        import hermes_yaml
        from hermes_cli.config import atomic_config_write, require_readable_config_before_write
    except Exception as e:
        morir(f"no se pudo cargar Hermes desde {HA} con {sys.executable}: {e!r}. ¿Es el python del venv de Hermes?")

    with open(overlay_path, encoding="utf-8-sig") as f:
        overlay = hermes_yaml.safe_load(f)
    if not isinstance(overlay, dict) or not overlay:
        morir(f"{overlay_path} no es un mapa YAML")
    # Lee como Hermes antes de escribir: falla cerrado si el archivo no se puede leer o no es un mapa
    actual = require_readable_config_before_write(destino)
    nuevo, cambios = mezclar(actual, overlay)
    if not cambios:
        print(f"{destino}: ya tenía todo lo de {overlay_path.name}; no se escribió nada")
        return
    atomic_config_write(destino, nuevo)
    print(f"{destino}: {len(cambios)} claves cambiadas")
    for clave, antes, despues in cambios:
        print(f"  {clave}: {corto(antes)} -> {corto(despues)}")

    # Autocontrol: releído del disco, ya no tiene que quedar nada por aplicar ni ninguna clave perdida
    with open(destino, encoding="utf-8-sig") as f:
        releido = hermes_yaml.safe_load(f)
    _, pendientes = mezclar(releido, overlay)
    perdidas = [k for k in actual if k not in releido]
    if pendientes or perdidas:
        print(f"FALLA: después de escribir quedan {len(pendientes)} claves distintas y se perdieron {perdidas}")
        sys.exit(1)


if __name__ == "__main__":
    main()
