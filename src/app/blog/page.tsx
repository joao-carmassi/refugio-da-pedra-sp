/* Hallmark · genre: editorial · macrostructure: Index-First · design-system: design.md · designed-as-app */

import type { BreadcrumbList, WithContext } from 'schema-dts';
import JsonLd from '@/components/json-ld';
import { getSiteUrl } from '@/lib/env';
import { getAllPostsMeta } from '@/lib/posts';
import BlogContent from './content';

const Blog = () => {
  const blogPosts = getAllPostsMeta();
  const siteUrl = getSiteUrl();

  // Breadcrumb de dois níveis só na listagem: no `layout.tsx` ele vazaria para
  // os posts, que declaram o próprio breadcrumb de três níveis.
  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog/`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <BlogContent blogPosts={blogPosts} />
    </>
  );
};

export default Blog;
