interface Props {
  chale: string;
  banner: number;
}

function Banner({ chale, banner }: Props) {
  return (
    <section id="banner" className="px-4 lg:w-3/5 mx-auto pb-5">
      <img
        loading="lazy"
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/chales/${chale}/refugio-${banner}.webp`}
        alt=""
        className="w-full rounded-xl"
      />
    </section>
  );
}

export default Banner;
