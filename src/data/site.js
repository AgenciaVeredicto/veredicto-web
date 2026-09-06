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
  // El huso va explicito: sin el, "8 a 20" es una promesa rota para
  // cualquiera que llame desde Espana, que esta 4 o 5 horas adelante.
  hours: 'Lunes a viernes, 8 a 20 h (GMT-3)',
  hoursOpen: '08:00',
  hoursClose: '20:00',
  social: [
    'https://www.instagram.com/agenciaveredicto/',
    'https://www.linkedin.com/company/agenciaveredicto/'
  ],
  foundingDate: '2024'
};

/* ---------- PRUEBA SOCIAL ----------
 * Opiniones textuales del perfil de Google Business, transcritas literalmente.
 * Lo unico que se toco es la mayuscula inicial donde faltaba.
 * Las 6 restantes del perfil son solo estrellas, sin texto: cuentan para el
 * total pero no pueden ir como testimonio.
 *
 * No se marca AggregateRating en el JSON-LD: Google no admite calificaciones
 * que un negocio publica sobre si mismo en su propio sitio.
 */
export const proof = {
  clientes: 65,
  opiniones: 13,
  puntaje: '5,0'
};

export const opiniones = [
  { nombre: 'Pilar Arguello',   texto: 'Excelente trabajo, muy predispuestos y un trato muy personal para la necesidad de cada estudio.' },
  { nombre: 'Francisco Tagle',  texto: 'Este es mi segundo mes y la verdad 0 quejas, solo puedo decir que gracias por el servicio.' },
  { nombre: 'Brisa Armando',    texto: 'Totalmente recomendado. Los chicos súper comprometidos y atentos.' },
  { nombre: 'Lautaro Alladio',  texto: 'Muy buena agencia, siempre respondiendo con mucha amabilidad. Excelente.' },
  { nombre: 'Ambar Bruna',      texto: 'Muy profesionales. Excelente atención.' },
  { nombre: 'Matías Alincastro',texto: 'Muy serios y responsables.' }
];

/* ---------- PREGUNTAS FRECUENTES ----------
 * Redactadas desde cero. Se descartaron las del sitio de referencia que no
 * aplican (trabajar con cualquier rubro, por ejemplo, es lo contrario de lo
 * que hace Veredicto) y se sumaron las que salen de su realidad: el
 * diagnostico gratuito, la especializacion y el trabajo fuera del pais.
 */
