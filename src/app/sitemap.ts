import { getSiteUrl } from '@/lib/env';
import type { MetadataRoute } from 'next';
import chales from '@/data/chales.json';
import { getAllPosts } from '@/lib/posts';
import { LOCAIS } from '@/lib/mapa-turistico';
import slugify from 'slugify';

// Explicit, hand-maintained lastmod dates.
//
// These used to come from fs.statSync().mtime, but a CI checkout rewrites every
// file's mtime, so every deploy published a brand-new lastmod even when nothing
// had changed — which teaches crawlers to ignore the field. Bump the relevant
// entry when a page's content actually changes. Blog posts are exempt: they
// carry real dates in their markdown frontmatter.
//
// Values seeded from each route's last content commit.
const LAST_MODIFIED = {
  home: '2026-07-20',
  chales: '2026-07-20',
  chale: '2026-07-20',
  reservar: '2026-03-06',
  blog: '2026-07-20',
  sobre: '2026-07-24',
  mapa: '2026-08-25',
  mapaTuristico: '2026-08-25',
  politicaDePrivacidade: '2026-07-20',
} as const;

/*
  Páginas próprias de ponto: uma rota por ponto que tem página em
  `src/app/mapa-turistico/<id>/`, com a data de publicação ou da última mexida.

  A chave aqui — e não o `vitrine: true` do cadastro — é o que põe a rota no
  índice. São coisas diferentes: `vitrine` diz que alguém paga o plano e faz o
  cartão do mapa linkar a página; esta lista diz que a página existe. A Pedra
  do Baú é o caso que separa as duas: atrativo público, sem plano e sem
  `vitrine`, mas com rota publicada — pelo critério antigo ela ficava fora do
  sitemap para sempre.

  Regra: criou pasta em `src/app/mapa-turistico/<id>/`, acrescenta a linha
  aqui no mesmo commit. Mexeu no texto ou na foto, atualiza a data.
*/
const LAST_MODIFIED_PAGINA_DE_PONTO: Record<string, string> = {
  'pedra-do-bau': '2026-09-02',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const chaleUrls: MetadataRoute.Sitemap = chales.map((chale) => ({
    url: `${baseUrl}/chales/${slugify(chale.nome, { lower: true, strict: true })}/`,
    lastModified: LAST_MODIFIED.chale,
  }));

  /*
    As rotas de `/mapa-turistico/<id>/`: as do plano Vitrine, saídas do
    cadastro, mais as páginas listadas à mão acima. O `filter` aceita as duas
    origens porque uma página publicada tem de ser indexável mesmo quando não
    há plano por trás dela.

    A data vem de LAST_MODIFIED_PAGINA_DE_PONTO; vitrine recém-publicada que
    ainda não ganhou linha cai na data da landing do mapa.
  */
  const paginaDePontoUrls: MetadataRoute.Sitemap = LOCAIS.filter(
    (local) => local.vitrine || local.id in LAST_MODIFIED_PAGINA_DE_PONTO,
  ).map((local) => ({
    url: `${baseUrl}/mapa-turistico/${local.id}/`,
    lastModified:
      LAST_MODIFIED_PAGINA_DE_PONTO[local.id] ?? LAST_MODIFIED.mapaTuristico,
  }));

  const postUrls: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: post.dateModified ?? post.date,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: LAST_MODIFIED.home,
    },
    {
      url: `${baseUrl}/chales/`,
      lastModified: LAST_MODIFIED.chales,
    },
    ...chaleUrls,
    {
      url: `${baseUrl}/reservar/`,
      lastModified: LAST_MODIFIED.reservar,
    },
    {
      url: `${baseUrl}/sobre/`,
      lastModified: LAST_MODIFIED.sobre,
    },
    {
      url: `${baseUrl}/mapa-turistico/`,
      lastModified: LAST_MODIFIED.mapaTuristico,
    },
    ...paginaDePontoUrls,
    {
      url: `${baseUrl}/mapa/`,
      lastModified: LAST_MODIFIED.mapa,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: LAST_MODIFIED.blog,
    },
    ...postUrls,
    {
      url: `${baseUrl}/politica-de-privacidade/`,
      lastModified: LAST_MODIFIED.politicaDePrivacidade,
    },
  ];
}
