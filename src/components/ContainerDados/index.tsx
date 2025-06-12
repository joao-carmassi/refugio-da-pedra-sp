import AccordionDados from '../Accordion';

const ContainerDados = () => {
  const path = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <section className="w-full max-w-7xl px-6 md:px-12 py-6 md:py-12 md:gap-8 lg:gap-16 mx-auto flex items-center justify-between flex-col-reverse lg:flex-row">
      <div className="pt-5 md:pt-0">
        <img
          loading="lazy"
          className="rounded-xl"
          src={`${path}/assets/refugio/geral/refugio-28.webp`}
          alt=""
        />
      </div>
      <div className="w-full">
        <h2 className="block text-3xl font-bold text-foreground sm:text-4xl lg:text-6xl lg:leading-tight">
          Comodidades:
        </h2>
        <p className="mb-2 mt-3 md:text-lg text-foreground/85 dark:text-neutral-400">
          Nos importamos com o seu conforto, por isso sua reserva inclui uma
          série de comodidades para tornar sua estadia ainda mais especial:
        </p>
        <AccordionDados />
      </div>
    </section>
  );
};

export default ContainerDados;
