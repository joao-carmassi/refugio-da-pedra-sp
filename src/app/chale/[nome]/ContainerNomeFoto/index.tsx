import IChale from '@/interfaces/IChale';

interface Props {
  chale: IChale;
}

const ContainerNomeFoto = ({ chale }: Props) => {
  const path = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <section className="max-w-7xl w-full place-items-center mx-auto px-6 md:px-12 py-4 flex flex-col items-start">
      <h1
        id="nomeChale"
        className="block text-3xl font-bold text-foreground sm:text-4xl lg:text-6xl lg:leading-tight mb-2"
      >
        {chale.nome}
      </h1>
      <img
        loading="lazy"
        src={`${path}/assets/refugio/chales/${chale.id}/refugio-${chale.banner}.webp`}
        alt=""
        className="w-full rounded-xl"
      />
    </section>
  );
};

export default ContainerNomeFoto;
