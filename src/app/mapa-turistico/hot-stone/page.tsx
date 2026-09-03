/* Hallmark · genre: editorial · macrostructure: Photographic · chrome: N6 masthead + Ft1 footer · design-system: design.md */

import serialize from "serialize-javascript";
import type { WithContext, Restaurant, WebPage, BreadcrumbList } from "schema-dts";
import { Anton } from "next/font/google";
import { getSiteUrl } from "@/lib/env";
import { getLocal, horarioSchema } from "@/lib/mapa-turistico";
import Dobra from "./dobra";
import Cardapio from "./cardapio";
import Ambiente from "./ambiente";
import Prova from "./prova";
import Visita from "./visita";
import "./tema.css";

/**
 * Página do plano Vitrine — Hot Stone Pizzaria & Hambúrgueria.
 *
 * A primeira vitrine de um negócio de verdade (a da Pedra do Baú é o teste do
 * processo, com atrativo público e identidade derivada da pedra). Aqui a marca
 * é do cliente: o vermelho, o preto e a condensada de letreiro saem do site
 * que a própria casa mantém, e estão registrados em `vitrines/hot-stone/`.
 *
 * O que a página **não** mostra, e por quê, está em
 * `vitrines/hot-stone/formulario.md`: não há um preço porque a casa não
 * publica nenhum, não há depoimento porque ela não escolheu quais destacar, e
 * não há botão de pedido online porque o link de delivery dela aponta para a
 * loja antiga. Nada disso foi preenchido de cabeça.
 *
 * A ordem é a padrão da skill — dobra, oferta, ambiente, prova, visita. O
 * ambiente não subiu para antes da oferta porque o que a Hot Stone vende é
 * comida: quem procura onde jantar decide pelo que se come e confirma pelo
 * salão, não o contrário.
 */

/**
 * Fonte só desta rota.
 *
 * O `layout.tsx` raiz carrega Archivo e Piazzolla para o site inteiro; a
 * vitrine carrega a sua na própria página, e `tema.css` aponta
 * `--font-display` para esta variável. Anton é a condensada que o site da casa
 * usa nos títulos de impacto — é a voz do letreiro da fachada. O corpo fica no
 * Archivo do site, porque duas famílias bastam.
 */
const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vitrine-display",
});

const siteUrl = getSiteUrl();

/**
 * `trailingSlash: true` no next.config.ts: a rota é servida com barra final,
 * então canonical, og:url e JSON-LD precisam da barra — sem ela apontam para
 * um 308.
 */
const pageUrl = `${siteUrl}/mapa-turistico/hot-stone/`;

const local = getLocal("hot-stone");

/**
 * A foto que abre a página é também a do cartão social, e o alt é cópia
 * literal do que `src/data/image-alt.json` guarda para o arquivo: metadata não
 * roda no cliente e não passa pelo `getAlt`, então as duas descrições precisam
 * ser conferidas juntas se a foto mudar.
 *
 * Não é a capa do cadastro (a fachada): aquela manda no cartão do mapa, esta
 * manda na página — e é esta que o cliente vai mandar no WhatsApp.
 */
const ogImage = {
  url: "/assets/mapa/hot-stone/hot-stone-7.webp",
  width: 1620,
  height: 1080,
  alt: "Seis mãos tirando fatias ao mesmo tempo de uma pizza de brócolis com calabresa e azeitona, na chapa preta sobre a mesa de madeira forrada de jornal",
};

