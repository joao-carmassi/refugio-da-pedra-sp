import serialize from 'serialize-javascript';
import type { WithContext, Blog, BreadcrumbList } from 'schema-dts';
import { getSiteUrl } from '@/lib/env';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Blog',
    description:
      'Dicas, histórias e novidades sobre o Refúgio da Pedra e a região de São Bento do Sapucaí na Serra da Mantiqueira.',
    keywords: [
      'blog',
      'São Bento do Sapucaí',
      'Serra da Mantiqueira',
      'natureza',
      'dicas de viagem',
      'ecoturismo',
    ],
    openGraph: {
      title: 'Blog - Refúgio da Pedra',
      description:
        'Dicas, histórias e novidades sobre o Refúgio da Pedra e a região de São Bento do Sapucaí.',
      type: 'website',
      url: `${siteUrl}/blog`,
    },
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
  };
}

const jsonLd: WithContext<Blog> = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Blog - Refúgio da Pedra SP',
  description:
    'Dicas, histórias e novidades sobre o Refúgio da Pedra SP e a região de São Bento do Sapucaí na Serra da Mantiqueira.',
  url: `${getSiteUrl()}/blog`,
  publisher: {
    '@type': 'Organization',
    name: 'Refúgio da Pedra SP',
    url: getSiteUrl(),
  },
};

const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: getSiteUrl(),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: `${getSiteUrl()}/blog`,
    },
  ],
};

function BlogLayout({ children }: Props): React.ReactNode {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serialize(jsonLd),
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serialize(breadcrumbJsonLd),
        }}
      />
      {children}
    </>
  );
}

export default BlogLayout;
