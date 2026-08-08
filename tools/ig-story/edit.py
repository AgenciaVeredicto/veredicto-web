"""
edit.py — FASE 2: edición cinematográfica sobre el metraje crudo.

Toma los PNGs de alta densidad de la Fase 1 y arma el video vertical con:
  - Ken Burns (zoom sutil) en el hero,
  - paneos verticales en áreas / servicios / contacto,
  - recuadros de highlight con color de acento sobre 2-3 ítems,
  - transiciones por crossfade entre secciones,
  - texto animado (fade + leve slide), tipografía única, blanco con sombra y caja
    semitransparente, respetando márgenes seguros de Instagram,
  - color de acento coherente (auto-extraído del hero o dorado sobrio de fallback).

Produce un MASTER de alta calidad (build/work/master.mp4, sin audio). El ajuste
de tamaño <15MB y la pista de audio silenciosa (AAC) los hace export.py.

Requiere: moviepy>=2.1, Pillow, numpy.
"""

from __future__ import annotations

import sys
from pathlib import Path

import config as C

try:
    import numpy as np
    from PIL import Image, ImageDraw
    from moviepy import (
        ImageClip,
        TextClip,
        ColorClip,
        CompositeVideoClip,
        concatenate_videoclips,
        vfx,
    )
except ModuleNotFoundError as e:  # pragma: no cover
    sys.stderr.write(
        f"\nFalta una dependencia ({e.name}). Instalá:\n"
        "  pip install 'moviepy>=2.1' Pillow numpy\n\n"
    )
    raise

FW, FH = C.OUT_W, C.OUT_H
FRAME = (FW, FH)


# ---------------------------------------------------------------------------
# Tipografía
# ---------------------------------------------------------------------------
def resolve_font(candidates: list[str]) -> str:
    for name in candidates:
        p = C.FONT_DIR / name
        if p.exists():
            return str(p)
    for fb in C.FONT_SYSTEM_FALLBACKS:
        if Path(fb).exists():
            return fb
    raise FileNotFoundError(
        "No se encontró ninguna fuente. Poné Montserrat-Bold.ttf (o Poppins/Inter "
        f"Bold) en {C.FONT_DIR}. Ver README."
    )


FONT_BOLD = None  # se resuelven en build()
FONT_REG = None


# ---------------------------------------------------------------------------
# Color de acento
# ---------------------------------------------------------------------------
def accent_color(raw_dir: Path) -> tuple[int, int, int]:
    if not C.AUTO_ACCENT:
        return C.ACCENT_FALLBACK
    hero = raw_dir / "hero.png"
    if not hero.exists():
        return C.ACCENT_FALLBACK
    try:
        im = Image.open(hero).convert("RGB").resize((80, 140))
        arr = np.asarray(im).reshape(-1, 3).astype(float)
        # descartar casi-blancos y casi-negros; buscar el color más saturado medio
        mx = arr.max(1)
        mn = arr.min(1)
        sat = (mx - mn) / (mx + 1e-6)
        val = mx / 255.0
        mask = (sat > 0.25) & (val > 0.25) & (val < 0.95)
        if mask.sum() < 30:
            return C.ACCENT_FALLBACK
        sel = arr[mask]
        c = sel.mean(0)
        return (int(c[0]), int(c[1]), int(c[2]))
    except Exception:
        return C.ACCENT_FALLBACK


# ---------------------------------------------------------------------------
# Movimiento de cámara sobre stills
# ---------------------------------------------------------------------------
def _cover_scale(iw: int, ih: int) -> float:
    return max(FW / iw, FH / ih)


def ken_burns(path: Path, dur: float, z0=1.02, z1=1.12, focus="center"):
    """Zoom sutil sobre una imagen que cubre el frame."""
    base = ImageClip(str(path))
    iw, ih = base.w, base.h
    sc = _cover_scale(iw, ih)

    def factor(t):
        return sc * (z0 + (z1 - z0) * (t / max(dur, 1e-6)))

    def pos(t):
        f = factor(t)
        w, h = iw * f, ih * f
        x = (FW - w) / 2
        if focus == "top":
            y = 0
        elif focus == "bottom":
            y = FH - h
        else:
            y = (FH - h) / 2
        return (x, y)

    clip = base.with_duration(dur).resized(factor).with_position(pos)
    return CompositeVideoClip([clip], size=FRAME).with_duration(dur)


