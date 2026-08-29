# Handoff · Agencia Veredicto

Documento de traspaso del sitio propio de la agencia. Pensado para que
cualquier persona (o sesión nueva) pueda retomar el trabajo sin arqueología.

**Última actualización:** 2026-08-29
**Producción:** https://agenciaveredicto.com
**Repo:** https://github.com/AgenciaVeredicto/veredicto-web (público)
**Commit de referencia:** `9ec093c`

> Este archivo vive en un repo público. No incluir tokens, claves ni datos
> internos de clientes.

---

## 1. Qué es Veredicto

Agencia de marketing jurídico en Córdoba, Argentina. Fundada en 2024.

Hace presencia digital para estudios profesionales: sitio web, posicionamiento
local en Google, ficha de Google Business y redes. El núcleo son los estudios
de abogados; también trabaja con estudios contables, escribanías y consultores.

**Posicionamiento:** especialización en el sector jurídico como diferenciador
frente a agencias generalistas. Precio publicado, entrega en días, sin abonos
obligatorios.

### Contacto publicado

| Canal | Valor |
|---|---|
| Email | agenciaveredicto@gmail.com |
| WhatsApp | +54 9 351 816 2771 |
| Teléfono | +54 351 869 5534 · +54 351 879 2024 |
| Horario | Lunes a viernes, 9 a 18 h |
| Instagram | https://www.instagram.com/agenciaveredicto/ |
| LinkedIn | https://www.linkedin.com/company/agenciaveredicto/ |
| Ubicación | Córdoba, Argentina |

Estos valores viven en **un solo lugar**: el objeto `SITE` en
`src/data/site.js`. De ahí salen el footer, la sección de contacto y el
JSON-LD. No hay que tocarlos en ningún otro archivo.

### Servicios y precios

| Servicio | ARS | USD (calculado) |
|---|---:|---:|
| Plan 01 · Landing Profesional | 190.000 único | 126 |
| Plan 01 · Gestión mensual (opcional) | 18.000/mes | 12 |
| Plan 02 · Sitio Completo + SEO | 310.000 único | 207 |
| Plan 02 · Gestión mensual (opcional) | 28.000/mes | 19 |
| Plan 03 · Gestión de Redes Sociales | a consultar | - |
| Adicional · Google Business | 55.000 único | 36 |
| Adicional · Renovación de sitio web | a consultar | - |

Los USD **no se escriben**: se calculan dividiendo por `exchangeRate` en
`prices.json` (hoy 1508 ARS/USD). Ver sección 5.

---

## 2. Stack

- **Astro 5** (sitio estático, sin framework de UI)
- **CSS nativo** con custom properties. Sin Tailwind ni preprocesadores.
- **@astrojs/sitemap** para el sitemap
- **@tabler/icons** para los íconos de marca (Instagram, LinkedIn)
- **Formspree** para el formulario (endpoint en `public/site.js`)
- **Cloudflare Pages** para hosting y deploy

Sin base de datos, sin backend, sin autenticación.

### Diseño

Fuentes: **Lora** (serif, títulos) + **Poppins** (sans, cuerpo), vía Google Fonts.

Tokens en `src/styles/global.css`:

```css
--ink:    #1C2B1E   /* verde muy oscuro: nav, footer, secciones oscuras */
--sage:   #4A7C59   /* acento principal */
--sage-l: #8BAF6E   /* acento claro, para fondos oscuros */
--cream:  #F7F5EF   /* fondo de página */
--paper:  #FFFFFF   /* tarjetas */
--line:   #E4E1D7   /* bordes */
--muted:  #5d6b5f   /* texto secundario */
```

**Convenciones de estilo vigentes** (respetarlas o el sitio pierde coherencia):

- Sin itálicas de color distinto. Todos los `em` de títulos son
  `font-style: normal; color: inherit`. El énfasis tipográfico se sacó a pedido.
- **Cero guiones largos y guiones medios** en texto visible. Usar guion
  normal, coma o punto.
