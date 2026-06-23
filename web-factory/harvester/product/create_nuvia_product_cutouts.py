from __future__ import annotations

import json
import re
import shutil
import statistics
import time
import unicodedata
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
CLIENT_JSON = ROOT / "data" / "clients" / "nuvia.json"
PUBLIC_NUVIA = ROOT / "apps" / "site" / "public" / "nuvia"
PUBLIC_ASSETS = PUBLIC_NUVIA / "assets"
DATA_ASSETS = ROOT / "data" / "clients" / "nuvia.assets"
OUTPUT_REL_DIR = Path("product-media-cutout")
TARGET_SIZE = 1200
TARGET_PRODUCT_SIDE = 980
PROCESS_MAX_SIDE = 720
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def slugify(value: str, fallback: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", normalized).strip("-").lower()
    return (slug or fallback)[:90]


def resolve_public_image(src: str) -> Path | None:
    if not src.startswith("assets/"):
        return None

    public_path = PUBLIC_NUVIA / Path(src)
    if public_path.exists():
        return public_path

    data_path = DATA_ASSETS / Path(src).relative_to("assets")
    if data_path.exists():
        return data_path

    return None


def is_light_background(rgb: tuple[int, int, int], edge_rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb
    brightness = (r + g + b) / 3
    saturation = max(rgb) - min(rgb)
    distance_from_edge = sum((channel - edge) ** 2 for channel, edge in zip(rgb, edge_rgb)) ** 0.5

    if brightness >= 248 and saturation <= 30:
        return True

    if brightness >= 232 and saturation <= 38 and distance_from_edge <= 28:
        return True

    return distance_from_edge <= 18 and brightness >= 218 and saturation <= 46


def is_product_seed(rgb: tuple[int, int, int], edge_rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb
    brightness = (r + g + b) / 3
    saturation = max(rgb) - min(rgb)
    distance_from_edge = sum((channel - edge) ** 2 for channel, edge in zip(rgb, edge_rgb)) ** 0.5

    if saturation >= 34 and brightness <= 252:
        return True

    if brightness <= 232:
        return True

    return distance_from_edge >= 48 and brightness <= 248


def product_span_mask(rgba: Image.Image, edge_rgb: tuple[int, int, int]) -> Image.Image:
    width, height = rgba.size
    pixels = rgba.load()
    mask = bytearray(width * height)
    min_span = max(8, width // 80)

    for y in range(height):
        row_seeds: list[int] = []
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a > 8 and is_product_seed((r, g, b), edge_rgb):
                row_seeds.append(x)

        if len(row_seeds) < 2:
            continue

        left = max(0, min(row_seeds) - 2)
        right = min(width - 1, max(row_seeds) + 2)
        if right - left < min_span:
            continue

        for x in range(left, right + 1):
            mask[y * width + x] = 255

    return Image.frombytes("L", (width, height), bytes(mask)).filter(ImageFilter.GaussianBlur(0.35))


def remove_edge_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    if max(rgba.size) > PROCESS_MAX_SIDE:
        rgba.thumbnail((PROCESS_MAX_SIDE, PROCESS_MAX_SIDE), Image.Resampling.LANCZOS)

    width, height = rgba.size
    pixels = rgba.load()

    border_values: list[tuple[int, int, int]] = []
    for x in range(width):
        for y in (0, height - 1):
            r, g, b, a = pixels[x, y]
            if a > 8:
                border_values.append((r, g, b))
    for y in range(height):
        for x in (0, width - 1):
            r, g, b, a = pixels[x, y]
            if a > 8:
                border_values.append((r, g, b))

    if border_values:
        edge_rgb = tuple(int(statistics.median(channel)) for channel in zip(*border_values))
    else:
        edge_rgb = (255, 255, 255)

    def is_background(x: int, y: int) -> bool:
        r, g, b, a = pixels[x, y]
        return a <= 8 or is_light_background((r, g, b), edge_rgb)

    mask = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        index = y * width + x
        if mask[index] or not is_background(x, y):
            return
        mask[index] = 255
        queue.append((x, y))

    for x in range(width):
        push(x, 0)
        push(x, height - 1)
    for y in range(height):
        push(0, y)
        push(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            push(x - 1, y)
        if x < width - 1:
            push(x + 1, y)
        if y > 0:
            push(x, y - 1)
        if y < height - 1:
            push(x, y + 1)

    background_mask = Image.frombytes("L", (width, height), bytes(mask)).filter(ImageFilter.GaussianBlur(0.55))
    new_alpha = ImageChops.subtract(rgba.getchannel("A"), background_mask)
    new_alpha = ImageChops.lighter(new_alpha, product_span_mask(rgba, edge_rgb))
    rgba.putalpha(new_alpha)
    return rgba


def normalize_cutout(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value > 14 else 0).getbbox()
    if not bbox:
        return image

    cropped = image.crop(bbox)
    crop_width, crop_height = cropped.size
    scale = min(TARGET_PRODUCT_SIDE / crop_width, TARGET_PRODUCT_SIDE / crop_height)
    resized = cropped.resize(
        (max(1, round(crop_width * scale)), max(1, round(crop_height * scale))),
        Image.Resampling.LANCZOS,
    )

    canvas = Image.new("RGBA", (TARGET_SIZE, TARGET_SIZE), (255, 255, 255, 0))
    left = (TARGET_SIZE - resized.width) // 2
    top = (TARGET_SIZE - resized.height) // 2
    canvas.alpha_composite(resized, (left, top))
    return canvas


def product_source_candidates(product: dict, current_src: str) -> list[str]:
    candidates: list[str] = []

    if current_src.startswith("assets/") and "product-media-cutout/" not in current_src:
        candidates.append(current_src)

    for image in product.get("detalleImagenes", []):
        if not isinstance(image, dict):
            continue
        src = image.get("src", "")
        if isinstance(src, str) and src.startswith("assets/product-media/"):
            candidates.append(src)

    if current_src.startswith("assets/product-media-cutout/"):
        cutout_stem = Path(current_src).stem
        original_stem = re.sub(r"^\d{3}-", "", cutout_stem)
        media_dir = PUBLIC_ASSETS / "product-media"
        if media_dir.exists():
            for file_path in media_dir.glob(f"{original_stem}*"):
                if file_path.suffix.lower() in IMAGE_EXTENSIONS:
                    candidates.append(f"assets/product-media/{file_path.name}")

    seen: set[str] = set()
    unique_candidates: list[str] = []
    for src in candidates:
        if src in seen:
            continue
        seen.add(src)
        unique_candidates.append(src)

    return unique_candidates


def convert_image(src: str, index: int, title: str, *, overwrite: bool = False) -> str | None:
    input_path = resolve_public_image(src)
    if not input_path or input_path.suffix.lower() not in IMAGE_EXTENSIONS:
        return None

    output_name = f"{index:03d}-{slugify(title, input_path.stem)}.png"
    public_output = PUBLIC_ASSETS / OUTPUT_REL_DIR / output_name
    data_output = DATA_ASSETS / OUTPUT_REL_DIR / output_name
    public_output.parent.mkdir(parents=True, exist_ok=True)
    data_output.parent.mkdir(parents=True, exist_ok=True)

    if overwrite or not public_output.exists():
        with Image.open(input_path) as source:
            cutout = normalize_cutout(remove_edge_background(source))
            cutout.save(public_output, "PNG", optimize=True)

    for attempt in range(4):
        try:
            shutil.copy2(public_output, data_output)
            break
        except OSError:
            if attempt == 3 and data_output.exists():
                break
            if attempt == 3:
                raise
            time.sleep(0.35)

    return f"assets/{OUTPUT_REL_DIR.as_posix()}/{output_name}"


def main() -> None:
    data = json.loads(CLIENT_JSON.read_text(encoding="utf-8"))
    products = data.get("productos", [])
    converted = 0
    skipped = 0

    for index, product in enumerate(products, start=1):
        src = product.get("imagen", "")
        if not isinstance(src, str):
            skipped += 1
            continue

        new_src = None
        for candidate in product_source_candidates(product, src):
            new_src = convert_image(candidate, index, str(product.get("titulo") or f"producto-{index}"), overwrite=True)
            if new_src:
                break

        if not new_src:
            skipped += 1
            continue

        product["imagen"] = new_src
        converted += 1

    CLIENT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Converted {converted} Nuvia product images to transparent cutouts.")
    print(f"Skipped {skipped} images that were already cutouts or unavailable.")


if __name__ == "__main__":
    main()
