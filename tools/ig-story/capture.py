"""
capture.py — FASE 1: captura limpia.

Playwright abre el sitio con emulación mobile en alta densidad (device scale
factor 2-3), resuelve la privacidad a nivel DOM ANTES de capturar cualquier
frame, y toma un screenshot nítido por sección. NO anima zoom ni pan: eso es
trabajo de post (Fase 2). El sobre-muestreo por DSF es lo que permite el zoom
digital en post sin pixelar.

Salida: PNGs por sección en build/raw + manifest.json.

Requiere: playwright (pip install playwright && playwright install chromium).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import config as C
import privacy

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
except ModuleNotFoundError:  # pragma: no cover
    sys.stderr.write(
        "\nFalta Playwright. Instalá:\n"
        "  pip install playwright\n"
        "  playwright install chromium\n\n"
    )
    raise


def _dismiss_overlays(page) -> None:
    """Cierra/oculta banners de cookies y chats de terceros que la privacidad
    aún no haya ocultado (además del hide por selector)."""
    # Intento de click en botones de aceptar (por si bloquean scroll), best-effort.
    for label in ["Aceptar", "Acepto", "Aceptar todo", "Entendido", "OK",
                  "Accept", "Got it", "Cerrar"]:
        try:
            btn = page.get_by_role("button", name=label)
            if btn.count() > 0:
                btn.first.click(timeout=800)
        except Exception:
            pass


def _locate(page, section: C.Section):
    """Devuelve un ElementHandle para la sección, o None."""
    for sel in section.anchors:
        try:
            el = page.query_selector(sel)
        except Exception:
            el = None
        if el:
            try:
                box = el.bounding_box()
            except Exception:
                box = None
            if box and box["height"] > 40:
                return el
    # fallback por texto
    for hint in section.text_hints:
        try:
            loc = page.get_by_text(hint, exact=False)
            if loc.count() > 0:
                handle = loc.first.element_handle()
                if handle:
                    # subir a un contenedor con altura razonable
                    container = handle.evaluate_handle(
                        """el => {
                            let n = el;
                            for (let i=0;i<4 && n.parentElement;i++){
                                n = n.parentElement;
                                if (n.getBoundingClientRect().height > 300) break;
                            }
                            return n;
                        }"""
                    )
                    ah = container.as_element()
                    if ah:
                        return ah
        except Exception:
            continue
    return None


def capture() -> Path:
    C.RAW_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {"target": C.TARGET_URL, "sections": []}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--force-color-profile=srgb"])
        context = browser.new_context(
            viewport={"width": C.VIEWPORT_WIDTH, "height": C.VIEWPORT_HEIGHT},
            device_scale_factor=C.DEVICE_SCALE_FACTOR,
            is_mobile=True,
            has_touch=True,
            user_agent=C.USER_AGENT,
            locale="es-AR",
            color_scheme="light",
            reduced_motion="reduce",  # frena animaciones de entrada del sitio
        )
        # Privacidad inyectada en cada navegación, ANTES del load.
        context.add_init_script(privacy.init_script())
        page = context.new_page()
        page.set_default_timeout(C.PAGE_TIMEOUT_MS)

        print(f"[capture] navegando a {C.TARGET_URL} ...")
        page.goto(C.TARGET_URL, wait_until="load", timeout=C.PAGE_TIMEOUT_MS)
        try:
            page.wait_for_load_state("networkidle", timeout=8000)
        except PWTimeout:
            pass
        _dismiss_overlays(page)
        page.wait_for_timeout(C.SETTLE_MS)

        # Verificación fail-loud GLOBAL antes de tocar nada.
        print("[capture] verificando anonimización (fail-loud) ...")
        rep = privacy.apply_and_verify(page)
        print("[capture] privacidad OK. requiredSelectors:",
              rep.get("requiredSelectors"))

        # Recorrer secciones.
        for section in C.SECTIONS:
            el = _locate(page, section)
            if el is None:
                msg = (f"[capture] sección requerida '{section.key}' NO encontrada "
                       f"(anchors={section.anchors}, hints={section.text_hints}). "
                       f"El markup cambió: abortando para no grabar algo incorrecto.")
                if section.required:
                    raise RuntimeError(msg)
                print("[capture][WARN]", msg)
                continue

            # scrollear a la sección, dejar asentar y RE-verificar privacidad
            try:
                el.scroll_into_view_if_needed(timeout=5000)
            except Exception:
                pass
            page.wait_for_timeout(C.SETTLE_MS)
            privacy.apply_and_verify(page)  # re-check tras el scroll/re-render

            out = C.RAW_DIR / f"{section.key}.png"
            # element.screenshot captura el alto completo de la sección a DSF real
            el.screenshot(path=str(out))
            box = el.bounding_box() or {"width": C.VIEWPORT_WIDTH,
                                        "height": C.VIEWPORT_HEIGHT}
            # dimensiones reales del PNG (CSS * DSF)
            from struct import unpack
            with open(out, "rb") as fh:
                head = fh.read(26)
            w_px = int.from_bytes(head[16:20], "big")
            h_px = int.from_bytes(head[20:24], "big")
            manifest["sections"].append(
                {"key": section.key, "file": out.name,
                 "px_w": w_px, "px_h": h_px,
                 "css_w": round(box["width"], 1), "css_h": round(box["height"], 1)}
            )
            print(f"[capture]  {section.key}: {out.name}  {w_px}x{h_px}px")

        # Full-page tall (por si se quiere un paneo largo en post) — opcional.
        try:
            privacy.apply_and_verify(page)
            page.screenshot(path=str(C.RAW_DIR / "_fullpage.png"), full_page=True)
        except Exception as e:
            print("[capture][WARN] full_page falló:", e)

        context.close()
        browser.close()

    (C.RAW_DIR / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False)
    )
    print(f"[capture] listo -> {C.RAW_DIR}")
    return C.RAW_DIR / "manifest.json"


if __name__ == "__main__":
    capture()
