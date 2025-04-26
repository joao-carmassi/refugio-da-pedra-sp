'use client';
import formataData from '@/utils/formataData';
import IForm from '@/interfaces/IForm';
import { useForm } from 'react-hook-form';
import chales from '@/db.json';

function ContainerForm() {
  const { register, handleSubmit } = useForm<IForm>();

  const enviaForm = (data: IForm) => {
    const mensagem = `Ola, me chamo *${
      data.nome
    }* e gostaria de fazer uma reserva no chale *${data.chale}*

*Check-in:* ${formataData(data['check-in'])}
*Check-out:* ${formataData(data['check-out'])}
*Adultos:* ${data.adultos}
${parseInt(data.criancas) >= 1 ? `*Crianças:* ${data.criancas}` : ''}
${parseInt(data.pets) >= 1 ? `*Pets:* ${data.pets}` : ''}`;

    window.open(
      `https://api.whatsapp.com/send?phone=5512996148154&text=${encodeURIComponent(
        mensagem
      )}`,
      '_blanck'
    );
  };

  return (
    <section
      style={{ minHeight: 'calc(100svh - 4rem)' }}
      className="w-full flex md:bg-gray-100 items-center justify-center"
    >
      <div className="md:bg-white md:grid md:grid-cols-1 lg:grid-cols-2 place-items-center w-full md:p-7 gap-10 max-w-[80rem] lg:rounded-2xl lg:shadow-2xl">
        <div className="w-full px-10">
          <form id="form-chale" onSubmit={handleSubmit(enviaForm)}>
            <h1 className="block font-bold mb-5 md:mb-7 text-gray-800 text-3xl lg:leading-tight dark:text-white">
              Formulário de reserva
            </h1>
            <div className="w-full mb-5 md:mb-7">
              <label
                htmlFor="input-nome"
                className="block md:text-md font-medium tracking-wide dark:text-white"
              >
                Nome da reserva
              </label>
              <input
                required
                {...register('nome')}
                type="text"
                id="input-nome"
                className="shadow-xs border-b-2 focus:outline-0  md:text-lg focus:border-yellow-500 py-1 w-full border-gray-300"
                placeholder="Seu nome"
              />
            </div>
            <div className="flex gap-5 mb-5 md:mb-7 w-full">
              <div className="w-full">
                <label
                  htmlFor="check-in"
                  className="block md:text-md font-medium tracking-wide dark:text-white"
                >
                  Check-in
                </label>
                <input
                  required
                  {...register('check-in')}
                  type="date"
                  id="check-in"
                  className="shadow-xs border-b-2 focus:outline-0  md:text-lg focus:border-yellow-500 py-1 w-full border-gray-300"
                  data-placeholder="DD/MM/AAAA"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="check-out"
                  className="block md:text-md font-medium tracking-wide dark:text-white"
                >
                  Check-out
                </label>
                <input
                  required
                  {...register('check-out')}
                  type="date"
                  id="check-out"
                  className="shadow-xs border-b-2 focus:outline-0  md:text-lg focus:border-yellow-500 py-1 w-full border-gray-300"
                  data-placeholder="DD/MM/AAAA"
                />
              </div>
            </div>
            <div className="flex gap-5 mb-5 md:mb-7 w-full">
              <div className="w-full">
                <label
                  htmlFor="input-adultos"
                  className="block md:text-md font-medium tracking-wide dark:text-white"
                >
                  Adultos
                </label>
                <input
                  min="1"
                  required
                  {...register('adultos')}
                  type="number"
                  id="input-adultos"
                  placeholder="Número de adultos"
                  className="shadow-xs border-b-2 focus:outline-0  md:text-lg focus:border-yellow-500 py-1 w-full border-gray-300"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="input-criancas"
                  className="block md:text-md font-medium tracking-wide dark:text-white"
                >
                  Crianças
                </label>
                <input
                  min="0"
                  {...register('criancas')}
                  type="number"
                  id="input-criancas"
                  placeholder="Número de crianças"
                  className="shadow-xs border-b-2 focus:outline-0  md:text-lg focus:border-yellow-500 py-1 w-full border-gray-300"
                />
              </div>
            </div>
            <div className="w-full mb-5 md:mb-7">
              <label
                htmlFor="select-chale"
                className="block md:text-md font-medium tracking-wide dark:text-white"
              >
                Chalé
              </label>
              <select
                defaultValue=""
                {...register('chale')}
                className="shadow-xs border-b-2 focus:outline-0 md:text-lg focus:border-yellow-500 py-1 w-full border-gray-300"
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                {chales.data.map((chale) => (
                  <option key={chale.id} value={chale.nome}>
                    {chale.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full mb-5 md:mb-7">
              <label
                htmlFor="input-pets"
                className="block md:text-md font-medium tracking-wide dark:text-white"
              >
                Pets
              </label>
              <input
                {...register('pets')}
                type="number"
                id="input-pets"
                min="0"
                className="shadow-xs border-b-2 focus:outline-0  md:text-lg focus:border-yellow-500 py-1 w-full border-gray-300"
                placeholder="Número de pets"
              />
            </div>
            <div className="flex items-center justify-end gap-5">
              <a
                href="https://api.whatsapp.com/send?phone=5512996148154&text=Ola, vim pelo site da pousada e gostaria de fazer uma reserva"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-md font-medium rounded-lg border border-gray-500 text-gray-500 hover:border-yellow-500 hover:text-yellow-500 focus:outline-hidden focus:border-yellow-500 focus:text-yellow-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hover:border-neutral-300"
              >
                Pular formulário
              </a>
              <button
                type="submit"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-md font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-hidden focus:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none"
              >
                Reservar
              </button>
            </div>
          </form>
        </div>
        <div className="w-full hidden md:block">
          <picture>
            <source
              media="(max-width: 64rem)"
              srcSet="/assets/pousada/geral/refugio-1.webp"
            />
            <img
              className="h-full object-cover object-center lg:aspect-square rounded-xl"
              src="/assets/pousada/bergolado/refugio-3.webp"
              alt=""
            />
          </picture>
        </div>
      </div>
    </section>
  );
}

export default ContainerForm;
