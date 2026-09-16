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
const pageUrl = `${getSiteUrl()}/chales/`;

export function generateMetadata() {
  return {
    title: 'Chalés em São Bento do Sapucaí',
    description:
      'Conheça os chalés, cabanas e domos do Refúgio da Pedra SP em São Bento do Sapucaí. Acomodações únicas em meio à natureza da Serra da Mantiqueira.',
    keywords: [
      'chalés',
      'cabanas',
      'domos',
      'hospedagem',
      'São Bento do Sapucaí',
      'Serra da Mantiqueira',
    ],
    openGraph: {
      title: 'Acomodações - Refúgio da Pedra SP',
      description:
        'Chalés, cabanas e domos em meio à natureza em São Bento do Sapucaí.',
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

/*
  JSON-LD da listagem (CollectionPage, ItemList e BreadcrumbList) mora em
  `page.tsx`, não aqui: este layout também envolve `/chales/[slug]/`, que tem o
  próprio breadcrumb de três níveis, e os nós vazariam para as páginas de chalé.
*/

function ChalesLayout({ children }: Props): React.ReactNode {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default ChalesLayout;