- Los enlaces en texto corrido heredan el color del párrafo y se distinguen
  por un subrayado sage. Nunca azul del navegador.
- Radio de esquinas: 2-4px en todo el sitio.

---

## 3. Estructura del repo

```
astro.config.mjs          site, trailingSlash, sitemap
prices.json               FUENTE ÚNICA de precios
handoff.md                este archivo

public/                   se copia tal cual a la raíz del sitio
  site.js                 todo el JS del sitio (un archivo, sin bundler)
  _headers                headers de seguridad (Cloudflare)
  _redirects              301 hacia el dominio propio
  robots.txt
  favicon.svg
  og-image.png            1200x630 para previews sociales

src/
  data/site.js            SITE + services + areas. Todo el contenido vive acá.
  layouts/Base.astro      head, canonical, OG, JSON-LD, nav, footer
  components/
    Nav.astro             header + desplegable de áreas + menú mobile
    Footer.astro
    Social.astro          Instagram y LinkedIn (íconos de @tabler/icons)
    Emblem.astro          logo
    ContactRows.astro     email, WhatsApp, teléfonos, ubicación
    ContactForm.astro     formulario (opciones generadas desde prices.json)
    CtaSection.astro      bloque de contacto reutilizable
  pages/
    index.astro           home
    servicios/index.astro + [slug].astro
    areas/index.astro + [slug].astro
    contacto.astro
  styles/
    global.css            base heredada del sitio original
    components.css        se importa DESPUÉS: debe ganar la cascada
```

### Rutas (13)

```
/
/servicios/
/servicios/landing-profesional/
/servicios/sitio-web-completo-seo/
/servicios/gestion-de-redes-sociales/
/servicios/google-business/
/servicios/renovacion-de-sitio-web/
/areas/
/areas/abogados/                  (incluye 5 fueros como secciones con ancla)
/areas/estudios-contables/
/areas/escribanias/
/areas/consultores/
/contacto/
```

Todas terminan en barra (`trailingSlash: 'always'`).

---

## 4. Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run dev` levanta el servidor local en el puerto 4321. `npm run build`
genera `dist/`.

### Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name veredicto-web
```

Requiere las variables `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.
El token necesita permiso **Cloudflare Pages: Edit** con alcance de **cuenta**.
Un token con alcance "Specified Domains" falla con error 10000.

**También se despliega solo al hacer `git push` a `master`**, vía la
integración con GitHub. Ver la trampa 1 en la sección 6.

Para probar sin tocar producción:

```bash
npx wrangler pages deploy dist --project-name veredicto-web --branch astro-preview
```

Eso publica en `https://astro-preview.veredicto-web-bga.pages.dev`.

---

## 5. Cómo cambiar cosas

### Un precio o el tipo de cambio

Editar `prices.json` y correr `npm run build`. Se actualizan a la vez:

- las tarjetas de la home y de `/servicios/`
- la página de detalle de cada servicio
- las opciones del `select` del formulario
- el `priceRange` y el `hasOfferCatalog` del JSON-LD

**Es la única fuente.** Antes los precios estaban escritos a mano en tres
lugares y habían derivado a **cinco tipos de cambio distintos** (1273, 1286,
1310, 1498 y 1508: 18,5% de spread). Por eso existe este archivo.

### Un dato de contacto, un horario o una red social

Editar el objeto `SITE` en `src/data/site.js`.

### El texto de un servicio o de un área

`src/data/site.js`, en `serviceMeta` (servicios) o `areas` (rubros). Ahí están
también los `title` y `description` que usan las meta tags de cada página.

### Agregar una página

Crear el `.astro` en `src/pages/`. El canonical, el Open Graph y la entrada
del sitemap se generan solos. **No escribir URLs absolutas a mano.**

### Agregar un ítem al menú mobile

El CSS escalona la aparición de hasta 5 enlaces
(`.mobile-nav.open a:nth-child(n)`). Si se agrega un sexto, hay que extender
esa regla o aparece sin animación.

