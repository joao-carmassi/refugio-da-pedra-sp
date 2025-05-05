import Head from 'next/head';
import ContainerChales from './ContainerChales';

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
