import serialize from 'serialize-javascript';
import type { WithContext, WebPage } from 'schema-dts';
import Header from '@/components/header';
import Footer from '@/components/footer';
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
  alt: 'Chalés do Refúgio da Pedra SP ao entardecer, com a Pedra do Baú ao fundo, em São Bento do Sapucaí',
};

/**
 * `trailingSlash: true` no next.config.ts: toda rota é servida com barra
 * final, então canonical/og:url/JSON-LD precisam apontar para a URL com barra
 * — caso contrário apontam para um 308. Não vale para arquivos estáticos.
 */
const pageUrl = `${getSiteUrl()}/`;

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: {
      absolute: 'Refúgio da Pedra SP – Chalés e Pousada em São Bento do Sapucaí',
    },
    description:
      'Pousada e chalés em São Bento do Sapucaí, na Serra da Mantiqueira. Vista para as montanhas, natureza e conforto. Reserve sua hospedagem no Refúgio da Pedra SP.',
    keywords: [
      'chalés',
      'camping',
      'São Bento do Sapucaí',
      'hospedagem',
      'natureza',
      'experiências',
      'Serra da Mantiqueira',
    ],
    authors: [{ name: 'Pousada Refúgio da Pedra SP' }],
    openGraph: {
      title: 'Refúgio da Pedra SP - Chalés e Experiências',
      description:
        'Um paraíso em São Bento do Sapucaí com chalés e experiências na natureza.',
      siteName: 'Refúgio da Pedra SP',
      type: 'website',
      url: `${siteUrl}/`,
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteUrl}/`,
    },
  };
}

/**
 * O negócio em si é descrito uma única vez no layout raiz
 * (`${siteUrl}/#business`). Aqui apenas referenciamos aquele nó.
 */
const jsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${getSiteUrl()}/#webpage`,
  name: 'Pousada Refúgio da Pedra SP – Chalés em São Bento do Sapucaí',
  description:
    'Complexo de chalés, cabanas e domos em meio à natureza, em São Bento do Sapucaí, na Serra da Mantiqueira.',
  url: pageUrl,
  inLanguage: 'pt-BR',
  isPartOf: { '@id': `${getSiteUrl()}/#website` },
  about: { '@id': `${getSiteUrl()}/#business` },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: `${getSiteUrl()}/assets/refugio/geral/refugio-1.webp`,
    caption:
      'Chalés do Refúgio da Pedra SP ao entardecer, com a Pedra do Baú ao fundo',
  },
};

async function HomeLayout({ children }: Props): Promise<React.ReactNode> {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serialize(jsonLd),
        }}
      />
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default HomeLayout;
