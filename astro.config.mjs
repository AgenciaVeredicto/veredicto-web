import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// El canonical de cada pagina y el sitemap.xml salen de aca.
// Nunca se escribe una URL absoluta a mano en una pagina.
export default defineConfig({
  site: 'https://agenciaveredicto.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
      serialize(item) {
        // La home manda; el resto queda por debajo.
        item.priority = item.url === 'https://agenciaveredicto.com/' ? 1.0 : 0.8;
        return item;
      }
    })
  ]
});
