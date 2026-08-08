# Web → Instagram Story (video vertical)

Genera un video vertical **1080×1920, MP4 H.264, 30fps, <15MB**, listo para subir
como Instagram Story y guardar en Destacadas, a partir de un sitio web — con
**anonimización total de datos personales** resuelta a nivel DOM antes de grabar.

Pensado para lucir **editado por un editor senior**: Ken Burns, paneos,
highlights, transiciones por crossfade, texto animado con tipografía única y
márgenes seguros de Instagram.

## Arquitectura (dos fases)

1. **Fase 1 — Captura limpia (`capture.py`)**
   Playwright abre el sitio con emulación mobile en **alta densidad** (device
   scale factor 3), resuelve la **privacidad a nivel DOM** (blur/hide + regex de
   texto + `MutationObserver` + reaplicación en scroll/resize) y toma un
   screenshot nítido por sección. **No** anima nada: solo captura crudo.
   Si un selector o patrón sensible marcado como *requerido* no aparece
   (el markup cambió), **aborta ruidosamente** en vez de grabar a ciegas.

2. **Fase 2 — Edición (`edit.py` + `export.py`)**
   Todo el trabajo cinematográfico se hace en post sobre los stills de alta
   densidad con moviepy/ffmpeg. El downscale final a 1080×1920 mantiene nítido el
   zoom digital porque el crudo está sobre-muestreado.

3. **QA obligatorio (`qa.py`)**
   Extrae frames cada 0.5s y los escanea por OCR buscando datos prohibidos. Si
   filtra algo, **falla y no entrega**.

```
capture.py  ─▶ build/raw/*.png        (crudo, privacidad ya aplicada)
edit.py     ─▶ build/work/master.mp4  (edición, master de alta calidad)
export.py   ─▶ output/*.mp4           (H.264, <15MB, audio AAC mudo)
qa.py       ─▶ build/qa/*.png         (frames + escaneo OCR fail-loud)
```

## Instalación

```bash
cd tools/ig-story
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium

# OCR para el QA (recomendado):
#   Debian/Ubuntu: sudo apt-get install tesseract-ocr tesseract-ocr-spa
#   macOS:         brew install tesseract tesseract-lang
```

### Datos del sitio (privacidad — importante)

Ningún dato personal vive en el código. Creá tu archivo local (gitignored, **no
se publica**) y completá tus datos reales:

```bash
cp pii_targets.example.json pii_targets.local.json
# editá pii_targets.local.json: target_url, lawyer_name, matricula, phone,
# address, domain, reviewers[]
```

Con esos valores el script arma los selectores, los patrones de anonimización y
la lista de QA. Si no creás el `.local.json`, corre con placeholders ficticios y
la Fase 1 **aborta** (fail-loud) para no trabajar con una config incompleta.

### Tipografía (importante)

El video usa **una** sans geométrica bold en todo. Poné el `.ttf` en
`assets/fonts/` (el código busca, en orden, Montserrat → Poppins → Inter):

```
assets/fonts/Montserrat-Bold.ttf
assets/fonts/Montserrat-Medium.ttf
```

Descargá Montserrat/Poppins gratis de Google Fonts (licencia OFL). Si no hay
ninguna, cae a una fuente del sistema (DejaVu/Arial) como último recurso.

## Opción sin instalar nada: editor en el navegador

`browser-editor/index.html` es un editor de un solo archivo que corre en Chrome:
abrilo, cargá una captura por sección (hero, áreas, servicios, reseñas,
contacto) con la privacidad ya aplicada, y apretá **Grabar**. Renderiza mi
edición completa (Ken Burns, paneos, highlights, texto animado, márgenes
seguros) sobre un canvas 1080×1920 y descarga el video.

- Intenta **MP4 (H.264)**; en un Chrome de escritorio normalmente sale MP4 listo
  para Instagram. Si el navegador no soporta H.264, baja WebM (convertilo con
  `ffmpeg -i in.webm -c:v libx264 -pix_fmt yuv420p out.mp4`).
- No requiere Python ni ffmpeg. El botón **"Ver demo"** arma paneles de ejemplo
  para previsualizar el ritmo sin cargar nada.

## Uso (script Python, MP4 H.264 directo)

```bash
python make_story.py               # captura → edición → export → QA
python make_story.py --skip-capture  # reusar crudos de build/raw
python make_story.py --only-qa       # solo QA sobre output/ actual
```

El entregable queda en `output/veredicto_story_estudio_penalista.mp4`.

## Privacidad — qué oculta

Configurable en `config.py`:

- **Selectores conocidos** (`SELECTOR_TARGETS`): foto del abogado (blur), botón
  flotante de WhatsApp (hide, expone el teléfono), enlaces `tel:`/`mailto:`/maps,
  banners de cookies y widgets de chat de terceros (hide).
- **Regex de texto** (`PII_TEXT_PATTERNS`): nombre completo, matrícula, teléfono,
  dirección, nombres de reseñadores y el dominio — se envuelven en un span
  difuminado **donde sea que aparezcan** en el DOM.
- **Fail-loud**: si un objetivo `required` no matchea, o si algún patrón queda
  **visible** (no difuminado/oculto), la captura aborta. No hay "grabar igual".

## Guion (línea de tiempo ~22s)

| Tiempo | Sección | Movimiento | Texto |
|--------|---------|-----------|-------|
| 0–3.5s | Hero | Ken Burns zoom-in | "Así quedó la web de un estudio penalista en Córdoba." |
| 3.5–9s | Áreas de trabajo | Paneo + highlights (2–3 ítems) | — |
| 9–13s | Servicios | Paneo | "Cada servicio tiene su propia página… (SEO)." |
| 13–17s | Reseñas | Zoom sobre 5.0★ | "5.0 en Google. La web muestra esa confianza…" |
| 17–22s | Contacto/CTA | Paneo, datos difuminados | Cierre fijo: "Hacemos esto para estudios jurídicos en Argentina. Bajo expectativa, sobre entrega." |

Sin fechas puntuales (para que no se desactualice en Destacadas). Audio AAC
silencioso: el video funciona muteado.

## Ajustes rápidos (`config.py`)

- Datos del sitio y objetivos PII → `pii_targets.local.json` (gitignored)
- `DEVICE_SCALE_FACTOR`, `SECTIONS` (estructura de captura)
- `AUTO_ACCENT` / `ACCENT_FALLBACK` (dorado sobrio por defecto)
- `SAFE_TOP` (250) / `SAFE_BOTTOM` (380) — franjas reservadas de Instagram
- `SIZE_LIMIT_MB` (15), `START_CRF` (23), `FPS` (30)

## Nota de entorno

Este paquete se corre en tu máquina (o en cualquier entorno con salida a
internet). En sandboxes con política de egress restringida puede estar bloqueado
el acceso al sitio objetivo y a los repos de paquetes — en ese caso, corré esto
localmente.
