import serialize from 'serialize-javascript';
import type {
  WithContext,
  CollectionPage,
  BreadcrumbList,
  ItemList,
} from 'schema-dts';
import Header from '@/components/header';
import { getSiteUrl } from '@/lib/env';
import { CATEGORIAS, LOCAIS } from '@/lib/mapa-turistico';

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
  alt: 'Chalés do Refúgio da Pedra SP ao entardecer, com a Pedra do Baú ao fundo, em São Bento do Sapucaí',
};

/**
 * `trailingSlash: true` no next.config.ts: toda rota é servida com barra
 * final, então canonical/og:url/JSON-LD precisam apontar para a URL com barra
 * — caso contrário apontam para um 308.
 */
const pageUrl = `${getSiteUrl()}/mapa/`;

export function generateMetadata() {
  return {
    title: 'Mapa Turístico de São Bento do Sapucaí',
    description:
      'Mapa interativo de São Bento do Sapucaí: Pedra do Baú, trilhas, cachoeiras, restaurantes, cafés e artesanato da Serra da Mantiqueira, com a distância de cada lugar até o Refúgio da Pedra SP.',
    keywords: [
      'mapa turístico',
      'mapa de são bento do sapucaí',
      'o que fazer em são bento do sapucaí',
      'pontos turísticos são bento do sapucaí',
      'pedra do baú mapa',
      'trilhas serra da mantiqueira',
      'restaurantes são bento do sapucaí',
      'vale do baú',
    ],
    openGraph: {
      title: 'Mapa Turístico de São Bento do Sapucaí - Refúgio da Pedra SP',
      description:
        'Onde ir na serra: trilhas, mesas e experiências de São Bento do Sapucaí em um mapa só, com a distância de cada lugar até a pousada.',
      siteName: 'Refúgio da Pedra SP',
      type: 'website',
      url: pageUrl,
      images: [ogImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

const siteUrl = getSiteUrl();

/**
 * Cada local vira um nó `TouristAttraction` com coordenada.
 *
 * O Refúgio fica de fora da lista: ele já é descrito uma única vez como
 * `LodgingBusiness` no layout raiz, e repetir o negócio aqui como "atração"
 * criaria dois nós concorrentes para a mesma entidade.
 */
const itemListJsonLd: WithContext<ItemList> = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${pageUrl}#lugares`,
  name: 'Lugares para visitar em São Bento do Sapucaí',
  numberOfItems: LOCAIS.filter((local) => !local.refugio).length,
  itemListElement: LOCAIS.filter((local) => !local.refugio).map(
    (local, indice) => ({
      '@type': 'ListItem' as const,
      position: indice + 1,
      item: {
        '@type': 'TouristAttraction' as const,
        '@id': `${pageUrl}#${local.id}`,
        name: local.nome,
        description: local.resumo,
        ...(local.site ? { url: local.site } : {}),
        ...(local.tel ? { telephone: local.tel } : {}),
        ...(local.horario ? { openingHours: local.horario } : {}),
        address: {
          '@type': 'PostalAddress' as const,
          streetAddress: local.endereco,
          addressLocality: 'São Bento do Sapucaí',
          addressRegion: 'SP',
          addressCountry: 'BR',
        },
        geo: {
          '@type': 'GeoCoordinates' as const,
          latitude: local.lat,
          longitude: local.lng,
        },
        additionalType: CATEGORIAS[local.cat].label,
      },
    }),
  ),
};

const jsonLd: WithContext<CollectionPage> = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${pageUrl}#webpage`,
  name: 'Mapa Turístico de São Bento do Sapucaí',
  description:
    'Mapa interativo com os pontos turísticos, trilhas, restaurantes e experiências de São Bento do Sapucaí, na Serra da Mantiqueira.',
  url: pageUrl,
  inLanguage: 'pt-BR',
  isPartOf: { '@id': `${siteUrl}/#website` },
  // O negócio é descrito uma única vez no layout raiz.
  publisher: { '@id': `${siteUrl}/#business` },
  mainEntity: { '@id': `${pageUrl}#lugares` },
  about: {
    '@type': 'City',
    name: 'São Bento do Sapucaí',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Bento do Sapucaí',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
  },
};

const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Mapa',
      item: pageUrl,
    },
  ],
};

function MapaLayout({ children }: Props): React.ReactNode {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serialize(itemListJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serialize(breadcrumbJsonLd) }}
      />
      {/*
        Duas escolhas de chrome exclusivas desta rota:

        1. Sem `<Footer />`. O mapa ocupa a viewport inteira; um rodapé abaixo
           dele empurraria o conteúdo para fora da tela e criaria rolagem numa
           página que, por definição, não rola — quem arrasta aqui está
           navegando o mapa, não a página.
        2. `<Header />` travado em `compact`. O cabeçalho cheio come altura que
           é justamente a área útil do mapa; no estado compacto ele devolve
           esse espaço sem tirar a navegação do alcance.
      */}
      <Header compact />
      {children}
    </>
  );
}

export default MapaLayout;
