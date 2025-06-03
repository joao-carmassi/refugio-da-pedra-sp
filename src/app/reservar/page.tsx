import FormularioDeReserva from './Form';

export const metadata = {
  title: 'Reservar - Refúgio da Pedra SP',
  description: 'Reserva seu chalé',
};

const Reservar = () => {
  const path = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <main className="min-h-container flex items-center justify-center delay-150 duration-500 animate-in fade-in ease-in-out fill-mode-both bg-card">
      <div className="w-full min-h-container grid lg:grid-cols-2">
        <div className="px-6 m-auto w-full flex flex-col items-center">
          <FormularioDeReserva />
        </div>
        <img
          src={`${path}/assets/refugio/geral/refugio-1.webp`}
          className="max-h-container bg-card h-full hidden lg:block object-cover object-center"
        />
      </div>
    </main>
  );
};

export default Reservar;