export const faq = [
  {
    q: '¿Qué es el posicionamiento en IA y por qué debería importarme?',
    a: 'El posicionamiento en IA, o GEO, es el trabajo de lograr que sistemas como ChatGPT, Gemini o Perplexity nombren a tu estudio cuando alguien les pregunta por un profesional de tu especialidad. Se consigue con contenido que el modelo pueda entender, datos verificables y una identidad consistente entre el sitio y los perfiles. Importa porque cada vez más gente le pregunta a un asistente en lugar de buscar en Google, y esos sistemas responden citando fuentes: o sos una de esas fuentes, o no aparecés.'
  },
  {
    q: '¿Reemplaza al SEO de siempre?',
    a: 'No, se apoya en él. Un sitio que Google no entiende tampoco lo entiende un modelo de lenguaje: la base técnica es la misma. Lo que cambia es cómo se escribe. Los buscadores premian páginas que posicionan; los modelos citan párrafos que responden una pregunta completa por sí solos, sin necesitar el resto del texto.'
  },
  {
    q: '¿Cómo sé si hoy aparezco en las respuestas de IA?',
    a: 'Se comprueba preguntando. Antes de proponer nada consultamos ChatGPT, Gemini, Perplexity y Copilot por tu especialidad y tu ciudad, y anotamos quién aparece y quién no. Ese registro es el punto de partida contra el que después se mide si algo funcionó.'
  },
  {
    q: '¿Qué incluye el diagnóstico gratuito?',
    a: 'Revisamos en qué posición aparece tu estudio para las búsquedas que te interesan, el estado de tu ficha de Google Business, la velocidad y la estructura del sitio actual si ya hay uno, si figurás en respuestas de IA, y qué está haciendo la competencia de tu zona. Te devolvemos qué cambiaríamos y en qué orden. Sin compromiso de contratar nada.'
  },
  {
    q: '¿Cuánto tarda en verse resultados?',
    a: 'Las correcciones técnicas se reflejan en semanas. El posicionamiento orgánico y las menciones en IA son otra escala: entre tres y seis meses de trabajo sostenido, y depende mucho de cuánta competencia haya en tu especialidad. Si alguien te promete el primer puesto en treinta días, te está vendiendo humo.'
  },
  {
    q: '¿Trabajan con cualquier rubro?',
    a: 'No, y es a propósito. Solo trabajamos con servicios profesionales: estudios jurídicos, estudios contables, escribanías y consultores. Es lo que nos permite conocer el vocabulario, las búsquedas y las dudas reales de tus clientes en lugar de improvisarlas en cada proyecto.'
  },
  {
    q: 'Ya tengo sitio web y agencia. ¿Sirve igual?',
    a: 'Sí, y suele ser el caso más frecuente. No hace falta rehacer nada: se puede sumar la capa de posicionamiento en IA sobre lo que ya está funcionando, o corregir lo puntual que esté frenando las consultas. Si tu proveedor actual hace bien su trabajo, trabajamos sobre eso y no en contra.'
  },
  {
    q: '¿Puedo contratar solo una parte?',
    a: 'Sí. Se puede empezar por la ficha de Google Business, por la renovación del sitio actual o por el trabajo de posicionamiento en IA por separado. El diagnóstico define qué conviene primero según tu situación, y desde ahí armamos el alcance.'
  },
  {
    q: '¿Hace falta que entienda de tecnología?',
    a: 'No. La parte técnica es nuestra y te la explicamos en castellano, no en jerga. Lo que sí hace falta es el conocimiento de tu profesión: qué consultas te llegan, qué preguntan tus clientes antes de contratarte, qué tipo de casos te interesa atraer. Eso no lo podemos inventar.'
  },
  {
    q: '¿Trabajan fuera de Argentina?',
    a: 'Sí. El trabajo es íntegramente remoto y ya atendemos fuera del país. La comunicación es por videollamada, WhatsApp y correo, de lunes a viernes de 8 a 20 (GMT-3), y coordinamos los horarios según el huso de cada cliente.'
  }
];

/* Migas de pan en schema. Existian a la vista pero sin marcado: es lo que
 * hace que Google muestre la ruta en el resultado en vez de la URL cruda.
 * Recibe [['Inicio','/'], ['Servicios','/servicios/'], ['Nombre', null]].
 */
export const breadcrumb = pasos => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: pasos.map(([name, url], i) => {
    const item = { '@type': 'ListItem', position: i + 1, name };
    if (url) item.item = `https://agenciaveredicto.com${url}`;
    return item;
  })
});

export const TC = prices.exchangeRate;
export const ars = n => n.toLocaleString('es-AR');
export const usd = n => Math.round(n / TC);

/* ---------- SERVICIOS ----------
 * El slug, el nombre y el precio salen de prices.json: una sola fuente.
 */
