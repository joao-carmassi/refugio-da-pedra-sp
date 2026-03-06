import Script from 'next/script';
import serialize from 'serialize-javascript';
import type { WithContext, ItemList } from 'schema-dts';
import { getSiteUrl } from '@/lib/env';
import chales from '@/data/chales.json';
import slugify from 'slugify';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Acomodações - Refúgio da Pedra',
    description:
      'Conheça os chalés, cabanas e domos do Refúgio da Pedra em São Bento do Sapucaí. Acomodações únicas em meio à natureza da Serra da Mantiqueira.',
    keywords: [
      'chalés',
      'cabanas',
      'domos',
      'hospedagem',
      'São Bento do Sapucaí',
      'Serra da Mantiqueira',
    ],
    openGraph: {
      title: 'Acomodações - Refúgio da Pedra',
      description:
        'Chalés, cabanas e domos em meio à natureza em São Bento do Sapucaí.',
      type: 'website',
      url: `${siteUrl}/chales`,
    },
    alternates: {
      canonical: `${siteUrl}/chales`,
    },
  };
}

const jsonLd: WithContext<ItemList> = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Acomodações - Refúgio da Pedra',
  description:
    'Chalés, cabanas e domos do Refúgio da Pedra em São Bento do Sapucaí.',
  itemListElement: chales.map((chale, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    name: chale.nome,
    url: `${getSiteUrl()}/chales/${slugify(chale.nome, { lower: true, strict: true })}`,
  })),
};

function ChalesLayout({ children }: Props): React.ReactNode {
  return (
    <>
      <Script
        id='jsonld-chales'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serialize(jsonLd),
        }}
      />
      {children}
    </>
  );
}

export default ChalesLayout;
