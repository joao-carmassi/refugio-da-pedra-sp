import Home from '@/app/page';
import chales from '@/db.json';
import IChale from '@/interfaces/IChale';
import TituloChale from './TituloChale';
import Banner from './Banner';
import Info from './Info';
import Texto from './Texto';
import Fotos from './Fotos';

interface Props {
  params: Promise<{ id: string }>;
}

function getChale(id: string): IChale | undefined {
  return chales.data.find((chale) => chale.id === id);
}

async function PaginaChale({ params }: Props) {
  const { id } = await params;
  const chale = getChale(id);

  if (!chale) return <Home />;

  return (
    <main className="mt-12 min-h-svh">
      <TituloChale titulo={chale.nome} />
      <Banner chale={chale.id} banner={chale.banner} />
      <Info chale={chale} />
      <Texto />
      <Fotos chale={chale.id} fotos={chale.fotos} />
    </main>
  );
}

export async function generateStaticParams() {
  return chales.data.map((chale) => ({
    id: chale.id,
  }));
}

export default PaginaChale;
