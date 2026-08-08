"""
export.py — Export final con control de tamaño (<15MB) y audio silencioso AAC.

Toma el master de la Fase 2 y produce el MP4 entregable:
  - 1080x1920, H.264 (yuv420p, profile high), 30fps, +faststart,
  - pista de audio AAC silenciosa (evita problemas de reproducción; el video
    funciona muteado, el texto no depende del sonido),
  - escalera de CRF: arranca en START_CRF y sube hasta cumplir SIZE_LIMIT_MB.
    NUNCA entrega por encima del límite.

Usa el ffmpeg del sistema si existe; si no, el binario de imageio-ffmpeg.
"""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

import config as C


def ffmpeg_bin() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception as e:  # pragma: no cover
        raise RuntimeError(
            "No hay ffmpeg. Instalá ffmpeg en el sistema, o "
            "`pip install imageio-ffmpeg`."
        ) from e


def _encode(ff: str, master: Path, out: Path, crf: int) -> None:
    cmd = [
        ff, "-y",
        "-i", str(master),
        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
        "-shortest",
        "-vf", (f"scale={C.OUT_W}:{C.OUT_H}:force_original_aspect_ratio=decrease,"
                f"pad={C.OUT_W}:{C.OUT_H}:(ow-iw)/2:(oh-ih)/2,"
                f"fps={C.FPS},format=yuv420p"),
        "-c:v", "libx264",
        "-profile:v", "high",
        "-preset", "slow",
        "-crf", str(crf),
        "-c:a", "aac", "-b:a", "96k",
        "-movflags", "+faststart",
        str(out),
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True)


def export(master: Path | None = None) -> Path:
    master = master or (C.WORK_DIR / "master.mp4")
    if not master.exists():
        raise FileNotFoundError(f"Falta el master {master}. Corré la Fase 2 (edit.py).")
    C.OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = C.OUT_DIR / C.OUTPUT_NAME
    ff = ffmpeg_bin()

    crf = C.START_CRF
    while True:
        print(f"[export] encodeando CRF {crf} ...")
        try:
            _encode(ff, master, out, crf)
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"ffmpeg falló:\n{e.stderr[-2000:]}") from e
        size_mb = out.stat().st_size / 1e6
        print(f"[export]   -> {size_mb:.2f} MB")
        if size_mb <= C.SIZE_LIMIT_MB:
            print(f"[export] OK: {out} ({size_mb:.2f} MB, límite {C.SIZE_LIMIT_MB} MB)")
            return out
        if crf >= C.MAX_CRF:
            # último recurso: bajar un poco la resolución vertical de calidad
            print("[export][WARN] alcanzado MAX_CRF; el archivo aún supera el "
                  "límite. Revisá duración/contenido.")
            raise RuntimeError(
                f"No se pudo bajar de {C.SIZE_LIMIT_MB} MB ni con CRF {crf}. "
                f"Reducí duración o número de transiciones."
            )
        crf += 2


if __name__ == "__main__":
    export()
