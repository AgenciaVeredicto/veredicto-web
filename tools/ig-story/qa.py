"""
qa.py — QA de privacidad OBLIGATORIO sobre el video final.

1) Extrae frames de muestra cada 0.5s (ffmpeg -vf fps=2) como PNGs.
2) Escanea cada frame buscando datos prohibidos (nombre completo, teléfono,
   dirección, matrícula, nombres de reseñadores, dominio). El escaneo es por OCR
   si hay tesseract/pytesseract disponibles; si no, deja los PNGs para revisión
   manual y avisa RUIDOSAMENTE que el chequeo automático no corrió.
3) Si algún frame filtra un dato -> falla con la lista de frames afectados. NO se
   entrega el video: hay que corregir la Fase 1 (blur/hide) o la Fase 2 (encuadre)
   y re-exportar.

Instalar OCR (recomendado):  pip install pytesseract  +  tesseract-ocr del SO
(apt-get install tesseract-ocr / brew install tesseract).
"""

from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path

import config as C


def _ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def extract_frames(video: Path, fps: int = 2) -> list[Path]:
    if C.QA_DIR.exists():
        shutil.rmtree(C.QA_DIR)
    C.QA_DIR.mkdir(parents=True, exist_ok=True)
    cmd = [_ffmpeg(), "-y", "-i", str(video), "-vf", f"fps={fps}",
           str(C.QA_DIR / "frame_%04d.png")]
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    return sorted(C.QA_DIR.glob("frame_*.png"))


def _ocr_available():
    try:
        import pytesseract  # noqa
    except ModuleNotFoundError:
        return None
    if not shutil.which("tesseract"):
        return None
    import pytesseract
    return pytesseract


def _normalize(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip().lower()


def scan_frames(frames: list[Path]) -> dict:
    ocr = _ocr_available()
    forbidden = [_normalize(s) for s in C.QA_FORBIDDEN_STRINGS]
    # variantes solo-dígitos del teléfono/matrícula para tolerar el OCR
    digit_targets = {
        re.sub(r"\D", "", s): s for s in C.QA_FORBIDDEN_STRINGS if re.search(r"\d", s)
    }
    result = {"ocr": bool(ocr), "hits": [], "frames": len(frames)}

    if not ocr:
        result["warning"] = (
            "OCR no disponible (falta pytesseract y/o tesseract). Los frames se "
            "extrajeron en build/qa para REVISIÓN MANUAL, pero el chequeo "
            "automático NO corrió."
        )
        return result

    from PIL import Image

    for f in frames:
        try:
            raw = ocr.image_to_string(Image.open(f), lang="spa+eng")
        except Exception:
            raw = ocr.image_to_string(Image.open(f))
        norm = _normalize(raw)
        digits = re.sub(r"\D", "", raw)
        found = [orig for orig, low in zip(C.QA_FORBIDDEN_STRINGS, forbidden)
                 if low and low in norm]
        for dg, orig in digit_targets.items():
            if len(dg) >= 6 and dg in digits and orig not in found:
                found.append(orig)
        if found:
            result["hits"].append({"frame": f.name, "found": sorted(set(found))})
    return result


class QAError(RuntimeError):
    pass


def run_qa(video: Path) -> dict:
    print(f"[qa] extrayendo frames cada 0.5s de {video.name} ...")
    frames = extract_frames(video, fps=2)
    print(f"[qa] {len(frames)} frames en {C.QA_DIR}")
    res = scan_frames(frames)
    if res.get("warning"):
        print("[qa][WARN]", res["warning"])
    if res["hits"]:
        detail = "\n  - ".join(
            f"{h['frame']}: {', '.join(h['found'])}" for h in res["hits"]
        )
        raise QAError(
            "QA FALLÓ — datos sensibles VISIBLES en frames del video final:\n  - "
            + detail
            + "\n\nCorregí Fase 1 (blur/hide) o Fase 2 (encuadre) y re-exportá. "
            "NO entregar este archivo."
        )
    if res["ocr"]:
        print(f"[qa] OK — 0 fugas en {res['frames']} frames (OCR spa+eng).")
    return res


if __name__ == "__main__":
    import sys
    v = Path(sys.argv[1]) if len(sys.argv) > 1 else (C.OUT_DIR / C.OUTPUT_NAME)
    run_qa(v)
