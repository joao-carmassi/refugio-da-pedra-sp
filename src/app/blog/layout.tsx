import type { WithContext, Blog } from 'schema-dts';
import Header from '@/components/header';
import Footer from '@/components/footer';
import JsonLd from '@/components/json-ld';
import { getSiteUrl } from '@/lib/env';
import { DEFAULT_POST_IMAGE } from '@/lib/posts';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Blog',
    description:
      'Dicas, histórias e novidades sobre o Refúgio da Pedra SP e a região de São Bento do Sapucaí na Serra da Mantiqueira.',
    keywords: [
      'blog',
      'São Bento do Sapucaí',
      'Serra da Mantiqueira',
      'natureza',
      'dicas de viagem',
      'ecoturismo',
    ],
    // O Next.js substitui o objeto `openGraph` inteiro do layout pai (ver
    // resolve-metadata.js: `newResolvedMetadata.openGraph = resolveOpenGraph(...)`),
    // então `siteName`, `locale` e `images` precisam ser repetidos aqui.
    openGraph: {
      title: 'Blog - Refúgio da Pedra SP',
      description:
        'Dicas, histórias e novidades sobre o Refúgio da Pedra SP e a região de São Bento do Sapucaí.',
      siteName: 'Refúgio da Pedra SP',
      locale: 'pt_BR',
      type: 'website',
      url: `${siteUrl}/blog/`,
      images: [
        {
          url: `${siteUrl}${DEFAULT_POST_IMAGE}`,
          width: 1620,
          height: 1080,
          alt: 'Chalés do Refúgio da Pedra SP ao entardecer, com a Pedra do Baú ao fundo, em São Bento do Sapucaí',
        },
      ],
    },
    alternates: {
      canonical: `${siteUrl}/blog/`,
    },
  };
}

/*
  O nó `Blog` fica no layout de propósito: ele é referenciado por `isPartOf` no
  `BlogPosting` de cada post, então precisa estar em `/blog/` e em
  `/blog/[post]/`. O breadcrumb, que é diferente em cada nível, mora em
  `page.tsx` de cada rota.
*/
const jsonLd: WithContext<Blog> = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': `${getSiteUrl()}/blog/#blog`,
  name: 'Blog - Pousada Refúgio da Pedra SP',
  description:
    'Dicas, histórias e novidades sobre o Refúgio da Pedra SP e a região de São Bento do Sapucaí na Serra da Mantiqueira.',
  url: `${getSiteUrl()}/blog/`,
  inLanguage: 'pt-BR',
  // Referências ao nó canônico do negócio e ao WebSite, ambos definidos no
  // layout raiz — nada de dados parciais repetidos aqui.
  publisher: { '@id': `${getSiteUrl()}/#business` },
  isPartOf: { '@id': `${getSiteUrl()}/#website` },
};

function BlogLayout({ children }: Props): React.ReactNode {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default BlogLayout;
