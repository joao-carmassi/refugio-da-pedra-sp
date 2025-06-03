import chales from '@/data/chales.json';
import IChale from '@/interfaces/IChale';
import { notFound } from 'next/navigation';
import slugify from 'slugify';
import ContainerNomeFoto from './ContainerNomeFoto';
import ContainerInfoChale from './ContainerInfo';
import ContainerTextoChale from './ContainerTextoChale';
import ContainerFotoChale from './ContainerFotosChale';

interface Props {
  params: Promise<{ nome: string }>;
}

function getChale(nome: string): IChale | undefined {
  return chales.find(
    (chale) => slugify(chale.nome, { lower: true, strict: true }) === nome
  );
}

export async function generateMetadata({ params }: Props) {
  const { nome } = await params;
  const chale = getChale(nome);

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
  const { nome } = await params;
  const chale = getChale(nome);

  if (!chale) return notFound();

  return (
    <main className="min-h-container delay-150 duration-500 animate-in fade-in ease-in-out fill-mode-both">
      <ContainerNomeFoto chale={chale} />
      <ContainerInfoChale chale={chale} />
      <ContainerTextoChale />
      <ContainerFotoChale chale={chale} />
    </main>
  );
}

export async function generateStaticParams() {
  return chales.map((chale) => ({
    nome: slugify(chale.nome, { lower: true, strict: true }),
  }));
}

export default PaginaChale;
