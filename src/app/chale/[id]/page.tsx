import Home from '@/app/page';
import chales from '@/db.json';
import IChale from '@/interfaces/IChale';
import TituloChale from './TituloChale';
import Banner from './Banner';
import Info from './Info';
import Texto from './Texto';
import Fotos from './Fotos';
import Head from 'next/head';

interface Props {
  params: Promise<{ id: string }>;
}

function getChale(id: string): IChale | undefined {
  return chales.data.find((chale) => chale.id === id);
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const chale = getChale(id);

  if (!chale) {
    return {
      title: 'Chalé não encontrado',
      description: 'Chalé não encontrado no Refúgio da Pedra SP.',
    };
  }

  return {
    title: `${chale.nome} - Refúgio da Pedra SP`,
    description: `Conheça o ${chale.nome}, chalé para ${
      chale.capacidade
    }, com ${chale.comodidades.join(', ')} e muito conforto.`,
  };
}

async function PaginaChale({ params }: Props) {
  const { id } = await params;
  const chale = getChale(id);

  if (!chale) return <Home />;

  return (
    <>
      <Head>
        <title>{chale.nome} - Refugio da Pedra SP</title>
        content=
        {`Conheça o ${chale.nome}, chalé para ${
          chale.capacidade
        }, com ${chale.comodidades.join(', ')} e muito conforto.`}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'Product',
              name: chale.nome,
              sku: chale.id,
              brand: {
                '@type': 'Brand',
                name: 'Pousada do Jota',
              },
              offers: {
                '@type': 'Offer',
                priceCurrency: 'BRL',
                price: 'Valor sob consulta',
                availability: 'https://schema.org/InStock',
              },
            }),
          }}
        />
      </Head>
      <main className="mt-12 min-h-svh">
        <TituloChale titulo={chale.nome} />
        <Banner chale={chale.id} banner={chale.banner} />
        <Info chale={chale} />
        <Texto />
        <Fotos chale={chale.id} fotos={chale.fotos} />
      </main>
    </>
  );
}

export async function generateStaticParams() {
  return chales.data.map((chale) => ({
    id: chale.id,
  }));
}

export default PaginaChale;
