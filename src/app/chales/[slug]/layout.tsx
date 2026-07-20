import serialize from 'serialize-javascript';
import type { WithContext, Room, BreadcrumbList } from 'schema-dts';
import chales from '@/data/chales.json';
import { getSiteUrl } from '@/lib/env';
import { notFound } from 'next/navigation';
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
    title: chale.nome,
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

  if (!chale) notFound();

  const siteUrl = getSiteUrl();
  const jsonLd: WithContext<Room> = {
    '@context': 'https://schema.org',
    '@type': 'Room',
    name: chale.nome,
    description: `${chale.nome} no Refúgio da Pedra: ${chale.capacidade}, ${chale.camas}, ${chale.banheiros}. ${chale.tamanho}.`,
    url: `${siteUrl}/chales/${slug}`,
    image: `${siteUrl}/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`,
    containedInPlace: {
      '@type': 'LodgingBusiness',
      name: 'Refúgio da Pedra SP',
      url: siteUrl,
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
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Chalés',
        item: `${siteUrl}/chales`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: chale.nome,
        item: `${siteUrl}/chales/${slug}`,
      },
    ],
  };

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

export default ChaleLayout;
