import IChale from '@/interfaces/IChale';

interface Props {
  chale: IChale;
}

function Info({ chale }: Props) {
  return (
    <section className="px-4 lg:w-3/5 my-5 mx-auto pb-5">
      <h2 className="block text-2xl font-bold text-gray-800 mb-5 lg:leading-tight dark:text-white">
        O que esse lugar oferece
      </h2>
      <div className="block md:hidden">
        <div className="infocelularInicio grid gap-3">
          <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
            <svg
              className="inline my-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="24"
              height="24"
              strokeWidth="2"
            >
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
              <path d="M15 19l2 2l4 -4"></path>
            </svg>
            <span className="font-semibold">Capacidade: </span>
            {chale.capacidade}
          </p>
          <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
            <svg
              className="inline my-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="24"
              height="24"
              strokeWidth="2"
            >
              <path d="M5 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
              <path d="M10 13h11v-2a3 3 0 0 0 -3 -3h-8v5z"></path>
              <path d="M3 16h18"></path>
            </svg>
            <span className="font-semibold">
              Cama{chale.camas.quantidade === 1 ? '' : 's'}:
            </span>
            {chale.camas.quantidade} {chale.camas.tipo}
          </p>
          <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
            <svg
              className="inline my-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="24"
              height="24"
              strokeWidth="2"
            >
              <path d="M6 10m-3 0a3 7 0 1 0 6 0a3 7 0 1 0 -6 0"></path>
              <path d="M21 10c0 -3.866 -1.343 -7 -3 -7"></path>
              <path d="M6 3h12"></path>
              <path d="M21 10v10l-3 -1l-3 2l-3 -3l-3 2v-10"></path>
              <path d="M6 10h.01"></path>
            </svg>
            <span className="font-semibold">Banheiros: </span>
            {chale.banheiros} banheiros
          </p>
          <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
            <svg
              className="inline my-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="24"
              height="24"
              strokeWidth="2"
            >
              <path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-7a1 1 0 0 0 -1 1v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1"></path>
              <path d="M4 8l2 0"></path>
              <path d="M4 12l3 0"></path>
              <path d="M4 16l2 0"></path>
              <path d="M8 4l0 2"></path>
              <path d="M12 4l0 3"></path>
              <path d="M16 4l0 2"></path>
            </svg>
            <span className="font-semibold">Tamanho: </span>
            {chale.tamanho}
          </p>
        </div>
        <div
          id="hs-show-hide-collapse-heading"
          className="hs-collapse mt-5 hidden w-full overflow-hidden transition-[height] duration-300"
          aria-labelledby="hs-show-hide-collapse"
        >
          <div className="infocelularFim grid gap-5">
            <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
              <svg
                className="inline my-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
                strokeWidth="2"
              >
                <path d="M14 12v.01"></path>
                <path d="M3 21h18"></path>
                <path d="M6 21v-16a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v16"></path>
              </svg>
              <span className="font-semibold">Ambientes: </span>
              {chale.ambientes.join(', ')}
            </p>
            <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
              <svg
                className="inline my-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
                strokeWidth="2"
              >
                <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                <path d="M16 3l-4 4l-4 -4"></path>
                <path d="M15 7v13"></path>
                <path d="M18 15v.01"></path>
                <path d="M18 12v.01"></path>
              </svg>
              <span className="font-semibold">Comodidades: </span>
              {chale.comodidades.join(', ')}
            </p>
            <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
              <svg
                className="inline my-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
                strokeWidth="2"
              >
                <path d="M12 3l4 4l-2 1l4 4l-3 1l4 4h-14l4 -4l-3 -1l4 -4l-2 -1z"></path>
                <path d="M14 17v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-3"></path>
              </svg>
              <span className="font-semibold">Área Externa: </span>
              {chale.area_externa.join(', ')}
            </p>
            <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
              <svg
                className="inline my-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
                strokeWidth="2"
              >
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                <path d="M9 10l.01 0"></path>
                <path d="M15 10l.01 0"></path>
                <path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
                <path d="M12 3a2 2 0 0 0 0 4"></path>
              </svg>
              <span className="font-semibold">Idade Mínima: </span>
              {chale.politica.idade_minima} anos
            </p>
            <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
              <svg
                className="inline my-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
                strokeWidth="2"
              >
                <path d="M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.835 -3.454 -3.538z"></path>
                <path d="M20.188 8.082a1.039 1.039 0 0 0 -.406 -.082h-.015c-.735 .012 -1.56 .75 -1.993 1.866c-.519 1.335 -.28 2.7 .538 3.052c.129 .055 .267 .082 .406 .082c.739 0 1.575 -.742 2.011 -1.866c.516 -1.335 .273 -2.7 -.54 -3.052z"></path>
                <path d="M9.474 9c.055 0 .109 0 .163 -.011c.944 -.128 1.533 -1.346 1.32 -2.722c-.203 -1.297 -1.047 -2.267 -1.932 -2.267c-.055 0 -.109 0 -.163 .011c-.944 .128 -1.533 1.346 -1.32 2.722c.204 1.293 1.048 2.267 1.933 2.267z"></path>
                <path d="M16.456 6.733c.214 -1.376 -.375 -2.594 -1.32 -2.722a1.164 1.164 0 0 0 -.162 -.011c-.885 0 -1.728 .97 -1.93 2.267c-.214 1.376 .375 2.594 1.32 2.722c.054 .007 .108 .011 .162 .011c.885 0 1.73 -.974 1.93 -2.267z"></path>
                <path d="M5.69 12.918c.816 -.352 1.054 -1.719 .536 -3.052c-.436 -1.124 -1.271 -1.866 -2.009 -1.866c-.14 0 -.277 .027 -.407 .082c-.816 .352 -1.054 1.719 -.536 3.052c.436 1.124 1.271 1.866 2.009 1.866c.14 0 .277 -.027 .407 -.082z"></path>
              </svg>
              <span className="font-semibold">Pets: </span>
              {chale.politica.pets_permitidos ? 'Permitidos' : 'Não permitidos'}
            </p>
            <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
              <svg
                className="inline my-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                width="24"
                height="24"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="currentColor"
              >
                <path d="M12 18l.01 0"></path>
                <path d="M9.172 15.172a4 4 0 0 1 5.656 0"></path>
                <path d="M6.343 12.343a8 8 0 0 1 11.314 0"></path>
                <path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0"></path>
              </svg>
              <span className="font-semibold">Wifi: </span>
              Gratuito
            </p>
            <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
              <svg
                className="inline my-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
                strokeWidth="2"
              >
                <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1"></path>
                <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"></path>
                <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"></path>
                <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z"></path>
                <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555"></path>
              </svg>
              <span className="font-semibold">Café da manhã: </span>
              Incluso
            </p>
            <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
              <svg
                className="inline my-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
                strokeWidth="2"
              >
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"></path>
              </svg>
              <span className="font-semibold">Estacionamento: </span>
              Privativo
            </p>
          </div>
        </div>
        <p className="mt-2">
          <button
            type="button"
            className="hs-collapse-toggle inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-yellow-500 decoration-2 hover:text-yellow-600 hover:underline focus:outline-hidden focus:underline focus:text-yellow-600 disabled:opacity-50 disabled:pointer-events-none dark:text-yellow-400 dark:hover:text-yellow-500 dark:focus:text-yellow-500"
            id="hs-show-hide-collapse"
            aria-expanded="false"
            aria-controls="hs-show-hide-collapse-heading"
            data-hs-collapse="#hs-show-hide-collapse-heading"
          >
            <span className="hs-collapse-open:hidden">Read more</span>
            <span className="hs-collapse-open:block hidden">Read less</span>
            <svg
              className="hs-collapse-open:rotate-180 shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </button>
        </p>
      </div>
      <div
        id="infoChale"
        className="gap-5 hidden md:grid md:grid-cols-2 grid-flow-row"
      >
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
            <path d="M15 19l2 2l4 -4"></path>
          </svg>
          <span className="font-semibold">Capacidade: </span>
          {chale.capacidade}
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M5 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
            <path d="M10 13h11v-2a3 3 0 0 0 -3 -3h-8v5z"></path>
            <path d="M3 16h18"></path>
          </svg>
          <span className="font-semibold">
            Cama{chale.camas.quantidade === 1 ? '' : 's'}:
          </span>
          {chale.camas.quantidade} {chale.camas.tipo}
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M6 10m-3 0a3 7 0 1 0 6 0a3 7 0 1 0 -6 0"></path>
            <path d="M21 10c0 -3.866 -1.343 -7 -3 -7"></path>
            <path d="M6 3h12"></path>
            <path d="M21 10v10l-3 -1l-3 2l-3 -3l-3 2v-10"></path>
            <path d="M6 10h.01"></path>
          </svg>
          <span className="font-semibold">Banheiros: </span>
          {chale.banheiros}
          {chale.banheiros > 1 ? ' banheiros' : ' banheiro'}
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-7a1 1 0 0 0 -1 1v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1"></path>
            <path d="M4 8l2 0"></path>
            <path d="M4 12l3 0"></path>
            <path d="M4 16l2 0"></path>
            <path d="M8 4l0 2"></path>
            <path d="M12 4l0 3"></path>
            <path d="M16 4l0 2"></path>
          </svg>
          <span className="font-semibold">Tamanho: </span>
          {chale.tamanho}
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M14 12v.01"></path>
            <path d="M3 21h18"></path>
            <path d="M6 21v-16a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v16"></path>
          </svg>
          <span className="font-semibold">Ambientes: </span>
          {chale.ambientes.join(', ')}
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
            <path d="M16 3l-4 4l-4 -4"></path>
            <path d="M15 7v13"></path>
            <path d="M18 15v.01"></path>
            <path d="M18 12v.01"></path>
          </svg>
          <span className="font-semibold">Comodidades: </span>
          {chale.comodidades.join(', ')}
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M12 3l4 4l-2 1l4 4l-3 1l4 4h-14l4 -4l-3 -1l4 -4l-2 -1z"></path>
            <path d="M14 17v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-3"></path>
          </svg>
          <span className="font-semibold">Área Externa: </span>
          {chale.area_externa.join(', ')}
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M9 10l.01 0"></path>
            <path d="M15 10l.01 0"></path>
            <path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
            <path d="M12 3a2 2 0 0 0 0 4"></path>
          </svg>
          <span className="font-semibold">Idade Mínima: </span>
          {chale.politica.idade_minima} anos
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.835 -3.454 -3.538z"></path>
            <path d="M20.188 8.082a1.039 1.039 0 0 0 -.406 -.082h-.015c-.735 .012 -1.56 .75 -1.993 1.866c-.519 1.335 -.28 2.7 .538 3.052c.129 .055 .267 .082 .406 .082c.739 0 1.575 -.742 2.011 -1.866c.516 -1.335 .273 -2.7 -.54 -3.052z"></path>
            <path d="M9.474 9c.055 0 .109 0 .163 -.011c.944 -.128 1.533 -1.346 1.32 -2.722c-.203 -1.297 -1.047 -2.267 -1.932 -2.267c-.055 0 -.109 0 -.163 .011c-.944 .128 -1.533 1.346 -1.32 2.722c.204 1.293 1.048 2.267 1.933 2.267z"></path>
            <path d="M16.456 6.733c.214 -1.376 -.375 -2.594 -1.32 -2.722a1.164 1.164 0 0 0 -.162 -.011c-.885 0 -1.728 .97 -1.93 2.267c-.214 1.376 .375 2.594 1.32 2.722c.054 .007 .108 .011 .162 .011c.885 0 1.73 -.974 1.93 -2.267z"></path>
            <path d="M5.69 12.918c.816 -.352 1.054 -1.719 .536 -3.052c-.436 -1.124 -1.271 -1.866 -2.009 -1.866c-.14 0 -.277 .027 -.407 .082c-.816 .352 -1.054 1.719 -.536 3.052c.436 1.124 1.271 1.866 2.009 1.866c.14 0 .277 -.027 .407 -.082z"></path>
          </svg>
          <span className="font-semibold">Pets: </span>
          {chale.politica.pets_permitidos ? 'Permitidos' : 'Não permitidos'}
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            width="24"
            height="24"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            stroke="currentColor"
          >
            <path d="M12 18l.01 0"></path>
            <path d="M9.172 15.172a4 4 0 0 1 5.656 0"></path>
            <path d="M6.343 12.343a8 8 0 0 1 11.314 0"></path>
            <path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0"></path>
          </svg>
          <span className="font-semibold">Wifi: </span>
          Gratuito
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1"></path>
            <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"></path>
            <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"></path>
            <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z"></path>
            <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555"></path>
          </svg>
          <span className="font-semibold">Café da manhã: </span>
          Incluso
        </p>
        <p className="flex gap-1 items-center text-gray-500 dark:text-neutral-40 dark:text-gray-300">
          <svg
            className="inline my-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
            strokeWidth="2"
          >
            <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
            <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
            <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"></path>
          </svg>
          <span className="font-semibold">Estacionamento: </span>
          Privativo
        </p>
      </div>
    </section>
  );
}

export default Info;