---

## 6. Trampas conocidas

Todas costaron un incidente real. Leerlas antes de tocar.

### 1. El auto-deploy de Cloudflare puede pisar un deploy bueno

El proyecto de Pages tiene integración con GitHub y `deployments_enabled: true`.
Cada `push` a `master` dispara un build.

Durante la migración a Astro ese build tenía el **build command vacío** y
publicaba la raíz del repo tal cual. Como el HTML pasó a generarse en `dist/`,
el push desplegó un sitio con **404 en todo** y pisó el deploy bueno hecho con
wrangler. El síntoma fue confuso: el deployment específico funcionaba, pero el
dominio servía el sitio viejo.

Configuración correcta (ya aplicada):

```
build command:    npm run build
output directory: dist
```

**Si se cambia la estructura del repo, revisar esa configuración antes de
pushear.**

### 2. Selectores de elemento desnudos

`global.css` tenía `nav { position: fixed; background: var(--ink) }`. Ese
selector agarra **cualquier** elemento `nav`, incluidos los seis breadcrumbs,
que están marcados como `nav` con `aria-label` porque es el marcado correcto
para migas de pan. Resultado: el breadcrumb quedaba fijo arriba de todo con
fondo verde oscuro, encima del header.

Las reglas del header están acotadas a `#mainNav`. **No volver a usar
selectores de elemento desnudos con `position` o `background`.**

Queda una instancia inerte: `footer { background: var(--ink) }`. Hoy no rompe
nada porque existe un solo `footer`, pero uno anidado se pintaría de verde
oscuro.

### 3. Orden de la cascada en el CSS

`components.css` se importa **después** de `global.css` a propósito. Reglas con
la misma especificidad: gana la última. Ya pasó que overrides responsive
quedaron antes de las reglas base y estaban muertos sin que se notara en
desktop: las tarjetas seguían en 2 columnas apretadas a 197px en mobile.

Si un override responsive no aplica, **revisar el orden antes que la
especificidad**.

### 4. El canonical no se escribe a mano

Sale de `Astro.url` en `Base.astro`. Hubo un bug en el que el canonical y el
`og:url` apuntaban a `veredicto-web.pages.dev`, un subdominio de staging que
ni siquiera era el del deploy real. Le estábamos diciendo a Google que la
versión oficial del sitio vivía ahí.

El mismo bug sobrevivió después en `robots.txt`, `sitemap.xml` y `_redirects`,
porque la verificación original solo miró `index.html`. **Al auditar URLs,
revisar también los archivos hermanos.**

### 5. Comillas y apóstrofes en JavaScript

Un apóstrofe dentro de un string con comillas simples rompió el bloque de
script entero. Como los elementos `.reveal` arrancan en `opacity: 0` y el
observer que los muestra vivía en ese script, **la página quedó completamente
en blanco**. Un error de sintaxis en el JS no degrada: apaga todo.

`public/site.js` ahora está blindado: cada bloque sale temprano si no
encuentra su elemento, porque en multipágina ninguno puede asumir que el hero,
el formulario o los contadores existen.

### 6. CRLF

Los archivos del repo están en CRLF. Cualquier script que haga
buscar-y-reemplazar con patrones multilínea tiene que normalizar a `\n` al
leer y restaurar al escribir, o los reemplazos no coinciden en silencio.

### 7. Las páginas de área no se dividen por fuero

Hay **cuatro** páginas de rubro (abogados, contables, escribanías,
consultores), no una por especialidad jurídica. Los cinco fueros (laboral,
familia, penal, accidentes, civil) son secciones con ancla dentro de
`/areas/abogados/`.

Es deliberado: páginas casi idénticas que solo cambian "laboralistas" por
"penalistas" son *doorway pages* según la política de spam de Google, y la
penalización no cae solo sobre esas páginas, arrastra al dominio.

---

## 7. SEO

