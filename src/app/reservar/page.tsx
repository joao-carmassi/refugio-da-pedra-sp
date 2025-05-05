import Head from 'next/head';
import ContainerForm from './ContainerForm';

export const metadata = {
  title: 'Reservar',
  description: 'Reserva seu chalé - Refúgio da Pedra SP',
};

function ReservarPage() {
  return (
    <>
      <Head>
        <title>Reservar - Refugio da Pedra SP</title>
        <meta name="description" content="Reserve agora mesmo" />
      </Head>
      <main className="mt-12">
        <ContainerForm />
      </main>
    </>
  );
}

export default ReservarPage;
