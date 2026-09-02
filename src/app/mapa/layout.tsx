import serialize from 'serialize-javascript';
import type { WithContext, CollectionPage, BreadcrumbList } from 'schema-dts';
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
  url: '/assets/mapa/pedra-do-bau/pedra-do-bau-4.webp',
  width: 1620,
  height: 1213,
  /*
    O alt é cópia literal do que `src/data/image-alt.json` guarda para este
    arquivo: metadata não roda no cliente e não passa pelo `getAlt`, então as
    duas descrições precisam ser conferidas juntas se a foto mudar. Ele já
    descreveu chalés ao entardecer — texto de uma foto anterior, que ficou para
    trás quando a imagem virou a vista aérea do Baú.
  */
  alt: 'Vista aérea do complexo do Baú entre nuvens baixas, com o paredão de rocha cercado de mata',
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
 *
 * O eixo é a ferramenta, mas o assunto é a cidade: o título dizia "da
 * Região" e a description abria com "o mapa do Refúgio da Pedra SP", o que
 * descrevia a tela como um serviço da pousada. Não é o que ela é: sem
 * parâmetro na URL o mapa abre no centro do município e a pousada é um pino
 * como os outros — a versão do hóspede, que mede da porta dela, mora atrás de
 * `?refugio=1`. O vínculo com o Refúgio está no `publisher` do JSON-LD, e é
 * lá que ele basta.
 */
export function generateMetadata() {
  return {
    /**
     * `absolute` para escapar do `template: "%s | Refúgio da Pedra SP"` do
     * layout raiz, pelo mesmo motivo de `/mapa-turistico/`: o sufixo da
     * pousada não descreve esta tela.
     *
     * "de São Bento do Sapucaí" no lugar de "da Região" porque, sem o sufixo,
     * o título ficava sem dizer região nenhuma. O adjetivo "Interativo"
     * continua sendo o que separa esta rota de `/mapa-turistico/`: a head
     * keyword "mapa turístico de são bento do sapucaí" segue sendo da landing,
     * e nada aqui a disputa. Casa com o `<h1>` que a página já servia.
     */
    title: { absolute: 'Mapa Interativo de São Bento do Sapucaí' },
    description:
      'Mapa dos pontos turísticos de São Bento do Sapucaí no navegador, sem aplicativo: filtre por categoria, toque num pino e veja a rota de carro do centro da cidade até cada lugar.',
    /**
     * Manifest, ícones e nome de atalho do PWA do mapa. Esta é a `start_url`
     * dele: quem instala a partir de qualquer rota do mapa abre aqui, na
     * ferramenta, e não na home da pousada.
     */
    ...METADATA_APP_MAPA,
    keywords: [
      'mapa interativo de são bento do sapucaí',
      'mapa de são bento do sapucaí',
      'onde ficam os pontos turísticos de são bento do sapucaí',
      'como chegar na pedra do baú',
      'distância até a pedra do baú',
      'rota vale do baú',
      'são bento do sapucaí',
    ],
    openGraph: {
      title: 'Mapa Interativo de São Bento do Sapucaí',
      /*
        Dizia "a rota de carro da pousada até cada ponto", e a tela não faz
        isso: sem parâmetro na URL o mapa abre medindo do centro do município.
        Cartão social que promete a medida do hóspede descreve uma tela que
        quase ninguém que chega pela busca vai ver.
      */
      description:
        'Filtre por categoria, toque num pino e veja a rota de carro do centro de São Bento do Sapucaí até cada ponto.',
      // Mesmo `name` de `public/mapa.webmanifest`, como em `/mapa-turistico/`.
      siteName: 'Mapa de São Bento do Sapucaí',
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
  name: 'Mapa Interativo de São Bento do Sapucaí',
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
