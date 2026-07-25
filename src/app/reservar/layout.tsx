import serialize from 'serialize-javascript';
import type { WithContext, WebPage, BreadcrumbList } from 'schema-dts';
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
const pageUrl = `${getSiteUrl()}/reservar/`;

export function generateMetadata() {
  return {
    title: 'Reservar',
    description:
      'Reserve sua estadia no Refúgio da Pedra em São Bento do Sapucaí. Chalés, cabanas e domos disponíveis para uma experiência única na natureza da Serra da Mantiqueira.',
    keywords: [
      'reservar',
      'reserva',
      'chalés',
      'São Bento do Sapucaí',
      'hospedagem',
      'Serra da Mantiqueira',
    ],
    openGraph: {
      title: 'Reservar - Refúgio da Pedra',
      description:
        'Reserve sua estadia no Refúgio da Pedra. Chalés, cabanas e domos na Serra da Mantiqueira.',
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

/**
 * O negócio é descrito uma única vez no layout raiz
 * (`${siteUrl}/#business`). Aqui apenas referenciamos aquele nó.
 */
const jsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${pageUrl}#webpage`,
  name: 'Reservar - Pousada Refúgio da Pedra',
  description:
    'Solicite a reserva da sua estadia na Pousada Refúgio da Pedra, em São Bento do Sapucaí, na Serra da Mantiqueira.',
  url: pageUrl,
  inLanguage: 'pt-BR',
  isPartOf: { '@id': `${getSiteUrl()}/#website` },
  about: { '@id': `${getSiteUrl()}/#business` },
  potentialAction: {
    '@type': 'ReserveAction',
    name: 'Reservar estadia',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: pageUrl,
      actionPlatform: [
        'https://schema.org/DesktopWebPlatform',
        'https://schema.org/MobileWebPlatform',
      ],
    },
    object: { '@id': `${getSiteUrl()}/#business` },
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
      item: `${getSiteUrl()}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Reservar',
      item: pageUrl,
    },
  ],
};

function ReservarLayout({ children }: Props): React.ReactNode {
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

export default ReservarLayout;
