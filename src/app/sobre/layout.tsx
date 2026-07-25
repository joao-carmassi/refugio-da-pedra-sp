import serialize from 'serialize-javascript';
import type { WithContext, AboutPage, BreadcrumbList } from 'schema-dts';
import { getSiteUrl } from '@/lib/env';

interface Props {
  children: React.ReactNode;
}

/**
 * O Next.js substitui (não mescla) o objeto `openGraph` inteiro quando um
 * segmento filho o declara, então `images` precisa ser repetido aqui.
 */
const ogImage = {
  url: '/assets/refugio/geral/refugio-1.webp',
  width: 1620,
  height: 1080,
  alt: 'Chalés do Refúgio da Pedra ao entardecer, com a Pedra do Baú ao fundo, em São Bento do Sapucaí',
};

/**
 * `trailingSlash: true` no next.config.ts: toda rota é servida com barra
 * final, então canonical/og:url/JSON-LD precisam apontar para a URL com barra
 * — caso contrário apontam para um 308. Não vale para arquivos estáticos.
 */
const pageUrl = `${getSiteUrl()}/sobre/`;

export function generateMetadata() {
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
      siteName: 'Refúgio da Pedra',
      type: 'website',
      url: pageUrl,
      images: [ogImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

const jsonLd: WithContext<AboutPage> = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${pageUrl}#webpage`,
  name: 'Quem Somos - Pousada Refúgio da Pedra',
  description:
    'História e proposta da Pousada Refúgio da Pedra: pousada sustentável fundada em 2018 ao pé da Pedra do Baú, em São Bento do Sapucaí, na Serra da Mantiqueira.',
  url: pageUrl,
  inLanguage: 'pt-BR',
  isPartOf: { '@id': `${getSiteUrl()}/#website` },
  // O negócio é descrito uma única vez no layout raiz.
  about: { '@id': `${getSiteUrl()}/#business` },
  mainEntity: { '@id': `${getSiteUrl()}/#business` },
};

const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${getSiteUrl()}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Quem Somos',
      item: pageUrl,
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