export function generateMetadata() {
  return {
    /**
     * `absolute` para escapar do `template: "%s | Refúgio da Pedra SP"` do
     * layout raiz. Quem procura onde jantar em São Bento não pode ler o nome
     * de uma pousada no título do resultado — a ligação com o Refúgio está no
     * rodapé e no `publisher` do JSON-LD, que é onde ela pertence.
     */
    title: {
      absolute: "Hot Stone: pizzaria e hambúrgueria em São Bento do Sapucaí",
    },
    description:
      "Pizza assada na hora, hambúrguer artesanal e chope na torneira na avenida que corta o centro de São Bento do Sapucaí. Abre todas as noites a partir das 18h, com salão, balcão de bar e entrega.",
    openGraph: {
      title: "Hot Stone Pizzaria & Hambúrgueria — São Bento do Sapucaí",
      description:
        "Pizza, hambúrguer, porção e chope no centro de São Bento. Abre todas as noites, a partir das 18h.",
      /* `siteName` do mapa, não da pousada: esta rota é um ramo do guia da
         cidade, e é o rótulo que WhatsApp e Telegram imprimem acima do título
         do cartão. */
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

/**
 * O nó do negócio reusa o `@id` da âncora que o `ItemList` da landing já
 * publica (`…/mapa-turistico/#hot-stone`), em vez de criar um segundo nó para
 * a mesma casa — é o que a Pedra do Baú faz, e é o mesmo cuidado que o
 * repositório tem com o `#business` do Refúgio.
 *
 * O `@type` é `Restaurant` e na landing é `TouristAttraction`: os dois valem
 * para o mesmo `@id` e o consumidor os soma, que é a verdade — é um
 * restaurante, e é um lugar que o guia da cidade lista. O tipo específico mora
 * aqui porque é esta página que descreve o negócio.
 *
 * Não há `aggregateRating`. A nota existe no cadastro e a página a mostra, mas
 * ela é a que a própria casa publica no site dela: este site não hospeda as
 * avaliações nem as apurou, e marcar isso como dado estruturado é o tipo de
 * marcação que derruba o domínio inteiro, não só a página.
 */
const negocioJsonLd: WithContext<Restaurant> | null = local
  ? {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "@id": `${siteUrl}/mapa-turistico/#hot-stone`,
      name: local.nome,
      description: local.descricao ?? local.resumo,
      url: pageUrl,
      ...(local.site ? { sameAs: local.site } : {}),
      ...(local.tel ? { telephone: local.tel } : {}),
      servesCuisine: ["Pizza", "Hambúrguer"],
      image: (local.fotos?.arquivos ?? [])
        .slice(0, 6)
        .map((arquivo) => `${siteUrl}/assets/${local.fotos!.pasta}/${arquivo}`),
      address: {
        "@type": "PostalAddress",
        streetAddress: local.endereco,
        addressLocality: "São Bento do Sapucaí",
        addressRegion: "SP",
        addressCountry: "BR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: local.lat,
        longitude: local.lng,
      },
      /* `horarioSchema` traduz a frase em português do cadastro para
         `Mo-Th 18:00-23:30`, e devolve `undefined` no que não entende — o
         campo some em vez de publicar horário que o buscador lê errado. */
      ...(horarioSchema(local.horario) ? { openingHours: horarioSchema(local.horario) } : {}),
    }
  : null;

const jsonLd: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  name: "Hot Stone Pizzaria & Hambúrgueria — São Bento do Sapucaí",
  description:
    "O que a Hot Stone serve, como é o salão, o horário e a rota até a porta, no centro de São Bento do Sapucaí.",
  url: pageUrl,
  inLanguage: "pt-BR",
  isPartOf: { "@id": `${siteUrl}/#website` },
  // O negócio da pousada é descrito uma única vez no layout raiz.
  publisher: { "@id": `${siteUrl}/#business` },
  mainEntity: { "@id": `${siteUrl}/mapa-turistico/#hot-stone` },
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
      item: `${siteUrl}/mapa-turistico/`,
    },
    { "@type": "ListItem", position: 3, name: "Hot Stone", item: pageUrl },
  ],
};

function HotStonePage(): React.ReactNode {
  return (
    <>
      {negocioJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(negocioJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(breadcrumbJsonLd) }}
      />
      {/*
        `data-vitrine` liga o tema do parceiro (./tema.css) — vermelho de
        letreiro, papel quente no fundo, canto reto.

        O escopo para no `<main>` de propósito, como o `data-mapa-tema` da
        landing: cabeçalho e rodapé são a marca do Refúgio e continuam em
        âmbar. Uma vitrine é a identidade do parceiro dentro do site do mapa,
        não uma troca de tema do site.

        A classe da fonte vive aqui e não no `<html>`: assim o Anton é
        carregado por esta rota e por mais nenhuma.
      */}
      <main
        data-vitrine="hot-stone"
        className={`${anton.variable} bg-background`}
      >
        <Dobra />
        <Cardapio />
        <Ambiente />
        <Prova />
        <Visita />
      </main>
    </>
  );
}

export default HotStonePage;
