/* Hallmark · genre: editorial · macrostructure: Photographic · chrome: N6 masthead + Ft1 footer · design-system: design.md */

import { Suspense } from "react";
import { ProvedorOrigem } from "@/components/mapa-turistico/origem";
import Hero from "./hero";
import Categorias from "./categorias";
import Pontos from "./pontos";
import ComoUsar from "./como-usar";
import Faq from "./faq";
import Cta from "./cta";
import serialize from "serialize-javascript";
import type {
  WithContext,
  CollectionPage,
  BreadcrumbList,
  FAQPage,
  ItemList,
} from "schema-dts";
import { getSiteUrl } from "@/lib/env";
import { METADATA_APP_MAPA } from "@/lib/pwa-mapa";
import { CATEGORIAS, horarioSchema } from "@/lib/mapa-turistico";
import { LUGARES } from "./dados";
import { PERGUNTAS } from "./perguntas";

/*
  Página de conteúdo sobre o mapa turístico de São Bento do Sapucaí.

  Não confundir com `/mapa/`: lá fica a ferramenta — tela cheia, sem rodapé,
  desenhada em WebGL e portanto opaca para buscador e leitor de tela. Esta
  rota é o texto que aquela tela não tem: responde em HTML o que o visitante
  digitou na busca, e leva ao mapa e à reserva no mesmo scroll.

  A composição segue a homepage: uma seção por arquivo, montadas aqui na
  ordem em que aparecem. Sem `min-h-container` — a página é longa por
  construção e a altura mínima só existe para rotas que podem ficar curtas.
*/
/**
 * O Next.js substitui (não mescla) o objeto `openGraph` inteiro quando um
 * segmento filho o declara, então `images` precisa ser repetido aqui.
 *
 * A foto é a mesma que abre o hero, e é de propósito: quem compartilha esta
 * rota está passando adiante o guia da cidade, não a pousada. Enquanto o
 * cartão social mostrava os chalés, o preview prometia hospedagem e a página
 * entregava mapa — desencontro que devolve o visitante para a busca. O alt é
 * cópia literal do que `src/data/image-alt.json` guarda para este arquivo:
 * metadata não roda no cliente e não passa pelo `getAlt`, então as duas
 * descrições precisam ser conferidas juntas se a foto mudar.
 */
const ogImage = {
  url: "/assets/mapa/pedra-do-bau/pedra-do-bau-4.webp",
  width: 1620,
  height: 1213,
  alt: "Vista aérea do complexo do Baú entre nuvens baixas, com o paredão de rocha cercado de mata",
};

/**
 * `trailingSlash: true` no next.config.ts: toda rota é servida com barra
 * final, então canonical/og:url/JSON-LD precisam apontar para a URL com barra
 * — caso contrário apontam para um 308. Não vale para arquivos estáticos.
 */
const pageUrl = `${getSiteUrl()}/mapa-turistico/`;

/**
 * Esta rota, e não `/mapa/`, é a dona da busca "mapa turístico de São Bento
 * do Sapucaí".
 *
 * `/mapa/` é a ferramenta: tela cheia, sem rodapé, conteúdo desenhado em
 * WebGL. Não há corpo de texto para o buscador ler. Esta página responde à
 * mesma intenção em HTML rastreável: apresenta o município, o que há para ver
 * nele e a ferramenta que mostra onde fica cada coisa. Por isso `/mapa/` ficou
 * com o eixo de ferramenta ("Mapa Interativo da Região") — as duas continuam
 * indexáveis e auto-canônicas, sem disputar o mesmo termo.
 *
 * Quem chega aqui está planejando uma viagem a São Bento do Sapucaí, não
 * procurando pousada: o texto da rota é de guia turístico e trata o mapa como
 * o produto. O Refúgio aparece como quem mantém o projeto — na assinatura do
 * hero, na origem das distâncias e no bloco de fecho —, nunca como a razão de
 * a página existir.
 */
