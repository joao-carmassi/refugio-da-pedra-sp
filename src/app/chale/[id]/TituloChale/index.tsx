interface Props {
  titulo: string;
}

function TituloChale({ titulo }: Props) {
  return (
    <section className="px-4 lg:w-3/5 mx-auto">
      <h1
        id="nomeChale"
        className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white mb-2"
      >
        {titulo}
      </h1>
    </section>
  );
}
export default TituloChale;
