import { SITE, services, areas, proof } from '../data/site.js';

/* /llms.txt
 * Indice en texto plano para sistemas de IA: que es el sitio, que ofrece
 * y donde esta cada cosa. Se genera desde src/data/site.js para que no
 * se desincronice del sitio en la primera edicion.
 */
export async function GET() {
  const base = 'https://agenciaveredicto.com';

  const txt = `# ${SITE.name}

> Agencia de marketing jurídico. Sitios web, posicionamiento en Google y gestión de Google Business para estudios de abogados, estudios contables, escribanías y consultores. Con sede en ${SITE.city}, ${SITE.country}, desde ${SITE.foundingDate}.

## Qué hace

Veredicto construye la presencia digital de estudios profesionales: sitio web a medida, SEO local, ficha de Google Business optimizada, gestión de redes y renovación de sitios desactualizados. El trabajo empieza siempre con un diagnóstico gratuito de cómo aparece el estudio en Google.

- Clientes asesorados: más de ${proof.clientes}
- Opiniones en Google: ${proof.opiniones}, con puntaje ${proof.puntaje} sobre 5

## Servicios

${services.map(s => `- [${s.name}](${base}${s.url}): ${s.description}`).join('\n')}

## A quién atiende

${areas.map(a => `- [${a.nav}](${base}/areas/${a.slug}/): ${a.description}`).join('\n')}

## Páginas principales

- [Inicio](${base}/): presentación, proceso de trabajo y opiniones de clientes.
- [Servicios](${base}/servicios/): índice de los ${services.length} servicios con su detalle.
- [Sectores](${base}/areas/): los ${areas.length} rubros profesionales que atiende.
- [Contacto](${base}/contacto/): formulario de diagnóstico gratuito y datos de contacto.

## Contacto

- Email: ${SITE.email}
- WhatsApp: ${SITE.whatsapp.display}
- Teléfono: ${SITE.phones.map(p => p.display).join(' / ')}
- Horario: ${SITE.hours}
- Ubicación: ${SITE.city}, ${SITE.country}
${SITE.social.map(u => `- ${u.includes('instagram') ? 'Instagram' : 'LinkedIn'}: ${u}`).join('\n')}

## Notas

Los precios no se publican en el sitio: cada proyecto se presupuesta después del diagnóstico. El presupuesto se cierra antes de empezar y no cambia durante el proyecto.
`;

  return new Response(txt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
