import prices from '../../prices.json';

export const SITE = {
  name: 'Agencia Veredicto',
  titleBase: 'Agencia Veredicto',
  locale: 'es_AR',
  city: 'Córdoba',
  country: 'Argentina',
  email: 'agenciaveredicto@gmail.com',
  whatsapp: { display: '+54 9 351 816 2771', e164: '+5493518162771', link: '5493518162771' },
  phones: [
    { display: '+54 351 869 5534', e164: '+543518695534' },
    { display: '+54 351 879 2024', e164: '+543518792024' }
  ],
  hours: 'Lunes a viernes, 9 a 18 h',
  social: [
    'https://www.instagram.com/agenciaveredicto/',
    'https://www.linkedin.com/company/agenciaveredicto/'
  ],
  foundingDate: '2024'
};

export const TC = prices.exchangeRate;
export const ars = n => n.toLocaleString('es-AR');
export const usd = n => Math.round(n / TC);

/* ---------- SERVICIOS ----------
 * El slug, el nombre y el precio salen de prices.json: una sola fuente.
 */
const serviceMeta = {
  plan1: {
    slug: 'landing-profesional',
    title: 'Landing Profesional para estudios jurídicos',
    description:
      'Sitio web de una página para estudios de abogados: diseño a medida, textos propios, dominio y hosting incluidos. Publicado en menos de 7 días hábiles.',
    lead: 'Para el estudio que quiere una presencia digital sólida y en funcionamiento en días.',
    intro:
      'Una página bien resuelta rinde más que un sitio grande a medio terminar. Diseñamos la landing completa del estudio: quiénes son, qué hacen, por qué confiar y cómo contactarlos. Sin plantillas genéricas y sin textos de relleno.',
    features: [
      'Diseño personalizado de una página',
      'Secciones: Presentación · Áreas de práctica · Quiénes somos · Contacto',
      'Redacción de todos los textos a medida del estudio',
      'Dominio .com + hosting por 12 meses incluidos',
      'Formulario de contacto directo al email',
      'Versión mobile optimizada desde el primer día',
      'Certificado SSL (https) incluido',
      'Entrega en menos de 7 días hábiles'
    ],
    forWho: [
      'Estudios que hoy no tienen sitio y necesitan uno ya',
      'Profesionales que sólo usan redes y quieren un lugar propio',
      'Quien necesita algo serio para mostrar, sin un proyecto largo'
    ]
  },
  plan2: {
    slug: 'sitio-web-completo-seo',
    title: 'Sitio web completo con SEO para abogados',
    description:
      'Sitio multipágina para estudios jurídicos con posicionamiento en Google: SEO on-page, indexación, blog y Google Business optimizado.',
    lead: 'Para el estudio que quiere aparecer en Google cuando sus clientes lo buscan.',
    intro:
      'Tener sitio no es lo mismo que aparecer. Este plan agrega lo que hace que Google entienda de qué trabaja el estudio y lo muestre cuando alguien busca en la zona: estructura de varias páginas, SEO local y una ficha de Google Business trabajada.',
    features: [
      'Todo lo incluido en el Plan Landing',
      'Múltiples páginas: Inicio · Áreas · Sobre el estudio · Blog · Contacto',
      'Indexación en Google (Search Console + sitemap)',
      'SEO on-page: palabras clave locales, meta tags, velocidad',
      'Perfil de Google Business creado y optimizado',
      'Blog listo para publicar, con la primera entrada cargada',
      'Integración con WhatsApp y redes del estudio',
      'Capacitación para que el estudio cargue su propio contenido'
    ],
    forWho: [
      'Estudios que compiten con otros por las mismas búsquedas',
      'Quien quiere consultas entrantes y no sólo una tarjeta digital',
      'Estudios con varias áreas de práctica que explicar por separado'
    ]
  },
  redes: {
    slug: 'gestion-de-redes-sociales',
    title: 'Gestión de redes sociales para estudios jurídicos',
    description:
      'Contenido y comunidad para estudios de abogados: diseño de publicaciones, calendario de contenidos y métricas mensuales.',
    lead: 'Contenido y comunidad para tu estudio.',
    intro:
      'Gestionamos la presencia del estudio en redes sociales con contenido profesional y una estrategia pensada para el sector jurídico. Trabajamos con distintos planes según los objetivos, las redes y el volumen de contenido.',
    features: [
      'Diseño de publicaciones',
      'Calendario de contenidos',
      'Gestión de comunidad',
      'Informe de métricas mensual'
    ],
    forWho: [
      'Estudios que ya tienen sitio y quieren sostener presencia',
      'Profesionales sin tiempo para publicar con constancia',
      'Quien necesita mostrar autoridad en su área'
    ]
  },
  gbusiness: {
    slug: 'google-business',
    title: 'Google Business optimizado para estudios y profesionales',
    description:
      'Creación y optimización del perfil de Google Business: aparecé en el mapa cuando alguien busca un profesional en tu ciudad.',
    lead: 'Solo o combinado con cualquier plan.',
    intro:
      'Creamos o reclamamos el perfil de Google Business del estudio y lo optimizamos por completo: descripción, categorías, fotos, horarios y preguntas frecuentes. El estudio empieza a aparecer en el mapa cuando alguien busca "abogado en Córdoba", o en cualquier ciudad del país.',
    features: [
      'Creación o reclamo del perfil',
      'Categorías y descripción optimizadas',
      'Carga de fotos y horarios',
      'Preguntas frecuentes cargadas',
      'Palabras clave locales aplicadas al perfil'
    ],
    forWho: [
      'Estudios con oficina física que reciben consultas de la zona',
      'Profesionales que no aparecen en el mapa de Google',
      'Quien tiene ficha creada pero incompleta o sin trabajar'
    ]
  },
  renovacion: {
    slug: 'renovacion-de-sitio-web',
    title: 'Renovación de sitio web para estudios profesionales',
    description:
      'Rediseño de sitios desactualizados: nuevo diseño, textos actualizados, velocidad optimizada y SEO local corregido.',
    lead: 'Para estudios que ya tienen sitio pero necesitan actualizarlo.',
    intro:
      'Analizamos el sitio actual, identificamos qué está frenando las consultas y lo rediseñamos desde cero conservando lo que funciona. Nuevo diseño, textos actualizados, velocidad optimizada y SEO local corregido. Ideal para estudios con presencia antigua que no genera resultados.',
    features: [
      'Auditoría del sitio actual',
      'Rediseño completo conservando lo que funciona',
      'Textos revisados y actualizados',
      'Velocidad de carga optimizada',
      'SEO local corregido',
      'Migración sin perder posicionamiento'
    ],
    forWho: [
      'Estudios con un sitio de hace años que no genera consultas',
      'Sitios que no se ven bien en celular',
      'Quien tiene un sitio lento o que no aparece en Google'
    ]
  }
};