- Canonical por ruta, generado (nunca a mano)
- 13 títulos y 13 meta descriptions únicos
- Open Graph completo, `twitter:card: summary_large_image` y `og-image.png`
- JSON-LD en todas las páginas: `ProfessionalService` (home), `Service`
  (servicios y áreas), `CollectionPage` (hubs), `ContactPage` (contacto)
- `sitemap-index.xml` generado en cada build desde las rutas reales
- `robots.txt` apuntando al sitemap del dominio propio
- Breadcrumbs con `aria-label` en todas las páginas internas
- `scroll-margin-top: 96px` en elementos con `id`, para que el header fijo no
  tape las anclas

**Regla de contenido:** no inventar testimonios, reseñas, cifras ni datos de
clientes. Hubo un pedido explícito al respecto. Las estadísticas publicadas
(80%, +50%, 3x, 7s) son las que ya venían en el sitio.

Coherencia que hay que sostener: la sección "Transparencia total en precios"
dice que *los planes* tienen precio publicado y que *los servicios a medida*
se cotizan antes de empezar. Antes afirmaba que **todos** los valores estaban
publicados, lo cual era falso porque hay dos servicios a consultar; además la
tarjeta de Renovación decía literalmente "Depende del alcance del proyecto"
mientras la promesa prometía "sin depende".

---

## 8. Pendientes

### Regresión de seguridad a resolver

El sitio original tenía un `Content-Security-Policy` declarado como
`meta http-equiv`. **Se perdió en la migración a Astro**: no se portó a
`Base.astro`. Los otros cinco headers de seguridad siguen vigentes porque
vienen de `public/_headers`.

Valor original, como referencia:

```
default-src 'self'; script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com; connect-src https://formspree.io;
img-src 'self' data:; object-src 'none';
```

Al restituirlo conviene ponerlo en `_headers` (header HTTP real, más fuerte
que el meta) y **probarlo antes**: Astro inyecta estilos inline, y el beacon
de analytics de Cloudflare quedaba bloqueado por esta misma política.

### Analytics no está midiendo

Cloudflare Pages inyecta su beacon (`static.cloudflareinsights.com`). Con el
CSP viejo quedaba bloqueado. Verificar si hoy mide, y contemplarlo al
restituir el CSP.

### Funcionalidad planificada

- **Blog** con listado, índice y entradas. Astro tiene content collections
  para esto; la estructura ya está lista para recibirlo.
- **Página de casos.**

### Higiene menor

- Acotar `footer { }` igual que se hizo con `#mainNav` (trampa 2)
- CSS muerto de una sección de prueba social que no existe en el sitio actual
  (`.caso-card`, `.caso-quote`, `.casos-grid`)

---

## 9. Verificaciones antes de publicar

```bash
npm run build
```

Y comprobar sobre `dist/`:

1. Cada `index.html` tiene un canonical igual a su propia URL
2. Títulos y meta descriptions únicos, ninguno vacío
3. Todos los bloques JSON-LD parsean
4. Cero enlaces internos rotos y cero páginas huérfanas
5. Cero referencias a `pages.dev` en el HTML
6. Cero guiones largos o medios en texto visible
7. Ningún selector de elemento desnudo con `position` fijo, absoluto o pegajoso
8. El JS pasa `node --check`

Después del deploy, verificar contra `https://agenciaveredicto.com` (no contra
la URL del deployment): que las 13 rutas den 200, que el sitemap y el
`robots.txt` respondan, y que `og-image.png` y `favicon.svg` existan.

**Advertencia sobre paneles de vista previa sin composición:** en entornos que
no componen frames, las transiciones CSS no avanzan y el `IntersectionObserver`
no dispara. Los `.reveal` aparecen con `opacity: 0` y el desplegable del nav
parece no abrirse, aunque en un navegador real funcionen. Para distinguir un
bug real de este artefacto: desactivar la transición
(`el.style.transition = 'none'`) y volver a medir, o comparar contra
producción, que es conocida buena.
