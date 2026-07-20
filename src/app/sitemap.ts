import fs from 'fs';
import path from 'path';
import { getSiteUrl } from '@/lib/env';
import type { MetadataRoute } from 'next';
import chales from '@/data/chales.json';
import { getAllPosts } from '@/lib/posts';
import slugify from 'slugify';

function mtimeOf(relativePath: string): Date {
  const fullPath = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    relativePath,
  );
  return fs.statSync(fullPath).mtime;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  // No per-chalé date field exists yet, so fall back to the shared data
  // file's mtime as a real (non-fabricated) freshness signal.
  const chalesDataMtime = mtimeOf('src/data/chales.json');

  const chaleUrls: MetadataRoute.Sitemap = chales.map((chale) => ({
    url: `${baseUrl}/chales/${slugify(chale.nome, { lower: true, strict: true })}/`,
    lastModified: chalesDataMtime,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const postUrls: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: post.date ? new Date(post.date) : mtimeOf('src/data/posts'),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: mtimeOf('src/app/(homepage)/hero.tsx'),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/chales/`,
      lastModified: mtimeOf('src/app/chales/page.tsx'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...chaleUrls,
    {
      url: `${baseUrl}/reservar/`,
      lastModified: mtimeOf('src/app/reservar/page.tsx'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: mtimeOf('src/app/blog/page.tsx'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...postUrls,
  ];
}
