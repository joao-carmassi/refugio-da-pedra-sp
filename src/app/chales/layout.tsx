import serialize from 'serialize-javascript';
import type { WithContext, ItemList, BreadcrumbList } from 'schema-dts';
import { getSiteUrl } from '@/lib/env';
import chales from '@/data/chales.json';
import slugify from 'slugify';

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
const pageUrl = `${getSiteUrl()}/chales/`;

export function generateMetadata() {
  return {
    title: 'Chalés em São Bento do Sapucaí',
    description:
      'Conheça os chalés, cabanas e domos do Refúgio da Pedra em São Bento do Sapucaí. Acomodações únicas em meio à natureza da Serra da Mantiqueira.',
    keywords: [
      'chalés',
      'cabanas',
      'domos',
      'hospedagem',
      'São Bento do Sapucaí',
      'Serra da Mantiqueira',
    ],
    openGraph: {
      title: 'Acomodações - Refúgio da Pedra',
      description:
        'Chalés, cabanas e domos em meio à natureza em São Bento do Sapucaí.',
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

const jsonLd: WithContext<ItemList> = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${pageUrl}#acomodacoes`,
  name: 'Acomodações - Pousada Refúgio da Pedra',
  description:
    'Chalés, cabanas e domos da Pousada Refúgio da Pedra em São Bento do Sapucaí.',
  numberOfItems: chales.length,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: chales.map((chale, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    name: chale.nome,
    url: `${pageUrl}${slugify(chale.nome, { lower: true, strict: true })}/`,
  })),
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
      name: 'Chalés',
      item: pageUrl,
    },
  ],
};

function ChalesLayout({ children }: Props): React.ReactNode {
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

export default ChalesLayout;
