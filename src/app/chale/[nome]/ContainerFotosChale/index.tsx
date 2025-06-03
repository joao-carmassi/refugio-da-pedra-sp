import IChale from '@/interfaces/IChale';

interface Props {
  chale: IChale;
}

const ContainerFotoChale = ({ chale }: Props) => {
  const path = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <section className="max-w-7xl w-full place-items-center mx-auto px-6 md:px-12 py-4">
      <h2 className="text-2xl font-bold text-foreground mb-5 lg:leading-tight w-full text-start">
        Fotografias
      </h2>
      <div id="containerImgs" className="columns-1 md:columns-2 lg:columns-3">
        {Array.from({ length: chale.fotos }, (_, index) => (
          <img
            key={index}
            loading="lazy"
            src={`${path}/assets/refugio/chales/${chale.id}/refugio-${
              index + 1
            }.webp`}
            alt=""
            className="w-full mb-2.5 md:mb-5 shadow-md"
          />
        ))}
      </div>
    </section>
  );
};

export default ContainerFotoChale;
