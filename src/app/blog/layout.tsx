import Script from 'next/script';
import serialize from 'serialize-javascript';
import type { WithContext, Blog } from 'schema-dts';
import { getSiteUrl } from '@/lib/env';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Blog - Refúgio da Pedra',
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
  name: 'Blog - Refúgio da Pedra',
  description:
    'Dicas, histórias e novidades sobre o Refúgio da Pedra e a região de São Bento do Sapucaí na Serra da Mantiqueira.',
  url: `${getSiteUrl()}/blog`,
  publisher: {
    '@type': 'Organization',
    name: 'Refúgio da Pedra',
    url: getSiteUrl(),
  },
};

function BlogLayout({ children }: Props): React.ReactNode {
  return (
    <>
      <Script
        id='jsonld-blog'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serialize(jsonLd),
        }}
      />
      {children}
    </>
  );
}

export default BlogLayout;
