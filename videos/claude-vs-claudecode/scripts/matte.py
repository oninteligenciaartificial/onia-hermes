"""Recorta a la persona de cada frame -> PNG con alpha (para que el titulo pase por DETRAS).
Uso: python scripts/matte.py <dir_src> <dir_dst> [modelo]
No es garantia de nada: se MIRA el resultado antes de dar el render por bueno."""
import sys, os, glob
from rembg import new_session, remove
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
model = sys.argv[3] if len(sys.argv) > 3 else "u2net_human_seg"
os.makedirs(dst, exist_ok=True)
sess = new_session(model)
files = sorted(glob.glob(os.path.join(src, "*.png")))
print(f"{len(files)} frames, modelo {model}", flush=True)
for i, f in enumerate(files):
    out = os.path.join(dst, os.path.basename(f))
    if os.path.exists(out):
        continue
    remove(Image.open(f).convert("RGB"), session=sess, post_process_mask=True).save(out)
    if i % 25 == 0:
        print(f"{i}/{len(files)}", flush=True)
print("OK", len(files), flush=True)