def pan_vertical(path: Path, dur: float, direction="down", zoom=1.04):
    """Paneo vertical sobre una sección más alta que el frame."""
    base = ImageClip(str(path))
    iw, ih = base.w, base.h
    fit = FW / iw  # el ancho llena el frame
    scaled_h = ih * fit
    if scaled_h <= FH + 4:  # no es más alta que el frame -> Ken Burns
        return ken_burns(path, dur, 1.02, 1.08, "center")

    def factor(t):
        return fit * (1 + (zoom - 1) * (t / max(dur, 1e-6)))

    def pos(t):
        f = factor(t)
        w, h = iw * f, ih * f
        travel = h - FH
        frac = t / max(dur, 1e-6)
        y = -travel * (frac if direction == "down" else (1 - frac))
        x = (FW - w) / 2
        return (x, y)

    clip = base.with_duration(dur).resized(factor).with_position(pos)
    return CompositeVideoClip([clip], size=FRAME).with_duration(dur)


# ---------------------------------------------------------------------------
# Highlights (recuadro con color de acento)
# ---------------------------------------------------------------------------
def highlight_box(rect_norm, dur, accent, start=0.0, thickness=6, radius=28):
    """Recuadro redondeado (contorno) sobre una zona, con fade in/out.
    rect_norm = (x, y, w, h) en fracciones del frame."""
    x = int(rect_norm[0] * FW)
    y = int(rect_norm[1] * FH)
    w = int(rect_norm[2] * FW)
    h = int(rect_norm[3] * FH)
    img = Image.new("RGBA", FRAME, (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([x, y, x + w, y + h], radius=radius,
                        outline=accent + (255,), width=thickness)
    # leve halo interno
    d.rounded_rectangle([x + 3, y + 3, x + w - 3, y + h - 3], radius=radius,
                        outline=accent + (60,), width=2)
    clip = (ImageClip(np.array(img), transparent=True)
            .with_duration(dur)
            .with_start(start)
            .with_effects([vfx.CrossFadeIn(0.35), vfx.CrossFadeOut(0.5)]))
    return clip


# ---------------------------------------------------------------------------
# Texto animado con caja semitransparente
# ---------------------------------------------------------------------------
def text_card(text, start, dur, accent, y_center=None, big=False,
              max_width=None, pin_bottom=False):
    """Devuelve [caja, texto] con fade + leve slide-up, dentro de márgenes seguros."""
    max_width = max_width or (FW - 2 * C.SAFE_SIDE)
    font = FONT_BOLD if big else FONT_BOLD
    font_size = 74 if big else 56

    txt = TextClip(
        text=text,
        font=font,
        font_size=font_size,
        color="white",
        stroke_color="black",
        stroke_width=2,
        method="caption",
        size=(max_width, None),
        text_align="center",
    ).with_duration(dur)

    tw, th = txt.w, txt.h
    pad_x, pad_y = 44, 30
    box_w, box_h = tw + 2 * pad_x, th + 2 * pad_y

    # posición vertical respetando safe areas
    if pin_bottom:
        y = FH - C.SAFE_BOTTOM - box_h
    elif y_center is not None:
        y = int(y_center - box_h / 2)
    else:
        y = int(FH * 0.62 - box_h / 2)
    y = max(C.SAFE_TOP, min(y, FH - C.SAFE_BOTTOM - box_h))
    x = int((FW - box_w) / 2)

    # caja redondeada semitransparente (con filo de acento)
    bimg = Image.new("RGBA", (box_w, box_h), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bimg)
    bd.rounded_rectangle([0, 0, box_w - 1, box_h - 1], radius=26,
                         fill=C.INK + (150,))
    bd.rounded_rectangle([0, 0, box_w - 1, box_h - 1], radius=26,
                         outline=accent + (220,), width=3)
    box = ImageClip(np.array(bimg), transparent=True).with_duration(dur)

    slide = 26  # px de slide de entrada

    def box_pos(t):
        dy = slide * max(0.0, 1 - t / 0.4)  # sube en los primeros 0.4s
        return (x, y + dy)

    def txt_pos(t):
        dy = slide * max(0.0, 1 - t / 0.4)
        return (x + pad_x, y + pad_y + dy)

    fx = [vfx.CrossFadeIn(0.3), vfx.CrossFadeOut(0.35)]
    box = box.with_start(start).with_position(box_pos).with_effects(fx)
    txt = txt.with_start(start).with_position(txt_pos).with_effects(fx)
    return [box, txt]


# ---------------------------------------------------------------------------
# Ensamblado
# ---------------------------------------------------------------------------
def build() -> Path:
    global FONT_BOLD, FONT_REG
    FONT_BOLD = resolve_font(C.FONT_CANDIDATES_BOLD)
    FONT_REG = resolve_font(C.FONT_CANDIDATES_REGULAR + C.FONT_CANDIDATES_BOLD)
    C.WORK_DIR.mkdir(parents=True, exist_ok=True)

    raw = C.RAW_DIR
    accent = accent_color(raw)
    print(f"[edit] color de acento: {accent}")

    def rp(key):
        p = raw / f"{key}.png"
        if not p.exists():
            raise FileNotFoundError(
                f"Falta el crudo '{p.name}'. Corré la Fase 1 (capture.py) primero."
            )
        return p

    CROSS = 0.5
    # (clip de sección, duración)
    hero = ken_burns(rp("hero"), 3.5, 1.03, 1.13, "top")
    areas = pan_vertical(rp("areas"), 5.5, "down", 1.05)
    serv = pan_vertical(rp("servicios"), 4.5, "down", 1.05)
    revs = ken_burns(rp("resenas"), 4.5, 1.05, 1.12, "top")
    cont = pan_vertical(rp("contacto"), 5.5, "down", 1.04)

    sections = [hero, areas, serv, revs, cont]
    # crossfade de entrada en todas menos la primera
    faded = [sections[0]]
    for clip in sections[1:]:
        faded.append(clip.with_effects([vfx.CrossFadeIn(CROSS)]))
    base = concatenate_videoclips(faded, method="compose", padding=-CROSS)
    total = base.duration
    print(f"[edit] duración base: {total:.2f}s")

    # tiempos absolutos de inicio de cada sección (con solape de crossfade)
    starts, acc = [], 0.0
    for i, clip in enumerate(sections):
        starts.append(acc)
        acc += clip.duration - (CROSS if i < len(sections) - 1 else 0)
    s_hero, s_areas, s_serv, s_revs, s_cont = starts

    overlays = []

    # --- Highlights sobre áreas de trabajo (2-3 ítems), dentro de safe area ---
    hl_dur = 1.3
    overlays += [
        highlight_box((0.10, 0.30, 0.80, 0.11), hl_dur, accent, start=s_areas + 0.8),
        highlight_box((0.10, 0.46, 0.80, 0.11), hl_dur, accent, start=s_areas + 2.3),
        highlight_box((0.10, 0.62, 0.80, 0.11), hl_dur, accent, start=s_areas + 3.8),
    ]

    # --- Textos en pantalla (según guion) ---
    overlays += text_card(
        "Así quedó la web de un estudio penalista en Córdoba.",
        start=0.3, dur=2.9, accent=accent, big=True, y_center=int(FH * 0.30))
    overlays += text_card(
        "Cada servicio tiene su propia página, optimizada para cómo la gente "
        "busca en Google (SEO).",
        start=s_serv + 0.2, dur=3.6, accent=accent, y_center=int(FH * 0.30))
    overlays += text_card(
        "5.0 en Google. La web muestra esa confianza desde el primer segundo.",
        start=s_revs + 0.2, dur=3.2, accent=accent, y_center=int(FH * 0.68))
    # Cierre fijo (respetando franja inferior reservada)
    overlays += text_card(
        "Hacemos esto para estudios jurídicos en Argentina. "
        "Bajo expectativa, sobre entrega.",
        start=max(0.0, total - 2.2), dur=2.2, accent=accent, pin_bottom=True)

    final = CompositeVideoClip([base] + overlays, size=FRAME).with_duration(total)

    master = C.WORK_DIR / "master.mp4"
    print(f"[edit] renderizando master -> {master}")
    final.write_videofile(
        str(master),
        fps=C.FPS,
        codec="libx264",
        audio=False,
        preset="medium",
        ffmpeg_params=["-crf", "18", "-pix_fmt", "yuv420p"],
        threads=4,
    )
    print(f"[edit] master listo ({master.stat().st_size/1e6:.1f} MB)")
    return master


if __name__ == "__main__":
    build()
