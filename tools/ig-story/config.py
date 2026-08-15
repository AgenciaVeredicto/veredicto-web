"""
config.py — Configuración central del generador de Instagram Story.

Todo lo ajustable vive acá: URL objetivo, objetivos de privacidad (selectores +
regex de texto), línea de tiempo, textos en pantalla, colores, tipografía,
márgenes seguros y parámetros de export.

Cambiar el markup del sitio NO debería obligar a tocar el resto del código:
se ajusta acá y el resto lo consume.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

# ---------------------------------------------------------------------------
# Rutas
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent
RAW_DIR = ROOT / "build" / "raw"          # capturas crudas de Fase 1
WORK_DIR = ROOT / "build" / "work"        # intermedios de Fase 2
QA_DIR = ROOT / "build" / "qa"            # frames de QA
OUT_DIR = ROOT / "output"                 # entregable final
FONT_DIR = ROOT / "assets" / "fonts"

# ---------------------------------------------------------------------------
# Datos del sitio y objetivos de privacidad — SE CARGAN DE UN ARCHIVO LOCAL
# ---------------------------------------------------------------------------
# IMPORTANTE: ningún dato personal/identificable vive en este archivo (que va a
# git). Todo eso (dominio, nombre, matrícula, teléfono, dirección, reseñadores)
# se lee de `pii_targets.local.json`, que está gitignored y NO se publica.
#
# Primer uso:  cp pii_targets.example.json pii_targets.local.json
#              # y completá tus datos reales en el .local.json
#
# Si no existe el .local.json se usa el .example.json (placeholders). Como los
# placeholders NO matchean ningún sitio real, la Fase 1 aborta por fail-loud
# (patrón requerido ausente), evitando correr con una config incompleta.
import json as _json

def _load_pii() -> dict:
    local = ROOT / "pii_targets.local.json"
    example = ROOT / "pii_targets.example.json"
    path = local if local.exists() else example
    data = _json.loads(path.read_text(encoding="utf-8"))
    data["_source"] = path.name
    data["_is_example"] = (path == example)
    return data

PII = _load_pii()

TARGET_URL = PII["target_url"]

# ---------------------------------------------------------------------------
# Captura (Fase 1) — emulación mobile en alta densidad
# ---------------------------------------------------------------------------
# Viewport CSS (mobile). El device_scale_factor multiplica la densidad de píxeles
# real de las capturas: a DSF 3 un viewport de 430x932 rinde screenshots de
# 1290x2796 px. Ese sobre-muestreo es lo que permite hacer zoom digital / Ken
# Burns en post sin pixelar tras el downscale a 1080x1920.
VIEWPORT_WIDTH = 430
VIEWPORT_HEIGHT = 932
DEVICE_SCALE_FACTOR = 3
USER_AGENT = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
)

# Tiempo (ms) que dejamos asentar la página tras cada scroll antes de capturar,
# para que fuentes/lazy-images/animaciones de entrada terminen.
SETTLE_MS = 900
PAGE_TIMEOUT_MS = 45_000


# ---------------------------------------------------------------------------
# PRIVACIDAD — objetivos a difuminar/ocultar. CRÍTICO.
# ---------------------------------------------------------------------------
# Dos mecanismos complementarios:
#   1) SELECTORES conocidos (blur u ocultar). Si un selector marcado como
#      `required=True` NO matchea ningún nodo, el script ABORTA (fail-loud):
#      significa que el markup cambió y podríamos estar grabando un dato expuesto.
#   2) REGEX de texto: se escanea TODO el DOM y se envuelve cualquier coincidencia
#      en un span difuminado, aunque aparezca en un lugar no previsto.

BLUR_PX = 15  # filtro de desenfoque para datos sensibles

@dataclass
class SelectorTarget:
    css: str
    mode: str = "blur"          # "blur" | "hide"
    required: bool = False       # si True y no matchea nada -> abort
    note: str = ""

import re as _re


def _flex(value: str) -> str:
    """Convierte un literal en un patrón tolerante a espaciado (para el DOM)."""
    return _re.escape(value).replace(r"\ ", r"\s+")


def _digits_variants(value: str) -> list[str]:
    """Variantes de un teléfono/matrícula para el QA por OCR."""
    out = {value}
    d = _re.sub(r"\D", "", value)
    if len(d) >= 6:
        out.add(d)
    return sorted(out)


# --- Selectores estructurales (NO contienen datos personales) ---------------
_STRUCTURAL_SELECTORS: list[SelectorTarget] = [
    # Botón flotante de WhatsApp (suele exponer el teléfono en el href)
    SelectorTarget('a[href*="wa.me" i]', "hide", False, "WhatsApp flotante"),
    SelectorTarget('a[href*="api.whatsapp.com" i]', "hide", False, "WhatsApp flotante"),
    SelectorTarget('a[href*="whatsapp" i]', "hide", False, "WhatsApp genérico"),
    SelectorTarget('[class*="whatsapp" i]', "hide", False, "widget WhatsApp"),
    SelectorTarget('[id*="whatsapp" i]', "hide", False, "widget WhatsApp"),
    SelectorTarget('a[href^="tel:"]', "blur", False, "tel: links"),
    SelectorTarget('a[href^="mailto:"]', "blur", False, "mailto: links"),
    SelectorTarget('a[href*="maps.google" i]', "blur", False, "maps"),
    SelectorTarget('a[href*="google.com/maps" i]', "blur", False, "maps"),
    SelectorTarget('a[href*="goo.gl/maps" i]', "blur", False, "maps"),
    SelectorTarget('[id*="cookie" i]', "hide", False, "cookie banner"),
    SelectorTarget('[class*="cookie" i]', "hide", False, "cookie banner"),
    SelectorTarget('[id*="consent" i]', "hide", False, "consent"),
    SelectorTarget('[class*="consent" i]', "hide", False, "consent"),
    SelectorTarget('[class*="cky" i]', "hide", False, "cookieyes"),
    SelectorTarget('[id*="onetrust" i]', "hide", False, "onetrust"),
    SelectorTarget('iframe[src*="tawk" i]', "hide", False, "chat tawk"),
    SelectorTarget('[class*="crisp" i]', "hide", False, "chat crisp"),
    SelectorTarget('[id*="intercom" i]', "hide", False, "chat intercom"),
]


def _build_privacy(pii: dict):
    """Construye selectores/patrones/strings de QA desde el archivo local."""
    name = pii.get("lawyer_name", "")
    photo_hint = pii.get("photo_src_hint", "")
    matricula = pii.get("matricula", "")
    phone = pii.get("phone", "")
    address = pii.get("address", "")
    reviewers = pii.get("reviewers", []) or []
    domain = pii.get("domain", "")

    selectors = list(_STRUCTURAL_SELECTORS)
    if name:
        selectors.insert(
            0, SelectorTarget(f'img[alt*="{name}" i]', "blur", True, "foto abogado (alt)")
        )
    if photo_hint:
        selectors.insert(
            1, SelectorTarget(f'img[src*="{photo_hint}" i]', "blur", True,
                              "foto abogado (src)")
        )

    patterns: list[tuple[str, str, bool]] = []
    if name:
        patterns.append(("nombre_abogado", _flex(name), True))
    if matricula:
        patterns.append(("matricula", _flex(matricula), True))
    if phone:
        patterns.append(("telefono", _flex(phone), True))
    if address:
        patterns.append(("direccion", _flex(address), True))
    for i, r in enumerate(reviewers, 1):
        if r:
            patterns.append((f"resena_{i}", _flex(r), False))
    if domain:
        base = _re.escape(domain)
        patterns.append(("dominio", base, False))
        patterns.append(("email_dominio", r"[A-Za-z0-9._%+-]+@" + base, False))

    forbidden: list[str] = []
    for v in [name, matricula, phone, address, domain, *reviewers]:
        if v:
            forbidden.extend(_digits_variants(v))
    # dedup preservando orden
    seen, qa = set(), []
    for s in forbidden:
        if s not in seen:
            seen.add(s)
            qa.append(s)
    return selectors, patterns, qa


SELECTOR_TARGETS, PII_TEXT_PATTERNS, QA_FORBIDDEN_STRINGS = _build_privacy(PII)


# ---------------------------------------------------------------------------
# Secciones a capturar (Fase 1). Cada sección resuelve su ancla por una lista
# de selectores candidatos (el primero que exista, gana) y/o por texto.
# ---------------------------------------------------------------------------
@dataclass
class Section:
    key: str
    # selectores candidatos para localizar/scrollear a la sección
    anchors: list[str]
    # texto candidato (heurística por contenido, case-insensitive) si no hay ancla
    text_hints: list[str] = field(default_factory=list)
    required: bool = True

SECTIONS: list[Section] = [
    Section("hero", ["header", "#hero", ".hero", "section:first-of-type", "main > *:first-child"],
            ["defensa que el momento exige", "defensa"], True),
    Section("areas", ["#areas", "#areas-de-trabajo", "[id*='area']", "[class*='area']"],
            ["áreas de trabajo", "querella", "defensa penal", "delitos económicos",
             "violencia de género"], True),
    Section("servicios", ["#servicios", "[id*='servicio']", "[class*='servicio']"],
            ["declaración del imputado", "prisión preventiva", "excarcelación",
             "servicios"], True),
    Section("resenas", ["#resenas", "#reseñas", "[id*='resena']", "[id*='review']",
                        "[class*='review']", "[class*='resena']"],
            ["reseñas", "opiniones", "5.0", "google"], True),
    Section("contacto", ["#contacto", "footer", "[id*='contacto']", "[class*='contacto']"],
            ["contacto", "consulta", "escribinos"], True),
]


# ---------------------------------------------------------------------------
# Identidad visual (Fase 2)
# ---------------------------------------------------------------------------
# Color de acento. Si AUTO_ACCENT=True se intenta extraer el color dominante del
# hero; si falla, se usa ACCENT_FALLBACK (dorado sobrio, evita look genérico).
AUTO_ACCENT = True
ACCENT_FALLBACK = (201, 162, 71)      # dorado sobrio #C9A247
INK = (17, 24, 22)                    # verde-tinta muy oscuro (base de cajas)
TEXT_COLOR = (255, 255, 255)          # blanco
TEXT_SHADOW = (0, 0, 0)

# Tipografía: sans geométrica bold, ÚNICA en todo el video.
# Se buscan estos archivos en assets/fonts (en orden). Ver README para bajarlas.
FONT_CANDIDATES_BOLD = [
    "Montserrat-Bold.ttf", "Poppins-Bold.ttf", "Inter-Bold.ttf",
    "Montserrat-SemiBold.ttf", "Poppins-SemiBold.ttf",
]
FONT_CANDIDATES_REGULAR = [
    "Montserrat-Medium.ttf", "Poppins-Medium.ttf", "Inter-Medium.ttf",
    "Montserrat-Regular.ttf", "Poppins-Regular.ttf", "Inter-Regular.ttf",
]
# Fallbacks del sistema si no hay ttf en assets/fonts (último recurso).
FONT_SYSTEM_FALLBACKS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]

# ---------------------------------------------------------------------------
# Export final
# ---------------------------------------------------------------------------
OUT_W = 1080
OUT_H = 1920
FPS = 30
START_CRF = 23
MAX_CRF = 32
SIZE_LIMIT_MB = 15.0
OUTPUT_NAME = "veredicto_story_estudio_penalista.mp4"

# Márgenes seguros (en px sobre el lienzo 1080x1920).
# Instagram tapa arriba (perfil/anillo) y abajo (username/reply/stickers).
SAFE_TOP = 250
SAFE_BOTTOM = 380   # franja inferior reservada — nada clave debajo de 1920-380=1540
SAFE_SIDE = 90
