interface Props {
  chale: string;
  fotos: number;
}

function Fotos({ chale, fotos }: Props) {
  return (
    <section className="px-4 lg:w-3/5 mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-5 lg:leading-tight dark:text-white">
        Fotografias
      </h2>
      <div id="containerImgs" className="columns-1 md:columns-2 lg:columns-3">
        {Array.from({ length: fotos }, (_, index) => (
          <img
            key={index}
            loading="lazy"
            src={`${
              process.env.NEXT_PUBLIC_BASE_PATH
            }/assets/chales/${chale}/refugio-${index + 1}.webp`}
            alt=""
            className="w-full mb-2.5 md:mb-5 shadow-md"
          />
        ))}
      </div>
    </section>
  );
}

export default Fotos;
