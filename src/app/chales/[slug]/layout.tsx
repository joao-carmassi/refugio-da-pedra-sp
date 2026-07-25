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
  // `trailingSlash: true` no next.config.ts: a rota é servida com barra final,
  // então canonical/og:url precisam da barra ou apontam para um 308.
  const pageUrl = `${siteUrl}/chales/${slug}/`;
  return {
    // `chales/layout.tsx` define um `title` string, o que consome o template
    // do layout raiz — por isso a string completa é montada aqui.
    title: {
      absolute: `${chale.nome} — Chalé em São Bento do Sapucaí | Refúgio da Pedra`,
    },
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
      siteName: 'Refúgio da Pedra',
      type: 'website',
      url: pageUrl,
      images: [
        {
          // Arquivo estático: servido exatamente assim, sem barra final.
          url: `${siteUrl}/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`,
          alt: `${chale.nome} — Refúgio da Pedra, São Bento do Sapucaí`,
        },
      ],
    },
    alternates: {
      canonical: pageUrl,
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
  // `trailingSlash: true` no next.config.ts: a rota é servida com barra final.
  const pageUrl = `${siteUrl}/chales/${slug}/`;

  const jsonLd: WithContext<Room> = {
    '@context': 'https://schema.org',
    '@type': 'Room',
    '@id': `${pageUrl}#acomodacao`,
    name: chale.nome,
    description: `${chale.nome} no Refúgio da Pedra: ${chale.capacidade}, ${chale.camas}, ${chale.banheiros}. ${chale.tamanho}.`,
    url: pageUrl,
    // Arquivos estáticos: servidos exatamente assim, sem barra final.
    image: chale.banner.map(
      (n) => `${siteUrl}/assets/refugio/chales/${chale.id}/refugio-${n}.webp`,
    ),
    occupancy: {
      '@type': 'QuantitativeValue',
      unitCode: 'C62',
      value: chale.capacidade_num,
      maxValue: chale.capacidade_num,
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      unitCode: 'MTK',
      unitText: 'm²',
      value: chale.tamanho_m2,
    },
    numberOfBathroomsTotal: chale.banheiros_num,
    bed: {
      '@type': 'BedDetails',
      numberOfBeds: chale.camas_num,
      typeOfBed: chale.camas_tipo,
    },
    amenityFeature: [
      ...chale.ambientes,
      ...chale.comodidades,
      ...chale.area_externa,
    ].map((name) => ({
      '@type': 'LocationFeatureSpecification' as const,
      name,
      value: true,
    })),
    petsAllowed: chale.politica.pets_permitidos,
    // O negócio é descrito uma única vez no layout raiz.
    containedInPlace: { '@id': `${siteUrl}/#business` },
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Chalés',
        item: `${siteUrl}/chales/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: chale.nome,
        item: pageUrl,
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