const serviceMeta = {
  plan1: {
    slug: 'landing-profesional',
    title: 'Landing Profesional para estudios y consultorios',
    description:
      'Sitio web de una página para estudios y consultorios: diseño a medida, textos propios, dominio y hosting incluidos. Publicado en menos de 7 días hábiles.',
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
    title: 'Sitio web completo con SEO y posicionamiento en IA',
    description:
      'Sitio multipágina para estudios profesionales con posicionamiento en Google y en respuestas de IA: SEO on-page, datos estructurados, blog y Google Business optimizado.',
    lead: 'Para el estudio que quiere aparecer cuando sus clientes buscan, en Google y en las respuestas de IA.',
    intro:
      'Tener sitio no es lo mismo que aparecer. Este plan agrega lo que hace que Google entienda de qué trabaja el estudio y lo muestre cuando alguien busca en la zona. Y desde ahora incluye la preparación para que también lo puedan citar ChatGPT, Gemini y Perplexity, que es por donde cada vez más gente empieza a buscar.',
    features: [
      'Todo lo incluido en el Plan Landing',
      'Múltiples páginas: Inicio · Áreas · Sobre el estudio · Blog · Contacto',
      'Indexación en Google (Search Console + sitemap)',
      'SEO on-page: palabras clave locales, meta tags, velocidad',
      'Perfil de Google Business creado y optimizado',
      'Blog listo para publicar, con la primera entrada cargada',
      'Integración con WhatsApp y redes del estudio',
      'Capacitación para que el estudio cargue su propio contenido',
      'Preparación para búsqueda con IA: datos estructurados, contenido citable y archivo llms.txt',
      'Informe inicial de visibilidad en ChatGPT, Gemini, Perplexity y Copilot'
    ],
    forWho: [
      'Estudios que compiten con otros por las mismas búsquedas',
      'Quien quiere consultas entrantes y no sólo una tarjeta digital',
      'Estudios con varias áreas de práctica que explicar por separado'
    ]
  },
  redes: {
    slug: 'gestion-de-redes-sociales',
    title: 'Gestión de redes sociales para servicios profesionales',
    description:
      'Contenido y comunidad para estudios y consultorios: diseño de publicaciones, calendario de contenidos y métricas mensuales.',
    lead: 'Contenido y comunidad para tu estudio.',
    intro:
      'Gestionamos la presencia del estudio en redes sociales con contenido profesional y una estrategia pensada para servicios profesionales. Trabajamos con distintos planes según los objetivos, las redes y el volumen de contenido.',
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

/* ---------- PROFUNDIDAD POR SERVICIO ----------
 * Proceso, plazos, que aporta el cliente y preguntas propias.
 * Es lo que hace que una pagina de servicio compita: responde lo que la
 * persona realmente pregunta antes de contratar, y son respuestas
 * autocontenidas, que es el formato que citan los sistemas de IA.
 */
export const detalle = {
  plan1: {
    plazo: '7 días hábiles desde que recibimos los textos y las fotos.',
    proceso: [
      ['Diagnóstico', 'Revisamos cómo aparece hoy el estudio y qué necesita la página para convertir. Sale un documento con la propuesta de estructura.'],
      ['Contenido', 'Redactamos todos los textos. No hace falta que los escriba el cliente: se hacen a partir de una entrevista de una hora.'],
      ['Diseño y desarrollo', 'Se arma la página completa, con versión móvil desde el primer día. Se muestra en un enlace privado para revisar antes de publicar.'],
      ['Publicación', 'Dominio, hosting y certificado de seguridad configurados. La página queda online y el formulario probado.']
    ],
    aportas: [
      'Una hora de entrevista para entender el estudio',
      'Logo si existe, o lo diseñamos aparte',
      'Fotos del equipo y del lugar, si las hay'
    ],
    faq: [
      { q: '¿Sirve una sola página o conviene un sitio completo?', a: 'Para un estudio que hoy no tiene nada, una página bien resuelta rinde más que un sitio grande a medio terminar. Si el objetivo es competir por búsquedas en Google, ahí sí conviene el Plan 02, que agrega estructura de varias páginas y trabajo de posicionamiento.' },
      { q: '¿Qué pasa después de los 12 meses de hosting?', a: 'Se renueva el hosting y el dominio a precio de costo, o se puede migrar el sitio a la cuenta del estudio sin cargo. La página es del cliente, no queda atada a nosotros.' },
      { q: '¿Puedo editar los textos yo después?', a: 'Sí. Se entrega con acceso y una capacitación corta para cambiar textos, fotos y datos de contacto sin depender de nadie.' }
    ]
  },
  plan2: {
    plazo: '3 a 4 semanas. El posicionamiento empieza a moverse a partir del tercer mes.',
    proceso: [
      ['Diagnóstico y palabras clave', 'Analizamos qué busca la gente en la zona y en la especialidad, y qué está haciendo la competencia. De ahí sale la estructura de páginas.'],
      ['Arquitectura y contenido', 'Una página por área de práctica o servicio, escritas para responder lo que la gente pregunta. Es lo que permite competir por más de una búsqueda.'],
      ['Desarrollo y datos estructurados', 'Sitio completo, con schema, sitemap y la preparación para que los sistemas de IA puedan citarlo.'],
      ['Indexación y Google Business', 'Alta en Search Console, ficha de Google Business optimizada y medición configurada.'],
      ['Medición', 'Informe inicial de posiciones y de visibilidad en ChatGPT, Gemini, Perplexity y Copilot, contra el que se compara después.']
    ],
    aportas: [
      'Dos horas de entrevista, en una o dos sesiones',
      'Acceso a la ficha de Google Business si ya existe',
      'Fotos del equipo y del lugar',
      'Definir qué tipo de consultas interesa atraer'
    ],
    faq: [
      { q: '¿En cuánto tiempo aparezco primero en Google?', a: 'Nadie puede garantizar una posición ni una fecha. Lo que sí se puede decir: las correcciones técnicas se reflejan en semanas, y el posicionamiento orgánico se mueve entre el tercer y el sexto mes, según cuánta competencia haya en la especialidad y la ciudad.' },
      { q: '¿Qué diferencia hay con el Plan 01?', a: 'El Plan 01 es una página que presenta al estudio. El Plan 02 es una estructura pensada para competir por búsquedas: varias páginas, trabajo de palabras clave, datos estructurados, Google Business y preparación para búsqueda con IA.' },
      { q: '¿Incluye escribir el blog todos los meses?', a: 'No. Incluye el blog listo para publicar y la primera entrada cargada, más la capacitación para que el estudio publique. La redacción mensual es parte de la gestión, que se contrata aparte.' },
      { q: '¿Qué es el posicionamiento en IA que incluye?', a: 'Dejamos el sitio en condiciones de que ChatGPT, Gemini o Perplexity puedan entenderlo y citarlo: datos estructurados, contenido que responde preguntas de forma autónoma, identidad consistente entre el sitio y los perfiles, y un archivo llms.txt. Y entregamos el informe de dónde aparece hoy el estudio en esos sistemas.' }
    ]
  },
  redes: {
    plazo: 'El primer calendario de contenidos se entrega a los 10 días.',
    proceso: [
      ['Estrategia', 'Definimos a quién le hablamos, con qué tono y con qué frecuencia, según los objetivos del estudio.'],
      ['Calendario', 'Se planifica el mes completo por adelantado y se aprueba antes de publicar. Nada sale sin revisión.'],
      ['Producción', 'Diseño de las piezas y redacción de los textos, con la identidad visual del estudio.'],
      ['Comunidad e informe', 'Respuesta a comentarios y mensajes, más un informe mensual de qué funcionó y qué no.']
    ],
    aportas: [
      'Aprobación del calendario antes de cada mes',
      'Material propio cuando lo haya: fotos, novedades, casos',
      'Un canal rápido para consultas de la comunidad'
    ],
    faq: [
      { q: '¿Qué redes conviene para un profesional?', a: 'Depende del cliente que se busca. Para captación de particulares suele rendir Instagram; para clientes empresa, LinkedIn. Trabajar bien una sola rinde más que sostener tres a medias.' },
      { q: '¿Publican sin que yo revise?', a: 'No. El calendario del mes se aprueba antes de que salga la primera pieza. Si algo no convence, se cambia antes de publicar.' },
      { q: '¿Puedo contratar redes sin tener sitio web?', a: 'Se puede, pero rinde menos. Las redes generan interés y el sitio es donde ese interés se convierte en consulta. Sin un lugar al que mandar a la gente, se pierde buena parte del esfuerzo.' }
    ]
  },
  gbusiness: {
    plazo: '5 días hábiles. La verificación de Google puede sumar 1 o 2 semanas más, y no depende de nosotros.',
    proceso: [
      ['Reclamo o creación', 'Si la ficha existe pero no está a nombre del estudio, se reclama. Si no existe, se crea desde cero.'],
      ['Optimización', 'Categorías correctas, descripción trabajada con las búsquedas de la zona, horarios, servicios y preguntas frecuentes cargadas.'],
      ['Fotos y contenido', 'Carga de imágenes del lugar y del equipo, que es lo que más incide en que alguien elija un perfil sobre otro.'],
      ['Reseñas', 'Se deja configurado el enlace directo para pedir reseñas y se explica cómo pedirlas sin resultar invasivo.']
    ],
    aportas: [
      'Acceso a la ficha si ya está creada',
      'Fotos del lugar, la fachada y el equipo',
      'Horarios reales de atención'
    ],
    faq: [
      { q: '¿Sirve si atiendo solo con turno y no recibo gente sin aviso?', a: 'Sí. Google permite fichas de negocios que atienden con cita previa, e incluso sin dirección visible al público. Lo importante es aparecer en el mapa cuando alguien busca la especialidad en la zona.' },
      { q: '¿Cuántas reseñas necesito?', a: 'No hay un número mágico. Lo que más pesa es que sean recientes, constantes en el tiempo y que el negocio responda. Diez reseñas repartidas en el año rinden más que treinta el mismo día.' },
      { q: '¿Puedo hacerlo yo mismo?', a: 'Sí, la ficha es gratuita y cualquiera puede crearla. Lo que aporta el servicio es la elección de categorías, cómo se escribe la descripción y qué se carga, que es donde se define si aparecés o no en el mapa.' }
    ]
  },
  renovacion: {
    plazo: '2 a 3 semanas, según el tamaño del sitio actual.',
    proceso: [
      ['Auditoría', 'Revisamos qué funciona, qué está frenando las consultas y qué posiciones tiene hoy el sitio en Google. Nada se tira sin saber qué rinde.'],
      ['Plan de migración', 'Se define qué contenido se conserva, qué se reescribe y qué URLs hay que redirigir para no perder posicionamiento.'],
      ['Rediseño', 'Diseño nuevo con la identidad actualizada, versión móvil y velocidad de carga corregida.'],
      ['Migración y control', 'Publicación con las redirecciones configuradas y seguimiento de las posiciones durante las semanas siguientes.']
    ],
    aportas: [
      'Acceso al sitio actual y al panel del dominio',
      'Qué del sitio viejo querés conservar',
      'Acceso a las métricas si las hay'
    ],
    faq: [
      { q: '¿Voy a perder el posicionamiento que ya tengo?', a: 'No, si la migración se hace bien. Se mapean las URLs viejas a las nuevas con redirecciones permanentes y se vigilan las posiciones después de publicar. El riesgo real de perder posiciones aparece cuando se cambia de sitio sin redirigir nada.' },
      { q: '¿Se puede rescatar el sitio actual en vez de rehacerlo?', a: 'A veces sí, y lo decimos en la auditoría. Si el problema es de velocidad, textos o estructura, puede salir más barato corregir. Si está hecho sobre una base que no se puede sostener, rehacerlo cuesta menos que parcharlo.' },
      { q: '¿Qué pasa con el correo del dominio?', a: 'No se toca. La renovación afecta al sitio, no a las casillas de correo, que siguen funcionando igual durante y después de la migración.' }
    ]
  }
};

/* ---------- ENLACES SEMANTICOS ENTRE SERVICIOS ----------
 * Cada servicio apunta al que sigue de forma natural en la conversacion
 * con el cliente. Son enlaces en prosa, no un listado: dan contexto al
 * lector y le dan a un modelo la relacion entre dos paginas.
 */
export const relacionados = {
  plan1: { texto: 'Si además de tener presencia el objetivo es competir por búsquedas en Google, el paso siguiente es el', ancla: 'Sitio Completo + SEO', url: '/servicios/sitio-web-completo-seo/' },
  plan2: { texto: 'Para que el estudio también aparezca en el mapa cuando alguien busca en la zona, conviene sumar el trabajo sobre', ancla: 'Google Business', url: '/servicios/google-business/' },
  redes: { texto: 'Las redes generan interés, pero ese interés necesita un lugar donde convertirse en consulta: ahí entra el', ancla: 'Sitio Completo + SEO', url: '/servicios/sitio-web-completo-seo/' },
  gbusiness: { texto: 'La ficha rinde mucho más cuando apunta a un sitio que sostiene la búsqueda. Si todavía no hay uno, empezá por la', ancla: 'Landing Profesional', url: '/servicios/landing-profesional/' },
  renovacion: { texto: 'Si el sitio actual no tiene arreglo y conviene rehacerlo con posicionamiento desde cero, el camino es el', ancla: 'Sitio Completo + SEO', url: '/servicios/sitio-web-completo-seo/' }
};

export const services = prices.services.map(s => ({
  ...s,
  ...serviceMeta[s.id],
  detalle: detalle[s.id] || null,
  relacionado: relacionados[s.id] || null,
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

/* ---------- OTROS PROFESIONALES ----------
 * Se listan como "el mismo trabajo aplica", no como clientes actuales:
 * afirmar lo segundo seria inventar. Suma superficie de busqueda sin crear
 * una pagina fina por profesion, que seria doorway.
 */
export const otrosProfesionales = [
  'Arquitectos y estudios de arquitectura',
  'Ingenieros y peritos',
  'Martilleros y corredores inmobiliarios',
  'Traductores públicos',
  'Odontólogos y clínicas dentales',
  'Psicólogos y consultorios',
  'Kinesiólogos y nutricionistas',
  'Despachantes de aduana',
  'Agrimensores',
  'Asesores de seguros'
];
