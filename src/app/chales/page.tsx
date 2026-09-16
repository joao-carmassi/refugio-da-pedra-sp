import type {
  BreadcrumbList,
  CollectionPage,
  ItemList,
  WithContext,
} from 'schema-dts';
import slugify from 'slugify';
import JsonLd from '@/components/json-ld';
import chales from '@/data/chales.json';
import { getSiteUrl } from '@/lib/env';
import Catalogo from './catalogo';

/*
  O JSON-LD da listagem fica na página, não em `chales/layout.tsx`: o layout
  também envolve `/chales/[slug]/`, e ali o breadcrumb é outro (três níveis) e
  a lista de acomodações não descreve a página.
*/
function ChalesPage(): React.ReactNode {
  const siteUrl = getSiteUrl();
  // `trailingSlash: true` no next.config.ts: a rota é servida com barra final.
  const pageUrl = `${siteUrl}/chales/`;

  const itemListJsonLd: WithContext<ItemList> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${pageUrl}#acomodacoes`,
    name: 'Acomodações - Pousada Refúgio da Pedra SP',
    description:
      'Chalés, cabanas e domos da Pousada Refúgio da Pedra SP em São Bento do Sapucaí.',
    numberOfItems: chales.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: chales.map((chale, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: chale.nome,
      url: `${pageUrl}${slugify(chale.nome, { lower: true, strict: true })}/`,
    })),
  };

  const collectionPageJsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#webpage`,
    name: 'Chalés em São Bento do Sapucaí - Pousada Refúgio da Pedra SP',
    description:
      'Chalés, cabana e domo do Refúgio da Pedra SP em São Bento do Sapucaí, na Serra da Mantiqueira.',
    url: pageUrl,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#business` },
    mainEntity: { '@id': `${pageUrl}#acomodacoes` },
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Chalés', item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={collectionPageJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Catalogo />
    </>
  );
}

export default ChalesPage;
