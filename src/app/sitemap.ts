import { getSiteUrl } from '@/lib/env';
import type { MetadataRoute } from 'next';
import chales from '@/data/chales.json';
import { getAllPosts } from '@/lib/posts';
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

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const chaleUrls: MetadataRoute.Sitemap = chales.map((chale) => ({
    url: `${baseUrl}/chales/${slugify(chale.nome, { lower: true, strict: true })}/`,
    lastModified: LAST_MODIFIED.chale,
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