export function generateMetadata() {
  return {
    /**
     * `absolute` para escapar do `template: "%s | Refúgio da Pedra SP"` do
     * layout raiz. O sufixo é da pousada, e aqui ele apareceria na aba do
     * navegador, no resultado da busca e no cartão social de uma página que
     * é sobre a cidade — quem procura "mapa turístico de São Bento do
     * Sapucaí" leria o nome de uma pousada no lugar onde esperava o do guia.
     * A ligação com o Refúgio não some: ela está no `publisher` do JSON-LD e
     * na assinatura do hero, que é onde ela pertence.
     */
    title: { absolute: "Mapa Turístico de São Bento do Sapucaí" },
    description:
      "Guia de São Bento do Sapucaí em forma de mapa: a Pedra do Baú, as cachoeiras, os mirantes e as igrejas do município, com endereço, horário e rota de carro para cada lugar.",
    /**
     * Esta rota é a porta de entrada do PWA do mapa, não do da pousada: é
     * daqui que chega quem procurou o guia da cidade. Por isso declara a
     * mesma identidade de app que `/mapa/` — instalar daqui instala o mapa,
     * que abre na ferramenta.
     */
    ...METADATA_APP_MAPA,
    /* O Google ignora `keywords` desde 2009 — a lista fica porque outros
       consumidores do HTML a leem, e porque descreve para quem edita a página
       de que buscas ela é a resposta. Os termos de cauda curta aqui têm volume
       quase nulo no Google (a pesquisa de 25/08/2026 mediu zero em "mapa
       turístico de são bento do sapucaí"): a demanda aparece em pergunta a
       modelo de IA, e quem responde por ela é o FAQ abaixo, não esta lista. */
    keywords: [
      "mapa turístico de são bento do sapucaí",
      "mapa de são bento do sapucaí",
      "guia turístico de são bento do sapucaí",
      "o que fazer em são bento do sapucaí",
      "pontos turísticos de são bento do sapucaí",
      "roteiro em são bento do sapucaí",
      "trilhas em são bento do sapucaí",
      "onde fica a pedra do baú",
      "distância até a pedra do baú",
      "cachoeiras de são bento do sapucaí",
      "mirantes de são bento do sapucaí",
      "igrejas de são bento do sapucaí",
      "vale do baú",
    ],
    openGraph: {
      title: "Mapa Turístico de São Bento do Sapucaí",
      description:
        "Onde ficam as trilhas, as cachoeiras, os mirantes e as igrejas de São Bento do Sapucaí, num mapa que abre no navegador, sem aplicativo.",
      /**
       * `siteName` do mapa, não da pousada: é o rótulo que WhatsApp,
       * Telegram e Slack imprimem acima do título do cartão, e o site instala
       * como dois PWAs distintos. O texto é o mesmo `name` de
       * `public/mapa.webmanifest` — quem compartilha o link e quem instala o
       * app têm de ver o mesmo nome. Mudar um pede mudar o outro.
       */
      siteName: "Mapa de São Bento do Sapucaí",
      type: "website",
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
 * Lista canônica dos lugares — o `ItemList` do site inteiro mora aqui.
 *
 * Ele nasceu em `/mapa/`, mas descrever cada atração é papel da página que
 * tem texto sobre elas; a tela do mapa passou a apenas referenciar este `@id`
 * no `mainEntity`. Duas cópias dos mesmos 31 nós em URLs diferentes seria o
 * mesmo erro que o repositório evita de propósito com o `#business`: duas
 * entidades concorrentes para a mesma coisa.
 *
 * O Refúgio fica de fora: ele já é descrito uma única vez como
 * `LodgingBusiness` no layout raiz, e repeti-lo aqui como "atração" criaria
 * um segundo nó para o mesmo negócio.
 */
const itemListJsonLd: WithContext<ItemList> = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${pageUrl}#lugares`,
  name: "Lugares para visitar em São Bento do Sapucaí",
  numberOfItems: LUGARES.length,
  itemListElement: LUGARES.map((local, indice) => {
    const horario = horarioSchema(local.horario);

    return {
      "@type": "ListItem" as const,
      position: indice + 1,
      item: {
        "@type": "TouristAttraction" as const,
        "@id": `${pageUrl}#${local.id}`,
        name: local.nome,
        description: local.resumo,
        ...(local.site ? { url: local.site } : {}),
        /* Depois do `site` de propósito: quem tem página do plano Vitrine
           tem endereço aqui dentro, e é ele que o nó da atração aponta. O
           site do parceiro continua descrito — em `sameAs`, quando houver —,
           mas a URL canônica da entidade passa a ser a que este site publica
           e mantém. Sem `vitrine: true` no cadastro nada muda. */
        ...(local.vitrine
          ? {
              url: `${pageUrl}${local.id}/`,
              ...(local.site ? { sameAs: local.site } : {}),
            }
          : {}),
        ...(local.tel ? { telephone: local.tel } : {}),
        /*
         * `openingHours` pede `Mo-Th 18:00-23:30`, e o cadastro guarda a frase
         * em português que o cartão mostra. Quem traduz é `horarioSchema`, no
         * mesmo módulo que o parser do selo "Aberto agora" — e onde a tradução
         * não é possível o campo sai fora, porque um horário que o buscador não
         * lê é pior que nenhum.
         */
        ...(horario ? { openingHours: horario } : {}),
        address: {
          "@type": "PostalAddress" as const,
          streetAddress: local.endereco,
          addressLocality: "São Bento do Sapucaí",
          addressRegion: "SP",
          addressCountry: "BR",
        },
        geo: {
          "@type": "GeoCoordinates" as const,
          latitude: local.lat,
          longitude: local.lng,
        },
        additionalType: CATEGORIAS[local.cat].label,
      },
    };
  }),
};

const jsonLd: WithContext<CollectionPage> = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${pageUrl}#webpage`,
  name: "Mapa Turístico de São Bento do Sapucaí",
  description:
    "Onde ficam os pontos turísticos, cachoeiras, mirantes e igrejas de São Bento do Sapucaí, agrupados por trecho do município e com endereço, horário e rota de carro para cada lugar.",
  url: pageUrl,
  inLanguage: "pt-BR",
  isPartOf: { "@id": `${siteUrl}/#website` },
  // O negócio é descrito uma única vez no layout raiz.
  publisher: { "@id": `${siteUrl}/#business` },
  mainEntity: { "@id": `${pageUrl}#lugares` },
  about: {
    "@type": "City",
    name: "São Bento do Sapucaí",
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Bento do Sapucaí",
      addressRegion: "SP",
      addressCountry: "BR",
    },
  },
  // O mapa interativo é a ferramenta que esta página apresenta.
  significantLink: `${siteUrl}/mapa/`,
};

