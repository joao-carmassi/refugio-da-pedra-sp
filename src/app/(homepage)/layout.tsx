import serialize from 'serialize-javascript';
import type { WithContext, LodgingBusiness } from 'schema-dts';
import { getSiteUrl, getInPhoneNumber } from '@/lib/env';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: {
      absolute: 'Refúgio da Pedra – Chalés e Pousada em São Bento do Sapucaí',
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

const rawPhone = getInPhoneNumber();

const jsonLd: WithContext<LodgingBusiness> = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Refúgio da Pedra SP',
  description:
    'Complexo de chalés, cabanas e domos em meio à natureza, em São Bento do Sapucaí, na Serra da Mantiqueira.',
  url: getSiteUrl(),
  image: `${getSiteUrl()}/assets/refugio/geral/refugio-1.webp`,
  ...(rawPhone
    ? { telephone: rawPhone.startsWith('+') ? rawPhone : `+${rawPhone}` }
    : {}),
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'São Bento do Sapucaí',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -22.67812457941675,
    longitude: -45.66375792387372,
  },
  sameAs: ['https://www.instagram.com/refugiodapedrasp/'],
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
      {children}
    </>
  );
}

export default HomeLayout;
