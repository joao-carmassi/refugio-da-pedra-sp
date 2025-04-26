import dataChales from '@/db.json';
import CardChale from './CardChale';

function ContainerChales() {
  const chales = dataChales.data;

  return (
    <section className="py-4 px-4 min-h-screen lg:px-36">
      <h1 className="block text-center md:mb-8 text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl dark:text-white">
        Acomodações
      </h1>
      <ul
        id="listaChales"
        className="grid p-5 md:p-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 grid-flow-row w-full h-full"
      >
        {chales.map((chale) => (
          <CardChale chale={chale} key={chale.id} />
        ))}
      </ul>
    </section>
  );
}

export default ContainerChales;
