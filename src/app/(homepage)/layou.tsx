import Script from 'next/script';
import serialize from 'serialize-javascript';
import type { WithContext, LodgingBusiness } from 'schema-dts';
import { getSiteUrl } from '@/lib/env';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Refúgio da Pedra - Chalés e Experiências em São Bento do Sapucaí',
    description:
      'Descubra o Refúgio da Pedra, um paraíso em São Bento do Sapucaí, oferecendo chalés aconchegantes em meio à natureza e experiências únicas para todos os gostos.',
    keywords: [
      'chalés',
      'camping',
      'São Bento do Sapucaí',
      'hospedagem',
      'natureza',
      'experiências',
      'Serra da Mantiqueira',
    ],
    authors: [{ name: 'Refúgio da Pedra SP' }],
    openGraph: {
      title: 'Refúgio da Pedra - Chalés e Experiências',
      description:
        'Um paraíso em São Bento do Sapucaí com chalés e experiências na natureza.',
      type: 'website',
      url: siteUrl,
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

const jsonLd: WithContext<LodgingBusiness> = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Refúgio da Pedra',
  description:
    'Complexo de chalés, cabanas e domos em meio à natureza, em São Bento do Sapucaí, na Serra da Mantiqueira.',
  url: getSiteUrl(),
  image: `${getSiteUrl()}/assets/refugio/geral/refugio-1.webp`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'São Bento do Sapucaí',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
};

async function HomeLayout({ children }: Props): Promise<React.ReactNode> {
  return (
    <>
      <Script
        id='jsonld-home'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serialize(jsonLd),
        }}
      />
      {children}
    </>
  );
}

export default HomeLayout;
