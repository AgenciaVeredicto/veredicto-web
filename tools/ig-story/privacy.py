"""
privacy.py — Anonimización a nivel DOM, persistente y con detección activa.

Se inyecta ANTES de cualquier scroll o captura y se mantiene viva durante toda
la sesión mediante:
  - una hoja de estilos con reglas !important para los selectores conocidos,
  - un recorrido de nodos de texto que envuelve cualquier coincidencia de los
    patrones PII en un <span> difuminado (aunque aparezca en un lugar no previsto),
  - un MutationObserver + listeners de scroll/resize que reaplican todo si el
    sitio re-renderiza o inyecta contenido dinámico.

Además expone `window.__pv_report()` para verificación fail-loud desde Python:
si un objetivo `required` no matchea, o si un patrón PII queda VISIBLE (fuera de
un nodo difuminado/oculto), el proceso aborta y NO se graba nada.
"""

from __future__ import annotations

import json
from typing import Any

from config import (
    BLUR_PX,
    PII_TEXT_PATTERNS,
    SELECTOR_TARGETS,
    SelectorTarget,
)


def _js_config() -> str:
    blur_selectors = [t.css for t in SELECTOR_TARGETS if t.mode == "blur"]
    hide_selectors = [t.css for t in SELECTOR_TARGETS if t.mode == "hide"]
    required_selectors = [t.css for t in SELECTOR_TARGETS if t.required]
    patterns = [
        {"name": name, "src": src, "required": bool(req)}
        for (name, src, req) in PII_TEXT_PATTERNS
    ]
    return json.dumps(
        {
            "blurPx": BLUR_PX,
            "blurSelectors": blur_selectors,
            "hideSelectors": hide_selectors,
            "requiredSelectors": required_selectors,
            "patterns": patterns,
        }
    )


# El script se ejecuta como init-script (en cada navegación) y también puede
# reinvocarse vía page.evaluate. Es idempotente.
_INIT_TEMPLATE = r"""
(() => {
  const CFG = __PV_CONFIG__;
  if (window.__pv_installed) { window.__pv_apply && window.__pv_apply(); return; }
  window.__pv_installed = true;

  // 1) Hoja de estilos base -------------------------------------------------
  const styleId = "__pv_style";
  function ensureStyle() {
    let s = document.getElementById(styleId);
    if (!s) {
      s = document.createElement("style");
      s.id = styleId;
      const blurRule = CFG.blurSelectors.length
        ? CFG.blurSelectors.join(",") +
          "{filter:blur(" + CFG.blurPx + "px) !important;" +
          "-webkit-filter:blur(" + CFG.blurPx + "px) !important;}"
        : "";
      const hideRule = CFG.hideSelectors.length
        ? CFG.hideSelectors.join(",") +
          "{display:none !important;visibility:hidden !important;" +
          "opacity:0 !important;pointer-events:none !important;}"
        : "";
      const spanRule =
        ".__pv_blur{filter:blur(" + CFG.blurPx + "px) !important;" +
        "-webkit-filter:blur(" + CFG.blurPx + "px) !important;" +
        "background:rgba(20,20,20,.28) !important;border-radius:3px;" +
        "color:transparent !important;text-shadow:none !important;}";
      s.textContent = blurRule + "\n" + hideRule + "\n" + spanRule;
      (document.head || document.documentElement).appendChild(s);
    }
    return s;
  }

  // 2) Envolver coincidencias de texto sensible ----------------------------
  const regexes = CFG.patterns.map(p => ({
    name: p.name,
    required: p.required,
    re: new RegExp(p.src, "gi"),
  }));

  function skip(node) {
    // no re-procesar lo ya difuminado, ni script/style
    let el = node.parentElement;
    while (el) {
      if (el.classList && el.classList.contains("__pv_blur")) return true;
      const tag = el.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return true;
      el = el.parentElement;
    }
    return false;
  }

  function wrapTextNodes() {
    const walker = document.createTreeWalker(
      document.body || document.documentElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    const targets = [];
    let n;
    while ((n = walker.nextNode())) {
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      if (skip(n)) continue;
      for (const r of regexes) {
        r.re.lastIndex = 0;
        if (r.re.test(n.nodeValue)) { targets.push(n); break; }
      }
    }
    for (const node of targets) {
      const text = node.nodeValue;
      const frag = document.createDocumentFragment();
      let idx = 0;
      // recolectar todos los matches de todos los patrones y ordenarlos
      const spans = [];
      for (const r of regexes) {
        r.re.lastIndex = 0;
        let m;
        while ((m = r.re.exec(text)) !== null) {
          spans.push([m.index, m.index + m[0].length]);
          if (m.index === r.re.lastIndex) r.re.lastIndex++;
        }
      }
      spans.sort((a, b) => a[0] - b[0]);
      // fusionar solapados
      const merged = [];
      for (const sp of spans) {
        if (merged.length && sp[0] <= merged[merged.length - 1][1]) {
          merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], sp[1]);
        } else merged.push([sp[0], sp[1]]);
      }
      for (const [a, b] of merged) {
        if (a > idx) frag.appendChild(document.createTextNode(text.slice(idx, a)));
        const span = document.createElement("span");
        span.className = "__pv_blur";
        span.textContent = text.slice(a, b);
        frag.appendChild(span);
        idx = b;
      }
      if (idx < text.length) frag.appendChild(document.createTextNode(text.slice(idx)));
      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    }
  }

  window.__pv_apply = function () {
    ensureStyle();
    try { wrapTextNodes(); } catch (e) { /* nunca romper el render */ }
  };

  // 3) Persistencia --------------------------------------------------------
  function boot() {
    window.__pv_apply();
    const obs = new MutationObserver(() => {
      // debounce: reaplicar en el próximo frame
      if (window.__pv_raf) return;
      window.__pv_raf = requestAnimationFrame(() => {
        window.__pv_raf = null;
        window.__pv_apply();
      });
    });
    obs.observe(document.documentElement, {
      childList: true, subtree: true, characterData: true,
    });
    ["scroll", "resize"].forEach(ev =>
      window.addEventListener(ev, () => window.__pv_apply(), { passive: true })
    );
  }
  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);

  // 4) Reporte para verificación fail-loud desde Python --------------------
  window.__pv_report = function () {
    const rep = { requiredSelectors: {}, patterns: {}, leaks: [] };
    for (const sel of CFG.requiredSelectors) {
      let count = 0;
      try { count = document.querySelectorAll(sel).length; } catch (e) {}
      rep.requiredSelectors[sel] = count;
    }
    // ¿algún patrón queda VISIBLE (texto no difuminado ni oculto)?
    function visibleText(root) {
      let out = "";
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      let n;
      while ((n = walker.nextNode())) {
        if (!n.nodeValue || !n.nodeValue.trim()) continue;
        let el = n.parentElement, hidden = false, blurred = false;
        while (el) {
          if (el.classList && el.classList.contains("__pv_blur")) { blurred = true; break; }
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" ||
              parseFloat(cs.opacity || "1") === 0) { hidden = true; break; }
          const f = cs.filter || "";
          if (f.indexOf("blur(") !== -1) { blurred = true; break; }
          el = el.parentElement;
        }
        if (!hidden && !blurred) out += " " + n.nodeValue;
      }
      return out;
    }
    const vis = visibleText(document.body || document.documentElement);
    for (const p of CFG.patterns) {
      const re = new RegExp(p.src, "gi");
      const all = vis.match(re) || [];
      rep.patterns[p.name] = { required: p.required, visibleMatches: all.length };
      if (all.length) rep.leaks.push({ name: p.name, samples: all.slice(0, 3) });
    }
    return rep;
  };
})();
"""


