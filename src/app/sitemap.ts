import { getSiteUrl } from '@/lib/env';
import type { MetadataRoute } from 'next';
import chales from '@/data/chales.json';
import slugify from 'slugify';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const chaleUrls: MetadataRoute.Sitemap = chales.map((chale) => ({
    url: `${baseUrl}/chales/${slugify(chale.nome, { lower: true, strict: true })}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/chales`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...chaleUrls,
    {
      url: `${baseUrl}/reservar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];
}
