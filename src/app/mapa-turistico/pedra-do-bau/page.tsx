/* Hallmark · genre: editorial · macrostructure: Photographic · chrome: N6 masthead + Ft1 footer · design-system: design.md */

import serialize from "serialize-javascript";
import type { WithContext, TouristAttraction, WebPage, BreadcrumbList } from "schema-dts";
import { Oswald } from "next/font/google";
import { getSiteUrl } from "@/lib/env";
import { getLocal, getFotoPrincipal, CATEGORIAS } from "@/lib/mapa-turistico";
import Dobra from "./dobra";
import Subir from "./subir";
import Galeria from "./galeria";
import Numeros from "./numeros";
import Visita from "./visita";
import "./tema.css";

/**
 * Página do plano Vitrine — TESTE.
 *
 * A Pedra do Baú é atrativo público: não tem dono, não assina plano e não
 * respondeu formulário. Ela está aqui para exercitar o processo da skill
 * `pagina-vitrine` de ponta a ponta antes de a primeira página vendida ser
 * feita. O que muda, em relação a uma vitrine de verdade: a identidade foi
 * derivada da própria pedra em vez de vir de uma marca, e a vaga de prova
 * social virou uma faixa de números — não há avaliação de cliente para um
 * monólito, e inventar uma seria o erro que esta página existe para não
 * cometer.
 *
 * O cadastro do ponto não foi tocado: ele segue sem `destaque` e sem
 * `vitrine`, exatamente como estava. A consequência é que nada aponta para
 * cá — nem o cartão do mapa, nem o sitemap, que só publicam rota de parceiro
 * com `vitrine: true`.
 *
 * A composição segue o resto do site: uma seção por arquivo, montadas aqui na
 * ordem em que aparecem.
 */

/**
 * Fonte só desta rota.
 *
 * O `layout.tsx` raiz carrega Archivo e Piazzolla para o site inteiro; uma
 * vitrine com identidade própria carrega a dela na própria página, e
 * `tema.css` aponta `--font-display` para esta variável. Oswald é condensada e
 * tem cara de placa de trilha e de cota em carta topográfica — o corpo continua
 * no Archivo do site, porque duas famílias bastam.
 */
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-vitrine-display",
});

const siteUrl = getSiteUrl();

/**
 * `trailingSlash: true` no next.config.ts: a rota é servida com barra final,
 * então canonical, og:url e JSON-LD precisam da barra — sem ela apontam para
 * um 308.
 */
const pageUrl = `${siteUrl}/mapa-turistico/pedra-do-bau/`;

const local = getLocal("pedra-do-bau");

/**
 * A foto que abre a página é também a do cartão social, e o alt é cópia
 * literal do que `src/data/image-alt.json` guarda para o arquivo: metadata não
 * roda no cliente e não passa pelo `getAlt`, então as duas descrições precisam
 * ser conferidas juntas se a foto mudar.
 */
const ogImage = {
  url: "/assets/mapa/pedra-do-bau/pedra-do-bau-2.webp",
  width: 1620,
  height: 1215,
  alt: "Vista aérea do maciço da Pedra do Baú à luz dourada do fim de tarde, com a serra ao fundo",
};

export function generateMetadata() {
  return {
    /**
     * `absolute` para escapar do `template: "%s | Refúgio da Pedra SP"` do
     * layout raiz. Quem procura "pedra do baú" está planejando uma trilha, não
     * escolhendo pousada — ler o nome de uma hospedagem no título do resultado
     * é o desencontro que faz voltar para a busca. A ligação com o Refúgio
     * está no rodapé e no `publisher` do JSON-LD, que é onde ela pertence.
     */
    title: {
      absolute: "Pedra do Baú, São Bento do Sapucaí: trilha, via ferrata e rota",
    },
    description:
      "O cume de 1.950 m do Complexo do Baú: quanto tempo dura a subida por cada acesso, por que o guia credenciado é obrigatório, e a rota de carro até o estacionamento onde a trilha começa.",
    openGraph: {
      title: "Pedra do Baú — São Bento do Sapucaí",
      description:
        "Via ferrata, 4 km de trilha pela portaria e vista de 360° sobre a Mantiqueira. Como chegar e o que a subida exige.",
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
 * O nó da atração já existe: é um item do `ItemList` da landing do mapa, com
 * `@id` de âncora (`…/mapa-turistico/#pedra-do-bau`). Esta página **reusa aquele
 * `@id`** em vez de criar um segundo nó para a mesma pedra — duas entidades
 * concorrentes para a mesma coisa é exatamente o erro que o repositório já
 * evita com o `#business` do Refúgio. O que a página acrescenta é `url`: a
 * âncora vira endereço próprio.
 */
const atracaoJsonLd: WithContext<TouristAttraction> | null = local
  ? {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "@id": `${siteUrl}/mapa-turistico/#pedra-do-bau`,
      name: local.nome,
      description: local.descricao ?? local.resumo,
      url: pageUrl,
      image: [`${siteUrl}${getFotoPrincipal(local)}`],
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
      additionalType: CATEGORIAS[local.cat].label,
      /* Não há `openingHours`: o cume não tem horário publicado no cadastro, e
         quem tem é a portaria, que é outro ponto. Horário que o buscador lê
         mas ninguém confirmou manda gente subir a serra à toa.

         Não há `isPartOf` tampouco — `TouristAttraction` não o aceita no
         schema-dts, e a associação já está dita do outro lado: o `ItemList`
         da landing lista este mesmo `@id`. */
    }
  : null;

const jsonLd: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  name: "Pedra do Baú — São Bento do Sapucaí",
  description:
    "O que a subida ao cume da Pedra do Baú exige, os dois acessos e a rota de carro até onde a trilha começa.",
  url: pageUrl,
  inLanguage: "pt-BR",
  isPartOf: { "@id": `${siteUrl}/#website` },
  // O negócio é descrito uma única vez no layout raiz.
  publisher: { "@id": `${siteUrl}/#business` },
  mainEntity: { "@id": `${siteUrl}/mapa-turistico/#pedra-do-bau` },
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
    { "@type": "ListItem", position: 3, name: "Pedra do Baú", item: pageUrl },
  ],
};

function PedraBauPage(): React.ReactNode {
  return (
    <>
      {atracaoJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(atracaoJsonLd) }}
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
        `data-vitrine` liga o tema do parceiro (./tema.css) — granito na sombra
        na ação, neblina no fundo, canto reto.

        O escopo para no `<main>` de propósito, como o `data-mapa-tema` da
        landing: cabeçalho e rodapé são a marca do Refúgio e continuam em
        âmbar. Uma vitrine é a identidade do parceiro dentro do site do mapa,
        não uma troca de tema do site.

        A classe da fonte vive aqui e não no `<html>`: assim o Oswald é
        carregado por esta rota e por mais nenhuma.
      */}
      <main
        data-vitrine="pedra-do-bau"
        className={`${oswald.variable} bg-background`}
      >
        <Dobra />
        <Subir />
        <Galeria />
        <Numeros />
        <Visita />
      </main>
    </>
  );
}

export default PedraBauPage;