def init_script() -> str:
    """Script para page.add_init_script() — corre en cada navegación, antes del load."""
    return _INIT_TEMPLATE.replace("__PV_CONFIG__", _js_config())


class PrivacyError(RuntimeError):
    """Se lanza cuando la anonimización no se puede garantizar -> abortar."""


def evaluate_report(rep: dict, full_text: str) -> dict:
    """Verificación fail-loud PURA (sin dependencia de Playwright) sobre el
    reporte de `window.__pv_report()` y el innerText del documento.

    Lanza PrivacyError si:
      - un selector `required` no matchea ningún nodo (markup cambió), o
      - un patrón PII `required` no aparece NUNCA en el DOM (lista desactualizada), o
      - cualquier patrón PII queda VISIBLE (no difuminado/oculto).
    """
    import re as _re

    problems: list[str] = []

    # 1) selectores required deben existir
    req_by_css = {t.css: t for t in SELECTOR_TARGETS if t.required}
    for css, count in rep.get("requiredSelectors", {}).items():
        if count == 0:
            note = req_by_css.get(css, SelectorTarget(css)).note or css
            problems.append(
                f"[SELECTOR REQUERIDO SIN COINCIDENCIA] '{css}' ({note}). "
                f"El markup cambió: no se puede garantizar que el dato esté oculto."
            )

    # 2) patrones required deben aparecer al menos una vez en el DOM (aunque ya
    #    difuminados). Si no aparecen nunca, la lista de PII quedó vieja.
    for name, src, required in PII_TEXT_PATTERNS:
        if not required:
            continue
        if not _re.search(src, full_text, _re.I):
            problems.append(
                f"[PATRÓN PII REQUERIDO AUSENTE] '{name}' (/{src}/) no aparece en el "
                f"DOM. El contenido cambió: revisá config.PII_TEXT_PATTERNS."
            )

    # 3) ninguna PII puede quedar VISIBLE
    for leak in rep.get("leaks", []):
        problems.append(
            f"[FUGA VISIBLE] patrón '{leak['name']}' visible sin difuminar. "
            f"Ejemplos: {leak.get('samples')}"
        )

    if problems:
        raise PrivacyError(
            "Anonimización NO garantizada — se aborta la captura:\n  - "
            + "\n  - ".join(problems)
        )
    return rep


def apply_and_verify(page: Any) -> dict:
    """Reaplica la anonimización en la página viva y verifica (fail-loud)."""
    page.evaluate("() => window.__pv_apply && window.__pv_apply()")
    rep = page.evaluate("() => window.__pv_report()")
    full_text = page.evaluate(
        "() => (document.body||document.documentElement).innerText || ''"
    )
    return evaluate_report(rep, full_text)
