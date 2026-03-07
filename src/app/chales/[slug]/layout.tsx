import Script from 'next/script';
import serialize from 'serialize-javascript';
import type { WithContext, LodgingBusiness } from 'schema-dts';
import chales from '@/data/chales.json';
import { getSiteUrl } from '@/lib/env';
import { redirect } from 'next/navigation';
import slugify from 'slugify';

interface Props {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return chales.map((chale) => ({
    slug: slugify(chale.nome, { lower: true, strict: true }),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chale = chales.find(
    (c) => slugify(c.nome, { lower: true, strict: true }) === slug,
  );

  if (!chale) return {};

  const siteUrl = getSiteUrl();
  return {
    title: `${chale.nome} - Refúgio da Pedra`,
    description: `${chale.nome} no Refúgio da Pedra: ${chale.capacidade}, ${chale.camas}, ${chale.banheiros}. ${chale.tamanho} em São Bento do Sapucaí, na Serra da Mantiqueira.`,
    keywords: [
      chale.nome,
      'chalé',
      'São Bento do Sapucaí',
      'hospedagem',
      'natureza',
      ...chale.comodidades,
    ],
    openGraph: {
      title: `${chale.nome} - Refúgio da Pedra`,
      description: `${chale.nome} no Refúgio da Pedra: ${chale.capacidade}, ${chale.camas}, ${chale.banheiros}.`,
      type: 'website',
      url: `${siteUrl}/chales/${slug}`,
      images: [
        {
          url: `${siteUrl}/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`,
          width: 800,
          height: 800,
          alt: chale.nome,
        },
      ],
    },
    alternates: {
      canonical: `${siteUrl}/chales/${slug}`,
    },
  };
}

async function ChaleLayout({
  children,
  params,
}: Props): Promise<React.ReactNode> {
  const { slug } = await params;
  const chale = chales.find(
    (c) => slugify(c.nome, { lower: true, strict: true }) === slug,
  );

  if (!chale) redirect('/chales');

  const siteUrl = getSiteUrl();
  const jsonLd: WithContext<LodgingBusiness> = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: chale.nome,
    description: `${chale.nome} no Refúgio da Pedra: ${chale.capacidade}, ${chale.camas}, ${chale.banheiros}. ${chale.tamanho}.`,
    url: `${siteUrl}/chales/${slug}`,
    image: `${siteUrl}/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Bento do Sapucaí',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
  };

  return (
    <>
      <Script
        id='jsonld-chale'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serialize(jsonLd),
        }}
      />
      {children}
    </>
  );
}

export default ChaleLayout;
