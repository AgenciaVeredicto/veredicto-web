/*
 * build-prices.js
 *
 * Fuente unica de precios: prices.json
 * Reescribe las zonas marcadas de index.html a partir de ese archivo.
 *
 *   node build-prices.js          aplica los cambios
 *   node build-prices.js --check  solo verifica que index.html este al dia (no escribe)
 *
 * Zonas que regenera:
 *   - tarjetas de planes        <!-- precios:<id> --> ... <!-- /precios:<id> -->
 *   - <option> del formulario   <!-- precios:form --> ... <!-- /precios:form -->
 *   - JSON-LD (priceRange + hasOfferCatalog), por parseo, sin marcadores
 */

const fs = require('fs');
const path = require('path');

const DIR   = __dirname;
const DATA  = path.join(DIR, 'prices.json');
const HTML  = path.join(DIR, 'index.html');
const CHECK = process.argv.includes('--check');

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const TC   = data.exchangeRate;

if (!Number.isFinite(TC) || TC <= 0) {
  console.error('ERROR: exchangeRate invalido en prices.json');
  process.exit(1);
}

let html = fs.readFileSync(HTML, 'utf8');
const usesCRLF = html.indexOf('\r\n') !== -1;
html = html.replace(/\r\n/g, '\n');
const before = html;

/* ---------- helpers ---------- */
const ars = n => n.toLocaleString('es-AR');
const usd = n => Math.round(n / TC);
const byId = id => {
  const s = data.services.find(x => x.id === id);
  if (!s) { console.error('ERROR: no existe el servicio "' + id + '" en prices.json'); process.exit(1); }
  return s;
};

function writeRegion(id, content) {
  const open  = `<!-- precios:${id} -->`;
  const close = `<!-- /precios:${id} -->`;
  const i = html.indexOf(open);
  const j = html.indexOf(close);
  if (i === -1 || j === -1) {
    console.error(`ERROR: faltan los marcadores de "${id}" en index.html`);
    process.exit(1);
  }
  if (j < i) { console.error(`ERROR: marcadores cruzados en "${id}"`); process.exit(1); }
  html = html.slice(0, i + open.length) + content + html.slice(j);
}

/* ---------- 1. bloques de precio de las tarjetas con split ---------- */
function splitBlock(s, indent) {
  const p = ' '.repeat(indent);
  return `
${p}<div class="split-item">
${p}  <div class="split-label">Pago único</div>
${p}  <div class="split-price"><span class="cur">$</span>${ars(s.oneTime)}<span class="cur-badge">ARS</span></div>
${p}  <div class="price-intl">≈ <strong>USD ${usd(s.oneTime)}</strong></div>
${p}</div>
${p}<div class="split-sep"></div>
${p}<div class="split-item">
${p}  <div class="split-label">Gestión mensual <span style="font-size:10px;opacity:.7">(opcional)</span></div>
${p}  <div class="split-price"><span class="cur">$</span>${ars(s.monthly)}<span class="period">/mes</span><span class="cur-badge">ARS</span></div>
${p}  <div class="price-intl">≈ <strong>USD ${usd(s.monthly)}</strong><span class="period">/mo</span></div>
${p}</div>
${' '.repeat(indent - 2)}`;
}

writeRegion('plan1', splitBlock(byId('plan1'), 10));
writeRegion('plan2', splitBlock(byId('plan2'), 10));

/* ---------- 2. precio simple (Google Business) ---------- */
const gb = byId('gbusiness');
writeRegion('gbusiness', `
        <div class="split-label">Pago único</div>
        <div class="plan-unico-price">$${ars(gb.oneTime)}<span class="cur-badge">ARS</span></div>
        <div class="price-intl" style="margin-bottom:12px;">≈ <strong>USD ${usd(gb.oneTime)}</strong></div>
      `);

/* ---------- 3. servicios a cotizar ---------- */
const redes = byId('redes');
writeRegion('redes', `
        <div class="split-label">Planes a medida</div>
        <div class="plan-unico-price" style="margin-bottom:12px;">${redes.quoteLabel}</div>
      `);