const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Mapa Turístico",
      item: pageUrl,
    },
  ],
};

/**
 * Nó à parte, com `@id` próprio: a página em si já é o `CollectionPage`
 * acima, cujo `mainEntity` é a lista de lugares. Declarar as perguntas aqui e
 * ligá-las por `isPartOf` evita dois nós de página disputando a mesma URL.
 *
 * As perguntas são as mesmas de `./perguntas`, que a seção visível renderiza
 * — uma fonte só, para o markup nunca descrever um FAQ que não está na tela.
 *
 * Ele não está aqui esperando rich result: o Google encerrou o de FAQ para
 * sites não-governamentais em maio de 2026, e o site não persegue mais esse
 * formato. Fica porque é o recorte que os buscadores generativos (AI
 * Overviews, ChatGPT, Perplexity) leem melhor, e porque as respostas já
 * existem na página de qualquer jeito — custo zero, sem promessa falsa.
 */
const faqJsonLd: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${pageUrl}#faq`,
  inLanguage: "pt-BR",
  isPartOf: { "@id": `${pageUrl}#webpage` },
  mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
    "@type": "Question" as const,
    name: pergunta,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: resposta,
    },
  })),
};

function MapaTuristicoPage(): React.ReactNode {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(faqJsonLd) }}
      />
      {/*
        `data-mapa-tema` liga a identidade própria do mapa (globals.css) —
        verde mata na ação, areia no fundo, verde profundo nos blocos fechados.

        O escopo para no `<main>` de propósito: cabeçalho e rodapé são a marca
        do Refúgio e continuam em âmbar, como no resto do site. O mapa é um
        projeto com identidade separada, não uma troca de tema do site inteiro
        — e o encontro das duas marcas acontece uma vez só, na assinatura do
        hero.
      */}
      <main data-mapa-tema className="bg-background">
        <Hero />
        <Categorias />
        <Pontos />
        {/*
          Só esta seção conhece a origem — é ela que descreve o que a ficha do
          mapa mostra —, e por isso só ela entra no limite de suspensão que
          `useSearchParams()` exige numa rota estática.

          O `fallback` é a própria seção, sem provedor: fora dele o contexto
          entrega o Centro, que é o padrão. Assim o HTML gerado no build sai
          com a prosa inteira, redigida para o mapa da cidade — um esqueleto no
          lugar dela tiraria do índice o texto que esta página existe para
          publicar. O cliente só troca a seção quando há `?refugio=1` para
          trocar.
        */}
        <Suspense fallback={<ComoUsar />}>
          <ProvedorOrigem>
            <ComoUsar />
          </ProvedorOrigem>
        </Suspense>
        <Cta />
        <Faq />
      </main>
    </>
  );
}

export default MapaTuristicoPage;
