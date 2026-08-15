"""
make_story.py — Orquestador de punta a punta.

Corre las tres fases en orden y NO entrega si el QA de privacidad falla:

    Fase 1  capture.py  -> build/raw/*.png     (captura limpia, privacidad DOM)
    Fase 2  edit.py     -> build/work/master.mp4 (edición)
    export  export.py   -> output/*.mp4          (H.264, <15MB, audio AAC mudo)
    QA      qa.py        -> build/qa/*.png         (frames + escaneo OCR fail-loud)

Uso:
    python make_story.py                # todo
    python make_story.py --skip-capture # reusar crudos existentes
    python make_story.py --only-qa      # solo QA sobre el output actual

El QA es OBLIGATORIO: si detecta un dato sensible visible, el proceso termina
con error y el archivo NO se considera entregable.
"""

from __future__ import annotations

import argparse
import sys

import config as C


def main() -> int:
    ap = argparse.ArgumentParser(description="Genera el Instagram Story del sitio.")
    ap.add_argument("--skip-capture", action="store_true",
                    help="reusar build/raw existente (no re-capturar).")
    ap.add_argument("--skip-edit", action="store_true",
                    help="reusar build/work/master.mp4 existente.")
    ap.add_argument("--only-qa", action="store_true",
                    help="solo correr el QA sobre el output actual.")
    args = ap.parse_args()

    out = C.OUT_DIR / C.OUTPUT_NAME

    if args.only_qa:
        from qa import run_qa
        run_qa(out)
        return 0

    # Fase 1
    if not args.skip_capture:
        from capture import capture
        capture()
    else:
        print("[make] --skip-capture: reusando build/raw")

    # Fase 2
    if not args.skip_edit:
        from edit import build
        build()
    else:
        print("[make] --skip-edit: reusando build/work/master.mp4")

    # Export con control de tamaño
    from export import export
    out = export()

    # QA OBLIGATORIO
    from qa import run_qa
    run_qa(out)

    print("\n==============================================")
    print(f"  ENTREGABLE: {out}")
    print(f"  {out.stat().st_size/1e6:.2f} MB · {C.OUT_W}x{C.OUT_H} · {C.FPS}fps · H.264")
    print("  QA de privacidad: PASÓ")
    print("==============================================\n")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        sys.stderr.write(f"\n[ERROR] {e}\n")
        sys.exit(1)