export const services = prices.services.map(s => ({
  ...s,
  ...serviceMeta[s.id],
  url: `/servicios/${serviceMeta[s.id].slug}/`
}));

export const serviceBySlug = slug => services.find(s => s.slug === slug);

/* ---------- AREAS / PUBLICO ----------
 * Cuatro paginas por profesion, no una por fuero: paginas casi identicas
 * que solo cambian la especialidad son doorway pages para Google.
 * Los fueros viven como secciones dentro de /areas/abogados/.
 */
export const areas = [
  {
    slug: 'abogados',
    nav: 'Abogados',
    navDesc: 'Laboral, familia, penal, accidentes y civil',
    title: 'Marketing digital para estudios de abogados',
    description:
      'Sitios web y posicionamiento en Google para estudios jurídicos en Argentina. Trabajamos con abogados laboralistas, penalistas, de familia, sucesiones y accidentes.',
    heading: 'Estudios de<br><em>abogados.</em>',
    lead: 'Es el núcleo de lo que hacemos. Conocemos el vocabulario, las búsquedas y las dudas de los clientes de estudios jurídicos argentinos.',
    intro:
      'Un cliente que necesita un abogado no busca "estudio jurídico integral". Busca "abogado laboralista en Córdoba", "cuánto sale un divorcio" o "qué hago si me despidieron". Esa diferencia entre cómo habla el estudio y cómo busca el cliente es la que trabajamos.',
    fueros: [
      {
        id: 'laboral',
        name: 'Derecho laboral',
        text: 'Despidos, accidentes de trabajo, ART y reclamos salariales. Son búsquedas con urgencia y alto volumen: el cliente consulta el mismo día que le pasa algo, y llama al primero que aparece con aspecto confiable.'
      },
      {
        id: 'familia',
        name: 'Familia y sucesiones',
        text: 'Divorcios, cuota alimentaria, régimen de comunicación y sucesiones. El cliente llega sensible y comparando; el sitio tiene que transmitir trato humano además de solvencia técnica.'
      },
      {
        id: 'penal',
        name: 'Derecho penal',
        text: 'Excarcelaciones, defensas y urgencias que se resuelven por teléfono a cualquier hora. Acá pesa que el contacto esté visible al instante y que el estudio proyecte experiencia.'
      },
      {
        id: 'accidentes',
        name: 'Accidentes y daños',
        text: 'Accidentes de tránsito, daños y perjuicios y reclamos a aseguradoras. Es el área con más competencia por publicidad, donde el posicionamiento orgánico y la ficha de Google marcan la diferencia.'
      },
      {
        id: 'civil',
        name: 'Civil y comercial',
        text: 'Contratos, desalojos, cobros y conflictos societarios. El cliente suele ser una empresa o un particular informado, que evalúa el sitio como señal de seriedad antes de escribir.'
      }
    ]
  },
  {
    slug: 'estudios-contables',
    nav: 'Estudios contables',
    navDesc: 'Monotributo, sueldos y balances',
    title: 'Marketing digital para estudios contables y contadores',
    description:
      'Sitios web y Google Business para estudios contables en Argentina. Presencia profesional para captar monotributistas, pymes y empresas.',
    heading: 'Estudios<br><em>contables.</em>',
    lead: 'Contadores y estudios que necesitan que los encuentren cuando alguien busca ayuda con impuestos, monotributo o balances.',
    intro:
      'La búsqueda de un contador es casi siempre local y estacional: sube con los vencimientos, las recategorizaciones y los cierres de ejercicio. Un perfil de Google Business bien trabajado y un sitio que explique los servicios con claridad capturan esa demanda cuando aparece.',
    puntos: [
      'Monotributo, recategorizaciones y altas',
      'Liquidación de sueldos y cargas sociales',
      'Balances y cierres de ejercicio',
      'Asesoramiento impositivo a pymes'
    ]
  },
  {
    slug: 'escribanias',
    nav: 'Escribanías',
    navDesc: 'Escrituras, poderes y certificaciones',
    title: 'Marketing digital para escribanías',
    description:
      'Sitios web y posicionamiento local para escribanías en Argentina. Presencia digital para escrituras, poderes y certificaciones.',
    heading: '<em>Escribanías.</em>',
    lead: 'Escribanías que quieren aparecer cuando alguien necesita escriturar, firmar un poder o certificar documentación.',
    intro:
      'Quien busca una escribanía suele estar en medio de una operación concreta y con plazos: una compraventa, un poder que hay que firmar esta semana, una certificación que le pidieron. Busca por cercanía y decide rápido, así que la ficha en el mapa y la claridad del sitio pesan más que en otros rubros.',
    puntos: [
      'Escrituras de compraventa e hipotecas',
      'Poderes generales y especiales',
      'Certificación de firmas y documentos',
      'Constitución de sociedades'
    ]
  },
  {
    slug: 'consultores',
    nav: 'Consultores',
    navDesc: 'Gestión, RRHH y asesoramiento técnico',
    title: 'Marketing digital para consultores y servicios profesionales',
    description:
      'Sitios web y presencia digital para consultores independientes y firmas de servicios profesionales en Argentina.',
    heading: '<em>Consultores.</em>',
    lead: 'Profesionales independientes y firmas de consultoría que venden criterio, y necesitan que eso se note antes de la primera reunión.',
    intro:
      'En consultoría el sitio no cierra la venta: la habilita. El cliente potencial llega por una recomendación o por LinkedIn, y entra a verificar que haya alguien serio del otro lado. Si lo que encuentra es una página vieja o directamente nada, la recomendación se enfría.',
    puntos: [
      'Consultoría de gestión y procesos',
      'Recursos humanos y selección',
      'Higiene y seguridad laboral',
      'Asesoramiento técnico especializado'
    ]
  }
];

export const areaBySlug = slug => areas.find(a => a.slug === slug);