const reno = byId('renovacion');
writeRegion('renovacion', `
        <div class="split-label">Precio</div>
        <div class="plan-unico-price" style="font-size:22px;">${reno.quoteLabel}</div>
        <div class="price-intl" style="margin-bottom:12px;opacity:.7;">${reno.quoteNote}</div>
      `);

/* ---------- 4. opciones del formulario ---------- */
function formOptions() {
  const out = ['<option value="">Seleccionar una opción</option>'];
  data.services.forEach(s => {
    if (s.oneTime != null) {
      out.push(`<option value="${s.id}">${s.formLabel} ($${ars(s.oneTime)} único)</option>`);
      if (s.monthly != null) {
        out.push(`<option value="${s.id}-abono">${s.formLabel.split(' · ')[0]} + Gestión mensual ($${ars(s.oneTime)} + $${ars(s.monthly)}/mes)</option>`);
      }
    } else {
      out.push(`<option value="${s.id}">${s.formLabel} (${s.formSuffix})</option>`);
    }
  });
  out.push('<option value="consulta">Solo quiero el diagnóstico gratuito</option>');
  return '\n' + out.map(o => '              ' + o).join('\n') + '\n            ';
}
writeRegion('form', formOptions());

/* ---------- 5. JSON-LD ---------- */
const ldRe = /(<script type="application\/ld\+json">\n)([\s\S]*?)(\n\s*<\/script>)/;
const ldM = html.match(ldRe);
if (!ldM) { console.error('ERROR: no se encontro el bloque JSON-LD'); process.exit(1); }

let ld;
try { ld = JSON.parse(ldM[2]); }
catch (e) { console.error('ERROR: el JSON-LD actual no parsea: ' + e.message); process.exit(1); }

const priced = data.services.filter(s => s.oneTime != null).map(s => s.oneTime);
ld.priceRange = `ARS ${ars(Math.min(...priced))} - ARS ${ars(Math.max(...priced))}`;
ld.hasOfferCatalog = {
  '@type': 'OfferCatalog',
  name: 'Servicios',
  itemListElement: data.services.filter(s => s.schema).map(s => {
    const offer = { '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name } };
    if (s.oneTime != null) { offer.price = String(s.oneTime); offer.priceCurrency = data.currency; }
    return offer;
  })
};

const ldText = JSON.stringify(ld, null, 2).split('\n').map(l => '  ' + l).join('\n');
html = html.replace(ldRe, (_, a, __, c) => a + ldText + c);

/* ---------- salida ---------- */
const changed = html !== before;

if (CHECK) {
  if (changed) {
    console.error('DESACTUALIZADO: index.html no coincide con prices.json. Corre: node build-prices.js');
    process.exit(1);
  }
  console.log('index.html esta al dia con prices.json');
  process.exit(0);
}

fs.writeFileSync(HTML, usesCRLF ? html.replace(/\n/g, '\r\n') : html, 'utf8');

console.log(`tipo de cambio unico: 1 USD = ${ars(TC)} ARS\n`);
console.log('servicio'.padEnd(28) + 'ARS'.padStart(12) + 'USD'.padStart(8));
console.log('-'.repeat(48));
data.services.forEach(s => {
  if (s.oneTime != null) {
    console.log((s.name + ' (único)').padEnd(28) + ars(s.oneTime).padStart(12) + String(usd(s.oneTime)).padStart(8));
  }
  if (s.monthly != null) {
    console.log((s.name + ' (mensual)').padEnd(28) + ars(s.monthly).padStart(12) + String(usd(s.monthly)).padStart(8));
  }
  if (s.oneTime == null) {
    console.log((s.name).padEnd(28) + (s.quoteLabel || 'a consultar').padStart(12) + '-'.padStart(8));
  }
});
console.log(`\nindex.html ${changed ? 'actualizado' : 'ya estaba al dia'}`);
