import serialize from 'serialize-javascript';
import type {
  WithContext,
  CollectionPage,
  BreadcrumbList,
} from 'schema-dts';
import Header from '@/components/header';
import ConviteInstalar from '@/components/mapa-turistico/convite-instalar';
import { getSiteUrl } from '@/lib/env';
import { METADATA_APP_MAPA } from '@/lib/pwa-mapa';

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

/**
 * O eixo desta rota é a ferramenta, não a busca por "mapa turístico de São
 * Bento do Sapucaí" — essa é de `/mapa-turistico/`, que responde à mesma
 * intenção em HTML rastreável e tem onde converter. Aqui não há corpo de
 * texto: o `<h1>` e o lede existem só para leitor de tela, e o conteúdo é
 * WebGL. As duas páginas continuam indexáveis e auto-canônicas.
 *
 * A description antiga prometia "restaurantes, cafés e artesanato", e o
 * cadastro não tem um único local nessas categorias — snippet que promete o
 * que a tela não entrega devolve o visitante para a busca.
 */
export function generateMetadata() {
  return {
    title: 'Mapa Interativo da Região',
    description:
      'Abra o mapa do Refúgio da Pedra SP, filtre por categoria e veja a rota de carro do centro de São Bento do Sapucaí até cada ponto.',
    /**
     * Manifest, ícones e nome de atalho do PWA do mapa. Esta é a `start_url`
     * dele: quem instala a partir de qualquer rota do mapa abre aqui, na
     * ferramenta, e não na home da pousada.
     */
    ...METADATA_APP_MAPA,
    keywords: [
      'mapa interativo',
      'mapa refúgio da pedra sp',
      'como chegar na pedra do baú',
      'distância até a pedra do baú',
      'rota vale do baú',
      'são bento do sapucaí',
    ],
    openGraph: {
      title: 'Mapa Interativo - Refúgio da Pedra SP',
      description:
        'Filtre por categoria e veja a rota de carro da pousada até cada ponto de São Bento do Sapucaí.',
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
 * A lista dos lugares não é declarada aqui.
 *
 * Ela vive em `/mapa-turistico/#lugares`, a página que tem texto sobre cada
 * atração; esta rota apenas referencia aquele `@id` no `mainEntity`. Emitir
 * os mesmos nós nas duas URLs criaria duas cópias de cada atração no grafo —
 * o mesmo erro que o site evita de propósito com o `#business`, descrito uma
 * única vez no layout raiz.
 */
const jsonLd: WithContext<CollectionPage> = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${pageUrl}#webpage`,
  name: 'Mapa Interativo da Região - Refúgio da Pedra SP',
  description:
    'Mapa interativo dos pontos turísticos, trilhas e cachoeiras de São Bento do Sapucaí, com filtro por categoria e rota de carro a partir do centro da cidade.',
  url: pageUrl,
  inLanguage: 'pt-BR',
  isPartOf: { '@id': `${siteUrl}/#website` },
  // O negócio é descrito uma única vez no layout raiz.
  publisher: { '@id': `${siteUrl}/#business` },
  mainEntity: { '@id': `${siteUrl}/mapa-turistico/#lugares` },
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
      {/* Por último no DOM de propósito: o cartão é `fixed`, então a posição
          na árvore não muda onde ele aparece, só a ordem do Tab — e um convite
          que se antecipa ao conteúdo na navegação por teclado seria a mesma
          interrupção que ele evita na tela. */}
      <ConviteInstalar elevado />
    </>
  );
}

export default MapaLayout;
