import Link from 'next/link';

function Reserve() {
  const path = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <section className="w-full max-w-7xl px-6 md:px-12 py-6 md:py-12 md:gap-6 lg:gap-12 mx-auto flex justify-between items-center flex-col md:flex-row">
      <div className="lg:col-span-3 flex-1">
        <h2 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
          Reserve seu chalé
        </h2>
        <p className="mt-3 text-lg text-gray-800 dark:text-neutral-400">
          Garanta sua estadia no Refúgio da Pedra e viva uma experiência única
          em meio ao ar livre!
        </p>

        <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <Link
            className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-hidden focus:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none"
            href="/chales"
          >
            Ver chalés
          </Link>
        </div>
      </div>
      <div className="lg:col-span-4 mt-10 lg:mt-0 flex-1">
        <img
          className="w-full rounded-xl"
          src={`${path}/assets/refugio/chales/jade/refugio-6.webp`}
          alt=""
        />
      </div>
    </section>
  );
}

export default Reserve;
