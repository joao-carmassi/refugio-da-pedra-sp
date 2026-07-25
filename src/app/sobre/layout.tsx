import serialize from 'serialize-javascript';
import type { WithContext, AboutPage, BreadcrumbList } from 'schema-dts';
import { getSiteUrl } from '@/lib/env';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Quem Somos',
    description:
      'Conheça o Refúgio da Pedra: pousada sustentável criada em 2018 ao pé da Pedra do Baú, em São Bento do Sapucaí, com chalés, cabana e domo geodésico na Serra da Mantiqueira.',
    keywords: [
      'quem somos',
      'sobre',
      'pousada sustentável',
      'turismo rural',
      'turismo de aventura',
      'Pedra do Baú',
      'São Bento do Sapucaí',
      'Serra da Mantiqueira',
    ],
    openGraph: {
      title: 'Quem Somos - Refúgio da Pedra',
      description:
        'A história do Refúgio da Pedra, pousada sustentável ao pé da Pedra do Baú, em São Bento do Sapucaí.',
      type: 'website',
      url: `${siteUrl}/sobre`,
    },
    alternates: {
      canonical: `${siteUrl}/sobre`,
    },
  };
}

const jsonLd: WithContext<AboutPage> = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Quem Somos - Refúgio da Pedra SP',
  description:
    'História e proposta do Refúgio da Pedra SP: pousada sustentável fundada em 2018 ao pé da Pedra do Baú, em São Bento do Sapucaí, na Serra da Mantiqueira.',
  url: `${getSiteUrl()}/sobre`,
  inLanguage: 'pt-BR',
  about: {
    '@type': 'LodgingBusiness',
    name: 'Refúgio da Pedra SP',
    description:
      'Pousada sustentável com chalés, cabana e domo geodésico ao pé da Pedra do Baú, em São Bento do Sapucaí, na Serra da Mantiqueira.',
    url: getSiteUrl(),
    foundingDate: '2018',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Bento do Sapucaí',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    sameAs: ['https://www.instagram.com/refugiodapedrasp/'],
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
      name: 'Quem Somos',
      item: `${getSiteUrl()}/sobre`,
    },
  ],
};

function SobreLayout({ children }: Props): React.ReactNode {
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

export default SobreLayout;
