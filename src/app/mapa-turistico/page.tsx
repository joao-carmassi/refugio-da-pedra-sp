/* Hallmark · genre: editorial · macrostructure: Photographic · chrome: N6 masthead + Ft1 footer · design-system: design.md */

import Hero from "./hero";
import ComoUsar from "./como-usar";
import Faq from "./faq";
import Cta from "./cta";
import serialize from "serialize-javascript";
import type {
  WithContext,
  WebPage,
  BreadcrumbList,
  FAQPage,
} from "schema-dts";
import { getMapaUrl, getSiteUrl } from "@/lib/env";
import { PERGUNTAS } from "./perguntas";

/*
  Página de conteúdo sobre o mapa turístico de São Bento do Sapucaí.

  A ferramenta em si tem site próprio, no endereço de `NEXT_PUBLIC_MAPA_URL`.
  Esta rota é a apresentação dela no site da pousada: responde em HTML o que o
  visitante digitou na busca, explica o que o mapa mostra e manda para ele —
  e para a reserva — no mesmo scroll.

  Sem a variável configurada a página continua de pé: os botões que levariam
  ao mapa somem e o texto fica.

  A composição segue a homepage: uma seção por arquivo, montadas aqui na
  ordem em que aparecem. Sem `min-h-container` — a página é longa por
  construção e a altura mínima só existe para rotas que podem ficar curtas.
*/
/**
 * O Next.js substitui (não mescla) o objeto `openGraph` inteiro quando um
 * segmento filho o declara, então `images` precisa ser repetido aqui.
 *
 * A foto é a mesma que abre o hero: o paredão da Pedra do Baú, que é o
 * assunto do guia. O alt é cópia literal do que `src/data/image-alt.json`
 * guarda para este arquivo: metadata não roda no cliente e não passa pelo
 * `getAlt`, então as duas descrições precisam ser conferidas juntas se a foto
 * mudar.
 */
const ogImage = {
  url: "/assets/refugio/geral/refugio-2.webp",
  width: 1620,
  height: 1080,
  alt: "Paredão da Pedra do Baú visto da pousada, com a mata da Mantiqueira cobrindo as encostas",
};

/**
 * `trailingSlash: true` no next.config.ts: toda rota é servida com barra
 * final, então canonical/og:url/JSON-LD precisam apontar para a URL com barra
 * — caso contrário apontam para um 308. Não vale para arquivos estáticos.
 */
const pageUrl = `${getSiteUrl()}/mapa-turistico/`;

/**
 * Esta rota é a dona da busca "mapa turístico de São Bento do Sapucaí" no
 * site da pousada.
 *
 * Quem chega aqui está planejando uma viagem a São Bento do Sapucaí, não
 * procurando pousada: o texto da rota é de guia turístico e trata o mapa como
 * o produto. O Refúgio aparece como quem mantém o projeto — na assinatura do
 * hero e no bloco de fecho —, nunca como a razão de a página existir.
 */
export function generateMetadata() {
  return {
    /**
     * `absolute` para escapar do `template: "%s | Refúgio da Pedra SP"` do
     * layout raiz. O sufixo é da pousada, e aqui ele apareceria na aba do
     * navegador, no resultado da busca e no cartão social de uma página que
     * é sobre a cidade. A ligação com o Refúgio não some: ela está no
     * `publisher` do JSON-LD e na assinatura do hero, que é onde ela pertence.
     */
    title: { absolute: "Mapa Turístico de São Bento do Sapucaí" },
    description:
      "Guia de São Bento do Sapucaí em forma de mapa: a Pedra do Baú, as cachoeiras, os mirantes e as igrejas do município, com endereço, horário e rota de carro para cada lugar.",
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
 * Endereço do mapa, ou `null` quando `NEXT_PUBLIC_MAPA_URL` não está
 * configurada. Resolvido aqui, no servidor, e passado às seções que têm botão
 * para ele — elas não precisam saber de onde vem o valor.
 */
const mapaUrl = getMapaUrl();

const jsonLd: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  name: "Mapa Turístico de São Bento do Sapucaí",
  description:
    "O que o mapa turístico de São Bento do Sapucaí mostra — pontos turísticos, cachoeiras, mirantes e igrejas do município, agrupados por trecho e com endereço, horário e rota de carro para cada lugar — e como usá-lo.",
  url: pageUrl,
  inLanguage: "pt-BR",
  isPartOf: { "@id": `${siteUrl}/#website` },
  // O negócio é descrito uma única vez no layout raiz.
  publisher: { "@id": `${siteUrl}/#business` },
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
  ...(mapaUrl ? { significantLink: `${mapaUrl}/mapa/` } : {}),
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
 * Nó à parte, com `@id` próprio, ligado ao `WebPage` acima por `isPartOf` —
 * evita dois nós de página disputando a mesma URL.
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
        dangerouslySetInnerHTML={{ __html: serialize(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(faqJsonLd) }}
      />
      {/*
        `data-mapa-tema` liga a identidade própria do mapa (globals.css) —
        verde mata na ação, areia no fundo, verde profundo nos blocos fechados.
        Sem a regra no CSS a página cai no tema da pousada e nada quebra.

        O escopo para no `<main>` de propósito: cabeçalho e rodapé são a marca
        do Refúgio e continuam em âmbar, como no resto do site.
      */}
      <main data-mapa-tema className="bg-background">
        <Hero mapaUrl={mapaUrl} />
        <ComoUsar mapaUrl={mapaUrl} />
        <Cta />
        <Faq />
      </main>
    </>
  );
}

export default MapaTuristicoPage;
