#!/usr/bin/env python3
"""
Hermes Video Lab job manager.

Phase 1 creates approval-first video briefs and stores them as JSON jobs. Video
generation engines such as Higgsfield are intentionally adapters, not the core.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(os.environ.get("HERMES_VIDEO_LAB_ROOT", "/root/.hermes/video-lab"))
JOBS_DIR = ROOT / "jobs"
BRIEFS_DIR = ROOT / "briefs"
OUTPUTS_DIR = ROOT / "outputs"
ARCHIVE_DIR = ROOT / "archive"


VALID_LANES = {"sergio", "onia", "client"}
VALID_STATES = {
    "draft_brief",
    "waiting_approval",
    "approved_for_generation",
    "generating",
    "avatar_review_pending",
    "generated",
    "generated_approved",
    "needs_revision",
    "approved_for_publish",
    "published",
    "failed",
}

CLIENT_PROMPT_PROFILES = {
    "ecommerce_tiendas": {
        "keywords": ["ecommerce", "tienda", "producto", "catalogo", "compra", "delivery", "botella", "termo", "ropa", "zapato"],
        "audience": "compradores locales que necesitan ver el producto en uso antes de pedir disponibilidad",
        "mode": "ugc_unboxing",
        "hook": "No compres esto hasta ver como se usa.",
        "problem": "Una foto no resuelve dudas de tamano, uso, textura o practicidad.",
        "mechanism": "Mostrar el producto en manos reales, close-ups, setup rapido y un uso cotidiano.",
        "proof": "Demostracion visual del producto sin inventar reviews, descuentos ni resultados.",
        "cta": "Pide colores y disponibilidad por WhatsApp.",
        "character": "creator local, tono de amiga/o recomendando algo practico, casual, sin sonar vendedor",
        "setting": "cocina, escritorio, dormitorio ordenado, tienda pequena o gym segun el producto",
        "visual_style": "UGC vertical 9:16, phone-first, manos usando el producto, close-ups claros, cortes cada 2-3 segundos",
        "safe_claims": ["demostracion de uso", "beneficios visibles", "disponibilidad sujeta a confirmacion"],
        "forbidden_claims": ["stock falso", "reviews inventadas", "descuentos no aprobados", "garantias no confirmadas"],
    },
    "restaurantes_cafes": {
        "keywords": ["restaurante", "cafe", "comida", "menu", "plato", "hamburguesa", "pizza", "reserva"],
        "audience": "personas locales que deciden donde comer por antojo visual y facilidad de reserva",
        "mode": "product_showcase",
        "hook": "Si estas buscando donde comer esta semana, mira esto.",
        "problem": "Una foto del menu no siempre provoca suficiente deseo ni lleva a una reserva.",
        "mechanism": "Mostrar plato, preparacion, ambiente y reserva por WhatsApp en una secuencia corta.",
        "proof": "Producto visual real o generico sin decir que es el mejor ni inventar resenas.",
        "cta": "Pide el menu o reserva por WhatsApp.",
        "character": "creator local caminando o sentado en mesa, tono de recomendacion casual",
        "setting": "mesa cerca de ventana, barra de cafe, cocina visible, entrada del local o delivery table",
        "visual_style": "calido, apetitoso, close-ups de comida, movimientos de telefono, cortes rapidos",
        "safe_claims": ["mostrar producto", "promocion aprobada", "reserva simple"],
        "forbidden_claims": ["resenas falsas", "mejor de la ciudad", "descuentos no aprobados"],
    },
    "clinicas_esteticas": {
        "keywords": ["clinica", "estetica", "dermatologia", "dental", "odont", "tratamiento", "consulta", "valoracion"],
        "audience": "personas que quieren consultar un servicio de salud, belleza o estetica con confianza",
        "mode": "ugc_how_to",
        "hook": "Tus consultas no deberian perderse en WhatsApp.",
        "problem": "La gente pregunta, duda y a veces nadie le da seguimiento claro.",
        "mechanism": "Mostrar agenda, recepcion, recordatorio y proceso de consulta sin datos privados.",
        "proof": "Flujo ordenado de atencion; no resultados medicos ni antes/despues falsos.",
        "cta": "Agenda una valoracion por WhatsApp.",
        "character": "presentador/a calmado, confiable, con energia profesional y lenguaje simple",
        "setting": "recepcion limpia, sala de espera, escritorio de agenda, consultorio sin procedimientos",
        "visual_style": "premium, limpio, luz suave, subtitulos sobrios, ritmo tranquilo pero claro",
        "safe_claims": ["proceso de agenda claro", "informacion general", "seguimiento ordenado"],
        "forbidden_claims": ["resultados garantizados", "claims medicos", "testimonios inventados", "antes/despues falso"],
    },
    "inmobiliarias": {
        "keywords": ["inmobiliaria", "propiedad", "casa", "departamento", "alquiler", "venta", "visita"],
        "audience": "interesados que quieren entender una propiedad rapido antes de pedir ficha o visita",
        "mode": "product_showcase",
        "hook": "Una propiedad sin video claro pierde interesados antes de la visita.",
        "problem": "Muchas propiedades se ven iguales y el lead se enfria si no entiende el valor.",
        "mechanism": "Recorrido breve, detalles de espacio, contexto de vida y CTA a ficha/visita.",
        "proof": "Mostrar espacios y beneficios aprobados sin inventar precio, zona exacta o disponibilidad.",
        "cta": "Pide la ficha o agenda una visita.",
        "character": "asesor/a o creador/a mostrando la propiedad con tono practico, no lujo falso",
        "setting": "sala, cocina, balcon, fachada o recorrido de pasillo con buena luz natural",
        "visual_style": "walkthrough vertical, camara fluida, textos cortos, detalles utiles",
        "safe_claims": ["mostrar espacios", "informacion aprobada", "agendar visita"],
        "forbidden_claims": ["precios inventados", "disponibilidad no verificada", "inversion garantizada"],
    },
    "gimnasios_fitness": {
        "keywords": ["gimnasio", "gym", "fitness", "clase", "entrenamiento", "reto"],
        "audience": "personas que quieren empezar a entrenar pero necesitan verlo facil y cercano",
        "mode": "ugc_how_to",
        "hook": "Si quieres empezar esta semana, esto es para ti.",
        "problem": "Ver maquinas no convence; la persona necesita imaginarse empezando sin intimidacion.",
        "mechanism": "Mostrar entrada, entrenador, ejercicio simple, ambiente y clase de prueba.",
        "proof": "Energia realista y bienvenida a principiantes sin prometer transformaciones.",
        "cta": "Escribe prueba para reservar una clase.",
        "character": "creator post-entreno, entrenador/a amable o principiante narrando el primer paso",
        "setting": "recepcion de gym, maquina simple, zona funcional, locker o banco post-entreno",
        "visual_style": "energetico, movimiento ligero, cortes cada 2 segundos, subtitulos grandes",
        "safe_claims": ["invita a probar", "muestra instalaciones", "explica modalidad"],
        "forbidden_claims": ["transformaciones garantizadas", "claims medicos", "testimonios falsos"],
    },
    "saas_software_b2b": {
        "keywords": ["saas", "software", "crm", "dashboard", "sistema", "automatizacion", "gestios", "dentalgest"],
        "audience": "duenos y equipos que necesitan ver un flujo simple antes de pedir una demo",
        "mode": "product_showcase",
        "hook": "Una demo corta puede vender mas que una reunion larga.",
        "problem": "Si el problema no se ve claro, el software parece otra herramienta mas.",
        "mechanism": "Mostrar antes/despues operativo, pantalla sin datos privados y un resultado de flujo.",
        "proof": "Demo del flujo, no metricas inventadas ni logos de clientes sin permiso.",
        "cta": "Pide demo.",
        "character": "operador/fundador explicando en escritorio con laptop y pantalla limpia",
        "setting": "oficina, escritorio con laptop, captura de pantalla mockup, tablero sin datos privados",
        "visual_style": "screen demo + talking hands, claro, sobrio, subtitulos con palabras clave",
        "safe_claims": ["demo del flujo", "beneficio operativo", "caso de uso"],
        "forbidden_claims": ["metricas inventadas", "logos sin permiso", "resultados garantizados"],
    },
}

SERGIO_AVATAR_PROFILES = {
    "black_operator_basic": {
        "label": "Sergio operador/fundador",
        "outfit": "clean all-black outfit: black t-shirt, black pants or dark jeans, dark shoes, no visible logos",
        "persona": "direct founder/operator, serious but human, practical, no guru energy",
        "setting": "real work desk, laptop, phone, soft LED or natural window light, modern Latin American workspace",
        "camera": "vertical 9:16 phone-camera, selfie close-up mixed with medium shot, subtle handheld movement",
        "use_case": "daily founder videos, building-in-public, direct hooks",
    },
    "black_consultant": {
        "label": "Sergio consultor ONIA",
        "outfit": "black t-shirt with black overshirt or lightweight black jacket, professional but approachable",
        "persona": "practical consultant auditing sales operations, calm authority, concise business language",
        "setting": "audit table with laptop, CRM board, WhatsApp workflow mockup and notes, no private data",
        "camera": "vertical 9:16, stable tripod with short punch-in cuts, clean subtitles",
        "use_case": "audits, ONIA consulting, B2B sales, diagnosis videos",
    },
    "black_technical_demo": {
        "label": "Sergio demo tecnica",
        "outfit": "black hoodie or black zip jacket, dark pants, practical technical operator look",
        "persona": "technical operator showing how the system works, fast but clear, focused on mechanism",
        "setting": "screen demo with n8n, Notion, Chatwoot or dashboard mock data, quick cuts to face",
        "camera": "vertical 9:16, screen overlay, face in corner, clean zooms on the key step",
        "use_case": "technical demos, workflows, prompts, automation builds",
    },
    "black_premium_meeting": {
        "label": "Sergio reunion premium",
        "outfit": "black blazer over a black t-shirt, dark pants, clean premium consultant look",
        "persona": "premium strategist, direct and trustworthy, no luxury flex",
        "setting": "quiet meeting room, laptop, proposal notes, clean background, soft cinematic lighting",
        "camera": "vertical 9:16, stable medium shot, controlled push-in, polished but realistic",
        "use_case": "premium offers, client trust, strategic proposals",
    },
}

SERGIO_AVATAR_REFERENCE_PACK = {
    "higgsfield_soul_id": "1238064e-1295-4cbf-9a41-861d4106e0e8",
    "higgsfield_soul_name": "Sergio ONIA 20260604 All Black",
    "higgsfield_soul_type": "soul_2",
    "higgsfield_soul_status": "completed",
    "legacy_higgsfield_soul_ids": ["05cebe09-5672-4d50-90b2-d92c680957f7"],
    "face_reference_assets": [
        "sergio-drive-20260604-img-0331",
        "sergio-drive-20260604-img-0329",
        "sergio-drive-20260604-img-0330",
        "sergio-drive-20260604-drive-15lu5r1ithctr-olgk7qjvroiccdcgvip",
        "sergio-drive-20260604-drive-1ghdj5uhmaen1qnhklkzwi6ndpeljnfk5",
        "sergio-drive-20260604-drive-107w3hsks9bbe9pft-ttwocpak-obufu",
        "sergio-drive-20260604-drive-16t4wblddfa-yei3mpdkt0sm1ahhviqbz",
    ],
    "voice_reference_assets": [
        "sergio-drive-20260602-img-0218-mov",
        "sergio-drive-20260602-img-0217-mov",
        "sergio-drive-20260602-img-0210-mov",
        "sergio-drive-20260602-img-0209-mov",
    ],
    "contact_sheet": "hermes-content/references/sergio-approved-media/processed/sergio_contact_sheet_20260604.jpg",
    "approval_note": (
        "2026-06-04 photos are approved for internal avatar/video draft generation only. "
        "Voice cloning, client use and publication require explicit approval per piece."
    ),
}

SERGIO_AVATAR_SCENES = [
    {
        "id": "avatar_desk_confession",
        "prompt": "Sergio seated at a real desk, laptop open, direct eye contact, one decisive sentence, warm practical tone",
        "best_for": "personal hooks and founder story",
    },
    {
        "id": "avatar_audit_table",
        "prompt": "Sergio reviewing a simple sales audit board, sticky notes, WhatsApp-to-CRM flow with fictional data only",
        "best_for": "ONIA consulting and audits",
    },
    {
        "id": "avatar_screen_operator",
        "prompt": "Sergio beside a screen overlay showing a clean automation workflow, pointing at one key step",
        "best_for": "technical demos and proof of mechanism",
    },
    {
        "id": "avatar_phone_walk",
        "prompt": "Sergio walking slowly with phone-camera selfie, black outfit, natural hallway or urban background",
        "best_for": "direct thoughts and quick lessons",
    },
    {
        "id": "avatar_client_call_prep",
        "prompt": "Sergio preparing for a client call, laptop, notes, CRM checklist, calm confident body language",
        "best_for": "B2B trust and premium consulting",
    },
    {
        "id": "avatar_lipsync_closeup",
        "prompt": "tight talking-avatar close-up, consistent face, natural lip-sync, subtle head movement, readable captions",
        "best_for": "short scripts under 20 seconds",
    },
]


def _detect_client_profile(*values: str) -> tuple[str, dict]:
    text = " ".join(value or "" for value in values).lower()
    for key, profile in CLIENT_PROMPT_PROFILES.items():
        if any(keyword in text for keyword in profile["keywords"]):
            return key, profile
    return "ecommerce_tiendas", CLIENT_PROMPT_PROFILES["ecommerce_tiendas"]


def _client_creative_for(business: str, offer: str, style: str = "") -> dict:
    profile_key, profile = _detect_client_profile(business, offer, style)
    product_or_offer = offer or business or "oferta del negocio"
    hook = profile["hook"]
    script = [
        hook,
        profile["problem"],
        f"Para esta oferta: {product_or_offer}.",
        profile["mechanism"],
        profile["proof"],
        profile["cta"],
    ]
    shot_list = [
        f"0-2s: pattern interrupt visual + hook: {hook}",
        f"2-5s: mostrar el problema: {profile['problem']}",
        f"5-10s: presentar producto/servicio: {product_or_offer}",
        f"10-18s: demo: {profile['mechanism']}",
        f"18-23s: detalle de confianza/proof seguro: {profile['proof']}",
        f"23-27s: una objecion comun resuelta sin claims fuertes",
        f"27-30s: CTA unico: {profile['cta']}",
    ]
    negative_prompt = (
        "No copyrighted logos unless provided. No third-party likeness. No fake testimonials. "
        "No fake results, fake discounts, fake scarcity, private data, placeholder text, "
        "medical/financial/legal guarantees, unreadable subtitles, extra fingers, distorted product, "
        "brand names not supplied by the client."
    )
    higgsfield_prompt = (
        "Create a vertical 9:16 UGC-style ad for a Latin American local business. "
        f"Industry profile: {profile_key}. Business: {business or 'local business'}. "
        f"Offer/product: {product_or_offer}. Target audience: {profile['audience']}. "
        f"Creator/persona: {profile['character']}. Setting: {profile['setting']}. "
        f"Style: {profile['visual_style']}. "
        "Use native phone-camera pacing, believable casual gestures, clear product/service context, "
        "and visual change every 2-3 seconds. "
        "Structure the video as Hook, Problem, Mechanism, Demo, Safe proof/detail, CTA. "
        f"Hook line: \"{hook}\". CTA line: \"{profile['cta']}\". "
        f"Script beats: {' | '.join(script)}. "
        f"Negative prompt: {negative_prompt}"
    )
    caption = f"{hook}\n\n{product_or_offer}\n\n{profile['cta']}"
    return {
        "audience": profile["audience"],
        "hook": hook,
        "script": script,
        "shot_list": shot_list,
        "visual_style": profile["visual_style"],
        "higgsfield_prompt": higgsfield_prompt,
        "caption": caption,
        "prompt_profile": profile_key,
        "higgsfield_params": {
            "job_set_type": "marketing_studio_video",
            "aspect_ratio": "9:16",
            "duration": 15,
            "mode": profile["mode"],
            "resolution": "720p",
            "generate_audio": False,
        },
        "character_profile": profile["character"],
        "setting_profile": profile["setting"],
        "prompt_formula": "Hook -> Problem -> Mechanism -> Demo -> Safe proof/detail -> CTA",
        "safe_claims": profile["safe_claims"],
        "forbidden_claims": profile["forbidden_claims"],
        "negative_prompt": negative_prompt,
        "platform_copy": {
            "instagram_caption": caption,
            "tiktok_description": f"{hook} {profile['cta']} #ugc #negociolocal #onia",
            "youtube_title": hook[:70],
            "youtube_description": f"Video UGC para {business or 'negocio local'}: {product_or_offer}. CTA: {profile['cta']}",
            "youtube_tags": ["ugc", "negocio local", "video vertical", profile_key, "onia"],
            "linkedin_copy": f"Ejemplo ONIA: convertir una oferta en un video UGC con demo visual, claims seguros y CTA unico. Perfil: {profile_key}.",
        },
    }


def _detect_avatar_profile(variant: str) -> tuple[str, dict]:
    key = _slug(variant or "").replace("-", "_")
    aliases = {
        "operator": "black_operator_basic",
        "operador": "black_operator_basic",
        "basic": "black_operator_basic",
        "consultor": "black_consultant",
        "consultant": "black_consultant",
        "demo": "black_technical_demo",
        "tecnico": "black_technical_demo",
        "technical": "black_technical_demo",
        "premium": "black_premium_meeting",
        "meeting": "black_premium_meeting",
    }
    key = aliases.get(key, key)
    if key not in SERGIO_AVATAR_PROFILES:
        key = "black_operator_basic"
    return key, SERGIO_AVATAR_PROFILES[key]


def _avatar_hook_for(topic: str) -> str:
    lowered = topic.lower()
    if "16" in lowered or "anos" in lowered or "años" in lowered:
        return "Tengo 16 anos y estoy construyendo ONIA como un sistema real, no como una agencia generica."
    if "onia" in lowered and ("agencia" in lowered or "sistema" in lowered):
        return "ONIA no nace para parecer una agencia mas; nace para operar sistemas reales."
    if "cliente" in lowered or "venta" in lowered or "whatsapp" in lowered:
        return "Si un lead entra y nadie lo sigue, la venta se pierde antes de empezar."
    return f"Estoy convirtiendo esto en contenido real: {topic}."


def _sergio_avatar_creative_for(topic: str, variant: str = "") -> dict:
    profile_key, profile = _detect_avatar_profile(variant)
    hook = _avatar_hook_for(topic)
    scenes = SERGIO_AVATAR_SCENES
    script = [
        hook,
        "No quiero vender humo: quiero mostrar el proceso, el sistema y las decisiones reales.",
        f"El tema de este video es: {topic}.",
        "Primero lo explico simple, despues muestro el mecanismo y cierro con una accion concreta.",
        "Si quieres que lo convierta en un sistema para tu negocio, escribeme 'sistema'.",
    ]
    shot_list = [
        f"0-2s: talking-avatar close-up con hook: {hook}",
        "2-6s: corte a escritorio real, laptop y notas, contexto sin exagerar",
        "6-12s: pantalla o pizarra con el mecanismo principal usando datos ficticios",
        "12-20s: Sergio explica el antes/despues operativo con tono directo",
        "20-27s: escena de accion: revisar CRM, workflow o brief de cliente",
        "27-30s: CTA unico y subtitulo grande",
    ]
    negative_prompt = (
        "No celebrity likeness, no copied creator identity, no changing Sergio's identity, "
        "no older-age transformation, no sexualized styling, no logos unless provided, "
        "no private screens, no real phone numbers, no fake client results, no fake revenue claims, "
        "no exaggerated guru gestures, no distorted face, no extra fingers, no broken lip-sync, "
        "no voice clone or publication unless explicitly approved."
    )
    prompt_formula = (
        "Identity reference pack -> stable Sergio avatar -> all-black outfit -> scene and camera -> "
        "micro-movement -> Spanish script/lip-sync -> subtitles -> safe claims -> negative prompt"
    )
    scene_prompt = " | ".join(scene["prompt"] for scene in scenes[:4])
    higgsfield_prompt = (
        "Create a realistic vertical 9:16 talking-avatar / UGC creator video of Sergio for ONIA. "
        "Use Sergio's approved private reference pack to preserve identity consistently across shots: "
        "same face structure, short dark hair, natural expression, direct eye contact, slim young founder/operator presence. "
        f"Avatar profile: {profile['label']}. Outfit: {profile['outfit']}. "
        f"Persona: {profile['persona']}. Setting: {profile['setting']}. Camera: {profile['camera']}. "
        "The video must feel like a real phone-camera creator clip, not a glossy stock ad. "
        f"Topic: {topic}. Hook line in Spanish: \"{hook}\". "
        "Use natural Spanish delivery, small pauses, subtle hand movement, believable breathing, readable captions, "
        "and visual change every 2-3 seconds. "
        f"Scene options: {scene_prompt}. "
        f"Script beats: {' | '.join(script)}. "
        f"Negative prompt: {negative_prompt}"
    )
    caption = f"{hook}\n\n{topic}\n\nEscribeme 'sistema' si quieres que revise tu proceso."
    return {
        "audience": "fundadores, negocios y clientes potenciales que necesitan confiar en Sergio y entender ONIA",
        "hook": hook,
        "script": script,
        "shot_list": shot_list,
        "visual_style": "realistic talking-avatar UGC, creator-led, all-black Sergio identity, phone-first vertical video",
        "higgsfield_prompt": higgsfield_prompt,
        "caption": caption,
        "prompt_profile": "sergio_avatar",
        "avatar_profile": profile_key,
        "avatar_mode": "sergio_private_reference",
        "identity_reference_pack": SERGIO_AVATAR_REFERENCE_PACK,
        "scene_pack": scenes,
        "higgsfield_params": {
            "job_set_type": "talking_avatar_lipsync_ugc",
            "aspect_ratio": "9:16",
            "duration": 30,
            "mode": "talking_avatar",
            "secondary_modes": ["lipsync", "ugc_marketing", "ai_influencer_consistency"],
            "resolution": "720p",
            "generate_audio": False,
            "requires_reference_assets": True,
            "requires_sergio_asset_generation_approval": True,
        },
        "character_profile": profile["persona"],
        "setting_profile": profile["setting"],
        "outfit_profile": profile["outfit"],
        "prompt_formula": prompt_formula,
        "safe_claims": [
            "building in public",
            "process explanation",
            "consulting offer",
            "workflow demonstration with fictional data",
        ],
        "forbidden_claims": [
            "fake revenue",
            "fake client results",
            "guaranteed outcomes",
            "unapproved voice clone",
            "publication without review",
        ],
        "negative_prompt": negative_prompt,
        "platform_copy": {
            "instagram_caption": caption,
            "tiktok_description": f"{hook} #onia #automatizacion #ia #founder #videolab",
            "youtube_title": hook[:70],
            "youtube_description": f"Video avatar de Sergio para ONIA. Tema: {topic}. CTA: escribeme 'sistema'.",
            "youtube_tags": ["ONIA", "Sergio", "automatizacion", "IA", "avatar", "Higgsfield"],
            "linkedin_copy": (
                "Estoy documentando la construccion de ONIA como sistema operativo de ventas, automatizacion "
                f"y contenido. Tema del video: {topic}."
            ),
        },
        "approval_requirements": {
            "brief": "Aprobar video <job_id>",
            "face_generation": "requires explicit Sergio approval before rendering",
            "voice_clone": "blocked until explicit voice-clone approval",
            "publication": "Publicar video <job_id>",
        },
    }


def _ensure_dirs() -> None:
    for path in (ROOT, JOBS_DIR, BRIEFS_DIR, OUTPUTS_DIR, ARCHIVE_DIR):
        path.mkdir(parents=True, exist_ok=True)


def _slug(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")
    return value[:40] or "video"


def _job_id(lane: str, topic: str) -> str:
    return f"vl-{time.strftime('%Y%m%d-%H%M%S')}-{lane}-{_slug(topic)}"


def _job_path(job_id: str) -> Path:
    if not re.fullmatch(r"[a-zA-Z0-9_.-]+", job_id):
        raise RuntimeError("invalid job_id")
    return JOBS_DIR / f"{job_id}.json"


def _read_json(path: Path) -> dict:
    return json.loads(path.read_text("utf-8"))


def _write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", "utf-8")


def _load_job(job_id: str) -> dict:
    path = _job_path(job_id)
    if not path.exists():
        raise RuntimeError(f"job not found: {job_id}")
    return _read_json(path)


def _save_job(job: dict) -> None:
    job["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    _write_json(_job_path(job["job_id"]), job)


def _lane_defaults(lane: str) -> dict:
    if lane == "sergio":
        return {
            "audience": "fundadores, emprendedores y personas siguiendo la construccion de ONIA",
            "tone": "informal, directo, real, founder-to-founder",
            "style": "talking head, screen recording, workspace, building in public",
            "cta": "Si quieres que te muestre el flujo, escribeme 'sistema'.",
        }
    if lane == "onia":
        return {
            "audience": "negocios y pymes que quieren automatizar ventas y seguimiento",
            "tone": "claro, educativo, consultivo, sin hype",
            "style": "workflow demo, dashboard, antes/despues, B-roll conceptual",
            "cta": "Escribenos para auditar tu proceso de leads.",
        }
    return {
        "audience": "clientes potenciales del negocio indicado",
        "tone": "comercial, claro, confiable, adaptado al nicho",
        "style": "video publicitario corto con beneficio claro",
        "cta": "Agenda o escribe para mas informacion.",
    }


def _script_for(lane: str, topic: str, objective: str, audience: str) -> dict:
    defaults = _lane_defaults(lane)
    hook_map = {
        "sergio": f"Estoy construyendo esto en ONIA: {topic}.",
        "onia": f"Tu negocio puede perder ventas por no tener este sistema: {topic}.",
        "client": f"Si tienes este problema, este video vende la solucion: {topic}.",
    }
    hook = hook_map[lane]
    shot_list = [
        "0-2s: hook visual y texto grande en pantalla",
        "2-6s: contexto concreto del problema",
        "6-14s: mostrar proceso, pantalla, escena o antes/despues",
        "14-22s: beneficio principal y prueba visual",
        "22-30s: CTA simple",
    ]
    script = [
        hook,
        f"El objetivo no es hacerlo mas complicado, es lograr {objective}.",
        f"Para {audience}, la clave es que el proceso se vea claro y accionable.",
        defaults["cta"],
    ]
    higgsfield_prompt = (
        f"Vertical 9:16 social video, {defaults['style']}. Topic: {topic}. "
        f"Objective: {objective}. Audience: {audience}. Tone: {defaults['tone']}. "
        "Modern, premium, human, high retention first 2 seconds, clean subtitles, "
        "no copied logos, no third-party likeness, original visuals."
    )
    caption = f"{topic}\n\n{defaults['cta']}"
    return {
        "hook": hook,
        "script": script,
        "shot_list": shot_list,
        "visual_style": defaults["style"],
        "higgsfield_prompt": higgsfield_prompt,
        "caption": caption,
    }


def create_brief(args: argparse.Namespace) -> dict:
    _ensure_dirs()
    lane = args.lane.lower()
    if lane not in VALID_LANES:
        raise RuntimeError(f"lane must be one of: {', '.join(sorted(VALID_LANES))}")
    defaults = _lane_defaults(lane)
    job_id = _job_id(lane, args.topic)
    if lane == "client" and (args.business or args.offer):
        creative = _client_creative_for(args.business, args.offer, args.style)
        audience = args.audience or creative.get("audience") or defaults["audience"]
    else:
        audience = args.audience or defaults["audience"]
        creative = _script_for(lane, args.topic, args.objective, audience)
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    job = {
        "ok": True,
        "job_id": job_id,
        "lane": lane,
        "topic": args.topic,
        "objective": args.objective,
        "audience": audience,
        "business": args.business,
        "offer": args.offer,
        "style": args.style or creative["visual_style"],
        "model_recommendation": args.model or "higgsfield",
        "approval_state": "waiting_approval",
        "state": "waiting_approval",
        "created_at": now,
        "updated_at": now,
        "published_id": None,
        "video_url": None,
        "error": None,
        "next_action": "approve_brief",
        **creative,
    }
    _save_job(job)
    _write_json(BRIEFS_DIR / f"{job_id}.json", job)
    return job


def create_avatar(args: argparse.Namespace) -> dict:
    _ensure_dirs()
    topic = args.topic.strip()
    if not topic:
        raise RuntimeError("topic is required for Sergio avatar")
    creative = _sergio_avatar_creative_for(topic, args.variant)
    job_id = _job_id("sergio", f"avatar-{topic}")
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    job = {
        "ok": True,
        "job_id": job_id,
        "lane": "sergio",
        "topic": topic,
        "objective": args.objective or "crear avatar consistente de Sergio para contenido ONIA",
        "audience": args.audience or creative["audience"],
        "business": "",
        "offer": "Sergio / ONIA avatar",
        "style": creative["visual_style"],
        "model_recommendation": args.model or "higgsfield",
        "approval_state": "waiting_approval",
        "state": "waiting_approval",
        "created_at": now,
        "updated_at": now,
        "published_id": None,
        "video_url": None,
        "error": None,
        "next_action": "approve_brief",
        **creative,
    }
    _save_job(job)
    _write_json(BRIEFS_DIR / f"{job_id}.json", job)
    return job


def status(args: argparse.Namespace) -> dict:
    _ensure_dirs()
    if args.job_id:
        return {"ok": True, "job": _load_job(args.job_id)}
    jobs = []
    for path in sorted(JOBS_DIR.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True):
        job = _read_json(path)
        jobs.append(
            {
                "job_id": job.get("job_id"),
                "lane": job.get("lane"),
                "topic": job.get("topic"),
                "state": job.get("state"),
                "next_action": job.get("next_action"),
                "updated_at": job.get("updated_at"),
            }
        )
        if len(jobs) >= args.limit:
            break
    return {"ok": True, "jobs": jobs}


def next_jobs(args: argparse.Namespace) -> dict:
    _ensure_dirs()
    actionable_states = {
        "waiting_approval",
        "approved_for_generation",
        "generated",
        "needs_revision",
        "approved_for_publish",
        "failed",
    }
    jobs = []
    for path in sorted(JOBS_DIR.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True):
        job = _read_json(path)
        if job.get("state") not in actionable_states:
            continue
        jobs.append(
            {
                "job_id": job.get("job_id"),
                "lane": job.get("lane"),
                "topic": job.get("topic"),
                "state": job.get("state"),
                "next_action": job.get("next_action"),
                "command": _suggest_command(job),
                "updated_at": job.get("updated_at"),
            }
        )
        if len(jobs) >= args.limit:
            break
    return {"ok": True, "jobs": jobs, "telegram_reply": _format_next_jobs(jobs)}


def archive(args: argparse.Namespace) -> dict:
    _ensure_dirs()
    job = _load_job(args.job_id)
    job["archived_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    if args.note:
        job.setdefault("notes", []).append(args.note)
    _save_job(job)
    src = _job_path(args.job_id)
    dst = ARCHIVE_DIR / src.name
    if dst.exists():
        dst.unlink()
    src.replace(dst)
    brief = BRIEFS_DIR / src.name
    if brief.exists():
        brief_dst = ARCHIVE_DIR / f"brief-{src.name}"
        if brief_dst.exists():
            brief_dst.unlink()
        brief.replace(brief_dst)
    return {"ok": True, "archived_job_id": args.job_id, "archive_path": str(dst)}


def set_state(args: argparse.Namespace, state: str, next_action: str) -> dict:
    _ensure_dirs()
    job = _load_job(args.job_id)
    if state not in VALID_STATES:
        raise RuntimeError(f"invalid state: {state}")
    job["state"] = state
    job["approval_state"] = state
    job["next_action"] = next_action
    if getattr(args, "note", ""):
        job.setdefault("notes", []).append(args.note)
    _save_job(job)
    return {"ok": True, "job": job}


def _is_placeholder_url(url: str) -> bool:
    lowered = url.strip().lower()
    return any(
        token in lowered
        for token in (
            "<url",
            "url_del_video",
            "example.com",
            "placeholder",
            "localhost",
            "127.0.0.1",
        )
    )


def _video_extension_ok(url: str) -> bool:
    path = urlparse(url).path.lower()
    return path.endswith((".mp4", ".mov", ".webm", ".m4v"))


def _requires_sergio_identity_qa(job: dict) -> bool:
    return job.get("lane") == "sergio" and bool(job.get("avatar_mode") or job.get("identity_reference_pack"))


def _identity_checks_ok(job: dict) -> bool:
    checks = job.get("quality_checks") or {}
    return bool(checks.get("identity_ok") and checks.get("source_verified"))


def mark_generated(args: argparse.Namespace) -> dict:
    _ensure_dirs()
    job = _load_job(args.job_id)
    allowed_states = {"approved_for_generation", "generating", "avatar_review_pending", "generated"}
    if job.get("state") not in allowed_states:
        raise RuntimeError(
            "job must be approved_for_generation or generating before accepting generated media"
        )
    if not args.video_url.startswith(("http://", "https://")):
        raise RuntimeError("video_url must be public http(s)")
    if _is_placeholder_url(args.video_url):
        raise RuntimeError("video_url looks like a placeholder or local URL")
    if not _video_extension_ok(args.video_url):
        raise RuntimeError("video_url must point to a video file (.mp4, .mov, .webm or .m4v)")

    generation = {
        "source": args.source,
        "higgsfield_job_id": args.higgsfield_job_id,
        "model": args.model,
        "soul_id": args.soul_id,
        "identity_source": args.identity_source,
        "reference_asset": args.reference_asset,
        "asset_type": args.asset_type,
        "recorded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    if args.credits_used is not None:
        generation["credits_used"] = args.credits_used

    if _requires_sergio_identity_qa(job):
        approved_soul_ids = {
            SERGIO_AVATAR_REFERENCE_PACK["higgsfield_soul_id"],
            *SERGIO_AVATAR_REFERENCE_PACK.get("legacy_higgsfield_soul_ids", []),
        }
        if args.source != "higgsfield":
            raise RuntimeError("Sergio avatar jobs require --source higgsfield")
        if args.identity_source == "soul_id" and args.soul_id not in approved_soul_ids:
            raise RuntimeError("Sergio avatar jobs require the approved Sergio Soul ID")
        if args.identity_source == "reference_image" and not args.reference_asset:
            raise RuntimeError("Sergio avatar reference-image jobs require --reference-asset")
        if args.identity_source == "mixed":
            if args.soul_id not in approved_soul_ids or not args.reference_asset:
                raise RuntimeError("mixed identity jobs require approved Soul ID and --reference-asset")
        job.setdefault("quality_checks", {})
        job["quality_checks"].update(
            {
                "source_verified": True,
                "identity_ok": bool(args.identity_ok),
                "identity_source": args.identity_source,
                "reference_asset": args.reference_asset,
                "review_notes": args.review_note or "",
                "reviewed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                if args.identity_ok
                else "",
            }
        )
        next_state = "generated" if args.identity_ok else "avatar_review_pending"
        next_action = "approve_publish" if args.identity_ok else "review_avatar_identity"
    else:
        next_state = "generated"
        next_action = "approve_publish"

    job["video_url"] = args.video_url
    job["generation"] = generation
    job["state"] = next_state
    job["approval_state"] = next_state
    job["next_action"] = next_action
    if args.note:
        job.setdefault("notes", []).append(args.note)
    _save_job(job)
    return {"ok": True, "job": job}


def approve_for_publish(args: argparse.Namespace) -> dict:
    _ensure_dirs()
    job = _load_job(args.job_id)
    if job.get("state") != "generated":
        raise RuntimeError("job must be generated before approve_publish")
    if _requires_sergio_identity_qa(job) and not _identity_checks_ok(job):
        raise RuntimeError("Sergio avatar jobs require approved identity QA before publishing")
    job["state"] = "approved_for_publish"
    job["approval_state"] = "approved_for_publish"
    job["next_action"] = "publish_reel"
    if getattr(args, "note", ""):
        job.setdefault("notes", []).append(args.note)
    _save_job(job)
    return {"ok": True, "job": job}


def publish(args: argparse.Namespace) -> dict:
    _ensure_dirs()
    job = _load_job(args.job_id)
    if job.get("state") != "approved_for_publish":
        raise RuntimeError("job must be approved_for_publish before publishing")
    if _requires_sergio_identity_qa(job) and not _identity_checks_ok(job):
        raise RuntimeError("Sergio avatar jobs require approved identity QA before publishing")
    if not job.get("video_url"):
        raise RuntimeError("job has no video_url")
    cmd = [
        "ig-publish",
        "reel_publish",
        "--video-url",
        job["video_url"],
        "--caption",
        args.caption or job.get("caption") or "",
    ]
    proc = subprocess.run(cmd, text=True, capture_output=True, check=False)
    if proc.returncode != 0:
        job["state"] = "failed"
        job["approval_state"] = "failed"
        job["error"] = proc.stderr.strip() or proc.stdout.strip()
        job["next_action"] = "request_revision"
        _save_job(job)
        raise RuntimeError(job["error"])
    try:
        result = json.loads(proc.stdout)
    except json.JSONDecodeError:
        result = {"raw": proc.stdout.strip()}
    if not result.get("ok"):
        job["state"] = "failed"
        job["approval_state"] = "failed"
        job["error"] = result
        job["next_action"] = "request_revision"
        _save_job(job)
        return {"ok": False, "job": job, "publish_result": result}
    job["state"] = "published"
    job["approval_state"] = "published"
    job["published_id"] = result.get("published_id") or result.get("id")
    job["publish_result"] = result
    job["next_action"] = "done"
    _save_job(job)
    return {"ok": True, "job": job, "publish_result": result}


def _split_parts(value: str) -> list[str]:
    return [part.strip() for part in value.split("|") if part.strip()]


def _namespace() -> argparse.Namespace:
    return argparse.Namespace(
        lane="",
        topic="",
        objective="generar confianza y demanda",
        audience="",
        business="",
        offer="",
        style="",
        variant="",
        model="higgsfield",
        job_id="",
        limit=10,
        note="",
        video_url="",
        caption="",
    )


def _summary_for_job(job: dict) -> str:
    command = _suggest_command(job)
    lines = [
        f"Job: {job.get('job_id')}",
        f"Linea: {job.get('lane')} | Estado: {job.get('state')}",
        f"Siguiente: {job.get('next_action')}",
        f"Hook: {job.get('hook')}",
    ]
    if job.get("avatar_mode"):
        lines.append(f"Avatar: {job.get('avatar_profile')} | Modo: {job.get('avatar_mode')}")
    if command:
        lines.append(f"Comando: {command}")
    return "\n".join(lines)


def _suggest_command(job: dict) -> str:
    job_id = job.get("job_id", "")
    state = job.get("state")
    if state == "waiting_approval":
        return f"Aprobar video {job_id}"
    if state == "approved_for_generation":
        return f"Renderizar en Higgsfield con el prompt del job y luego: Video generado {job_id}: <url_video>"
    if state == "generated":
        return f"Publicar video {job_id}"
    if state == "needs_revision":
        return f"Rehacer video {job_id}: <cambio>"
    if state == "approved_for_publish":
        return f"Publicar video {job_id}"
    if state == "failed":
        return f"Rehacer video {job_id}: corregir error"
    return ""


def _format_next_jobs(jobs: list[dict]) -> str:
    if not jobs:
        return "Video Lab: no hay jobs accionables."
    lines = ["Video Lab - siguientes acciones:"]
    for job in jobs:
        lines.extend(
            [
                f"- {job['job_id']}",
                f"  {job['lane']} | {job['state']} | {job['topic']}",
                f"  Comando: {job['command']}",
            ]
        )
    return "\n".join(lines)


def _format_status(result: dict) -> str:
    jobs = result.get("jobs", [])
    if not jobs:
        return "Video Lab: sin jobs recientes."
    lines = ["Video Lab - estado reciente:"]
    for job in jobs[:5]:
        command = _suggest_command(job)
        lines.append(f"- {job.get('job_id')} | {job.get('state')} | {job.get('topic')}")
        if command:
            lines.append(f"  Comando: {command}")
    return "\n".join(lines)


def _legacy_summary_for_job(job: dict) -> str:
    return "\n".join(
        [
            f"Job: {job.get('job_id')}",
            f"Linea: {job.get('lane')}",
            f"Estado: {job.get('state')}",
            f"Siguiente accion: {job.get('next_action')}",
            f"Hook: {job.get('hook')}",
            f"Caption: {job.get('caption')}",
        ]
    )


def telegram(args: argparse.Namespace) -> dict:
    message = args.message.strip()
    normalized = re.sub(r"\s+", " ", message, flags=re.UNICODE)
    lower = normalized.lower()

    if lower.startswith("crea avatar sergio:") or lower.startswith("avatar sergio:"):
        raw = normalized.split(":", 1)[1].strip()
        parts = _split_parts(raw)
        if not parts:
            raise RuntimeError("missing topic after 'Crea avatar Sergio:'")
        ns = _namespace()
        ns.topic = parts[0]
        ns.variant = parts[1] if len(parts) > 1 else "black_operator_basic"
        ns.objective = "crear avatar consistente de Sergio para contenido ONIA"
        result = create_avatar(ns)
        return {"ok": True, "action": "create_avatar", "telegram_reply": _summary_for_job(result), "job": result}

    if lower.startswith("genera video sergio:"):
        ns = _namespace()
        ns.lane = "sergio"
        ns.topic = normalized.split(":", 1)[1].strip()
        if not ns.topic:
            raise RuntimeError("missing topic after 'Genera video Sergio:'")
        result = create_brief(ns)
        return {"ok": True, "action": "create_brief", "telegram_reply": _summary_for_job(result), "job": result}

    if lower.startswith("genera reel onia:"):
        parts = _split_parts(normalized.split(":", 1)[1])
        if not parts:
            raise RuntimeError("missing topic after 'Genera Reel ONIA:'")
        ns = _namespace()
        ns.lane = "onia"
        ns.topic = parts[0]
        if len(parts) > 1:
            ns.objective = parts[1]
        result = create_brief(ns)
        return {"ok": True, "action": "create_brief", "telegram_reply": _summary_for_job(result), "job": result}

    if lower.startswith("crea video cliente:"):
        parts = _split_parts(normalized.split(":", 1)[1])
        if len(parts) < 2:
            raise RuntimeError("use: Crea video cliente: <negocio> | <oferta> | <estilo>")
        ns = _namespace()
        ns.lane = "client"
        ns.business = parts[0]
        ns.offer = parts[1]
        ns.style = parts[2] if len(parts) > 2 else "premium"
        ns.topic = f"{ns.business}: {ns.offer}"
        ns.objective = f"promocionar {ns.offer}"
        result = create_brief(ns)
        return {"ok": True, "action": "create_brief", "telegram_reply": _summary_for_job(result), "job": result}

    if lower.startswith("estado video lab"):
        parts = normalized.split()
        ns = _namespace()
        if len(parts) >= 4:
            ns.job_id = parts[-1]
        result = status(ns)
        reply = _summary_for_job(result["job"]) if ns.job_id else _format_status(result)
        return {"ok": True, "action": "status", "telegram_reply": reply, **result}

    if lower.startswith("siguiente video lab") or lower.startswith("next video lab"):
        ns = _namespace()
        result = next_jobs(ns)
        return {"ok": True, "action": "next", **result}

    match = re.match(r"^aprobar video\s+([a-zA-Z0-9_.-]+)$", normalized, flags=re.IGNORECASE)
    if match:
        ns = _namespace()
        ns.job_id = match.group(1)
        ns.note = "aprobado desde Telegram"
        result = set_state(ns, "approved_for_generation", "generate_video")
        return {"ok": True, "action": "approve", "telegram_reply": _summary_for_job(result["job"]), **result}

    match = re.match(r"^rehacer video\s+([a-zA-Z0-9_.-]+)\s*:\s*(.+)$", normalized, flags=re.IGNORECASE)
    if match:
        ns = _namespace()
        ns.job_id = match.group(1)
        ns.note = match.group(2).strip()
        result = set_state(ns, "needs_revision", "request_revision")
        return {"ok": True, "action": "request_revision", "telegram_reply": _summary_for_job(result["job"]), **result}

    match = re.match(r"^video generado\s+([a-zA-Z0-9_.-]+)\s*:\s*(https?://\S+)$", normalized, flags=re.IGNORECASE)
    if match:
        ns = _namespace()
        ns.job_id = match.group(1)
        ns.video_url = match.group(2)
        ns.note = "video_url recibido desde Telegram"
        ns.source = "manual"
        ns.higgsfield_job_id = ""
        ns.model = ""
        ns.soul_id = ""
        ns.identity_source = "soul_id"
        ns.reference_asset = ""
        ns.asset_type = "video"
        ns.credits_used = None
        ns.identity_ok = False
        ns.review_note = ""
        result = mark_generated(ns)
        return {"ok": True, "action": "mark_generated", "telegram_reply": _summary_for_job(result["job"]), **result}

    match = re.match(r"^publicar video\s+([a-zA-Z0-9_.-]+)$", normalized, flags=re.IGNORECASE)
    if match:
        ns = _namespace()
        ns.job_id = match.group(1)
        ns.note = "publicacion aprobada desde Telegram"
        approve_for_publish(ns)
        result = publish(ns)
        return {"ok": True, "action": "publish", "telegram_reply": _summary_for_job(result["job"]), **result}

    match = re.match(r"^archivar video\s+([a-zA-Z0-9_.-]+)$", normalized, flags=re.IGNORECASE)
    if match:
        ns = _namespace()
        ns.job_id = match.group(1)
        ns.note = "archivado desde Telegram"
        result = archive(ns)
        return {
            "ok": True,
            "action": "archive",
            "telegram_reply": f"Archivado: {result['archived_job_id']}",
            **result,
        }

    return {
        "ok": False,
        "error": "unsupported Telegram command",
        "supported_commands": [
            "Crea avatar Sergio: <objetivo> | <variante>",
            "Genera video Sergio: <idea>",
            "Genera Reel ONIA: <tema> | <objetivo>",
            "Crea video cliente: <negocio> | <oferta> | <estilo>",
            "Estado Video Lab [job_id]",
            "Aprobar video <job_id>",
            "Rehacer video <job_id>: <cambio>",
            "Video generado <job_id>: <url_video>",
            "Publicar video <job_id>",
            "Siguiente Video Lab",
            "Archivar video <job_id>",
        ],
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="video-lab")
    sub = parser.add_subparsers(dest="cmd", required=True)

    create = sub.add_parser("create_brief")
    create.add_argument("--lane", required=True, choices=sorted(VALID_LANES))
    create.add_argument("--topic", required=True)
    create.add_argument("--objective", default="generar confianza y demanda")
    create.add_argument("--audience", default="")
    create.add_argument("--business", default="")
    create.add_argument("--offer", default="")
    create.add_argument("--style", default="")
    create.add_argument("--model", default="higgsfield")
    create.set_defaults(func=create_brief)

    avatar = sub.add_parser("create_avatar")
    avatar.add_argument("--topic", required=True)
    avatar.add_argument("--variant", default="black_operator_basic")
    avatar.add_argument("--objective", default="crear avatar consistente de Sergio para contenido ONIA")
    avatar.add_argument("--audience", default="")
    avatar.add_argument("--model", default="higgsfield")
    avatar.set_defaults(func=create_avatar)

    st = sub.add_parser("status")
    st.add_argument("--job-id", default="")
    st.add_argument("--limit", type=int, default=10)
    st.set_defaults(func=status)

    nxt = sub.add_parser("next")
    nxt.add_argument("--limit", type=int, default=10)
    nxt.set_defaults(func=next_jobs)

    arc = sub.add_parser("archive")
    arc.add_argument("job_id")
    arc.add_argument("--note", default="")
    arc.set_defaults(func=archive)

    approve = sub.add_parser("approve")
    approve.add_argument("job_id")
    approve.add_argument("--note", default="")
    approve.set_defaults(func=lambda args: set_state(args, "approved_for_generation", "generate_video"))

    revise = sub.add_parser("request_revision")
    revise.add_argument("job_id")
    revise.add_argument("--note", default="")
    revise.set_defaults(func=lambda args: set_state(args, "needs_revision", "request_revision"))

    gen = sub.add_parser("mark_generated")
    gen.add_argument("job_id")
    gen.add_argument("--video-url", required=True)
    gen.add_argument("--note", default="")
    gen.add_argument("--source", default="manual", choices=["manual", "higgsfield", "asset_server", "other"])
    gen.add_argument("--higgsfield-job-id", default="")
    gen.add_argument("--model", default="")
    gen.add_argument("--soul-id", default="")
    gen.add_argument("--identity-source", default="soul_id", choices=["soul_id", "reference_image", "mixed"])
    gen.add_argument("--reference-asset", default="")
    gen.add_argument("--asset-type", default="video")
    gen.add_argument("--credits-used", type=float, default=None)
    gen.add_argument("--identity-ok", action="store_true")
    gen.add_argument("--review-note", default="")
    gen.set_defaults(func=mark_generated)

    approve_pub = sub.add_parser("approve_publish")
    approve_pub.add_argument("job_id")
    approve_pub.add_argument("--note", default="")
    approve_pub.set_defaults(func=approve_for_publish)

    pub = sub.add_parser("publish")
    pub.add_argument("job_id")
    pub.add_argument("--caption", default="")
    pub.set_defaults(func=publish)

    tg = sub.add_parser("telegram")
    tg.add_argument("--message", required=True)
    tg.set_defaults(func=telegram)

    return parser


def main(argv: list[str]) -> int:
    args = build_parser().parse_args(argv)
    result = args.func(args)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(2)
