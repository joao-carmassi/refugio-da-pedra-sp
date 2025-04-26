import IChale from '@/interfaces/IChale';
import Link from 'next/link';

interface Props {
  chale: IChale;
}

function CardChale({ chale }: Props) {
  return (
    <li>
      <div className="flex flex-col bg-white border border-gray-200 shadow-2xl dark:shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
        <div
          data-hs-carousel='{
"isInfiniteLoop": true,
"loadingClasses": "opacity-0",
"dotsItemClasses": "hs-carousel-active:bg-yellow-500 hs-carousel-active:border-yellow-500 size-3 border border-gray-400 rounded-full cursor-pointer dark:border-neutral-600 dark:hs-carousel-active:bg-yellow-500 dark:hs-carousel-active:border-yellow-500"
}'
          className="relative"
        >
          <div className="hs-carousel relative overflow-hidden w-full min-h-72 bg-white rounded-lg rounded-b-none">
            <div className="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
              {chale.fotos_carrosel.map((foto) => (
                <div key={foto} className="hs-carousel-slide">
                  <div className="flex justify-center h-full bg-gray-100 dark:bg-neutral-900">
                    <img
                      className="w-full object-cover object-center"
                      src={`/assets/chales/${chale.id}/refugio-${foto}.webp`}
                      alt=""
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="hs-carousel-prev hs-carousel-disabled:opacity-50 hs-carousel-disabled:cursor-default absolute top-1/2 start-2 inline-flex justify-center items-center size-10 bg-white border border-gray-100 text-gray-800 rounded-full shadow-2xs hover:bg-gray-100 -translate-y-1/2 focus:outline-hidden"
          >
            <span className="text-2xl" aria-hidden="true">
              <svg
                className="shrink-0 size-5"
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
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </span>
            <span className="sr-only">Previous</span>
          </button>
          <button
            type="button"
            className="hs-carousel-next hs-carousel-disabled:opacity-50 hs-carousel-disabled:cursor-default absolute top-1/2 end-2 inline-flex justify-center items-center size-10 bg-white border border-gray-100 text-gray-800 rounded-full shadow-2xs hover:bg-gray-100 -translate-y-1/2 focus:outline-hidden"
          >
            <span className="sr-only">Next</span>
            <span className="text-2xl" aria-hidden="true">
              <svg
                className="shrink-0 size-5"
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
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </span>
          </button>
          <div className="hs-carousel-pagination flex justify-center absolute bottom-3 start-0 end-0 gap-x-2"></div>
        </div>
        <div id="cabana" className="containerInfoChale p-4 md:p-5">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {chale.nome}
          </h2>
          <p className="mt-1 flex items-center gap-1 text-gray-500 dark:text-neutral-400">
            <svg
              className="inline "
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
            <span className="font-semibold flex-row ">Capacidade:</span>{' '}
            {chale.capacidade}
          </p>
          <p className="mt-1 flex items-center gap-1 text-gray-500 dark:text-neutral-400">
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
              Cama{Number(chale.camas) === 1 ? '' : 's'}
            </span>
            : {chale.camas}
          </p>
          <p className="mt-1 flex items-center gap-1 text-gray-500 dark:text-neutral-400">
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
            <span className="font-semibold">
              Banheiro{Number(chale.banheiros) === 1 ? '' : 's'}:
            </span>{' '}
            {chale.banheiros}
          </p>
          <p className="mt-1 flex items-center gap-1 text-gray-500 dark:text-neutral-400">
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
            <span className="font-semibold">Pet:</span>{' '}
            {chale.politica.pets_permitidos ? 'Aceitamos' : 'Não Aceitamos'}
          </p>
          <Link
            className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-hidden focus:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none w-full"
            href={`/chale/${chale.id}`}
          >
            Ver mais
          </Link>
        </div>
      </div>
    </li>
  );
}

export default CardChale;
