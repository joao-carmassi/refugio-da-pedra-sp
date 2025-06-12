function Galeria() {
  const path = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <section className="w-full max-w-7xl px-6 md:px-12 py-6 md:py-12 gap-4 mx-auto flex flex-col items-center">
      <h2 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
        Nossa pousada:
      </h2>
      <p className="mb-3 px-4 text-center md:w-4/5 text-lg text-gray-800 dark:text-neutral-400">
        Aqui, cada detalhe foi pensado para proporcionar conforto, conexão com a
        natureza e momentos inesquecíveis. Veja mais sobre a nossa pousada nas
        fotos abaixo!
      </p>
      <div className="columns-1 md:columns-2 lg:columns-3">
        {Array.from({ length: 29 }, (_, index) => (
          <img
            loading="lazy"
            key={index}
            className="w-full mb-2.5 md:mb-5 shadow-md"
            src={`${path}/assets/refugio/geral/refugio-${index + 1}.webp`}
            alt=""
          />
        ))}
      </div>
    </section>
  );
}

export default Galeria;
