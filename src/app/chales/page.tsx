import Head from 'next/head';
import ContainerChales from './ContainerChales';

export const metadata = {
  title: 'Chales - Refúgio da Pedra SP',
  description:
    'Descubra chalés aconchegantes em meio à natureza, perfeitos para relaxar e renovar as energias. Opções para casais e pequenos grupos, algumas pet-friendly. Reserve já sua experiência única!',
};

function PaginaChales() {
  return (
    <>
      <Head>
        <title>Chales - Refugio da Pedra SP</title>
        <meta name="description" content="Conheca os chales disponiveis" />
      </Head>
      <main className="mt-12 min-h-svh">
        <ContainerChales />
      </main>
    </>
  );
}

export default PaginaChales;
