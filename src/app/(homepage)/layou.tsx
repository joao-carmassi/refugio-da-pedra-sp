import Script from 'next/script';
import serialize from 'serialize-javascript';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata() {
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
    ],
    authors: [{ name: 'Refúgio da Pedra SP' }],
    openGraph: {
      title: 'Refúgio da Pedra - Chalés e Experiências',
      description:
        'Um paraíso em São Bento do Sapucaí com chalés e experiências na natureza.',
      type: 'website',
    },
  };
}

const jsonLd = {};

async function HomeLayout({ children }: Props): Promise<React.ReactNode> {
  return (
    <>
      <Script
        id='jsonld'
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
